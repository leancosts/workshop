# Modelo: guideline

Um padrão de como o time faz algo que o código sozinho não ensina: mensagens de erro, nomes, acessibilidade, tratamento de dados. Fica em `docs/guidelines/`, no formato da base (modelo 05d). Quando uma guideline puder ser verificada por uma ferramenta, o portão fica no lugar do texto, e o documento guarda só o motivo.

```markdown
---
type: Guia
title: <O tema, por exemplo: mensagens de erro>
description: <A regra, em uma frase.>
status: draft
sources:
  - { id: decisao, resource: docs/decisions/<adr>.md }
---

# <O tema>

## A regra
<O que fazer, em poucas linhas.>

## Por quê
<O erro ou a decisão que a criou.>

## Faça
- <Um exemplo correto.>

## Não faça
- <Um exemplo errado.>

## Onde é verificada
<Um teste, um portão, uma revisão, ou "ainda não é verificada".>
```
