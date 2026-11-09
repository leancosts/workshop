# Greenfield

## O que é
Uma aplicação nova, ainda sem telas e sem funcionalidades. O que ela faz nasce do `VISION.md` e dos PRDs em `docs/prd/`.

## Leia antes de qualquer tarefa
- `VISION.md`: o porquê e os princípios. Quando uma tarefa conflita com um princípio, levante o conflito em vez de contorná-lo.
- `ARCHITECTURE.md`: a stack, o mapa de pastas e as regras transversais.
- `DESIGN.md`: o sistema visual. Os tokens estão em `variables.css`, `theme.css` e `tokens.json`.

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
Ainda não há código. A primeira mudança que criar código cria também `npm run verificar` e registra aqui os comandos de instalar, subir o banco, rodar e testar.

## Como trabalhamos
- Teste primeiro: o teste novo falha antes da mudança e passa depois.
- Nunca afirmar algo sobre um código que não foi aberto. Citar arquivo e linha.
- O documento vivo muda no mesmo commit que o código: as specs do OpenSpec, o `ARCHITECTURE.md` e este arquivo.
- Toda decisão fora da spec é registrada: no commit, no `design.md` da mudança ou numa ADR.

## Nunca
- Editar migração já aplicada.
- Declarar cor, fonte ou espaçamento fora dos tokens do `DESIGN.md`.
- Escrever segredo, senha ou token em arquivo versionado.
- Usar dado real de cliente ou de pessoa: os dados do workshop são fictícios.
