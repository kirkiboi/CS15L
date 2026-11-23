import { Head, useForm, Link } from '@inertiajs/react';
import { useRef, useState, useEffect } from 'react';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Spinner } from '@/components/ui/spinner';
import { ImagePlus, X } from 'lucide-react';

type ListingImage = {
    id: number;
    listing_id: number;
    image_path: string;
};

type Listing = {
    id: number;
    user_id: number;
    title: string;
    brand: string;
    model: string;
    category: string;
    pickup_location: string;
    description: string;
    condition: string;
    price_per_day: string | number;
    status: 'available' | 'unavailable';
    images: ListingImage[];
};

type Props = {
    listing: Listing;
};

type FormData = {
    _method: string;
    title: string;
    brand: string;
    model: string;
    category: string;
    pickup_location: string;
    description: string;
    condition: string;
    price_per_day: string;
    status: string;
    images: File[];
    removed_image_ids: number[];
};

const DEFAULT_CATEGORIES = [
    'Mirrorless',
    'DSLR',
    'Cinema',
    'Action',
    'Medium Format',
    'Drone',
    'Lens',
    'Lighting',
    'Accessory',
];

const CONDITIONS = [
    { value: 'mint', label: 'Mint' },
    { value: 'excellent', label: 'Excellent' },
    { value: 'good', label: 'Good' },
    { value: 'fair', label: 'Fair' },
    { value: 'poor', label: 'Poor' },
];

