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

## Brownfield: a base do legado, passo a passo

Os passos são os do dia 3 (capítulo 11). Cada documento usa o anterior; `<kit>` é a pasta onde o repositório `leancosts/workshop` foi clonado. O `VISION.md`, o `ARCHITECTURE.md` e o `DESIGN.md` levam o frontmatter do padrão; o `CLAUDE.md` e o `README.md` não.

**Passo 2, o kit.** O prompt de instalação está em `<kit>/brownfield/README.md`: o agente copia a estrutura de `docs/`, o script de checagem e as skills, sem alterar nenhum arquivo que já existe, e faz um commit só com o kit.

**Passo 3, o inventário.** Sem interpretar e sem alterar.

```text
Faça o inventário deste repositório. Não altere nenhum arquivo do
sistema e não interprete: liste. Stack e versões (dos manifestos);
entradas (main, rotas, jobs, filas, telas); módulos; banco (tabelas,
migrações, procedures, triggers); comandos de instalar, build, testes
e lint (rode cada um e anote o resultado e o tempo); testes (onde
estão, quantos, o que não cobrem); documentação existente, com a data.
Cite arquivo e linha. Marque como hipótese o que você deduziu sem ler.
Escreva em docs/inventario.md (type: Pesquisa, status: draft, sources
com os manifestos), liste-o em docs/index.md e feche com uma seção
"Perguntas abertas".
```

**Passo 4, `ARCHITECTURE.md` e `README.md`.**

```text
Com base em docs/inventario.md, escreva o ARCHITECTURE.md no formato
de <kit>/modelos/05b-architecture-md.md (type: Arquitetura): stack
com versões, mapa de pastas com o ponto de entrada de cada uma e, em
"Regras transversais", só o que você leu no código ou num teste.
Atualize o README.md: o que o sistema faz, pré-requisitos, instalar,
rodar e testar (só comandos que passaram), variáveis de ambiente (só
os nomes) e onde está a base. Mostre, antes de apagar, cada trecho
antigo que o inventário contradiz.
```

A prova, numa sessão nova: "Usando só o README.md e o ARCHITECTURE.md, instale e rode os testes; diga em que arquivo eu mexeria para mudar `<regra>`; diga o que os dois arquivos não dizem e você precisou procurar no código."

**Passo 5, `VISION.md` e `DESIGN.md`.**

```text
/grill-me
Leia o README.md, o ARCHITECTURE.md e docs/inventario.md. Proponha um
rascunho do VISION.md no formato de <kit>/modelos/05a-vision-md.md
(type: Visão) e me entreviste até fechar cada seção. Para cada
princípio, pergunte o que ele impede e onde é verificado. Não escreva
princípio que eu não confirmei.
```

```text
Extraia o sistema visual que este repositório já usa e escreva o
DESIGN.md no formato de <kit>/modelos/05f-design-md.md (type: Design):
os tokens que existem, com valor e arquivo, e os componentes que se
repetem. Não proponha um design novo. Onde houver dois valores para o
mesmo papel, liste os dois em "Inconsistências" e não escolha.
```

**Passo 6, os padrões.** Um prompt por documento, nos modelos 32, 33 e 34.

```text
Leia <o esquema e as migrações | os dez arquivos mais alterados no
último ano e três módulos recentes | os testes que existem> e descubra
o padrão que o time já segue. Escreva docs/padroes/<nome>.md no
formato de <kit>/modelos/<32, 33 ou 34>. Para cada tema, diga o que a
maioria do código faz, com três exemplos e o arquivo de cada um. Onde
houver mais de um padrão, não escolha: liste as variantes em
"Decisões para o time", com a contagem. Não altere o sistema.
```

**Passo 7, ADRs e PRDs retroativos.**

```text
Procure decisões já tomadas neste repositório (mensagens de commit
dos últimos 24 meses, README antigo, comentários que explicam um
porquê, as "Decisões para o time" já respondidas) e escreva um
candidato a ADR para cada uma em docs/adrs/NNNN-nome.md, no modelo
12, com Status: proposta e a origem em sources. Onde o motivo não
está escrito, deixe a pergunta e o nome de quem pode responder.
No máximo oito.
```

```text
Para a área <nome>, liste as capacidades que o sistema já oferece (no
máximo cinco) e escreva um PRD retroativo para cada uma em
docs/prds/NNN-nome.md, no modelo 31 (type: PRD). Descreva o que o
sistema faz hoje, com arquivo e linha em sources. "Objetivo" e "Como
medimos" são do PO: me entreviste. Um comportamento que parece
defeito vai para "Anexos", como pergunta.
```

**Passo 8, o `CLAUDE.md` e a checagem.**

```text
Escreva o CLAUDE.md no formato de <kit>/modelos/05-claude-md-
inicial.md, em no máximo 60 linhas: "Como rodar" (só os comandos do
inventário que passaram); "Onde procurar" (uma linha por arquivo da
base, dizendo quando ler); "Como trabalhamos" (teste antes; tabela
nova segue docs/padroes/modelagem-de-banco.md; código novo segue
docs/padroes/escrita-de-codigo.md; documento em draft é hipótese; a
base muda no mesmo commit que o código); "Nunca". Aponte para os
documentos, não copie. Depois rode node scripts/check-docs.mjs e
corrija o que falhar. Nunca escreva verified com human:.
```

**Passo 9, a revisão.** Numa sessão nova, com outro modelo (`claude --model opus`):

