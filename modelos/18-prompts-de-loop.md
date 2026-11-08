# Modelo: prompts de loop

O `/loop` do Claude Code repete um prompt enquanto a sessão está aberta. Há três formas:

| Comando | O que acontece |
|---|---|
| `/loop 30m <prompt>` | O prompt roda num intervalo fixo |
| `/loop <prompt>` | O agente escolhe a espera a cada volta, entre 1 minuto e 1 hora, e pode encerrar o loop quando o trabalho acaba |
| `/loop` | Roda o prompt de `.claude/loop.md`, se o arquivo existir; sem ele, um prompt de manutenção que já vem com o Claude Code |

Um loop roda só com o Claude Code aberto, entre um turno e outro, e expira em 7 dias. Para rodar sem a sessão aberta, use uma tarefa agendada no Claude Desktop (com a máquina ligada) ou na nuvem (sem a máquina, com intervalo mínimo de 1 hora).

Os prompts abaixo são proposta do workshop. No caso, o `/deliver` roda o caminho de uma issue e o agente que muda uma etapa move o card no quadro.

## Regras para qualquer loop

- **Um fim que se confere para cada item.** O fim é o mesmo de um `/goal` (modelo 06). A fila da seção 1 trabalha um item por volta; o loop da seção 2, alguns ao mesmo tempo.
- **Reservar antes de trabalhar.** Todas as sessões costumam usar o mesmo login, então o responsável da issue não distingue uma sessão da outra. A sessão comenta na issue `reservada: <id da sessão>`, lê os comentários de novo e só segue se a primeira reserva for a dela. Assim duas sessões não constroem a mesma issue.
- **O agente principal orquestra.** Cada etapa roda num subagente com contexto limpo (uma issue, um contexto limpo), e quem revisa é outro modelo.
- **Quem muda a etapa move o card.** O card muda no mesmo passo da etapa.
- **Pare com motivo.** O loop para quando a fila esvazia ou quando chega ao limite combinado de issues ou de orçamento. Uma issue cujo portão falha duas vezes seguidas fica `blocked`, e o loop segue para a próxima.
- **Nada vai para a branch principal sem o OK de uma pessoa.** O loop para no pull request aberto; o da seção 2 retoma depois do merge para verificar o deploy.
- **Uma skill marcada com `disable-model-invocation: true` não roda num loop agendado**: chega como texto. No caso, o `/deliver` é assim de propósito, porque chamá-lo é o OK do operador para o push.

## 1. A fila do quadro

O agente principal pega a próxima issue disponível, constrói com subagentes e mantém o quadro atualizado. Grave o prompt em `.claude/loop.md` e rode `/loop`: o agente escolhe a espera e encerra quando a fila esvazia. Com um intervalo fixo, `/loop 30m` também usa o `loop.md`. As colunas são exemplo; use as do quadro do time. O quadro pode ser GitHub Projects, Azure Boards ou Jira (capítulo 8).

{{DIAGRAMA:fila}}

```markdown
Você orquestra a fila do quadro <nome do quadro>. Não escreva código nesta
sessão: cada etapa roda num subagente novo.

1. Leia o quadro. Pegue a primeira issue da coluna "Pronto para construir",
   na ordem do quadro, sem reserva nos comentários e sem os rótulos blocked
   ou decision.
   Se não houver nenhuma, diga "fila vazia" em uma linha e encerre o loop.
2. Comente na issue "reservada: <id desta sessão>" e leia os comentários de
   novo. Se a primeira reserva não for a sua, volte ao passo 1. Se for,
   mova o card para "Em andamento".
3. Rode as etapas, cada uma num subagente, e comente cada etapa na issue:
   - spec, quando a issue pede (dinheiro, migração, contrato de API, mais de
     uma área), com revisão adversarial por <modelo revisor>;
   - plano, com revisão adversarial por <modelo revisor>;
   - construção com teste primeiro, num worktree próprio, por <modelo construtor>;
   - simplificação do diff;
   - verificações: testes do que mudou, lint e portões do repositório;
   - revisão do diff por <modelo revisor>.
   Cada revisão tem no máximo duas rodadas; depois você decide e registra o
   motivo na issue.
4. Se um portão falhar duas vezes seguidas, comente na issue o que falhou,
   ponha o rótulo blocked, mova o card de volta para "Pronto para construir"
   e vá para o passo 7.
5. Abra o pull request em rascunho com a descrição do modelo 14 e mova o card
   para "Em revisão". Não faça merge.
6. Cada follow-up vira issue, sub-issue do mesmo épico, na coluna "Pronto
   para construir" na posição certa, ou com blocked, waiting ou decision e
   o motivo.
   Um follow-up que depende deste pull request recebe blocked até o merge.
7. Termine a volta com uma linha: issue, coluna do card, próximo passo.
   Encerre o loop depois de <N> issues nesta sessão ou ao passar de
   <orçamento de tokens ou de custo>.
```

