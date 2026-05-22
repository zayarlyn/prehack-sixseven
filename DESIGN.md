# SWAP Design System

> Category: Custom  
> Surface: web (desktop-first, responsive)  
> Product: Peer-to-peer student marketplace for King Mongkut's University of Technology Thonburi (KMUTT)  
> Source: /Users/zayarlyn/Downloads/KMUTT-EXG — local code snapshot, 2026-05-21

---

## 0. Source Context

| Field           | Value                                                                                                      |
| --------------- | ---------------------------------------------------------------------------------------------------------- |
| Source folder   | `/Users/zayarlyn/Downloads/KMUTT-EXG`                                                                      |
| Evidence note   | `context/local-code/KMUTT-EXG.md`                                                                          |
| Snapshots       | `context/local-code/KMUTT-EXG/files/desktop/`                                                              |
| Source examples | `source_examples/desktop/` (shared.jsx, topnav.jsx, feed.jsx, chat.jsx, auth.jsx, detail.jsx, profile.jsx) |
| Intake date     | 2026-05-21                                                                                                 |
| Tech stack      | React 18.3.1 + Babel 7.29.0 (CDN), inline JSX style objects                                                |
| Auth            | Microsoft OAuth restricted to @kmutt.ac.th                                                                 |
| Platform        | Desktop-first web (responsive breakpoints: 1200px, 1024px)                                                 |

All tokens, component shapes, and anti-patterns below are derived directly from the source files above.

---

## 1. Visual Theme & Atmosphere

SWAP is a closed, trusted marketplace — students buy and sell textbooks, dorm essentials, lab gear, and bikes exclusively within campus, verified by Microsoft (@kmutt.ac.th) accounts.

**Visual character:** clean, utility-first, and warm. The chrome stays neutral (white surfaces, light grey backgrounds) while the brand's vivid orange-red accent (`#fa4617`) provides energy and focus. Category thumbnails use striped pastel palettes to give items visual distinction without real photography. The overall feel is "organised college noticeboard" — helpful, fast, and familiar without being playful or enterprise-heavy.

**Layout posture:** wide three-column desktop layout (filter sidebar | masonry grid | contextual rail), sticky top navigation, full-page auth split-screen, two-pane chat.

---

## 2. Color

### Core Palette

| Token                   | Hex Value              | Role                                      |
| ----------------------- | ---------------------- | ----------------------------------------- |
| `--primary`             | `#fa4617`              | CTA buttons, active nav, accent, links    |
| `--primary-hover`       | `#d93a13`              | Primary button hover state                |
| `--primary-tint`        | `rgba(250,70,23,0.09)` | Active nav background, focus ring fill    |
| `--primary-tint-strong` | `rgba(250,70,23,0.14)` | Stronger tint for pressed states          |
| `--primary-disabled`    | `#fca58a`              | Disabled primary button background        |
| `--bg`                  | `#f7f7f7`              | Page background                           |
| `--bg-deep`             | `#ececec`              | Nested / deeper background layer          |
| `--surface`             | `#ffffff`              | Cards, nav, sidebar, modal bodies         |
| `--surface-alt`         | `#f7f7f7`              | Hover state on menu rows and list items   |
| `--bubble-received`     | `#f0f0f0`              | Chat message bubbles (incoming)           |
| `--border`              | `#e5e5e5`              | Default divider / input border            |
| `--border-strong`       | `#d4d4d4`              | Checkbox, strong separator                |
| `--text`                | `#1a1a1a`              | Primary body text, headings               |
| `--text-secondary`      | `#6b6b6b`              | Labels, meta, secondary copy              |
| `--text-tertiary`       | `#9a9a9a`              | Timestamps, placeholders, count badges    |
| `--success`             | `#10b981`              | Sold badge, success state, confirmed deal |
| `--success-dark`        | `#047857`              | Dark success text / icon                  |
| `--error`               | `#dc2626`              | Validation error, auth error state        |
| `--error-tint`          | `#fef2f2`              | Error message background                  |

### Category Palette (item thumbnail fills)

Each category has a striped thumbnail background: `bg` + `stripe` pattern at 135°, 12px pitch.

