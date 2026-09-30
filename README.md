# samskills

Catálogo e gerenciador de pacotes das minhas skills de Claude Code.

Instala uma skill no projeto atual ou na máquina inteira com um comando, em vez de
criar a pasta e colar o `SKILL.md` na mão.

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
sam list              # lista tudo que está catalogado
sam search figma      # busca por nome, descrição ou tag
sam add <skill> -f    # sobrescreve se já existir
```

Sem `--global`, a skill vai para `.claude/skills/<nome>/` do diretório atual.
Com `--global`, vai para `~/.claude/skills/<nome>/`.

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

## Desenvolvimento

```bash
npm install
npm run dev -w web     # site em localhost:3000
node packages/cli/bin/sam.js list
```
