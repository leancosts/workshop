# Modelo: intenção

A intenção é o documento de sete seções do Product Owner: diz o quê e por quê, nunca como. No caso, ela fica no corpo do épico, a issue que agrupa as issues dessa intenção; na empresa, o PO a entrega como PRD. Um agente de triagem confere antes do arquiteto começar: seção vazia, palavra vaga onde cabe um número, ou solução escrita como objetivo voltam ao PO como pergunta. A instrução desse agente está no modelo 01a.

```markdown
## Objetivo
<O resultado para o cliente, em 1 a 3 frases.>

## Quem ganha
<A persona.>

## Problema hoje
<O fato observado: um número, uma tela, um relato. Sem solução.>

## Como medimos
<O sinal que mostra que deu certo, onde ele é lido, quem o lê e em que data.>

## Fora de escopo
<O que este épico não faz.>

## Restrições
<Prazo, custo, compliance, ou "nenhuma".>

## Pronto quando
<O critério que fecha o épico.>
```

Proposta para a empresa: o épico fecha quando o sinal de "Como medimos" é lido na data marcada. O merge da última issue mostra que a mudança está em produção; o sinal mostra se ela resolveu o problema.

## O PRD é a intenção

O PRD que o PO produz no Claude Desktop (capítulo 6) usa estas mesmas sete seções e nenhuma outra. Vão como anexos, fora das seções:

- o mockup, exportado em HTML, como referência visual que o arquiteto pode não seguir;
- as perguntas técnicas que surgiram no `/grill-me`, em lista, para o arquiteto;
- as fontes da base de conhecimento canônica usadas na validação.
