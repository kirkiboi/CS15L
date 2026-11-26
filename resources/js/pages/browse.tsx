import { Head, Link, usePage, router } from '@inertiajs/react';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { login } from '@/routes';
import { Search, MapPin, Camera } from 'lucide-react';
// for the sidebar ni sya, reusing component via sheet
import { Sheet, SheetTrigger, SheetContent } from '@/components/ui/sheet';
// for avatar ni and icons sa sidebar, still reusing component via avatar
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
    Heart,
    CalendarDays,
    MessageCircle,
    Package,
    Archive,
    ClipboardList,
    UserRound,
    Settings,
    LogOut,
} from 'lucide-react';
// for modals, reused compoent
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
};

function ListingCard({ listing }: { listing: Listing }) {
    return (
        <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-shadow hover:shadow-md">
            {listing.images.length > 0 ? (
                <img
                    src={`/storage/${listing.images[0].image_path}`}
                    alt={listing.title}
                    className="aspect-[4/3] w-full object-cover"
                />
            ) : (
                <div className="flex aspect-[4/3] items-center justify-center bg-muted">
                    <Camera className="size-12 text-muted-foreground/40" />
                </div>
            )}

            <div className="space-y-1 p-4">
                <span className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                    {listing.category}
                </span>

                <h3 className="leading-tight font-semibold text-foreground">
                    {listing.title}
                </h3>

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

                <p className="pt-1 text-base font-bold text-foreground">
                    ₱{Number(listing.price_per_day).toLocaleString('en-PH')}
                    <span className="text-sm font-normal text-muted-foreground">
                        {' '}
                        / day
                    </span>
                </p>
            </div>
        </div>
    );
}
// sidebar component ni for reusable
function SidebarItem({
    icon,
    label,
    className,
    onClick,
}: {
    icon: React.ReactNode;
    label: string;
    className?: string;
    onClick?: () => void;
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={`flex w-full cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground ${className ?? ''}`}
        >
            <span className="size-5 [&>svg]:size-5">{icon}</span>
            {label}
        </button>
    );
}

