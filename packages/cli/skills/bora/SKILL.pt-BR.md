---
name: bora
description: Inicia uma sessão de trabalho ativando o modo caveman full, a regra SOLID do Open-Closed Principle (OCP) e checando a disponibilidade do CodeGraph, depois reporta branch/status do git e tasks/planos em andamento antes de perguntar o objetivo da sessão. Use quando o usuário digitar /bora, disser "vamos começar", "bora começar a sessão" ou pedir para iniciar uma nova sessão de trabalho. Não use para checagens de status no meio da sessão — apenas para o início dela.
license: CC-BY-4.0
metadata:
  author: Samuel
  version: 1.3.0
  category: Workflow
  tags: [sessao, git, produtividade]
  summary: "Ritual de início de sessão: ativa caveman full, a regra OCP, checa CodeGraph e reporta branch/status do git e tasks em andamento antes de perguntar o objetivo da sessão."
---

# Bora

Ritual de início de sessão: deixa o ambiente pronto (caveman full + regra OCP + CodeGraph) e dá contexto do repo antes de começar o trabalho.

## Instruções

### Passo 1: Saudação calorosa

Sempre que `/bora` disparar, abra a sessão cumprimentando o usuário calorosamente — animado, pelo nome se souber — independentemente de a mensagem dele ter incluído uma saudação. Esta resposta rompe de propósito com a secura do caveman: o modo ainda não foi ativado (isso só acontece no passo seguinte).

Se o objetivo já vier na mesma mensagem (ex.: "bora, quero corrigir o bug de login"), confirme com entusiasmo que está pronto para começar. Caso contrário, apenas cumprimente — não pergunte aqui qual é a tarefa. O objetivo é descoberto (Passo 6, ticket do Linear) ou perguntado (Passo 9) mais adiante, quando houver de fato um motivo para perguntar em vez de adivinhar.

### Passo 2: Garantir caveman full

Invoque a skill `caveman:caveman` com o argumento `full` para garantir que o nível esteja em full (idempotente — sem problema se já estiver ativo). Daqui em diante, o resto da sessão volta ao tom seco normal do caveman.

### Passo 3: Ativar a regra SOLID — Open-Closed Principle (OCP)

