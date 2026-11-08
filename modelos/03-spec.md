# Modelo: spec

No caso, a issue pede spec quando mexe com dinheiro, migração de banco, isolamento entre clientes (RLS), contrato de API ou mais de uma área. Proposta para a empresa: acrescentar segurança. Uma mudança pequena e certa pula a spec e o plano.

A spec é um registro datado: fica em `docs/specs/`, e depois de construída passa a `status: deprecated`; o documento vivo da feature vira a referência. Ela passa pela revisão adversarial (modelo 10) antes do plano. No laboratório do dia 2, spec e plano passam por uma revisão só.

```markdown
---
type: Spec
title: <Título>
description: <Uma frase com a mudança.>
status: draft
sources:
  - { id: issue, resource: <link da issue> }
generated: { by: claude-code/<modelo>, at: <AAAA-MM-DDThh:mm:ssZ> }
---

# <Título> (spec, <data>)

Issue: <link>

## Problema
<O que a intenção pede, em termos do código atual. Arquivo e linha.>

## Opções consideradas
1. <Opção A>: <como funciona>. Prós: <...>. Contras: <...>.
2. <Opção B>: <...>

## Escolha
<A opção escolhida e por quê.>

## Fora de escopo
<O que esta mudança não faz.>

## Critérios de aceite
- [ ] <Cada um vira um teste.>

## Riscos e o que verificar
<O que pode quebrar e como saberemos.>
```
