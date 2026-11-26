import { Head, Link, useForm } from '@inertiajs/react';
import { useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Spinner } from '@/components/ui/spinner';
import InputError from '@/components/input-error';
import {
    ArrowLeft,
    Camera,
    Send,
    ExternalLink,
    CheckCheck,
    MessageCircle,
} from 'lucide-react';

type ListingSnippet = {
    id: number;
    title: string;
    brand: string;
    model: string;
    price_per_day: string | number;
    status: string;
    is_archived: boolean;
    thumbnail?: string | null;
};

type OtherUser = {
    id: number;
    name: string;
    role: 'Owner' | 'Renter';
};

type MessageItem = {
    id: number;
    body: string;
    sender_id: number;
    sender_name?: string;
    is_from_me: boolean;
    created_at: string;
};

type ConversationData = {
    id: number;
    listing: ListingSnippet | null;
    other_user: OtherUser;
    messages: MessageItem[];
    is_two_way: boolean;
    is_owner: boolean;
};

type Props = {
    conversation: ConversationData;
};

function formatMessageTime(isoString: string): string {
    const date = new Date(isoString);
    return date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
    });
}

function formatMessageDate(isoString: string): string {
    const date = new Date(isoString);
    return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
    });
}

function getInitials(name: string): string {
    return (
        name
            .trim()
            .split(/\s+/)
            .filter(Boolean)
            .slice(0, 2)
            .map((part) => part[0])
            .join('')
            .toUpperCase() || '?'
    );
}