Daqui em diante, aplique esta regra pelo resto da sessão a qualquer código gerado ou sugerido, em qualquer linguagem (TypeScript, C#, Python, Go, etc.):

1. **Nunca modifique código existente para adicionar comportamento novo.** Prefira extensão via herança, composição ou injeção de dependência.
2. **Elimine if/else e switch que crescem.** Se um bloco condicional cresce a cada nova feature, refatore para polimorfismo (interface + implementações).
3. **Use abstrações para comportamento variável.** Identifique o que muda (ex.: tipo de notificação, formato de arquivo, método de pagamento) e encapsule em uma interface/classe base.
4. **Features novas = classes novas, não edições.** Quando pedirem para "adicionar suporte a X", crie uma nova implementação da interface existente. Não toque nas classes atuais.
5. **Sinalize se o pedido violar o OCP.** Se o pedido implicar modificar código que já funciona, sinalize: "Essa abordagem viola o OCP. Sugiro criar [X] em vez de modificar [Y]." e apresente a alternativa correta.

Sinais rápidos de violação para observar: `if/else`/`switch` crescendo a cada nova feature, checagem explícita de tipo (`instanceof`/`typeof`/comparação de string) decidindo comportamento, ou o time evitando tocar em um arquivo com medo de quebrar outra coisa.

### Passo 4: Checar o CodeGraph

Rode `ls -d .codegraph 2>/dev/null` na raiz do repo (ou na raiz mais próxima, se o cwd for um subdiretório).

- Se existir: o repo está indexado, priorize `codegraph_explore`/`codegraph explore` em vez de grep/find pelo resto da sessão.
- Se não existir: não está indexado. Não se ofereça para rodar `codegraph init` — indexar é decisão do usuário; apenas mencione que não há índice e siga com Read/Grep normalmente.

### Passo 5: Contexto do git

Rode `git branch --show-current` e `git status -sb`.

- Reporte a branch atual e se há mudanças não commitadas (staged/unstaged/untracked).
- Se o diretório não for um repo git, diga isso e pule este passo.

### Passo 6: Buscar o ticket do Linear pela branch

Extraia o identificador do ticket do nome da branch atual (padrão `<tipo>/<id>-<slug>`, ex.: `feature/led-352-corrigir-...` → `LED-352`; sem distinção de maiúsculas, converta para o formato `TIME-NNN`).

- Se a branch bater com o padrão: chame `mcp__linear-server__get_issue` com esse id (carregue o schema via ToolSearch antes, se ainda não estiver disponível).
  - Se o ticket for encontrado: **não** cole a descrição crua. Resuma **com suas próprias palavras** o que você entendeu — o problema, o comportamento esperado e os critérios de aceite.
  - Depois pergunte ao usuário se o escopo desta sessão é **front-end, back-end ou os dois**.
  - Depois pergunte se ele quer **ativar o plan mode** — apenas se ainda não estiver ativo nesta sessão (verifique o estado mais recente de plan mode no contexto; se não houver sinal, pergunte assim mesmo, sem assumir).
  - Se o ticket não for encontrado (404/erro): mencione em uma linha e siga para o fluxo normal do Passo 9 (perguntar o objetivo).
- Se a branch não bater com o padrão (ex.: `main`, `develop`, um nome sem id de ticket): pule este passo silenciosamente, sem erro — vá para o fluxo normal do Passo 9.

Este passo substitui a pergunta genérica de objetivo do Passo 9 quando um ticket é encontrado — o objetivo já vem do ticket.

### Passo 7: Ativar a regra de armazenamento de planos

Daqui em diante, pelo resto da sessão: todo plano gerado (fluxo de plan mode — `EnterPlanMode`/`ExitPlanMode`) também deve ser salvo como arquivo markdown na pasta `plans/` na raiz do repo (crie a pasta se não existir), além do arquivo de plano interno do harness. Nome do arquivo: `<TICKET-ID>-<slug-curto>.md` quando houver ticket do Linear (Passo 6), ou um slug descritivo da tarefa quando não houver. Isso vale tanto para o plano de implementação quanto para qualquer handoff técnico derivado dele (ex.: um documento de contrato de API para outro time/agente).

### Passo 8: Trabalho pendente

- Chame `TaskList` para verificar tasks de agentes em background rodando ou na fila. Reporte se houver.
- Procure por artefatos de planejamento em andamento (ex.: `STATE.md`, um diretório `specs/` ou `.tlc/`) na raiz do repo — sinal de uma feature em andamento via `tlc-spec-driven`. Se encontrar, resuma a fase/feature atual em uma linha.

### Passo 9: Confirmar o objetivo

Se o objetivo já foi capturado no Passo 1 (saudação) ou no Passo 6 (ticket do Linear), não pergunte de novo — apenas confirme no resumo final.

Se ainda não houver objetivo claro (sem ticket, sem saudação com tarefa), pergunte em uma linha: "Qual objetivo desta sessão?" e espere a resposta antes de iniciar trabalho substancial.

### Passo 10: Resumo de prontidão

Encerre com um resumo compacto (poucas linhas): nível do caveman, regra OCP ativa, status do CodeGraph, branch/status do git, ticket do Linear encontrado (se houver) + escopo (front/back/ambos), pendências encontradas, status do plan mode e objetivo confirmado. Depois siga para o trabalho.

## Exemplos

### Exemplo 1: `/bora` puro, branch sem ticket

Ações: saudação calorosa simples, ainda sem objetivo (passo 1), passos 2-6 (branch não bate com um ticket, pulado silenciosamente), passo 9 pergunta o objetivo já que nada foi capturado ainda, encerra com resumo.

Resultado:
```
Fala Samuel! Tudo certo por aqui, animado pra começar.
```
(após checar caveman/OCP/CodeGraph/git, sem ticket correspondente:)
```
Qual objetivo desta sessão?
```
(usuário responde com o objetivo, então:)
```
Caveman full ativo. Regra OCP ativa. CodeGraph indexado (usa explore). Branch: feature/login-fix, 2 arquivos modificados não commitados. Sem tasks pendentes. Objetivo: [o que o usuário respondeu]. Bora.
```

### Exemplo 2: `/bora, fala Claude tudo certo?! Quero corrigir o bug de login`

Ações: saudação calorosa com o objetivo já capturado (passo 1), passos 2-6, passo 9 pulado (objetivo já informado), o resumo já inclui o objetivo.

Resultado:
```
Fala Samuel, tudo certo! Bora resolver esse bug de login.
```
(após checar git/CodeGraph/tasks:)
```
Caveman full ativo. Regra OCP ativa. CodeGraph não indexado neste repo. Branch: main, working tree limpo. STATE.md encontrado — feature "checkout-v2" na fase Tasks. Objetivo: corrigir bug de login. Bora.
```

### Exemplo 3: branch com um ticket do Linear (`feature/led-352-corrigir-...`)

Ações: saudação (passo 1), passos 2-5, o passo 6 encontra `LED-352` pelo nome da branch e busca via MCP, resume com as próprias palavras, pergunta escopo e plan mode, pula a pergunta genérica de objetivo do passo 9, encerra com resumo.

Resultado:
```
Fala Samuel! Bora começar.
```
(após checar caveman/OCP/CodeGraph/git:)
```
Achei o ticket LED-352 pela branch. Pelo que entendi: a dashboard tá mostrando total de clientes registrados em vez de só clientes com subscription ativa, e falta um indicador de churn — clientes com subscription inativa cujo último pagamento foi no mês passado (não conta se foi há mais tempo).

Vamos mexer só no front, só no back, ou nos dois?
```
(usuário responde o escopo)
```
Quer ativar plan mode antes de começarmos?
```
(após a resposta:)
```
Caveman full ativo. Regra OCP ativa. CodeGraph indexado. Branch: feature/led-352-..., working tree limpo. Ticket: LED-352 (escopo: back-end). Sem tasks pendentes. Plan mode: ativo. Objetivo: corrigir indicadores de clientes ativos e churn no dashboard. Bora.
```

## Solução de problemas

### A branch não bate com nenhum ticket do Linear, ou `get_issue` retorna erro

Não insista, não tente adivinhar um id. Mencione em uma linha ("a branch não indica um ticket" ou "ticket não encontrado no Linear") e vá para o fluxo normal de perguntar o objetivo (Passo 9).

### `.codegraph` existe mas `codegraph_explore` falha

Trate como indisponível para aquela chamada — não tente de novo, siga com Read/Grep e avise o usuário.

### O repo não tem `TaskList` disponível ou está vazio

Apenas pule esse item no resumo, não é um erro.
