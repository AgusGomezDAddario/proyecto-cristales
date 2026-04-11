<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureUserHasCapability
{
    public function handle(Request $request, Closure $next, string ...$capabilities): Response
    {
        $user = $request->user();

        if (! $user) {
            abort(403, 'No autorizado');
        }

        foreach ($capabilities as $capability) {
            if ($user->hasCapability($capability)) {
                return $next($request);
            }
        }

        abort(403, 'No autorizado');
    }
}
