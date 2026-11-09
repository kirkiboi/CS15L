<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;

class EmailVerificationCodeController extends Controller
{
    public function create(Request $request): Response|RedirectResponse
    {
        $userId = $request->session()->get('pending_email_verification');

        if (!$userId) {
            return redirect()->route('register');
        }

        $user = User::find($userId);

        if (!$user || $user->hasVerifiedEmail()) {
            $request->session()->forget('pending_email_verification');
            return redirect()->route('login');
        }

        return Inertia::render('auth/verify-code', [
            'email' => $user->email,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'code' => ['required', 'digits:6'],
        ]);

        $userId = $request->session()->get('pending_email_verification');
        $user = $userId ? User::find($userId) : null;

        if (!$user) {
            return redirect()->route('register')
                ->withErrors(['code' => 'Your verification session has expired. Please register again.']);
        }

        if ($user->hasVerifiedEmail()) {
            $request->session()->forget('pending_email_verification');
            return redirect()->route('login');
        }

        if (!$user->email_verification_expires_at ||
            now()->greaterThan($user->email_verification_expires_at)) {
            return back()->withErrors([
                'code' => 'Your verification code has expired. Please request a new one.',
            ]);
        }

        if (!$user->email_verification_code ||
            !Hash::check($request->code, $user->email_verification_code)) {
            return back()->withErrors([
                'code' => 'The verification code is incorrect.',
            ]);
        }

        $user->markEmailAsVerified();

        $user->forceFill([
            'email_verification_code' => null,
            'email_verification_expires_at' => null,
        ])->save();

        $request->session()->forget('pending_email_verification');
        return redirect()->route('login')->with('status', 'Your email has been verified. You can now log in.');
    }
}