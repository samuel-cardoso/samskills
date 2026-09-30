"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

export function CopyButton({
  value,
  label,
  className = "",
}: {
  value: string;
  label?: string;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
    } catch {
      return;
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      aria-label={copied ? "Copiado" : `Copiar: ${value}`}
      className={`group/copy inline-flex shrink-0 cursor-pointer items-center gap-1.5 rounded-md border border-[var(--sk-line-strong)] bg-[var(--sk-surface-2)] px-2.5 py-1.5 text-[13px] text-[var(--sk-soft)] transition-colors hover:border-[var(--sk-accent-dim)] hover:text-[var(--sk-accent)] ${className}`}
    >
      {copied ? (
        <Check className="size-3.5 text-[var(--sk-accent)]" />
      ) : (
        <Copy className="size-3.5" />
      )}
      {label ? <span>{copied ? "copiado" : label}</span> : null}
    </button>
  );
}
