# Modelo: base local por prompts

Prompts para montar, em horas, uma base de conhecimento local que baste para os agentes trabalharem num repositório, antes de existir a base corporativa. O resultado é rascunho: cada documento sai com `status: draft`, até alguém do time conferir e mudar o status para `stable`. Formato dos documentos: modelo 05d. Proposta do workshop.

## Regras para todos os prompts

- Nos documentos, toda afirmação tem a fonte: o arquivo e a função, a tabela ou a rota, o comando rodado, ou outro documento. O número de linha fica só na conversa, porque muda a cada commit. Sem fonte, a frase vai para "Perguntas abertas".
- O que o agente deduziu e não leu é marcado como hipótese.
- Comandos de build e teste entram no `CLAUDE.md` só depois de rodar e passar.
- Um subagente por módulo, em paralelo, quando os módulos não se cruzam; cada um devolve só o documento.
- Depois, outro modelo revisa com a instrução do modelo 10, e uma pessoa do time confere e muda o status para `stable`.

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

**Antes do passo 1, só para o time que trabalha só no banco.** O código do banco vai para um repositório, antes do dia 3 (capítulo 11, "Quando o time só trabalha no banco"). O exemplo é Oracle; em outro banco, troque os nomes do Oracle pela ferramenta de export de estrutura e pelo catálogo dele.

```text
Este time trabalha só no banco de dados. Monte neste repositório
vazio o código do banco, em duas etapas. Você não se conecta a um
banco compartilhado nem cria um banco de exemplo: escreva os
scripts, e eu rodo no SQLcl ou no SQL*Plus.

Etapa 1, o export. Pare no fim dela e espere a minha saída.
1. scripts/exportar-banco.sql: o DDL de cada objeto dos schemas
   <schemas>, com DBMS_METADATA.GET_DDL, sem atributos de
   armazenamento e com o START WITH das sequences fixo, para a
   comparação entre ambientes não mostrar o valor atual. Só a
   estrutura, nenhum dado. Leia o catálogo pelas visões DBA_: o
   meu usuário tem o papel SELECT_CATALOG_ROLE. Sem esse papel, o
   GET_DDL só devolve os objetos do próprio usuário; nesse caso eu
   rodo o script como o dono de cada schema. O script roda no
   SQL*Plus sem pedir valor nenhum (SET DEFINE OFF) e cria as pastas
   de saída antes de gravar. Você não pode rodá-lo: confira a
   sintaxe do SQL*Plus linha a linha antes de entregar.
2. A saída em banco/<schema>/<tipo>/<objeto>.sql, um objeto por
   arquivo: tabelas (as chaves estrangeiras à parte), índices,
   views, types, sequences, synonyms (os públicos que apontam para
   os schemas também), packages (especificação e corpo),
   procedures, functions, triggers, jobs com os programs e
   schedules, e grants.
3. banco/dependencias.csv: quem referencia quem, de
   DBA_DEPENDENCIES.
4. No fim, o script imprime, por schema e tipo, quantos objetos o
   catálogo tem e quantos arquivos saíram (os índices de chave
   primária e de unicidade contam como parte da tabela).

Etapa 2, depois que eu rodar o export e colar a saída.
5. Confira a contagem e procure senha, token e endereço no que
   saiu. Se achar, pare e me mostre antes de qualquer commit;
   depois que eu decidir, o próprio script de export troca o valor
   por um marcador, para o próximo export não trazê-lo de volta.
6. Um banco descartável em container (ou numa instância que eu
   possa apagar) que sobe com um comando: cria o usuário de cada
   schema e os que recebem grants, carrega cada schema como o dono
   dele, depois as chaves estrangeiras, e recompila. No fim, o
   mesmo comando imprime na tela quantos comandos falharam e
   quantos objetos ficaram inválidos, e por quê. Sem dados: cada
   teste cria as linhas dele.
7. README.md com os comandos de exportar e de subir o banco, só os
   que passaram, e como comparar o export de dois ambientes. Não
   escreva testes agora: eles são do dia 4. Um commit com tudo.

No fim, liste o que não saiu no export e o que o catálogo não
mostra: SQL dinâmico (para cada EXECUTE IMMEDIATE, o objeto que ele
alcança; quando o nome vem de uma tabela, diga a tabela e a chave e
me pergunte o valor), a ação de um job, um trigger que dispara
outro (para cada trigger, as tabelas em que ele grava e os triggers delas), chamadas de
outros sistemas e objetos que o meu usuário não enxerga.
```

