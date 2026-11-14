# Modelo: base local por prompts

Prompts para montar, em horas, uma base de conhecimento local que baste para os agentes trabalharem num repositório, antes de existir a base corporativa. O resultado é rascunho: cada documento sai com `status: draft` e sem `verified` de pessoa, até alguém do time conferir. Formato dos documentos: modelo 05d. Proposta do workshop.

## Regras para todos os prompts

- Toda afirmação tem a fonte: caminho e linha, comando rodado, ou documento. Sem fonte, a frase vai para "Perguntas abertas".
- O que o agente deduziu e não leu é marcado como hipótese.
- Comandos de build e teste entram no `CLAUDE.md` só depois de rodar e passar.
- Um subagente por módulo, em paralelo, quando os módulos não se cruzam; cada um devolve só o documento.
- Depois, outro modelo revisa com a instrução do modelo 10, e uma pessoa do time confere antes do `verified`.

## Greenfield: do PRD à base

Entrada: o `VISION.md` (modelo 05a) e o PRD da primeira feature.

```text
Leia VISION.md e o PRD <link>. Crie a base local:
1. CLAUDE.md no modelo 05, com os comandos que você rodou e
   passaram, e as regras do modelo 05e que servem a este projeto.
2. ARCHITECTURE.md no modelo 05b: a stack escolhida, o mapa de
   pastas e as regras transversais, cada uma com o porquê.
3. docs/glossario.md com os termos do PRD, um por linha.
4. docs/regras/ com cada regra de negócio do PRD num documento
   (type: Regra de Negócio), citando a seção do PRD.
5. docs/index.md com uma linha por documento.
Frontmatter OKF em cada arquivo de docs/, status: draft.
Liste no fim o que o PRD não diz e uma decisão precisa dizer.
```

## Brownfield: a base do legado, em três passos

Os passos são os do dia 3 (capítulo 11). `<kit>` é a pasta onde o repositório `leancosts/workshop` foi clonado (`../workshop-kit`). O `VISION.md`, o `ARCHITECTURE.md` e o `DESIGN.md` levam o frontmatter do padrão; o `CLAUDE.md` e o `README.md` não.

**Passo 1, o kit.** O prompt de instalação está em `<kit>/brownfield/README.md`: o agente copia a estrutura de `docs/`, os comandos, o script de checagem e as skills, sem alterar nenhum arquivo que já existe, e faz um commit só com o kit.

**Passo 2, gerar a base.** `/base <a área que o time vai mudar>`. O texto do comando (`.claude/commands/base.md`), em que `$ARGUMENTS` é o que vem depois do comando:

````text
Gere a base de conhecimento deste repositório, do começo ao fim, sem parar para perguntar.
A área que o time vai mudar: $ARGUMENTS

## Regras para todos os documentos

- Só leitura no sistema: não altere código, esquema nem configuração. Você só cria e edita os documentos abaixo, e cada commit leva só esses documentos (nunca um arquivo que um comando de instalação ou de build tenha alterado).
- Toda afirmação cita arquivo e linha, ou o comando que você rodou. O que você deduziu sem ler leva a palavra "hipótese".
- O que o código não responde vira uma pergunta numerada na seção "Decisões para o time", no fim do documento. Nunca escreva um palpite como fato, e nunca escolha entre duas variantes: conte quantas vezes cada uma aparece.
- Arquivo que já existe: não apague o conteúdo. Acrescente o que falta e liste o que mudou.
- Todo documento, menos o CLAUDE.md e o README.md, começa com o frontmatter de ../workshop-kit/modelos/05d-documento-okf.md: `status: draft`, `sources` com os arquivos lidos, `generated` com a data de hoje e o seu modelo, e nenhum `verified`. Só uma pessoa escreve `verified`.
- O repositório inteiro é lido por alto. A área do time é lida em detalhe.
- Os formatos estão em ../workshop-kit/modelos/.

## Primeiro, o que o time revisa hoje (um commit por item)

