# Brownfield: a base de conhecimento de um repositório legado

O kit dos dias 3 e 4 do workshop. Ele não traz conteúdo: traz a estrutura das pastas, três comandos para o Claude Code, o script que confere o frontmatter, a configuração do OpenSpec para um sistema que já existe e a lista das skills a copiar. O conteúdo da base sai do repositório de cada time, escrito pelo agente a partir do código e conferido por pessoas.

## Os sete passos

| Dia | Passo | Como | O que sai |
|---|---|---|---|
| 3 | 1. Instalar o kit | O prompt abaixo | O kit num commit da branch |
| 3 | 2. Gerar a base | `/base <área>` | Todos os documentos, em rascunho |
| 3 | 3. Revisar três documentos | O prompt de revisão | `ARCHITECTURE.md` e os dois padrões assinados, num pull request |
| 4 | 4. O pedido | `/pedido <item>` | Um pedido pequeno em `docs/prds/`, aprovado pelo PO |
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
| `kit/scripts/check-docs.mjs` | A checagem do frontmatter (modelo 15), já com `VISION.md`, `ARCHITECTURE.md` e `DESIGN.md` na lista |
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
2. Copie kit/scripts/check-docs.mjs para scripts/.
3. Copie kit/.claude/commands/ para .claude/commands/.
4. Copie para .claude/skills/ as skills grill-me, grilling, tdd,
   codebase-design, diagnosing-bugs e code-review de
   ../workshop-kit/greenfield/.claude/skills/, com o arquivo
   LICENSE-mattpocock-skills.
5. Rode openspec init --tools claude, troque o openspec/config.yaml
   pelo kit/openspec-config.yaml e preencha a stack com o que você
   ler neste repositório.

Liste o que copiou e faça um commit só com o kit.
```

Depois, saia do Claude Code e entre de novo (`/exit` e `claude`), para ele carregar os comandos. Confira:

```bash
node scripts/check-docs.mjs    # precisa rodar; sem documentos, não há o que recusar
```

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

Todo documento, menos o `CLAUDE.md`, o `README.md`, os `index.md` e o `log.md`, começa com o frontmatter do modelo 05d. O agente preenche `generated` e deixa `status: draft`. O que o código não responde fica em "Decisões para o time", no fim de cada documento.

## Passo 3: revisar três documentos

O time revisa o `ARCHITECTURE.md`, o padrão de banco e o padrão de código, um por vez:

```text
Vamos revisar <documento> juntos. Faça, uma por vez, as perguntas
de "Decisões para o time" e as hipóteses, com a sua recomendação.
A cada resposta, corrija o documento. Depois escolha as três
afirmações que mais pesam numa mudança, abra o arquivo citado em
cada uma e me mostre o trecho. Não mude status nem verified.
```

Só uma pessoa do time, depois de ler, acrescenta o próprio nome em `verified` e muda o status para `stable`. Os outros documentos ficam em rascunho: o agente os trata como hipótese e confere no código.

## Passos 4 a 7: uma mudança pequena

```text
/pedido <o item do backlog>
/opsx:new <nome>          abre a mudança
/opsx:continue            escreve a proposal; o PO aprova
/opsx:continue            specs, design e tasks, um por vez
/opsx:apply               uma task por vez, o teste antes do código
/fechar <nome>
```

Feature nova, melhoria e correção seguem o mesmo caminho. O que muda é o tamanho: o `/pedido` mede o item e propõe uma fatia menor quando ele não cabe.

## O que não entra aqui

Código da empresa, dado pessoal e segredo. Os exemplos do material usam nomes e caminhos fictícios.