## 2. Um loop contínuo, desenhado como grafo

A fila da seção 1 trabalha uma issue por volta. Este loop mantém algumas issues em curso e, a cada volta, percorre o mesmo grafo: classifica as issues em curso, decide se cabe mais uma, avança cada issue ativa a partir do nó em que ela parou (registrado num comentário da issue) e termina com o status. Os estados são nomes do workshop:

- **ATIVA:** tem trabalho a avançar nesta volta.
- **ESPERANDO:** espera um evento com hora em menos de 12 h: um deploy, o CI, uma medição do dia ou o OK do merge combinado para o dia.
- **ESTACIONADA:** espera um evento a mais de 12 h, ou uma pessoa sem hora combinada.

Só ATIVA e ESPERANDO contam no limite. O desenho mostra os retornos entre nós: um achado corrigido retorna à revisão ([G] para [E]), e um portão que recusa por defeito real retorna à construção ([H] para [D]). Toda volta termina em [J], inclusive a que não tinha nada a fazer.

Os números (2 ativas, 5 em curso, 12 h, 2 rodadas de revisão, 3 de auditoria) são ponto de partida; o time os ajusta à máquina e ao orçamento. Grave o grafo e as regras dos nós em `.claude/loop.md` e rode `/loop 30m`. Uma tarefa agendada roda sem a sessão aberta; na nuvem, o intervalo mínimo é de 1 hora.

```text
              volta: /loop 30m ou tarefa agendada
                              v
          +-------------------------------------+
          | [A] CLASSIFICAR cada issue em curso |
          +--+--------------+----------------+--+
             v              v                v
           ATIVA        ESPERANDO       ESTACIONADA
      (há o que fazer) (evento < 12 h) (> 12 h ou pessoa)
             |              |                v
             |              |        [P] comentar o que
             |              |            falta e quando
             |              v                v
             |         o evento chegou nesta volta?
             |<--- sim: volta a ser    não: segue para [J]
             |     ATIVA, com prioridade
             v
   [B] ATIVAS < 2 e ATIVAS+ESPERANDO < 5?
        | sim                         | não
        v                             |
   [C] PRÓXIMA elegível, reservada    |
        |                             |
        +-------------+---------------+
                      v
   cada ATIVA, a partir do nó gravado na issue:
   [D] IMPLEMENTAR (subagente) <-------------+
        v                                    |
   [E] REVISAR (outro modelo) <------+       |
        v                            |       |
   [F] AUDITAR a UI (se tem UI)      |       |
        v                            |       |
   [G] ACHADOS? --- corrigir --------+       |
        | aprovado                           |
        v                                    |
   [H] ENTREGAR: PR --- portão recusou ------+
        | OK do merge? não: segue para [J]
        v sim
   [I] VERIFICAR o deploy
        v
   [J] STATUS: uma linha se nada mudou
```