O passo leva mais de uma rodada de conversa, e o time reserva um turno para ele. A primeira execução do script costuma voltar com erro: o time cola a mensagem, e o agente corrige. A pessoa que roda o export precisa ler o dicionário (no Oracle, o papel `SELECT_CATALOG_ROLE`): sem ele, o código de outros schemas não sai.

Daí em diante os passos são os mesmos. No `/pedido`, "até cinco arquivos" são até cinco objetos (a especificação e o corpo de um package contam como um); no passo 6, o teste chama o objeto no banco descartável e a mudança é um script de alteração versionado, e ela segue o gatilho de spec, com o OK de quem responde pelo banco.

**Passo 1, o kit.** O agente copia a estrutura de `docs/`, os comandos, o script de checagem, o hook e as skills, sem alterar nenhum arquivo que já existe, e faz um commit só com o kit. O time clona o kit ao lado do repositório legado, cria a branch e abre o Claude Code:

```bash
git clone https://github.com/leancosts/workshop.git workshop-kit
cd <repositório legado>
git switch -c base-de-conhecimento
claude
```

```text
Leia ../workshop-kit/brownfield/README.md e instale o kit neste
repositório, sem alterar nenhum arquivo que já existe:

1. Copie kit/docs/ para docs/. Se docs/ já existe, crie só o que
   falta e me mostre o que encontrou.
2. Copie kit/scripts/check-docs.mjs e kit/scripts/guard-status.mjs
   para scripts/.
3. Copie kit/.claude/commands/ para .claude/commands/.
4. Copie kit/.claude/settings.json para .claude/settings.json. Se o
   repositório já tem esse arquivo, acrescente só o hook PreToolUse
   (matcher Edit|Write|MultiEdit|Bash) ao que existe e me mostre o
   que mudou.
5. Copie para .claude/skills/ as skills grill-me, grilling, tdd,
   codebase-design, diagnosing-bugs e code-review de
   ../workshop-kit/greenfield/.claude/skills/, com o arquivo
   LICENSE-mattpocock-skills.
6. Rode openspec init --tools claude, troque o openspec/config.yaml
   pelo kit/openspec-config.yaml e preencha a stack com o que você
   ler neste repositório.

Liste o que copiou e faça um commit só com o kit.
```

Depois o time sai e entra de novo no Claude Code (`/exit` e `claude`), para ele carregar os comandos.

**Passo 2, gerar a base.** `/base <a área que o time vai mudar>`. O texto do comando (`.claude/commands/base.md`), em que `$ARGUMENTS` é o que vem depois do comando:

````text
Gere a base de conhecimento deste repositório, do começo ao fim, sem parar para perguntar.
A área que o time vai mudar: $ARGUMENTS

## Regras para todos os documentos

