---
description: Fecha a mudança (testes, base atualizada e o resumo do que mudou)
argument-hint: [opcional: o nome da mudança no OpenSpec]
---

A mudança (pode vir vazio): $ARGUMENTS

Se o nome veio vazio, use a mudança aberta em `openspec/changes/`; se há mais de uma, pergunte qual. A mudança está construída. Feche o trabalho, nesta ordem:

1. Rode os testes da área e `node scripts/check-docs.mjs`. Se algo falhar, pare e me mostre a saída.
2. Atualize a base de conhecimento, nesta mesma branch (se uma task já a atualizou, confira e complete):
   - o pedido em `docs/prds/`: marque o que foi entregue e ligue a mudança de `openspec/changes/`;
   - `ARCHITECTURE.md` e `README.md`, só se a mudança os desatualizou. Mostre o trecho antes e depois;
   - `docs/padroes/`: se a mudança criou um caso que o padrão não cobria, proponha o texto e pare para o time decidir; se ela mudou a contagem de uma variante numa pergunta ainda aberta, atualize a contagem;
   - um documento com status: stable não é editado pelo agente sem o OK do time: ele propõe o trecho na resposta; com o OK, aplica o trecho no /fechar, num commit próprio;
   - `CLAUDE.md`: se eu corrigi você mais de uma vez pelo mesmo motivo nesta sessão, proponha a regra que evitaria o erro;
   - uma linha em `docs/log.md`;
   - em tudo que você escrever ou atualizar: cite o arquivo e a função, a tabela ou a rota, sem número de linha; sem contagens e sem listas de arquivos que toda mudança desatualiza ("45 testes", "seis arquivos"), que conflitam no merge; e toda data vem da saída de `date`, nunca de cabeça.
3. Termine com um resumo de até dez linhas, na conversa: o pedido e o que foi entregue; o que mudou no sistema; a evidência (o teste novo, antes e depois); o que mudou na base; o que não ficou pronto. Se a mudança aplicou uma migração no banco local de desenvolvimento, diga o que foi aplicado e como desfazer: o banco é um só para todas as branches. Nada que você não possa mostrar num arquivo ou numa saída de comando.
4. Não abra o pull request e não escreva roteiro de apresentação. A última linha da sua resposta diz: "O time abre o pull request da branch <esta> contra <a branch de onde ela saiu>, como já faz."
5. Não arquive a mudança agora: o `/opsx:archive` fica para depois do merge.
