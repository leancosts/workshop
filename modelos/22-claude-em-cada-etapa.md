# Modelo: o Claude em cada etapa

Um prompt por etapa, para que o uso do agente não dependa de quem está no teclado. A estrutura é sempre a mesma: o que a pessoa quer, o que já decidiu, onde o agente procura os fatos e o que ele entrega. O agente busca os fatos com a fonte; a pessoa decide. Troque o que está entre `< >`. Proposta do workshop.

## Entrada e triagem

Roda sozinho, na pipeline (modelo 24). Para conferir um item à mão:

```text
Leia o item <link>. Classifique em dúvida, bug, melhoria ou
projeto, com a regra do modelo 24. Procure duplicatas abertas.
Cite cada fato com o arquivo e a linha, ou o documento da base.
Não proponha solução. Se não achar fonte, diga "sem fonte".
```

Evite: ler a demanda, analisar à mão e colar a conclusão numa sessão.

## 1. Intenção (o PRD)

No Claude Desktop do PO, com as skills `grill-me` e `grilling` e a skill do design system:

```text
/grill-me Quero transformar a demanda <link> num PRD.
Pergunte só as decisões de produto; liste as técnicas para o
arquiteto. Antes de cada pergunta, procure a resposta na base
de conhecimento e diga onde achou.
```

Depois da entrevista:

```text
Escreva a intenção nas sete seções do modelo 01, sem solução
no objetivo. Gere um mockup da tela com os componentes do
design system. Liste as perguntas que eu não soube responder.
```

Evite: "escreva um PRD para isso" sem entrevista.

## 2. Spec e plano

No Claude Code do arquiteto, numa sessão limpa:

```text
Escreva a spec da issue <#n> no modelo 03, derivada do PRD
<link>. Leia o código e a base antes; cite cada afirmação.
Pese duas opções, escolha uma e diga o que fica fora.
Não escreva código.
```

```text
Escreva o plano no modelo 04: os arquivos, o teste que falha
em cada passo, os critérios de aceite e a ordem.
```

Depois, a revisão por outro modelo com a instrução do modelo 10, numa sessão nova, recebendo só as fontes.

Evite: o mesmo modelo escrever e revisar; ir direto ao código numa mudança com gatilho de spec.

## 3. Construção

```text
/goal A issue <#n> está fechada por um commit na branch <nome>,
com o teste novo que falhou antes e passa depois, os testes
tocados verdes e o documento vivo atualizado no mesmo commit.
Trabalhe num worktree. Teste primeiro. Rode /simplify antes de
concluir.
```

Evite: uma sessão longa com três features; uma terceira correção no lugar de `/clear` e um prompt melhor.

## 4. Portões

Os hooks, o lint, o gitleaks e os testes rodam sozinhos (capítulo 9). O que se pede ao agente é a revisão do diff, por outro modelo:

```text
Revise o diff de <branch> contra a issue <#n> e o plano <link>
com a instrução do modelo 10. Rode os testes tocados. Bloqueie
na dúvida, citando arquivo, linha e a falha concreta.
```

Evite: "confira o que você fez" para o mesmo agente que construiu.

## 5. OK e verificação

```text
Escreva a descrição do PR no modelo 14: a issue, o teste que
falhou e passou, o veredito do revisor, as decisões fora da
spec e o que só produção prova.
```

Depois do deploy, só leitura:

```text
Confira em produção o critério <x> da issue <#n>: leia
<logs, traces, réplica>. Confirme em duas fontes. Comente a
evidência na issue. Não mude nada.
```

## Opções e insights, em qualquer etapa

Para uma decisão (de produto, de arquitetura, de processo ou de ferramenta):

```text
Preciso decidir <a decisão>. O objetivo é <x>; já decidimos <y>;
a restrição é <z>. Traga três opções, inclusive uma que a empresa
ainda não usa. Para cada uma: como funciona, prós, contras, custo
de adotar, risco e o que a derrubaria. Cite a fonte de cada fato.
Depois, e separada da análise, a sua recomendação.
```

Para um insight a partir de dados:

```text
Leia <as últimas 100 demandas | os incidentes do trimestre | as
datas de cada etapa das últimas features>. Que padrões aparecem?
Para cada um: a evidência (quantos casos, quais), a causa provável
e uma ação que mudaria o número. Diga o que os dados não permitem
concluir.
```

Antes de aprovar um plano:

```text
Imagine que este plano falhou daqui a três meses. Liste as cinco
causas mais prováveis, com o sinal que apareceria primeiro, e o
que mudar no plano agora para cada uma.
```

Evite: pedir só a execução quando a decisão ainda não foi tomada; aceitar a recomendação sem ler as outras opções.

## Operação

Numa tarefa agendada ou numa pipeline (modelo 18):

```text
Leia os erros novos das últimas 24 horas em <fonte>. Para cada
um: novo, recorrente ou resolvido. Abra issue no padrão só para
o novo, com a evidência. Não corrija nada.
```
