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

Os passos são os do dia 3 (capítulo 11). O time não cola prompt: copia as pastas do kit (`brownfield/kit`, do repositório `leancosts/workshop`) para o repositório legado e digita os comandos. Abaixo está o texto de cada comando, como ele fica em `.claude/commands/`; `$ARGUMENTS` é o que vem depois do comando. O `VISION.md`, o `ARCHITECTURE.md` e o `DESIGN.md` levam o frontmatter do padrão; o `CLAUDE.md` e o `README.md` não.

**Antes do passo 1, só para o time que trabalha só no banco.** `/banco <schema> <filtro de nome>`, numa pasta vazia com as pastas do kit (capítulo 11, "Quando o time só trabalha no banco"). O exemplo é Oracle.

````text
O que o time informou (pode vir vazio): $ARGUMENTS

Este time trabalha só no banco de dados (procedures, functions, packages, triggers). O banco pode ser de qualquer fabricante (Oracle, SQL Server, PostgreSQL, MySQL, DB2 ou outro), grande, pouco organizado ou de um ERP, com milhares de objetos que não são do time. O time não precisa saber em que schema as coisas estão nem como o banco é organizado: você se conecta ao banco de homologação, lê o catálogo e descobre.

## Regras

- Só leitura. Você roda apenas `SELECT` no catálogo do banco e as funções que devolvem a definição de um objeto. Nunca DDL, nunca `INSERT`, `UPDATE`, `DELETE` ou `MERGE`, nunca uma procedure do sistema que grave algo. A única exceção é ajustar o formato da própria extração (no Oracle, `DBMS_METADATA.SET_TRANSFORM_PARAM`). Onde o banco permite, abra a sessão ou a transação em modo de leitura.
- Nenhuma linha de tabela de negócio sai do banco: só o catálogo e a estrutura.
- Só o banco de homologação ou de desenvolvimento. Se o endereço parecer de produção, pare e pergunte.
- A senha fica no arquivo `.env` e nunca aparece na conversa, num comando escrito na resposta, num arquivo de `banco/` nem num commit. Nunca mostre o conteúdo do `.env`, nem com a senha mascarada: o programa que conecta lê as variáveis. Se o time colar uma senha na conversa, diga que ela ficou exposta, peça que a troquem no banco e que a ponham no `.env`.
- Para escrever um programa em `.tmp/`, use a ferramenta de escrita de arquivos, não um heredoc do terminal.
- O banco inteiro nunca é copiado: só os objetos de partida e o que está em volta deles. O resto entra quando uma mudança pedir.
- O que você escrever para se conectar e consultar fica em `.tmp/` (crie `.tmp/.gitignore` com a linha `*`), fora do commit.

## 1. A conexão

1. Confira que o `.gitignore` do repositório tem a linha `.env`; se não tem, acrescente-a e diga isso.
2. Confira, sem mostrar os valores, se o `.env` existe e tem as variáveis `BANCO_TIPO`, `BANCO_SERVIDOR`, `BANCO_PORTA`, `BANCO_NOME`, `BANCO_USUARIO` e `BANCO_SENHA` preenchidas. Se falta algo, peça ao time, nestas palavras, e pare: "Copie o arquivo `.env.example` para `.env`, nesta pasta, e preencha no editor a conexão do banco de homologação: o tipo do banco, o servidor, a porta, o nome do banco ou do serviço, o usuário e a senha. De preferência, um usuário só de leitura. Não escreva a senha aqui na conversa. Depois escreva: pronto."
3. Com o `.env`, conecte com o que a máquina já tem (`sqlplus`, `sql`, `sqlcmd`, `psql`, `mysql`). Se não houver cliente, instale um driver em `.tmp/` (por exemplo, `npm install --prefix .tmp oracledb`, `mssql`, `pg` ou `mysql2`) e escreva lá o que precisar.
4. Se a conexão falhar, diga ao time, em uma linha, o que a mensagem de erro significa e o que conferir (o endereço, a rede ou a VPN, o usuário). Não tente adivinhar outra senha nem outro servidor.

## 2. O mapa

Leia o catálogo e monte o mapa:

1. Os schemas (ou bancos, ou owners) que não são do próprio sistema de banco, com a quantidade de objetos de código de cada um.
2. Os 40 objetos de código alterados por último, com o schema, o tipo e a data: num ERP, é onde costumam estar as customizações do time.

