---
name: code-organization-front-end
description: Define a convenção deste repo sobre onde vive cada código TypeScript novo — interfaces/types (incluindo Props de componente), constants, schemas Zod, hooks e componentes — e a regra de re-export por barrel (lib/types/index.ts, lib/constants/index.ts, lib/zod/schemas/index.ts, hooks/index.ts, components/index.ts). Use ao criar um novo type, interface, constant, schema Zod, hook ou componente, ou ao decidir onde a interface de Props de um componente deve ficar. Não serve para decidir a lógica interna, a estilização ou o nome do próprio componente.
license: CC-BY-4.0
metadata:
  author: Samuel
  version: 1.0.0
  category: Frontend
  tags: [typescript, arquitetura, convencoes]
  summary: "Define onde cada tipo de código TypeScript novo vive — types, constants, schemas Zod, hooks, componentes — e a regra de barrel export que os torna importáveis via @/*."
---

# Organização de código

Onde vive cada código TypeScript novo neste repo, e a regra de barrel export que o torna alcançável por imports `@/*`.

## Instruções

### As cinco superfícies exportadas por barrel

Cada um destes diretórios tem um `index.ts` que é a superfície canônica de import — o código importa de `@/hooks`, `@/components`, `@/lib/types`, `@/lib/constants`, `@/lib/zod/schemas`, nunca direto de um arquivo individual dentro deles.

| Tipo de código                          | Vive em                | Nomenclatura de arquivo                                                        | Barrel                     |
| --------------------------------------- | ---------------------- | ------------------------------------------------------------------------------ | -------------------------- |
| Types, interfaces, **Props de componente** | `lib/types/*.ts`       | `{dominio}Type.ts` (ex.: `serviceOrderType.ts`, `customerType.ts`)             | `lib/types/index.ts`       |
| Constants                               | `lib/constants/*.ts`   | descritivo, sem sufixo fixo (ex.: `menuItems.ts`, `serviceOrderChecklist.ts`)  | `lib/constants/index.ts`   |
| Schemas Zod                             | `lib/zod/schemas/*.ts` | `{acao}{Dominio}Schema.ts` (ex.: `createBudgetSchema.ts`)                      | `lib/zod/schemas/index.ts` |
| Hooks                                   | `hooks/*.ts`           | `use{Dominio}.ts`                                                              | `hooks/index.ts`           |
| Componentes                             | `components/**/*.tsx`  | `PascalCase.tsx`                                                               | `components/index.ts`      |

Sempre que adicionar um novo hook, componente, type, util, constant ou schema Zod: exporte-o também do arquivo barrel correspondente. Um arquivo que existe mas não é re-exportado do seu barrel é invisível para a convenção de import do resto do codebase — trate isso como incompleto, não como polimento opcional.

### Interfaces de Props de componente vão em lib/types, não inline

A interface `<NomeDoComponente>Props` de um componente pertence ao arquivo de domínio `lib/types/*.ts` correspondente (ex.: `ServiceOrderChecklistCardProps` vive em `lib/types/serviceOrderType.ts`, junto aos outros types `ServiceOrder*`), re-exportada de `lib/types/index.ts`, e importada no arquivo do componente com `import type { ComponentNameProps } from '@/lib/types';`.

Isso vale para **componentes novos daqui pra frente**. O repo hoje tem uma mistura — alguns componentes mais antigos ainda declaram `Props` inline — e essa dívida é aceitável: não migre uma interface `Props` inline para `lib/types` só porque você mexeu no arquivo por outro motivo. Siga esta regra apenas ao escrever a interface de Props de um componente **novo**.

Se uma interface de Props precisar de um type do `react-hook-form` (`Control<T>`, `FieldErrors<T>`) ligado a um type de formulário inferido pelo Zod, importe esse type de formulário de `@/lib/zod/schemas` para dentro do arquivo `lib/types/*.ts` — esse é um padrão já estabelecido no codebase (veja o uso de `CreateServiceOrderFormData` / `ServiceOrderChecklistFormData` em `lib/types/serviceOrderType.ts`), e não um novo risco de dependência circular, já que arquivos de schema em `lib/zod/schemas/` não importam de `lib/types/`.

### Onde vai o arquivo de types de um domínio novo

Se ainda não existe um arquivo `{dominio}Type.ts` para a feature que você está construindo, crie um (ex.: um `invoiceType.ts` novinho para uma primeira feature de faturamento) em vez de pendurar types sem relação em um arquivo de domínio existente. Agrupe tudo daquele domínio ali: formatos de request/response, formatos de entidade e Props de componente igualmente.

## Exemplos

### Exemplo 1: adicionando um componente novo com Props

Usuário: "cria um componente `CustomerNotesCard` para a página de detalhe do cliente"
Ações:

1. Adicionar `CustomerNotesCardProps` em `lib/types/customerType.ts` (ou o arquivo de domínio mais próximo), junto aos types irmãos `Customer*`.
2. Re-exportar de `lib/types/index.ts`.
3. Em `components/customers/CustomerNotesCard.tsx`, `import type { CustomerNotesCardProps } from '@/lib/types';` — sem `interface CustomerNotesCardProps` inline no arquivo do componente.
   Resultado: a interface de Props vive junto aos outros types do seu domínio, e o arquivo do componente fica focado na lógica de renderização.

### Exemplo 2: adicionando um novo endpoint de API

Usuário: "adiciona um endpoint DELETE para remover uma nota de cliente"
Ações: adicionar o método em `adminApi` em `infra/api/admin.ts`, adicionar seus types de request/response no arquivo `lib/types/*.ts` correspondente, re-exportar de `lib/types/index.ts`.
Resultado: consistente com a organização dos types de todos os outros endpoints do `adminApi`.

### Exemplo 3: mexendo em um componente antigo com Props inline

Usuário: "corrige um bug no `LegacyBudgetSummary.tsx`, que ainda declara `LegacyBudgetSummaryProps` inline"
Ações: corrigir apenas o bug. Não mova `LegacyBudgetSummaryProps` para `lib/types` como parte dessa mudança — isso é aumento de escopo sem relação com a correção, conforme a regra de "apenas código novo".
Resultado: a correção fica cirúrgica; a interface de Props inline permanece como dívida preexistente.

## Solução de problemas

### Tentação de migrar uma interface de Props inline durante uma mudança sem relação

Causa: notar a inconsistência estando já dentro do arquivo.
Solução: deixe como está. Comente com o usuário de passagem, se for relevante, mas não aja — esta regra governa apenas interfaces de Props sendo escritas pela primeira vez.

### Dúvida sobre em qual arquivo `lib/types/*.ts` um type novo pertence

Causa: o type não corresponde obviamente a um arquivo de domínio existente.
Solução: veja a qual conceito de backend/feature ele pertence (espelha o agrupamento `adminApi`/`publicApi` em `infra/api/`) e adicione-o ao arquivo de types daquele domínio ou crie um novo nomeado a partir do domínio.
