---
description: Confere um documento da base com o time, uma pergunta por vez, e registra as decisões
argument-hint: [opcional: o documento; sem nada, o próximo em rascunho]
---

O documento a conferir (pode vir vazio): $ARGUMENTS

## Antes de perguntar

1. Rode `git status`. Se uma pessoa mudou o status de um documento para `stable` e a mudança ainda não está num commit, rode `node scripts/check-docs.mjs`, e faça o commit, com o nome de quem está conferindo: `docs: <documento> conferido por <nome>`. Se a checagem falhar, corrija o que ela apontou, sem mexer no status.
2. Se você ainda não sabe quem está conferindo, pergunte uma vez só, antes da primeira pergunta: "Quem está conferindo?" Use esse nome nas decisões e no commit; não pergunte de novo.
3. Escolha o documento. Se nenhum foi informado, é o primeiro com `status: draft` nesta ordem: `ARCHITECTURE.md`, `docs/padroes/modelagem-de-banco.md`, `docs/padroes/escrita-de-codigo.md`, `docs/inventario.md`, `VISION.md`, `DESIGN.md`, os de `docs/adrs/`. Diga qual escolheu, em uma linha.
4. Se o `ARCHITECTURE.md` e os dois padrões já estão `stable` e nenhum documento foi informado, não escolha outro: vá para "Quando os três estão conferidos".

## A conferência

1. Leia as decisões já tomadas nos documentos `stable`: não refaça uma pergunta decidida, cite a decisão.
2. Confira cada afirmação do documento no arquivo citado e corrija o que não bate. Diga o que corrigiu, em até cinco linhas. No documento, cite o arquivo e a função, a tabela ou a rota, sem número de linha; sem contagens e sem listas de arquivos que toda mudança desatualiza.
3. Use a skill `grill-me` sobre o documento, com estas regras, que valem no lugar das rodadas da skill:
   - uma pergunta por mensagem, com o cabeçalho "Pergunta N de M", o que o código mostra (com a contagem de cada variante, nos padrões) e a sua recomendação, escrita para que "sim" a aceite;
   - a ordem: as perguntas de "Decisões para o time"; depois, uma para cada frase marcada "hipótese"; por fim, o que uma pessoa nova no time perguntaria e o documento não responde;
   - só pergunte o que o código não responde: o que você pode ler, leia;
   - a cada resposta, escreva a regra na seção do tema, com um exemplo, tire a pergunta de "Decisões para o time" e anote quem decidiu e a data (da saída de `date`);
   - um comportamento que o time reconhece como defeito não vira regra: anote-o como item do backlog, no fim do documento;
   - "não sei" deixa a pergunta aberta, com o nome de quem sabe.
4. Quando não restar pergunta, mostre a prova: escolha as três afirmações que mais pesam numa mudança, abra o arquivo citado em cada uma e COPIE na resposta o trecho do código, com o arquivo e a função. O time não vê as suas leituras de arquivo.
5. Faça um commit com o documento, ainda em `draft`.
6. Não mude o status: você nunca escreve `status: stable`. Termine com estas instruções, nestas palavras: "Leia o documento. Se ele diz o que o time sabe, abra o arquivo no editor, troque `status: draft` por `status: stable` na linha do topo e salve. Depois digite /conferir de novo: eu registro quem conferiu e sigo para o próximo documento."

## Quando os três estão conferidos

Quando o `ARCHITECTURE.md` e os dois padrões estão `stable` e em commits, termine com um resumo curto, na conversa:

1. Os documentos criados, uma linha cada; quais uma pessoa marcou como `stable` (o nome está na mensagem do commit, "conferido por") e quais seguem em rascunho.
2. As "Decisões para o time" que seguem abertas em todos os documentos, inclusive nos que ficaram em rascunho, e as perguntas que ninguém do time soube responder, com o nome de quem pode responder. Nada que não esteja num arquivo.
3. Diga: "A base está pronta na branch `base-de-conhecimento`. O time abre o pull request como já faz." Não envie a branch e não abra o pull request.
4. Diga que o `/conferir <documento>` confere qualquer documento que ficou em rascunho, quando o time quiser.
