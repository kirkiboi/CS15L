<?php

namespace App\Http\Controllers;

use App\Models\Listing;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class FavoriteController extends Controller
{
    public function index(Request $request): Response
    {
        $favorites = $request->user()
            ->favorites()
            ->with(['listing' => function ($query) {
                $query->with('images');
            }])
            ->latest()
            ->get()
            ->filter(fn ($favorite) => $favorite->listing !== null)
            ->values();

        return Inertia::render('favorites', [
            'favorites' => $favorites,
        ]);
    }

    public function store(Request $request, Listing $listing): RedirectResponse
    {
        if ($listing->user_id === $request->user()->id) {
            abort(403, 'You cannot favorite your own listing.');
        }

        $request->user()->favorites()->firstOrCreate([
            'listing_id' => $listing->id,
        ]);

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => 'Listing added to favorites!',
        ]);

        return back();
    }

    public function destroy(Request $request, Listing $listing): RedirectResponse
    {
        $request->user()->favorites()->where('listing_id', $listing->id)->delete();

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => 'Listing removed from favorites!',
        ]);

        return back();
    }
}
