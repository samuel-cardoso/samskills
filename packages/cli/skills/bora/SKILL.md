---
name: bora
description: Starts a work session by activating caveman mode full, the SOLID Open-Closed Principle (OCP) rule, and checking CodeGraph availability, then reports git branch/status and in-progress tasks/plans before asking for the session's goal. Use when the user types /bora, says "vamos começar", "bora começar a sessão", or asks to start a new work session. Do not use for mid-session status checks — only for session start.
license: CC-BY-4.0
metadata:
  author: Samuel
  version: 1.3.0
  category: Workflow
  tags: [sessao, git, produtividade]
  summary: "Ritual de início de sessão: ativa caveman full, a regra OCP, checa CodeGraph e reporta branch/status do git e tasks em andamento antes de perguntar o objetivo da sessão."
---

# Bora

Session-start ritual: gets the environment ready (caveman full + OCP rule + CodeGraph) and gives repo context before starting work.

## Instructions

### Step 1: Warm greeting

Whenever `/bora` fires, always open the session by greeting the user warmly — energetic, by name if known — regardless of whether their message included a greeting. This response deliberately breaks from caveman terseness: the mode hasn't been activated yet (that only happens in the next step).

If the goal is already given in the same message (e.g. "bora, quero corrigir o bug de login"), confirm enthusiastically that you're ready to start. Otherwise, just greet — don't ask what the task is here. The goal gets found (Step 6, Linear ticket) or asked for (Step 9) later, once there's actually a reason to ask instead of guessing.

### Step 2: Ensure caveman full

