<?php

namespace App\Http\Middleware;

use App\Support\Authorization\RoleCapabilities;
use Closure;
use Illuminate\Http\Request;

class IsAdmin
{
    public function handle(Request $request, Closure $next)
    {
        if ($request->user()?->hasCapability(RoleCapabilities::MANAGE_USERS)) {
            return $next($request);
        }

        abort(403, 'No autorizado');
    }
}
