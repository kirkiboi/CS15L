<?php

namespace App\Http\Controllers;

use App\Models\Conversation;
use App\Models\Listing;
use App\Models\Message;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ConversationController extends Controller
{
    public function index(Request $request): Response
    {
        $user = $request->user();

        $conversations = Conversation::query()
            ->where(function ($query) use ($user) {
                $query->where('owner_id', $user->id)
                    ->orWhere('renter_id', $user->id);
            })
            ->with([
                'listing' => function ($query) {
                    $query->with('images');
                },
                'owner:id,name',
                'renter:id,name',
                'latestMessage.sender:id,name',
                'messages:id,conversation_id,sender_id',
            ])
            ->orderByDesc(
                Message::select('created_at')
                    ->whereColumn('conversation_id', 'conversations.id')
                    ->latest()
                    ->take(1)
            )
            ->latest('updated_at')
            ->get()
            ->map(function (Conversation $conversation) use ($user) {
                $otherUser = $user->id === $conversation->owner_id ? $conversation->renter : $conversation->owner;
                $isOwner = $user->id === $conversation->owner_id;

                return [
                    'id' => $conversation->id,
                    'listing' => $conversation->listing ? [
                        'id' => $conversation->listing->id,
                        'title' => $conversation->listing->title,
                        'brand' => $conversation->listing->brand,
                        'model' => $conversation->listing->model,
                        'price_per_day' => $conversation->listing->price_per_day,
                        'status' => $conversation->listing->status,
                        'is_archived' => $conversation->listing->archived_at !== null,
                        'thumbnail' => $conversation->listing->images->first()?->image_path,
                    ] : null,
                    'other_user' => [
                        'id' => $otherUser->id,
                        'name' => $otherUser->name,
                        'role' => $isOwner ? 'Renter' : 'Owner',
                    ],
                    'latest_message' => $conversation->latestMessage ? [
                        'body' => $conversation->latestMessage->body,
                        'created_at' => $conversation->latestMessage->created_at->toISOString(),
                        'is_from_me' => $conversation->latestMessage->sender_id === $user->id,
                        'sender_name' => $conversation->latestMessage->sender?->name,
                    ] : null,
                    'is_two_way' => $conversation->isTwoWay(),
                    'updated_at' => $conversation->updated_at->toISOString(),
                ];
            });

        return Inertia::render('messages/index', [
            'conversations' => $conversations,
        ]);
    }

    public function start(Request $request, Listing $listing): RedirectResponse
    {
        $user = $request->user();

        abort_if($listing->user_id === $user->id, 403, 'You cannot message yourself.');
        abort_if($listing->archived_at !== null, 404, 'This listing is archived and unavailable.');
        abort_if($listing->status !== 'available', 403, 'This listing is currently unavailable for rent and therefore unavailabe for new conversations.');
        $conversation = Conversation::firstOrCreate(
            [
                'listing_id' => $listing->id,
                'renter_id' => $user->id,
            ],
            [
                'owner_id' => $listing->user_id,
            ]
        );

        return to_route('messages.show', $conversation);
    }

    public function show(Request $request, Conversation $conversation): Response
    {
        $user = $request->user();

        abort_unless(
            $conversation->owner_id === $user->id || $conversation->renter_id === $user->id,
            403
        );

        $conversation->load([
            'listing' => function ($query) {
                $query->with('images');
            },
            'owner:id,name',
            'renter:id,name',
            'messages' => function ($query) {
                $query->with('sender:id,name')->oldest();
            },
        ]);

        $otherUser = $user->id === $conversation->owner_id ? $conversation->renter : $conversation->owner;
        $isOwner = $user->id === $conversation->owner_id;

        return Inertia::render('messages/show', [
            'conversation' => [
                'id' => $conversation->id,
                'listing' => $conversation->listing ? [
                    'id' => $conversation->listing->id,
                    'title' => $conversation->listing->title,
                    'brand' => $conversation->listing->brand,
                    'model' => $conversation->listing->model,
                    'price_per_day' => $conversation->listing->price_per_day,
                    'status' => $conversation->listing->status,
                    'is_archived' => $conversation->listing->archived_at !== null,
                    'thumbnail' => $conversation->listing->images->first()?->image_path,
                ] : null,
                'other_user' => [
                    'id' => $otherUser->id,
                    'name' => $otherUser->name,
                    'role' => $isOwner ? 'Renter' : 'Owner',
                ],
                'messages' => $conversation->messages->map(fn (Message $message) => [
                    'id' => $message->id,
                    'body' => $message->body,
                    'sender_id' => $message->sender_id,
                    'sender_name' => $message->sender?->name,
                    'is_from_me' => $message->sender_id === $user->id,
                    'created_at' => $message->created_at->toISOString(),
                ]),
                'is_two_way' => $conversation->isTwoWay(),
                'is_owner' => $isOwner,
            ],
        ]);
    }

    public function storeMessage(Request $request, Conversation $conversation): RedirectResponse
    {
        $user = $request->user();

        abort_unless(
            $conversation->owner_id === $user->id || $conversation->renter_id === $user->id,
            403
        );

        $validated = $request->validate([
            'body' => ['required', 'string', 'max:5000'],
        ]);

        $conversation->messages()->create([
            'sender_id' => $user->id,
            'body' => trim($validated['body']),
        ]);

        $conversation->touch();

        return back();
    }
}
