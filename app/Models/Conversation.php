<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

/**
 * @property int $id
 * @property int $listing_id
 * @property int $owner_id
 * @property int $renter_id
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 */
#[Fillable(['listing_id', 'owner_id', 'renter_id'])]
class Conversation extends Model
{
    public function listing(): BelongsTo
    {
        return $this->belongsTo(Listing::class);
    }

    public function owner(): BelongsTo
    {
        return $this->belongsTo(User::class, 'owner_id');
    }

    public function renter(): BelongsTo
    {
        return $this->belongsTo(User::class, 'renter_id');
    }

    public function messages(): HasMany
    {
        return $this->hasMany(Message::class);
    }

    public function latestMessage(): HasOne
    {
        return $this->hasOne(Message::class)->latestOfMany();
    }

    public function isParticipant(int $userId): bool
    {
        return $this->owner_id === $userId || $this->renter_id === $userId;
    }

    public function otherParticipant(User $user): User
    {
        return $user->id === $this->owner_id ? $this->renter : $this->owner;
    }

    public function isTwoWay(): bool
    {
        if ($this->relationLoaded('messages')) {
            $senders = $this->messages->pluck('sender_id')->unique();
            return $senders->contains($this->owner_id) && $senders->contains($this->renter_id);
        }

        return $this->messages()->where('sender_id', $this->owner_id)->exists()
            && $this->messages()->where('sender_id', $this->renter_id)->exists();
    }
}
