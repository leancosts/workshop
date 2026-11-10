# Repositório inicial do workshop

Ponto de partida do programa de Engenharia de Software Agêntica. Tem duas pastas: os modelos do minibook e a aplicação `greenfield`, que ainda não tem telas nem funcionalidades. Durante o workshop, cada time escreve o `VISION.md` e os PRDs dela, e leva os PRDs ao código pelo OpenSpec.

## Antes do dia 1

Instale o git, o Claude Code e o Claude Desktop, com login. Depois, o Node.js 26 LTS e a CLI do OpenSpec, que as skills do repositório chamam:

```bash
npm install -g @fission-ai/openspec@1.16.1
openspec --version   # precisa dizer 1.16.1; uma versão global antiga no PATH quebra as skills
```

Instale também o Docker Desktop: a aplicação guarda os dados no Postgres, que sobe num container. A chave da API da Anthropic é entregue pelo facilitador no dia. Teste de acesso:

```bash
git clone https://github.com/leancosts/workshop.git
cd workshop/greenfield
openspec list
claude --version
docker compose up -d --wait db && docker compose down
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
cp .env.example .env   # cole a chave entregue pelo facilitador em ANTHROPIC_API_KEY
npm install
npm run verificar      # tem de passar antes de qualquer mudança
docker compose up -d db
claude
```

1. Leia o problema em `greenfield/docs/problema.md`. O `greenfield/VISION.md` já traz o problema, a solução e as personas; o time escreve os princípios e as metas (o modelo 05a explica cada seção).
2. Escreva o primeiro PRD em `greenfield/docs/prd/`, no modelo 31.
3. Abra a primeira mudança com `/opsx:explore` ou `/opsx:new`. O `greenfield/CLAUDE.md` descreve o fluxo.

## O que está aqui

| Caminho | O que tem |
|---|---|
| `modelos/` | Os modelos do minibook, para copiar e preencher |
| `greenfield/VISION.md` | A visão da Triagem; o time escreve os princípios e as metas |
| `greenfield/ARCHITECTURE.md` | A stack decidida: Docker, Node.js, TypeScript, ESLint, React, Vite, PostgreSQL e Drizzle ORM |
| `greenfield/DESIGN.md` e os tokens | O sistema visual: `variables.css`, `theme.css` e `tokens.json` |
| `greenfield/CLAUDE.md` | Como o agente trabalha no repositório |
| `greenfield/docs/` | O problema (`problema.md`), a base de conhecimento, a massa de teste e os PRDs do time (`prd/`) |
| `greenfield/.env.example` | As variáveis de ambiente; copie para `.env`, que fica fora do git |
| `greenfield/docker-compose.yml` | O Postgres 18 local, com os mesmos valores de `DATABASE_URL` |
| `greenfield/openspec/`, `greenfield/.claude/` | O OpenSpec 1.16.1 (skills e comandos `/opsx:*`) e as skills de Matt Pocock (`/grill-me`, `/tdd`, `/code-review` e outras, licença MIT), configuradas com issues locais |

## O que não entra aqui

Código da empresa, dado pessoal e segredo. Os dados do exercício são fictícios.
