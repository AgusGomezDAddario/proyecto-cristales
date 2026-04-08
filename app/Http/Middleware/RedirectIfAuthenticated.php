<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RedirectIfAuthenticated
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        if (auth()->check()) {
            // 👷 Taller
            if (auth()->user()->role_id === 3) {
                return redirect()->route('taller.ots');
            }

            // 👤 Admin / Cajero
            return redirect()->route('dashboard');
        }

        return $next($request);
    }
}
