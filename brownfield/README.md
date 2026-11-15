# Brownfield: a base de conhecimento de um repositório legado

O kit dos dias 3 e 4 do workshop. Ele não traz conteúdo: traz os comandos para o Claude Code, a estrutura das pastas, a checagem dos documentos e a configuração do OpenSpec para um sistema que já existe. O conteúdo da base sai do repositório de cada time, escrito pelo agente a partir do código e conferido por pessoas.

Não há instalação, e o time não cola nenhum prompt: copia quatro pastas e digita seis comandos. Cada comando termina dizendo o próximo.

## Copiar o kit

1. Baixe este repositório: botão **Code**, **Download ZIP**, e extraia. Quem tem o git pode clonar.
2. Abra a pasta `brownfield/kit`. Selecione tudo (Ctrl+A) e copie (Ctrl+C).
3. Abra a pasta do repositório legado e cole (Ctrl+V). Se o sistema perguntar, não substitua nenhum arquivo que já existe.
4. Abra um terminal na pasta do legado, digite `claude` e, no Claude Code, `/`. A lista mostra `/base`, `/conferir`, `/pedido` e `/fechar`.

```text
kit/
  .claude/    os comandos, as skills e o hook       copie
  docs/       a estrutura da base e os formatos     copie
  openspec/   a configuração do OpenSpec            copie
  scripts/    a checagem dos documentos e o hook    copie
  .env.example  o modelo do arquivo de senhas       copie
```

Senha, token e chave nunca são escritos na conversa com o agente: ficam no arquivo `.env`, que não entra no commit.

No Mac, as pastas que começam com ponto ficam escondidas no Finder: Cmd+Shift+. mostra. Se a lista não mostra os comandos, o Claude Code foi aberto antes de colar ou fora da pasta do legado: digite `/exit` e abra de novo. A branch e o commit do kit são feitos pelo `/base`.

A CLI do OpenSpec é a do dia 2: `openspec --version` diz 1.16.1.

## Os sete passos

| Dia | Passo | O que digitar | O que sai |
|---|---|---|---|
| 3 | 1. Copiar o kit | Ctrl+C, Ctrl+V | Os comandos na lista do Claude Code |
| 3 | 2. Gerar a base | `/base` | Todos os documentos, em rascunho |
| 3 | 3. Conferir três documentos | `/conferir`, várias vezes | `ARCHITECTURE.md` e os dois padrões `stable`, num pull request |
| 4 | 4. O pedido | `/pedido <o item do backlog>` | Um pedido completo e pequeno, que o PO aprova |
| 4 | 5. A proposta | `/opsx:ff <nome>` | A proposal, as specs, o design e as tasks |
| 4 | 6. Construir | `/opsx:apply` | O código, com o teste antes |
| 4 | 7. Fechar | `/fechar` | A base atualizada e o resumo da mudança; o time abre o pull request |

## Dia 3

**`/base`**, sem mais nada. O agente cria a branch `base-de-conhecimento`, lê o repositório e escreve a base, sem parar para perguntar. Quem já sabe onde vai mexer pode dizer, nas próprias palavras (`/base a tela de emissão de fatura`); não é obrigatório. Quando ele escreve "A base mínima está pronta", o time já pode conferir.

```text
CLAUDE.md            como trabalhar; aponta para o resto (sem frontmatter)
README.md            instalar, rodar, testar (sem frontmatter)
ARCHITECTURE.md      o mapa e as regras transversais
VISION.md            o porquê e os princípios, como perguntas para o PO
DESIGN.md            o sistema visual, se há telas
docs/
  index.md  log.md  inventario.md
  padroes/   modelagem-de-banco.md, escrita-de-codigo.md
  adrs/      as decisões que o histórico sustenta
  prds/      vazio: o primeiro PRD é o pedido do dia 4
```

**`/conferir`**, sem mais nada. O agente escolhe o próximo documento em rascunho (o `ARCHITECTURE.md`, depois o padrão de banco, depois o padrão de código) e faz as perguntas uma por vez, com a recomendação dele, até não restar decisão em aberto (a skill `grill-me`, do dia 2). "Sim" aceita a recomendação. Quando as perguntas acabam:

1. Uma pessoa lê o documento.
2. Abre o arquivo no editor, troca `status: draft` por `status: stable` na linha do topo e salva.
3. Digita `/conferir` de novo: o agente registra quem conferiu e segue para o próximo documento.

Só uma pessoa muda o status: o agente nunca escreve `status: stable`, e o hook do kit o impede. Com os três documentos `stable`, o `/conferir` resume o que ficou conferido e o que segue aberto, e o time abre o pull request da branch `base-de-conhecimento`, como já faz.

