import { loadRegistry } from "../registry.js";

export function searchCommand(term) {
  const query = term.toLowerCase();
  const results = loadRegistry().filter(
    (skill) =>
      skill.name.toLowerCase().includes(query) ||
      skill.description.toLowerCase().includes(query) ||
      skill.tags.some((tag) => tag.toLowerCase().includes(query))
  );

  if (results.length === 0) {
    console.log(`Nenhuma skill encontrada para "${term}".`);
    return;
  }

  for (const skill of results) {
    console.log(`${skill.slug} (${skill.category})`);
    console.log(`  ${skill.summary}`);
    console.log("");
  }
}
