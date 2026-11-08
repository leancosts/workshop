# Prontidão da tripulação

## O que é
Diz se cada tripulante pode ser escalado, com base na validade dos seus documentos. Exercício do workshop, com dados fictícios.

Leia `VISION.md` antes de cada tarefa. Quando uma tarefa conflitar com um princípio, levante o conflito.

## Como rodar
- Verificar tudo (formatação, build e testes): `dotnet run scripts/verificar.cs`
- Testes: `dotnet test`; um teste só: `dotnet test --filter NomeDoTeste`
- Corrigir a formatação: `dotnet format`

## Estrutura
- `src/Prontidao/`: o código do sistema.
- `tests/Prontidao.Tests/`: os testes.
- `ARCHITECTURE.md` e `docs/index.md`: o mapa completo.

## Como trabalhamos
- Teste primeiro: o teste novo falha antes da mudança e passa depois.
- Nunca afirmar algo sobre um código que não foi aberto. Citar arquivo e linha.
- O documento vivo muda no mesmo commit que o código.
- Toda decisão fora da spec é registrada: no commit, no comentário da issue ou numa ADR.
- Uma branch curta por mudança, num worktree em `.worktrees/`. Commits pequenos, um tipo de mudança cada. A `main` avança só com o OK de uma pessoa.

## Nunca
- Criar uma segunda versão da regra de prontidão.
- Usar nome de pessoa ou dado real.
- Escrever segredo, senha ou token em arquivo.
