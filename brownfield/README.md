# Brownfield: a base de conhecimento de um repositório legado

O kit dos dias 3 e 4 do workshop. Ele não traz conteúdo: traz a estrutura das pastas, três comandos para o Claude Code, o script que confere o frontmatter, a configuração do OpenSpec para um sistema que já existe e a lista das skills a copiar. O conteúdo da base sai do repositório de cada time, escrito pelo agente a partir do código e conferido por pessoas.

## Os sete passos

| Dia | Passo | Como | O que sai |
|---|---|---|---|
| 3 | 1. Instalar o kit | O prompt abaixo | O kit num commit da branch |
| 3 | 2. Gerar a base | `/base <área>` | Todos os documentos, em rascunho |
| 3 | 3. Revisar três documentos | O prompt de revisão | `ARCHITECTURE.md` e os dois padrões `stable`, num pull request |
| 4 | 4. O pedido | `/pedido <item>` | Um pedido pequeno em `docs/prds/`, que o PO aprova mudando o status para `stable` |
| 4 | 5. A proposta | `/opsx:new` e `/opsx:continue` | A proposal aprovada pelo PO, e as tasks |
| 4 | 6. Construir | `/opsx:apply` | O código, com o teste antes |
| 4 | 7. Fechar | `/fechar <mudança>` | A base atualizada, o pull request e o roteiro da apresentação |

O dia 4 começa numa branch nova, criada a partir da branch da base.

Os prompts de cada passo estão em `../modelos/23-base-local-por-prompts.md`.

## O que está aqui

| Caminho | O que tem |
|---|---|
| `kit/.claude/commands/` | `/base`, `/pedido` e `/fechar` |
| `kit/docs/` | Os índices de `docs/`, `docs/adrs/`, `docs/prds/` e `docs/padroes/`, e o `log.md` |
| `kit/scripts/check-docs.mjs` | A checagem do frontmatter (modelo 15), já com `VISION.md`, `ARCHITECTURE.md` e `DESIGN.md` na lista. Também recusa um caminho de `sources` que não existe, uma citação com número de linha e um marcador esquecido (`"+data+"`, `<preencha`, `TODO:`, `NNN`) |
| `kit/.claude/settings.json` e `kit/scripts/guard-status.mjs` | O hook que impede o agente de escrever `status: stable`: só uma pessoa muda o status, no editor |
| `kit/openspec-config.yaml` | A configuração do OpenSpec que manda cada artefato ler a base e os padrões |
| `../modelos/` | Os formatos: 05 (`CLAUDE.md`), 05a (`VISION.md`), 05b (`ARCHITECTURE.md`), 05f (`DESIGN.md`), 12 (ADR), 31 (PRD), 32 e 33 (padrões de banco e de código), 34 (testes) |

## Passo 1: instalar no repositório legado

Clone este repositório ao lado do repositório legado e crie uma branch nele:

```bash
git clone https://github.com/leancosts/workshop.git workshop-kit
cd <repositório legado>
git switch -c base-de-conhecimento
claude
```

Peça ao agente:

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
   (matcher Edit|Write|MultiEdit) ao que existe e me mostre o que
   mudou.
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

```text
/base <a área ou a pasta que o time vai mudar>
```

O agente lê o repositório e escreve, sem parar para perguntar. Primeiro vem o que o time revisa no dia (o inventário, o `ARCHITECTURE.md`, o `README.md`, os dois padrões e o `CLAUDE.md`); quando ele escreve "A base mínima está pronta", o time já pode revisar. O resto fica em rascunho:

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
linha: a linha fica só na conversa.

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
linha: a linha fica só na conversa.

Depois faça, uma por vez, as perguntas de "Decisões para o time",
com a contagem de cada variante e a sua recomendação. A cada
resposta, escreva a regra na seção do tema, com um exemplo, tire a
pergunta de "Decisões para o time" e anote quem decidiu e a data.
Um comportamento que o time reconhece como defeito não vira regra
do padrão: anote-o como item do backlog.

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
linha: a linha fica só na conversa.

Depois faça, uma por vez, as perguntas de "Decisões para o time",
com a contagem de cada variante e a sua recomendação. A cada
resposta, escreva a regra na seção do tema, com um exemplo, tire a
pergunta de "Decisões para o time" e anote quem decidiu e a data.
Um comportamento que o time reconhece como defeito não vira regra
do padrão: anote-o como item do backlog.

Por fim, abra um arquivo de referência por camada e uma rota, um
job ou um objeto do banco que foge do padrão e COPIE na resposta o
trecho de cada um, com o arquivo e a função: eu não vejo as suas
leituras de arquivo. Escolha também as três afirmações que mais
pesam e copie o trecho delas.

Não mude o status.
```

Uma pessoa do time, depois de ler o documento e conferir as citações no código, muda o status de `draft` para `stable` no editor, e a mudança entra no pull request. Só uma pessoa faz isso: o agente nunca escreve `status: stable`, e o hook do kit (`scripts/guard-status.mjs`) o impede. Um documento `stable` não é editado pelo agente sem o OK do time: ele propõe o trecho na resposta; com o OK, aplica o trecho no /fechar, num commit próprio. Os outros documentos ficam em rascunho: o agente os trata como hipótese e confere no código.

Opcional, antes de marcar um documento como `stable`, quando o time tem acesso a outro modelo: rode só nele a revisão adversarial do primeiro prompt de "Brownfield: depois da semana" (`../modelos/23-base-local-por-prompts.md`), numa sessão nova com outro modelo. Sem outro modelo, a conferência da pessoa cobre as citações no código e as decisões do documento.

## Passos 4 a 7: uma mudança pequena

```text
/pedido <o item do backlog>
/opsx:new <nome>          abre a mudança
/opsx:continue            proposal: cita o pedido e os arquivos; o PO aprova
/opsx:continue            specs: o comportamento novo, um requisito por critério de aceite
/opsx:continue            design: abre com "Padrões seguidos", um documento por decisão
/opsx:continue            tasks: no máximo seis, a primeira é o teste de caracterização (numa correção, o teste que reproduz a falha)
/opsx:apply               uma task por vez, o teste antes do código
/fechar <nome>
```

Um `/opsx:continue` escreve um artefato, e os arquivos de `openspec/changes/<nome>/` entram num commit depois de cada um. Feature nova, melhoria e correção seguem o mesmo caminho. O que muda é o tamanho: o `/pedido` mede o item e propõe uma fatia menor quando ele não cabe.

**Correção.** O caminho é o mesmo dos passos 4 a 7: `/pedido`, `/opsx:new corrige-<nome>` (o `/pedido` sugere esse nome), `/opsx:continue` até as tasks, `/opsx:apply` e `/fechar corrige-<nome>`. Numa correção, a primeira task é o teste que reproduz a falha, escrito com a skill `/diagnosing-bugs`, e ele faz o papel do teste de caracterização. A correção mínima é a task seguinte. Uma task por vez, com um commit entre elas.

O banco de desenvolvimento é um só para todas as branches: uma migração aplicada numa branch continua aplicada quando o time troca de branch. Antes de trocar, o time a desfaz ou recria o banco local.

## O que não entra aqui

Código da empresa, dado pessoal e segredo. Os exemplos do material usam nomes e caminhos fictícios.
