<?php

namespace App\Http\Controllers;

use App\Models\Listing;
use App\Models\ListingImage;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class ListingController extends Controller
{
    public function index(Request $request): Response{
        $listings = Listing::query()
            ->where('user_id', $request->user()->id)
            ->with('images')
            ->latest()
            ->get();

        return Inertia::render('listings/index', [
            'listings' => $listings,
        ]);
    }
    public function create(): Response
    {
        return Inertia::render('listings/create');
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'title'         => ['required', 'string', 'max:255'],
            'brand'         => ['required', 'string', 'max:100'],
            'model'         => ['required', 'string', 'max:100'],
            'category'      => ['required', 'string', 'max:100'],
            'description'   => ['required', 'string', 'max:5000'],
            'condition'     => ['required', 'string', 'in:mint,excellent,good,fair,poor'],
            'price_per_day' => ['required', 'numeric', 'gt:0', 'max:999999.99'],
            'status'        => ['required', 'string', 'in:available,unavailable'],
            'images'        => ['nullable', 'array', 'max:10'],
            'images.*'      => ['image', 'max:5120'], // 5 MB per image
        ]);

        $storedPaths = [];

        DB::transaction(function () use ($validated, $request, &$storedPaths) {
            $listing = Listing::create([
                'user_id'       => $request->user()->id,
                'title'         => $validated['title'],
                'brand'         => $validated['brand'],
                'model'         => $validated['model'],
                'category'      => $validated['category'],
                'description'   => $validated['description'],
                'condition'     => $validated['condition'],
                'price_per_day' => $validated['price_per_day'],
                'status'        => $validated['status'],
            ]);

            if ($request->hasFile('images')) {
                foreach ($request->file('images') as $image) {
                    $path = $image->store('listings', 'public');
                    $storedPaths[] = $path;
                    ListingImage::create([
                        'listing_id' => $listing->id,
                        'image_path' => $path,
                    ]);
                }
            }
        });

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Listing created successfully!']);

        return to_route('home');
    }
}
