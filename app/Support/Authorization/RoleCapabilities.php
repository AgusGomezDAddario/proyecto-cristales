<?php

namespace App\Support\Authorization;

use App\Models\User;
use Illuminate\Support\Arr;
use Illuminate\Support\Str;

class RoleCapabilities
{
    public const VIEW_DASHBOARD = 'dashboard.view';
    public const MANAGE_ADMIN_CATALOGS = 'admin.catalogs.manage';
    public const MANAGE_ORDERS = 'orders.manage';
    public const MANAGE_USERS = 'users.manage';
    public const VIEW_FINANCIAL_DASHBOARD = 'finance.dashboard.view';
    public const VIEW_FINANCIAL_METRICS = 'finance.metrics.view';
    public const VIEW_FINANCIAL_REPORTS = 'finance.reports.view';
    public const VIEW_FINANCIAL_MOVEMENTS = 'finance.movements.view';
    public const VIEW_FINANCIAL_AMOUNTS = 'finance.amounts.view';

    public static function normalizeRoleName(?string $roleName): string
    {
        return Str::of((string) $roleName)
            ->lower()
            ->ascii()
            ->replaceMatches('/[^a-z0-9]+/', '_')
            ->trim('_')
            ->value();
    }

    public static function forRole(?string $roleName): array
    {
        $key = self::normalizeRoleName($roleName);

        return Arr::wrap(config("permissions.roles.{$key}", []));
    }

    public static function all(): array
    {
        return array_keys(config('permissions.capabilities', []));
    }

    public static function userHas(User $user, string $capability): bool
    {
        return in_array($capability, $user->capabilities(), true);
    }
}
