# Home Feed — Implementation Checklist

Design reference: `/Users/zayarlyn/Downloads/ui_kits-app-index.html`

---

## Backend

- [ ] **Extend `listItems` service** (`apps/api/src/modules/items/items.service.ts`)
  - Add `category?: ItemCategory` filter → `where: { status: 'active', category }`
  - Add `minPrice?: number` / `maxPrice?: number` → `price: { gte, lte }`
  - Add `sort?: 'newest' | 'low' | 'high'` → `orderBy: { createdAt: 'desc' | price: 'asc' | 'desc' }`

- [ ] **Update `list` controller** (`apps/api/src/modules/items/items.controller.ts`)
  - Parse `category`, `minPrice`, `maxPrice`, `sort` from `req.query`
  - Pass to `listItems`

---

## NavBar (`apps/web/src/common/components/NavBar.tsx`)

Replace the current plain nav with the design's top bar:

- [ ] Sticky header, `backdrop-blur` glass effect, bottom border
- [ ] `Logo` component (already exists at `common/components/Logo.tsx`) — use it
- [ ] Search input — pill shape, `#f1f1f1` bg, focus ring in primary color
  - Controlled by URL search param `q`; clear (×) button when non-empty
- [ ] Chat icon button with unread badge — links to `/conversations`
- [ ] `UserAvatar` for current user — links to `/profile`
- [ ] Sell button — links to `/items/new`, primary orange, `+ Sell` label

---

## Feed state & URL params (`apps/web/src/modules/feed/pages/FeedPage.tsx`)

- [ ] Read/write filter state via TanStack Router search params:
  - `q` (search query), `category`, `sort` (`newest` | `low` | `high`), `minPrice`, `maxPrice`, `page`
- [ ] Pass params down to `useItems` hook

---

## `useItems` hook (`apps/web/src/modules/feed/hooks/useItems.ts`)

Currently re-exports from items module. Replace with feed-specific hook:

- [ ] Accept `{ q, category, sort, minPrice, maxPrice, page }` params
- [ ] Call `GET /items` with those as query params
- [ ] Return `{ items, pagination, isLoading, isError }`

---

## FilterBar (`apps/web/src/modules/feed/components/FilterBar.tsx`)

- [ ] Receive filter state + setters as props from `FeedPage`
- [ ] Render `CategoryChips`, `PriceFilter`, `SortDropdown` in a flex row
- [ ] Results count line: `"18 items"` / `"3 items in Books"`

---

## CategoryChips (`apps/web/src/modules/feed/components/CategoryChips.tsx`)

- [ ] Add `All` as first chip
- [ ] Selected chip: `primary-tint` bg, primary text, no border
- [ ] Unselected chip: white bg, border, text
- [ ] Horizontal scroll on mobile (no scrollbar), no wrap

---

## SortDropdown (`apps/web/src/modules/feed/components/SortDropdown.tsx`)

Replace `<select>` with pill + popover:

- [ ] Pill shows `Sort: Newest` (or current label)
- [ ] Popover on click, close on outside click
- [ ] Options: `Newest`, `Price: low to high`, `Price: high to low`
- [ ] Active option highlighted in primary tint with checkmark

---

## PriceFilter — new component (`apps/web/src/modules/feed/components/PriceFilter.tsx`)

- [ ] Pill label: `Price` (inactive) or `฿0–500` (active)
- [ ] Popover with:
  - Min / max ฿ number inputs side by side
  - Preset range buttons: `฿0–500`, `฿500–1000`, `฿1000–3000`, `฿3000+`
  - Clear + Apply buttons
- [ ] Applies filter on "Apply", resets on "Clear"

---

## ItemCard (`apps/web/src/common/components/ItemCard.tsx`)

Rebuild to match design:

- [ ] Wrap in `<Link to="/items/$itemId">` (TanStack Router)
- [ ] Image area: 1:1 aspect ratio using existing `CategoryThumbnail` component
  - Show `SOLD` badge overlay when `item.status === 'sold'`
  - Show first `itemImage` if present, fall back to `CategoryThumbnail`
- [ ] Title: 2-line clamp (`line-clamp-2`), `font-medium text-sm`
- [ ] Price: `฿{item.price}` — `font-bold text-lg`
- [ ] Footer (border-top): `UserAvatar` (size 20) + seller name (truncate) + `·` + relative time
- [ ] Hover: `translateY(-2px)` + stronger shadow (use Tailwind `group-hover` or inline state)
- [ ] Props: `item: Item & { seller: { displayName: string }, itemImages: { url: string }[] }`

---

## FeedGrid (`apps/web/src/modules/feed/components/FeedGrid.tsx`)

- [ ] Responsive grid:
  - `grid-cols-2` default
  - `sm:grid-cols-3` (640px)
  - `lg:grid-cols-4` (1024px)
  - `xl:grid-cols-5` (1280px)
- [ ] Gap: `gap-3.5 sm:gap-4.5 lg:gap-5`
- [ ] Render skeleton cards while loading (use existing `ItemCardSkeleton`)

---

## EmptyState

Existing `common/components/EmptyState.tsx` — check if it needs updating to match design:

- [ ] Large icon in primary-tint circle
- [ ] "No items match your filters" heading
- [ ] Subtext + "Clear filters" outlined primary button

---

## Load More (`apps/web/src/modules/feed/pages/FeedPage.tsx`)

- [ ] Show `Load more` button + `{n} more items` when `page < totalPages`
- [ ] On click: increment `page` param, append results to list

---

## FeedPage — wire it all together

- [ ] Layout: `NavBar` (sticky) → `FilterBar` → results count → `FeedGrid` or `EmptyState` → `LoadMore`
- [ ] Pass `isLoading` to `FeedGrid` so it shows skeletons on first load and filter change
- [ ] Reset to page 1 whenever any filter changes
