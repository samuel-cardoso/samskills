"use client";

import { useMemo, useState } from "react";
import { Search, X } from "lucide-react";
import { Reveal } from "@/components/reveal";
import { SkillCard } from "@/components/skill-card";
import type { Skill } from "@/lib/skills";

export function SkillExplorer({
  skills,
  categories,
}: {
  skills: Skill[];
  categories: string[];
}) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return skills.filter((skill) => {
      const matchesCategory = category ? skill.category === category : true;
      const matchesQuery = q
        ? skill.name.toLowerCase().includes(q) ||
          skill.summary.toLowerCase().includes(q) ||
          skill.description.toLowerCase().includes(q) ||
          skill.tags.some((tag) => tag.toLowerCase().includes(q))
        : true;
      return matchesCategory && matchesQuery;
    });
  }, [skills, query, category]);

  const chip = (label: string, selected: boolean, onClick: () => void) => (
    <button
      key={label}
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={`cursor-pointer rounded-full border px-3.5 py-1.5 text-[13px] transition-colors ${
        selected
          ? "border-[var(--sk-accent-dim)] bg-[var(--sk-accent-soft)] text-[var(--sk-accent)]"
          : "border-[var(--sk-line)] text-[var(--sk-faint)] hover:border-[var(--sk-line-strong)] hover:text-[var(--sk-soft)]"
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="relative w-full md:max-w-xs">
          <Search className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-[var(--sk-faint)]" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar por nome, tag ou descrição..."
            aria-label="Buscar skills"
            className="w-full rounded-xl border border-[var(--sk-line)] bg-[var(--sk-surface)] py-2.5 pr-9 pl-10 text-[15px] text-[var(--sk-ink)] transition-colors placeholder:text-[var(--sk-faint)] focus:border-[var(--sk-accent-dim)] focus:outline-none"
          />
          {query ? (
            <button
              type="button"
              onClick={() => setQuery("")}
              aria-label="Limpar busca"
              className="absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer text-[var(--sk-faint)] transition-colors hover:text-[var(--sk-ink)]"
            >
              <X className="size-4" />
            </button>
          ) : null}
        </div>

        <div className="flex flex-wrap gap-2">
          {chip("todas", category === null, () => setCategory(null))}
          {categories.map((cat) => chip(cat, category === cat, () => setCategory(cat)))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[var(--sk-line)] py-20 text-center">
          <p className="text-[15px] text-[var(--sk-soft)]">Nenhuma skill encontrada.</p>
          <p className="mt-1 font-mono text-[13px] text-[var(--sk-faint)]">
            tente outro termo ou limpe os filtros
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((skill, i) => (
            <Reveal
              key={skill.slug}
              distance={28}
              delay={Math.min(i, 5) * 0.06}
              className="h-full"
            >
              <SkillCard skill={skill} />
            </Reveal>
          ))}
        </div>
      )}
    </div>
  );
}
