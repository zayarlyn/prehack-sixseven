# Home Feed — Implementation Checklist

Design reference: `docs/reference-design/feed.html`

Build order: backend first → shared components → feed hooks/state → filter UI → grid/cards → wire FeedPage.

---

## 1. Backend — `listItems` service (`apps/api/src/modules/items/items.service.ts`)

- [x] Add `category?: string` filter → `where: { status: 'active', category }`
- [x] Add `minPrice?: number` / `maxPrice?: number` → `price: { gte, lte }`
- [x] Add `sort?: 'newest' | 'low' | 'high'` → `orderBy: { createdAt: 'desc' | price: 'asc' | 'desc' }`
- [x] Add `q?: string` search → `title: { contains: q, mode: 'insensitive' }`

---

## 2. Backend — `list` controller (`apps/api/src/modules/items/items.controller.ts`)

- [x] Parse `q`, `category`, `minPrice`, `maxPrice`, `sort` from `req.query`
- [x] Pass to `listItems`

---

## 3. NavBar (`apps/web/src/common/components/NavBar.tsx`)

- [x] Sticky header, `backdrop-blur` glass effect, bottom border
- [x] `Logo` component — used
- [x] Search input — pill shape, `#f1f1f1` bg, focus ring in primary color
  - Controlled by URL search param `q`; clear (×) button when non-empty
- [x] Chat icon button — links to `/conversations`
- [x] `UserAvatar` for current user — links to `/profile`
- [x] Sell button — links to `/items/new`, primary orange, `+ Sell` label
- [x] Remove old text links (Feed, Messages, Profile, Logout) from the nav

---

## 4. `useItems` hook (`apps/web/src/modules/feed/hooks/useItems.ts`)

- [x] Accept `{ q, category, sort, minPrice, maxPrice, page }` params
- [x] Call `GET /items` with those as query params via the configured `api` axios instance
- [x] Return `{ items, pagination, isLoading, isError }`

---

## 5. FeedPage — filter state via URL params (`apps/web/src/modules/feed/pages/FeedPage.tsx`)

- [x] Read/write filter state from `router.state.location.search`
- [x] Pass params down to `useItems` hook
- [x] Reset `page` to 1 whenever any filter changes

---

## 6. CategoryChips (`apps/web/src/modules/feed/components/CategoryChips.tsx`)

- [x] `All` as first chip
- [x] Accept `value` + `onChange` props from `FilterBar`
- [x] Selected chip: accent bg, primary text, no border
- [x] Unselected chip: white bg, border, text
- [x] Horizontal scroll on mobile, no wrap

---

## 7. SortDropdown (`apps/web/src/modules/feed/components/SortDropdown.tsx`)

- [x] Accept `value` + `onChange` props
- [x] Pill shows `Sort: Newest` (or current label), chevron rotates when open
- [x] Popover on click, close on outside click
- [x] Options: `Newest`, `Price: low to high`, `Price: high to low`
- [x] Active option: accent bg, primary text, checkmark icon on right

---

## 8. PriceFilter — new component (`apps/web/src/modules/feed/components/PriceFilter.tsx`)

- [x] Accept `value: { min, max }` + `onChange` props
- [x] Pill label: `Price` (inactive) or `฿0–500` (active), chevron icon
- [x] Popover with min/max inputs, preset range buttons, Clear + Apply

---

## 9. FilterBar (`apps/web/src/modules/feed/components/FilterBar.tsx`)

- [x] Accept filter state + setters as props from `FeedPage`
- [x] Render `CategoryChips`, `PriceFilter`, `SortDropdown` in a flex row
- [x] Results count line: `"18 items"` / `"3 items in Books"`

---

## 10. ItemCard (`apps/web/src/common/components/ItemCard.tsx`)

- [x] Wrap in `<Link to="/items/$itemId">` (TanStack Router)
- [x] Image area: 1:1 aspect ratio — first `itemImage` if present, fall back to `CategoryThumbnail`
  - SOLD badge overlay when `item.status === 'sold'`
- [x] Title: 2-line clamp, `font-medium text-sm`
- [x] Price: `฿{item.price}` — `font-bold text-lg`
- [x] Footer (border-top): `UserAvatar` (size 20) + seller name (truncate) + `·` + relative time
- [x] Hover: `translateY(-2px)` + stronger shadow

---

## 11. ItemCardSkeleton (`apps/web/src/common/components/ItemCardSkeleton.tsx`)

- [x] 1:1 aspect-ratio skeleton block at the top (matches image area)
- [x] Title and price skeleton lines below

---

## 12. FeedGrid (`apps/web/src/modules/feed/components/FeedGrid.tsx`)

- [x] Responsive grid: `grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5`
- [x] Gap: `gap-3.5 sm:gap-[18px] lg:gap-5`
- [x] Render `ItemCardSkeleton` cards while loading

---

## 13. EmptyState (`apps/web/src/common/components/EmptyState.tsx`)

- [x] Optional `onClear?: () => void` prop
- [x] Large icon in `--od-primary-tint` circle
- [x] "No items match your filters" heading
- [x] Subtext + "Clear filters" outlined primary button

---

## 14. FeedPage — Load More + final wiring (`apps/web/src/modules/feed/pages/FeedPage.tsx`)

- [x] Layout: `FilterBar` → `FeedGrid`/`EmptyState` → `LoadMore`
- [x] Show `Load more` button + `{n} more items` when `page < totalPages`
- [x] On click: increment `page` param, append results
- [x] Skeleton on first load / filter change
- [x] `pt-16` offset for sticky nav
