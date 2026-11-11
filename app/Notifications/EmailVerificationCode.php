<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class EmailVerificationCode extends Notification
{
    use Queueable;

    public function __construct(
        public string $code
    ) {}

    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('Your LetMeSee verification code')
            ->greeting('Welcome to LetMeSee!')
            ->line('Thank you for creating your account.')
            ->line('Use the verification code below to verify your email address:')
            ->line($this->code)
            ->line('This code will expire in 10 minutes.')
            ->line('If you did not create this account, you can ignore this email.');
    }
}