| Category    | bg        | stripe    | label (text) |
| ----------- | --------- | --------- | ------------ |
| Books       | `#fef3ec` | `#fde0cd` | `#a3580f`    |
| Electronics | `#eef1f7` | `#dbe1ec` | `#3c4a64`    |
| Furniture   | `#f1efe9` | `#e3dfd2` | `#6b5d3a`    |
| Clothing    | `#f3eef3` | `#e3d8e3` | `#6a4a6a`    |
| Other       | `#eef3f0` | `#dbe6df` | `#3f6253`    |

### Avatar Colors

Avatars use generated oklch hues: `oklch(0.82 0.04 ${hue})` where hue = `(name.charCodeAt(0) * 37) % 360`. Text is always `#1a1a1a`.

---

## 3. Typography

| Role    | Font Stack                                         | Weight  | Size range  | Notes                                    |
| ------- | -------------------------------------------------- | ------- | ----------- | ---------------------------------------- |
| Display | `'Inter', system-ui, -apple-system, sans-serif`    | 800     | 22–38px     | Auth hero, feed h1                       |
| Heading | Inter                                              | 700     | 16–22px     | Section titles, card h3                  |
| Body    | Inter                                              | 400–500 | 13.5–14.5px | Main text, descriptions                  |
| Label   | Inter                                              | 600–700 | 11–13px     | Sidebar labels, nav, buttons             |
| Caption | Inter                                              | 500     | 11–12.5px   | Timestamps, counts, kicker               |
| Mono    | `'JetBrains Mono', ui-monospace, Menlo, monospace` | 500     | 10–12px     | Item tag labels on thumbnails, kbd hints |

**Key typographic rules:**

- Display headlines: `letter-spacing: -1.2px` at 38px, `-0.3px` at 22px
- Nav / label text: `letter-spacing: 0.4–0.6px`, `text-transform: uppercase`
- Line height: `1.5` body, `1.1` tight display, `1.35` card titles
- `line-clamp: 2` on card titles (webkit-box pattern)
- `-webkit-font-smoothing: antialiased` always on body

**Font loading (Google Fonts):**

```
Inter: 400, 500, 600, 700, 800
JetBrains Mono: 500
```

---

## 4. Spacing

**Base unit: 4px**

| Step | Value   | Usage                                       |
| ---- | ------- | ------------------------------------------- |
| 1    | 4px     | Tight gaps (badge margin, icon-text gap)    |
| 2    | 8px     | Compact padding, checkbox gap               |
| 3    | 10px    | Item row padding, small card gap            |
| 4    | 12–14px | Sidebar padding, chip padding, popover item |
| 5    | 16–18px | Standard card padding, section gap          |
| 6    | 24px    | Layout gutter, main content padding         |
| 7    | 32px    | Auth form padding, section vertical gap     |
| 8    | 48–56px | Auth left panel padding                     |
| 9    | 64px    | Top nav height, page bottom buffer          |

### Border Radius

| Token     | Value                          | Usage                                                 |
| --------- | ------------------------------ | ----------------------------------------------------- |
| xs        | 4px                            | Inline badge / tag label, nav links, row hover states |
| sm        | 6px                            | Buttons, inputs, checkboxes, dropdown items           |
| md        | 8px                            | Feed cards                                            |
| lg        | 10px                           | Sidebar, rail panels, popover menus, modals           |
| xl        | 12px                           | Picker popup                                          |
| 2xl       | 14px                           | (reserved — not currently assigned)                   |
| pill      | 999px                          | Search bar, primary button pill, avatar badge         |
| Logo icon | 25% of size (e.g. 9px at 36px) |

### Shadows

| Token                 | Value                                                             |
| --------------------- | ----------------------------------------------------------------- |
| `--shadow-nav`        | `0 1px 2px rgba(16,24,40,0.04)`                                   |
| `--shadow-card`       | `0 1px 2px rgba(16,24,40,0.04), 0 4px 12px rgba(16,24,40,0.05)`   |
| `--shadow-card-hover` | `0 2px 4px rgba(16,24,40,0.06), 0 12px 28px rgba(16,24,40,0.09)`  |
| `--shadow-popover`    | `0 8px 28px rgba(16,24,40,0.14)`                                  |
| `--shadow-modal`      | `0 16px 48px rgba(16,24,40,0.18), 0 4px 12px rgba(16,24,40,0.08)` |
| `--shadow-sticky`     | `0 -4px 16px rgba(16,24,40,0.06)`                                 |

---

## 5. Layout & Composition

### Grid / Page structure