Se o time informou um nome, ele é o ponto de partida. Se não, mostre o mapa em até quinze linhas e faça uma pergunta só, com a sua recomendação: "Qual destes objetos o time vai mudar?" O time pode responder com o nome de um objeto ou com as palavras do negócio ("a cobrança"): procure no catálogo e confirme o que achou. Se o time ainda não sabe, use os dez alterados por último. Não recomende trazer um schema inteiro.

## 3. O export

1. Traga a definição de cada objeto de partida, do que ele usa diretamente (as tabelas que uma procedure lê ou grava, por exemplo) e, para cada tabela que entrou, dos triggers, índices, chaves estrangeiras e permissões dela: um trigger dispara na gravação que a procedure faz. Um nível só. Deixe de fora os objetos do próprio sistema de banco.
2. Grave do cliente direto para o disco, sem passar o texto pela conversa: um objeto por arquivo, em `banco/<schema>/<tipo>/<objeto>.sql`, com o schema e o objeto em maiúsculas ou minúsculas como estão no catálogo, e com estes nomes de tipo, sempre: `table`, `foreign_key`, `index`, `view`, `type`, `sequence`, `synonym`, `package`, `procedure`, `function`, `trigger`, `job` e `grant`. A especificação e o corpo de um package ficam no mesmo arquivo. Sem atributos de armazenamento e sem o valor atual de uma sequence, que mudam de ambiente para ambiente.
3. Grave `banco/dependencias.csv`: quem usa o quê, lido do catálogo, inclusive os objetos que não foram exportados.
4. Confira e mostre ao time, sempre, uma tabela com três colunas: o schema e o tipo, quantos objetos foram selecionados e quantos arquivos saíram. Mostre a tabela mesmo quando tudo bate, e antes de qualquer outro aviso. Uma diferença é um objeto que o usuário não alcança: diga qual.
5. Procure senha, token e endereço nos arquivos que saíram. Se achar, pare antes de qualquer commit e mostre só o arquivo, a linha e o nome da constante ou da coluna, nunca o valor. Depois que o time decidir, troque por um marcador só o que o time mandou trocar.
6. Escreva `banco/README.md`, curto: o tipo e a versão do banco, de que ambiente veio, a data (da saída de `date`), o ponto de partida e como repetir o export. Sem o endereço do servidor e sem o usuário.
7. Faça um commit com `banco/`, as pastas do kit e o `.env.example`. Nunca com o `.env` nem com `.tmp/`.
8. Diga, em linguagem simples, o que ficou de fora e o time precisa saber, só com o que você leu nos arquivos: o SQL dinâmico, a ação de um job e as chamadas a outros sistemas que os objetos exportados de fato têm, e os objetos que ficaram só no arquivo de dependências. Não liste um risco que os arquivos não mostram.
9. Diga o próximo passo: "Digite /base."

## Sem conexão

Quando a empresa não permite a conexão, você escreve e o time roda: um script de export para o cliente que o time usa, com o mesmo resultado (os mesmos arquivos, as dependências e a contagem), que roda sem pedir valor nenhum. Diga o comando com um exemplo preenchido, peça a saída inteira e siga do item 4 do export.
````

**Passo 1, o kit.** Baixe o repositório `leancosts/workshop` (o arquivo ZIP, ou `git clone`), abra a pasta `brownfield/kit`, copie o conteúdo dela (`.claude/`, `docs/`, `openspec/` e `scripts/`) e cole na pasta do repositório legado, sem substituir nenhum arquivo que já existe. Abra o Claude Code na pasta do legado: `/` mostra `/base`, `/conferir`, `/pedido` e `/fechar`. A branch e o commit do kit são feitos pelo `/base`.

**Passo 2, gerar a base.** `/base`, sem argumento.

````text
Gere a base de conhecimento deste repositório, do começo ao fim, sem parar para perguntar.
Onde o time vai mexer (pode vir vazio): $ARGUMENTS

Se veio vazio, não pergunte: leia o repositório inteiro por alto, liste no inventário as áreas que encontrou (o nome, a pasta e o que faz, uma linha cada) e as features do sistema na granularidade que couber; num repositório grande, uma linha por módulo. O detalhe de uma área entra no dia da mudança, pelo `/pedido`. Se veio preenchido, leia essa parte em detalhe e o resto por alto.

## Antes de escrever

