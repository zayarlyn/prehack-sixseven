# Copilot Instructions — Swap

You are helping build Swap, a university second-hand marketplace.
Read and follow all rules below on every suggestion you make.

---

## Stack

- Frontend: React, Vite, TypeScript, TanStack Router, React Query, Axios, shadcn/ui, Tailwind CSS
- Backend: Express, TypeScript, Prisma, SQLite
- Shared types: @swap/types (packages/types/src)
- Chat: Firebase Realtime Database
- File storage: Presigned URLs — backend generates URL, frontend uploads directly

---

## Naming conventions

- Files: camelCase (itemController.ts, ItemCard.tsx)
- Variables and functions: camelCase (getItemById, useCreateItem)
- React components: PascalCase (ItemCard, ProfileHeader)
- Database columns: snake_case (seller_id) — Prisma maps these automatically
- Constants: UPPER_SNAKE_CASE (MAX_IMAGES_PER_ITEM)
- Zod schemas: PascalCase with Dto suffix (CreateItemDto)
- TypeScript types inferred from zod: PascalCase with Input suffix (CreateItemInput)
- Route files: kebab-case for folders, camelCase for files (saved-items/savedItems.routes.ts)

---

## Git rules

- Never commit directly to main or dev
- Always work on a feature branch: feature/<your-name>-<feature>
- Commit messages must follow conventional commits format:
  feat(scope): subject
  fix(scope): subject
  chore(scope): subject
- Subject must be lowercase, no period at end, max 100 chars
- One logical change per commit — do not batch unrelated changes

---

## Things Copilot must never do

- Never generate password fields, password hashing, or email/password auth — we use Microsoft OAuth only
- Never generate saved items or report features — these have been removed
- Never generate a draft item status — items are active immediately on creation
