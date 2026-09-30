import { loadRegistry } from "../registry.js";

export function listCommand() {
  const skills = loadRegistry();

  if (skills.length === 0) {
    console.log("Nenhuma skill catalogada ainda.");
    return;
  }

  for (const skill of skills) {
    const tags = skill.tags.map((tag) => "#" + tag).join(" ");
    console.log(`${skill.slug} (${skill.category})`);
    console.log(`  ${skill.summary}`);
    console.log(`  ${skill.author} - v${skill.version} - ${tags}`);
    console.log("");
  }
}