- Só leitura no sistema: não altere código, esquema nem configuração. Você só cria e edita os documentos abaixo, e cada commit leva só esses documentos (nunca um arquivo que um comando de instalação ou de build tenha alterado).
- Tudo que você escrever fora do commit (rascunhos, scripts, saídas) vai em `.tmp/`, dentro do repositório. Crie `.tmp/.gitignore` com a linha `*`, para nada disso entrar no commit e o `.gitignore` do time não mudar. Nenhum arquivo fora do repositório (`../`).
- Nos documentos, toda afirmação cita o arquivo e a função, a tabela ou a rota, ou o comando que você rodou. Não escreva número de linha neles: a linha muda a cada commit. Na conversa, ao responder, cite a linha. O que você deduziu sem ler leva a palavra "hipótese".
- Sem contagens ("8 testes", "9 migrações", "seis arquivos") em nenhum documento: a próxima mudança as desatualiza e elas conflitam no merge. A exceção é a contagem de cada variante, nos padrões e em "Decisões para o time", que é o conteúdo deles.
- Toda data escrita no corpo de um documento vem da saída de `date`, lida na hora, nunca de cabeça.
- Um comando que você não rodou, inclusive o de instalar, não entra no `CLAUDE.md` nem no `README.md`.
- O que o código não responde vira uma pergunta numerada na seção "Decisões para o time", no fim do documento. Nunca escreva um palpite como fato, e nunca escolha entre duas variantes: conte quantas vezes cada uma aparece.
- Arquivo que já existe: não apague o conteúdo. Acrescente o que falta e liste o que mudou. No `README.md` que já existe, uma instrução que o código desmente não fica no arquivo: ela vai para o inventário, na parte da documentação antiga, com a data.
- Se você subir um processo para testar um comando, guarde o PID do que você abriu e encerre só esse, pelo PID. Nunca encerre processos pelo nome (`taskkill /IM`, `pkill`, `killall`).
- Todo documento, menos o CLAUDE.md e o README.md, começa com o frontmatter de ../workshop-kit/modelos/05d-documento-okf.md: `status: draft`, e `sources` com os arquivos lidos. Quem escreveu e quando é o que o git registra: não acrescente campos de autoria. O status fica só no frontmatter: não o escreva no corpo do documento. Só uma pessoa muda o status para `stable`: você nunca escreve `status: stable`.
- O repositório inteiro é lido por alto. A área do time é lida em detalhe.
- Os formatos estão em ../workshop-kit/modelos/.

## Primeiro, o que o time revisa hoje (um commit por item)

1. `docs/inventario.md` (type: Pesquisa): a stack e as versões, lidas dos manifestos; as entradas (rotas, jobs, filas, telas); os módulos; as features da área do time, numa tabela (a feature, por onde entra, os arquivos, objetos e tabelas que a implementam, os testes que a cobrem), e as do resto do sistema só pelo nome, como hipótese; o banco (tabelas, migrações, procedures, triggers); os comandos de instalar, build, testes e lint, cada um rodado, com o resultado; os testes que existem e o que não cobrem; a documentação antiga, com a data, e as instruções do `README.md` que o código desmente.
2. `ARCHITECTURE.md` (modelo 05b, type: Arquitetura) e `README.md` (o que o sistema faz, instalar, rodar e testar, só com comandos que passaram).
3. `docs/padroes/modelagem-de-banco.md` (modelo 32): para cada tema, o que a maioria das tabelas faz, com três exemplos, o arquivo de cada um e a contagem.
4. `docs/padroes/escrita-de-codigo.md` (modelo 33): camadas, nomes, tratamento de erro, log e acesso ao banco, com um arquivo de referência por camada. Feche com a seção "Testes" (modelo 34): o comando que roda tudo, o que roda um arquivo só, onde os testes ficam e quais pastas não têm teste.
5. `CLAUDE.md` (modelo 05), em no máximo 60 linhas: os comandos que passaram e os caminhos, sem contagens; uma linha por arquivo da base, dizendo quando ler; "toda tabela nova segue docs/padroes/modelagem-de-banco.md"; "todo código novo segue docs/padroes/escrita-de-codigo.md"; "nos documentos, cite o arquivo e a função, a tabela ou a rota, sem número de linha; a linha fica só na conversa" (no lugar do "citar arquivo e linha" do modelo); "um documento com status: draft é hipótese: confira no código"; "um documento com status: stable não é editado pelo agente sem o OK do time: ele propõe o trecho na resposta; com o OK, aplica o trecho no /fechar, num commit próprio"; "a base muda no mesmo commit que o código"; "só uma pessoa muda o status de um documento para stable, no editor; o agente não muda, nem a pedido do time"; e, quando o repositório tem código de banco, "nunca rode DDL nem altere dados num banco compartilhado; a mudança no banco é um script versionado".
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