- **Max-width:** 1440px, centered, `padding: 0 24px`
- **Top nav height:** 64px, sticky, `z-index: 30`
- **Feed layout:** `grid-template-columns: 240px minmax(0, 1fr) 280px; gap: 24px`
- **Feed card grid:** `repeat(4, minmax(0, 1fr)); gap: 18px`
- **Auth layout:** 46% left panel (max 720px) | flex right panel (max 440px form)

### Responsive breakpoints

| Breakpoint   | Behavior                                                |
| ------------ | ------------------------------------------------------- |
| ≤ 1200px     | Right rail hidden; feed 3-col (220px sidebar + grid)    |
| ≤ 1024px     | Filter sidebar hidden; full-width single-col feed       |
| Mobile HTMLs | Separate mobile screen files (`Auth Screens.html` etc.) |

### Sticky elements

- TopNav: sticky top-0, z-30
- FilterSidebar: sticky top-88px (64px nav + 24px gap)
- RightRail: sticky top-88px

### Information density

- Dense: chat message list (tight rows, small avatars)
- Standard: feed cards (4-per-row, ~200px image + 14px title + 18px price)
- Spacious: auth forms (max 440px, comfortable padding)

---

## 6. Components

### TopNav

- White surface, 1px bottom border, subtle shadow
- Logo left → Nav links (Browse / Messages / My listings) → Search bar (flex 1, max 480px) → Right cluster (Sell CTA + icon buttons + avatar dropdown)
- Nav links: pill shape, 40px height, 8px radius, primary-tint bg when active
- Search: pill shape (999px radius), 42px height, focus ring via primary-tint
- Avatar dropdown: 240px wide, 12px radius, shadow-popover

### Feed Card (FeedCard)

- White card, 10px radius, shadow-card → shadow-card-hover + translateY(-2px) on hover
- 1:1 aspect-ratio striped thumbnail top
- Heart save toggle (absolute 32px circle, top-right of image)
- Title (2-line clamp), price (700 weight, 18px), seller avatar + name + timestamp

### Filter Sidebar

- White, 12px radius, 1px border, sticky
- Sections: Sort dropdown, Categories (radio-style rows), Price (dual range slider + number chips), Condition (checkboxes)
- 11px uppercase labels in `--text-secondary`
- "Clear all filters" ghost button at bottom

### Right Rail

- Two panel cards: "Recently viewed" + "New this week"
- Mini item rows: 48px striped thumb + 2-line title + price + "New" badge

### Item Detail (2-column layout)

- Left: large striped thumb (40% width), seller avatar + info, action buttons
- Right: full description, price, location, chat CTA

### Chat (two-pane)

