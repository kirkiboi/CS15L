import { Head, Link, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { login } from '@/routes';
import { Search, MapPin, Camera } from 'lucide-react';

type Listing = {
    id: number;
    name: string;
    price: number;
    location: string;
    category: string;
};
// for the sidebar ni sya, reusing component via sheet
import {
    Sheet,
    SheetTrigger,
    SheetContent,
} from '@/components/ui/sheet';

const SAMPLE_LISTINGS: Listing[] = [
    { id: 1, name: 'Sony A7 IV', price: 800, location: 'Makati, Metro Manila', category: 'Mirrorless' },
    { id: 2, name: 'Canon EOS R5', price: 1200, location: 'Quezon City, Metro Manila', category: 'Mirrorless' },
    { id: 3, name: 'Nikon Z6 II', price: 750, location: 'Pasig, Metro Manila', category: 'Mirrorless' },
    { id: 4, name: 'Fujifilm X-T5', price: 650, location: 'Taguig, Metro Manila', category: 'Mirrorless' },
    { id: 5, name: 'DJI Ronin 4D', price: 2500, location: 'Cebu City, Cebu', category: 'Cinema' },
    { id: 6, name: 'Canon EOS 5D Mark IV', price: 900, location: 'Davao City, Davao', category: 'DSLR' },
];

function ListingCard({ listing }: { listing: Listing }) {
    return (
        <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden hover:shadow-md transition-shadow">
            <div className="bg-muted aspect-[4/3] flex items-center justify-center">
                <Camera className="size-12 text-muted-foreground/40" />
            </div>

            <div className="p-4 space-y-1">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    {listing.category}
                </span>
                <h3 className="font-semibold text-foreground leading-tight">{listing.name}</h3>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <MapPin className="size-3.5 shrink-0" />
                    <span>{listing.location}</span>
                </div>
                <p className="pt-1 text-base font-bold text-foreground">
                    ₱{listing.price.toLocaleString()}
                    <span className="text-sm font-normal text-muted-foreground"> / day</span>
                </p>
            </div>
        </div>
    );
}

export default function Browse() {
    const { auth } = usePage<{ auth: { user: { name: string } | null } }>().props;
    const initials = auth.user?.name.trim().split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]).join('').toUpperCase() ?? '';
    const [search, setSearch] = useState('');
    const [location, setLocation] = useState('');
    const filtered = SAMPLE_LISTINGS.filter((l) => {
        const matchName = l.name.toLowerCase().includes(search.toLowerCase());
        const matchLocation = l.location.toLowerCase().includes(location.toLowerCase());
        return matchName && matchLocation;
    });

    return (
        <>
            <Head/>
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
                                        className="flex items-center gap-3 rounded-full hover:cursor-pointer opacity-80 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                                        <div className="flex size-9 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                                            {initials}
                                        </div>
                                        <span className="text-sm font-medium text-foreground">
                                            {auth.user.name}
                                        </span>
                                    </button>
                                </SheetTrigger>

                                <SheetContent side="right">
                                   
                                </SheetContent>
                            </Sheet>
                        ) : (
                            <Link href={login().url}>
                                <Button
                                    className="hover:cursor-pointer"
                                    size="sm">
                                    Log in
                                </Button>
                            </Link>
                        )}
                    </nav>
                </div>
            </header>

            <main className="mx-auto max-w-6xl px-4 py-10 space-y-10">
                <section className="text-center space-y-3">
                    <p className="text-muted-foreground text-lg max-w-xl mx-auto">
                        Browse cameras and equipment available for rent from photographers near you.
                    </p>
                </section>

                <section className="flex flex-col sm:flex-row gap-3 max-w-2xl mx-auto">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                        <Input
                            placeholder="Search cameras or equipment..."
                            className="pl-9"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <div className="relative flex-1">
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                        <Input
                            placeholder="Location (e.g. Makati)"
                            className="pl-9"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                        />
                    </div>
                </section>

                <section>
                    <h2 className="text-lg font-semibold text-foreground mb-4">
                        Available Listings
                        <span className="ml-2 text-sm font-normal text-muted-foreground">
                            ({filtered.length} {filtered.length === 1 ? 'result' : 'results'})
                        </span>
                    </h2>

                    {filtered.length > 0 ? (
                        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
                            {filtered.map((listing) => (
                                <ListingCard key={listing.id} listing={listing} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-16 text-muted-foreground">
                            <Camera className="mx-auto size-10 mb-3 opacity-30" />
                            <p>No listings match your search.</p>
                        </div>
                    )}
                </section>
            </main>
        </>
    );
}