1. Se a branch atual é a principal do repositório (`main`, `master`, `develop`, `trunk`), crie a branch `base-de-conhecimento` e trabalhe nela.
2. Faça um commit só com os arquivos do kit (`.claude/`, `docs/`, `scripts/` e `openspec/`), se eles ainda não estão num commit.
3. Em `openspec/config.yaml`, troque a linha `Stack:` pelo que você ler nos manifestos do repositório.
4. Confira que `.claude/settings.json` tem o hook `PreToolUse` com o matcher `Edit|Write|MultiEdit|Bash`, o comando `node` e o argumento `${CLAUDE_PROJECT_DIR}/scripts/guard-status.mjs`. Se o repositório já tinha esse arquivo sem o hook, acrescente só o hook ao que existe e diga o que mudou.

## Regras para todos os documentos

- Só leitura no sistema: não altere código, esquema nem configuração. Você só cria e edita os documentos abaixo, e cada commit leva só esses documentos (nunca um arquivo que um comando de instalação ou de build tenha alterado).
- Tudo que você escrever fora do commit (rascunhos, scripts, saídas) vai em `.tmp/`, dentro do repositório. Crie `.tmp/.gitignore` com a linha `*`, para nada disso entrar no commit e o `.gitignore` do time não mudar. Nenhum arquivo fora do repositório (`../`).
- Nos documentos, toda afirmação cita o arquivo e a função, a tabela ou a rota, ou o comando que você rodou. Não escreva número de linha neles: a linha muda a cada commit. Na conversa, ao responder, cite a linha. O que você deduziu sem ler leva a palavra "hipótese".
- Sem contagens ("8 testes", "9 migrações", "seis arquivos") em nenhum documento: a próxima mudança as desatualiza e elas conflitam no merge. A exceção é a contagem de cada variante, nos padrões e em "Decisões para o time", que é o conteúdo deles.
- Toda data escrita no corpo de um documento vem da saída de `date`, lida na hora, nunca de cabeça.
- Um comando que você não rodou, inclusive o de instalar, não entra no `CLAUDE.md` nem no `README.md`.
- Quando o código faz uma coisa e um comentário ou um documento antigo diz outra, não escolha: a divergência vira uma pergunta em "Decisões para o time" do `ARCHITECTURE.md`, com as duas versões, e nada muda até o time decidir.
- Um documento antigo que já existia em `docs/` ganha o frontmatter com `status: deprecated`, e o conteúdo dele fica como está.
- O que o código não responde vira uma pergunta numerada na seção "Decisões para o time", no fim do documento. Nunca escreva um palpite como fato, e nunca escolha entre duas variantes: conte quantas vezes cada uma aparece.
- Arquivo que já existe: não apague o conteúdo. Acrescente o que falta e liste o que mudou. No `README.md` que já existe, uma instrução que o código desmente não fica no arquivo: ela vai para o inventário, na parte da documentação antiga, com a data.
- O banco do `docker-compose.yml` do repositório é local, não compartilhado: suba-o, rode as migrações e a carga inicial e teste o comando que sobe o sistema, para o `README.md` e o `CLAUDE.md` trazerem esses comandos. Para saber se um container está no ar, use `docker ps --filter name=<nome>`, nunca uma lista cortada.
- Se você subir um processo para testar um comando, guarde o PID do que você abriu e encerre só esse, pelo PID. Nunca encerre processos pelo nome (`taskkill /IM`, `pkill`, `killall`).
- Você nunca altera um banco de dados compartilhado e não lê linhas das tabelas dele. Se o `.env` tem as variáveis `BANCO_` (o time só de banco, depois do `/banco`), conecte ao banco de homologação como o `/banco` conectou, só com `SELECT` no catálogo, e conte no banco inteiro as variantes de cada padrão (prefixos de nome, tipos de coluna, onde há trigger): os arquivos de `banco/` são só a parte que o time vai mudar. Sem essas variáveis, o que você precisar saber do banco, peça ao time.
- Senha, token e chave ficam no arquivo `.env`, fora do commit, e nunca aparecem na conversa, num documento nem num comando escrito na resposta. Você não mostra o conteúdo do `.env`. Se o `.gitignore` não tem a linha `.env`, acrescente-a.
- Todo documento, menos o CLAUDE.md e o README.md, começa com o frontmatter de `docs/modelos/05d-documento-okf.md`: `status: draft`, e `sources` com os arquivos lidos. Quem escreveu e quando é o que o git registra: não acrescente campos de autoria. O status fica só no frontmatter: não o escreva no corpo do documento. Só uma pessoa muda o status para `stable`: você nunca escreve `status: stable`.
- Os formatos estão em `docs/modelos/`. Não altere essa pasta.

