import ClickSpark from "@/components/ClickSpark";
import { Reveal } from "@/components/reveal";
import GradientText from "@/components/GradientText";
import { Hero } from "@/components/hero";
import { SkillExplorer } from "@/components/skill-explorer";
import { getCategories, getSkills } from "@/lib/skills";

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
                className="!mx-0 w-fit font-mono text-xs tracking-widest uppercase"
              >
                catálogo
              </GradientText>
              <h2 className="text-2xl font-semibold tracking-tight text-[var(--sk-ink)]">
                Todas as skills
              </h2>
              <p className="max-w-lg text-sm text-[var(--sk-soft)]">
                Cada card traz o{" "}
                <code className="font-mono text-[var(--sk-accent)]">SKILL.md</code> completo e o
                comando que instala. Clique em instalar pra copiar.
              </p>
            </div>
          </Reveal>

          <SkillExplorer skills={skills} categories={categories} />
        </main>

        <footer className="border-t border-[var(--sk-line)] px-6 py-10">
          <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 text-xs text-[var(--sk-faint)] sm:flex-row">
            <p className="font-mono">
              samskills · {skills.length} skills · feito por Samuel
            </p>
            <p>
              instale com{" "}
              <code className="font-mono text-[var(--sk-soft)]">npx samskills add &lt;skill&gt;</code>
            </p>
          </div>
        </footer>
      </div>
    </ClickSpark>
  );
}
