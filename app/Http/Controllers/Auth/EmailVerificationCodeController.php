<?php

namespace App\Http\Controllers\Auth;
use Illuminate\Support\Facades\RateLimiter;
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
            'status' => $request->session()->get('status'),
        ]);
    }

    public function store(Request $request): RedirectResponse{
        $request->validate([
            'code' => ['required', 'digits:6'],
        ]);

        $userId = $request->session()->get('pending_email_verification');
        $user = $userId ? User::find($userId) : null;

        if (!$user) {
            return redirect()->route('register')
                ->withErrors(['code' => 'Your verification session has expired. Please register again.',]);
        }

        if ($user->hasVerifiedEmail()) {
            $request->session()->forget('pending_email_verification');
            return redirect()->route('login');
        }

        if (!$user->email_verification_expires_at ||now()->greaterThan($user->email_verification_expires_at)) {
            return back()->withErrors([
                'code' => 'Your verification code has expired. Please request a new one.',
            ]);
        }

        $attemptKey = 'otp-verification:'.$user->id;

        if (RateLimiter::tooManyAttempts($attemptKey, 5)) {
            return back()->withErrors(['code' => 'Too many incorrect attempts. Please request a new code.',]);
        }

        if (!$user->email_verification_code ||!Hash::check($request->code, $user->email_verification_code)) {
            RateLimiter::hit($attemptKey, 600);
            return back()->withErrors([
                'code' => 'The verification code is incorrect.',
            ]);
        }
        RateLimiter::clear($attemptKey);

        $user->markEmailAsVerified();

        $user->forceFill([
            'email_verification_code' => null,
            'email_verification_expires_at' => null,
        ])->save();

        $request->session()->forget('pending_email_verification');
        return redirect()->route('login')->with('status', 'Your email has been verified. You can now log in.');
    }
    public function resend(Request $request): RedirectResponse{
        $userId = $request->session()->get('pending_email_verification');
        $user = $userId ? User::find($userId) : null;
        if (!$user) {
            return redirect()->route('register');
        }

        if ($user->hasVerifiedEmail()) {
            $request->session()->forget('pending_email_verification');
            return redirect()->route('login');
        }

        $minuteKey = 'otp-resend-minute:'.$user->id;
        $hourKey = 'otp-resend-hour:'.$user->id;

        if (RateLimiter::tooManyAttempts($minuteKey, 1)) {
            return back()->withErrors(['resend' => 'Please wait one minute before requesting another code.',]);
        }

        if (RateLimiter::tooManyAttempts($hourKey, 5)) {
            return back()->withErrors(['resend' => 'You have reached the resend limit. Please try again later.',]);
        }

        RateLimiter::hit($minuteKey, 60);
        RateLimiter::hit($hourKey, 3600);

        $code = (string) random_int(100000, 999999);

        $user->forceFill(['email_verification_code' => Hash::make($code),'email_verification_expires_at' => now()->addMinutes(10),])->save();
        $user->notify(new \App\Notifications\EmailVerificationCode($code));
        return back()->with('status', 'A new verification code has been sent to your email.');
    }
}