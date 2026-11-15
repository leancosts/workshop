# Brownfield: a base de conhecimento de um repositório legado

O kit dos dias 3 e 4 do workshop. Ele não traz conteúdo: traz a estrutura das pastas, três comandos para o Claude Code, o script que confere o frontmatter, o hook que impede o agente de marcar um documento como `stable`, a configuração do OpenSpec para um sistema que já existe e a lista das skills a copiar. O conteúdo da base sai do repositório de cada time, escrito pelo agente a partir do código e conferido por pessoas.

## Como usar este arquivo

Cada slide de exercício diz de qual seção copiar: "Passo N". Copie o texto do bloco inteiro, cole no Claude Code e dê Enter, uma mensagem por vez. Os blocos são os mesmos do modelo 23 (`../modelos/23-base-local-por-prompts.md`).

## Os sete passos

| Dia | Passo | Como | O que sai |
|---|---|---|---|
| 3 | 1. Instalar o kit | O prompt do Passo 1 | O kit num commit da branch |
| 3 | 2. Gerar a base | `/base <área>` | Todos os documentos, em rascunho |
| 3 | 3. Revisar três documentos | Os prompts de revisão | `ARCHITECTURE.md` e os dois padrões `stable`, num pull request |
| 4 | 4. O pedido | `/pedido <item>` | Um pedido pequeno em `docs/prds/`, que o PO aprova mudando o status para `stable` |
| 4 | 5. A proposta | `/opsx:new` e `/opsx:continue` | A proposal aprovada pelo PO, e as tasks |
| 4 | 6. Construir | `/opsx:apply` | O código, com o teste antes |
| 4 | 7. Fechar | `/fechar <nome>` | A base atualizada, o pull request e o roteiro da apresentação |

O dia 4 começa numa branch nova, criada a partir da branch da base.

## O que está aqui

| Caminho | O que tem |
|---|---|
| `kit/.claude/commands/` | `/base`, `/pedido` e `/fechar` |
| `kit/docs/` | Os índices de `docs/`, `docs/adrs/`, `docs/prds/` e `docs/padroes/`, e o `log.md` |
| `kit/scripts/check-docs.mjs` | A checagem do frontmatter (modelo 15), já com `VISION.md`, `ARCHITECTURE.md` e `DESIGN.md` na lista. Também recusa um caminho de `sources` que não existe, uma citação com número de linha e um marcador esquecido (`"+data+"`, `<preencha`, `TODO:`, `NNN`) |
| `kit/.claude/settings.json` e `kit/scripts/guard-status.mjs` | O hook que impede o agente de escrever `status: stable`, pelo Edit, pelo Write e por um comando do terminal que grave a linha: só uma pessoa muda o status, no editor |
| `kit/openspec-config.yaml` | A configuração do OpenSpec que manda cada artefato ler a base e os padrões |
| `../modelos/` | Os formatos: 05 (`CLAUDE.md`), 05a (`VISION.md`), 05b (`ARCHITECTURE.md`), 05f (`DESIGN.md`), 12 (ADR), 31 (PRD), 32 e 33 (padrões de banco e de código), 34 (testes) |

## Antes do dia 3: time só de banco

Só para o time que trabalha só no banco (procedures, functions, triggers). O código do banco vai para um repositório antes do dia 3, em duas etapas, numa mensagem só: o agente escreve o script de export e para; uma pessoa do time o roda no SQLcl ou no SQL*Plus e cola a saída; o agente segue com a etapa 2. O exemplo é Oracle; em outro banco, troque os nomes do Oracle pela ferramenta de export de estrutura e pelo catálogo dele. Troque `<schemas>` pelos schemas do time.

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

Depois, os passos são os mesmos, no repositório do export.

## Passo 1: instalar no repositório legado

Clone este repositório ao lado do repositório legado, entre no legado, crie uma branch e abra o Claude Code:

```bash
git clone https://github.com/leancosts/workshop.git workshop-kit
cd <repositório legado>
git switch -c base-de-conhecimento
claude
```

Cole no Claude Code:

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

Depois, saia do Claude Code e entre de novo (`/exit` e `claude`), para ele carregar os comandos. Confira:

```bash
node scripts/check-docs.mjs    # precisa rodar; sem documentos, não há o que recusar
```

Se o repositório já tinha Markdown em `docs/`, a checagem só passa depois do `/base` (passo 2), que dá frontmatter ao que existia. Antes disso ela lista esses arquivos, e isso é esperado.

No Claude Code, `/` precisa mostrar `/base`, `/pedido`, `/fechar` e `/opsx:new`. A CLI do OpenSpec é a do dia 2: `openspec --version` diz 1.16.1.

## Passo 2: gerar a base

Digite, com a área ou a pasta que o time vai mudar no lugar do texto entre `<` e `>`:

```text
/base <a área ou a pasta que o time vai mudar>
```

O texto do comando está em `.claude/commands/base.md`. O agente lê o repositório e escreve, sem parar para perguntar. Primeiro vem o que o time revisa no dia (o inventário, o `ARCHITECTURE.md`, o `README.md`, os dois padrões e o `CLAUDE.md`); quando ele escreve "A base mínima está pronta", o time já pode revisar. O resto fica em rascunho:

```text
CLAUDE.md            como trabalhar; aponta para o resto (sem frontmatter)
README.md            instalar, rodar, testar (sem frontmatter)
VISION.md            o porquê e os princípios, como perguntas para o PO
ARCHITECTURE.md      o mapa e as regras transversais
DESIGN.md            o sistema visual, se há telas
docs/
  index.md  log.md  inventario.md
  adrs/      as decisões que o histórico sustenta (modelo 12)
  prds/      o que a área do time faz hoje (modelo 31)
  padroes/   modelagem-de-banco.md, escrita-de-codigo.md
```

