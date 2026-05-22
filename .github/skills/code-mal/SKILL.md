---
name: code-with-zayar
description: >
  Use when a team member provides a todo name and wants to implement
  a feature. Reads the todo checklist and instructions, shows a
  plan, asks clarifying questions, then implements step by step.
  Triggered by phrases like "implement auth", "work on feed",
  "start on transactions", "do the chat feature".
---

# Implement Todo Skill

You are helping a team member implement a feature for Swap,
a university second-hand marketplace. The team member may not
have a coding background. Guide them clearly at every step.

---

## Step 1 — Read the todo file

The team member will give you a todo name. Map it to the correct file:

| Todo name                               | File                            |
| --------------------------------------- | ------------------------------- |
| auth, authentication, login, microsoft  | docs/auth.checklist.md          |
| feed, home, listings, browse            | docs/feed.checklist.md          |
| items, upload, listing, item detail     | docs/items.checklist.md         |
| chat, conversations, messages, firebase | docs/conversations.checklist.md |
| transactions, close deal, sold, deal    | docs/transactions.checklist.md  |
| profile, user, edit profile             | docs/profile.checklist.md       |

Read the matched checklist file from the repo root docs/ folder in full.
Read all instruction files from .github/skills/implement-todo/instructions/ in full.

---

## Step 1.5 — Read Open Design MCP for UI tasks

After reading the todo file, check if any unchecked tasks involve UI or frontend work.
Look for tasks containing keywords like: page, component, screen, layout, form,
button, modal, input, card, nav, style, color, spacing, typography, responsive.

If any UI tasks exist:

1. Connect to the Open Design MCP server
2. Query the design for each relevant screen or component:

   For page-level screens query by screen name:
   - Login screen → query "login"
   - Complete profile → query "complete profile"
   - Home feed → query "feed" or "home"
   - Item detail → query "item detail"
   - Item upload → query "item upload" or "new item"
   - Chat list → query "conversations" or "chat list"
   - Chat conversation → query "chat" or "conversation"
   - User profile → query "profile"
   - Edit profile → query "edit profile"
   - Close deal modal → query "close deal" or "mark as sold"

3. From the MCP response extract and store:
   - Exact color values and which Tailwind token they map to
   - Typography — font size, weight, line height per element
   - Spacing — padding, margin, gap values in px converted to Tailwind scale
   - Border radius per component type (card, button, modal, input)
   - Component hierarchy — which elements are children of which
   - Interactive states — hover, active, disabled, error appearances
   - Responsive behavior — how layout changes between mobile and desktop

4. Map design values to your token system:
   | Design value | Tailwind class to use |
   |---|---|
   | #fa4617 | bg-primary / text-primary |
   | #d93a13 | bg-primary/hover (hover:bg-primary/90) |
   | #ffffff | bg-background / text-background |
   | #1a1a1a | text-foreground |
   | #6b6b6b | text-muted-foreground |
   | #f7f7f7 | bg-muted |
   | #e5e5e5 | border |
   | #10b981 | text-success / bg-success |
   | #dc2626 | text-destructive / bg-destructive |
   | 10px radius | rounded (uses --radius CSS var) |
   | 8px radius | rounded-btn (uses --radius-btn CSS var) |
   | 12px radius | rounded-modal (uses --radius-modal CSS var) |

5. If Open Design MCP is unavailable or returns no result:

   Skip Step 1.5 and proceed directly to Step 2. Use Tailwind token classes for all colors and spacing per CLAUDE.md.

## Step 2 — Show a plan before writing any code

After reading the todo and instructions, show the team member
a clear implementation plan in this exact format:

```

## Implementation Plan — [Feature Name]

### What I will build

[2-3 sentence summary of what this feature does and why it matters]

### Files I will create or modify

- `path/to/file.ts` — [one line description of what changes]
- `path/to/file.tsx` — [one line description of what changes]
  [list every file]

### Order of implementation

1. [first thing to build and why it comes first]
2. [second thing]
3. [and so on]

### Assumptions I am making

- [list any assumption about existing code, data, or behavior]

### What I need from you before I start

- [list any question that would change the implementation]

```

Do not write any code in this step.
Do not skip this step even if the task seems simple.

---

## Step 3 — Ask followup questions

After showing the plan, always ask:

1. Does this plan look correct to you?
2. Are there any tasks in the checklist you want to skip for now?
3. Is there anything in the plan that doesn't match what you expected?

Wait for the team member to respond before proceeding.
If they say "looks good" or "yes" or "go ahead" — proceed to Step 4.
If they ask to change something — update the plan and confirm again.

---

## Step 4 — Implement one task at a time

Work through the todo checklist from top to bottom.
For each unchecked item:

1. Say which task you are working on:
   "Working on: [ ] Task name from checklist"

2. Read the relevant instruction file for this task:
   - Backend task → read instructions/backend.instructions.md
   - Frontend task → read instructions/frontend.instructions.md
   - Types task → read instructions/types.instructions.md

3. If this is a UI task, apply the Open Design MCP data read in Step 1.5:
   - Use exact spacing values from the design
   - Use exact typography values from the design
   - Use Tailwind token classes — never hardcode hex values
   - Match component hierarchy from the design exactly
   - Apply all interactive states (hover, disabled, error) from the design
   - If MCP returned no data for this specific component,
     use the design system tokens from globals.css as fallback

4. Check common folders before creating anything new:
   - Backend: apps/api/src/common/
   - Frontend: apps/web/src/common/components/ and common/components/ui/
   - Types: packages/types/src/
     Never recreate something that already exists.

5. Implement the task following the instructions and design spec exactly.

6. After completing, show the team member:
   "✅ Done: [task name]"
   "Next: [next task name] — should I continue?"

Wait for confirmation before moving to the next task.

---

## Step 5 — Handle blockers

If a task cannot be completed because something else is missing:

```

⚠️ Blocked: [task name]
Reason: [clear explanation of what is missing]
Options:
(A) Skip this task and come back later
(B) Build the missing dependency first (adds [X] extra tasks)
(C) Use a stub/placeholder for now
Which would you prefer?

```

Wait for the team member to choose before continuing.

---

## Step 6 — End of session summary

When all tasks are done or the team member wants to stop, show:

```

## Session Summary

### Completed this session

- ✅ [task]
- ✅ [task]

### Still remaining

- [ ] [task]
- [ ] [task]

### What to do next

[clear instruction for what the next session should start with]

### Any issues to flag for team lead

[anything that needs review, a decision, or a fix from someone else]

```

---

## Rules to always follow

- Never write code that contradicts the instruction files
- Never skip the plan and question step
- Never implement more than one task at a time without confirmation
- Always check common/ before creating new files
- Always use existing types from @swap/types before defining new ones
- Always use asyncHandler, success(), notFound() from common/utils
- Never use password auth, localStorage outside of axios/authStore,
  raw res.json(), or React.FC
- Never implement saved items or reports — these features are removed
- Never add draft status to items — items post as active immediately
- If the team member seems confused, explain what you are doing
  in plain language before showing code

```

```
