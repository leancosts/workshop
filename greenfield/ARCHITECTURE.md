# Arquitetura

Mapa de onde as coisas ficam e das regras que sustentam o sistema. O esqueleto do monorepo existe, sem tela e sem funcionalidade de negócio: cada PRD parte dele. Leia antes de explorar; quando o código existir, confie nele.

## Stack
- **Linguagem:** TypeScript em modo `strict`, no front-end e no back-end, sobre Node.js 26 LTS.
- **Web:** React, com build e servidor de desenvolvimento pelo Vite. Cores, fontes e espaçamentos vêm do `DESIGN.md`.
- **API:** Node.js com TypeScript. Fastify, decidido em `docs/adr/0001-fastify.md`.
- **Banco:** PostgreSQL 18, acessado só pelo Drizzle ORM. O schema em TypeScript é a fonte; o `drizzle-kit` gera as migrações.
- **Qualidade:** ESLint (configuração flat, com `typescript-eslint`) e `tsc --build`. O `typescript-eslint` ainda não aceita o TypeScript 7: o projeto fixa o 6.0.3. Testes com Vitest, o runner do Vite.
- **IA:** a API da Anthropic, pelo SDK oficial de TypeScript (`@anthropic-ai/sdk`), com a chave e o modelo lidos do `.env`.
- **Execução:** Docker. O `docker compose up -d db` sobe o Postgres local (`docker-compose.yml`); a API e a web rodam localmente com npm. As imagens Docker de cada uma ficam para quando o deploy for decidido.

## Mapa de pastas
- `VISION.md`: o porquê e os princípios. `DESIGN.md`: o sistema visual.
- `variables.css`: os tokens como variáveis CSS, a folha que a web importa. `theme.css`: os mesmos tokens no formato `@theme` do Tailwind v4, se o time adotar. `tokens.json`: a fonte em JSON.
- `docs/problema.md`: o enunciado da Triagem. `docs/base-de-conhecimento/`: os artigos que o agente usa para responder. `docs/massa-de-teste.md`: os chamados de aceite.
- `docs/prd/`: os PRDs, um arquivo por PRD. `docs/agents/`: a configuração das skills de Matt Pocock.
- `.env.example`: as variáveis de ambiente (chave da Anthropic, modelo e banco), sem valores secretos. `docker-compose.yml`: o Postgres local.
- `openspec/specs/`: o comportamento atual do sistema, por capacidade. `openspec/changes/`: as mudanças em andamento; as concluídas vão para `changes/archive/`.
- `.claude/`: as skills e os comandos `/opsx:*` do OpenSpec e as skills de Matt Pocock.

Monorepo com npm workspaces (`package.json` na raiz):
- `apps/api/`: a API Fastify. `src/app.ts` monta o app e as rotas (hoje só `GET /health`), `src/server.ts` lê o `.env`, lê `PORT` (padrão 3000) e liga a porta. Os testes usam `fastify.inject`.
- `apps/web/`: React com Vite. `src/main.tsx` importa `variables.css` e monta o `App`, que hoje só mostra o título. O proxy do Vite manda `/api` para a API e tira o prefixo (`/api/health` chega como `/health`).
- `packages/db/`: `src/schema.ts` (sem tabelas; cada mudança acrescenta as suas), `src/client.ts` (a conexão com o Postgres), `migrations/` (geradas pelo `drizzle-kit`) e `drizzle.config.ts`.
- `docs/adr/`: as decisões registradas, no modelo `../modelos/12-adr.md`.
- `docker/initdb/`: o SQL que o Postgres roda na criação do volume e que cria o banco `greenfield_test`.
- Na raiz: `tsconfig.base.json` (TypeScript `strict`; cada pacote tem o seu `tsconfig.json` e as references ficam em `tsconfig.json`), `eslint.config.js`, `vitest.config.ts` (um projeto por pacote).

## Regras transversais (não óbvias)
### Os dados ficam no Postgres desde o primeiro chamado
A persistência é o Postgres, inclusive no workshop. Um arquivo JSON só entra se não prejudicar nenhuma funcionalidade, e a Triagem não cumpre essa condição: o agente e o analista escrevem no mesmo chamado (F3 a F6), o histórico de eventos precisa de escrita atômica (F1), e a fila e o painel consultam por status e categoria (F5, F7). Trocar a persistência depois custaria refazer os testes de aceite.

### O banco muda só por migração
O schema do Drizzle é a fonte. Toda mudança de tabela gera uma migração pelo `drizzle-kit generate`, revisada no PR. Uma migração já aplicada em qualquer ambiente nunca é editada: a correção é uma migração nova.

### Um só lugar para o visual
Componente React não declara cor, fonte, raio ou espaçamento literal: usa as variáveis de `variables.css`. Um token novo entra primeiro no `DESIGN.md` e nos três arquivos de tokens, no mesmo commit.

### Um comando verifica tudo
O `npm run verificar` já existe: roda ESLint, `tsc --build` e Vitest, e falha se qualquer etapa falhar. A CI roda o mesmo comando, e um PR só entra com ele verde.

### Segredo fica fora do git
Configuração por variável de ambiente, lida de um `.env` local que o `.gitignore` exclui. O repositório versiona só um `.env.example` sem valores.

## Para saber mais
- O fluxo do PRD ao código: `CLAUDE.md`.
- O modelo de PRD: `../modelos/31-prd.md`. O de ADR: `../modelos/12-adr.md`.
