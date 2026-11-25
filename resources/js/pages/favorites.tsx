import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Spinner } from '@/components/ui/spinner';
import { ArrowLeft, Camera, Heart, MapPin, AlertCircle } from 'lucide-react';

type ListingImage = {
    id: number;
    listing_id?: number;
    image_path: string;
};

type Listing = {
    id: number;
    user_id: number;
    title: string;
    brand: string;
    model: string;
    category: string;
    pickup_location?: string;
    price_per_day: string | number;
    status: 'available' | 'unavailable';
    archived_at?: string | null;
    images: ListingImage[];
};

type Favorite = {
    id: number;
    user_id: number;
    listing_id: number;
    listing: Listing;
};

type Props = {
    favorites: Favorite[];
};

export default function FavoritesPage({ favorites }: Props) {
    const [removingId, setRemovingId] = useState<number | null>(null);

    function handleUnfavorite(listingId: number) {
        if (removingId !== null) return;
        setRemovingId(listingId);
        router.delete(`/listings/${listingId}/favorite`, {
            preserveScroll: true,
            onFinish: () => {
                setRemovingId(null);
            },
        });
    }

    return (
        <>
            <Head title="Favorites - LetMeSee" />

            <header className="sticky top-0 z-10 border-b border-border bg-background/95 backdrop-blur">
                <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
                    <Link
                        href="/"
                        className="text-xl font-bold tracking-tight text-foreground">
                        LetMeSee
                    </Link>
                </div>
            </header>

            <main className="mx-auto max-w-6xl px-4 py-8">
                <div className="mb-6">
                    <Button
                        asChild
                        variant="outline"
                        size="sm"
                        className="gap-2">
                        <Link href="/">
                            <ArrowLeft className="size-4" />
                            Back to Browse
                        </Link>
                    </Button>
                </div>

                <div className="space-y-8">
                    <Heading
                        title="Favorites"
                        description="Camera equipment you have saved for quick access."
                    />

                    <div>
                        <h2 className="mb-4 text-lg font-semibold text-foreground">
                            Saved Equipment ({favorites.length})
                        </h2>

                        {favorites.length === 0 ? (
                            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed px-6 py-16 text-center">
                                <Heart className="mb-4 size-12 text-muted-foreground opacity-30" />

                                <h3 className="text-lg font-semibold text-foreground">
                                    No favorites yet
                                </h3>

                                <p className="mt-2 max-w-md text-sm text-muted-foreground">
                                    Browse cameras and equipment, and click the favorite button on any listing to save it here.
                                </p>

                                <Button asChild className="mt-6">
                                    <Link href="/">Browse Equipment</Link>
                                </Button>
                            </div>
                        ) : (
                            <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
                                {favorites.map(
                                    ({ id: favoriteId, listing }) => {
                                        const isArchived = Boolean(listing.archived_at,);
                                        const isUnavailable = isArchived || listing.status === 'unavailable';
                                        const CardContent = (
                                            <div className="relative overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-shadow hover:shadow-md">
                                                <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted">
                                                    {listing.images &&
                                                        listing.images.length >
                                                        0 ? (
                                                        <img
                                                            src={`/storage/${listing.images[0].image_path}`}
                                                            alt={listing.title}
                                                            className={`size-full object-cover ${isArchived ? 'grayscale-[35%]' : ''}`}
                                                        />
                                                    ) : (
                                                        <div className="flex size-full items-center justify-center">
                                                            <Camera className="size-12 text-muted-foreground/40" />
                                                        </div>
                                                    )}

                                                    <div className="absolute top-2.5 right-2.5 flex flex-col items-end gap-1.5">
                                                        {isUnavailable ? (
                                                            <Badge
                                                                variant="secondary"
                                                                className="bg-background/95 font-medium text-amber-700 shadow-xs backdrop-blur dark:text-amber-400">
                                                                Unavailable For Rent
                                                            </Badge>
                                                        ) : (
                                                            <Badge className="bg-emerald-600 font-medium text-white shadow-xs hover:bg-emerald-600">
                                                                Available for Rent
                                                            </Badge>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="space-y-2 p-4">
                                                    <span className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                                                        {listing.category}
                                                    </span>

                                                    <h3 className="line-clamp-1 leading-tight font-semibold text-foreground">
                                                        {listing.title}
                                                    </h3>

                                                    <p className="text-sm text-muted-foreground">
                                                        {listing.brand}{' '} {listing.model}
                                                    </p>

                                                    {listing.pickup_location && (
                                                        <p className="flex items-center gap-1 text-xs text-muted-foreground">
                                                            <MapPin className="size-3.5 shrink-0" />
                                                            <span className="truncate">
                                                                {listing.pickup_location}
                                                            </span>
                                                        </p>
                                                    )}

                                                    <p className="pt-1 text-base font-bold text-foreground">
                                                        ₱ {Number(listing.price_per_day,).toLocaleString('en-PH',)}
                                                        <span className="text-sm font-normal text-muted-foreground">
                                                            {' '} / day
                                                        </span>
                                                    </p>

                                                    {isArchived && (
                                                        <div className="flex items-center gap-1.5 pt-1 text-xs text-muted-foreground">
                                                            <AlertCircle className="size-3.5 shrink-0 text-muted-foreground" />
                                                            <span>
                                                                This item may not be up for rent anymore. We recommend reaching out to the owner.
                                                            </span>
                                                        </div>
                                                    )}

                                                    <div className="border-t border-border pt-3">
                                                        <Button
                                                            type="button"
                                                            variant="outline"
                                                            size="sm"
                                                            disabled={removingId === listing.id}
                                                            onClick={(e) => {
                                                                e.preventDefault();
                                                                e.stopPropagation();
                                                                handleUnfavorite(
                                                                    listing.id,
                                                                );
                                                            }}
                                                            className="w-full text-red-600 hover:cursor-pointer hover:bg-red-50 hover:text-red-700 dark:text-red-400 dark:hover:bg-red-950/20">
                                                            {removingId ===
                                                                listing.id ? (
                                                                <>
                                                                    <Spinner className="mr-1.5 size-3.5" />
                                                                    Removing…
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <Heart className="mr-1.5 size-3.5 fill-red-500 text-red-500" />
                                                                    Remove from Favorites
                                                                </>
                                                            )}
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        );

                                        return (
                                            <div key={favoriteId}>
                                                {isArchived ? (
                                                    CardContent
                                                ) : (
                                                    <Link
                                                        href={`/listings/${listing.id}`}
                                                        className="block focus:outline-none">
                                                        {CardContent}
                                                    </Link>
                                                )}
                                            </div>
                                        );
                                    },
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </>
    );
}