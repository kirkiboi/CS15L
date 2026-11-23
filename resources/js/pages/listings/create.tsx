import { Head, useForm } from '@inertiajs/react';
import { Link } from '@inertiajs/react';
import { useRef, useState } from 'react';
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

type FormData = {
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
};

const CATEGORIES = [
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

export default function CreateListing() {
    const { data, setData, post, processing, errors, reset } =
        useForm<FormData>({
            title: '',
            brand: '',
            model: '',
            category: '',
            pickup_location: '',
            description: '',
            condition: '',
            price_per_day: '',
            status: 'available',
            images: [],
        });

    const fileInputRef = useRef<HTMLInputElement>(null);
    const [previews, setPreviews] = useState<{ name: string; url: string }[]>(
        [],
    );

    function handleImagesChange(e: React.ChangeEvent<HTMLInputElement>) {
        const files = Array.from(e.target.files ?? []);
        if (files.length === 0) return;

        const combined = [...data.images, ...files].slice(0, 10);
        setData('images', combined);

        const newPreviews = files.map((f) => ({
            name: f.name,
            url: URL.createObjectURL(f),
        }));
        setPreviews((prev) => [...prev, ...newPreviews].slice(0, 10));
        if (fileInputRef.current) fileInputRef.current.value = '';
    }

    function removeImage(index: number) {
        const updated = data.images.filter((_, i) => i !== index);
        setData('images', updated);
        setPreviews((prev) => {
            URL.revokeObjectURL(prev[index].url);
            return prev.filter((_, i) => i !== index);
        });
    }

    function submit(e: React.FormEvent) {
        e.preventDefault();
        post('/listings', {
            forceFormData: true,
            onSuccess: () => {
                reset();
                setPreviews([]);
            },
        });
    }

    return (
        <>
            <Head title="Create Listing" />

            <div className="mx-auto max-w-2xl px-4 py-10">
                <Heading
                    title="Create a Listing"
                    description="List your camera or equipment for rent."
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
                                {CATEGORIES.map((c) => (
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

                    <div className="grid gap-2">
                        <Label>Photos (up to 10, max 5 MB each)</Label>
                        <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-md border border-dashed border-input px-4 py-6 text-sm text-muted-foreground transition-colors hover:bg-accent"
                        >
                            <ImagePlus className="size-5" />
                            Click to add photos
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

                        {previews.length > 0 && (
                            <div className="mt-2 grid grid-cols-3 gap-3 sm:grid-cols-4">
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
                                            onClick={() => removeImage(i)}
                                            className="absolute top-1 right-1 rounded-full bg-black/60 p-0.5 text-white hover:cursor-pointer hover:bg-black/80"
                                            aria-label="Remove image"
                                        >
                                            <X className="size-3.5" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
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
                            {processing ? 'Saving…' : 'Create Listing'}
                        </Button>
                    </div>
                </form>
            </div>
        </>
    );
}

CreateListing.layout = {
    breadcrumbs: [
        { title: 'Home', href: '/' },
        { title: 'Create Listing', href: '/my-listings/create' },
    ],
};
