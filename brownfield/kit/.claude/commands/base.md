---
description: Gera a base de conhecimento deste repositório legado, de uma vez
argument-hint: <a área ou a pasta que o time vai mudar>
---

Gere a base de conhecimento deste repositório, do começo ao fim, sem parar para perguntar.
A área que o time vai mudar: $ARGUMENTS

## Regras para todos os documentos

- Só leitura no sistema: não altere código, esquema nem configuração. Você só cria e edita os documentos abaixo, e cada commit leva só esses documentos (nunca um arquivo que um comando de instalação ou de build tenha alterado).
- Toda afirmação cita arquivo e linha, ou o comando que você rodou. O que você deduziu sem ler leva a palavra "hipótese".
- O que o código não responde vira uma pergunta numerada na seção "Decisões para o time", no fim do documento. Nunca escreva um palpite como fato, e nunca escolha entre duas variantes: conte quantas vezes cada uma aparece.
- Arquivo que já existe: não apague o conteúdo. Acrescente o que falta e liste o que mudou.
- Todo documento, menos o CLAUDE.md e o README.md, começa com o frontmatter de ../workshop-kit/modelos/05d-documento-okf.md: `status: draft`, `sources` com os arquivos lidos, `generated` com a data de hoje e o seu modelo, e nenhum `verified`. Só uma pessoa escreve `verified`.
- O repositório inteiro é lido por alto. A área do time é lida em detalhe.
- Os formatos estão em ../workshop-kit/modelos/.

## Primeiro, o que o time revisa hoje (um commit por item)

1. `docs/inventario.md` (type: Pesquisa): a stack e as versões, lidas dos manifestos; as entradas (rotas, jobs, filas, telas); os módulos; as features da área do time, numa tabela (a feature, por onde entra, os arquivos, objetos e tabelas que a implementam, os testes que a cobrem), e as do resto do sistema só pelo nome, como hipótese; o banco (tabelas, migrações, procedures, triggers); os comandos de instalar, build, testes e lint, cada um rodado, com o resultado; os testes que existem e o que não cobrem; a documentação antiga, com a data.
2. `ARCHITECTURE.md` (modelo 05b, type: Arquitetura) e `README.md` (o que o sistema faz, instalar, rodar e testar, só com comandos que passaram).
3. `docs/padroes/modelagem-de-banco.md` (modelo 32): para cada tema, o que a maioria das tabelas faz, com três exemplos, o arquivo de cada um e a contagem.
4. `docs/padroes/escrita-de-codigo.md` (modelo 33): camadas, nomes, tratamento de erro, log e acesso ao banco, com um arquivo de referência por camada. Feche com a seção "Testes" (modelo 34): o comando que roda tudo, o que roda um arquivo só, onde os testes ficam e quais pastas não têm teste.
5. `CLAUDE.md` (modelo 05), em no máximo 60 linhas: os comandos que passaram; uma linha por arquivo da base, dizendo quando ler; "toda tabela nova segue docs/padroes/modelagem-de-banco.md"; "todo código novo segue docs/padroes/escrita-de-codigo.md"; "um documento com status: draft é hipótese: confira no código"; "a base muda no mesmo commit que o código".
6. Atualize `docs/index.md` e os índices das pastas, acrescente uma linha em `docs/log.md` e rode `node scripts/check-docs.mjs` até passar. Faça o commit e escreva: "A base mínima está pronta."

## Depois, o que fica em rascunho

7. `VISION.md` (modelo 05a, type: Visão): só o que o código e a documentação antiga sustentam. Cada princípio entra como pergunta para o PO. `DESIGN.md` (modelo 05f, type: Design), só se o sistema tem telas.
8. `docs/adrs/` (modelo 12): no máximo cinco decisões que o histórico sustenta (mensagens de commit, README antigo, comentários), com Status: proposta e a origem em `sources`. `docs/prds/` (modelo 31, type: PRD): um PRD do que a área do time faz hoje.
9. Acrescente ao `CLAUDE.md` uma linha para cada documento novo, atualize os índices e rode a checagem de novo.

## A resposta final

1. Os arquivos criados, uma linha cada.
2. As "Decisões para o time" do ARCHITECTURE.md e dos dois padrões, numeradas, com a sua recomendação em cada uma.
3. O que você não conseguiu ler ou rodar, e por quê.
