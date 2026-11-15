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
   - um documento com status: stable não é editado pelo agente sem o OK do time: ele propõe o trecho na resposta; com o OK, aplica o trecho no /fechar, num commit próprio;
   - `CLAUDE.md`: se eu corrigi você mais de uma vez pelo mesmo motivo nesta sessão, proponha a regra que evitaria o erro;
   - uma linha em `docs/log.md`;
   - em tudo que você escrever ou atualizar: cite o arquivo e a função, a tabela ou a rota, sem número de linha; não escreva contagens ("45 testes", "seis arquivos"), que a próxima mudança desatualiza e que conflitam no merge; e toda data vem da saída de `date`, nunca de cabeça.
3. Abra um pull request em rascunho contra a branch de onde esta saiu (a da base, se ela ainda não foi incorporada), com a descrição no formato de ../workshop-kit/modelos/14-descricao-do-pr.md: o pedido, o que mudou e o que ficou fora, a evidência (o teste novo antes e depois), o que mudou na base e o que não ficou pronto. Não escreva nada que você não possa mostrar num arquivo ou numa saída de comando. Sem remoto ou sem linha de comando autenticada, escreva a descrição em `.tmp/pr-<nome>.md`, dentro do repositório e fora do commit (crie `.tmp/.gitignore` com a linha `*`, se ele não existe), e diga ao time que abra o pull request pela interface web. Se a mudança aplicou uma migração no banco local de desenvolvimento, escreva na descrição o que foi aplicado e como desfazer: o banco é um só para todas as branches, a migração continua aplicada quando o time troca de branch, e antes de trocar o time a desfaz ou recria o banco local.
4. Escreva o roteiro da apresentação, em cinco linhas (sem remoto, em `.tmp/roteiro-<nome>.md`, também fora do commit):
   - o pedido e o tipo;
   - a mudança, e como mostrar que funciona;
   - a evidência: o teste que falhava e passa;
   - o que entrou na base;
   - um erro seu que o time ou um teste pegou.
5. Não arquive a mudança agora: o `/opsx:archive` fica para depois do merge.