```markdown
Você orquestra o loop contínuo do quadro <nome do quadro>. Não escreva
código nesta sessão. A cada volta, percorra o grafo de [A] a [J].

[A] Classifique cada issue em curso, pelos comentários dela:
- ATIVA: tem trabalho a avançar nesta volta.
- ESPERANDO: espera um evento com hora em menos de 12 h (deploy, CI,
  medição, o OK do merge combinado para hoje).
- ESTACIONADA: espera um evento a mais de 12 h, ou uma pessoa sem hora
  combinada.
Se o evento de uma ESPERANDO ou ESTACIONADA chegou, ela volta a ser
ATIVA, com prioridade. Se não chegou, ela segue para [J].

[P] Estacionar: comente na issue o que falta e a hora prevista; aplique
o rótulo blocked (algo fora do código) ou decision (uma decisão do dono
do produto); mova o card. A próxima volta relê o comentário. Ela não
conta no limite.

[B] A meta é ter 2 ATIVAS; o limite é 5 entre ATIVAS e ESPERANDO. Abaixo
da meta e dentro do limite, vá para [C]. Senão, siga para [D] com as
ATIVAS que já existem.

[C] Pegue a próxima issue elegível, na ordem do quadro, e reserve-a como
na seção 1: comente "reservada: <id desta sessão>" e só siga se a
primeira reserva for a sua. Elegível quer dizer:
- não altera um arquivo principal de outra issue em curso (um registro
  que só recebe linhas novas é exceção);
- não depende de uma issue que ainda não entrou na branch principal;
- forma par com o que está ativo: uma issue de interface com uma sem
  interface, nunca duas interfaces pesadas.
Se nenhuma for elegível, diga por quê.

[D] Para cada ATIVA, a partir do nó gravado no último comentário dela.
Implementar: um subagente com <modelo construtor>, num worktree próprio,
com teste primeiro e os limites de tamanho do repositório. O pedido
lista os casos difíceis (texto longo sem espaço, texto em 200%, leitura
lenta, recusa, modo escuro). Ele nunca envia para a branch principal.
Ao fim de cada nó, comente na issue o nó em que ela está.

[E] Revisar: outro subagente, com <modelo revisor>: código, isolamento
entre clientes, dados pessoais em log e limites de tamanho. No máximo
2 rodadas; depois você decide e registra o motivo na issue.

[F] Auditar a interface, quando a mudança tem tela, por um subagente
independente. A rodada 1 olha a mudança inteira; as rodadas 2 e 3, só o
que mudou desde a anterior. A meta é 17/20 ou mais, sem P0 nem P1.

[G] Achados:
- de P0 a P3, nas linhas tocadas: corrija no mesmo trabalho e volte a
  [E];
- sem aprovação depois da 3ª rodada de auditoria: comente o que falta,
  aplique blocked e vá para [P];
- um defeito antigo, fora das linhas tocadas, vira issue própria.

[H] Entregar, só o orquestrador (esta sessão), com o implementador
parado: um commit por issue, atualizado sobre a branch principal, o
pull request com a evidência (modelo 14), um por vez, e uma migração por
vez. Se um portão recusar por defeito real, volte a [D]; se a recusa
vier de uma máquina sobrecarregada, rode de novo. Um portão que falha
duas vezes seguidas: comente, aplique blocked e vá para [P]. O merge
espera o OK de uma pessoa; sem ele, a issue segue para [J].

[I] Verificar, depois do merge: o deploy publicou a versão, o CI da
branch principal está verde, a issue foi fechada e o card está em
"Feito". Um critério que só produção prova recebe verify-in-prod, com a
consulta de evidência no comentário.

[J] Status: uma linha por issue em curso, com o estado, o próximo passo
e a hora prevista no fuso do time. Numa volta sem mudança, uma linha só.
Encerre o loop quando não houver issue em curso nem elegível, ou ao
passar de <N> issues ou de <orçamento de tokens ou de custo>.
```

## 3. Acompanhar um pull request

```text
/loop Confira o pull request <N>. Se o CI falhou, leia o log do job,
reproduza a falha num teste e corrija. Responda cada comentário de revisão
com a mudança feita ou com o motivo para não mudar. Se estiver verde e sem
comentário novo, diga isso em uma linha. Encerre o loop quando o pull
request estiver aprovado, mergeado ou fechado.
```

## 4. Uma raia de manutenção

Melhor como tarefa agendada na nuvem, uma vez por dia: o `/loop` para quando a sessão fecha e expira em 7 dias.

```text
Raia de pacotes. Rode a auditoria de dependências e compare a nota com a da
última execução, registrada em <arquivo ou issue>. Numa branch
loop/pacotes/<data>, corrija só o que é mecânico (uma versão de correção sem
mudança de API), com os testes verdes. Nunca toque num arquivo que uma
branch aberta da fila altera. O que muda API ou exige escolha vira
issue no modelo 02. Nunca envie para a branch principal: abra o pull request
e pare. Se nada mudou, diga isso em uma linha.
```

## 5. Saúde de produção, só leitura

```text
/loop 1h Leia os erros de produção em <rastreador> desde a última leitura,
registrada em <arquivo ou issue>, só para leitura. Ao terminar, registre a
data desta leitura no mesmo lugar. Para cada erro, confirme em duas fontes antes de concluir,
meça o volume real e procure uma issue que já trate dele. Erro novo vira
issue com a evidência; erro conhecido fica em silêncio; erro resolvido
ganha um comentário na issue. Não altere nada em produção. Na dúvida, fique
em silêncio.
```
