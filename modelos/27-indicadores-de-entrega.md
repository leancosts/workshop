# Modelo: indicadores de entrega

Proposta do workshop. Os indicadores mais usados para medir a entrega de software, o que cada um mede e de onde vêm as datas quando o time ainda não mede nada. O primeiro é o lead time do método. Os cinco seguintes são os do DORA, com a definição do guia deles; o capítulo 12 resume quatro deles em uma linha cada. Os outros são uma seleção do workshop, com o nome em inglês entre parênteses.

| Indicador | O que mede | De onde vêm as datas |
|---|---|---|
| Lead time (do método) | Do pedido à mudança em produção | Abertura do item no rastreador; deploy no pipeline |
| Lead time da mudança (change lead time, DORA) | Do commit à mudança em produção | Commit no git; deploy no pipeline |
| Frequência de deploy (deployment frequency, DORA) | Quantos deploys por período, ou o tempo entre eles | Execuções do pipeline de produção |
| Taxa de falha em mudanças (change fail rate, DORA) | Quantos deploys pedem intervenção imediata: reverter ou corrigir às pressas | Reverts no git; correções ligadas a um deploy |
| Tempo de recuperação (failed deployment recovery time, DORA; antes, MTTR) | Do deploy que falhou à recuperação | Deploy que falhou; deploy ou revert que resolveu |
| Taxa de retrabalho (deployment rework rate, DORA) | Quantos deploys não planejados são feitos por causa de um incidente em produção | Deploys ligados a um incidente |
| Tempo de correção de bug (time to resolve) | Do registro do bug à correção em produção | Abertura do item; deploy que leva a correção |
| Tempo até a triagem | Do registro do item ao comentário ou rótulo que dá a classe | Abertura do item; primeiro rótulo ou comentário |
| Tempo até a primeira resposta | Do registro à primeira resposta a quem pediu | Abertura do item; primeiro comentário |
| Tempo de ciclo (cycle time) | Do início do trabalho à produção; como o lead time, mas começa no trabalho, não no pedido | Primeiro commit ou item em andamento; deploy |
| Tempo de revisão (PR review time) | Do PR aberto ao PR aprovado | Abertura e aprovação do PR na plataforma de código (GitHub ou Azure DevOps) |
| Vazão (throughput) | Itens entregues por período, como a semana; contados com o tamanho de cada um, ou só itens de tamanho parecido | Itens fechados no rastreador |
| Trabalho em andamento (WIP) | Itens abertos ao mesmo tempo | Itens em andamento no rastreador, numa data |
| Idade dos itens abertos (backlog age) | Há quanto tempo os itens abertos esperam | Abertura dos itens ainda abertos |
| Taxa de reabertura (reopen rate) | Quantos bugs voltam depois de fechados | Itens reabertos no rastreador |
| Taxa de escape (escape rate) | A parcela dos bugs achados que o usuário achou primeiro | Origem do bug: teste, revisão ou produção |

MTTR é uma sigla com vários sentidos: tempo médio de recuperação, de reparo, de resposta ou de resolução. Quem usa a sigla escreve de que data a que data mede. O DORA trocou o MTTR pelo tempo de recuperação de um deploy que falhou.

Cuidados ao medir:

- **A mediana ao lado da média.** O "M" de MTTR é de média (mean). Um item esquecido por um mês puxa a média; a mediana mostra o caso típico. Registre as duas e quantos itens entraram na conta.
- **Velocidade com qualidade.** Todo tempo que cai é lido ao lado da taxa de falha ou da taxa de reabertura. Um tempo menor com mais retorno não conta como melhora.
- **Medir o processo, não pessoas.** Usado para comparar pessoas, o indicador leva cada uma a melhorar o próprio número, e o número deixa de mostrar o processo.
- **Comparar o time com ele mesmo.** O guia do DORA aplica os indicadores por aplicação ou serviço, desaconselha comparar sistemas muito diferentes e somar times, e avisa que um indicador transformado em meta tende a ser manipulado. O objetivo é o time melhorar ao longo do tempo.
- **Poucos e sempre do mesmo jeito.** Comece pelos quatro do método e pelo ciclo do bug pequeno (capítulo 12). Acrescente outro só quando ele responder a uma pergunta do time. A definição fica escrita, e a fonte das datas é a mesma antes e depois da mudança de processo.
- **Datas registradas.** Um agente com acesso só de leitura reúne as datas do rastreador, do git e do pipeline; uma pessoa confere três itens à mão. Onde a data não existe, o valor é estimado e marcado como estimativa.

```markdown
## Linha de base: <time>, <período>
| Indicador | Definição usada | Mediana | Média | Itens | Fonte das datas | Estimativa? |
|---|---|---|---|---|---|---|
| Lead time | Do pedido à produção, as cinco últimas features | | | | Rastreador e pipeline | Não |
```
