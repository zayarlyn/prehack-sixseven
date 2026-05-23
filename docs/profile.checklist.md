# Profile — Implementation Checklist

Design reference: `docs/reference-design/profile.html`

---

## Backend (`apps/api/src/modules/users/`)

### `users.service.ts`

- [ ] **`getPublicProfile`** — extend the `select` block:
  - Add `bio: true`
  - Add `_count: { select: { soldItems: true } }` for sold count (rename the relation if needed)
  - Derive `soldCount` from `prisma.item.count({ where: { sellerId: userId, status: 'sold' } })`
  - Derive `purchasedCount` from `prisma.transaction.count({ where: { buyerId: userId } })`
  - Return `memberSince` from `createdAt`
  - Rating / reviews: not in DB — return `null` for now, front-end hides the block when null

- [ ] **Add `getUserListingsPublic(userId)`** — same as `getUserListings` but takes any `userId`

  ```ts
  return prisma.item.findMany({
    where: { sellerId: userId, status: 'active' },
    include: { itemImages: true },
    orderBy: { createdAt: 'desc' },
  });
  ```

- [ ] **Add `getUserSoldPublic(userId)`** — same but `status: 'sold'`, include `soldAt`

### `users.routes.ts`

- [ ] Add `GET /:userId/listings` → `usersController.getListingsByUser` (public, no auth required)
- [ ] Add `GET /:userId/sold` → `usersController.getSoldByUser` (public)
- [ ] Keep existing `/me/listings`, `/me/sold`, `/me/purchases` for the own-profile purchases tab

### `users.controller.ts`

- [ ] Add `getListingsByUser` handler: `usersService.getUserListingsPublic(req.params.userId)`
- [ ] Add `getSoldByUser` handler: `usersService.getUserSoldPublic(req.params.userId)`

### `users.dto.ts`

- [ ] Add `displayName` (string, optional) and `bio` (string, max 200, optional) to `UpdateProfileDto`
  - Note: `fullName` is locked to Microsoft account — `displayName` is a separate editable override if needed, or just keep updating `fullName` with user-chosen value

---

## Types (`packages/types/src/user.types.ts`)

- [ ] Extend `PublicUser` to include `bio`, `soldCount`, `purchasedCount` (all optional/nullable)
- [ ] Add `ProfileStats` type:
  ```ts
  export interface ProfileStats {
    sold: number;
    purchased: number;
    rating: number | null;
    reviews: number | null;
  }
  ```

---

## Route change (`apps/web/src/router.tsx`)

The design shows Edit Profile as a modal inside `/profile`, not a separate page:

- [ ] Remove `editProfileRoute` (`/profile/edit`) from the route tree
- [ ] Delete or stub `EditProfilePage` — no longer needed as a route
- [ ] `ProfilePage` manages `editOpen` state; "Edit Profile" button opens the modal in-page

---

## `useProfile` hooks (`apps/web/src/modules/profile/hooks/useProfile.ts`)

- [ ] **`useProfile(userId)`**: keep as-is — calls `GET /api/users/:userId`
- [ ] **`useMyListings()`**: keep calling `/api/users/me/listings` (for own profile listings tab)
- [ ] **`useUserListings(userId)`**: update to call `/api/users/:userId/listings`
- [ ] **`useUserSold(userId)`**: update to call `/api/users/:userId/sold`
- [ ] **`useMyPurchases()`**: calls `/api/users/me/purchases` — only used on own profile
- [ ] **`useUpdateProfile()`**: add `queryClient.invalidateQueries(['profile'])` in `onSuccess`

---

## `ProfilePage` (`apps/web/src/modules/profile/pages/ProfilePage.tsx`)

Full implementation:

- [ ] Fetch `session` user to get `currentUser.id`
- [ ] Fetch profile: `useProfile(currentUser.id)` → `user`
- [ ] Fetch listings/sold/purchases from respective hooks
- [ ] `editOpen` state — passed to `EditProfileModal`
- [ ] Layout: `max-w-[1200px] mx-auto px-6 py-7 pb-16`
- [ ] Render: `ProfileHeader` → tab bar → tab content grid → `EditProfileModal` (when open)

---