**Passo 3, revisar três documentos.** Um documento por vez: o `ARCHITECTURE.md`, o padrão de banco e o padrão de código. Cada prompt tem as mesmas quatro partes: o agente confere o documento no código, faz as perguntas uma por vez, copia o trecho das afirmações que mais pesam e não muda o status.

`ARCHITECTURE.md`:

```text
Vamos revisar ARCHITECTURE.md juntos.

Primeiro, confira cada afirmação do documento no arquivo citado,
corrija o que não bate e liste o que você corrigiu. No documento,
cite o arquivo e a função, a tabela ou a rota, sem número de
linha: a linha fica só na conversa. Sem contagens e sem listas de
arquivos que toda mudança desatualiza.

Depois faça, uma por vez, as perguntas de "Decisões para o time"
e, em seguida, uma pergunta para cada frase marcada "hipótese",
com a sua recomendação. A cada resposta, escreva a regra na seção
do tema, tire a pergunta de "Decisões para o time" e anote quem
decidiu e a data.

Por fim, escolha as três afirmações que mais pesam numa mudança,
abra o arquivo citado em cada uma e COPIE na resposta o trecho do
código, com o arquivo e a função: eu não vejo as suas leituras de
arquivo.

Não mude o status.
```

Padrão de banco:

```text
Vamos revisar docs/padroes/modelagem-de-banco.md juntos.

Antes, leia as decisões já tomadas em outros documentos da base (o
ARCHITECTURE.md conferido, por exemplo): não refaça uma pergunta já
decidida, cite a decisão.

Primeiro, confira cada afirmação do documento no arquivo citado,
corrija o que não bate e liste o que você corrigiu. No documento,
cite o arquivo e a função, a tabela ou a rota, sem número de
linha: a linha fica só na conversa. Sem contagens e sem listas de
arquivos que toda mudança desatualiza (as variantes só são
contadas nas perguntas ainda abertas).

Depois faça, uma por vez, as perguntas de "Decisões para o time",
com a contagem de cada variante e a sua recomendação. A cada
resposta, escreva a regra na seção do tema, com um exemplo e sem a
contagem das variantes, tire a pergunta de "Decisões para o time"
e anote quem decidiu e a data. Um comportamento que o time
reconhece como defeito não vira regra do padrão: anote-o como item
do backlog.

Por fim, abra três tabelas que seguem o padrão e uma que foge dele
e COPIE na resposta o trecho do esquema de cada uma, com o
arquivo: eu não vejo as suas leituras de arquivo. Escolha também
as três afirmações que mais pesam e copie o trecho delas.

Não mude o status. Não altere o esquema.
```

Padrão de código:

```text
Vamos revisar docs/padroes/escrita-de-codigo.md juntos.

Antes, leia as decisões já tomadas em outros documentos da base (o
ARCHITECTURE.md conferido, por exemplo): não refaça uma pergunta já
decidida, cite a decisão.

Primeiro, confira cada afirmação do documento no arquivo citado,
corrija o que não bate e liste o que você corrigiu. No documento,
cite o arquivo e a função, a tabela ou a rota, sem número de
linha: a linha fica só na conversa. Sem contagens e sem listas de
arquivos que toda mudança desatualiza (as variantes só são
contadas nas perguntas ainda abertas).

Depois faça, uma por vez, as perguntas de "Decisões para o time",
com a contagem de cada variante e a sua recomendação. A cada
resposta, escreva a regra na seção do tema, com um exemplo e sem a
contagem das variantes, tire a pergunta de "Decisões para o time"
e anote quem decidiu e a data. Um comportamento que o time
reconhece como defeito não vira regra do padrão: anote-o como item
do backlog.

Por fim, abra um arquivo de referência por camada e uma rota, um
job ou um objeto do banco que foge do padrão e COPIE na resposta o
trecho de cada um, com o arquivo e a função: eu não vejo as suas
leituras de arquivo. Escolha também as três afirmações que mais
pesam e copie o trecho delas.

Não mude o status.
```

