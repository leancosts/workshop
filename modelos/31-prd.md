# Modelo: PRD

O PRD é a intenção do modelo 01 num arquivo do repositório: as mesmas sete seções, com frontmatter e anexos. Ele diz o quê e por quê, nunca como. O PO o escreve a partir do `VISION.md`, de preferência no Claude Desktop, e o agente de triagem (modelo 01a) o confere antes do arquiteto começar.

No repositório `greenfield`, o PRD fica em `docs/prd/NNN-nome.md`. Cada mudança do OpenSpec que nasce dele cita o arquivo na proposta; um PRD pode gerar várias mudanças, e nenhuma delas reescreve o PRD. O status vai de `draft` a `stable` quando a triagem passa, e a `deprecated` quando o sinal de "Como medimos" é lido: a partir daí, as specs em `openspec/specs/` são a referência.

```markdown
---
type: PRD
title: <Título>
description: <Uma frase com o resultado para o cliente.>
status: draft
owner: <PO>
sources:
  - { id: visao, resource: VISION.md }
generated: { by: <claude-desktop/modelo ou human:nome>, at: <AAAA-MM-DDThh:mm:ssZ> }
---

# <Título>

## Objetivo
<O resultado para o cliente, em 1 a 3 frases, e o princípio do VISION.md que ele serve.>

## Quem ganha
<A persona, como o VISION.md a nomeia.>

## Problema hoje
<O fato observado: um número, uma tela, um relato. Sem solução.>

## Como medimos
<O sinal que mostra que deu certo, onde ele é lido, quem o lê e em que data.>

## Fora de escopo
<O que este PRD não faz.>

## Restrições
<Prazo, custo, compliance, ou "nenhuma".>

## Pronto quando
<O critério que fecha o PRD. Cada item vira um cenário na spec do OpenSpec.>

## Anexos
- Mockup: <arquivo HTML com os tokens do DESIGN.md; referência visual que o arquiteto pode não seguir.>
- Perguntas técnicas para o arquiteto: <lista.>
- Fontes usadas na validação: <lista.>
- Mudanças do OpenSpec: <`openspec/changes/<nome>`, preenchido quando abertas.>
```

Uma seção vazia, uma palavra vaga onde cabe um número ou uma solução escrita como objetivo voltam ao PO como pergunta. Para abrir a primeira mudança a partir do PRD, no Claude Code: `/opsx:new <nome>` e "parta de `docs/prd/NNN-nome.md`".
