# Item Detail — Implementation Checklist

Design reference: `docs/reference-design/item-detail.html`
Excluded: save/unsave feature, report listing button.

---

## Backend (`apps/api/src/modules/items/`)

### `items.service.ts`

- [ ] **`ListItemsParams`** — add `sellerId?: string`; apply in `where`:

  ```ts
  ...(sellerId && { sellerId }),
  ```

- [ ] **`getItem`** — after fetching the item, compute and return seller sold count:
  ```ts
  const sellerSoldCount = await prisma.item.count({
    where: { sellerId: item.sellerId, status: 'sold' },
  });
  return { ...item, sellerSoldCount };
  ```
  Seller, itemImages already included via `include: { itemImages: true, seller: true }`.

### `items.controller.ts`

- [ ] **`list`** — parse `sellerId` from `req.query` and pass to `listItems`:
  ```ts
  const sellerId = req.query.sellerId as string | undefined;
  ```

---

## Types (`packages/types/src/item.types.ts`)

- [ ] Add `ItemWithDetails` for the enriched shape returned by `getItem`:
  ```ts
  export interface ItemWithDetails extends Item {
    itemImages: { id: string; url: string }[];
    seller: PublicUser;
    sellerSoldCount: number;
  }
  ```

---

## Hooks (`apps/web/src/modules/items/hooks/useItems.ts`)

No logic changes needed — only add types:

- [ ] Return type of `useItem` → `ApiResponse<ItemWithDetails>`
- [ ] `useItems` already accepts `query?: any` — no change needed; `sellerId` will pass through

---

## `ItemDetailPage` (`apps/web/src/modules/items/pages/ItemDetailPage.tsx`)

Full implementation — orchestrates all child components:

- [ ] `const { itemId } = useParams({ from: '/items/$itemId' })`
- [ ] `const { data, isLoading, isError } = useItem(itemId)`
- [ ] `const { user } = useAuth()`
- [ ] Guards: show `LoadingSpinner` while loading; `ErrorState` on error
- [ ] `const isSeller = user?.id === item.sellerId`
- [ ] Layout: `max-w-[1200px] mx-auto px-6 py-5 pb-[72px]`
- [ ] Render order:
  1. `<ItemBreadcrumb category={item.category} title={item.title} />`
  2. Two-column grid (see Layout section below)
  3. `<DescriptionBlock description={item.description} />`
  4. `<MoreFromSeller item={item} />`
  5. `<SimilarItems item={item} />`

---

## `ItemBreadcrumb` — new (`apps/web/src/modules/items/components/ItemBreadcrumb.tsx`)

- [ ] `<nav className="flex items-center gap-1.5 text-[13px] text-text-secondary mb-[18px]">`
- [ ] Segments: "Browse" → `{capitalize(category)}` → `{title}` (truncated)
- [ ] "Browse" and category: `<Link>` elements, primary color on hover; last segment: `<span className="text-text font-medium">`
- [ ] Chevron SVG (12×12) separator between segments
- [ ] Props: `category: ItemCategory`, `title: string`

---

## `ImageCarousel` → rewrite as Gallery (`apps/web/src/modules/items/components/ImageCarousel.tsx`)

- [ ] **Main image** (`relative w-full aspect-square rounded-xl overflow-hidden border border-border bg-[#f1f1f1]`):
  - Real image: `<img src={images[idx].url} className="w-full h-full object-cover" />`
  - Fallback: `<CategoryThumbnail category={category} />` when `images.length === 0`
- [ ] **Prev/Next arrows** (hide when `images.length <= 1`):
  - `44×44` circle, white bg + `backdrop-blur-sm` + shadow
  - `left-[14px]` / `right-[14px]`, vertically centered (`top-1/2 -translate-y-1/2`)
  - Chevron SVG inside; wrap index with modulo
- [ ] **Counter badge** (`absolute bottom-[14px] right-[14px]`):
  - Dark semi-transparent pill: `bg-[rgba(26,26,26,0.78)] text-white text-[12px] font-semibold px-2.5 py-1 rounded-full`
  - Hide when `images.length <= 1`
