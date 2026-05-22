## Shared types — always check before defining anything new

All shared TypeScript interfaces and types live in `packages/types/src/` and are exported as `@swap/types`.

| Need                                                                                | Import from   |
| ----------------------------------------------------------------------------------- | ------------- |
| User, PublicUser, CompleteProfilePayload                                            | `@swap/types` |
| Item, ItemStatus, ItemCategory, ItemCondition, CreateItemPayload, UpdateItemPayload | `@swap/types` |
| Conversation, CreateConversationPayload, FirebaseMessage                            | `@swap/types` |
| Transaction, CreateTransactionPayload                                               | `@swap/types` |
| ApiResponse<T>, PaginatedResponse<T>                                                | `@swap/types` |

- Never redefine User, Item, Transaction, or Conversation types — import from @swap/types
- If a new shared type is needed, add it here in packages/types/src/ — never define it in apps/api or apps/web
