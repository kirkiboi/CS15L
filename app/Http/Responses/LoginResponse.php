<?php

namespace App\Http\Responses;

use Laravel\Fortify\Contracts\LoginResponse as LoginResponseContract;

class LoginResponse implements LoginResponseContract
{
    public function toResponse($request)
    {
        $user = $request->user();

        if ($user && !$user->hasVerifiedEmail()) {
            $request->session()->put('pending_email_verification', $user->id);
            return redirect()->route('verification.code');
        }

        return redirect()->intended(config('fortify.home'));
    }
}