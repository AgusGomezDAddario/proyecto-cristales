<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use App\Support\Authorization\RoleCapabilities;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;

    // Usamos la PK por defecto 'id' (NO sobrescribir getAuthIdentifierName)
    // Si tu tabla se llama distinto a 'users', definí $table.
    // protected $table = 'users';

    protected $fillable = [
        'name',
        'password',
        'role_id',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'password' => 'hashed',
        ];
    }

    public function role()
    {
        return $this->belongsTo(Role::class, 'role_id','role_id');
    }

    public function roleName(): ?string
    {
        return $this->relationLoaded('role')
            ? $this->role?->descripcion
            : $this->role()->value('descripcion');
    }

    public function roleKey(): string
    {
        return RoleCapabilities::normalizeRoleName($this->roleName());
    }

    public function capabilities(): array
    {
        return RoleCapabilities::forRole($this->roleName());
    }

    public function hasCapability(string $capability): bool
    {
        return in_array($capability, $this->capabilities(), true);
    }
}
