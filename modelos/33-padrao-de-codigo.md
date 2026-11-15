# Modelo: padrão de escrita de código

Como o time escreve código neste repositório: camadas, nomes, erros e acesso a dados. No legado, o agente o extrai dos arquivos mais alterados e de módulos recentes (modelo 23, passo 2), e o time decide o que vale. Fica em `docs/padroes/escrita-de-codigo.md`, no formato da base (modelo 05d); um repositório com mais de uma linguagem tem um documento por linguagem. O `CLAUDE.md` manda lê-lo antes de escrever código novo. Proposta do workshop.

```markdown
---
type: Guia
title: Padrão de escrita de código
description: <As regras de camada, nome e erro deste repositório, em uma frase.>
status: draft
sources:
  - { id: referencia, resource: <arquivo que serve de modelo> }
generated: { by: claude-code/<modelo>, at: <AAAA-MM-DDThh:mm:ssZ> }
---

# Padrão de escrita de código

## Camadas
<As camadas, o que cada uma faz e quem pode chamar quem. Onde entra uma regra
de negócio nova.>

## Nomes
<Arquivos, classes, funções, variáveis, testes. O idioma do código e dos
comentários.>

## Erros e log
<Como um erro é criado, propagado e mostrado ao usuário. O que é logado e o
que nunca é: segredo, dado pessoal.>

## Entrada e acesso a dados
<Onde a entrada é validada. Como o código fala com o banco e com outros
sistemas. O que nunca fazer: SQL montado por concatenação, chamada externa
dentro de transação.>

## Arquivos de referência
- <Um arquivo por camada que mostra o padrão aplicado.>

## Faça e não faça
- <Um exemplo correto, com o arquivo e a função.>
- <Um contraexemplo do próprio repositório, se houver.>

## Onde cada regra é verificada
<Formatador, lint, teste, revisão do diff, ou "ainda não é verificada".>

## Decisões para o time
1. <As variantes encontradas, a contagem e a pergunta.>
```

Quando uma regra passa a ser verificada por uma ferramenta, o portão fica no lugar do texto, e o documento guarda só o motivo (capítulo 5).
