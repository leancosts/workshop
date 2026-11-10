# Greenfield

## O que é
Uma aplicação nova, ainda sem telas e sem funcionalidades. O que ela faz nasce do `VISION.md` e dos PRDs em `docs/prd/`. O problema de negócio é a Triagem, um assistente de atendimento de chamados: `docs/problema.md`.

## Leia antes de qualquer tarefa
- `VISION.md`: o porquê e os princípios. Quando uma tarefa conflita com um princípio, levante o conflito em vez de contorná-lo.
- `ARCHITECTURE.md`: a stack, o mapa de pastas e as regras transversais.
- `DESIGN.md`: o sistema visual. Os tokens estão em `variables.css`, `theme.css` e `tokens.json`.
- `docs/problema.md`, `docs/base-de-conhecimento/` e `docs/massa-de-teste.md`: o enunciado, os artigos que o agente usa para responder e os chamados de aceite.

## Do PRD ao código
1. O PO escreve o PRD em `docs/prd/NNN-nome.md`, no modelo `../modelos/31-prd.md`. Um PRD diz o quê e por quê; se ele trouxer solução, devolva como pergunta.
2. Cada mudança passa pelo OpenSpec:
   - `/opsx:explore` para discutir o PRD antes de abrir uma mudança;
   - `/opsx:new <nome>` para abrir, e `/opsx:continue` para cada artefato (proposta, specs, design, tarefas), ou `/opsx:ff` para todos de uma vez;
   - `/opsx:apply` para implementar as tarefas;
   - `/opsx:verify` e depois `/opsx:archive` para fechar.
3. A proposta cita o PRD de origem. Uma mudança pequena cobre um item do "Pronto quando", não o PRD inteiro.

As skills chamam a CLI `openspec`, que precisa estar instalada (`README.md` na raiz do repositório).

## Como rodar
A configuração local fica em `.env`, criado a partir de `.env.example` (`cp .env.example .env`). A chave `ANTHROPIC_API_KEY` vem do facilitador e nunca vai para um arquivo versionado, um log ou uma mensagem de commit.

Os dados ficam no Postgres desde a primeira feature, nunca num arquivo JSON (o motivo está no `ARCHITECTURE.md`). Os comandos, a partir de `greenfield/`:

```bash
npm install              # instala os três pacotes
docker compose up -d --wait db   # sobe o Postgres (cria também o banco greenfield_test)
npm run db:migrate       # aplica as migrações
npm run dev:api          # API em http://localhost:3000 (PORT do .env)
npm run dev:web          # web em http://localhost:5173
npm run verificar        # ESLint, tsc e Vitest; um PR só entra com ele verde
```

Para gerar uma migração depois de mudar `packages/db/src/schema.ts`: `npm run db:generate`. A API e a web rodam localmente com npm; ainda não há imagem Docker delas.

## Como trabalhamos
- Teste primeiro: rode o teste novo, mostre a falha e só então escreva o código. Teste e código escritos juntos não contam.
- Um commit por artefato do OpenSpec e por task concluída, com o nome da mudança na mensagem. O `.env` nunca entra.
- Decisão em aberto do `docs/problema.md` é do PO: pergunte, não decida. Registre a resposta no PRD ou numa ADR.
- Nunca afirmar algo sobre um código que não foi aberto. Citar arquivo e linha.
- O documento vivo muda no mesmo commit que o código: as specs do OpenSpec, o `ARCHITECTURE.md` e este arquivo.
- Toda decisão fora da spec é registrada: no commit, no `design.md` da mudança ou numa ADR.

## Agent skills
As skills de Matt Pocock (`.claude/skills/`, licença MIT) completam o OpenSpec: `/grill-me` e `/grill-with-docs` para alinhar antes de escrever, `/tdd` para implementar, `/code-review` e `/diagnosing-bugs` para revisar e depurar. A spec e as tarefas ficam no OpenSpec, não em `/to-spec`.

### Issue tracker
Issues locais em Markdown, em `.scratch/`. See `docs/agents/issue-tracker.md`.

### Triage labels
Os cinco rótulos padrão (`needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human`, `wontfix`). See `docs/agents/triage-labels.md`.

### Domain docs
Single-context: `GLOSSARY.md` e `docs/adr/` na raiz de `greenfield/`, criados quando o primeiro termo ou decisão aparecer. See `docs/agents/domain.md`.

## Nunca
- Editar migração já aplicada.
- Declarar cor, fonte ou espaçamento fora dos tokens do `DESIGN.md`.
- Escrever segredo, senha ou token em arquivo versionado.
- Usar dado real de cliente ou de pessoa: os dados do workshop são fictícios.
