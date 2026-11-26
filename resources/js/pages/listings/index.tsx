import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
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
import { Plus, Camera, Pencil, Archive } from 'lucide-react';

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
    archivedCount?: number;
};

export default function MyListings({ listings, archivedCount = 0 }: Props) {
    const [archivingId, setArchivingId] = useState<number | null>(null);
    const [isArchiving, setIsArchiving] = useState(false);

    function handleArchive(id: number) {
        if (isArchiving) return;
        setIsArchiving(true);
        router.post(
            `/listings/${id}/archive`,
            {},
            {
                preserveScroll: true,
                onFinish: () => {
                    setIsArchiving(false);
                    setArchivingId(null);
                },
            },
        );
    }

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
                        <Link href="/my-listings/create">
                            <Plus className="mr-2 size-4" />
                            Add Listing
                        </Link>
                    </Button>
                </div>

                <div className="mt-6 flex border-b border-border">
                    <Link
                        href="/my-listings"
                        className="border-b-2 border-primary px-4 py-2.5 text-sm font-semibold text-primary"
                    >
                        Active Listings ({listings.length})
                    </Link>
                    <Link
                        href="/my-listings/archived"
                        className="border-b-2 border-transparent px-4 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                    >
                        Archived {archivedCount > 0 ? `(${archivedCount})` : ''}
                    </Link>
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
                                Start earning by listing your camera or
                                equipment for rent.
                            </p>

                            <Button asChild className="mt-6">
                                <Link href="/my-listings/create">
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
                                    className="overflow-hidden rounded-xl border bg-card"
                                >
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
                                            ₱
                                            {Number(
                                                listing.price_per_day,
                                            ).toLocaleString('en-PH')}
                                            <span className="font-normal text-muted-foreground">
                                                {' '}
                                                / day
                                            </span>
                                        </p>

                                        <div className="flex items-center gap-2 border-t border-border pt-2">
                                            <Button
                                                asChild
                                                variant="outline"
                                                size="sm"
                                                className="flex-1 hover:cursor-pointer"
                                            >
                                                <Link
                                                    href={`/my-listings/${listing.id}/edit`}
                                                >
                                                    <Pencil className="mr-1.5 size-3.5" />
                                                    Edit
                                                </Link>
                                            </Button>

                                            <AlertDialog
                                                open={
                                                    archivingId === listing.id
                                                }
                                                onOpenChange={(open) => {
                                                    if (!isArchiving) {
                                                        setArchivingId(
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
                                                        disabled={isArchiving}
                                                        className="flex-1 text-muted-foreground hover:cursor-pointer hover:bg-muted hover:text-foreground"
                                                    >
                                                        <Archive className="mr-1.5 size-3.5" />
                                                        Archive
                                                    </Button>
                                                </AlertDialogTrigger>
                                                <AlertDialogContent>
                                                    <AlertDialogHeader>
                                                        <AlertDialogTitle>
                                                            Archive Listing
                                                        </AlertDialogTitle>
                                                        <AlertDialogDescription>
                                                            Are you sure you
                                                            want to archive{' '}
                                                            <span className="font-semibold text-foreground">
                                                                "{listing.title}
                                                                "
                                                            </span>
                                                            ? This listing will
                                                            be hidden from the
                                                            public browse page,
                                                            but all equipment
                                                            details and photos
                                                            will be safely
                                                            preserved. You can
                                                            restore it at any
                                                            time from your
                                                            Archived Listings.
                                                        </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                        <AlertDialogCancel
                                                            disabled={
                                                                isArchiving
                                                            }
                                                        >
                                                            Cancel
                                                        </AlertDialogCancel>
                                                        <AlertDialogAction
                                                            disabled={
                                                                isArchiving
                                                            }
                                                            className="cursor-pointer bg-primary text-primary-foreground hover:bg-primary/90"
                                                            onClick={(e) => {
                                                                e.preventDefault();
                                                                handleArchive(
                                                                    listing.id,
                                                                );
                                                            }}
                                                        >
                                                            {isArchiving &&
                                                            archivingId ===
                                                                listing.id ? (
                                                                <>
                                                                    <Spinner className="mr-1.5" />
                                                                    Archiving…
                                                                </>
                                                            ) : (
                                                                'Archive Listing'
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
