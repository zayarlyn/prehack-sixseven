# Chat / Conversations — Implementation Checklist

Design reference: `/Users/zayarlyn/Downloads/chat.html`

---

## Types (`packages/types/src/conversation.types.ts`)

- [ ] Add enriched conversation type used by the list + thread:
  ```ts
  export interface ConversationWithDetails extends Conversation {
    item: Pick<Item, 'id' | 'title' | 'price' | 'category'> & { itemImages: { url: string }[] };
    otherUser: PublicUser; // buyer if current user is seller, else seller
    unreadCount: number; // derived from Firebase (see hook section)
    lastMessage: string | null;
  }
  ```

---

## Backend (`apps/api/src/modules/conversations/`)

The service already implements `getConversations`, `getConversationById`, and `createOrFetchConversation`. Minor additions only:

- [ ] **`conversations.service.ts`** — `getConversations` response: ensure `item.itemImages` is included in the `item` include block so the striped thumbnail has a fallback image URL.
- [ ] **`conversations.controller.ts`** — no changes needed; `getAll` and `getById` are complete.

---

## Firebase hook (`apps/web/src/modules/conversations/hooks/useFirebaseChat.ts`)

All three TODOs need implementing:

- [ ] **Subscribe to messages**
  - `db.ref('conversations/{firebaseId}/messages').orderByChild('createdAt').on('value', ...)`
  - Map snapshot to `FirebaseMessage[]`, sorted ascending by `createdAt`
  - Clean up listener on unmount / `conversationId` change

- [ ] **`sendMessage(content: string)`**
  - Push to `conversations/{firebaseId}/messages`: `{ senderId: currentUserId, type: 'text', content, createdAt: Date.now() }`
  - After push, call `PATCH /api/conversations/{id}/last-message` to update `lastMessageAt` on the DB record (add this endpoint — see below)

- [ ] **`markAsRead()`**
  - Write `conversations/{firebaseId}/readBy/{userId}` = `Date.now()`
  - Call on mount and when new messages arrive while thread is focused

- [ ] **Derive `unreadCount`** in `useConversations` hook:
  - After fetching conversations list, for each conv read `conversations/{firebaseId}/readBy/{userId}` and count messages with `createdAt > readAt`
  - Or: store `unreadCount` in Firebase under `conversations/{firebaseId}/unreadCounts/{userId}` and keep it updated server-side — simpler to read

- [ ] **Add `PATCH /api/conversations/:conversationId/last-message`**
  - `conversations.service.ts`: `updateLastMessage(conversationId, userId)` → `prisma.conversation.update({ data: { lastMessageAt: new Date() } })`
  - `conversations.controller.ts`: `updateLastMessage` handler
  - `conversations.routes.ts`: `PATCH /:conversationId/last-message` (requireAuth only, no body validation needed)

---

## Route restructure (`apps/web/src/router.tsx`)

The design is a single full-height split-pane at `/conversations`. The existing `/conversations/$conversationId` route is a separate page — consolidate:

- [ ] Remove `conversationDetailRoute` (`/conversations/$conversationId`) from the route tree
- [ ] Change `conversationsRoute` to accept an optional `conversationId` search param:
  ```ts
  // in the route definition, add validateSearch:
  validateSearch: z.object({ conv: z.string().optional() });
  ```
- [ ] `ConversationDetailPage` is no longer needed as a standalone page — delete or keep as a redirect to `/conversations?conv={id}`

---

## Layout (`apps/web/src/modules/conversations/pages/ConversationsPage.tsx`)

The conversations page is **full-height with no scroll** — it overrides the `appLayoutRoute` wrapper behaviour:

- [ ] The page must be `height: 100vh` / `h-screen` and `overflow: hidden` — add `overflow-hidden` class to the page's root div
- [ ] The shared `NavBar` is rendered by `appLayoutRoute` — the conversations page **reuses it** (same nav as home feed, already sticky). No custom nav needed.
- [ ] Inner layout: `flex flex-col h-full` → NavBar (fixed height) → `flex-1 min-h-0 overflow-hidden p-4 md:p-6`
- [ ] Inside: `grid grid-cols-[360px_1fr]` card (`rounded-xl border shadow-card overflow-hidden bg-white`)
  - Mobile (`max-w-[900px]`): `grid-cols-1`, toggle between sidebar and thread pane

---

## ConversationList — left pane (`apps/web/src/modules/conversations/components/ConversationList.tsx`)

Full rewrite:

- [ ] **Header**: "Messages" title (bold) + `{n} unread` subtitle + search icon button (right)
- [ ] **List**: `flex-1 overflow-y-auto` (no scrollbar), renders `ConversationRow` for each item
- [ ] Props: `conversations: ConversationWithDetails[]`, `activeId: string | null`, `onSelect: (id: string) => void`
- [ ] Mobile only: shown when `mobilePane === 'list'`

---

## ConversationRow (`apps/web/src/modules/conversations/components/ConversationRow.tsx`)

Full rewrite to match design:

- [ ] `<button>` full-width, `text-left`
- [ ] **Active state**: `bg-primary/9`, left `3px` primary accent bar (absolute, `inset-y-0 left-0`)
- [ ] **Unread state**: `bg-primary/9` bg; on hover `bg-primary/14`
- [ ] **Read state**: transparent; on hover `bg-surface-alt`
- [ ] **Avatar** (44px) + unread badge (count, positioned `top-[-2px] right-[-2px]`, primary bg, white border)
- [ ] **Text column**:
  - Row 1: name (`font-bold` if unread, `font-semibold` otherwise) + timestamp (right-aligned, primary+bold if unread)
  - Row 2: `CategoryThumbnail` (16×16, `rounded-sm`) + item title (truncate)
  - Row 3: last message (truncate, bold+dark if unread, muted if read)
