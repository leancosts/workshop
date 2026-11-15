---
description: Transforma um item do backlog num pedido pequeno, com critério de aceite
argument-hint: <o item do backlog, em uma ou duas frases>
---

O item do backlog: $ARGUMENTS

Leia o CLAUDE.md, o ARCHITECTURE.md, os documentos de docs/padroes/ e o código da área antes de responder. Não comece a mudança.

1. Diga o tipo: feature nova, melhoria ou correção.
2. Liste os arquivos e as tabelas que a mudança toca, os padrões que se aplicam e os testes que já existem na área.
3. Meça o tamanho. O pedido é pequeno o suficiente quando:
   - toca até cinco arquivos do sistema;
   - não muda o esquema do banco, ou acrescenta no máximo uma coluna ou uma tabela, sem migrar dado que já existe;
   - não depende de outro time, de outro repositório nem de um acesso que o time não tem;
   - tem um critério de aceite que um teste automatizado verifica.
4. Se o item não é pequeno, proponha a menor fatia que um usuário percebe e diga o que fica fora.
5. Faça no máximo três perguntas, uma por vez, com a sua recomendação em cada uma, só sobre o que o código não responde. Faça as perguntas ANTES de escrever o arquivo: o pedido só é escrito com as respostas.
6. Depois das respostas, escreva o pedido em `docs/prds/NNN-nome.md`, onde `NNN` é o próximo número livre olhando todas as branches (`git log --all --name-only -- docs/prds`), no formato de ../workshop-kit/modelos/31-prd.md (type: PRD, status: draft), curto:
   - "Quem ganha" e "Objetivo", em uma frase cada;
   - "Problema hoje", com o que o sistema faz hoje, citando o arquivo e a função. Numa correção, os passos para reproduzir;
   - "Pronto quando", com o critério de aceite;
   - "Fora de escopo".
7. Se o pedido conflita com um princípio do VISION.md, com uma ADR ou com um padrão, pare e mostre o conflito.

Termine com o caminho do arquivo e espere o PO aprovar. Depois que o PO aprovar, faça um commit só com o pedido e diga o próximo comando: `/opsx:new <nome>`. Não comece a mudança por outro caminho. Numa correção, o próximo passo é o mesmo.
