# Commit Message Guide

All commit messages must follow the Conventional Commits format.
Commitlint enforces this on every commit automatically.

## Format

```
<type>(<scope>): <subject>

[optional body]

[optional footer]
```

## Types

| Type     | When to use                                     |
| -------- | ----------------------------------------------- |
| feat     | Adding a new feature                            |
| fix      | Fixing a bug                                    |
| chore    | Config changes, dependency updates, maintenance |
| docs     | README, comments, documentation only            |
| style    | Formatting only, no logic change                |
| refactor | Restructuring code without changing behavior    |
| perf     | Performance improvements                        |
| test     | Adding or updating tests                        |
| build    | Build system or dependency changes              |
| ci       | CI/CD pipeline changes                          |
| revert   | Reverting a previous commit                     |

## Scopes (optional but recommended)

Use the module or area you are working in:

| Scope         | Area                          |
| ------------- | ----------------------------- |
| auth          | Authentication module         |
| feed          | Home feed                     |
| items         | Item upload and detail        |
| conversations | Chat system                   |
| transactions  | Close deal / transactions     |
| profile       | User profile                  |
| uploads       | File upload                   |
| common        | Shared components or utils    |
| db            | Database schema or migrations |
| config        | Project configuration         |
| deps          | Dependency updates            |

## Examples

Good commits:

```
feat(items): add image carousel to item detail page
fix(auth): redirect to complete profile when onboarded is false
chore(deps): update prisma to 5.12.0
refactor(conversations): extract pinned item card into separate component
feat(transactions): implement close deal modal variant b
fix(feed): filter out deleted items from home feed query
docs: update README with dev setup instructions
chore(config): add commitlint to husky pre-commit hooks
style(profile): fix inconsistent spacing in profile header
```

Bad commits — these will be BLOCKED:

```
update stuff
WIP
fixed it
Added new feature.
FEAT: something
fix: Fixed the bug.
```

## Breaking changes

If your commit introduces a breaking change add an exclamation mark after the type/scope and describe it in the footer:

```
feat(auth)!: replace jwt session with microsoft oauth token

BREAKING CHANGE: existing jwt sessions are invalidated, all users must log in again
```

## Multi-line commits

For complex changes add a body after a blank line:

```
feat(transactions): implement atomic close deal flow

runs item status update, transaction insert, and firebase
system message write inside a single prisma transaction.
if any step fails the entire operation rolls back.
```