1. `docs/inventario.md` (type: Pesquisa): a stack e as versões, lidas dos manifestos; as entradas (rotas, jobs, filas, telas); os módulos; o banco (tabelas, migrações, procedures, triggers); os comandos de instalar, build, testes e lint, cada um rodado, com o resultado; os testes que existem e o que não cobrem; a documentação antiga, com a data.
2. `ARCHITECTURE.md` (modelo 05b, type: Arquitetura) e `README.md` (o que o sistema faz, instalar, rodar e testar, só com comandos que passaram).
3. `docs/padroes/modelagem-de-banco.md` (modelo 32): para cada tema, o que a maioria das tabelas faz, com três exemplos, o arquivo de cada um e a contagem.
4. `docs/padroes/escrita-de-codigo.md` (modelo 33): camadas, nomes, tratamento de erro, log e acesso ao banco, com um arquivo de referência por camada. Feche com a seção "Testes" (modelo 34): o comando que roda tudo, o que roda um arquivo só, onde os testes ficam e quais pastas não têm teste.
5. `CLAUDE.md` (modelo 05), em no máximo 60 linhas: os comandos que passaram; uma linha por arquivo da base, dizendo quando ler; "toda tabela nova segue docs/padroes/modelagem-de-banco.md"; "todo código novo segue docs/padroes/escrita-de-codigo.md"; "um documento com status: draft é hipótese: confira no código"; "a base muda no mesmo commit que o código".
6. Atualize `docs/index.md` e os índices das pastas, acrescente uma linha em `docs/log.md` e rode `node scripts/check-docs.mjs` até passar. Faça o commit e escreva: "A base mínima está pronta."

## Depois, o que fica em rascunho

7. `VISION.md` (modelo 05a, type: Visão): só o que o código e a documentação antiga sustentam. Cada princípio entra como pergunta para o PO. `DESIGN.md` (modelo 05f, type: Design), só se o sistema tem telas.
8. `docs/adrs/` (modelo 12): no máximo cinco decisões que o histórico sustenta (mensagens de commit, README antigo, comentários), com Status: proposta e a origem em `sources`. `docs/prds/` (modelo 31, type: PRD): um PRD do que a área do time faz hoje.
9. Acrescente ao `CLAUDE.md` uma linha para cada documento novo, atualize os índices e rode a checagem de novo.

## A resposta final

1. Os arquivos criados, uma linha cada.
2. As "Decisões para o time" do ARCHITECTURE.md e dos dois padrões, numeradas, com a sua recomendação em cada uma.
3. O que você não conseguiu ler ou rodar, e por quê.
````

**Passo 3, revisar três documentos.** Um documento por vez: o `ARCHITECTURE.md`, o padrão de banco e o padrão de código.

```text
Vamos revisar <documento> juntos. Faça, uma por vez, as perguntas
de "Decisões para o time" e as hipóteses, com a sua recomendação.
A cada resposta, corrija o documento. Depois escolha as três
afirmações que mais pesam numa mudança, abra o arquivo citado em
cada uma e me mostre o trecho. Não mude status nem verified.
```

Uma pessoa do time, depois de ler, escreve o próprio nome em `verified` e muda o status para `stable`. Depois, o pull request:

```text
Abra um pull request em rascunho da branch base-de-conhecimento
contra a branch de desenvolvimento (sem linha de comando autenticada,
escreva a descrição num arquivo). Na descrição: os documentos
criados, uma linha cada; quais uma pessoa assinou e quais seguem em
rascunho; as perguntas que ninguém do time soube responder, com o
nome de quem pode responder. Não escreva nada que não esteja num
arquivo.
```

## Brownfield: uma mudança pequena, em quatro passos

Os passos são os do dia 4 (capítulo 11). Feature nova, melhoria e correção seguem o mesmo caminho.

**Passo 4, o pedido.** `/pedido <o item do backlog>`. O texto do comando:

````text
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
5. Faça no máximo três perguntas, uma por vez, com a sua recomendação em cada uma, só sobre o que o código não responde.
6. Escreva o pedido em `docs/prds/NNN-nome.md`, no formato de ../workshop-kit/modelos/31-prd.md (type: PRD, status: draft), curto:
   - "Quem ganha" e "Objetivo", em uma frase cada;
   - "Problema hoje", com o que o sistema faz hoje, citando arquivo e linha. Numa correção, os passos para reproduzir;
   - "Pronto quando", com o critério de aceite;
   - "Fora de escopo".
