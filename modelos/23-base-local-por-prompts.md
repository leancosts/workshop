# Modelo: base local por prompts

Prompts para montar, em horas, uma base de conhecimento local que baste para os agentes trabalharem num repositório, antes de existir a base corporativa. O resultado é rascunho: cada documento sai com `status: draft` e sem `verified` de pessoa, até alguém do time conferir. Formato dos documentos: modelo 05d. Proposta do workshop.

## Regras para todos os prompts

- Toda afirmação tem a fonte: caminho e linha, comando rodado, ou documento. Sem fonte, a frase vai para "Perguntas abertas".
- O que o agente deduziu e não leu é marcado como hipótese.
- Comandos de build e teste entram no `CLAUDE.md` só depois de rodar e passar.
- Um subagente por módulo, em paralelo, quando os módulos não se cruzam; cada um devolve só o documento.
- Depois, outro modelo revisa com a instrução do modelo 10, e uma pessoa do time confere antes do `verified`.

## Greenfield: do PRD à base

Entrada: o `VISION.md` (modelo 05a) e o PRD da primeira feature.

```text
Leia VISION.md e o PRD <link>. Crie a base local:
1. CLAUDE.md no modelo 05, com os comandos que você rodou e
   passaram, e as regras do modelo 05e que servem a este projeto.
2. ARCHITECTURE.md no modelo 05b: a stack escolhida, o mapa de
   pastas e as regras transversais, cada uma com o porquê.
3. docs/glossario.md com os termos do PRD, um por linha.
4. docs/regras/ com cada regra de negócio do PRD num documento
   (type: Regra de Negócio), citando a seção do PRD.
5. docs/index.md com uma linha por documento.
Frontmatter OKF em cada arquivo de docs/, status: draft.
Liste no fim o que o PRD não diz e uma decisão precisa dizer.
```

## Brownfield: três passadas

Inspiradas nas três camadas de um coletor de conhecimento: o que se lê sem interpretar, o que se infere de texto, o que só um modelo deduz do código.

**Passada 1, o que se lê sem interpretar.**

```text
Faça o inventário deste repositório, sem interpretar:
entradas (main, rotas, jobs), comandos de build e teste
(rode cada um e anote o resultado), pipelines de CI, ADRs e
OpenAPI existentes, esquema do banco e migrações, dependências
externas. Escreva o CLAUDE.md inicial (modelo 05) e um mapa de
uma tela para o ARCHITECTURE.md. Cite caminho e linha.
```

**Passada 2, o que se infere de texto.**

```text
Leia READMEs, wikis exportadas em <pasta> e as mensagens de
commit dos últimos 12 meses. Para cada decisão que aparece
(uma escolha de tecnologia, um "não fazer", uma troca), escreva
um candidato a ADR (modelo 12) em docs/decisoes/, status: draft,
com o commit ou o arquivo de origem em sources.
```

**Passada 3, o que só o código diz.**

```text
Para o módulo <nome>, ache as regras de negócio no código e no
banco (validações, cálculos, procedimentos, gatilhos, constantes
com significado). Escreva um documento por regra em docs/regras/
(type: Regra de Negócio, status: draft), com o arquivo e a linha
em sources e um exemplo de entrada e saída lido de um teste ou
do próprio código. Marque como hipótese o que você não confirmou
num teste. Não corrija nada.
```

Depois das três:

```text
Monte docs/index.md e a seção "Onde procurar" do CLAUDE.md.
Liste os 10 documentos que mais respondem perguntas de quem é
novo no time, e as perguntas que nenhum documento responde.
```

## Conferir antes de usar

| Conferência | Quem |
|---|---|
| Os comandos do `CLAUDE.md` rodam numa sessão nova | O agente, numa sessão limpa |
| Uma pessoa nova acha a entrada do módulo só com o documento | Alguém de fora do time (dia 3) |
| Cada regra bate com o código citado | Outro modelo (modelo 10), depois uma pessoa do time |
| Regras que valem para mais de um sistema | Sobem para a base corporativa por pull request (capítulo 5) |
