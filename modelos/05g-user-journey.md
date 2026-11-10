# Modelo: jornada do usuário

O caminho de uma pessoa por uma ou mais features, do gatilho ao resultado. O documento de feature diz o que cada parte faz; a jornada diz em que ordem a pessoa as encontra. O agente a lê antes de mudar uma tela. Fica em `docs/journeys/`, no formato da base (modelo 05d), e muda no mesmo commit que a tela.

```markdown
---
type: Jornada
title: <Nome da jornada>
description: <O que a pessoa consegue ao final, em uma frase.>
status: draft
sources:
  - { id: feature, resource: docs/features/<feature>.md }
---

# <Nome da jornada>

**Quem:** <a persona>. **Quando:** <o gatilho>.

## Passos
1. <O que a pessoa faz> e <o que o sistema mostra>.
2. <...>
3. <O resultado que a pessoa queria.>

## Quando algo falha
- <O erro>: <o que a pessoa vê e como segue>.

## Features envolvidas
- [<Feature>](../features/<feature>.md)
```