Invoke the `caveman:caveman` skill with args `full` to make sure the level is set to full (idempotent — no problem if it's already active). From here on, the rest of the session returns to caveman's normal terse tone.

### Step 3: Activate SOLID rule — Open-Closed Principle (OCP)

From here on, apply this rule for the rest of the session to any code generated or suggested, in any language (TypeScript, C#, Python, Go, etc.):

1. **Never modify existing code to add new behavior.** Prefer extension via inheritance, composition, or dependency injection.
2. **Eliminate growing if/else and switch statements.** If a conditional block grows with every new feature, refactor it to polymorphism (interface + implementations).
3. **Use abstractions for variable behavior.** Identify what changes (e.g. notification type, file format, payment method) and encapsulate it in an interface/base class.
4. **New features = new classes, not edits.** When asked to "add support for X," create a new implementation of the existing interface. Don't touch the current classes.
5. **Flag it if the request violates OCP.** If the request implies modifying code that already works, flag it: "This approach violates OCP. I suggest creating [X] instead of modifying [Y]." and present the correct alternative.

Quick signs of violation to watch for: `if/else`/`switch` growing with every new feature, explicit type checking (`instanceof`/`typeof`/string comparison) deciding behavior, or the team avoiding touching a file for fear of breaking something else.

### Step 4: Check CodeGraph

Run `ls -d .codegraph 2>/dev/null` at the repo root (or the nearest root, if cwd is a subdirectory).

- If it exists: the repo is indexed, prioritize `codegraph_explore`/`codegraph explore` over grep/find for the rest of the session.
- If it doesn't exist: not indexed. Don't offer to run `codegraph init` — indexing is the user's decision, just mention there's no index and proceed with Read/Grep as normal.

### Step 5: Git context

Run `git branch --show-current` and `git status -sb`.

- Report the current branch and whether there are uncommitted changes (staged/unstaged/untracked).
- If the directory isn't a git repo, say so and skip this step.

### Step 6: Look up the Linear ticket from the branch

Extract the ticket identifier from the current branch name (pattern `<type>/<id>-<slug>`, e.g. `feature/led-352-corrigir-...` → `LED-352`; case-insensitive, convert to `TEAM-NNN` format).

- If the branch matches the pattern: call `mcp__linear-server__get_issue` with that id (load the schema via ToolSearch first if not yet available).
  - If the ticket is found: **don't** paste the raw description. Summarize **in your own words** what you understood — the problem, expected behavior, and acceptance criteria.
  - Then ask the user whether this session's scope is **front-end, back-end, or both**.
  - Then ask whether they want to **enable plan mode** — only if it isn't already active this session (check the most recent plan mode state in context; if there's no signal, ask anyway, without assuming).
  - If the ticket isn't found (404/error): mention it in one line and fall through to the normal flow in Step 9 (ask for the goal).
- If the branch doesn't match the pattern (e.g. `main`, `develop`, a name with no ticket id): skip this step silently, no error — go to the normal flow in Step 9.

This step replaces Step 9's generic goal question when a ticket is found — the goal already comes from the ticket.

### Step 7: Activate the plan-storage rule

From here on, for the rest of the session: every plan generated (plan mode flow — `EnterPlanMode`/`ExitPlanMode`) must also be saved as a markdown file in the `plans/` folder at the repo root (create the folder if it doesn't exist), in addition to the harness's internal plan file. File name: `<TICKET-ID>-<short-slug>.md` when there's a Linear ticket (Step 6), or a descriptive task slug when there isn't. This applies to the implementation plan as well as any technical handoff derived from it (e.g. an API contract document for another team/agent).

### Step 8: Pending work

- Call `TaskList` to check for background agent tasks running or queued. Report if any.
- Look for in-progress planning artifacts (e.g. `STATE.md`, a `specs/` or `.tlc/` directory) at the repo root — a sign of a feature in progress via `tlc-spec-driven`. If found, summarize the current phase/feature in one line.

### Step 9: Confirm the goal

If the goal was already captured in Step 1 (greeting) or Step 6 (Linear ticket), don't ask again — just confirm it in the final summary.

If there's still no clear goal (no ticket, no greeting with a task), ask in one line: "What's the goal for this session?" and wait for a reply before starting substantial work.

### Step 10: Readiness summary

Close with a compact summary (a few lines): caveman level, OCP rule active, CodeGraph status, git branch/status, Linear ticket found (if any) + scope (front/back/both), pending items found, plan mode status, and confirmed goal. Then move on to the work.

## Examples

### Example 1: bare `/bora`, branch has no ticket

Actions: plain warm greeting, no goal yet (step 1), steps 2-6 (branch doesn't match a ticket, skipped silently), step 9 asks for the goal since nothing was captured yet, closes with summary.

Result:
```
Fala Samuel! Tudo certo por aqui, animado pra começar.
```
(after checking caveman/OCP/CodeGraph/git, no ticket match:)
```
Qual objetivo desta sessão?
```
(user replies with the goal, then:)
```
Caveman full ativo. Regra OCP ativa. CodeGraph indexado (usa explore). Branch: feature/login-fix, 2 arquivos modificados não commitados. Sem tasks pendentes. Objetivo: [what the user answered]. Bora.
```

### Example 2: `/bora, fala Claude tudo certo?! Quero corrigir o bug de login`

Actions: warm greeting with the goal already captured (step 1), steps 2-6, step 9 skipped (goal already given), summary already includes the goal.

Result:
```
Fala Samuel, tudo certo! Bora resolver esse bug de login.
```
(after checking git/CodeGraph/tasks:)
```
Caveman full ativo. Regra OCP ativa. CodeGraph não indexado neste repo. Branch: main, working tree limpo. STATE.md encontrado — feature "checkout-v2" na fase Tasks. Objetivo: corrigir bug de login. Bora.
```

### Example 3: branch with a Linear ticket (`feature/led-352-corrigir-...`)

Actions: greeting (step 1), steps 2-5, step 6 finds `LED-352` from the branch name and looks it up via MCP, summarizes in own words, asks scope and plan mode, skips the generic goal question in step 9, closes with summary.

Result:
```
Fala Samuel! Bora começar.
```
(after checking caveman/OCP/CodeGraph/git:)
```
Achei o ticket LED-352 pela branch. Pelo que entendi: a dashboard tá mostrando total de clientes registrados em vez de só clientes com subscription ativa, e falta um indicador de churn — clientes com subscription inativa cujo último pagamento foi no mês passado (não conta se foi há mais tempo).

Vamos mexer só no front, só no back, ou nos dois?
```
(user answers scope)
```
Quer ativar plan mode antes de começarmos?
```
(after reply:)
```
Caveman full ativo. Regra OCP ativa. CodeGraph indexado. Branch: feature/led-352-..., working tree limpo. Ticket: LED-352 (escopo: back-end). Sem tasks pendentes. Plan mode: ativo. Objetivo: corrigir indicadores de clientes ativos e churn no dashboard. Bora.
```

## Troubleshooting

### Branch doesn't match any Linear ticket, or `get_issue` returns an error

Don't push it, don't try to guess an id. Mention it in one line ("branch doesn't indicate a ticket" or "ticket not found in Linear") and go to the normal flow of asking for the goal (Step 9).

### `.codegraph` exists but `codegraph_explore` fails

Treat it as unavailable for that call — don't retry, proceed with Read/Grep and let the user know.

### Repo has no `TaskList` available or it's empty

Just skip that item in the summary, it's not an error.