- [ ] Divider line between rows: absolute `left-[72px] right-4 bottom-0 h-px bg-border`
- [ ] Props: `conv: ConversationWithDetails`, `active: boolean`, `isLast: boolean`, `onClick: () => void`

---

## ThreadPane — right pane

### Thread header (`apps/web/src/modules/conversations/pages/ConversationsPage.tsx` or extract to component)

- [ ] Height `64px`, border-bottom, flex row with gap
- [ ] Mobile back button (`←`) — only visible on mobile, calls `setMobilePane('list')`
- [ ] `UserAvatar` (38px) of `otherUser`
- [ ] Name (`font-bold`) + "Active now" subtitle (green dot `6×6` + text)
  - Active now is static/decorative for now (no presence tracking)
- [ ] Icon buttons: call (phone icon, decorative/no-op for now), more-options (3-dot, no-op for now)

### Pinned item (`apps/web/src/modules/conversations/components/PinnedItemCard.tsx`)

Full rewrite:

- [ ] Layout: `flex gap-3.5 items-center px-[18px] py-3 border-b bg-white`
- [ ] `CategoryThumbnail` (52×52, `rounded-lg`) — uses first `itemImage` URL if available
- [ ] Item title (truncate, `font-semibold text-[13.5px]`) + price (`฿{price}` in primary, `text-lg font-extrabold`)
- [ ] "View listing" button → `<Link to="/items/$itemId">` (outlined, small, chevron icon)
- [ ] Props: `item: ConversationWithDetails['item']`

### Messages area

- [ ] `flex-1 overflow-y-auto min-h-0 bg-[#fafafa] px-7 py-3` (no scrollbar)
- [ ] Auto-scroll to bottom on mount and when messages change (`useEffect` + `scrollRef.current.scrollTop = scrollHeight`)
- [ ] **Day separator** (`SystemMessage` component — update):
  - `flex items-center gap-2.5 my-4 text-[11px] font-semibold uppercase tracking-wide text-text-tertiary`
  - Two `flex-1 h-px bg-border` lines flanking the label
  - Group messages by day; insert separator when day changes
- [ ] **Grouping logic**: consecutive messages from the same sender are "grouped" — grouped messages get tighter top margin (`mt-0.5` vs `mt-2`)

### MessageBubble (`apps/web/src/modules/conversations/components/MessageBubble.tsx`)

Full rewrite:

- [ ] Sent (`isSent`): right-aligned, primary bg, white text
- [ ] Received: left-aligned, `bg-[#f0f0f0]`, text color
- [ ] Max width `68%`
- [ ] **Corner rounding**: all `rounded-[20px]`, except:
  - Sent + grouped: `rounded-tr-[6px]` (top-right tightens)
  - Received + grouped: `rounded-tl-[6px]` (top-left tightens)
  - Bottom-right always `rounded-br-[6px]` for sent; bottom-left `rounded-bl-[6px]` for received
- [ ] Below bubble: timestamp (`text-[10.5px] text-text-tertiary`) + double-checkmark SVG for sent messages
- [ ] Props: `message: FirebaseMessage`, `isSent: boolean`, `isGrouped: boolean`

### Composer (`apps/web/src/modules/conversations/components/MessageInput.tsx`)

Full rewrite:

- [ ] `flex items-end gap-2 px-3.5 py-2.5 border-t bg-white`
- [ ] Attach icon button (decorative, no-op for now)
- [ ] Pill input: `flex-1 bg-[#f1f1f1] rounded-[22px] px-3.5 py-2 min-h-[44px]`; focus ring in primary (`border-primary shadow-[0_0_0_3px_var(--primary-tint)]`)
- [ ] Send button: `44×44` circle; primary bg + shadow when `canSend`, grey + disabled when empty
- [ ] Enter key sends; button disabled when input is empty
- [ ] After send: clear input, scroll messages to bottom
- [ ] Props: `onSend: (content: string) => void`

---

## Empty state — no conversation selected

- [ ] Add `EmptyThread` state shown in the right pane when `activeId === null`
- [ ] Icon in `primary-tint` circle + "Select a conversation" heading + subtext
- [ ] Shown by default on desktop; hidden on mobile (mobile shows list pane by default)

---

## `useConversations` hook update (`apps/web/src/modules/conversations/hooks/useConversations.ts`)

- [ ] After fetching conversations, derive `unreadCount` per conversation from Firebase read receipts
- [ ] Derive `lastMessage` string from Firebase (last message `content`, prefixed with "You: " if `senderId === currentUserId`)
- [ ] Map API response + Firebase data into `ConversationWithDetails[]`
- [ ] Return type: `{ conversations: ConversationWithDetails[], isLoading, isError }`

---

## Wire it all together (`ConversationsPage`)

- [ ] Read `conv` search param from TanStack Router; if present, set as `activeId`
- [ ] On row select: update `conv` search param (`navigate({ search: { conv: id } })`) + `setMobilePane('thread')`
- [ ] Pass `messages` from `useFirebaseChat(activeConv.firebaseId)` to thread pane
- [ ] Call `markAsRead()` whenever thread is visible and new messages arrive
- [ ] Mobile: `mobilePane` state (`'list' | 'thread'`); default `'list'`; back button sets `'list'` and clears `conv` param

---

## Mobile responsiveness

- [ ] At `max-width: 900px` (`lg:` breakpoint): `grid-cols-1`
- [ ] Left pane hidden by default; shown when `mobilePane === 'list'`
- [ ] Right pane hidden by default; shown when `mobilePane === 'thread'`
- [ ] Thread header back button: visible only on mobile
- [ ] Search bar in NavBar: can be hidden on mobile (already handled if NavBar checklist is done)
