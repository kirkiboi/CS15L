import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Spinner } from '@/components/ui/spinner';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Plus, Camera, Archive, RotateCcw, MapPin } from 'lucide-react';

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
    pickup_location: string;
    price_per_day: string | number;
    status: 'available' | 'unavailable';
    archived_at?: string | null;
    images: ListingImage[];
};

type Props = {
    listings: Listing[];
    activeCount?: number;
};

export default function ArchivedListings({ listings, activeCount = 0 }: Props) {
    const [restoringId, setRestoringId] = useState<number | null>(null);
    const [isRestoring, setIsRestoring] = useState(false);

    function handleRestore(id: number) {
        if (isRestoring) return;
        setIsRestoring(true);
        router.post(
            `/listings/${id}/restore`,
            {},
            {
                preserveScroll: true,
                onFinish: () => {
                    setIsRestoring(false);
                    setRestoringId(null);
                },
            },
        );
    }

    return (
        <>
            <Head title="Archived Listings" />

            <div className="mx-auto max-w-6xl px-4 py-10">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <Heading
                        title="Archived Listings"
                        description="View and restore camera equipment listings you have archived."
                    />

                    <Button asChild>
                        <Link href="/my-listings/create">
                            <Plus className="mr-2 size-4" />
                            Add Listing
                        </Link>
                    </Button>
                </div>

                <div className="mt-6 flex border-b border-border">
                    <Link
                        href="/my-listings"
                        className="border-b-2 border-transparent px-4 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                    >
                        Active Listings ({activeCount})
                    </Link>
                    <Link
                        href="/my-listings/archived"
                        className="border-b-2 border-primary px-4 py-2.5 text-sm font-semibold text-primary"
                    >
                        Archived ({listings.length})
                    </Link>
                </div>

                <div className="mt-8">
                    <h2 className="mb-4 text-lg font-semibold">
                        Archived Equipment ({listings.length})
                    </h2>

                    {listings.length === 0 ? (
                        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed px-6 py-16 text-center">
                            <Archive className="mb-4 size-12 text-muted-foreground" />

                            <h3 className="text-lg font-semibold">
                                No archived listings
                            </h3>

                            <p className="mt-2 max-w-md text-sm text-muted-foreground">
                                Listings you archive will appear here. All
                                details, photos, and settings will be preserved,
                                and you can restore them anytime.
                            </p>

                            <Button asChild variant="outline" className="mt-6">
                                <Link href="/my-listings">
                                    View Active Listings
                                </Link>
                            </Button>
                        </div>
                    ) : (
                        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                            {listings.map((listing) => (
                                <div
                                    key={listing.id}
                                    className="overflow-hidden rounded-xl border bg-card opacity-95 transition-opacity hover:opacity-100"
                                >
                                    <div className="relative">
                                        {listing.images.length > 0 ? (
                                            <img
                                                src={`/storage/${listing.images[0].image_path}`}
                                                alt={listing.title}
                                                className="h-48 w-full object-cover grayscale-[25%]"
                                            />
                                        ) : (
                                            <div className="flex h-48 items-center justify-center bg-muted">
                                                <Camera className="size-10 text-muted-foreground" />
                                            </div>
                                        )}
                                        <Badge
                                            variant="secondary"
                                            className="absolute top-3 right-3 gap-1 bg-background/90 font-medium backdrop-blur"
                                        >
                                            <Archive className="size-3" />
                                            Archived
                                        </Badge>
                                    </div>

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

                                        {listing.pickup_location && (
                                            <p className="flex items-center gap-1 text-xs text-muted-foreground">
                                                <MapPin className="size-3.5 shrink-0" />
                                                <span className="truncate">
                                                    {listing.pickup_location}
                                                </span>
                                            </p>
                                        )}

                                        <p className="font-semibold">
                                            ₱
                                            {Number(
                                                listing.price_per_day,
                                            ).toLocaleString('en-PH')}
                                            <span className="font-normal text-muted-foreground">
                                                {' '}
                                                / day
                                            </span>
                                        </p>

                                        <div className="border-t border-border pt-2">
                                            <AlertDialog
                                                open={
                                                    restoringId === listing.id
                                                }
                                                onOpenChange={(open) => {
                                                    if (!isRestoring) {
                                                        setRestoringId(
                                                            open
                                                                ? listing.id
                                                                : null,
                                                        );
                                                    }
                                                }}
                                            >
                                                <AlertDialogTrigger asChild>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        disabled={isRestoring}
                                                        className="w-full hover:cursor-pointer hover:bg-primary/10 hover:text-primary"
                                                    >
                                                        <RotateCcw className="mr-1.5 size-3.5" />
                                                        Restore Listing
                                                    </Button>
                                                </AlertDialogTrigger>
                                                <AlertDialogContent>
                                                    <AlertDialogHeader>
                                                        <AlertDialogTitle>
                                                            Restore Listing
                                                        </AlertDialogTitle>
                                                        <AlertDialogDescription>
                                                            Are you sure you
                                                            want to restore{' '}
                                                            <span className="font-semibold text-foreground">
                                                                "{listing.title}
                                                                "
                                                            </span>
                                                            ? This listing will
                                                            be returned to your
                                                            active listings and
                                                            made available for
                                                            rent based on its
                                                            saved status. All
                                                            equipment details
                                                            and photos are
                                                            preserved.
                                                        </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                        <AlertDialogCancel
                                                            disabled={
                                                                isRestoring
                                                            }
                                                        >
                                                            Cancel
                                                        </AlertDialogCancel>
                                                        <AlertDialogAction
                                                            disabled={
                                                                isRestoring
                                                            }
                                                            className="cursor-pointer bg-primary text-primary-foreground hover:bg-primary/90"
                                                            onClick={(e) => {
                                                                e.preventDefault();
                                                                handleRestore(
                                                                    listing.id,
                                                                );
                                                            }}
                                                        >
                                                            {isRestoring &&
                                                            restoringId ===
                                                                listing.id ? (
                                                                <>
                                                                    <Spinner className="mr-1.5" />
                                                                    Restoring…
                                                                </>
                                                            ) : (
                                                                'Restore Listing'
                                                            )}
                                                        </AlertDialogAction>
                                                    </AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>
                                        </div>
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