- [ ] **Thumbnail strip** (`flex gap-2.5 mt-3`):
  - Each: `flex-1 aspect-square max-w-[110px] rounded-lg overflow-hidden cursor-pointer`
  - Active: `border-2 border-primary shadow-[0_0_0_3px_var(--primary-tint)]`; inactive: `border-[1.5px] border-border`
  - `<CategoryThumbnail>` (no label, `hideLabel`) as fallback inside each thumb
- [ ] Props: `images: { url: string }[]`, `category: ItemCategory`

---

## `ItemDetailBuyer` (`apps/web/src/modules/items/components/ItemDetailBuyer.tsx`)

Sticky right panel — full rewrite:

- [ ] Wrapper: `sticky top-[88px] flex flex-col gap-4`
- [ ] **Top row** — pills + share:
  - Category pill: primary-tint bg, primary text (`text-[11.5px] font-semibold px-2.5 py-1 rounded-full`)
  - Condition pill: `#f1f1f1` bg, muted text
  - Share icon button (right): `navigator.clipboard.writeText(window.location.href)` on click
- [ ] **Title + price**:
  - `<h1 className="text-[24px] font-bold tracking-[-0.4px] leading-[1.25]">`
  - Price: `<span className="text-[36px] font-extrabold tracking-[-0.8px] text-primary">`
  - `฿{item.price.toLocaleString()}`
  - "Posted {relative time}" — `text-[13px] text-text-secondary mt-1.5`
- [ ] **CTA block** (white card, border, `rounded-lg p-4`):
  - "Chat with Seller" button — `w-full h-[50px]` primary bg
  - On click: `useCreateConversation()({ itemId: item.id, sellerId: item.sellerId })` → on success navigate to `/conversations?conv={id}`
  - Show spinner + "Opening chat…" while `isPending`
- [ ] **Pickup block** (`rounded-lg border p-4`):
  - Section label: `PICKUP` uppercase, muted, small
  - Pin icon in `32×32` primary-tint circle + `item.pickupLocation` text (or "Not specified" if null)
- [ ] **Seller block** (`rounded-lg border p-4`):
  - Section label: `SELLER`
  - `<UserAvatar user={item.seller} size={48} />` + name (`font-semibold text-[14px]`)
  - `{item.sellerSoldCount} sales · Member since {format(item.seller.createdAt, 'MMM yyyy')}`
  - "View profile" outlined button → `<Link to="/profile/$userId" params={{ userId: item.sellerId }}>`
- [ ] **Listing stats block** (`rounded-lg border p-4`):
  - Section label: `LISTING STATS`
  - 3-cell grid separated by `1px` lines (use `gap-px bg-border` trick on the grid):
    - Views — eye SVG (18px) + `item.viewCount` + "Views"
    - Chats — chat bubble SVG + `item.chatsCount ?? '—'` + "Chats" (field TBD)
    - _(Saves cell excluded)_
  - Each cell: `flex flex-col items-center gap-1 p-3 bg-white`; value `text-[17px] font-bold`; label `text-[11.5px] text-text-secondary`
- [ ] Props: `item: ItemWithDetails`

---

## `ItemDetailSeller` (`apps/web/src/modules/items/components/ItemDetailSeller.tsx`)

- [ ] Same top row (pills + share), title, price as buyer
- [ ] **Actions block** (white card, border, `rounded-lg p-4 flex flex-col gap-3`):
  - "Edit listing" — outlined secondary button → `<Link to="/items/new">` (edit flow TBD separately)
  - "Mark as Sold" — primary button → sets `markAsSoldOpen = true`
  - "Delete listing" — ghost danger text button (`text-error`, no border) → sets `deleteOpen = true`
- [ ] `deleteOpen` state → renders `<ConfirmDeleteModal isOpen onClose onConfirm={handleDelete} itemTitle={item.title} />`
  - `handleDelete`: `useDeleteItem()(item.id)` → on success `navigate({ to: '/profile' })` + `queryClient.invalidateQueries(['items'])`
  - Button disabled + spinner while delete mutation is in-flight
