import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

export interface Skill {
  slug: string;
  name: string;
  description: string;
  summary: string;
  license: string | null;
  category: string;
  tags: string[];
  author: string;
  version: string;
  source: string;
}

const SKILLS_DIR = path.join(process.cwd(), "..", "..", "packages", "cli", "skills");

export function getSkills(): Skill[] {
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
      const skill: Skill = {
        slug,
        name: data.name ?? slug,
        description: data.description ?? "",
        summary: meta.summary ?? data.description ?? "",
        license: data.license ?? null,
        category: meta.category ?? "Uncategorized",
        tags: meta.tags ?? [],
        author: meta.author ?? "unknown",
        version: meta.version ?? "0.0.0",
        source: raw,
      };
      return skill;
    })
    .filter((skill): skill is Skill => skill !== null)
    .sort((a, b) => a.name.localeCompare(b.name));
}

export function getCategories(skills: Skill[]): string[] {
  return Array.from(new Set(skills.map((s) => s.category))).sort();
}