export default function EditListing({ listing }: Props) {
    const categories = DEFAULT_CATEGORIES.includes(listing.category)
        ? DEFAULT_CATEGORIES
        : [listing.category, ...DEFAULT_CATEGORIES];
    const [existingImages, setExistingImages] = useState<ListingImage[]>(
        listing.images ?? [],
    );

    const { data, setData, post, processing, errors } = useForm<FormData>({
        _method: 'put',
        title: listing.title ?? '',
        brand: listing.brand ?? '',
        model: listing.model ?? '',
        category: listing.category ?? '',
        pickup_location: listing.pickup_location ?? '',
        description: listing.description ?? '',
        condition: listing.condition ?? '',
        price_per_day: String(listing.price_per_day ?? ''),
        status: listing.status ?? 'available',
        images: [],
        removed_image_ids: [],
    });

    const fileInputRef = useRef<HTMLInputElement>(null);
    const [previews, setPreviews] = useState<{ name: string; url: string }[]>(
        [],
    );

    const previewsRef = useRef<{ name: string; url: string }[]>([]);

    useEffect(() => {
        previewsRef.current = previews;
    }, [previews]);
    useEffect(() => {
        return () => {
            previewsRef.current.forEach((preview) => {
                URL.revokeObjectURL(preview.url);
            });
        };
    }, []);

    const totalImagesCount = existingImages.length + data.images.length;

    function handleImagesChange(e: React.ChangeEvent<HTMLInputElement>) {
        const files = Array.from(e.target.files ?? []);
        if (files.length === 0) return;

        const remainingSlots = 10 - existingImages.length - data.images.length;
        if (remainingSlots <= 0) return;

        const filesToAdd = files.slice(0, remainingSlots);
        const combined = [...data.images, ...filesToAdd];
        setData('images', combined);

        const newPreviews = filesToAdd.map((f) => ({
            name: f.name,
            url: URL.createObjectURL(f),
        }));
        setPreviews((prev) => [...prev, ...newPreviews]);
        if (fileInputRef.current) fileInputRef.current.value = '';
    }

    function removeExistingImage(id: number) {
        setExistingImages((prev) => prev.filter((img) => img.id !== id));
        setData('removed_image_ids', [...data.removed_image_ids, id]);
    }

    function removeNewImage(index: number) {
        const updated = data.images.filter((_, i) => i !== index);
        setData('images', updated);
        setPreviews((prev) => {
            URL.revokeObjectURL(prev[index].url);
            return prev.filter((_, i) => i !== index);
        });
    }

    function submit(e: React.FormEvent) {
        e.preventDefault();
        post(`/listings/${listing.id}`, {
            forceFormData: true,
        });
    }

    return (
        <>
            <Head title={`Edit: ${listing.title} - LetMeSee`} />

            <div className="mx-auto max-w-2xl px-4 py-10">
                <Heading
                    title="Edit Listing"
                    description="Update the details and photos for this camera equipment."
                />

                <form
                    onSubmit={submit}
                    encType="multipart/form-data"
                    className="mt-6 space-y-6"
                >
                    <div className="grid gap-2">
                        <Label htmlFor="title">Listing Title</Label>
                        <Input
                            id="title"
                            name="title"
                            value={data.title}
                            onChange={(e) => setData('title', e.target.value)}
                            placeholder="e.g. Sony A7 IV for rent"
                            required
                        />
                        <InputError message={errors.title} />
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="grid gap-2">
                            <Label htmlFor="brand">Brand</Label>
                            <Input
                                id="brand"
                                name="brand"
                                value={data.brand}
                                onChange={(e) =>
                                    setData('brand', e.target.value)
                                }
                                placeholder="e.g. Sony"
                                required
                            />
                            <InputError message={errors.brand} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="model">Model</Label>
                            <Input
                                id="model"
                                name="model"
                                value={data.model}
                                onChange={(e) =>
                                    setData('model', e.target.value)
                                }
                                placeholder="e.g. A7 IV"
                                required
                            />
                            <InputError message={errors.model} />
                        </div>
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="category">Category</Label>
                        <Select
                            value={data.category}
                            onValueChange={(v) => setData('category', v)}
                        >
                            <SelectTrigger
                                id="category"
                                className="hover:cursor-pointer"
                            >
                                <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                            <SelectContent>
                                {categories.map((c) => (
                                    <SelectItem
                                        key={c}
                                        value={c}
                                        className="hover:cursor-pointer"
                                    >
                                        {c}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <InputError message={errors.category} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="pickup_location">
                            Pick-Up Location
                        </Label>
                        <Input
                            id="pickup_location"
                            name="pickup_location"
                            value={data.pickup_location}
                            onChange={(e) =>
                                setData('pickup_location', e.target.value)
                            }
                            placeholder="e.g. Makati City, Metro Manila"
                            required
                        />
                        <InputError message={errors.pickup_location} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="description">Description</Label>
                        <textarea
                            id="description"
                            name="description"
                            value={data.description}
                            onChange={(e) =>
                                setData('description', e.target.value)
                            }
                            rows={4}
                            placeholder="Describe the equipment, what's included, any usage notes"
                            required
                            className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-xs transition-[color,box-shadow] outline-none placeholder:text-muted-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50"
                        />
                        <InputError message={errors.description} />
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="grid gap-2">
                            <Label htmlFor="condition">Condition</Label>
                            <Select
                                value={data.condition}
                                onValueChange={(v) => setData('condition', v)}
                            >
                                <SelectTrigger
                                    id="condition"
                                    className="hover:cursor-pointer"
                                >
                                    <SelectValue placeholder="Select condition" />
                                </SelectTrigger>
                                <SelectContent>
                                    {CONDITIONS.map((c) => (
                                        <SelectItem
                                            key={c.value}
                                            value={c.value}
                                            className="cursor-pointer"
                                        >
                                            {c.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <InputError message={errors.condition} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="status">Availability</Label>
                            <Select
                                value={data.status}
                                onValueChange={(v) => setData('status', v)}
                            >
                                <SelectTrigger
                                    id="status"
                                    className="cursor-pointer"
                                >
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem
                                        value="available"
                                        className="cursor-pointer"
                                    >
                                        Available
                                    </SelectItem>
                                    <SelectItem
                                        value="unavailable"
                                        className="cursor-pointer"
                                    >
                                        Unavailable
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                            <InputError message={errors.status} />
                        </div>
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="price_per_day">
                            Daily Rental Price (₱)
                        </Label>
                        <Input
                            id="price_per_day"
                            name="price_per_day"
                            type="number"
                            min="1"
                            step="0.01"
                            value={data.price_per_day}
                            onChange={(e) =>
                                setData('price_per_day', e.target.value)
                            }
                            placeholder="e.g. 1500"
                            required
                            className="[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                        />
                        <InputError message={errors.price_per_day} />
                    </div>

                    <div className="grid gap-3">
                        <div className="flex items-center justify-between">
                            <Label>
                                Photos ({totalImagesCount}/10, max 5 MB each)
                            </Label>
                            {totalImagesCount >= 10 && (
                                <span className="text-xs text-muted-foreground">
                                    Limit of 10 reached
                                </span>
                            )}
                        </div>

                        {existingImages.length > 0 && (
                            <div className="space-y-2">
                                <span className="text-xs font-medium tracking-wider text-muted-foreground uppercase">
                                    Current Photos ({existingImages.length})
                                </span>
                                <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
                                    {existingImages.map((img) => (
                                        <div
                                            key={img.id}
                                            className="relative aspect-square overflow-hidden rounded-md border border-border"
                                        >
                                            <img
                                                src={`/storage/${img.image_path}`}
                                                alt="Current listing photo"
                                                className="h-full w-full object-cover"
                                            />
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    removeExistingImage(img.id)
                                                }
                                                className="absolute top-1 right-1 rounded-full bg-destructive/90 p-1 text-white shadow-xs hover:cursor-pointer hover:bg-destructive"
                                                aria-label="Remove existing photo"
                                                title="Remove photo"
                                            >
                                                <X className="size-3.5" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {previews.length > 0 && (
                            <div className="space-y-2">
                                <span className="text-xs font-medium tracking-wider text-muted-foreground uppercase">
                                    New Photos to Add ({previews.length})
                                </span>
                                <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
                                    {previews.map((p, i) => (
                                        <div
                                            key={i}
                                            className="relative aspect-square overflow-hidden rounded-md border border-border"
                                        >
                                            <img
                                                src={p.url}
                                                alt={p.name}
                                                className="h-full w-full object-cover"
                                            />
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    removeNewImage(i)
                                                }
                                                className="absolute top-1 right-1 rounded-full bg-black/60 p-1 text-white hover:cursor-pointer hover:bg-black/80"
                                                aria-label="Remove new photo"
                                            >
                                                <X className="size-3.5" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <button
                            type="button"
                            disabled={totalImagesCount >= 10}
                            onClick={() => fileInputRef.current?.click()}
                            className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-md border border-dashed border-input px-4 py-6 text-sm text-muted-foreground transition-colors hover:bg-accent disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            <ImagePlus className="size-5" />
                            {totalImagesCount >= 10
                                ? 'Maximum 10 photos reached'
                                : 'Click to add more photos'}
                        </button>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            multiple
                            className="hidden"
                            onChange={handleImagesChange}
                        />
                        <InputError message={errors.images} />
                    </div>

                    <div className="flex items-center gap-4 pt-2">
                        <Button
                            type="button"
                            variant="outline"
                            asChild
                            className="min-w-32 hover:cursor-pointer"
                        >
                            <Link href="/my-listings">Cancel</Link>
                        </Button>
                        <Button
                            type="submit"
                            disabled={processing}
                            className="min-w-32 hover:cursor-pointer"
                        >
                            {processing && <Spinner />}
                            {processing ? 'Saving…' : 'Save Changes'}
                        </Button>
                    </div>
                </form>
            </div>
        </>
    );
}

EditListing.layout = {
    breadcrumbs: [
        { title: 'Home', href: '/' },
        { title: 'My Listings', href: '/my-listings' },
        { title: 'Edit Listing', href: '/my-listings' },
    ],
};
