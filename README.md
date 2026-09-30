# samskills

Catálogo e gerenciador de pacotes para skills de agente.

Instala uma skill no projeto atual ou na máquina inteira com um comando, em vez de
criar a pasta e colar o `SKILL.md` na mão. `SKILL.md` é um padrão aberto, então
funciona com Claude Code, Cursor, OpenAI Codex, OpenCode e qualquer agente que o
suporte.

> **⚠️ Publicação no npm pendente.** O pacote `samskills` ainda não foi publicado,
> então os comandos com `npx samskills` / `npm install -g samskills` abaixo ainda
> não funcionam. Até lá, rode o CLI direto do repositório:
>
> ```bash
> git clone https://github.com/samuel-cardoso/samskills.git
> cd samskills && npm install
> node packages/cli/bin/sam.js list
> ```

## Uso

```bash
# sem instalar nada
npx samskills add bora
npx samskills add bora --global

# instalado globalmente (expõe o comando `sam`)
npm install -g samskills
sam add bora --global

# como dependência do projeto
npm install -D samskills
npx sam add bora
```

Outros comandos:

```bash
sam list                       # lista tudo que está catalogado
sam search figma               # busca por nome, descrição ou tag
sam agents                     # lista os agentes suportados
sam add <skill> --agent cursor # instala no diretório de outro agente
sam add <skill> -f             # sobrescreve se já existir
```

Sem `--global`, a skill vai para o diretório do agente dentro do projeto atual.
Com `--global`, vai para o equivalente no home do usuário.

## Agentes

O destino padrão é `.claude/skills/` porque é o de maior alcance: o Claude Code
lê nativamente, e Cursor e OpenCode leem por compatibilidade. Para mandar para
outro diretório, use `--agent`:

```bash
sam add bora --agent cursor     # .cursor/skills/
sam add bora --agent codex      # .codex/skills/
sam add bora --agent opencode   # .opencode/skills/
sam add bora --agent agents     # .agents/skills/ (padrão neutro)
sam agents                      # lista todos os destinos
```

| `--agent` | Projeto            | Global                      | Também lido por   |
| --------- | ------------------ | --------------------------- | ----------------- |
| `claude`  | `.claude/skills/`  | `~/.claude/skills/`         | Cursor, OpenCode  |
| `agents`  | `.agents/skills/`  | `~/.agents/skills/`         | Cursor, OpenCode  |
| `cursor`  | `.cursor/skills/`  | `~/.cursor/skills/`         | —                 |
| `codex`   | `.codex/skills/`   | `~/.codex/skills/`          | Cursor            |
| `opencode`| `.opencode/skills/`| `~/.config/opencode/skills/`| —                 |

## Estrutura

```
apps/web            site do catálogo (Next.js + Tailwind + React Bits)
packages/cli        o pacote npm `samskills`, binário `sam`
packages/cli/skills as skills em si — fonte única de verdade
```

O site e o CLI leem o mesmo diretório `packages/cli/skills`, então adicionar uma
skill é só criar a pasta com um `SKILL.md`.

## Adicionando uma skill

Crie `packages/cli/skills/<nome>/SKILL.md` com frontmatter:

```yaml
---
name: minha-skill
description: Descrição técnica que o agente usa pra decidir quando acionar.
license: CC-BY-4.0
metadata:
  author: Samuel
  version: 1.0.0
  category: Workflow
  tags: [git, produtividade]
  summary: "Frase curta em português que aparece no card do site."
---
```

`category`, `tags` e `summary` ficam dentro de `metadata` — que é o ponto de
extensão do formato — então o arquivo continua um `SKILL.md` válido para o Claude
Code e ao mesmo tempo alimenta o catálogo.

## Traduções

O `SKILL.md` é escrito em inglês porque é isso que o agente lê — LLM trabalha
melhor em inglês. Para que uma pessoa consiga avaliar se a skill faz sentido pra
ela, cada skill pode ter uma tradução ao lado:

```
packages/cli/skills/bora/
  SKILL.md         ← original em inglês, é ISTO que é instalado
  SKILL.pt-BR.md   ← tradução, só para leitura no site
```

No site, a modal de cada skill ganha um seletor `EN`/`PT` quando existe tradução,
com um aviso de que o arquivo instalado é sempre o original.

**A instalação é sempre em inglês.** O `sam add` filtra qualquer arquivo
`SKILL.<locale>.md` ao copiar, então a tradução nunca chega em `.claude/skills/`.
Traduções ficam livres para divergir em estilo sem risco de afetar o agente.

## Desenvolvimento

```bash
npm install
npm run dev -w web     # site em localhost:3000
node packages/cli/bin/sam.js list
```

## Pendências

- [ ] Publicar o pacote `samskills` no npm (`npm publish -w samskills`) — o nome
      está livre, mas ainda não foi registrado.
- [ ] Publicar o site (Vercel ou similar) e trocar o link do repositório no hero
      caso o domínio mude.

## Licença

Código proprietário — veja [LICENSE](LICENSE). Você pode ler o código, mas usar,
copiar, modificar ou redistribuir exige permissão prévia por escrito. Para pedir,
abra uma [issue](https://github.com/samuel-cardoso/samskills/issues).

As skills em `packages/cli/skills/` declaram a própria licença no frontmatter, que
prevalece sobre o LICENSE para o conteúdo daquele arquivo.
