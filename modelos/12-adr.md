# Modelo: decisão registrada (ADR)

Toda decisão que uma mudança futura poderia desfazer vira uma ADR: uma exceção a um princípio, uma fronteira de arquitetura, um desvio do que a intenção pedia. Uma ADR aceita nunca é editada para dizer outra coisa: uma nova a substitui, e a antiga passa a apontar para ela. Quando um agente toma uma decisão que amarra trabalho futuro, ele a escreve com `Status: proposta`, e a pessoa responsável a aceita.

```markdown
---
type: Decisão
title: <A decisão, numa frase>
description: <O que foi decidido e onde vale.>
status: stable
sources:
  - { id: issue, resource: <link da issue ou da spec> }
generated: { by: claude-code/<modelo>, at: <AAAA-MM-DDThh:mm:ssZ> }
verified:
  - { by: human:<id>, at: <AAAA-MM-DDThh:mm:ssZ> }
---

Data: <AAAA-MM-DD> · Status: <proposta | aceita | substituída por [...](...)>
Vale para: <arquivos ou áreas>
Reverte: <ADR anterior, se houver>

## Contexto
<O problema e as forças em jogo.>

## Decisão
<O que foi escolhido.>

## Consequências
<O que fica mais fácil, o que fica mais difícil, o que precisa ser feito.>

## Alternativas rejeitadas
<Cada uma com o motivo.>

## Quando revisitar
<O fato que faria a decisão mudar.>
```

O `status` do frontmatter segue o OKF (`stable` enquanto vale, `deprecated` quando foi substituída); o status da linha "Status" segue o ciclo da decisão.
