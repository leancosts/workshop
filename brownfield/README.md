# Brownfield: a base de conhecimento de um repositório legado

O kit dos dias 3 e 4 do workshop. Ele não traz conteúdo: traz a estrutura das pastas, o script que confere o frontmatter, a configuração do OpenSpec para um sistema que já existe e a lista das skills a copiar. O conteúdo da base sai do repositório de cada time, escrito pelo agente a partir do código e conferido por pessoas.

## O que está aqui

| Caminho | O que tem |
|---|---|
| `kit/docs/` | Os índices de `docs/`, `docs/adrs/`, `docs/prds/` e `docs/padroes/`, e o `log.md` |
| `kit/scripts/check-docs.mjs` | A checagem do frontmatter (modelo 15), já com `VISION.md`, `ARCHITECTURE.md` e `DESIGN.md` na lista |
| `kit/openspec-config.yaml` | A configuração do OpenSpec que manda cada artefato ler a base e os padrões |
| `../modelos/` | Os formatos: 05 (`CLAUDE.md`), 05a (`VISION.md`), 05b (`ARCHITECTURE.md`), 05f (`DESIGN.md`), 12 (ADR), 31 (PRD), 32, 33 e 34 (padrões de banco, de código e de testes) |
| `../modelos/23-base-local-por-prompts.md` | O prompt de cada passo |

## Instalar no repositório legado

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
3. Copie para .claude/skills/ as skills grill-me, grilling, tdd, codebase-design,
   diagnosing-bugs e code-review de
   ../workshop-kit/greenfield/.claude/skills/, com o arquivo
   LICENSE-mattpocock-skills.
4. Depois que eu rodar openspec init, troque o openspec/config.yaml
   pelo kit/openspec-config.yaml e preencha a stack com o que você
   ler neste repositório.

Liste o que copiou e faça um commit só com o kit.
```

Depois:

```bash
openspec init --tools claude   # a CLI é a do dia 2: openspec --version diz 1.16.1
node scripts/check-docs.mjs    # precisa rodar; sem documentos, não há o que recusar
```

No Claude Code, `/` precisa mostrar `/grill-me` e `/opsx:new`.

## A base que o time escreve

```text
CLAUDE.md            como trabalhar; aponta para o resto (sem frontmatter)
README.md            instalar, rodar, testar (sem frontmatter)
VISION.md            o porquê e os princípios
ARCHITECTURE.md      o mapa e as regras transversais
DESIGN.md            o sistema visual, se há telas
docs/
  index.md  log.md  inventario.md
  adrs/      uma decisão por arquivo (modelo 12)
  prds/      uma capacidade ou um pedido por arquivo (modelo 31)
  padroes/   modelagem-de-banco.md, escrita-de-codigo.md, testes.md
```

Todo documento, menos o `CLAUDE.md`, o `README.md`, os `index.md` e o `log.md`, começa com o frontmatter do modelo 05d. O agente preenche `generated` e deixa `status: draft`. Só uma pessoa do time, depois de ler, acrescenta o próprio nome em `verified` e muda o status para `stable`.

## Os passos

| Passo | O que sai | Formato |
|---|---|---|
| 3 | `docs/inventario.md`: o que existe, com os comandos rodados e as perguntas abertas | modelo 23 |
| 4 | `ARCHITECTURE.md` e `README.md`, provados numa sessão nova | modelo 05b |
| 5 | `VISION.md` (o `/grill-me` entrevista o PO) e `DESIGN.md` | modelos 05a e 05f |
| 6 | `docs/padroes/`: banco, código e testes, com as decisões do time | modelos 32, 33 e 34 |
| 7 | `docs/adrs/` e `docs/prds/` do que já existe | modelos 12 e 31 |
| 8 | `CLAUDE.md`, e a checagem passando | modelo 05 |
| 9 | A revisão por outro modelo e o pull request da base | modelo 10 |
| 10 a 15 | Uma mudança do backlog: pedido, testes do que existe, OpenSpec, revisão e a base atualizada | modelos 02, 31, 14 |

Os prompts de cada passo estão em `../modelos/23-base-local-por-prompts.md`.

## O que não entra aqui

Código da empresa, dado pessoal e segredo. Os exemplos do material usam nomes e caminhos fictícios.