## Primeiro, o que o time confere hoje (um commit por item)

1. `docs/inventario.md` (type: Pesquisa): a stack e as versões, lidas dos manifestos; as entradas (rotas, jobs, filas, telas); as áreas ou módulos; as features, numa tabela (a feature, por onde entra, os arquivos, objetos e tabelas que a implementam, os testes que a cobrem); o banco (tabelas, migrações, procedures, triggers); os comandos de instalar, build, testes e lint, cada um rodado, com o resultado; os testes que existem e o que não cobrem; a documentação antiga, com a data, e as instruções do `README.md` que o código desmente.
2. `ARCHITECTURE.md` (modelo 05b, type: Arquitetura) e `README.md` (o que o sistema faz, instalar, rodar e testar, só com comandos que passaram).
3. `docs/padroes/modelagem-de-banco.md` (modelo 32): para cada tema, o que a maioria das tabelas faz, com três exemplos, o arquivo de cada um e a contagem.
4. `docs/padroes/escrita-de-codigo.md` (modelo 33): camadas, nomes, tratamento de erro, log e acesso ao banco, com um arquivo de referência por camada. Num repositório de código de banco, o padrão descreve o SQL procedural: nomes, transação, erro e SQL dinâmico. Feche com a seção "Testes" (modelo 34): o comando que roda tudo, o que roda um arquivo só, onde os testes ficam e quais pastas não têm teste.
5. `CLAUDE.md` (modelo 05), em no máximo 60 linhas: os comandos que passaram e os caminhos, sem contagens; uma linha por arquivo da base, dizendo quando ler; "toda tabela nova segue docs/padroes/modelagem-de-banco.md"; "todo código novo segue docs/padroes/escrita-de-codigo.md"; "nos documentos, cite o arquivo e a função, a tabela ou a rota, sem número de linha; a linha fica só na conversa" (no lugar do "citar arquivo e linha" do modelo); "um documento com status: draft é hipótese: confira no código"; "um documento com status: stable não é editado pelo agente sem o OK do time: ele propõe o trecho na resposta; com o OK, aplica o trecho no /fechar, num commit próprio"; "a base muda no mesmo commit que o código"; "só uma pessoa muda o status de um documento para stable, no editor; o agente não muda, nem a pedido do time"; "senha, token e chave ficam no .env, fora do commit e fora da conversa; o agente não mostra o conteúdo do .env"; "ao construir, uma task por vez: o teste antes do código, a falha mostrada antes de o código existir, os testes da área depois de cada task e um commit por task; se um teste que passava falhar, pare e pergunte"; e, só quando o repositório é de código de banco, "o agente só lê o catálogo do banco de homologação, com SELECT; não roda DDL, não altera dados e não lê linhas de tabela: a mudança é um script versionado, o teste é um script que termina em ROLLBACK, e o time roda os dois e cola a saída".
"Código de banco" quer dizer que o sistema do time é PL/SQL, T-SQL ou procedures num banco compartilhado. Uma aplicação com migrações e um banco local (o do `docker-compose.yml`, por exemplo) não é: nela você sobe o banco local, roda as migrações e os testes você mesmo.
6. Atualize `docs/index.md` e os índices das pastas, acrescente uma linha em `docs/log.md` e rode `node scripts/check-docs.mjs` até passar. Faça o commit e escreva: "A base mínima está pronta."

## Depois, o que fica em rascunho

7. `VISION.md` (modelo 05a, type: Visão): só o que o código e a documentação antiga sustentam. Cada princípio entra como pergunta para o PO. `DESIGN.md` (modelo 05f, type: Design), só se o sistema tem telas.
8. `docs/adrs/` (modelo 12): no máximo cinco decisões que o histórico sustenta (mensagens de commit, README antigo, comentários), com Status: proposta e a origem em `sources`. `docs/prds/` fica só com o índice: o primeiro PRD é o pedido do dia da mudança.
9. Acrescente ao `CLAUDE.md` uma linha para cada documento novo, atualize os índices e rode a checagem de novo.

## A resposta final