export default function Browse({ listings }: Props) {
    const { auth } = usePage<{ auth: { user: { name: string } | null } }>()
        .props;
    const initials =
        auth.user?.name
            .trim()
            .split(/\s+/)
            .filter(Boolean)
            .slice(0, 2)
            .map((part) => part[0])
            .join('')
            .toUpperCase() ?? '';
    const [search, setSearch] = useState('');
    const [location, setLocation] = useState('');
    const filtered = listings.filter((listing) => {
        if (listing.archived_at) {
            return false;
        }

        const searchableText =
            `${listing.title} ${listing.brand} ${listing.model} ${listing.category}`.toLowerCase();
        const matchesKeyword =
            search.trim() === '' ||
            searchableText.includes(search.trim().toLowerCase());
        const matchesLocation =
            location.trim() === '' ||
            Boolean(
                listing.pickup_location &&
                listing.pickup_location
                    .toLowerCase()
                    .includes(location.trim().toLowerCase()),
            );

        return matchesKeyword && matchesLocation;
    });

    return (
        <>
            <Head />
            <header className="sticky top-0 z-10 border-b border-border bg-background/95 backdrop-blur">
                <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
                    {/* tangan nato nig logo diri puhon */}
                    <span className="text-xl font-bold tracking-tight text-foreground">
                        LetMeSee
                    </span>

                    <nav className="flex items-center gap-3">
                        {auth.user ? (
                            <Sheet>
                                <SheetTrigger asChild>
                                    <button
                                        type="button"
                                        className="flex items-center gap-3 rounded-full opacity-80 transition-opacity hover:cursor-pointer"
                                    >
                                        <Avatar className="size-9">
                                            <AvatarFallback className="bg-primary font-semibold text-primary-foreground">
                                                {initials}
                                            </AvatarFallback>
                                        </Avatar>

                                        <span className="text-sm font-medium text-foreground">
                                            {auth.user.name}
                                        </span>
                                    </button>
                                </SheetTrigger>

                                <SheetContent
                                    side="right"
                                    className="flex flex-col"
                                >
                                    <div className="flex items-center gap-3 border-b px-6 pt-8 pb-6">
                                        <Avatar className="size-12">
                                            <AvatarFallback className="bg-primary font-semibold text-primary-foreground">
                                                {initials}
                                            </AvatarFallback>
                                        </Avatar>

                                        <div className="min-w-0">
                                            <p className="font-semibold text-foreground">
                                                {auth.user.name}
                                            </p>
                                            <p className="truncate text-sm text-muted-foreground">
                                                {auth.user.email}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex-1 space-y-6 overflow-y-auto px-4 py-6">
                                        <div className="space-y-2">
                                            <p className="px-2 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                                                Discover
                                            </p>
                                            <SidebarItem
                                                icon={<Camera />}
                                                label="Browse Cameras"
                                            />
                                            <Link
                                                href="/favorites"
                                                className="block"
                                            >
                                                <SidebarItem
                                                    icon={<Heart />}
                                                    label="Favorites"
                                                />
                                            </Link>
                                        </div>

                                        <div className="space-y-2">
                                            <p className="px-2 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                                                Renting
                                            </p>
                                            <SidebarItem
                                                icon={<CalendarDays />}
                                                label="My Rentals"
                                            />
                                            <Link
                                                href="/messages"
                                                className="block"
                                            >
                                                <SidebarItem
                                                    icon={<MessageCircle />}
                                                    label="Messages"
                                                />
                                            </Link>
                                        </div>

                                        <div className="space-y-2">
                                            <p className="px-2 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                                                My Equipment
                                            </p>
                                            <Link
                                                href="/my-listings"
                                                className="block"
                                            >
                                                <SidebarItem
                                                    icon={<Package />}
                                                    label="My Listings"
                                                />
                                            </Link>
                                            <SidebarItem
                                                icon={<ClipboardList />}
                                                label="Rental Requests"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <p className="px-2 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                                                Account
                                            </p>
                                            <SidebarItem
                                                icon={<UserRound />}
                                                label="My Profile"
                                            />
                                            <SidebarItem
                                                icon={<Settings />}
                                                label="Settings"
                                            />
                                        </div>
                                    </div>

                                    <div className="border-t px-4 py-4">
                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <button
                                                    type="button"
                                                    className="flex w-full cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-destructive transition-colors hover:bg-destructive/10"
                                                >
                                                    <span className="size-5 [&>svg]:size-5">
                                                        <LogOut />
                                                    </span>
                                                    Log out
                                                </button>
                                            </AlertDialogTrigger>

                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>
                                                        Confirm logout
                                                    </AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                        Are you sure you want to
                                                        log out of your account?
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>

                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>
                                                        Cancel
                                                    </AlertDialogCancel>
                                                    <AlertDialogAction
                                                        className="bg-destructive text-white hover:bg-destructive/90"
                                                        onClick={() =>
                                                            router.post(
                                                                '/logout',
                                                            )
                                                        }
                                                    >
                                                        Confirm Log Out
                                                    </AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    </div>
                                </SheetContent>
                            </Sheet>
                        ) : (
                            <Link href={login().url}>
                                <Button
                                    className="hover:cursor-pointer"
                                    size="sm"
                                >
                                    Log In
                                </Button>
                            </Link>
                        )}
                    </nav>
                </div>
            </header>

            <main className="mx-auto max-w-6xl space-y-10 px-4 py-10">
                <section className="space-y-3 text-center">
                    <p className="mx-auto max-w-xl text-lg text-muted-foreground">
                        Browse cameras and equipment available for rent from
                        photographers near you.
                    </p>
                </section>

                <section className="mx-auto flex max-w-2xl flex-col gap-3 sm:flex-row">
                    <div className="relative flex-1">
                        <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            placeholder="Search cameras or equipment..."
                            className="pl-9"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <div className="relative flex-1">
                        <MapPin className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            placeholder="Location (e.g. Makati)"
                            className="pl-9"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                        />
                    </div>
                </section>

                <section>
                    <h2 className="mb-4 text-lg font-semibold text-foreground">
                        Available Listings
                        <span className="ml-2 text-sm font-normal text-muted-foreground">
                            ({filtered.length}{' '}
                            {filtered.length === 1 ? 'result' : 'results'})
                        </span>
                    </h2>

                    {filtered.length > 0 ? (
                        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
                            {filtered.map((listing) => (
                                <Link
                                    key={listing.id}
                                    href={`/listings/${listing.id}`}
                                    className="block focus:outline-none"
                                >
                                    <ListingCard listing={listing} />
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="py-16 text-center text-muted-foreground">
                            <Camera className="mx-auto mb-3 size-10 opacity-30" />
                            <p>No listings match your search.</p>
                        </div>
                    )}
                </section>
            </main>
        </>
    );
}
