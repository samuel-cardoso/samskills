#!/usr/bin/env node
import { Command } from "commander";
import { listCommand } from "../src/commands/list.js";
import { searchCommand } from "../src/commands/search.js";
import { addCommand } from "../src/commands/add.js";

const program = new Command();

program.name("sam").description("Gerenciador de skills para agentes de codigo").version("0.1.0");

program
  .command("list")
  .description("Lista todas as skills catalogadas")
  .action(() => listCommand());

program
  .command("search <termo>")
  .description("Busca skills por nome, descricao ou tag")
  .action((termo) => searchCommand(termo));

program
  .command("add <skill>")
  .description("Instala uma skill no projeto atual (ou global com -g)")
  .option("-g, --global", "instala em ~/.claude/skills em vez de .claude/skills do projeto")
  .option("-f, --force", "sobrescreve se ja existir")
  .action((skill, options) => addCommand(skill, options));

program.parse();
