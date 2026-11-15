---
description: Leva um item do backlog a um pedido pequeno e completo (PRD, grill-me e revisão adversarial)
argument-hint: <o item do backlog, como o time o escreveria>
---

O item do backlog: $ARGUMENTS

Não comece a mudança. Este comando faz, em ordem, os três movimentos do dia 2: o PRD, o grill-me e a revisão adversarial. Nenhum código, nenhuma proposta do OpenSpec, antes de o PO aprovar o pedido. A primeira linha da sua primeira resposta é "Etapa 1 de 3: o PRD". Ao passar a cada movimento seguinte, diga em uma linha: "Etapa 2 de 3: o grill-me", "Etapa 3 de 3: a revisão adversarial".

## Antes

1. Leia o CLAUDE.md, o ARCHITECTURE.md, o docs/inventario.md, os documentos de docs/padroes/ e o código da área do item.
2. Se a branch atual é a principal ou a `base-de-conhecimento`, crie uma branch para o pedido, com um nome curto, e trabalhe nela.

## 1. O rascunho do PRD

Escreva `docs/prds/NNN-nome.md`, onde `NNN` é o próximo número livre olhando todas as branches (`git log --all --name-only -- docs/prds`), no formato de `docs/modelos/31-prd.md` (type: PRD, status: draft), curto:

- o tipo: feature nova, melhoria ou correção;
- "Quem ganha" e "Objetivo", em uma frase cada;
- "Problema hoje", com o que o sistema faz hoje, citando o arquivo e a função, a tabela ou a rota, sem número de linha. Numa correção, os passos para reproduzir;
- "Pronto quando", com o critério de aceite;
- "Fora de escopo";
- "Decisões em aberto": tudo o que o item não diz e o código não responde. Não preencha lacuna com palpite: o que falta entra aqui, como pergunta.

Atualize também, em `docs/inventario.md`, as features da área do item, se elas ainda estão só por alto.

## 2. O tamanho

O pedido é pequeno o suficiente quando:

- toca até cinco arquivos do sistema; em código de banco, até cinco objetos (a especificação e o corpo de um package contam como um);
- não muda o esquema do banco, ou acrescenta no máximo uma coluna ou uma tabela, sem migrar dado que já existe;
- não depende de outro time, de outro repositório nem de um acesso que o time não tem;
- tem um critério de aceite que um teste automatizado verifica.

Se o item não é pequeno, a primeira pergunta do grill-me propõe a menor fatia que um usuário percebe e diz o que fica fora.

## 3. O grill-me

Use a skill `grill-me` sobre o PRD, com estas regras, que valem no lugar das rodadas da skill:

- uma pergunta por mensagem, com o cabeçalho "Pergunta N", o que o código mostra e a sua recomendação, escrita para que "sim" a aceite;
- só pergunte o que o código não responde: o que você pode ler, leia;
- quem responde é o PO: pergunte na língua do negócio, sem rota, código HTTP, nome de campo, de tabela ou de função. A tradução técnica de cada resposta é sua, e vai para o PRD;
- se o pedido cria ou altera uma tabela ou outro objeto do banco, pergunte quem responde pelo banco e se essa pessoa está de acordo, e escreva o nome no PRD, em "Quem aprovou";
- pergunte até não restar decisão em aberto. Um item raso pede mais perguntas, não menos. No mínimo: quem ganha; um exemplo do critério de aceite com valores (a entrada e o resultado esperado); o que acontece no vazio, no limite e no erro; o que fica fora;
- a cada resposta, atualize o PRD e tire a pergunta de "Decisões em aberto";
- o que é técnico vai para "Perguntas para o engenheiro", no fim do PRD;
- o que o PO não sabe responder vai para "Fora de escopo", ou o pedido para até alguém responder.

Se o pedido conflita com um princípio do VISION.md, com uma ADR ou com um padrão, pare e mostre o conflito.

## 4. A revisão adversarial

Quando não restar decisão em aberto, chame um subagente com contexto limpo (a ferramenta de subagentes, com o modelo opus, se a conta tiver acesso a ele) e entregue só esta instrução, com o caminho do PRD:

```text
Você é o revisor adversarial deste PRD: <caminho>. Leia o CLAUDE.md,
o ARCHITECTURE.md, os documentos de docs/padroes/, o PRD e o código que
ele cita, antes de opinar.

Procure: decisão em aberto sem resposta; "Pronto quando" que um teste
automatizado não verifica, ou sem exemplo com valores; solução escrita
como objetivo; escopo maior que cinco arquivos ou que migra dado que já
existe; "Problema hoje" que o código desmente; caso de vazio, limite ou
erro sem resposta; conflito com o VISION.md, com uma ADR ou com um
padrão.

Bloqueie quando tiver dúvida. Cada ponto cita o trecho do PRD e a falha
concreta. Ponto vago não bloqueia. Não proponha melhorias fora do
pedido.

Responda: APROVADO, ou a lista numerada do que bloqueia.
```

Cole na resposta o que o revisor respondeu, inteiro, e pare: o time lê antes de qualquer correção. Na mensagem seguinte, corrija só o que foi apontado; cada ponto que é decisão vira uma pergunta ao PO, uma por vez, com a sua recomendação. Depois chame o revisor de novo, só para conferir a lista (ele bloqueia apenas por um defeito novo do mesmo peso), e cole a resposta dele. Se ainda bloquear, cada ponto que resta vira uma pergunta ao PO: você nunca fecha um ponto do revisor sozinho. A decisão fica escrita no PRD.

## No fim

Acrescente o pedido em `docs/prds/index.md`, rode `node scripts/check-docs.mjs` até passar e faça um commit com o pedido, em `draft`. Termine com o caminho do arquivo e com estas instruções: o PO lê o pedido e o aprova trocando `status: draft` por `status: stable` na linha do topo, no editor; você nunca escreve `status: stable`. Diga o próximo comando: `/opsx:ff <nome>`, com o nome da mudança (numa correção, `corrige-<nome>`). Não comece a mudança por outro caminho.