export default function ConversationShow({ conversation }: Props) {
    const { listing, other_user, messages, is_two_way } = conversation;
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const { data, setData, post, processing, reset, errors } = useForm({
        body: '',
    });

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages.length]);

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (data.body.trim() === '' || processing) return;

        post(`/messages/${conversation.id}`, {
            preserveScroll: true,
            onSuccess: () => {
                reset('body');
            },
        });
    }

    function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e);
        }
    }

    return (
        <>
            <Head
                title={`LetMeSee`}
            />

            <header className="sticky top-0 z-10 border-b border-border bg-background/95 backdrop-blur">
                <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-3">
                    <Link
                        href="/"
                        className="text-xl font-bold tracking-tight text-foreground"
                    >
                        LetMeSee
                    </Link>
                </div>
            </header>

            <main className="mx-auto flex max-w-4xl flex-col px-4 py-6">
                <div className="mb-4">
                    <Button
                        asChild
                        variant="outline"
                        size="sm"
                        className="gap-2"
                    >
                        <Link href="/messages">
                            <ArrowLeft className="size-4" />
                            Back to Inbox
                        </Link>
                    </Button>
                </div>

                <div className="flex flex-col overflow-hidden rounded-xl border border-border bg-card shadow-sm">
                    <div className="border-b border-border bg-muted/40 p-4">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <div className="flex items-center gap-3">
                                <Avatar className="size-11">
                                    <AvatarFallback className="bg-primary/10 font-semibold text-primary">
                                        {getInitials(other_user.name)}
                                    </AvatarFallback>
                                </Avatar>

                                <div>
                                    <div className="flex items-center gap-2">
                                        <h1 className="text-base font-semibold text-foreground">
                                            {other_user.name}
                                        </h1>
                                        {is_two_way ? (
                                            <Badge
                                                variant="outline"
                                                className="gap-1 text-[11px] text-muted-foreground"
                                            >
                                                <CheckCheck className="size-3 text-emerald-600" />
                                                Rent Request Enabled
                                            </Badge>
                                        ) : (
                                            <Badge
                                                variant="outline"
                                                className="text-[11px] text-muted-foreground"
                                            >
                                                Rent Request Disabled
                                            </Badge>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {listing && (
                                <div className="flex items-center gap-3 rounded-lg border border-border bg-card p-2 sm:max-w-xs">
                                    <div className="relative size-12 shrink-0 overflow-hidden rounded-md bg-muted">
                                        {listing.thumbnail ? (
                                            <img
                                                src={`/storage/${listing.thumbnail}`}
                                                alt={listing.title}
                                                className="size-full object-cover"
                                            />
                                        ) : (
                                            <div className="flex size-full items-center justify-center">
                                                <Camera className="size-5 text-muted-foreground/40" />
                                            </div>
                                        )}
                                    </div>

                                    <div className="min-w-0 flex-1">
                                        <p className="line-clamp-1 text-xs font-semibold text-foreground">
                                            {listing.title}
                                        </p>
                                        <p className="text-xs font-bold text-foreground">
                                            ₱
                                            {Number(
                                                listing.price_per_day,
                                            ).toLocaleString('en-PH')}
                                            <span className="font-normal text-muted-foreground">
                                                {' '}
                                                / day
                                            </span>
                                        </p>
                                        {listing.is_archived || listing.status === 'unavailable' ? (
                                            <Badge
                                                variant="outline"
                                                className="mt-0.5 text-[10px]"
                                            >
                                                Unavailable for rent
                                            </Badge>
                                        ) : (
                                            <Link
                                                href={`/listings/${listing.id}`}
                                                target="_blank"
                                                className="mt-0.5 inline-flex items-center gap-1 text-[11px] text-primary"
                                            >
                                                <span>View listing</span>
                                            </Link>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="flex max-h-[520px] min-h-[380px] flex-col gap-4 overflow-y-auto p-4 sm:p-6">
                        {messages.length === 0 ? (
                            <div className="my-auto flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
                                <MessageCircle className="mb-3 size-10 opacity-30" />
                                <p className="text-sm font-medium">
                                    No messages in this conversation yet.
                                </p>
                            </div>
                        ) : (
                            messages.map((message, index) => {
                                const showDateSeparator =
                                    index === 0 ||
                                    formatMessageDate(message.created_at) !==
                                    formatMessageDate(
                                        messages[index - 1].created_at,
                                    );

                                return (
                                    <div key={message.id} className="space-y-2">
                                        {showDateSeparator && (
                                            <div className="my-2 flex items-center justify-center">
                                                <span className="rounded-full bg-muted px-3 py-1 text-[11px] font-medium text-muted-foreground">
                                                    {formatMessageDate(
                                                        message.created_at,
                                                    )}
                                                </span>
                                            </div>
                                        )}

                                        <div
                                            className={`flex flex-col ${message.is_from_me
                                                ? 'items-end'
                                                : 'items-start'
                                                }`}
                                        >
                                            <div
                                                className={`rounded-2xl px-4 py-2.5 text-sm leading-relaxed whitespace-pre-line shadow-xs ${message.is_from_me
                                                    ? 'rounded-tr-xs bg-primary text-primary-foreground'
                                                    : 'rounded-tl-xs border border-border bg-muted/80 text-foreground'
                                                    } max-w-[85%] sm:max-w-[70%]`}
                                            >
                                                {message.body}
                                            </div>

                                            <span className="mt-1 px-1 text-[11px] text-muted-foreground">
                                                {formatMessageTime(
                                                    message.created_at,
                                                )}
                                            </span>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    <div className="border-t border-border bg-card p-4">
                        <form onSubmit={handleSubmit} className="space-y-2">
                            <div className="flex items-center gap-2">
                                <textarea
                                    value={data.body}
                                    onChange={(e) => setData('body', e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    placeholder={`Write a message to ${other_user.name}`}
                                    rows={2}
                                    disabled={processing}
                                    className="flex w-full resize-none rounded-lg border border-input bg-background px-3 py-2 text-sm shadow-xs transition-colors placeholder:text-muted-foreground focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                                    required
                                />

                                <Button
                                    type="submit"
                                    disabled={processing || data.body.trim() === ''}
                                    className="px-4 hover:cursor-pointer"
                                >
                                    {processing ? (
                                        <Spinner className="size-4" />
                                    ) : (
                                        <>
                                            <Send className="mr-1.5 size-4" />
                                            <span>Send</span>
                                        </>
                                    )}
                                </Button>
                            </div>
                            <InputError message={errors.body} />
                        </form>
                    </div>
                </div>
            </main>
        </>
    );
}
