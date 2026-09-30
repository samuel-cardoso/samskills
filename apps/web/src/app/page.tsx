import Image from "next/image";
import { GitFork } from "lucide-react";
import ClickSpark from "@/components/ClickSpark";
import { Reveal } from "@/components/reveal";
import GradientText from "@/components/GradientText";
import { Hero } from "@/components/hero";
import { SkillExplorer } from "@/components/skill-explorer";
import { getCategories, getSkills } from "@/lib/skills";

const AUTHOR = {
  name: "Samuel",
  login: "samuel-cardoso",
  url: "https://github.com/samuel-cardoso",
  avatar: "https://avatars.githubusercontent.com/u/91702874?v=4",
  bio: "Dev Full Stack Júnior na @ledius-tech",
};

export default function Home() {
  const skills = getSkills();
  const categories = getCategories(skills);

  const stats = [
    { label: "skills", value: skills.length },
    { label: "categorias", value: categories.length },
    { label: "copiar e colar", value: 0 },
  ];

  return (
    <ClickSpark sparkColor="#4fd3c4" sparkSize={9} sparkRadius={17} sparkCount={8} duration={420}>
      <div className="flex min-h-screen flex-col">
        <Hero stats={stats} />

        <main id="skills" className="mx-auto w-full max-w-6xl flex-1 scroll-mt-8 px-6 py-20">
          <Reveal distance={24}>
            <div className="mb-10 flex flex-col gap-2">
              <GradientText
                colors={["#4fd3c4", "#a7f3d0", "#4fd3c4"]}
                animationSpeed={9}
                className="!mx-0 w-fit font-mono text-[13px] tracking-widest uppercase"
              >
                catálogo
              </GradientText>
              <h2 className="text-3xl font-semibold tracking-tight text-[var(--sk-ink)]">
                Todas as skills
              </h2>
              <p className="max-w-xl text-[15px] text-[var(--sk-soft)]">
                Cada card traz o{" "}
                <code className="font-mono text-[var(--sk-accent)]">SKILL.md</code> completo e o
                comando que instala. Clique em instalar pra copiar.
              </p>
            </div>
          </Reveal>

          <SkillExplorer skills={skills} categories={categories} />
        </main>

        <footer className="border-t border-[var(--sk-line)] px-6 py-10">
          <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 text-[13px] text-[var(--sk-faint)] sm:flex-row">
            <div className="flex items-center gap-3.5">
              <a
                href={AUTHOR.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-3.5"
              >
                <Image
                  src={AUTHOR.avatar}
                  alt={`Foto de perfil de ${AUTHOR.name} no GitHub`}
                  width={48}
                  height={48}
                  className="size-12 rounded-full border border-[var(--sk-line-strong)] transition-colors group-hover:border-[var(--sk-accent-dim)]"
                />
                <span className="flex flex-col gap-0.5 text-left">
                  <span className="font-medium text-[var(--sk-ink)]">{AUTHOR.name}</span>
                  <span className="flex items-center gap-1.5 font-mono text-xs text-[var(--sk-faint)] transition-colors group-hover:text-[var(--sk-accent)]">
                    <GitFork className="size-3.5" />@{AUTHOR.login}
                  </span>
                  <span className="text-xs text-[var(--sk-faint)]">{AUTHOR.bio}</span>
                </span>
              </a>
            </div>

            <div className="flex flex-col items-center gap-1.5 sm:items-end">
              <p className="font-mono">samskills · {skills.length} skills</p>
              <p>
                instale com{" "}
                <code className="font-mono text-[var(--sk-soft)]">
                  npx samskills add &lt;skill&gt;
                </code>
              </p>
            </div>
          </div>
        </footer>
      </div>
    </ClickSpark>
  );
}
