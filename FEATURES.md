Here's the complete updated feature list.

---

**Authentication**

- Sign in with Microsoft OAuth only
- University tenant validation — blocks non-university Microsoft accounts
- Auth error screen for ineligible accounts
- First-time onboarding flow — collect year, program level, faculty, major, optional bio after OAuth
- Returning user skip — onboarded users go straight to feed
- Dev bypass mode — skip auth entirely in development via env flag
- Session management via JWT
- Sign out

---

**Home Feed**

- Paginated grid of all active listings
- Filter by category — Books, Electronics, Furniture, Clothing, Other
- Filter by price range
- Filter by condition
- Keyword search across title and description
- Sort by newest, price low to high, price high to low
- Empty state when no items match filters
- Desktop sidebar filter panel
- Mobile filter chips row

---

**Item Upload**

- Multi-image upload — up to 5 images
- Direct-to-storage upload via presigned URL — backend never handles file bytes
- Primary image selection
- Image reordering
- Form fields — title, description, price, category, condition, pickup location, open to offers toggle
- Post listing — item is immediately active on submit
- Images uploaded before item exists — linked to item on creation via nullable item_id

---

**Item Detail**

- Image carousel with thumbnail strip
- Full item info — title, price, condition badge, category tag, posted date, description, pickup location
- Seller info card with link to their profile
- View count
- Three state variants:
  - Buyer view — Chat with Seller button
  - Seller view — Edit Listing and Mark as Sold buttons, view stats (views, chats, saves)
  - Sold state — Sold banner, actions hidden

---

**Item Management (seller)**

- Edit listing — update any field or images
- Delete listing — soft delete, preserves transaction history
- Mark as Sold — three entry points:
  - From chat pinned item card (buyer implicit)
  - From seller's own item detail page
  - From "..." menu on listing cards in profile

---

**Chat / Conversations**

- Create or fetch conversation — one chat per item per buyer-seller pair, no duplicates
- Real-time messaging via Firebase Realtime Database
- Conversation list with unread badge
- Pinned item card at top of each conversation
- Message bubbles — sent (#fa4617) and received (gray)
- Read receipts and unread count
- System message banner after sale is closed
- Chat remains open after sale for pickup coordination
- Seller-only Mark as Sold button in pinned item card

---

**Close Deal / Transactions**

- Two modal variants:
  - Variant A — from chat, buyer is implicit, editable final price
  - Variant B — from item detail or profile, searchable user picker prioritising existing chat participants
- Atomic transaction — item status, transaction record, and Firebase system message all update together or not at all
- Final price editable — can differ from listing price if negotiated
- Optional private note
- Sale reflected immediately across all surfaces — item detail, profile tabs, chat

---

**User Profile**

- Profile header — avatar, name, faculty, major, year, program level, member since
- Three tabs — Listings (active), Sold, Purchases
- Own profile — Edit Profile button, "..." menu on listing cards
- Other user's profile — Message button, Listings and Sold tabs only
- Stats row — items sold, items purchased

---

**Edit Profile**

- Avatar upload via presigned URL
- Editable fields — year, program level, faculty, major, bio
- Read-only fields from Microsoft — name and email with lock icon

---

**File Uploads (general)**

- Presigned URL generation — backend signs, frontend uploads directly to storage
- Upload confirmation — creates s3_objects record
- Context tagging — item_image or avatar
- Orphan cleanup — item_images with null item_id older than 24 hours deleted periodically

---

**Navigation**

- Persistent top nav — logo, search bar, chat icon with unread badge, profile avatar, Sell button
- Mobile bottom-friendly tap targets
- Desktop full horizontal nav bar
- Route-level auth guard — redirects to login if not authenticated
- Route-level onboarding guard — redirects to complete profile if not onboarded

---

**Developer / Project Features**

- Monorepo with npm workspaces — apps/web, apps/api, packages/types
- Shared TypeScript types across frontend and backend
- ESLint + Prettier enforced on every commit via Husky lint-staged
- Conventional commits enforced via commitlint
- Dev auth bypass — fake user injected via env flag, no Microsoft OAuth needed locally
- Concurrently — single npm run dev starts both servers
- NestJS module style folder structure on both frontend and backend
- Component-based routing with TanStack Router
- GitHub branch protection — main and dev branches protected
- GitHub Actions CI — typecheck, lint, format check, build on every PR
- CODEOWNERS — auto-assigns reviewers by module ownership
- PR template with checklist
- Squash merge only — clean git history
- Open Design MCP integration — live design token and spec access for Claude Code

---

**Explicitly removed features**

- Save / favorite items — removed entirely
- Report item / user — removed entirely
- Draft save on item upload — removed, items post as active immediately
- Email verification screen — handled by Microsoft OAuth
- Password-based auth — replaced by Microsoft OAuth entirely

---

**Not yet decided**

- Push notifications or in-app notification bell
- Rating or review system after a transaction
- Item relisting after a failed sale
- Admin or moderation panel
- Search autocomplete suggestions
- Pagination vs infinite scroll consistency across mobile and desktop
