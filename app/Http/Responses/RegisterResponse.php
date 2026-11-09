<?php

namespace App\Http\Responses;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Laravel\Fortify\Contracts\RegisterResponse as RegisterResponseContract;

class RegisterResponse implements RegisterResponseContract
{
    public function toResponse($request)
    {
        $user = $request->user();

        if (!$user) {
            return redirect()->route('register');
        }

        $request->session()->put('pending_email_verification', $user->id);
        Auth::guard(config('fortify.guard'))->logout();
        $request->session()->regenerate();
        return redirect()->route('verification.code');
    }
}