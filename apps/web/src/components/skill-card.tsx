"use client";

import { useState } from "react";
import { FileCode2 } from "lucide-react";
import SpotlightCard from "@/components/SpotlightCard";
import { CopyButton } from "@/components/copy-button";
import { SkillModal } from "@/components/skill-modal";
import type { Skill } from "@/lib/skills";

const CATEGORY_TONE: Record<string, string> = {
  Workflow: "text-[#7dd3fc] border-[#1e3a4a] bg-[#0c1f2a]",
  Frontend: "text-[#c4b5fd] border-[#332d52] bg-[#171531]",
  Git: "text-[#fbbf74] border-[#4a3520] bg-[#241a0e]",
};

export function SkillCard({ skill }: { skill: Skill }) {
  const [open, setOpen] = useState(false);
  const tone =
    CATEGORY_TONE[skill.category] ??
    "text-[var(--sk-accent)] border-[var(--sk-line-strong)] bg-[var(--sk-accent-soft)]";

  return (
    <>
      <SpotlightCard
        className="flex h-full flex-col gap-5 !rounded-2xl !border-[var(--sk-line)] !bg-[var(--sk-surface)] !p-6 transition-colors duration-300 hover:!border-[var(--sk-line-strong)]"
        spotlightColor="rgba(79, 211, 196, 0.12)"
      >
        <div className="flex flex-col gap-3.5">
          <div className="flex items-start justify-between gap-3">
            <h3 className="font-mono text-[17px] leading-tight font-semibold tracking-tight text-[var(--sk-ink)]">
              {skill.name}
            </h3>
            <span
              className={`shrink-0 rounded-full border px-2.5 py-0.5 text-xs font-medium ${tone}`}
            >
              {skill.category}
            </span>
          </div>

          <p className="text-[15px] leading-relaxed text-[var(--sk-soft)]">{skill.summary}</p>

          <div className="flex flex-wrap gap-1.5">
            {skill.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-md bg-[var(--sk-surface-2)] px-2 py-0.5 font-mono text-xs text-[var(--sk-faint)]"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-auto flex flex-col gap-3.5">
          <div className="flex items-center justify-between gap-2 border-t border-[var(--sk-line)] pt-4 text-xs text-[var(--sk-faint)]">
            <span className="font-mono">
              {skill.author} · v{skill.version}
              {skill.license ? ` · ${skill.license}` : ""}
            </span>
            <CopyButton value={`npx samskills add ${skill.slug}`} label="instalar" />
          </div>

          <button
            type="button"
            onClick={() => setOpen(true)}
            className="flex cursor-pointer items-center gap-1.5 self-start text-[13px] text-[var(--sk-faint)] transition-colors hover:text-[var(--sk-accent)]"
          >
            <FileCode2 className="size-4" />
            ler SKILL.md
          </button>
        </div>
      </SpotlightCard>

      {open ? <SkillModal skill={skill} onClose={() => setOpen(false)} /> : null}
    </>
  );
}
