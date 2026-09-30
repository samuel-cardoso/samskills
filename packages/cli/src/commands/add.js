import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { SKILLS_DIR, findSkill } from "../registry.js";

export function addCommand(slug, options) {
  const skill = findSkill(slug);

  if (!skill) {
    console.error(`Skill "${slug}" nao encontrada. Rode "sam list" para ver as disponiveis.`);
    process.exitCode = 1;
    return;
  }

  const baseDir = options.global
    ? path.join(os.homedir(), ".claude", "skills")
    : path.join(process.cwd(), ".claude", "skills");

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
  console.log(`"${slug}" instalada (${scope}) em ${targetDir}`);
}