1. Os arquivos criados, uma linha cada.
2. Quantas "Decisões para o time" cada documento tem, e as três que mais pesam, com a sua recomendação.
3. O que você não conseguiu ler ou rodar, e por quê.
4. O próximo passo, nesta frase: "Digite /conferir: eu faço as perguntas do ARCHITECTURE.md, uma por vez."
````

**Passo 3, conferir três documentos.** `/conferir`, digitado várias vezes: a cada vez o agente registra o documento que uma pessoa marcou como `stable` e segue para o próximo; com os três `stable`, escreve o pull request.

````text
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
````

## Brownfield: uma mudança pequena, em quatro passos

Os passos são os do dia 4 (capítulo 11). Feature nova, melhoria e correção seguem o mesmo caminho.

**Passo 4, o pedido.** `/pedido <o item do backlog, como está escrito>`.

````text
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
````

**Passo 5, a proposta.** `/opsx:ff <nome>`, com o nome que o `/pedido` disse. O comando é do OpenSpec; as regras de cada artefato vêm do `openspec/config.yaml` do kit:

```yaml
schema: spec-driven

context: |
  Language: pt-BR
  All artifacts must be written in pt-BR.
  Keep OpenSpec structural headings and SHALL/MUST keywords in English.
  Sistema legado, com código e dados em uso.
  Toda mudança nasce de um pedido em docs/prds/ que o PO aprovou (status: stable). Antes de abrir a
  mudança, ache o pedido e confira o status. Se está draft, pare e peça ao PO que o aprove. Sem pedido,
  pare e diga: "rode /pedido antes".
  O pedido é a fonte: não pergunte ao time o que ele já responde. Se faltar uma decisão para escrever um
  artefato, pare e mande voltar ao /pedido; nunca escreva um palpite.
  Antes de cada artefato, leia CLAUDE.md, VISION.md, ARCHITECTURE.md e os documentos de
  docs/padroes/ que a mudança toca. Um documento com status: draft no frontmatter é
  hipótese: confira no código antes de usar.
  Um documento com status: stable não é editado pelo agente sem o OK do time: ele propõe o trecho na resposta; com o OK, aplica o trecho no /fechar, num commit próprio.
  Um artefato já escrito (proposal, specs, design) só muda com o OK do time.
  Nos documentos, cite o arquivo e a função, a tabela ou a rota, sem número de linha.
  Código de banco quer dizer que o sistema do time é PL/SQL, T-SQL ou procedures num banco compartilhado.
  Uma aplicação com migrações e um banco local (o do docker-compose.yml, por exemplo) não é: nela o agente
  sobe o banco local e roda as migrações e os testes ele mesmo.
  Depois de escrever os artefatos da mudança, faça um commit com eles (e com o pedido aprovado, se ele
  ainda não está num commit) e mostre ao time: a proposal em até cinco linhas, na língua do negócio, e a
  lista das tasks. Se nada ficou pendente, diga o próximo comando: /opsx:apply. Se ficou uma pendência,
  não diga /opsx:apply: diga o que falta e quem responde.
  Stack: <preencha a partir dos manifestos do repositório: package.json, pom.xml, docker-compose.yml...>

rules:
  proposal:
    - Citar o pedido (docs/prds/NNN-nome.md) e o critério de aceite que a mudança cobre.
    - Listar os arquivos e as tabelas que a mudança toca e os testes que já protegem a área.
    - Numa mudança em objeto do banco, listar também os objetos que dependem dele (do código e de banco/dependencias.csv, se existir).
    - Uma mudança num objeto do banco cita, na proposal, quem responde pelo banco e aprovou, pelo nome, como está no pedido ("Quem aprovou"). Se o pedido não traz esse nome, pare antes de escrever os artefatos e mande voltar ao /pedido; nunca escreva um OK que ninguém deu.
  specs:
    - Um requisito por critério de aceite do pedido, com os valores de exemplo do pedido nos cenários.
  design:
    - Abrir com a seção "Padrões seguidos", citando o documento de docs/padroes/ ou a ADR de docs/adrs/ que sustenta cada decisão.
    - Tabela, coluna ou migração nova segue docs/padroes/modelagem-de-banco.md; fugir de um padrão pede uma ADR com Status proposta.
  tasks:
    - No máximo seis tasks. Cada task é uma mudança de código verificável com o teste dela; nenhuma task só roda um comando, confere algo à mão ou marca checkbox.
    - Cada task atualiza, no mesmo commit, o documento da base que ela desatualiza (se o documento está stable, a task anota a proposta, e o /fechar a aplica com o OK); não há grupo de tasks de documentação no fim.
    - A primeira task escreve um teste de caracterização do que a área faz hoje e que a mudança NÃO deve alterar, e ele passa sem alterar o sistema. Um comportamento que o time já sabe que é defeito não entra nele como esperado. Numa correção, a primeira task é o teste que reproduz a falha, escrito com /diagnosing-bugs, e ele faz o papel do teste de caracterização; a correção é a task seguinte.
    - Cada tarefa de código seguinte começa por um teste que falha, e a tarefa diz o comando que mostra a falha.
    - Só em código de banco, o teste é um script que o time roda no ambiente de desenvolvimento e que termina em ROLLBACK, e a mudança é um script de alteração versionado; a task diz o comando que o time roda.

operations:
  apply:
    guidance:
      - Uma task por vez. Para cada tarefa, rode o teste novo e mostre a falha antes de escrever o código.
      - Depois de cada tarefa, rode os testes da área; se um teste que passava falhar, pare e pergunte.
      - Faça um commit ao fim de cada tarefa.
      - Só em código de banco, você só lê o catálogo, com SELECT, e nunca altera o banco. Escreva o script, peça ao time que o rode e espere a saída colada.
  archive:
    guidance:
      - Sincronize as specs antes de arquivar.
```

