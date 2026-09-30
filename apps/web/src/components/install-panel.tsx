"use client";

import { useState } from "react";
import { CopyButton } from "@/components/copy-button";

interface Method {
  id: string;
  label: string;
  hint: string;
  lines: { cmd: string; note?: string }[];
}

const METHODS: Method[] = [
  {
    id: "npx",
    label: "npx",
    hint: "Sem instalar nada. Baixa na hora e some depois.",
    lines: [
      { cmd: "npx samskills add bora", note: "instala no projeto atual" },
      { cmd: "npx samskills add bora --global", note: "instala pra todos os projetos" },
    ],
  },
  {
    id: "global",
    label: "global",
    hint: "Instala uma vez, usa o comando sam em qualquer lugar.",
    lines: [
      { cmd: "npm install -g samskills", note: "uma vez só" },
      { cmd: "sam add bora --global", note: "vai pra ~/.claude/skills" },
    ],
  },
  {
    id: "projeto",
    label: "projeto",
    hint: "Fixa a versão no package.json do time.",
    lines: [
      { cmd: "npm install -D samskills", note: "vira dependência do repo" },
      { cmd: "npx sam add bora", note: "vai pra .claude/skills" },
    ],
  },
];

export function InstallPanel() {
  const [active, setActive] = useState(METHODS[0].id);
  const method = METHODS.find((m) => m.id === active) ?? METHODS[0];

  return (
    <div className="w-full max-w-2xl rounded-2xl border border-[var(--sk-line)] bg-[var(--sk-surface)]/85 text-left shadow-[0_24px_70px_-30px_rgba(0,0,0,0.9)] backdrop-blur-md">
      <div
        role="tablist"
        aria-label="Formas de instalação"
        className="flex items-center gap-1 border-b border-[var(--sk-line)] px-2 py-2"
      >
        {METHODS.map((m) => {
          const selected = m.id === active;
          return (
            <button
              key={m.id}
              role="tab"
              aria-selected={selected}
              onClick={() => setActive(m.id)}
              className={`cursor-pointer rounded-lg px-3 py-1.5 font-mono text-[13px] transition-colors ${
                selected
                  ? "bg-[var(--sk-accent-soft)] text-[var(--sk-accent)]"
                  : "text-[var(--sk-faint)] hover:text-[var(--sk-soft)]"
              }`}
            >
              {m.label}
            </button>
          );
        })}
        <span className="ml-auto hidden pr-2 text-xs text-[var(--sk-faint)] sm:block">
          {method.hint}
        </span>
      </div>

      <div className="flex flex-col gap-2 p-3">
        {method.lines.map((line) => (
          <div
            key={line.cmd}
            className="group flex items-center gap-3 rounded-xl border border-transparent bg-[var(--sk-bg)]/60 px-3 py-2.5 transition-colors hover:border-[var(--sk-line)]"
          >
            <span aria-hidden className="select-none font-mono text-sm text-[var(--sk-accent-dim)]">
              $
            </span>
            <code className="flex-1 overflow-x-auto font-mono text-[15px] whitespace-nowrap text-[var(--sk-ink)] sk-scroll">
              {line.cmd}
            </code>
            {line.note ? (
              <span className="hidden text-xs text-[var(--sk-faint)] md:block">
                {line.note}
              </span>
            ) : null}
            <CopyButton value={line.cmd} />
          </div>
        ))}
      </div>

      <p className="border-t border-[var(--sk-line)] px-4 py-2.5 text-xs text-[var(--sk-faint)] sm:hidden">
        {method.hint}
      </p>
    </div>
  );
}
