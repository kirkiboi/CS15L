import { Head, Link } from '@inertiajs/react';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
    ArrowLeft,
    Camera,
    MessageCircle,
    ChevronRight,
    CheckCheck,
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

type LatestMessage = {
    body: string;
    created_at: string;
    is_from_me: boolean;
    sender_name?: string;
};

type ConversationItem = {
    id: number;
    listing: ListingSnippet | null;
    other_user: OtherUser;
    latest_message: LatestMessage | null;
    is_two_way: boolean;
    updated_at: string;
};

type Props = {
    conversations: ConversationItem[];
};

function formatTimestamp(isoString: string): string {
    const date = new Date(isoString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays}d ago`;

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

export default function MessagesIndex({ conversations }: Props) {
    return (
        <>
            <Head title="Inbox - Messages - LetMeSee" />

            <header className="sticky top-0 z-10 border-b border-border bg-background/95 backdrop-blur">
                <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
                    <Link
                        href="/"
                        className="text-xl font-bold tracking-tight text-foreground"
                    >
                        LetMeSee
                    </Link>
                </div>
            </header>

            <main className="mx-auto max-w-4xl px-4 py-8">
                <div className="mb-6">
                    <Button
                        asChild
                        variant="outline"
                        size="sm"
                        className="gap-2"
                    >
                        <Link href="/">
                            <ArrowLeft className="size-4" />
                            Back to Browse
                        </Link>
                    </Button>
                </div>

                <div className="space-y-6">
                    <Heading
                        title="Messages"
                        description="Conversations with equipment owners and renters."
                    />

                    {conversations.length === 0 ? (
                        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed px-6 py-16 text-center">
                            <MessageCircle className="mb-4 size-12 text-muted-foreground opacity-30" />

                            <h3 className="text-lg font-semibold text-foreground">
                                No messages yet
                            </h3>

                            <p className="mt-2 max-w-md text-sm text-muted-foreground">
                                When you contact an equipment owner or receive
                                inquiries from renters, your conversations will
                                appear here.
                            </p>

                            <Button asChild className="mt-6">
                                <Link href="/">Browse Equipment</Link>
                            </Button>
                        </div>
                    ) : (
                        <div className="divide-y divide-border overflow-hidden rounded-xl border border-border bg-card shadow-xs">
                            {conversations.map((convo) => {
                                const initials = getInitials(
                                    convo.other_user.name,
                                );
                                const timeDisplay = convo.latest_message
                                    ? formatTimestamp(
                                        convo.latest_message.created_at,
                                    )
                                    : formatTimestamp(convo.updated_at);

                                return (
                                    <Link
                                        key={convo.id}
                                        href={`/messages/${convo.id}`}
                                        className="flex flex-col gap-4 p-4 transition-colors hover:bg-muted/50 sm:flex-row sm:items-center sm:justify-between"
                                    >
                                        <div className="flex min-w-0 flex-1 items-start gap-3.5">
                                            <Avatar className="size-11 shrink-0">
                                                <AvatarFallback className="bg-primary/10 font-semibold text-primary">
                                                    {initials}
                                                </AvatarFallback>
                                            </Avatar>

                                            <div className="min-w-0 flex-1 space-y-1">
                                                <div className="flex flex-wrap items-center gap-2">
                                                    <span className="font-semibold text-foreground">
                                                        {convo.other_user.name}
                                                    </span>
                                                    <Badge
                                                        variant="secondary"
                                                        className="text-[11px]"
                                                    >
                                                        {convo.other_user.role}
                                                    </Badge>
                                                    {convo.is_two_way && (
                                                        <Badge
                                                            variant="outline"
                                                            className="gap-1 text-[11px] text-muted-foreground"
                                                        >
                                                            <CheckCheck className="size-3 text-emerald-600" />
                                                            Two-way
                                                        </Badge>
                                                    )}
                                                </div>

                                                {convo.listing && (
                                                    <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                                                        <span className="truncate">
                                                            {convo.listing.brand}{' '}{convo.listing.model}
                                                        </span>
                                                        {convo.listing
                                                            .is_archived && (
                                                                <Badge
                                                                    variant="outline"
                                                                    className="text-[10px]"
                                                                >
                                                                    Archived
                                                                </Badge>
                                                            )}
                                                    </div>
                                                )}

                                                <p className="line-clamp-1 text-sm text-muted-foreground">
                                                    {convo.latest_message ? (
                                                        <>
                                                            <span className="font-medium text-foreground/80">
                                                                {convo
                                                                    .latest_message
                                                                    .is_from_me
                                                                    ? 'You: '
                                                                    : ''}
                                                            </span>
                                                            {
                                                                convo
                                                                    .latest_message
                                                                    .body
                                                            }
                                                        </>
                                                    ) : (
                                                        <span className="text-muted-foreground/70 italic">
                                                            Conversation
                                                            started. Send a
                                                            message!
                                                        </span>
                                                    )}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex shrink-0 items-center justify-between gap-3 sm:flex-col sm:items-end">
                                            <span className="text-xs text-muted-foreground">
                                                {timeDisplay}
                                            </span>

                                            {convo.listing && (
                                                <div className="relative size-12 shrink-0 overflow-hidden rounded-lg border border-border bg-muted">
                                                    {convo.listing.thumbnail ? (
                                                        <img
                                                            src={`/storage/${convo.listing.thumbnail}`}
                                                            alt={
                                                                convo.listing
                                                                    .title
                                                            }
                                                            className="size-full object-cover"
                                                        />
                                                    ) : (
                                                        <div className="flex size-full items-center justify-center">
                                                            <Camera className="size-5 text-muted-foreground/40" />
                                                        </div>
                                                    )}
                                                </div>
                                            )}

                                            <ChevronRight className="hidden size-4 text-muted-foreground sm:block" />
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    )}
                </div>
            </main>
        </>
    );
}
