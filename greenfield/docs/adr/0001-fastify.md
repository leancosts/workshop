---
type: Decisão
title: A API usa Fastify
description: O framework HTTP da API da Triagem é o Fastify, em TypeScript.
status: stable
sources:
  - { id: arquitetura, resource: ARCHITECTURE.md }
generated: { by: claude-code/claude-opus-5-5, at: 2026-11-10T12:00:00Z }
verified: []
---

Data: 2026-11-10 · Status: proposta
Vale para: `apps/api/`

## Contexto
O `ARCHITECTURE.md` deixou o framework HTTP em aberto. A API é pequena, em TypeScript `strict`, e precisa de um jeito simples de testar rotas sem subir porta. Os times têm um dia, então o framework tem de ser conhecido e bem documentado.

## Decisão
Fastify. Os testes usam `app.inject`, que chama a rota sem abrir socket. As rotas ficam em `apps/api/src/app.ts`, e `server.ts` só liga a porta.

## Consequências
- Fica fácil: testes de rota rápidos e sem rede, validação por schema quando o time quiser, logs prontos.
- Fica mais difícil: o ecossistema de plugins é menor que o do Express, e quem vem do Express precisa aprender o ciclo de plugins.
- A web chama a API por `/api`, e o proxy do Vite tira o prefixo antes de a chamada chegar ao Fastify.

## Alternativas rejeitadas
- Express: o mais conhecido, mas sem tipos nativos, sem validação embutida e sem `inject`. O teste de rota pediria uma biblioteca a mais.
- Hono: leve e bem tipado, mas pensado para runtimes de borda. Para uma API Node com Postgres, traz pouco a mais que o Fastify.

## Quando revisitar
Se a API for para um runtime de borda, ou se o time passar a usar uma biblioteca que só tem adaptador para outro framework.