- [ ] `markAsSoldOpen` state → renders `<MarkAsSoldModal isOpen onClose item={item} />`
- [ ] Same Pickup + Stats blocks as buyer
- [ ] Props: `item: ItemWithDetails`

---

## `DescriptionBlock` — new (`apps/web/src/modules/items/components/DescriptionBlock.tsx`)

- [ ] `<section className="bg-white border border-border rounded-xl p-[22px_24px] max-w-[920px] mt-9">`
- [ ] `<h2 className="text-[16px] font-bold tracking-[-0.2px]">Description</h2>`
- [ ] `<p className="mt-3 text-[15px] leading-[1.65] whitespace-pre-wrap text-text">{description}</p>`
- [ ] Props: `description: string`

---

## Confirm Popup Flows

### Flow A — Delete listing

**Component:** Reuse `ConfirmDeleteModal` (`apps/web/src/common/components/ConfirmDeleteModal.tsx`) — already uses shadcn `Dialog`, accepts `isOpen / onClose / onConfirm / itemTitle`.

**Wiring in `ItemDetailSeller`:**

- [ ] `const [deleteOpen, setDeleteOpen] = useState(false)`
- [ ] `const deleteMutation = useDeleteItem()`
- [ ] "Delete listing" button → `setDeleteOpen(true)`; disabled while `deleteMutation.isPending`
- [ ] `onConfirm` → `deleteMutation.mutate(item.id, { onSuccess: () => { navigate({ to: '/profile' }); queryClient.invalidateQueries({ queryKey: ['items'] }); } })`

---

### Flow B — Mark as Sold

**Component:** New `MarkAsSoldModal` (`apps/web/src/modules/items/components/MarkAsSoldModal.tsx`)

`CloseDealModal` is not reused here — it requires `buyerId` pre-known (chat context). This modal adds a buyer picker step.

**Modal layout:**

```
┌─ Mark as Sold ──────────────────────────────────┐
│  "{item.title}" · ฿{item.price}  (read-only)    │
│                                                  │
│  Who are you selling to?                         │
│  ┌──────────────────────────────────────────┐   │
│  │ [Avatar] Earth Wattanakul (2 msgs)    ▾  │   │  ← select from conversations for this item
│  └──────────────────────────────────────────┘   │
│                                                  │
│  — if no conversations —                         │
│  ℹ No Swap conversations for this item.          │
│    The item will be marked sold without          │
│    recording a buyer.                            │
│                                                  │
│  Final sale price   ฿ [1800       ]              │
│  Note (optional)    [              ]             │
│                                                  │
│  [Cancel]               [Confirm Sale]           │
└──────────────────────────────────────────────────┘
```

**Implementation checklist:**

- [ ] Props: `isOpen: boolean`, `onClose: () => void`, `item: ItemWithDetails`
- [ ] Uses shadcn `Dialog` (same as `ConfirmDeleteModal`)
- [ ] **Local state**: `selectedConvId: string | null`, `finalPrice: number` (init to `item.price`), `note: string`
- [ ] **Fetch conversations**: `useConversations()` → filter client-side: `convs.filter(c => c.itemId === item.id)`
  - `useConversations` already exists in `modules/conversations/hooks/useConversations.ts`
- [ ] **Buyer picker** (when `itemConvs.length > 0`):
  - `<select>` styled to match design (or shadcn `Select`)
  - Option per conversation: `{conv.otherUser.fullName}` — value = `conv.id`
  - Changing selection sets `selectedConvId`
  - Derive `{ buyerId, conversationId }` from selected conv
- [ ] **No-conversations note** (when `itemConvs.length === 0`): grey info note, no buyer picker shown
- [ ] **Final price input**: number input, `฿` prefix, prefilled with `item.price`
- [ ] **Note textarea**: optional, 3 rows
- [ ] **"Confirm Sale" disabled** when `itemConvs.length > 0 && !selectedConvId` (must pick buyer if conversations exist)
- [ ] **Submit — two paths:**
  - **Has buyer selected** (`selectedConvId` set):
    ```ts
    useCreateTransaction()({
      itemId: item.id,
      buyerId, // from selected conv
      finalPrice,
      note: note || undefined,
      conversationId, // from selected conv
    });
    ```
    `transactions.service.ts` atomically: creates transaction record + sets `item.status = 'sold'` + pushes Firebase system message.
  - **No conversations** (`itemConvs.length === 0`):
    ```ts
    useUpdateItem()({ id: item.id, data: { status: 'sold' } });
    ```
    Simpler path — no transaction record, item marked sold directly.
