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
    public function browse(): Response
{
    $listings = Listing::query()
        ->where('status', 'available')
        ->with('images')
        ->latest()
        ->get();

    return Inertia::render('browse', [
        'listings' => $listings,
    ]);
}
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

    public function show(Listing $listing): Response
    {
        $listing->load([
            'images',
            'user:id,name',
        ]);

        return Inertia::render('listings/show', [
            'listing' => $listing,
        ]);
    }

    public function edit(Request $request, Listing $listing): Response
    {
        abort_unless($listing->user_id === $request->user()->id, 403);

        $listing->load('images');

        return Inertia::render('listings/edit', [
            'listing' => $listing,
        ]);
    }
    
public function update(Request $request, Listing $listing): RedirectResponse{
    abort_unless($listing->user_id === $request->user()->id, 403);

    $validated = $request->validate([
        'title'               => ['required', 'string', 'max:255'],
        'brand'               => ['required', 'string', 'max:100'],
        'model'               => ['required', 'string', 'max:100'],
        'category'            => ['required', 'string', 'max:100'],
        'description'         => ['required', 'string', 'max:5000'],
        'condition'           => ['required', 'string', 'in:mint,excellent,good,fair,poor'],
        'price_per_day'       => ['required', 'numeric', 'gt:0', 'max:999999.99'],
        'status'              => ['required', 'string', 'in:available,unavailable'],
        'images'              => ['nullable', 'array', 'max:10'],
        'images.*'            => ['image', 'max:5120'],
        'removed_image_ids'   => ['nullable', 'array'],
        'removed_image_ids.*' => ['integer'],
    ]);

    $removedImageIds = $validated['removed_image_ids'] ?? [];
    $newImages = $request->file('images') ?? [];
    $currentImagesCount = $listing->images()->count();
    $removedCount = $listing->images()->whereIn('id', $removedImageIds)->count();
    $keptCount = $currentImagesCount - $removedCount;

    if ($keptCount + count($newImages) > 10) {
        throw \Illuminate\Validation\ValidationException::withMessages([
            'images' => 'The total number of images cannot exceed 10.',
        ]);
    }

    $newImagePaths = [];
    $imagesToDelete = [];

    try {
        foreach ($newImages as $image) {
            $path = $image->store('listings', 'public');

            if (!$path) {
                throw new \RuntimeException('Unable to store an uploaded image.');
            }

            $newImagePaths[] = $path;
        }

        DB::transaction(function () use (
            $validated,
            $listing,
            $removedImageIds,
            $newImagePaths,
            &$imagesToDelete
        ) {
            $listing->update([
                'title'         => $validated['title'],
                'brand'         => $validated['brand'],
                'model'         => $validated['model'],
                'category'      => $validated['category'],
                'description'   => $validated['description'],
                'condition'     => $validated['condition'],
                'price_per_day' => $validated['price_per_day'],
                'status'        => $validated['status'],
            ]);

            if (!empty($removedImageIds)) {
                $imagesToDelete = $listing->images()
                    ->whereIn('id', $removedImageIds)
                    ->get();

                foreach ($imagesToDelete as $image) {
                    $image->delete();
                }
            }

            foreach ($newImagePaths as $path) {
                ListingImage::create([
                    'listing_id' => $listing->id,
                    'image_path' => $path,
                ]);
            }
        });
    } catch (\Throwable $exception) {
        Storage::disk('public')->delete($newImagePaths);

        throw $exception;
    }

    foreach ($imagesToDelete as $image) {
        Storage::disk('public')->delete($image->image_path);
    }

    Inertia::flash('toast', [
        'type' => 'success',
        'message' => 'Listing updated successfully!',
    ]);

    return to_route('listings.index');
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
