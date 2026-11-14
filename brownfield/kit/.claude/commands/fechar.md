---
description: Fecha a mudança (testes, base atualizada, pull request e roteiro da apresentação)
argument-hint: <o nome da mudança no OpenSpec>
---

A mudança $ARGUMENTS está construída. Feche o trabalho, nesta ordem:

1. Rode os testes da área e `node scripts/check-docs.mjs`. Se algo falhar, pare e me mostre a saída.
2. Atualize a base de conhecimento, nesta mesma branch (se uma task já a atualizou, confira e complete):
   - o pedido em `docs/prds/`: marque o que foi entregue e ligue a mudança de `openspec/changes/`;
   - `ARCHITECTURE.md` e `README.md`, só se a mudança os desatualizou. Mostre o trecho antes e depois;
   - `docs/padroes/`: se a mudança criou um caso que o padrão não cobria, proponha o texto e pare para o time decidir;
   - `CLAUDE.md`: se eu corrigi você mais de uma vez pelo mesmo motivo nesta sessão, proponha a regra que evitaria o erro;
   - uma linha em `docs/log.md`.
3. Abra um pull request em rascunho contra a branch de onde esta saiu (a da base, se ela ainda não foi incorporada), com a descrição no formato de ../workshop-kit/modelos/14-descricao-do-pr.md: o pedido, o que mudou e o que ficou fora, a evidência (o teste novo antes e depois), o que mudou na base e o que não ficou pronto. Não escreva nada que você não possa mostrar num arquivo ou numa saída de comando.
4. Escreva o roteiro da apresentação, em cinco linhas:
   - o pedido e o tipo;
   - a mudança, e como mostrar que funciona;
   - a evidência: o teste que falhava e passa;
   - o que entrou na base;
   - um erro seu que o time corrigiu.
