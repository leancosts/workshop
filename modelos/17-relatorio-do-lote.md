# Modelo: relatório do lote

O relatório que o PO envia à gestão no fim de cada lote. É o status report: vai como está, sem ser reescrito. No caso, o fim de um `/deliver` deixa cada issue em Feito ou em Verificar em prod, e cada follow-up fechado ou com o rótulo `blocked`, `waiting` ou `decision`; o relatório junta essas listas.

```markdown
# Lote <número ou data>

## Entregue
| Issue | O que muda para quem usa | Evidência |
|---|---|---|
| [#N](<link>) | <uma frase> | <PR, teste que falhou antes e passa depois, veredito do revisor> |

## Espera verificação em produção
- [#N](<link>): <o que só produção prova, onde é lido e em que data>

## Follow-ups bloqueados ou à espera de decisão
- [#N](<link>): <o bloqueio externo, ou a decisão com a recomendação e quem decide>

## Decisões registradas
- <A decisão e onde foi registrada: commit, comentário da issue ou ADR.>

## Obstáculos
- <Grupo: causa e tempo perdido (modelo 13), ou "nenhum".>

## Próximo lote
- <#N, #N, na ordem do backlog, com o motivo.>
```
