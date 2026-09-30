import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import matter from "gray-matter";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const SKILLS_DIR = path.join(__dirname, "..", "skills");

export function loadRegistry() {
  const slugs = fs
    .readdirSync(SKILLS_DIR, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name);

  return slugs
    .map((slug) => {
      const skillPath = path.join(SKILLS_DIR, slug, "SKILL.md");
      if (!fs.existsSync(skillPath)) return null;
      const raw = fs.readFileSync(skillPath, "utf8");
      const { data } = matter(raw);
      const meta = data.metadata ?? {};
      return {
        slug,
        name: data.name ?? slug,
        description: data.description ?? "",
        summary: meta.summary ?? data.description ?? "",
        license: data.license ?? null,
        category: meta.category ?? "Uncategorized",
        tags: meta.tags ?? [],
        author: meta.author ?? "unknown",
        version: meta.version ?? "0.0.0",
      };
    })
    .filter(Boolean)
    .sort((a, b) => a.name.localeCompare(b.name));
}

export function findSkill(slug) {
  return loadRegistry().find((skill) => skill.slug === slug);
}
