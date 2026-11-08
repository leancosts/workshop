# Modelo: documento da base de conhecimento (OKF)

A proposta do workshop para o formato da base de conhecimento é o Open Knowledge Format (OKF, versão 0.2, licença Apache 2.0): uma pasta de arquivos Markdown, cada um com um bloco de metadados no topo. O único campo obrigatório é `type`. Os outros campos dizem de onde o conteúdo veio, quem o gerou, quem o confirmou e até quando ele vale.

```markdown
---
type: Regra de Negócio
title: Tripulante não apto não é escalado
description: Um tripulante com documento vencido, suspenso ou faltando não pode ser escalado num voo.
tags: [prontidao, escala]
sources:
  - id: codigo
    resource: src/Prontidao/RegraDeProntidao.cs
    title: Regra de prontidão
generated: { by: claude-code/opus, at: 2026-11-10T14:00:00Z }
verified:
  - { by: human:maria.silva, at: 2026-11-11T09:00:00Z }
status: stable
stale_after: 2027-05-11T00:00:00Z
---

# Regra

Um tripulante só é escalado num voo se estiver apto na data do voo: todos
os documentos exigidos pela função presentes, ativos e válidos nessa data.

# Onde é aplicada

- [Escala de voo](../processos/escala.md)
- O teste `RegraDeProntidaoTests.cs` cobre o caso.

# Exemplos

| Situação na data do voo | Pode escalar? |
|---|---|
| Habilitação de tipo suspensa | não |
| Certificado médico venceu há 10 dias | não |
| Tudo válido | sim |
```

## Os campos no método

O OKF só exige `type`. O resto abaixo é política local do método: mais rígida que o formato e ainda conforme.

| Campo | Regra |
|---|---|
| `type` | Obrigatório. Um da lista da empresa, que o script aplica. Ponto de partida: Arquitetura (de uma área; o `ARCHITECTURE.md` geral fica na raiz), Regra de Negócio, Processo, Feature, Jornada, Guia, Conceito, Runbook, Decisão, Glossário, Spec, Plano, Pesquisa |
| `title`, `description` | Obrigatórios. `description` é uma frase e aparece no `index.md` |
| `status` | Obrigatório: `draft` (não revisado), `stable` (vale) ou `deprecated` (histórico) |
| `sources` | Obrigatório em Feature, Regra de Negócio, Decisão e Pesquisa: lista de entradas, cada uma com `id` e `resource` (caminho do código, link do ticket ou do documento) |
| `generated` | `{ by, at }`: `by` é `claude-code/<modelo>` ou `human:<id>`; `at` em ISO 8601 com fuso |
| `verified` | Lista de `{ by, at }`. Sem a chave: não verificado. Só agentes ou `process:`: confirmado por máquina. Com `human:`: revisado por pessoa. Sem `human:`, o documento é uma hipótese; a confirmação por máquina é um sinal, não uma revisão |
| `stale_after` | Obrigatório em Runbook: instante em ISO 8601 com fuso (`2027-05-01T00:00:00Z`) a partir do qual o conteúdo precisa ser conferido de novo |

## A pasta

```text
docs/
  index.md            sem frontmatter (só aqui pode haver okf_version); uma linha por documento
  log.md              o que mudou, por data, a mais recente primeiro
  regras/
    index.md
    tripulante-nao-apto.md
  processos/
  decisoes/
  specs/              registros datados: type Spec, deprecated depois de construída
  planos/             registros datados: type Plano
```

Uma linha do `index.md` e uma entrada do `log.md`:

```markdown
* [Tripulante não apto não é escalado](tripulante-nao-apto.md) - Um tripulante com documento vencido, suspenso ou faltando não pode ser escalado num voo.

## 2026-11-11
* **Update**: Regra de escala revisada por uma pessoa.
```

O `VISION.md` e o `ARCHITECTURE.md` ficam na raiz do repositório, onde o agente os procura, e o `docs/index.md` aponta para eles. O script do modelo 15 confere o resto no push.

As instruções para o agente (`CLAUDE.md`, regras por tema, skills) ficam fora desta pasta: elas dizem como trabalhar, e a base diz o que é verdade. O `CLAUDE.md` aponta para o `docs/index.md`.

O leancosts tem tipos de documento, um índice por pasta verificado a cada push e um changelog, que correspondem a `type`, `index.md` e `log.md`. Os campos de confiança são o que a proposta acrescenta.
