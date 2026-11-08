---
type: Feature
title: Intenção do núcleo
description: A regra de prontidão de cada tripulante, nas sete seções.
status: draft
sources:
  - { id: proposta, resource: modelos/08-proposta-greenfield.md }
---

## Objetivo
Saber, a qualquer momento, se cada tripulante pode ser escalado, com base na validade dos seus documentos.

## Quem ganha
A coordenação de operações, que monta a escala, e quem responde pela segurança operacional.

## Problema hoje
A validade dos documentos fica numa planilha. Um documento vencido só é percebido perto do voo.

## Como medimos
Os exemplos decididos da tabela de prontidão (modelo 08) passam como testes; o caso de borda ganha teste depois que a spec o decide. A regra existe numa função só, usada por todas as extensões.

## Fora de escopo
Login, interface elaborada, banco de dados externo, integração com os sistemas da operadora, envio real de mensagem, regra regulatória real.

## Restrições
Dados fictícios. Matrícula fictícia no lugar do nome de pessoa. Roda localmente com um comando.

## Pronto quando
O núcleo tem testes que falharam antes e passam depois, e o commit liga a intenção, a spec, o plano e o veredito da revisão.
