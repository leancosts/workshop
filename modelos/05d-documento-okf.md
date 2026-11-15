# Modelo: documento da base de conhecimento (OKF)

A proposta do workshop para o formato da base de conhecimento é o Open Knowledge Format (OKF, versão 0.2, licença Apache 2.0): uma pasta de arquivos Markdown, cada um com um bloco de metadados no topo. O único campo obrigatório é `type`. Os outros campos dizem de onde o conteúdo veio, em que estado ele está e até quando ele vale. Quem mudou o documento e quando é o que o git registra.

```markdown
---
type: Regra de Negócio
title: Chamado sem artigo na base vai para um analista
description: O agente de triagem só responde um chamado de atendimento quando um artigo da base cobre o pedido.
tags: [triagem, atendimento]
sources:
  - id: codigo
    resource: src/triagem/responder.ts
    title: Resposta pela base
status: stable
stale_after: 2027-05-11T00:00:00Z
---

# Regra

O agente de triagem só responde um chamado de atendimento quando um artigo
da base de conhecimento cobre o pedido. Sem artigo, o chamado fica aberto
com o status "aguardando analista", e o solicitante recebe o aviso.

# Onde é aplicada

- [Fluxo principal](../processos/fluxo-principal.md)
- O teste `responder.test.ts` cobre o caso.

# Exemplos

| Chamado | Resultado |
|---|---|
| "Esqueci minha senha do portal" | respondido e fechado |
| "Minha impressora não funciona" (sem artigo) | aguardando analista |
| "Preciso de acesso ao sistema financeiro" | aguardando analista (exige aprovação) |
```

## Os campos no método

O OKF só exige `type`. O resto abaixo é política local do método: mais rígida que o formato e ainda conforme.

| Campo | Regra |
|---|---|
| `type` | Obrigatório. Um da lista da empresa, que o script aplica. Ponto de partida: Arquitetura (de uma área; o `ARCHITECTURE.md` geral fica na raiz), Regra de Negócio, Processo, Feature, Jornada, Guia, Conceito, Runbook, Decisão, Glossário, Spec, Plano, Pesquisa, PRD, Visão, Design |
| `title`, `description` | Obrigatórios. `description` é uma frase e aparece no `index.md` |
| `status` | Obrigatório: `draft` (rascunho, gerado pelo agente ou ainda não conferido: é hipótese, e o agente confere no código antes de usar), `stable` (uma pessoa leu o documento, conferiu as citações no código e mudou o status; a mudança entrou por um pull request aprovado) ou `deprecated` (histórico). Só uma pessoa muda o status para `stable`; o agente nunca o escreve |
| `sources` | Obrigatório em Feature, Regra de Negócio, Decisão, Pesquisa, Arquitetura e Visão: lista de entradas, cada uma com `id` e `resource` (caminho do código, link do ticket ou do documento) |
| `stale_after` | Obrigatório em Runbook: instante em ISO 8601 com fuso (`2027-05-01T00:00:00Z`) a partir do qual o conteúdo precisa ser conferido de novo |

## A pasta

```text
docs/
  index.md            sem frontmatter (só aqui pode haver okf_version); uma linha por documento
  log.md              o que mudou, por data, a mais recente primeiro
  regras/
    index.md
    chamado-sem-artigo.md
  processos/
  decisoes/
  specs/              registros datados: type Spec, deprecated depois de construída
  planos/             registros datados: type Plano
```

Uma linha do `index.md` e uma entrada do `log.md`:

```markdown
* [Chamado sem artigo na base vai para um analista](chamado-sem-artigo.md) - O agente de triagem só responde um chamado de atendimento quando um artigo da base cobre o pedido.

## 2026-11-11
* **Update**: Regra de resposta revisada por uma pessoa.
```

O `VISION.md` e o `ARCHITECTURE.md` ficam na raiz do repositório, onde o agente os procura, e o `docs/index.md` aponta para eles. O script do modelo 15 confere o resto no push.

As instruções para o agente (`CLAUDE.md`, regras por tema, skills) ficam fora desta pasta: elas dizem como trabalhar, e a base diz o que é verdade. O `CLAUDE.md` aponta para o `docs/index.md`.

O leancosts tem tipos de documento, um índice por pasta verificado a cada push e um changelog, que correspondem a `type`, `index.md` e `log.md`. O campo de validade (`stale_after`) é o que a proposta acrescenta.