- Left pane: conversation list (narrow, scrollable)
- Right pane: message thread + item card header + sticky composer
- Received bubbles: `--bubble-received` (#f0f0f0) background, left-aligned
- Sent bubbles: `--primary` (#fa4617) background, white text, right-aligned

### Auth screens

- Split-screen: primary-colored left panel (46%) with Logo, headline, decorative card stack
- White right panel (54%) with Microsoft SSO button + form
- Decorative cards: rotated -4° to +3°, category-palette thumbnails

### Close Deal Modal

- Centered modal, 12px radius, shadow-modal
- Step A: buyer list with avatars and select state
- Step B: item + buyer confirmation + price field + send button

### Buttons

| Variant   | Height                    | Background                            | Text color  | Border              |
| --------- | ------------------------- | ------------------------------------- | ----------- | ------------------- |
| Primary   | 44px md, 50px lg, 36px sm | `--primary` → hover `--primary-hover` | `#fff`      | none                |
| Secondary | 44px md, 50px lg, 36px sm | `#fff` → hover `--primary-tint`       | `--primary` | 1.5px solid primary |
| Tertiary  | 44px                      | transparent → `#f1f1f1` hover         | `--text`    | none                |
| Icon btn  | 40px circle               | transparent → `#f1f1f1` hover         | `--text`    | none                |

Primary button box-shadow on hover: `0 4px 12px rgba(250,70,23,0.28)`

### Form controls

| Control   | Height              | Border              | Focus                                  |
| --------- | ------------------- | ------------------- | -------------------------------------- |
| TextInput | 46px                | 1.5px border        | primary border + 4px primary-tint ring |
| TextArea  | auto                | 1.5px border        | primary border + 4px primary-tint ring |
| Dropdown  | 46px                | 1.5px border        | primary border + 4px primary-tint ring |
| Checkbox  | 18×18px, 4px radius | 1.5px border-strong | primary fill when checked              |
| Toggle    | 42×24px pill        | inside card         | left 2px off, left 20px on             |

### Badges / chips

- Notification badge: 18px circle, primary bg, white text, 2px white border
- Category "New" badge: 9.5px mono uppercase, primary text, primary-tint bg, 4px radius
- Nav badge: 18×18px, primary or `#1a1a1a` bg depending on active state

### Logo

- Square icon: `border-radius: 25% of size`, orange-red bg (`#fa4617`), white arrow-exchange SVG
- Wordmark: "SWAP", 800 weight Inter
- Tagline: "Student marketplace", 11px Inter 500, text-secondary
- Sizes: sm (28px icon), md (36px icon), lg (44px icon)
- White variant: frosted glass icon with rgba border, white text

---

## 7. Motion & Interaction

### Timing

- Default transition: `120ms ease` (buttons, nav, hover states)
- Card hover: `160ms ease` (box-shadow + transform)
- Dropdown caret: `120ms ease` (rotate 180°)
- Toggle thumb: `140ms ease` (left position)
- Menu open: `scaleIn` animation `scale(0.96→1) + opacity(0→1)`
- Toast: `toastIn` animation `translate(-50%, 20px→0) + opacity(0→1)`

### Focus ring

- `outline: 2px solid var(--primary); outline-offset: 2px; border-radius: 6px`
- Applied via `:focus-visible` on buttons, inputs, links, [tabindex] elements

### Loading state

- Inline `Spinner`: 18px circle, 2px border, `borderTopColor` spins at 700ms linear

### Reduced motion

- No explicit `prefers-reduced-motion` override in source. Should suppress transform/translate animations when adding.

### Scroll

- Sidebar + right rail: `scrollbar-width: none` / `::-webkit-scrollbar { display: none }`

---

## 8. Voice & Brand

**App name:** Swap (wordmark renders as "sw**a**p" with the "a" in `--primary` orange-red)

**Tagline:** "Student marketplace"

**Domain:** @kmutt.ac.th (Microsoft account verification)

**Copy tone:**

- Direct and campus-friendly: "Buy and sell with fellow KMUTT students."
- Specific rather than abstract: names real items (Calculus textbooks, IKEA MALM desk, TI-84 calculator)
- No corporate jargon; reads like a trusted campus notice board
- Past tense for item descriptions ("light highlighting", "worn once", "recently serviced")

**Capitalization:**

- Nav labels: title case (Browse, Messages, My listings)
- Sidebar section labels: ALL CAPS, 11px, letter-spacing 0.6px
- Category tags: lowercase in JetBrains Mono with brackets: `[Calculus textbook]`
- Status badges: ALL CAPS, 9.5px

**Terminology:**

- "Seller" / "Buyer" (not "Vendor" / "Customer")
- "Listing" (not "product" or "post")
- "Close deal" (final step for confirming a buyer)
- "Sell" (primary action verb on the CTA)

---

## 9. Anti-patterns

- ❌ Do not use warm beige / peach / cream backgrounds — the canonical page bg is `#f7f7f7`, not any warm neutral
- ❌ Do not invent colors outside the palette — derive new values with oklch only from documented hue families
- ❌ Do not use Inter as a display face with weight < 700 for headings
- ❌ Do not use border-radius > 14px on any container (except pill = 999px)
- ❌ Do not use colored card backgrounds — all cards are white (`#ffffff`)
- ❌ Do not add gradients to surface or card backgrounds — only allowed as subtle radial overlay on the auth left panel
- ❌ Do not use emoji as feature icons — use outline SVG icons (stroke 2px, strokeLinecap round/join round)
- ❌ Do not show designer controls (screen picker, viewport toggles, platform selectors) in product artifacts
- ❌ Do not use aria-hidden on interactive elements
- ❌ Do not use font-family other than Inter (UI) or JetBrains Mono (mono/tag) — no Arial, Roboto, or system serif
- ❌ Do not use shadows on nav-level surfaces — only shadow-nav (1px bottom border + 1px 2px rgba subtle)
- ❌ Do not use `scrollIntoView` — use scroll APIs or CSS `scroll-behavior`
- ❌ Do not fake verification — the product relies on real @kmutt.ac.th Microsoft SSO; never mock "verified" badges in ways that could mislead
