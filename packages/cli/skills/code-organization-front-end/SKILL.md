---
name: code-organization-front-end
description: Defines this repo's convention for where new TypeScript code lives — interfaces/types (including component Props), constants, Zod schemas, hooks, and components — and the barrel-export re-export rule (lib/types/index.ts, lib/constants/index.ts, lib/zod/schemas/index.ts, hooks/index.ts, components/index.ts). Use when creating a new type, interface, constant, Zod schema, hook, or component, or when deciding where a component's Props interface should live. Not for deciding a component's internal logic, styling, or naming of the component itself.
license: CC-BY-4.0
metadata:
  author: Samuel
  version: 1.0.0
  category: Frontend
  tags: [typescript, arquitetura, convencoes]
  summary: "Define onde cada tipo de código TypeScript novo vive — types, constants, schemas Zod, hooks, componentes — e a regra de barrel export que os torna importáveis via @/*."
---

# Code Organization

Where new TypeScript code lives in this repo, and the barrel-export rule that makes it reachable via `@/*` imports.

## Instructions

### The five barrel-exported surfaces

Every one of these directories has an `index.ts` that is the canonical import surface — code imports from `@/hooks`, `@/components`, `@/lib/types`, `@/lib/constants`, `@/lib/zod/schemas`, never from an individual file inside them directly.

| Kind of code                           | Lives in               | File naming                                                                    | Barrel                     |
| -------------------------------------- | ---------------------- | ------------------------------------------------------------------------------ | -------------------------- |
| Types, interfaces, **component Props** | `lib/types/*.ts`       | `{domain}Type.ts` (e.g. `serviceOrderType.ts`, `customerType.ts`)              | `lib/types/index.ts`       |
| Constants                              | `lib/constants/*.ts`   | descriptive, no fixed suffix (e.g. `menuItems.ts`, `serviceOrderChecklist.ts`) | `lib/constants/index.ts`   |
| Zod schemas                            | `lib/zod/schemas/*.ts` | `{action}{Domain}Schema.ts` (e.g. `createBudgetSchema.ts`)                     | `lib/zod/schemas/index.ts` |
| Hooks                                  | `hooks/*.ts`           | `use{Domain}.ts`                                                               | `hooks/index.ts`           |
| Components                             | `components/**/*.tsx`  | `PascalCase.tsx`                                                               | `components/index.ts`      |

Whenever you add a new hook, component, type, util, constant, or Zod schema: export it from the corresponding barrel file too. A file that exists but isn't re-exported from its barrel is invisible to the rest of the codebase's import convention — treat that as incomplete, not optional polish.

### Component Props interfaces go in lib/types, not inline

A component's `<ComponentName>Props` interface belongs in the matching `lib/types/*.ts` domain file (e.g. `ServiceOrderChecklistCardProps` lives in `lib/types/serviceOrderType.ts`, next to the other `ServiceOrder*` types), re-exported from `lib/types/index.ts`, and imported into the component file with `import type { ComponentNameProps } from '@/lib/types';`.

This applies to **new components going forward**. The repo currently has a mix — some older components still declare `Props` inline — and that's acceptable debt: don't migrate an inline `Props` interface to `lib/types` just because you touched the file for an unrelated change. Only follow this rule when writing a **new** component's Props interface.

If a Props interface needs a type from `react-hook-form` (`Control<T>`, `FieldErrors<T>`) bound to a Zod-inferred form type, import that form type from `@/lib/zod/schemas` into the `lib/types/*.ts` file — this is an established pattern already in the codebase (see `CreateServiceOrderFormData` / `ServiceOrderChecklistFormData` usage in `lib/types/serviceOrderType.ts`), not a new circular-dependency risk, since schema files in `lib/zod/schemas/` don't import from `lib/types/`.

### Where a new domain's type file goes

If no `{domain}Type.ts` file exists yet for the feature you're building, create one (e.g. a brand-new `invoiceType.ts` for a first invoicing feature) rather than bolting unrelated types onto an existing domain file. Group everything for that domain there: request/response shapes, entity shapes, and component Props alike.

## Examples

### Example 1: adding a new component with Props

User: "create a `CustomerNotesCard` component for the customer detail page"
Actions:

1. Add `CustomerNotesCardProps` to `lib/types/customerType.ts` (or the closest matching domain file), next to sibling `Customer*` types.
2. Re-export it from `lib/types/index.ts`.
3. In `components/customers/CustomerNotesCard.tsx`, `import type { CustomerNotesCardProps } from '@/lib/types';` — no inline `interface CustomerNotesCardProps` in the component file.
   Result: Props interface lives with its domain's other types, component file stays focused on rendering logic.

### Example 2: adding a new API endpoint

User: "add a DELETE endpoint for removing a customer note"
Actions: add the method to `adminApi` in `infra/api/admin.ts`, add its request/response types to the matching `lib/types/*.ts` file, re-export from `lib/types/index.ts`.
Result: consistent with how every other `adminApi` endpoint's types are organized.

### Example 3: touching an old component with inline Props

User: "fix a bug in `LegacyBudgetSummary.tsx`, which still declares `LegacyBudgetSummaryProps` inline"
Actions: fix the bug only. Do not move `LegacyBudgetSummaryProps` to `lib/types` as part of this change — that's unrelated scope creep for a bug fix, per the "only new code" rule.
Result: the bug fix stays surgical; the inline Props interface is left as pre-existing debt.

## Troubleshooting

### Tempted to migrate an inline Props interface while making an unrelated change

Cause: noticing the inconsistency while already in the file.
Solution: leave it. Mention it to the user as an aside if relevant, but don't act on it — this rule only governs Props interfaces being written for the first time.

### Unsure which `lib/types/*.ts` file a new type belongs in

Cause: the type doesn't obviously match an existing domain file.
Solution: look at what backend/feature concept it belongs to (mirrors the `adminApi`/`publicApi` grouping in `infra/api/`), and either add it to that domain's existing type file or create a new one named after the domain.
