import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Camera, User, Tag, ShieldCheck } from 'lucide-react';

type ListingImage = {
    id: number;
    listing_id: number;
    image_path: string;
};

type Owner = {
    id: number;
    name: string;
};

type Listing = {
    id: number;
    user_id: number;
    title: string;
    brand: string;
    model: string;
    category: string;
    description: string;
    condition: string;
    price_per_day: string | number;
    status: 'available' | 'unavailable';
    images: ListingImage[];
    user: Owner;
};

type Props = {
    listing: Listing;
};

export default function ListingShow({ listing }: Props) {
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const formattedPrice = Number(listing.price_per_day).toLocaleString('en-PH',);
    const isAvailable = listing.status === 'available';

    return (
        <>
            <Head title={`${listing.title} - LetMeSee`} />

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

                <div className="grid gap-8 lg:grid-cols-12">
                    <div className="space-y-8 lg:col-span-7">
                        <div className="space-y-3">
                            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl border border-border bg-muted sm:aspect-[16/10]">
                                {listing.images && listing.images.length > 0 ? (
                                    <img
                                        src={`/storage/${listing.images[selectedImageIndex]?.image_path ?? listing.images[0].image_path}`}
                                        alt={listing.title}
                                        className="h-full w-full object-cover"
                                    />
                                ) : (
                                    <div className="flex h-full flex-col items-center justify-center gap-2 text-muted-foreground">
                                        <Camera className="size-16 opacity-40" />
                                        <p className="text-sm">
                                            No photos uploaded for this listing
                                        </p>
                                    </div>
                                )}
                            </div>

                            {listing.images && listing.images.length > 1 && (
                                <div className="flex gap-2 overflow-x-auto pb-1">
                                    {listing.images.map((img, index) => (
                                        <button
                                            key={img.id}
                                            type="button"
                                            onClick={() =>
                                                setSelectedImageIndex(index)
                                            }
                                            className={`relative size-20 shrink-0 overflow-hidden rounded-lg border-2 transition-all hover:opacity-90 ${selectedImageIndex === index ? 'border-primary ring-2 ring-primary/20' : 'border-border'
                                                }`}>
                                            <img
                                                src={`/storage/${img.image_path}`}
                                                alt={`${listing.title} thumbnail ${index + 1}`}
                                                className="h-full w-full object-cover"
                                            />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="space-y-3 rounded-xl border border-border bg-card p-6">
                            <h2 className="text-lg font-semibold text-foreground">
                                Description
                            </h2>
                            <p className="text-sm leading-relaxed whitespace-pre-line text-muted-foreground sm:text-base">
                                {listing.description}
                            </p>
                        </div>
                    </div>

                    <div className="space-y-6 lg:col-span-5">
                        <div className="space-y-3 rounded-xl border border-border bg-card p-6">
                            <div className="flex flex-wrap items-center gap-2">
                                <Badge
                                    variant="outline"
                                    className="gap-1 font-medium">
                                    <Tag className="size-3" />
                                    {listing.category}
                                </Badge>
                                <Badge
                                    variant={
                                        isAvailable ? 'default' : 'secondary'
                                    }
                                    className={isAvailable ? 'bg-emerald-600 text-white hover:bg-emerald-600' : ''
                                    }>
                                    {isAvailable
                                        ? 'Available for Rent'
                                        : 'Unavailable'}
                                </Badge>
                            </div>

                            <div>
                                <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                                    {listing.title}
                                </h1>
                                <p className="mt-1 text-base text-muted-foreground">
                                    {listing.brand} {listing.model}
                                </p>
                            </div>

                            <div className="mt-4 rounded-lg bg-muted/60 p-4">
                                <span className="text-xs font-medium tracking-wider text-muted-foreground uppercase">
                                    Daily Rental Rate
                                </span>
                                <div className="mt-1 flex items-baseline gap-1">
                                    <span className="text-3xl font-extrabold text-foreground">
                                        ₱{formattedPrice}
                                    </span>
                                    <span className="text-sm font-normal text-muted-foreground">
                                        / day
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4 rounded-xl border border-border bg-card p-6">
                            <h2 className="text-base font-semibold text-foreground">
                                Equipment Details
                            </h2>

                            <dl className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <dt className="text-xs font-medium text-muted-foreground uppercase">
                                        Brand
                                    </dt>
                                    <dd className="mt-1 font-medium text-foreground">
                                        {listing.brand}
                                    </dd>
                                </div>

                                <div>
                                    <dt className="text-xs font-medium text-muted-foreground uppercase">
                                        Model
                                    </dt>
                                    <dd className="mt-1 font-medium text-foreground">
                                        {listing.model}
                                    </dd>
                                </div>

                                <div>
                                    <dt className="text-xs font-medium text-muted-foreground uppercase">
                                        Category
                                    </dt>
                                    <dd className="mt-1 font-medium text-foreground">
                                        {listing.category}
                                    </dd>
                                </div>

                                <div>
                                    <dt className="text-xs font-medium text-muted-foreground uppercase">
                                        Condition
                                    </dt>
                                    <dd className="mt-1 flex items-center gap-1 font-medium text-foreground capitalize">
                                        <ShieldCheck className="size-3.5 text-muted-foreground" />
                                        {listing.condition}
                                    </dd>
                                </div>
                            </dl>
                        </div>

                        <div className="rounded-xl border border-border bg-card p-6">
                            <h2 className="text-base font-semibold text-foreground">
                                Owner Information
                            </h2>

                            <div className="mt-3 flex items-center gap-3">
                                <div className="flex size-11 items-center justify-center rounded-full bg-primary/10 text-primary">
                                    <User className="size-5" />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-xs tracking-wider text-muted-foreground uppercase">
                                        Owned by
                                    </p>
                                    <p className="truncate font-semibold text-foreground">
                                        {listing.user?.name ??
                                            'Community Member'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </>
    );
}
