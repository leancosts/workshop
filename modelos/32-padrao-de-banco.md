# Modelo: padrão de modelagem de banco

Como o time nomeia, tipa e migra tabelas. Sem este documento, o agente modela no estilo mais comum que conhece, e cada sessão cria uma variante. No legado, o agente o extrai do esquema e das migrações (modelo 23, passo 6), e o time decide o que vale. Fica em `docs/padroes/modelagem-de-banco.md`, no formato da base (modelo 05d), e o `CLAUDE.md` manda lê-lo antes de criar ou alterar tabela, coluna ou migração. Proposta do workshop.

```markdown
---
type: Guia
title: Padrão de modelagem de banco
description: <Como nomear, tipar e migrar tabelas neste repositório, em uma frase.>
status: draft
sources:
  - { id: esquema, resource: <pasta das migrações ou do esquema> }
generated: { by: claude-code/<modelo>, at: <AAAA-MM-DDThh:mm:ssZ> }
---

# Padrão de modelagem de banco

## Nomes
<Tabelas (singular ou plural, caixa), colunas, chaves estrangeiras, índices e
restrições. Para cada regra: quantas tabelas a seguem e três exemplos.>

## Chaves
<Tipo da chave primária, como a chave estrangeira é declarada, o que acontece
na exclusão do pai.>

## Tipos
<Dinheiro, data e hora (fuso), texto, booleano, enumeração, JSON. O tipo a usar
e o que nunca usar.>

## Colunas de toda tabela
<Criação, alteração, autor, exclusão lógica, versão: quais são obrigatórias.>

## Migrações
<Onde ficam, como se chamam, como são aplicadas e revertidas. O que uma
migração nunca faz: editar uma já aplicada, apagar dado sem cópia.>

## O que fica no banco e o que fica na aplicação
<Validação, cálculo, procedure, trigger: onde cada regra mora, e por quê.>

## Arquivos de referência
- <Uma migração e uma tabela que servem de exemplo.>

## Onde é verificada
<Um lint de SQL, um teste do esquema, a revisão do diff, ou "ainda não é verificada".>

## Decisões para o time
1. <Onde o código tem mais de um padrão: as variantes, a contagem de cada uma
   e a pergunta. A resposta do time substitui o item e, se amarra trabalho
   futuro, vira uma ADR.>
```

Uma tabela antiga fora do padrão não é renomeada por causa deste documento: ela entra numa lista de exceções, que só diminui.
