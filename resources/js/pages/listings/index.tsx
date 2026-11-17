
import { Head, Link } from '@inertiajs/react';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Plus, Camera } from 'lucide-react';

type ListingImage = {
    id: number;
    image_path: string;
};

type Listing = {
    id: number;
    title: string;
    brand: string;
    model: string;
    category: string;
    price_per_day: string | number;
    status: 'available' | 'unavailable';
    images: ListingImage[];
};

type Props = {
    listings: Listing[];
};

export default function MyListings({ listings }: Props) {
    return (
        <>
            <Head title="My Listings" />

            <div className="mx-auto max-w-6xl px-4 py-10">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <Heading
                        title="My Listings"
                        description="Manage the camera equipment you have listed for rent."
                    />

                    <Button asChild>
                        <Link href="/listings/create">
                            <Plus className="mr-2 size-4" />
                            Add Listing
                        </Link>
                    </Button>
                </div>

                <div className="mt-8">
                    <h2 className="mb-4 text-lg font-semibold">
                        Your Equipment ({listings.length})
                    </h2>

                    {listings.length === 0 ? (
                        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed px-6 py-16 text-center">
                            <Camera className="mb-4 size-12 text-muted-foreground" />

                            <h3 className="text-lg font-semibold">
                                You haven't listed any equipment yet
                            </h3>

                            <p className="mt-2 max-w-md text-sm text-muted-foreground">
                                Start earning by listing your camera or equipment
                                for rent.
                            </p>

                            <Button asChild className="mt-6">
                                <Link href="/listings/create">
                                    <Plus className="mr-2 size-4" />
                                    Add Your First Listing
                                </Link>
                            </Button>
                        </div>
                    ) : (
                        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                            {listings.map((listing) => (
                                <div
                                    key={listing.id}
                                    className="overflow-hidden rounded-xl border bg-card">
                                    {listing.images.length > 0 ? (
                                        <img
                                            src={`/storage/${listing.images[0].image_path}`}
                                            alt={listing.title}
                                            className="h-48 w-full object-cover"
                                        />
                                    ) : (
                                        <div className="flex h-48 items-center justify-center bg-muted">
                                            <Camera className="size-10 text-muted-foreground" />
                                        </div>
                                    )}

                                    <div className="space-y-2 p-4">
                                        <div className="flex items-start justify-between gap-2">
                                            <h3 className="font-semibold">
                                                {listing.title}
                                            </h3>

                                            <span className="shrink-0 rounded-full bg-muted px-2 py-1 text-xs capitalize">
                                                {listing.status}
                                            </span>
                                        </div>

                                        <p className="text-sm text-muted-foreground">
                                            {listing.brand} {listing.model}
                                        </p>

                                        <p className="font-semibold">
                                            ₱{Number(listing.price_per_day).toLocaleString('en-PH')}
                                            <span className="font-normal text-muted-foreground">
                                                {' '}/ day
                                            </span>
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}