Uma pessoa do time, depois de ler o documento e conferir as citações no código, muda o status de `draft` para `stable` no editor, e a mudança entra no pull request. Só uma pessoa faz isso: o agente nunca escreve `status: stable`, e o hook do kit (`scripts/guard-status.mjs`) o impede, também por um comando do terminal que grave a linha. Um documento `stable` não é editado pelo agente sem o OK do time: ele propõe o trecho na resposta; com o OK, aplica o trecho no /fechar, num commit próprio.

Antes de mudar a linha, a pessoa confere três coisas: as citações abrem no arquivo certo; as decisões do time estão escritas; nada do documento contradiz o que o time sabe.

Opcional, antes de marcar um documento como `stable`, quando o time tem acesso a outro modelo: rode só nele a revisão adversarial do primeiro prompt de "Brownfield: depois da semana", numa sessão nova com outro modelo. Sem outro modelo, a conferência da pessoa cobre as citações no código e as decisões do documento.

Depois, o pull request:

```text
Abra um pull request em rascunho da branch base-de-conhecimento
contra <a branch de desenvolvimento>. Sem remoto ou sem linha de
comando autenticada, escreva a descrição em .tmp/pr-base.md, fora
do commit (crie .tmp/.gitignore com a linha *). Na descrição: os
documentos criados, uma linha cada; quais uma pessoa marcou como
stable e quais seguem em rascunho, dizendo que quem conferiu cada
documento é o nome na mensagem do commit que mudou o status
("conferido por <nome>"); as perguntas que
ninguém do time soube responder, com o nome de quem pode
responder. Não escreva nada que não esteja num arquivo.
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
   - toca até cinco arquivos do sistema; em código de banco, até cinco objetos (a especificação e o corpo de um package contam como um);
   - não muda o esquema do banco, ou acrescenta no máximo uma coluna ou uma tabela, sem migrar dado que já existe;
   - não depende de outro time, de outro repositório nem de um acesso que o time não tem;
   - tem um critério de aceite que um teste automatizado verifica.
4. Se o item não é pequeno, proponha a menor fatia que um usuário percebe e diga o que fica fora.
5. Faça no máximo três perguntas, uma por vez, com a sua recomendação em cada uma, só sobre o que o código não responde (se o código não diz quem ganha, essa é uma das perguntas). Faça as perguntas ANTES de escrever o arquivo: o pedido só é escrito com as respostas.
6. Depois das respostas, escreva o pedido em `docs/prds/NNN-nome.md`, onde `NNN` é o próximo número livre olhando todas as branches (`git log --all --name-only -- docs/prds`), no formato de ../workshop-kit/modelos/31-prd.md (type: PRD, status: draft), curto:
   - "Quem ganha" e "Objetivo", em uma frase cada;
   - "Problema hoje", com o que o sistema faz hoje, citando o arquivo e a função, a tabela ou a rota. Numa correção, os passos para reproduzir;
   - "Pronto quando", com o critério de aceite;
   - "Fora de escopo".
   Em todo o pedido, de feature ou de correção, cite o arquivo e a função, a tabela ou a rota, sem número de linha: a linha fica só na conversa.
7. Se o pedido conflita com um princípio do VISION.md, com uma ADR ou com um padrão, pare e mostre o conflito.

Termine com o caminho do arquivo e diga que o PO aprova o pedido mudando o status dele para `stable`, no editor: você nunca escreve `status: stable`. Só siga depois de ver o status mudado no arquivo. Então faça um commit só com o pedido e diga o próximo comando: `/opsx:new <nome>`. Numa correção, o nome da mudança é `corrige-<nome>`, e o próximo comando é `/opsx:new corrige-<nome>`. Não comece a mudança por outro caminho.
````

**Passo 5, a proposta.** Um `/opsx:continue` escreve um artefato, e os arquivos de `openspec/changes/<nome>/` entram num commit depois de cada um. A mudança abre com `/opsx:new <nome>`, e cada artefato tem a sua linha:

```text
/opsx:new <nome>