7. Se o pedido conflita com um princípio do VISION.md, com uma ADR ou com um padrão, pare e mostre o conflito.

Termine com o caminho do arquivo e espere o PO aprovar.
````

**Passo 5, a proposta.**

```text
/opsx:new <nome>

/opsx:continue
Parta de docs/prds/NNN-nome.md. Escreva a proposal: por que, o que
muda e o que fica fora. Liste os arquivos e as tabelas que a mudança
toca e os testes que já existem na área. Pare depois da proposal: o
PO aprova antes do resto.

/opsx:continue   (uma vez por artefato: specs, design e tasks)
No design.md, abra com "Padrões seguidos": para cada decisão, cite o
documento de docs/padroes/ que a sustenta. Se precisar fugir de um
padrão, pare e me pergunte. No tasks.md: a primeira task escreve um
teste do que a área faz hoje; cada task seguinte começa por um teste
que falha.
```

**Passo 6, construir.**

```text
/opsx:apply
Uma task por vez. Na primeira, escreva o teste do que a área faz
hoje e me mostre que ele passa sem alterar o sistema. Nas seguintes,
rode o teste novo e me mostre a falha antes de escrever o código.
Depois de cada task, rode os testes da área: se um teste que passava
falhar, pare e me diga se a quebra era esperada. Siga docs/padroes/.
Um commit por task.
```

Numa correção, o teste que reproduz a falha vem primeiro:

```text
/diagnosing-bugs
O defeito: <relato, com o esperado e o que aconteceu>. Reproduza antes
de explicar: escreva um teste que falha pelo motivo do relato e me
mostre a falha. Só então diga a causa, com arquivo e linha, e faça a
correção mínima.
```

**Passo 7, fechar.** `/fechar <nome da mudança>`. O texto do comando:

````text
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
````

## Brownfield: depois da semana

A revisão por outro modelo, numa sessão nova (`claude --model opus`), primeiro da base e depois do diff de cada mudança:

```text
Você é o revisor adversarial da base de conhecimento deste
repositório. Leia CLAUDE.md, README.md, VISION.md, ARCHITECTURE.md e
tudo em docs/. Para cada afirmação sobre o sistema, abra o arquivo
citado e confira. Procure: afirmação sem fonte; fonte que não diz o
que o texto diz; comando que não roda; padrão que o código contradiz;
dois documentos que discordam; decisão do time escrita como fato.
Bloqueie quando tiver dúvida. Cada ponto cita o documento, a linha e
o arquivo do código. Responda: APROVADO, ou a lista do que bloqueia.
```

```text
Você é o revisor adversarial desta mudança. Leia o CLAUDE.md,
docs/padroes/, a proposal e as specs de openspec/changes/<nome>/ e o
diff desta branch contra a branch principal. Procure: tabela, coluna
ou migração fora do padrão de banco; código fora do padrão de código;
cenário sem teste; teste que passa sem a mudança; comportamento fora
da proposal; base não atualizada. Rode os testes tocados. Cada ponto
cita arquivo, linha e o padrão violado. Responda: APROVADO, ou a
lista do que bloqueia.
```

O `VISION.md` com o PO:

```text
/grill-me
Leia o README.md, o ARCHITECTURE.md e o rascunho do VISION.md. Me
entreviste até fechar cada seção. Para cada princípio, pergunte o
que ele impede e onde é verificado. Não escreva princípio que eu não
confirmei.
```

## Conferir antes de usar

| Conferência | Quem |
|---|---|
| Os comandos do `CLAUDE.md` rodam numa sessão nova | O agente, numa sessão limpa |
| Uma sessão nova acha o arquivo de uma regra só com os documentos | O agente, numa sessão limpa |
| Cada afirmação bate com o código citado | Outro modelo (modelo 10), depois uma pessoa do time |
| Regras que valem para mais de um sistema | Sobem para a base corporativa por pull request (capítulo 5) |
