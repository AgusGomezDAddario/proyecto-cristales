<?php

namespace App\Http\Requests\Auth;

use Illuminate\Auth\Events\Lockout;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class LoginRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name'     => ['required', 'string'],
            'password' => ['required', 'string'],
            'remember' => ['nullable', 'boolean'],
        ];
    }

    /**
     * Mensajes personalizados de validación.
     */
    public function messages(): array
    {
        return [
            'name.required'     => 'Debe ingresar su nombre de usuario.',
            'password.required' => 'Debe ingresar su contraseña.',
        ];
    }

    /**
     * Nombres amigables para los campos (opcional pero prolijo).
     */
    public function attributes(): array
    {
        return [
            'name' => 'nombre de usuario',
            'password' => 'contraseña',
        ];
    }

    public function authenticate(): void
    {
        $this->ensureIsNotRateLimited();

        $ok = Auth::guard('web')->attempt(
            [
                'name'     => (string) $this->input('name'),
                'password' => (string) $this->input('password'),
            ],
            (bool) $this->boolean('remember')
        );

        if (! $ok) {
            RateLimiter::hit($this->throttleKey());

            // Mensaje de credenciales inválidas
            throw ValidationException::withMessages([
                'name' => 'Usuario o contraseña incorrectos.',
            ]);
        }

        RateLimiter::clear($this->throttleKey());
    }

    protected function ensureIsNotRateLimited(): void
    {
        if (! RateLimiter::tooManyAttempts($this->throttleKey(), 5)) {
            return;
        }

        event(new Lockout($this));

        $seconds = RateLimiter::availableIn($this->throttleKey());

        throw ValidationException::withMessages([
            'name' => trans('auth.throttle', [
                'seconds' => $seconds,
                'minutes' => ceil($seconds / 60),
            ]),
        ]);
    }

    public function throttleKey(): string
    {
        return Str::transliterate(Str::lower((string) $this->input('name')).'|'.$this->ip());
    }
}
