import fs from "node:fs";
import path from "node:path";
import { SKILLS_DIR, findSkill } from "../registry.js";
import { AGENTS, DEFAULT_AGENT, agentNames, resolveTargetDir } from "../agents.js";

export function addCommand(slug, options) {
  const skill = findSkill(slug);

  if (!skill) {
    console.error(`Skill "${slug}" nao encontrada. Rode "sam list" para ver as disponiveis.`);
    process.exitCode = 1;
    return;
  }

  const agentName = options.agent ?? DEFAULT_AGENT;
  const agent = AGENTS[agentName];

  if (!agent) {
    console.error(
      `Agente "${agentName}" desconhecido. Disponiveis: ${agentNames().join(", ")}.`
    );
    process.exitCode = 1;
    return;
  }

  const baseDir = resolveTargetDir(agentName, Boolean(options.global));
  const targetDir = path.join(baseDir, slug);
  const sourceDir = path.join(SKILLS_DIR, slug);

  if (fs.existsSync(targetDir) && !options.force) {
    console.error(`"${targetDir}" ja existe. Use --force para sobrescrever.`);
    process.exitCode = 1;
    return;
  }

  fs.mkdirSync(baseDir, { recursive: true });
  fs.cpSync(sourceDir, targetDir, {
    recursive: true,
    force: true,
    // Translations (SKILL.<locale>.md) exist only so a human can read the skill
    // in their own language on the site. The agent always gets the English
    // original, so they must never be installed.
    filter: (src) => !/\/SKILL\.[a-z]{2}(-[A-Z]{2})?\.md$/.test(src),
  });

  const scope = options.global ? "global" : "projeto";
  console.log(`"${slug}" instalada para ${agent.label} (${scope}) em ${targetDir}`);

  if (agent.alsoReadBy.length > 0) {
    console.log(`  ${agent.alsoReadBy.join(" e ")} tambem leem esse diretorio.`);
  }
}