O `/conferir` serve para qualquer documento da base: `/conferir VISION.md`, com o PO; `/conferir docs/inventario.md`, para as features.

## Dia 4

**`/pedido <o item do backlog>`**, como o item está escrito hoje, mesmo raso (`/pedido parcelar fatura`). O comando repete os três movimentos do dia 2 antes de qualquer proposta:

1. O rascunho do PRD, em `docs/prds/`, com o que o código mostra e, em "Decisões em aberto", o que falta.
2. O grill-me: as perguntas, uma por vez, até não restar decisão em aberto.
3. A revisão adversarial, por um subagente com contexto limpo: APROVADO, ou a lista do que bloqueia.

O PO aprova o pedido trocando `status: draft` por `status: stable`, no editor.

**`/opsx:ff <nome>`**, com o nome que o `/pedido` disse. O agente escreve a proposal, as specs, o design e as tasks, a partir do pedido aprovado, sem perguntar o que o pedido já responde. Se faltar uma decisão, ele para e manda voltar ao `/pedido`.

**`/opsx:apply`**. Uma task por vez. A primeira é um teste do que a área já faz e a mudança não deve alterar; cada uma das seguintes começa por um teste que falha.

**`/fechar`**. Roda os testes, atualiza a base e resume o que mudou. O time abre o pull request como já faz e apresenta como achar melhor. O `/opsx:archive` fica para depois do merge.

Numa correção, o caminho é o mesmo, e a mudança se chama `corrige-<nome>`.

## Time só de banco

Para o time que trabalha só no banco (procedures, functions, packages, triggers) e não tem o código em arquivos. O time não precisa saber em que schema as coisas estão nem como o banco é organizado. Antes do dia 3:

1. Crie uma pasta vazia e cole nela as pastas do kit.
2. Abra o Claude Code na pasta e digite `/banco`.
3. O agente pede o arquivo `.env`: copie o `.env.example` para `.env` e preencha, no editor, a conexão do banco de homologação (o tipo do banco, o servidor, a porta, o nome do banco ou do serviço, o usuário e a senha), de preferência de um usuário só de leitura. Depois escreva "pronto". O `.env` não entra no commit, e a senha nunca é escrita na conversa com o agente.
4. O agente mostra os objetos de código alterados por último e pergunta qual o time vai mudar. Quem já sabe o nome pode dizê-lo no comando: `/banco PKG_COBRANCA`.
5. O agente traz para `banco/` esse objeto e o que está em volta dele (as tabelas que ele usa, com os triggers, os índices e as chaves delas), confere a contagem, procura senhas e faz o commit. Depois, `/base`.

Vale para qualquer banco (Oracle, SQL Server, PostgreSQL e outros): o agente descobre o tipo e conecta com o cliente que a máquina já tem. O banco inteiro nunca é copiado: num banco grande ou de um ERP, vem só a parte do time. O agente roda só `SELECT` no catálogo: nenhuma linha de tabela, nenhuma alteração. A regra está no comando; a garantia é o usuário só de leitura. Nos passos seguintes, a mudança e o teste são scripts que o time roda. Sem conexão possível, o agente escreve um script de export e o time o roda.

## O que está aqui

| Caminho | O que tem |
|---|---|
| `kit/.claude/commands/` | `/base`, `/conferir`, `/pedido`, `/fechar` e `/banco`; em `opsx/`, os comandos do OpenSpec |
| `kit/.claude/skills/` | As skills que os comandos usam: `grill-me`, `tdd`, `diagnosing-bugs`, `codebase-design`, `code-review` e as do OpenSpec |
| `kit/.claude/settings.json` e `kit/scripts/guard-status.mjs` | O hook que impede o agente de escrever `status: stable`, pelo Edit, pelo Write e por um comando do terminal |
| `kit/docs/` | Os índices de `docs/`, `docs/adrs/`, `docs/prds/` e `docs/padroes/`, o `log.md` e, em `modelos/`, os formatos que os comandos leem (cópias de `../modelos/`) |
| `kit/scripts/check-docs.mjs` | A checagem do frontmatter (modelo 15). Também recusa um caminho de `sources` que não existe, uma citação com número de linha e um marcador esquecido |
| `kit/openspec/config.yaml` | A configuração do OpenSpec: toda mudança parte de um pedido aprovado e lê a base e os padrões |

Cada comando é um arquivo de texto, que o time pode ler e mudar. O texto de todos está também no modelo 23 (`../modelos/23-base-local-por-prompts.md`).

## O que não entra aqui

Código da empresa, dado pessoal e segredo. Os exemplos do material usam nomes e caminhos fictícios.