## `UserProfilePage` (`apps/web/src/modules/profile/pages/UserProfilePage.tsx`)

- [ ] Fetch profile: `useProfile(userId)` → `user`
- [ ] Fetch `useUserListings(userId)` and `useUserSold(userId)` (no purchases — private)
- [ ] Same layout as `ProfilePage` but:
  - No "Edit Profile" button (render "Message" button → `useCreateConversation` if they have an active listing)
  - Tabs: Listings + Sold only (no Purchases)
  - `isOwnProfile = false`

---

## `ProfileHeader` (`apps/web/src/modules/profile/components/ProfileHeader.tsx`)

Full redesign:

- [ ] Container: `bg-white border border-border rounded-xl p-7 flex items-center gap-7 flex-wrap`
- [ ] **Avatar**: `UserAvatar` at size 112
- [ ] **Info column** (`flex-1 min-w-0 flex flex-col gap-2`):
  - Name: `text-[26px] font-bold tracking-[-0.5px]`
  - Meta line: `{major} · Year {year} {programLevel} · {faculty}` — muted text-sm
  - Member since: `text-[12.5px] text-text-tertiary`
  - **Stats row** (when counts available): `flex items-center gap-[22px] mt-1.5`
    - `StatBlock` component: large number (`text-[22px] font-extrabold`) + label below
    - Vertical dividers between blocks (`w-px h-8 bg-border`)
    - Blocks: Sold count | Purchased count | Rating (star SVG + number, `·` + "{n} reviews") — hide rating block when null
  - Bio: `text-[13.5px] text-text-secondary leading-relaxed max-w-[600px] mt-2` — only if `bio` is set
- [ ] **Actions column** (`flex-shrink-0 flex flex-col gap-2 items-end`):
  - Own profile: "Edit Profile" secondary outlined button (pencil icon) + "Your public profile" caption below
  - Other profile: "Message" secondary button (if they have listings) — triggers `useCreateConversation`
- [ ] Mobile (`max-w-[900px]`): `flex-direction: column`, actions `items-start`
- [ ] Props: `user: PublicUser & { soldCount: number; purchasedCount: number; bio: string | null }`, `isOwnProfile: boolean`, `onEdit?: () => void`

---

## Tab bar

Extract to `ProfileTabs` component (or inline in `ProfilePage`):

- [ ] `flex border-b border-border mt-7 mb-6`
- [ ] `TabButton` per tab: label + count (in primary when active, muted when inactive)
- [ ] Active tab: `font-bold text-text`, primary 2px underline (`absolute bottom-[-1px] left-0 right-0 h-0.5 bg-primary rounded-full`)
- [ ] Own profile tabs: Listings | Sold | Purchases
- [ ] Other profile tabs: Listings | Sold

---

## `ProfileCard` — new component (`apps/web/src/modules/profile/components/ProfileCard.tsx`)

A dedicated card for the profile grid (different from the feed `ItemCard`):

- [ ] `<article>` with hover lift (`translateY(-1px)`) + shadow transition
- [ ] Image area: `CategoryThumbnail` (1:1 aspect ratio) using first `itemImage` URL if available
- [ ] **StatusPill** (absolute, top-left):
  - Active: white bg, primary text + dot (`• Active`)
  - Sold: green bg, white text (`SOLD`)
  - Purchased: white bg, dark text (`PURCHASED`)
- [ ] **3-dot menu button** (absolute, top-right, `32×32` circle, white bg) — own listings only
  - Opens `CardMenu` popover on click (`e.stopPropagation()`)
- [ ] **`CardMenu`** popover (close on outside click):
  - "Edit" → navigate to `/items/$itemId` (edit form)
  - "Mark as Sold" → call `PATCH /api/items/:id` with `{ status: 'sold' }` + invalidate listings query
  - Divider
  - "Delete listing" → open `ConfirmDeleteModal` (already exists) → delete mutation
- [ ] Card body (`p-[11px_12px_14px]`):
  - Title: 2-line clamp, `text-[13.5px] font-medium`
  - Price: `text-base font-bold`; struck-through + muted for sold items
  - Date line (sold/purchased only): `"Sold {date}"` in `success-dark` (green) for sold; `"Bought {date}"` muted for purchased