Todo documento, menos o `CLAUDE.md`, o `README.md`, os `index.md` e o `log.md`, começa com o frontmatter do modelo 05d. O agente deixa `status: draft`; quem mudou o documento e quando é o que o git registra. O que o código não responde fica em "Decisões para o time", no fim de cada documento.

## Passo 3: revisar três documentos

O time revisa o `ARCHITECTURE.md`, o padrão de banco e o padrão de código, um por vez. Cada prompt tem as mesmas quatro partes: o agente confere o documento no código, faz as perguntas uma por vez, copia o trecho das afirmações que mais pesam e não muda o status. Só muda o que ele abre no fim.

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

Uma pessoa do time, depois de ler o documento e conferir as citações no código, muda o status de `draft` para `stable` no editor, e a mudança entra no pull request. Só uma pessoa faz isso: o agente nunca escreve `status: stable`, e o hook do kit (`scripts/guard-status.mjs`) o impede, também por um comando do terminal que grave a linha. Um documento `stable` não é editado pelo agente sem o OK do time: ele propõe o trecho na resposta; com o OK, aplica o trecho no /fechar, num commit próprio. Os outros documentos ficam em rascunho: o agente os trata como hipótese e confere no código.

Antes de mudar a linha, a pessoa confere três coisas: as citações abrem no arquivo certo; as decisões do time estão escritas; nada do documento contradiz o que o time sabe. Depois:

```bash
node scripts/check-docs.mjs
git commit -am "docs: ARCHITECTURE.md conferido por <nome>"
```

O nome de quem conferiu vai na mensagem do commit ("conferido por <nome>"): numa máquina dividida, o autor do commit é o dono do git configurado.

Por fim, o pull request da base, em rascunho:

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

Opcional, antes de marcar um documento como `stable`, quando o time tem acesso a outro modelo: rode só nele a revisão adversarial do primeiro prompt de "Brownfield: depois da semana" (`../modelos/23-base-local-por-prompts.md`), numa sessão nova com outro modelo. Sem outro modelo, a conferência da pessoa cobre as citações no código e as decisões do documento.

## Passo 4: o pedido

O dia 4 começa numa branch nova, criada a partir da branch da base, num terminal na pasta do legado:

```bash
git switch base-de-conhecimento
git switch -c <o nome do desafio>
claude
```

Depois, o item do backlog, em uma ou duas frases, no lugar do texto entre `<` e `>`:

```text
/pedido <o item do backlog>
```

O texto do comando está em `.claude/commands/pedido.md`. O agente mede o item, faz no máximo três perguntas e escreve o pedido em `docs/prds/`. O PO o aprova mudando o status para `stable` no editor; só então o agente faz o commit do pedido e diz o próximo comando.

## Passo 5: a proposta

Uma mensagem por vez. A primeira abre a mudança, com o nome que o `/pedido` sugeriu:

```text
/opsx:new <nome>
```

Cada `/opsx:continue` escreve um artefato e faz um commit com ele. O PO aprova a proposal antes do resto. A proposal:

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

As specs:

```text
/opsx:continue
Escreva as specs: o comportamento novo, um requisito por critério de
aceite do pedido. Faça um commit com o artefato.
```

O design:

```text
/opsx:continue
Escreva o design.md. Abra com "Padrões seguidos": para cada decisão,
cite o documento de docs/padroes/ que a sustenta. Se precisar fugir
de um padrão, pare e me pergunte. Faça um commit com o artefato.
```

As tasks:

```text
/opsx:continue
Escreva o tasks.md: no máximo seis tasks. A primeira é o teste de
caracterização do que a área faz hoje e que a mudança não deve
alterar; cada task seguinte começa por um teste que falha.

Numa correção, a primeira task é o teste que reproduz a falha,
escrito com /diagnosing-bugs; a correção é a task seguinte.

Faça um commit com o artefato.
```

## Passo 6: construir

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

**Correção.** O caminho é o mesmo dos passos 4 a 7: `/pedido`, `/opsx:new corrige-<nome>` (o `/pedido` sugere esse nome), `/opsx:continue` até as tasks, `/opsx:apply` e `/fechar corrige-<nome>`. Numa correção, a primeira task é o teste que reproduz a falha, escrito com a skill `/diagnosing-bugs`, e ele faz o papel do teste de caracterização. A correção mínima é a task seguinte. Uma task por vez, com um commit entre elas. Troque `<o esperado e o que aconteceu>` pelo relato:

```text
/opsx:apply

O defeito: <o esperado e o que aconteceu>.

Uma task por vez, com um commit entre elas. A primeira é o teste
que reproduz a falha: faça-a com /diagnosing-bugs. Reproduza antes
de explicar: escreva um teste que falha pelo motivo do relato e me
mostre a falha. Só então diga a causa, com o arquivo e a função (a
linha só na conversa). A correção mínima é a task seguinte.
```

O banco de desenvolvimento é um só para todas as branches: uma migração aplicada numa branch continua aplicada quando o time troca de branch. Antes de trocar, o time a desfaz ou recria o banco local.

## Passo 7: fechar

```text
/fechar <o nome da mudança>
```

O texto do comando está em `.claude/commands/fechar.md`. Ele roda os testes, atualiza a base, abre o pull request em rascunho (sem remoto, escreve a descrição em `.tmp/pr-<nome>.md`) e escreve o roteiro da apresentação em cinco linhas. O `/opsx:archive` fica para depois do merge.

## O que não entra aqui

Código da empresa, dado pessoal e segredo. Os exemplos do material usam nomes e caminhos fictícios.
