<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RolTaller
{
    public function handle(Request $request, Closure $next): Response
    {
        if (! auth()->check() || (int) auth()->user()->role_id !== 3) {
            abort(403);
        }

        return $next($request);
    }
}
