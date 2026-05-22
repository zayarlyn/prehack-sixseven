---
applyTo: '**/*.ts,**/*.tsx'
---

## TypeScript rules

- Always use strict TypeScript — no implicit any
- Always type function parameters and return values explicitly on service functions
- Use types from @swap/types for shared shapes (User, Item, Transaction, etc)
- Use zod infer for request/response types in the backend
- Prefix unused variables with underscore (\_unusedVar)
- Never use non-null assertion (!) — handle nulls explicitly
- Never use `as any` — use proper types or unknown
