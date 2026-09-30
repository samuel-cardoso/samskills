---
name: i18n-next-intl-front-end
description: Defines this repo's next-intl translation key convention — the key must be the pt-BR value transliterated to camelCase (not an abstract name), keys mirrored across messages/pt-BR.json and messages/en.json, and useTranslations hooks bound to descriptive variable names per feature. Use when adding, renaming, or reviewing translation keys, editing messages/pt-BR.json or messages/en.json, or writing a useXTranslations hook or a Zod schema that needs localized messages. Not for general React Hook Form or Zod validation logic unrelated to i18n.
license: CC-BY-4.0
metadata:
  author: Samuel
  version: 1.0.0
  category: Frontend
  tags: [i18n, next-intl, traducao]
  summary: "Convenção de chave de tradução next-intl: chave é o valor pt-BR transliterado pra camelCase (nunca um nome abstrato), chaves espelhadas em pt-BR.json e en.json, hooks useTranslations com nome descritivo por feature."
---

# i18n (next-intl)

Convention for translation keys, hook naming, and locale files in this repo's next-intl setup.

## Instructions

### Locale mechanics

Locale is stored in a `locale` cookie (default fallback `pt-BR`), read in `lib/i18n/request.ts` and changed via the `changeLocale` server action in `lib/i18n/actions.ts`. `en` and `pt-BR` are both fully wired end-to-end; `pt-BR` is the product default.

### Key naming: transliterate the pt-BR value

Translation strings live in `messages/pt-BR.json` and `messages/en.json`, camelCase keys grouped by namespace. The key must be the pt-BR value itself, transliterated to camelCase — never an abstract or generic name like `titulo`, `descricao`, or `mensagem`.

Steps to derive a key from a pt-BR value:

1. Drop accents/diacritics (`é`→`e`, `ã`→`a`) — except a standalone `é` becomes a capitalized `E` mid-word (see example below), it is not dropped.
2. Drop trailing/internal punctuation (`.`, `...`, `!`, `,`).
3. Keep every word from the sentence — do not paraphrase or drop words for brevity.
4. camelCase the result. Digits stay as-is, concatenated.

Examples:

- `"Bem-vindo de volta, chefe!"` → `bemVindoDeVoltaChefe` (not `bemVindoDeVolta` — don't drop "chefe"; not `boasVindas` — no abstract paraphrase)
- `"Senha é obrigatória"` → `senhaEObrigatoria`
- `"Insira seu e-mail ou telefone abaixo para fazer login em sua conta."` → `insiraSeuEmailAbaixoParaFazerLoginEmSuaConta`
- `"Exemplo: joao@email.com ou (11) 99999-9999"` → `exemploJoaoEmailComOu11999999999`

There are no exceptions for "ugly" results — a long or unwieldy key is the expected cost of being self-describing.

### The one exception: collisions

If two distinct messages happen to share identical text (e.g. a page title and a button both reading "Entrar"), disambiguate the second with a short suffix describing where it's used: `entrarBotao`.

### Only add keys that are referenced

Only add a key if it's actually referenced from code. This file has been pruned of unused keys before — keep it that way. Don't add speculative keys ahead of the component that needs them.

### Keep both locale files in sync

Keys are identical across `pt-BR.json` and `en.json` — only the values differ per locale. When adding or renaming a key, update both files together in the same change.

### Hook naming

Feature-specific translation hooks live in `hooks/useTranslations.ts`. Each `useTranslations(namespace)` call is bound to a descriptive variable name for what it translates, e.g.:

- `useLoginTranslations` returns `{ general, validation, toast }`
- `useUsersTranslations` / `useWorkshopsTranslations` return `{ general, table }`

Never bind it to a bare `t`, `tz`, or `tt`. When a hook only has a single, generic translator and nothing more specific fits (e.g. `useErrorStateTranslations`), name it `translate` instead of `t`.

### Zod schemas stay framework-agnostic

Zod schemas that need localized messages (see `loginSchema`) take the translator as a parameter (e.g. `validation`) rather than importing translations directly, so the schema has no dependency on next-intl.

## Examples

### Example 1: new form field

User: "add a 'Nome da oficina' required field to the signup form"
Actions: add key `nomeDaOficina` (label) and, if the pt-BR copy is "Nome da oficina é obrigatório", `nomeDaOficinaEObrigatorio` (validation message) — to both `messages/pt-BR.json` and `messages/en.json`, under the signup namespace.
Result: keys added to both files in the same change, referenced from the form component and its Zod schema.

### Example 2: new feature hook

User: "wire up translations for the new invoices page"
Actions: add `useInvoicesTranslations` to `hooks/useTranslations.ts`, returning `{ general, table }` (or whatever sub-groups the namespace actually needs) — not a bare `t`.
Result: consistent with `useUsersTranslations` / `useWorkshopsTranslations`.

### Example 3: collision

Both a modal title and its confirm button read "Confirmar".
Actions: title key `confirmar`, button key `confirmarBotao`.
Result: no key collision; the suffix documents where the second one is used.

## Troubleshooting

### Tempted to use a short/abstract key

Cause: the transliterated key looks long or odd for the given copy.
Solution: use it anyway — there is no length or aesthetics exception, only the documented collision exception.
