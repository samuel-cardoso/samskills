import path from "node:path";
import { AGENTS, DEFAULT_AGENT } from "../agents.js";

export function agentsCommand() {
  console.log("Agentes suportados (--agent <nome>):\n");

  for (const [name, agent] of Object.entries(AGENTS)) {
    const isDefault = name === DEFAULT_AGENT ? "  (padrao)" : "";
    console.log(`${name}${isDefault}`);
    console.log(`  ${agent.label}`);
    console.log(`  projeto: ${path.join(...agent.project)}/`);
    console.log(`  global:  ~/${path.join(...agent.global)}/`);
    if (agent.alsoReadBy.length > 0) {
      console.log(`  tambem lido por: ${agent.alsoReadBy.join(", ")}`);
    }
    console.log("");
  }

  console.log("SKILL.md e um padrao aberto — outros agentes que o suportem");
  console.log("funcionam apontando para um desses diretorios.");
}