**Passo 6, construir.** `/opsx:apply`, sem mais nada: as regras estão no `openspec/config.yaml` e no `CLAUDE.md` que o `/base` escreveu. Numa correção, o caminho é o mesmo e a mudança se chama `corrige-<nome>`; a primeira task é o teste que reproduz a falha, escrito com a skill `/diagnosing-bugs`.

**Passo 7, fechar.** `/fechar`.

````text
A mudança (pode vir vazio): $ARGUMENTS

Se o nome veio vazio, use a mudança aberta em `openspec/changes/`; se há mais de uma, pergunte qual. A mudança está construída. Feche o trabalho, nesta ordem:

1. Rode os testes da área e `node scripts/check-docs.mjs`. Se algo falhar, pare e me mostre a saída.
2. Atualize a base de conhecimento, nesta mesma branch (se uma task já a atualizou, confira e complete):
   - o pedido em `docs/prds/`: marque o que foi entregue e ligue a mudança de `openspec/changes/`;
   - `ARCHITECTURE.md` e `README.md`, só se a mudança os desatualizou. Mostre o trecho antes e depois;
   - `docs/padroes/`: se a mudança criou um caso que o padrão não cobria, proponha o texto e pare para o time decidir;
   - um documento com status: stable não é editado pelo agente sem o OK do time: ele propõe o trecho na resposta; com o OK, aplica o trecho no /fechar, num commit próprio;
   - `CLAUDE.md`: se eu corrigi você mais de uma vez pelo mesmo motivo nesta sessão, proponha a regra que evitaria o erro;
   - uma linha em `docs/log.md`;
   - em tudo que você escrever ou atualizar: cite o arquivo e a função, a tabela ou a rota, sem número de linha; sem contagens e sem listas de arquivos que toda mudança desatualiza ("45 testes", "seis arquivos"), que conflitam no merge; e toda data vem da saída de `date`, nunca de cabeça.
3. Termine com um resumo curto, na conversa: o pedido e o que foi entregue; o que mudou no sistema; a evidência (o teste novo, antes e depois); o que mudou na base; o que não ficou pronto. Se a mudança aplicou uma migração no banco local de desenvolvimento, diga o que foi aplicado e como desfazer: o banco é um só para todas as branches. Nada que você não possa mostrar num arquivo ou numa saída de comando.
4. Não abra o pull request e não escreva roteiro de apresentação: o time abre o pull request como já faz e apresenta como achar melhor.
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

O `VISION.md` com o PO, e qualquer outro documento em rascunho:

```text
/conferir VISION.md
```

## Conferir antes de usar

| Conferência | Quem |
|---|---|
| Os comandos do `CLAUDE.md` rodam numa sessão nova | O agente, numa sessão limpa |
| Uma sessão nova acha o arquivo de uma regra só com os documentos | O agente, numa sessão limpa |
| Cada afirmação bate com o código citado | Outro modelo (modelo 10), depois uma pessoa do time |
| Regras que valem para mais de um sistema | Sobem para a base corporativa por pull request (capítulo 5) |
