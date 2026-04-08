<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Inertia\Response;

class AuthenticatedSessionController extends Controller
{
    /**
     * Show the login page.
     */
    public function create(Request $request): Response
    {
        return Inertia::render('auth/login', [
            'canResetPassword' => Route::has('password.request'),
            'status' => $request->session()->get('status'),
        ]);
    }

    /**
     * Handle an incoming authentication request.
     */
    public function store(LoginRequest $request): RedirectResponse
    {
        // Autentica por name/password (LoginRequest ya lo hace con guard 'web')
        $request->authenticate();

        // Fija la cookie de sesión
        $request->session()->regenerate();

        // LIMPIAR URL INTENDED para que si se loguea como taller no le muestre el panel adminsitrador
        $request->session()->forget('url.intended');

        // 🔹 Redirección rol taller
        if ($request->user()->role_id === 3) {
            return redirect()->route('taller.ots');
        }

        // Redirige a donde quería ir; fallback a 'ordenes'
        return redirect()->intended(route('ordenes.index', absolute: false) ?? '/ordenes');
    }

    /**
     * Para cerrar sesión
     */
    public function destroy(Request $request): RedirectResponse
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/');
    }
}
