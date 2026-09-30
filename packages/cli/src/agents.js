import os from "node:os";
import path from "node:path";

/**
 * Where each agent looks for SKILL.md files.
 *
 * SKILL.md is an open standard, so most agents also read each other's
 * directories. `.claude/skills` has the widest reach today (Claude Code reads
 * it natively; Cursor and OpenCode read it for compatibility), which is why it
 * is the default. Paths are from each tool's own docs.
 */
export const AGENTS = {
  claude: {
    label: "Claude Code",
    project: [".claude", "skills"],
    global: [".claude", "skills"],
    alsoReadBy: ["Cursor", "OpenCode"],
  },
  agents: {
    label: "padrão .agents",
    project: [".agents", "skills"],
    global: [".agents", "skills"],
    alsoReadBy: ["Cursor", "OpenCode"],
  },
  cursor: {
    label: "Cursor",
    project: [".cursor", "skills"],
    global: [".cursor", "skills"],
    alsoReadBy: [],
  },
  codex: {
    label: "OpenAI Codex",
    project: [".codex", "skills"],
    global: [".codex", "skills"],
    alsoReadBy: ["Cursor"],
  },
  opencode: {
    label: "OpenCode",
    project: [".opencode", "skills"],
    global: [".config", "opencode", "skills"],
    alsoReadBy: [],
  },
};

export const DEFAULT_AGENT = "claude";

export function resolveTargetDir(agentName, isGlobal) {
  const agent = AGENTS[agentName];
  if (!agent) return null;

  return isGlobal
    ? path.join(os.homedir(), ...agent.global)
    : path.join(process.cwd(), ...agent.project);
}

export function agentNames() {
  return Object.keys(AGENTS);
}