- [ ] On success (either path): `onClose()` + `navigate({ to: '/profile' })` + `queryClient.invalidateQueries({ queryKey: ['item', item.id] })`
- [ ] Show spinner on "Confirm Sale" button while mutation `isPending`

---

## `MoreFromSeller` — new (`apps/web/src/modules/items/components/MoreFromSeller.tsx`)

- [ ] `const { data } = useItems({ sellerId: item.sellerId, limit: 5 })`
- [ ] Filter out current item client-side; take first 4
- [ ] Render only when result has `> 0` items after filtering
- [ ] Section header: `flex justify-between items-baseline mb-3.5`
  - "More from {item.seller.fullName}" (`text-[18px] font-bold tracking-[-0.2px]`)
  - "View all →" `<Link to="/profile/$userId" params={{ userId: item.sellerId }}>` (primary, `text-[13.5px] font-semibold`)
- [ ] Grid: `row-grid grid grid-cols-4 gap-4`
- [ ] Props: `item: ItemWithDetails`

---

## `SimilarItems` — new (`apps/web/src/modules/items/components/SimilarItems.tsx`)

- [ ] `const { data } = useItems({ category: item.category, limit: 5 })`
- [ ] Filter out current item; take first 4; render only when `> 0`
- [ ] Header: "Similar items" + "See all {capitalize(category)} →" link (→ feed with category param: `<Link to="/" search={{ category: item.category }}>`)
- [ ] Same `row-grid` + `<ItemRowCard>`
- [ ] Props: `item: ItemWithDetails`

---

## `ItemRowCard` — new (`apps/web/src/modules/items/components/ItemRowCard.tsx`)

Compact card for "More from seller" and "Similar items" rows:

- [ ] `<Link to="/items/$itemId" params={{ itemId: item.id }}>` wrapping `<article>`
- [ ] Hover: `translateY(-2px)` + `shadow-card-hover`; `transition-[box-shadow,transform] duration-[160ms]`
- [ ] Image: `<img>` (first `itemImage.url`) or `<CategoryThumbnail>` fallback, `w-full aspect-square`
- [ ] Body (`p-[10px_10px_12px]`):
  - Title: `text-[13px] font-medium leading-[1.35] line-clamp-2 min-h-[35px]`
  - Price: `฿{item.price.toLocaleString()}` — `text-[16px] font-bold tracking-[-0.2px] mt-1.5`
- [ ] Props: `item: Item & { itemImages: { url: string }[] }`

---

## Layout wiring (`ItemDetailPage`)

- [ ] Two-column grid (`detail-layout`):
  ```
  grid grid-cols-[minmax(0,1.45fr)_minmax(0,1fr)] gap-7 mt-[18px] items-start
  ```

  - Left col: `<Gallery images={item.itemImages} category={item.category} />`
    then `<DescriptionBlock description={item.description} />` (stacked, no extra wrapper)
  - Right col: `{isSeller ? <ItemDetailSeller item={item} /> : <ItemDetailBuyer item={item} />}`
- [ ] `MoreFromSeller` and `SimilarItems` each in `<section className="mt-10">`
- [ ] Tailwind responsive: `lg:grid-cols-[minmax(0,1.45fr)_minmax(0,1fr)]` + `grid-cols-1` default → add breakpoint override or use inline style for the non-standard ratio

---

## Responsive

- [ ] `detail-layout` → `grid-cols-1` at ≤1024px; right panel loses `position: sticky`
- [ ] `row-grid` → `grid-cols-2` at ≤680px (add to `globals.css` or use `sm:` breakpoint)
- [ ] Search bar in NavBar hidden at ≤900px (handled by shared NavBar redesign checklist)