- [ ] Props: `item: Item & { itemImages: { url: string }[]; soldAt?: Date | null; transaction?: { createdAt: Date } }`, `status: 'active' | 'sold' | 'purchased'`, `showMenu: boolean`

---

## Tab content components

Replace the `FeedGrid`-based implementations with `ProfileCard` grid:

### `ListingsTab` (`apps/web/src/modules/profile/components/ListingsTab.tsx`)

- [ ] Grid: `profile-grid` — `grid-cols-4` → 3 (1200px) → 2 (760px) → 1 (480px), `gap-[18px]`
- [ ] Each item: `<ProfileCard status="active" showMenu={true} />`
- [ ] Empty state: white card with border, centered text — "No active listings yet — tap '+ Sell' to post something."

### `SoldTab` (`apps/web/src/modules/profile/components/SoldTab.tsx`)

- [ ] Same grid + `<ProfileCard status="sold" showMenu={false} />`
- [ ] Empty state: "Nothing sold yet."

### `PurchasesTab` (`apps/web/src/modules/profile/components/PurchasesTab.tsx`)

- [ ] Same grid + `<ProfileCard status="purchased" showMenu={false} />`
- [ ] Item data comes from `transaction.item`; date from `transaction.createdAt`
- [ ] Empty state: "No purchases yet."

---

## `EditProfileModal` — new component (`apps/web/src/modules/profile/components/EditProfileModal.tsx`)

Replaces `EditProfilePage`. Opens as a modal from `ProfilePage`:

- [ ] **Overlay**: `fixed inset-0 bg-black/55 flex items-center justify-center p-6 z-50`; click outside closes
- [ ] **Modal card**: `w-[min(580px,calc(100vw-48px))] bg-white rounded-xl shadow-modal max-h-[calc(100vh-48px)] overflow-hidden flex flex-col`; `scaleIn` animation
- [ ] **Header** (`p-[22px_24px_0]`): "Edit Profile" title + close (×) icon button
- [ ] **Body** (`flex-1 overflow-y-auto p-[20px_24px] grid grid-cols-[160px_1fr] gap-7`):
  - **Left column**:
    - Avatar (112px) with camera icon overlay button → triggers presigned-URL avatar upload flow (use existing `useUpload` hook from `modules/items/hooks/useUpload.ts`)
    - "Change photo" text button below avatar
    - `LockedRow` for Name (lock icon, grey bg, `fullName` from session)
    - `LockedRow` for Email (same)
    - "From your university account" footnote with Microsoft logo (10px)
  - **Right column** (form fields):
    - Display name (`TextInput`, editable)
    - Program Level + Year (`grid grid-cols-2 gap-3`): Year `<select>` disabled until level chosen; options per level
    - Faculty (`<select>`, KMUTT faculties list)
    - Major (`<select>`, disabled until faculty chosen; options per faculty)
    - Bio (`<textarea>`, 3 rows, 200-char limit, `"{n}/200"` hint in Field label)
  - Mobile (`max-w-[760px]`): grid collapses to `grid-cols-1`
- [ ] **Footer** (`p-[14px_24px_20px] border-t flex justify-end gap-2.5`):
  - Cancel (tertiary) + Save Changes (primary)
  - Save: call `useUpdateProfile()`, show spinner + "Saving…" while in-flight, close on success
  - Invalidate `['session']` and `['profile', userId]` after save
- [ ] **`LockedRow`** subcomponent: label above + grey read-only pill with lock icon
- [ ] Props: `onClose: () => void`

---

## Responsive grid CSS (`apps/web/src/common/styles/globals.css`)

- [ ] Add `.profile-grid` utility (or use Tailwind responsive classes inline):
  ```css
  .profile-grid {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
  @media (max-width: 1200px) {
    .profile-grid {
      grid-template-columns: repeat(3, minmax(0, 1fr));
    }
  }
  @media (max-width: 760px) {
    .profile-grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }
  @media (max-width: 480px) {
    .profile-grid {
      grid-template-columns: repeat(1, minmax(0, 1fr));
    }
  }
  ```
  Or use Tailwind: `grid-cols-2 sm:grid-cols-3 lg:grid-cols-4` and override at 480px with a custom breakpoint.
