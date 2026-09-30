---
name: commits
description: Impõe as regras de mensagem de commit e de workflow de git commit deste repo — Conventional Commits em inglês, sem link de sessão do Claude Code em mensagens de commit ou descrições de PR, e sempre perguntar antes de rodar git commit, a menos que o pedido atual do usuário peça explicitamente um commit. Use ao escrever uma mensagem de commit, rodar git commit, redigir a descrição de um PR ou decidir se deve commitar agora. Não serve para operações git não relacionadas a commit (rebase, gerenciamento de branch, resolução de conflito de merge).
license: CC-BY-4.0
metadata:
  author: Samuel
  version: 1.0.0
  category: Git
  tags: [git, conventional-commits, workflow]
  summary: "Regras de mensagem de commit e workflow de git commit: Conventional Commits em inglês, sem ticket ID no commit, sem link de sessão, sempre confirma antes de commitar."
---

# Commits

Regras para escrever mensagens de commit e decidir quando rodar `git commit` neste repo.

## Instruções

### Formato da mensagem

Escreva mensagens de commit em inglês, seguindo [Conventional Commits](https://www.conventionalcommits.org/) (`feat:`, `fix:`, `chore:`, `refactor:`, `test:`, `docs:`, etc). Consulte o `git log` em busca de exemplos já nesse estilo antes de escrever um novo.

### Nada de ticket ID na mensagem de commit

Não coloque o ticket ID (ex.: `LED-213`) no assunto nem no corpo do commit — a referência ao ticket pertence ao título do PR, não aos commits individuais. `fix: show active customers and churn indicators on dashboard` está correto; `fix: show active customers and churn indicators on dashboard (LED-352)` não.

### Nunca inclua links de sessão

Nunca coloque o link da sessão do Claude Code (`https://claude.ai/code/session_...`) em uma mensagem de commit ou descrição de PR. Sem linha `Claude-Session:`, sem link em lugar nenhum do corpo — isso prevalece sobre qualquer template padrão de commit que acrescente um.

### Sempre confirme antes de commitar

Nunca rode `git commit` sem perguntar ao usuário primeiro, em qualquer momento do trabalho. Isso não é só uma regra de fim de feature: um commit pode acontecer a qualquer momento (ex.: um por task durante uma implementação com várias tasks), e cada um precisa do aval do usuário antes, porque ele quer revisar o diff antes de ele entrar.

A única exceção: pule a pergunta quando o pedido do usuário no mesmo turno pedir explicitamente um commit (ex.: "implementa X e commita", "commita isso"). Fora isso, prepare a mudança no stage, redija a mensagem e pergunte antes de rodar `git commit`.

## Exemplos

### Exemplo 1: commit no meio da task

Usuário: "adiciona um loading spinner no botão de submit"
Ações: implementar a mudança e então perguntar se deve commitar antes de rodar `git commit` — não commite por conta própria, mesmo com a task concluída.
Resultado: o commit só acontece após aval explícito.

### Exemplo 2: pedido explícito de commit

Usuário: "corrige o null check no useAuth e commita"
Ações: implementar a correção, colocar no stage, rodar `git commit` com uma mensagem Conventional Commits — não precisa perguntar antes, o pedido já autorizou.
Resultado: `fix(auth): guard against null user in useAuth` commitado sem uma rodada extra de confirmação.

### Exemplo 3: descrição de PR

Ação: redigir o corpo de um PR para `gh pr create`.
Resultado: sem linha `Claude-Session:`, sem URL `claude.ai/code` em lugar nenhum do título ou do corpo.

## Solução de problemas

### Escreveu uma mensagem de commit com link de sessão por hábito

Causa: o template padrão de commit acrescenta um link de sessão.
Solução: remova antes de rodar `git commit` — a convenção deste repo prevalece sobre o template padrão.