/opsx:continue            proposal: cita o pedido e os arquivos; o PO aprova
/opsx:continue            specs: o comportamento novo, um requisito por critério de aceite
/opsx:continue            design: abre com "Padrões seguidos", um documento por decisão
/opsx:continue            tasks: no máximo seis, a primeira é o teste de caracterização
```

O que pedir em cada um:

```text
/opsx:continue
Parta de docs/prds/NNN-nome.md. Escreva a proposal: por que, o que
muda e o que fica fora. Liste os arquivos e as tabelas que a mudança
toca e os testes que já existem na área. Se a mudança altera um
objeto do banco, liste os objetos que dependem dele e peça o OK de quem responde
pelo banco: só o registre na proposal depois que ele vier, com o
nome de quem o deu, e nunca escreva um OK que ninguém deu. Pare
depois da proposal: o PO aprova antes do resto. Faça um commit com
o artefato.
```

```text
/opsx:continue
Escreva as specs: o comportamento novo, um requisito por critério de
aceite do pedido. Faça um commit com o artefato.
```

```text
/opsx:continue
Escreva o design.md. Abra com "Padrões seguidos": para cada decisão,
cite o documento de docs/padroes/ que a sustenta. Se precisar fugir
de um padrão, pare e me pergunte. Faça um commit com o artefato.
```

```text
/opsx:continue
Escreva o tasks.md: no máximo seis tasks. A primeira é o teste de
caracterização do que a área faz hoje e que a mudança não deve
alterar; cada task seguinte começa por um teste que falha.

Numa correção, a primeira task é o teste que reproduz a falha,
escrito com /diagnosing-bugs; a correção é a task seguinte.

Faça um commit com o artefato.
```

**Passo 6, construir.**

```text
/opsx:apply

Uma task por vez. Na primeira, escreva o teste de caracterização do
que a área faz hoje e que a mudança não deve alterar, e me mostre
que ele passa sem alterar o sistema. Um comportamento que o time já
sabe que é defeito não entra nele como esperado.

Nas seguintes, rode o teste novo e me mostre a falha antes de
escrever o código. Depois de cada task, rode os testes da área e
faça o commit. Mostre o teste e o commit e siga para a próxima, a
menos que um teste que passava falhe: então pare e me diga se a
quebra era esperada.

Siga docs/padroes/.
```

**Correção.** O caminho é o mesmo: `/pedido`, `/opsx:new corrige-<nome>` (o `/pedido` sugere esse nome), `/opsx:continue` até as tasks, `/opsx:apply` e `/fechar corrige-<nome>`. Numa correção, a primeira task é o teste que reproduz a falha, escrito com `/diagnosing-bugs`, e ele faz o papel do teste de caracterização. A correção mínima é a task seguinte, e cada task tem o seu commit.

```text
/opsx:apply

O defeito: <o esperado e o que aconteceu>.

