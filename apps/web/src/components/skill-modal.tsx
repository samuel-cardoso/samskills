"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Info, X } from "lucide-react";
import { CopyButton } from "@/components/copy-button";
import type { Skill } from "@/lib/skills";

type Lang = "en" | "pt";

export function SkillModal({ skill, onClose }: { skill: Skill; onClose: () => void }) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const [mounted, setMounted] = useState(false);
  const [lang, setLang] = useState<Lang>("en");

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    closeRef.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [onClose]);

  if (!mounted) return null;

  const hasTranslation = skill.sourcePt !== null;
  const showingPt = lang === "pt" && hasTranslation;
  const body = showingPt ? (skill.sourcePt as string) : skill.source;

  const langButton = (value: Lang, label: string, title: string) => (
    <button
      type="button"
      onClick={() => setLang(value)}
      title={title}
      aria-pressed={lang === value}
      className={`cursor-pointer rounded-md px-2.5 py-1 font-mono text-xs transition-colors ${
        lang === value
          ? "bg-[var(--sk-accent-soft)] text-[var(--sk-accent)]"
          : "text-[var(--sk-faint)] hover:text-[var(--sk-soft)]"
      }`}
    >
      {label}
    </button>
  );

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${skill.slug}/SKILL.md`}
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm sm:p-8"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="flex max-h-full w-full max-w-4xl flex-col overflow-hidden rounded-2xl border border-[var(--sk-line-strong)] bg-[var(--sk-surface)] shadow-[0_40px_120px_-30px_rgba(0,0,0,0.95)]"
      >
        <div className="flex items-center justify-between gap-4 border-b border-[var(--sk-line)] px-5 py-3.5">
          <div className="flex min-w-0 flex-col gap-0.5">
            <span className="truncate font-mono text-base font-semibold text-[var(--sk-ink)]">
              {skill.slug}/SKILL.md
            </span>
            <span className="font-mono text-xs text-[var(--sk-faint)]">
              {skill.author} · v{skill.version}
              {skill.license ? ` · ${skill.license}` : ""}
            </span>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            {hasTranslation ? (
              <div className="flex items-center gap-0.5 rounded-lg border border-[var(--sk-line)] p-0.5">
                {langButton("en", "EN", "Original — é este que é instalado")}
                {langButton("pt", "PT", "Tradução só para leitura")}
              </div>
            ) : null}
            <CopyButton value={skill.source} label="copiar original" />
            <button
              ref={closeRef}
              type="button"
              onClick={onClose}
              aria-label="Fechar"
              className="cursor-pointer rounded-md border border-[var(--sk-line-strong)] bg-[var(--sk-surface-2)] p-1.5 text-[var(--sk-soft)] transition-colors hover:border-[var(--sk-accent-dim)] hover:text-[var(--sk-accent)]"
            >
              <X className="size-4" />
            </button>
          </div>
        </div>

        {showingPt ? (
          <p className="flex items-start gap-2 border-b border-[var(--sk-line)] bg-[var(--sk-accent-soft)]/50 px-5 py-2.5 text-[13px] leading-relaxed text-[var(--sk-soft)]">
            <Info className="mt-0.5 size-4 shrink-0 text-[var(--sk-accent)]" />
            <span>
              Tradução para leitura. O que o <code className="font-mono">sam</code> instala no
              projeto é sempre o original em inglês — agentes trabalham melhor em inglês.
            </span>
          </p>
        ) : null}

        <pre className="sk-scroll flex-1 overflow-x-hidden overflow-y-auto bg-[#060c0b] px-6 py-5 font-mono text-[14px] leading-[1.75] break-words whitespace-pre-wrap text-[var(--sk-soft)]">
          <code className="font-mono">{body}</code>
        </pre>

        <div className="flex items-center justify-between gap-3 border-t border-[var(--sk-line)] px-5 py-3">
          <code className="sk-scroll overflow-x-auto font-mono text-[13px] whitespace-nowrap text-[var(--sk-ink)]">
            npx samskills add {skill.slug}
          </code>
          <CopyButton value={`npx samskills add ${skill.slug}`} label="instalar" />
        </div>
      </div>
    </div>,
    document.body
  );
}
