# Repositório inicial do workshop

Ponto de partida do programa de Engenharia de Software Agêntica. Tem duas pastas: os modelos do minibook e a aplicação `greenfield`, que ainda não tem telas nem funcionalidades. Durante o workshop, cada time escreve o `VISION.md` e os PRDs dela, e leva os PRDs ao código pelo OpenSpec.

## Antes do dia 1

Instale o git, o Claude Code e o Claude Desktop, com login. Depois, o Node.js 26 LTS e a CLI do OpenSpec, que as skills do repositório chamam:

```bash
npm install -g @fission-ai/openspec@1.16.1
```

O Docker só é necessário quando a aplicação tiver banco. Teste de acesso:

```bash
git clone https://github.com/leancosts/workshop.git
cd workshop/greenfield
openspec list
claude --version
```

O que falhar vai para a lista de obstáculos (modelo 13) e para os facilitadores.

## Começar

Cada time trabalha no próprio repositório:

```bash
git clone https://github.com/leancosts/workshop.git greenfield-time-N
cd greenfield-time-N
git remote set-url origin <repositório do time>
git push -u origin main
cd greenfield
claude
```

1. Preencha o `greenfield/VISION.md` (o modelo 05a explica cada seção).
2. Escreva o primeiro PRD em `greenfield/docs/prd/`, no modelo 31.
3. Abra a primeira mudança com `/opsx:explore` ou `/opsx:new`. O `greenfield/CLAUDE.md` descreve o fluxo.

## O que está aqui

| Caminho | O que tem |
|---|---|
| `modelos/` | Os modelos do minibook, para copiar e preencher |
| `greenfield/VISION.md` | O modelo da visão, para o time preencher |
| `greenfield/ARCHITECTURE.md` | A stack decidida: Docker, Node.js, TypeScript, ESLint, React, Vite, PostgreSQL e Drizzle ORM |
| `greenfield/DESIGN.md` e os tokens | O sistema visual: `variables.css`, `theme.css` e `tokens.json` |
| `greenfield/CLAUDE.md` | Como o agente trabalha no repositório |
| `greenfield/docs/prd/` | Os PRDs do time |
| `greenfield/openspec/`, `greenfield/.claude/` | O OpenSpec 1.16.1, com as skills e os comandos `/opsx:*` para o Claude Code |

## O que não entra aqui

Código da empresa, dado pessoal e segredo. Os dados do exercício são fictícios.