Uma task por vez, com um commit entre elas. A primeira é o teste
que reproduz a falha: faça-a com /diagnosing-bugs. Reproduza antes
de explicar: escreva um teste que falha pelo motivo do relato e me
mostre a falha. Só então diga a causa, com o arquivo e a função (a
linha só na conversa). A correção mínima é a task seguinte.
```

**Passo 7, fechar.** `/fechar <nome da mudança>`. O texto do comando:

````text
A mudança $ARGUMENTS está construída. Feche o trabalho, nesta ordem:

1. Rode os testes da área e `node scripts/check-docs.mjs`. Se algo falhar, pare e me mostre a saída.
2. Atualize a base de conhecimento, nesta mesma branch (se uma task já a atualizou, confira e complete):
   - o pedido em `docs/prds/`: marque o que foi entregue e ligue a mudança de `openspec/changes/`;
   - `ARCHITECTURE.md` e `README.md`, só se a mudança os desatualizou. Mostre o trecho antes e depois;
   - `docs/padroes/`: se a mudança criou um caso que o padrão não cobria, proponha o texto e pare para o time decidir;
   - um documento com status: stable não é editado pelo agente sem o OK do time: ele propõe o trecho na resposta; com o OK, aplica o trecho no /fechar, num commit próprio;
   - `CLAUDE.md`: se eu corrigi você mais de uma vez pelo mesmo motivo nesta sessão, proponha a regra que evitaria o erro;
   - uma linha em `docs/log.md`;
   - em tudo que você escrever ou atualizar: cite o arquivo e a função, a tabela ou a rota, sem número de linha; sem contagens e sem listas de arquivos que toda mudança desatualiza ("45 testes", "seis arquivos"), que conflitam no merge; e toda data vem da saída de `date`, nunca de cabeça.
3. Abra um pull request em rascunho contra a branch de onde esta saiu (a da base, se ela ainda não foi incorporada), com a descrição no formato de ../workshop-kit/modelos/14-descricao-do-pr.md: o pedido, o que mudou e o que ficou fora, a evidência (o teste novo antes e depois), o que mudou na base e o que não ficou pronto. Não escreva nada que você não possa mostrar num arquivo ou numa saída de comando. Sem remoto ou sem linha de comando autenticada, escreva a descrição em `.tmp/pr-<nome>.md`, dentro do repositório e fora do commit (crie `.tmp/.gitignore` com a linha `*`, se ele não existe), e diga ao time que abra o pull request pela interface web. Se a mudança aplicou uma migração no banco local de desenvolvimento, escreva na descrição o que foi aplicado e como desfazer: o banco é um só para todas as branches, a migração continua aplicada quando o time troca de branch, e antes de trocar o time a desfaz ou recria o banco local.
4. Escreva o roteiro da apresentação, em cinco linhas (sem remoto, em `.tmp/roteiro-<nome>.md`, também fora do commit):
   - o pedido e o tipo;
   - a mudança, e como mostrar que funciona;
   - a evidência: o teste que falhava e passa;
   - o que entrou na base;
   - um erro seu que o time ou um teste pegou; se nada foi pego, diga isso.
5. Não arquive a mudança agora: o `/opsx:archive` fica para depois do merge.
````

## Brownfield: depois da semana

A revisão por outro modelo, numa sessão nova (`claude --model opus`), primeiro da base e depois do diff de cada mudança:

```text
Você é o revisor adversarial da base de conhecimento deste
repositório. Revise o documento que eu indicar; sem indicação, a
base inteira. Leia CLAUDE.md, README.md, VISION.md, ARCHITECTURE.md e
tudo em docs/. Para cada afirmação sobre o sistema, abra o arquivo
citado e confira. Procure: afirmação sem fonte; fonte que não diz o
que o texto diz; comando que não roda; padrão que o código contradiz;
dois documentos que discordam; decisão do time escrita como fato.
Bloqueie quando tiver dúvida. Cada ponto cita o documento, a linha e
o arquivo do código. Não mude o status de nenhum documento. Responda:
APROVADO, ou a lista do que bloqueia.
```

```text
Você é o revisor adversarial desta mudança. Leia o CLAUDE.md,
docs/padroes/, a proposal e as specs de openspec/changes/<nome>/, o
diff desta branch contra a branch de onde esta saiu (a da base, se
ela ainda não foi incorporada) e .tmp/pr-<nome>.md, se existir.
Procure: tabela, coluna ou migração fora do padrão de banco; código
fora do padrão de código; cenário sem teste; teste que passa sem a
mudança; comportamento fora da proposal; base não atualizada. Rode
os testes tocados. Cada ponto cita arquivo, linha e o padrão
violado. Responda: APROVADO, ou a lista do que bloqueia.
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
