---
applyTo: 'apps/api/**'
---

## Folder structure — Backend (apps/api/src)

Every feature lives in its own module folder under src/modules/:

- `*.routes.ts` — route wiring only, no logic
- `*.controller.ts` — HTTP layer only, calls service, no DB queries
- `*.service.ts` — all business logic and Prisma queries, no req/res
- `*.dto.ts` — zod schemas and exported TypeScript types only

Shared code lives in src/common/:

- `common/utils/` — asyncHandler, errors, response helpers
- `common/middleware/` — auth, validate, error middleware
- `common/lib/` — prisma singleton, firebase admin, storage

Never put database queries in controllers.
Never put req/res objects in services.
Never import from another module's service directly — go through the route layer.

---

## Backend patterns — always follow these exactly

### Controllers

Always wrap async controllers with asyncHandler:

```typescript
import asyncHandler from '../../common/utils/asyncHandler';
import { success, paginated } from '../../common/utils/response';

export const getItem = asyncHandler(async (req, res) => {
  const item = await itemsService.getItemById(req.params.itemId);
  return success(res, { item });
});
```

Never write raw res.json() — always use success() or paginated().
Never write try/catch in controllers — asyncHandler handles this.

### Error handling

Always use AppError helpers from common/utils/errors.ts:

```typescript
import { notFound, forbidden, badRequest, conflict } from '../../common/utils/errors';

if (!item) throw notFound('Item');
if (item.sellerId !== req.user.id) throw forbidden();
```

Never use raw `res.status(404).json(...)`.
Always pass errors to next() via asyncHandler — never swallow them.

### Validation

Always validate request bodies and query params with the validate middleware:

```typescript
import { validate } from '../../common/middleware/validate.middleware';
import { CreateItemDto } from './items.dto';

export const createItem = [
  validate(CreateItemDto, 'body'),
  asyncHandler(async (req, res) => { ... }),
];
```

### Database

Always use the Prisma singleton from common/lib/prisma.ts:

```typescript
import prisma from '../../common/lib/prisma';
```

Always wrap multi-table writes in a Prisma transaction:

```typescript
await prisma.$transaction(async (tx) => {
  const item = await tx.item.create({ ... });
  await tx.itemImage.updateMany({ ... });
  return item;
});
```

Never write raw SQL strings.
Never instantiate PrismaClient more than once.

### Response format

All responses must use these helpers:

```typescript
// single resource
return success(res, { item });

// paginated list
return paginated(res, items, { page, limit, total, totalPages });

// created resource
return success(res, { item }, 201);

// no content
return success(res, null, 204);
```

---

## Always check common before writing anything new

- `apps/api/src/common/utils/` — asyncHandler, errors, response helpers
- `apps/api/src/common/middleware/` — auth, validate, error middleware
- `apps/api/src/common/lib/` — prisma singleton, firebase admin, storage

| Need                                                      | Import from                                   |
| --------------------------------------------------------- | --------------------------------------------- |
| Async controller wrapper                                  | `../../common/utils/asyncHandler`             |
| Error helpers (notFound, forbidden, badRequest, conflict) | `../../common/utils/errors`                   |
| Response helpers (success, paginated)                     | `../../common/utils/response`                 |
| Prisma client                                             | `../../common/lib/prisma`                     |
| Firebase admin                                            | `../../common/lib/firebase`                   |
| Storage presign helper                                    | `../../common/lib/storage`                    |
| Auth middleware (requireAuth, requireOwnership)           | `../auth/auth.middleware`                     |
| Request validation middleware                             | `../../common/middleware/validate.middleware` |

- Never create a new PrismaClient — import from common/lib/prisma
- Never write a new error helper — use notFound, forbidden, badRequest, conflict from common/utils/errors
- Never write a new try/catch in a controller — use asyncHandler from common/utils/asyncHandler
- Never write a new res.json() — use success() or paginated() from common/utils/response
- If something you need does not exist in common yet, create it there first and then import it