```text
Você é o revisor adversarial da base de conhecimento deste
repositório. Leia CLAUDE.md, README.md, VISION.md, ARCHITECTURE.md e
tudo em docs/. Para cada afirmação sobre o sistema, abra o arquivo
citado e confira. Procure: afirmação sem fonte; fonte que não diz o
que o texto diz; comando que não roda; padrão que o código contradiz;
dois documentos que discordam; decisão do time escrita como fato.
Bloqueie quando tiver dúvida. Cada ponto cita o documento, a linha e
o arquivo do código. Responda: APROVADO, ou a lista do que bloqueia.
```

## Brownfield: a mudança do backlog

Os passos são os do dia 4 (capítulo 11): 10, classificar; 11, o PRD ou a issue; 12, os testes do que existe; 13 e 14, a mudança no OpenSpec; 15, a revisão e a base.

```text
Leia o CLAUDE.md, o ARCHITECTURE.md e este item do backlog: <item>.
Classifique (feature nova, melhoria ou correção), diga os arquivos e
as tabelas que a mudança toca, os padrões e as ADRs que se aplicam, o
que existe de teste na área e o que pede mais cuidado. Estime se cabe
em cerca de uma hora de trabalho com agentes; se não, proponha a menor
fatia com um critério de aceite. Não comece a mudança.
```

```text
/grill-me
Vamos escrever docs/prds/NNN-nome.md para este item do backlog:
<item>, no modelo 31. Antes de perguntar, leia o VISION.md, os PRDs
da mesma área e o código que a feature toca. Escreva "Problema hoje"
com o que o sistema faz hoje, citando arquivo e linha. Depois me
entreviste, com a sua recomendação em cada pergunta. Se a feature
conflita com um princípio ou com uma ADR, pare e me mostre o conflito.
```

```text
Escreva a issue desta melhoria no modelo 02, a partir do código:
<item>. Quem ganha; o problema hoje, com arquivo e linha; o impacto;
o critério de aceite, verificável por um teste; referências (o PRD da
capacidade e os padrões que se aplicam). Não proponha a solução.
```

```text
/diagnosing-bugs
O defeito: <relato, com o esperado e o que aconteceu>. Reproduza antes
de explicar: escreva um teste que falha pelo motivo do relato e me
mostre a falha. Só então diga a causa raiz, com arquivo e linha.
Escreva a issue no modelo 02. Não corrija ainda.
```

```text
Antes de qualquer mudança, escreva testes de caracterização para
<área>, seguindo docs/padroes/testes.md: os três comportamentos mais
importantes, como o código faz HOJE. Todos passam sem tocar no
sistema. Altere uma linha de propósito, mostre que um teste falha e
desfaça.
```

```text
/opsx:new <nome>
Parta de docs/prds/NNN-nome.md (ou da issue). Escreva só a proposal:
por que, o que muda, o que fica fora, os arquivos e as tabelas que a
mudança toca e os testes que já protegem a área. Pare: o PO valida.

/opsx:continue
No design.md, abra com "Padrões seguidos": para cada decisão, o
documento de docs/padroes/ ou a ADR que a sustenta. Fuga de um padrão
pede uma ADR com Status: proposta. No tasks.md, cada task de código
começa por um teste que falha, e a última atualiza a base.

/opsx:apply
Uma task por vez. Mostre a falha do teste novo antes do código. Depois
de cada task, rode os testes de caracterização: se um falhar, pare.
Um commit por task. No fim, /opsx:verify.
```

A revisão do diff, numa sessão nova com outro modelo, ou com a skill `/code-review`:

```text
Você é o revisor adversarial desta mudança. Leia o CLAUDE.md,
docs/padroes/, a proposal e as specs de openspec/changes/<nome>/ e o
diff desta branch contra a branch principal. Procure: tabela, coluna
ou migração fora do padrão de banco; código fora do padrão de código;
cenário sem teste; teste que passa sem a mudança; teste de
caracterização alterado sem motivo; comportamento fora da proposal;
base não atualizada. Rode os testes tocados. Cada ponto cita arquivo,
linha e o padrão violado. Responda: APROVADO, ou a lista do que
bloqueia.
```

```text
A mudança <nome> está verificada. Atualize a base no mesmo pull
request: o PRD; o ARCHITECTURE.md e o README.md, se ficaram
desatualizados; o padrão, se a mudança criou um caso novo (proponha e
pare); uma ADR para cada decisão fora da spec; uma regra no CLAUDE.md
para o erro que eu corrigi mais de uma vez; docs/log.md e os índices.
```

```text
Abra um pull request em rascunho contra a branch de desenvolvimento,
com a descrição no modelo 14: o pedido; a mudança e o que ficou fora;
a evidência (o teste novo antes e depois, os testes de
caracterização); o veredito do revisor; a base, uma linha por
documento alterado; as decisões fora da spec; o que não ficou pronto.
Não escreva nada que você não possa mostrar num arquivo ou numa saída
de comando.
```

## Conferir antes de usar

| Conferência | Quem |
|---|---|
| Os comandos do `CLAUDE.md` rodam numa sessão nova | O agente, numa sessão limpa |
| Uma sessão nova acha o arquivo de uma regra só com os documentos | O agente, numa sessão limpa (dia 3) |
| Cada afirmação bate com o código citado | Outro modelo (modelo 10), depois uma pessoa do time |
| Regras que valem para mais de um sistema | Sobem para a base corporativa por pull request (capítulo 5) |
