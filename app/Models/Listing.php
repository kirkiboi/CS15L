<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * @property int $id
 * @property int $user_id
 * @property string $title
 * @property string $brand
 * @property string $model
 * @property string $category
 * @property string $description
 * @property string $condition
 * @property float $price_per_day
 * @property string $status
 */
#[Fillable(['user_id', 'title', 'brand', 'model', 'category', 'description', 'condition', 'price_per_day', 'status'])]
class Listing extends Model
{
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function images(): HasMany
    {
        return $this->hasMany(ListingImage::class);
    }
}
