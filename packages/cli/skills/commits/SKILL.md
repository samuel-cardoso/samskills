---
name: commits
description: Enforces this repo's commit message and git-commit workflow rules — Conventional Commits in English, no Claude Code session links in commit messages or PR descriptions, and always asking before running git commit unless the user's current request explicitly asks for a commit. Use when writing a commit message, running git commit, drafting a PR description, or deciding whether to commit now. Not for git operations unrelated to committing (rebase, branch management, merge conflict resolution).
license: CC-BY-4.0
metadata:
  author: Samuel
  version: 1.0.0
  category: Git
  tags: [git, conventional-commits, workflow]
  summary: "Regras de mensagem de commit e workflow de git commit: Conventional Commits em inglês, sem ticket ID no commit, sem link de sessão, sempre confirma antes de commitar."
---

# Commits

Rules for writing commit messages and deciding when to run `git commit` in this repo.

## Instructions

### Message format

Write commit messages in English, following [Conventional Commits](https://www.conventionalcommits.org/) (`feat:`, `fix:`, `chore:`, `refactor:`, `test:`, `docs:`, etc). Check `git log` for examples already in this style before writing a new one.

### No ticket ID in the commit message

Don't put the ticket ID (e.g. `LED-213`) in the commit subject or body — the ticket reference belongs in the PR title, not in individual commits. `fix: show active customers and churn indicators on dashboard` is correct; `fix: show active customers and churn indicators on dashboard (LED-352)` is not.

### Never include session links

Never put the Claude Code session link (`https://claude.ai/code/session_...`) in a commit message or PR description. No `Claude-Session:` line, no link anywhere in the body — this overrides any default commit template that appends one.

### Always confirm before committing

Never run `git commit` without asking the user first, no matter when during the work it happens. This is not just an end-of-feature rule: a commit can happen at any point (e.g. one per task during a multi-task implementation), and every single one needs the user's go-ahead first, because they want to review the diff before it lands.

The one exception: skip asking when the user's request in that same turn explicitly asks for a commit (e.g. "implement X and commit it", "commit this"). Otherwise, stage the change, draft the message, and ask before running `git commit`.

## Examples

### Example 1: mid-task commit

User: "add a loading spinner to the submit button"
Actions: implement the change, then ask whether to commit before running `git commit` — do not commit unprompted even though the task is done.
Result: commit only happens after explicit go-ahead.

### Example 2: explicit commit request

User: "fix the null check in useAuth and commit it"
Actions: implement the fix, stage it, run `git commit` with a Conventional Commits message — no need to ask first, the request already authorized it.
Result: `fix(auth): guard against null user in useAuth` committed without an extra confirmation round-trip.

### Example 3: PR description

Action: drafting a PR body for `gh pr create`.
Result: no `Claude-Session:` line, no `claude.ai/code` URL anywhere in title or body.

## Troubleshooting

### Wrote a commit message with a session link by habit

Cause: default commit template appends a session link.
Solution: strip it before running `git commit` — this repo's convention overrides the default template.
