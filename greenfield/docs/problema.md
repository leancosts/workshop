---
type: Problema
title: "Triagem: assistente de atendimento de chamados"
description: O problema de negócio do greenfield. Cenário fictício.
status: stable
---

# Triagem: assistente de atendimento de chamados

## O problema de negócio

**Cenário (fictício).** Uma área de TI interna atende cerca de 800 colaboradores. Todo pedido entra numa fila única: dúvidas operacionais, bugs, pedidos de ajuste e ideias de sistemas novos. Três analistas fazem a triagem manualmente.

**A dor.** Boa parte dos chamados repete perguntas que já têm resposta documentada, como redefinir senha, configurar VPN ou pedir acesso a um sistema. Mesmo assim, cada um espera na fila até um analista ler. Chamados mal categorizados chegam ao time errado e voltam. O solicitante fica sem saber se alguém viu o pedido.

**A visão.** Um agente faz a primeira leitura de todo chamado. Ele entende o que o usuário pede, classifica o chamado e resolve na hora o que a base de conhecimento já cobre. Os casos que dependem de uma pessoa chegam aos analistas já organizados, e o usuário sempre recebe um retorno imediato e honesto.

## Atores

- **Solicitante:** abre o chamado e recebe o retorno.
- **Agente de triagem:** classifica, responde quando pode e encaminha quando não pode.
- **Analista:** assume os chamados encaminhados e os encerra.
- **Base de conhecimento:** artigos curtos com respostas validadas pela equipe, em `docs/base-de-conhecimento/`.

## Categorias

| Categoria | Definição | Exemplo |
|---|---|---|
| Atendimento | Dúvida ou pedido operacional, sem mudança em sistema | "Como redefino minha senha?" |
| Correção | Algo que funcionava e deixou de funcionar | "O relatório de vendas dá erro desde ontem" |
| Melhoria | Mudança de escopo pequeno em algo que já existe | "Incluir filtro por data na tela de pedidos" |
| Projeto | Algo novo, que exige priorização e orçamento | "Precisamos de um app para os vendedores externos" |

## Fluxo principal

1. O usuário abre um chamado com um texto livre.
2. O agente classifica o chamado e justifica a classificação.
3. Se for atendimento e a base tiver a resposta, o agente responde ao usuário, registra a resposta no chamado e fecha o chamado.
4. Se não conseguir responder, o agente mantém o chamado aberto e avisa o usuário de que uma pessoa vai assumir.

## Indicadores de sucesso

- Taxa de autoatendimento: chamados fechados pelo agente sem intervenção humana.
- Acurácia da classificação.
- Tempo até o primeiro retorno ao usuário.
- Taxa de respostas automáticas erradas, ou seja, chamados reabertos.

**Fora de escopo:** canais reais (e-mail, Slack, WhatsApp), autenticação, SLA e integração com ferramentas de mercado como Jira e ServiceNow.

## Decisões em aberto, de propósito

Estas lacunas ficam sem resposta. É nelas que o time sente o esforço de decidir e alinhar antes de gerar código.

- **Correção, melhoria e projeto:** o enunciado só diz o que fazer com atendimento. Esses chamados vão todos para humanos? Para filas diferentes?
- **"Conseguir responder":** quando o agente pode dizer que sabe a resposta? Como ele decide que não sabe? Qual o limiar de confiança e quem define esse limiar?
- **Chamado ambíguo ou com dois pedidos:** um texto como "O sistema caiu e aproveitando, queria um filtro novo" cabe em qual categoria?
- **Resposta errada:** se o usuário disser que a resposta não resolveu, o chamado reabre?
- **Rastreabilidade:** como saber depois qual artigo da base sustentou cada resposta?

## Features

Cada feature cabe numa spec curta e pode ser implementada sem infraestrutura real.

### Núcleo (caminho crítico)

| # | Feature | Critério de aceite essencial |
|---|---|---|
| F1 | Abrir e registrar chamado | O chamado tem id, solicitante, descrição, status e histórico de eventos |
| F2 | Classificar chamado | Atribui uma das 4 categorias, com justificativa registrada no histórico |
| F3 | Responder pela base de conhecimento | Para atendimento coberto pela base: responde, registra a resposta e o artigo usado, e fecha o chamado |
| F4 | Encaminhar para humano | Quando não há resposta: mantém o chamado aberto, muda o status para "aguardando analista" e envia mensagem ao usuário |

### Complementares (para times mais rápidos ou para paralelizar)

| # | Feature | Critério de aceite essencial |
|---|---|---|
| F5 | Fila do analista | Lista os chamados abertos por categoria; o analista registra a resposta e fecha |
| F6 | Feedback do solicitante | O usuário indica se a resposta resolveu; se não resolveu, o chamado reabre e vai para humano |
| F7 | Painel de indicadores | Mostra taxa de autoatendimento e distribuição por categoria |
| F8 | Alimentar a base | O analista transforma a resposta dada a um chamado em novo artigo da base |

A F8 mostra que o valor do agente cresce com a camada de conhecimento, não com a interface.

## Massa de teste

`docs/massa-de-teste.md`. A resposta esperada de cada chamado vira teste de aceite.
