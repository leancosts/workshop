# Modelo: padrão de testes

O que o time testa, onde e como, e o que uma mudança precisa provar antes do pull request. No legado, o agente o extrai dos testes que existem e lista as áreas sem teste (modelo 23, passo 6). Fica em `docs/padroes/testes.md`, no formato da base (modelo 05d). Proposta do workshop.

```markdown
---
type: Guia
title: Padrão de testes
description: <Como os testes deste repositório são escritos e rodados, em uma frase.>
status: draft
sources:
  - { id: exemplo, resource: <um teste que serve de modelo> }
generated: { by: claude-code/<modelo>, at: <AAAA-MM-DDThh:mm:ssZ> }
---

# Padrão de testes

## Como rodar
- Tudo: `<comando>` · um arquivo: `<comando>` · tempo da suíte: <medido>

## Onde ficam e como se chamam
<Ao lado do código ou numa pasta; o nome do arquivo e do caso.>

## O que usa o quê
<O que roda contra banco real, o que usa dublê, o que roda no navegador.
Como os dados de teste são criados e apagados.>

## O que uma mudança precisa provar
- O teste novo falha antes da mudança e passa depois.
- Numa área sem teste, o comportamento atual vira teste antes da mudança
  (teste de caracterização).
- <A regra mínima do time: por exemplo, um teste por critério de aceite.>

## Áreas sem teste
- <Pasta, e o que ela faz. A lista só diminui.>

## Testes instáveis
- <Os que falham sem motivo, em quarentena, com a data.>

## Decisões para o time
1. <As variantes encontradas e a pergunta.>
```

O teste de caracterização descreve o que o código faz hoje, certo ou errado. Um comportamento suspeito vira issue; o teste continua dizendo a verdade sobre o código até a issue ser resolvida.
