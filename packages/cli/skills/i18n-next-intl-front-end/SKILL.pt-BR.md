---
name: i18n-next-intl-front-end
description: Define a convenção de chave de tradução next-intl deste repo — a chave precisa ser o valor pt-BR transliterado pra camelCase (não um nome abstrato), chaves espelhadas entre messages/pt-BR.json e messages/en.json, e hooks useTranslations ligados a nomes de variável descritivos por feature. Use ao adicionar, renomear ou revisar chaves de tradução, editar messages/pt-BR.json ou messages/en.json, ou escrever um hook useXTranslations ou um schema Zod que precise de mensagens localizadas. Não serve para lógica geral de React Hook Form ou Zod sem relação com i18n.
license: CC-BY-4.0
metadata:
  author: Samuel
  version: 1.0.0
  category: Frontend
  tags: [i18n, next-intl, traducao]
  summary: "Convenção de chave de tradução next-intl: chave é o valor pt-BR transliterado pra camelCase (nunca um nome abstrato), chaves espelhadas em pt-BR.json e en.json, hooks useTranslations com nome descritivo por feature."
---

# i18n (next-intl)

Convenção de chaves de tradução, nomenclatura de hooks e arquivos de locale no setup next-intl deste repo.

## Instruções

### Mecânica de locale

O locale fica em um cookie `locale` (fallback padrão `pt-BR`), lido em `lib/i18n/request.ts` e alterado pela server action `changeLocale` em `lib/i18n/actions.ts`. `en` e `pt-BR` estão ambos totalmente ligados de ponta a ponta; `pt-BR` é o padrão do produto.

### Nomenclatura de chave: translitere o valor pt-BR

As strings de tradução vivem em `messages/pt-BR.json` e `messages/en.json`, com chaves camelCase agrupadas por namespace. A chave precisa ser o próprio valor pt-BR, transliterado pra camelCase — nunca um nome abstrato ou genérico como `titulo`, `descricao` ou `mensagem`.

Passos para derivar uma chave a partir de um valor pt-BR:

1. Remova acentos/diacríticos (`é`→`e`, `ã`→`a`) — exceto um `é` isolado, que vira um `E` maiúsculo no meio da palavra (veja o exemplo abaixo); ele não é removido.
2. Remova pontuação final/interna (`.`, `...`, `!`, `,`).
3. Mantenha todas as palavras da frase — não parafraseie nem descarte palavras por brevidade.
4. Aplique camelCase ao resultado. Dígitos ficam como estão, concatenados.

Exemplos:

- `"Bem-vindo de volta, chefe!"` → `bemVindoDeVoltaChefe` (não `bemVindoDeVolta` — não descarte "chefe"; não `boasVindas` — sem paráfrase abstrata)
- `"Senha é obrigatória"` → `senhaEObrigatoria`
- `"Insira seu e-mail ou telefone abaixo para fazer login em sua conta."` → `insiraSeuEmailAbaixoParaFazerLoginEmSuaConta`
- `"Exemplo: joao@email.com ou (11) 99999-9999"` → `exemploJoaoEmailComOu11999999999`

Não há exceções para resultados "feios" — uma chave longa ou desajeitada é o custo esperado de ser autodescritiva.

### A única exceção: colisões

Se duas mensagens distintas tiverem exatamente o mesmo texto (ex.: um título de página e um botão, ambos "Entrar"), desambigue a segunda com um sufixo curto descrevendo onde ela é usada: `entrarBotao`.

### Só adicione chaves que sejam referenciadas

Só adicione uma chave se ela for de fato referenciada pelo código. Este arquivo já foi limpo de chaves não usadas antes — mantenha assim. Não adicione chaves especulativas antes do componente que precisa delas.

### Mantenha os dois arquivos de locale em sincronia

As chaves são idênticas entre `pt-BR.json` e `en.json` — só os valores mudam por locale. Ao adicionar ou renomear uma chave, atualize os dois arquivos juntos, na mesma mudança.

### Nomenclatura de hooks

Hooks de tradução específicos de feature vivem em `hooks/useTranslations.ts`. Cada chamada `useTranslations(namespace)` é ligada a um nome de variável descritivo do que ela traduz, ex.:

- `useLoginTranslations` retorna `{ general, validation, toast }`
- `useUsersTranslations` / `useWorkshopsTranslations` retornam `{ general, table }`

Nunca ligue a um `t`, `tz` ou `tt` pelado. Quando um hook tem apenas um tradutor único e genérico e nada mais específico se encaixa (ex.: `useErrorStateTranslations`), chame-o de `translate` em vez de `t`.

### Schemas Zod permanecem agnósticos de framework

Schemas Zod que precisam de mensagens localizadas (veja `loginSchema`) recebem o tradutor como parâmetro (ex.: `validation`) em vez de importar traduções direto, então o schema não tem dependência do next-intl.

## Exemplos

### Exemplo 1: novo campo de formulário

Usuário: "adiciona um campo obrigatório 'Nome da oficina' no formulário de cadastro"
Ações: adicionar a chave `nomeDaOficina` (label) e, se o texto pt-BR for "Nome da oficina é obrigatório", `nomeDaOficinaEObrigatorio` (mensagem de validação) — nos dois arquivos `messages/pt-BR.json` e `messages/en.json`, sob o namespace de cadastro.
Resultado: chaves adicionadas nos dois arquivos na mesma mudança, referenciadas pelo componente do formulário e pelo seu schema Zod.

### Exemplo 2: hook de nova feature

Usuário: "liga as traduções da nova página de invoices"
Ações: adicionar `useInvoicesTranslations` em `hooks/useTranslations.ts`, retornando `{ general, table }` (ou os subgrupos que o namespace realmente precisar) — não um `t` pelado.
Resultado: consistente com `useUsersTranslations` / `useWorkshopsTranslations`.

### Exemplo 3: colisão

Tanto o título de um modal quanto seu botão de confirmação dizem "Confirmar".
Ações: chave do título `confirmar`, chave do botão `confirmarBotao`.
Resultado: sem colisão de chave; o sufixo documenta onde a segunda é usada.

## Solução de problemas

### Tentação de usar uma chave curta/abstrata

Causa: a chave transliterada parece longa ou estranha para o texto em questão.
Solução: use assim mesmo — não há exceção de tamanho ou estética, apenas a exceção documentada de colisão.
