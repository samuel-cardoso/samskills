"use client";

import { ArrowDown, GitFork } from "lucide-react";
import Aurora from "@/components/Aurora";
import ShinyText from "@/components/ShinyText";
import StarBorder from "@/components/StarBorder";
import CountUp from "@/components/CountUp";
import Magnet from "@/components/Magnet";
import DecryptedText from "@/components/DecryptedText";
import { Reveal } from "@/components/reveal";
import { InstallPanel } from "@/components/install-panel";

interface Stat {
  label: string;
  value: number;
  suffix?: string;
}

export function Hero({ stats }: { stats: Stat[] }) {
  return (
    <header className="relative isolate overflow-hidden border-b border-[var(--sk-line)]">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-x-0 top-0 h-[560px] opacity-70">
          <Aurora
            colorStops={["#0b3b36", "#4fd3c4", "#12564e"]}
            amplitude={1.1}
            blend={0.6}
            speed={0.7}
          />
        </div>
        <div className="sk-grid absolute inset-0 opacity-60" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[var(--sk-bg)]/55 to-[var(--sk-bg)]" />
      </div>

      <div className="mx-auto flex max-w-5xl flex-col items-center gap-7 px-6 pt-24 pb-20 text-center sm:pt-28">
        <Reveal distance={16}>
          <span className="inline-flex items-center gap-2 rounded-full border border-[var(--sk-line)] bg-[var(--sk-surface)]/70 px-3.5 py-1.5 backdrop-blur">
            <span className="relative flex size-1.5">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-[var(--sk-accent)] opacity-60" />
              <span className="relative inline-flex size-1.5 rounded-full bg-[var(--sk-accent)]" />
            </span>
            <ShinyText
              text="skills de agente, versionadas e instaláveis"
              speed={4}
              color="#97a8a2"
              shineColor="#4fd3c4"
              className="font-mono text-xs tracking-wide"
            />
          </span>
        </Reveal>

        <h1 className="font-mono text-6xl font-bold tracking-tighter sm:text-7xl md:text-8xl">
          <DecryptedText
            text="samskills"
            animateOn="view"
            sequential
            revealDirection="start"
            speed={55}
            maxIterations={14}
            useOriginalCharsOnly={false}
            characters="abcdefghijklmnopqrstuvwxyz$_/-#@"
            className="text-[var(--sk-ink)]"
            encryptedClassName="text-[var(--sk-accent-dim)]"
          />
        </h1>

        <Reveal delay={0.1}>
          <p className="max-w-xl text-[17px] leading-relaxed text-balance text-[var(--sk-soft)]">
            Gerenciador de pacotes para skills de Claude Code. Um comando instala no projeto
            ou na máquina inteira — sem copiar e colar{" "}
            <code className="rounded bg-[var(--sk-surface-2)] px-1.5 py-0.5 font-mono text-[15px] text-[var(--sk-accent)]">
              SKILL.md
            </code>{" "}
            na mão.
          </p>
        </Reveal>

        <Reveal delay={0.18} className="flex w-full justify-center">
          <InstallPanel />
        </Reveal>

        <Reveal delay={0.26}>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Magnet padding={70} magnetStrength={4}>
              <StarBorder
                as="a"
                href="#skills"
                color="#4fd3c4"
                speed="5s"
                thickness={1}
                backgroundColor="#0e1614"
                borderColor="#1e2b28"
                className="cursor-pointer"
              >
                <span className="flex items-center gap-2 text-sm text-[var(--sk-ink)]">
                  ver as skills
                  <ArrowDown className="size-4 text-[var(--sk-accent)]" />
                </span>
              </StarBorder>
            </Magnet>

            <a
              href="https://github.com/samuel-cardoso/samskills"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-full border border-[var(--sk-line)] px-4 py-2.5 text-sm text-[var(--sk-soft)] transition-colors hover:border-[var(--sk-line-strong)] hover:text-[var(--sk-ink)]"
            >
              <GitFork className="size-4" />
              repositório
            </a>
          </div>
        </Reveal>

        <Reveal delay={0.34}>
          <dl className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4 pt-4">
            {stats.map((stat) => (
              <div key={stat.label} className="flex flex-col items-center gap-0.5">
                <dd className="font-mono text-3xl font-semibold text-[var(--sk-ink)]">
                  <CountUp to={stat.value} duration={1.4} />
                  {stat.suffix ?? ""}
                </dd>
                <dt className="text-xs tracking-wide text-[var(--sk-faint)] uppercase">
                  {stat.label}
                </dt>
              </div>
            ))}
          </dl>
        </Reveal>
      </div>
    </header>
  );
}
