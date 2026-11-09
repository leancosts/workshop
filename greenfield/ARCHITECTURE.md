# Arquitetura

Mapa de onde as coisas ficam e das regras que sustentam o sistema. O greenfield ainda não tem código: este arquivo registra a stack decidida, e cada PRD parte dela. Leia antes de explorar; quando o código existir, confie nele.

## Stack
- **Linguagem:** TypeScript em modo `strict`, no front-end e no back-end, sobre Node.js 26 LTS.
- **Web:** React, com build e servidor de desenvolvimento pelo Vite. Cores, fontes e espaçamentos vêm do `DESIGN.md`.
- **API:** Node.js com TypeScript. O framework HTTP é decidido numa ADR pela primeira mudança que precisar de API.
- **Banco:** PostgreSQL 18, acessado só pelo Drizzle ORM. O schema em TypeScript é a fonte; o `drizzle-kit` gera as migrações.
- **Qualidade:** ESLint (configuração flat, com `typescript-eslint`) e `tsc --noEmit`. Testes com Vitest, o runner do Vite.
- **Execução:** Docker. O `docker compose` sobe o Postgres local; a API e a web têm uma imagem cada.

## Mapa de pastas
- `VISION.md`: o porquê e os princípios. `DESIGN.md`: o sistema visual.
- `variables.css`: os tokens como variáveis CSS, a folha que a web importa. `theme.css`: os mesmos tokens no formato `@theme` do Tailwind v4, se o time adotar. `tokens.json`: a fonte em JSON.
- `docs/prd/`: os PRDs, um arquivo por PRD.
- `openspec/specs/`: o comportamento atual do sistema, por capacidade. `openspec/changes/`: as mudanças em andamento; as concluídas vão para `changes/archive/`.
- `.claude/`: as skills e os comandos `/opsx:*` do OpenSpec.

Quando a primeira mudança criar código, ela acrescenta aqui as pastas que criou. A proposta é um monorepo com npm workspaces: `apps/web/`, `apps/api/` e `packages/db/` (o schema do Drizzle e as migrações).

## Regras transversais (não óbvias)
### O banco muda só por migração
O schema do Drizzle é a fonte. Toda mudança de tabela gera uma migração pelo `drizzle-kit generate`, revisada no PR. Uma migração já aplicada em qualquer ambiente nunca é editada: a correção é uma migração nova.

### Um só lugar para o visual
Componente React não declara cor, fonte, raio ou espaçamento literal: usa as variáveis de `variables.css`. Um token novo entra primeiro no `DESIGN.md` e nos três arquivos de tokens, no mesmo commit.

### Um comando verifica tudo
A primeira mudança com código cria `npm run verificar`, que roda ESLint, `tsc --noEmit` e Vitest. A CI roda o mesmo comando, e um PR só entra com ele verde.

### Segredo fica fora do git
Configuração por variável de ambiente, lida de um `.env` local que o `.gitignore` exclui. O repositório versiona só um `.env.example` sem valores.

## Para saber mais
- O fluxo do PRD ao código: `CLAUDE.md`.
- O modelo de PRD: `../modelos/31-prd.md`. O de ADR: `../modelos/12-adr.md`.
