# Modelo: desenho do SDLC futuro

Preenchido em time no laboratório do dia 5, em 62 minutos, e completado no acompanhamento remoto. Usa o modelo do método (capítulo 2): as seis decisões, as duas bases, as cinco etapas e os três controles. As ações dos obstáculos vêm do debrief da manhã.

```markdown
## SDLC mínimo
- O que continua vermelho (modelo 28), quem resolve e até quando:

## Seis decisões
| Decisão | Escolha do time | Motivo |
|---|---|---|
| Demanda (etapa 1) | | |
| Formato de spec (etapa 2) | | |
| Code review (etapas 4 e 5) | | |
| Cadência (backlog) | | |
| Feedback (backlog) | | |
| Tempo do dev (papéis) | | |

## Bases
- Base de conhecimento: onde fica, em que formato, quem mantém, quem confere:
- Base corporativa: o que sobe para ela, quem revisa, como o agente a lê:
- Entrada: de onde vêm as demandas, como chegam à fila única, o que o agente de triagem faz em cada classe e em que grau (rascunho ou automático):
- Backlog: de onde vêm as issues, quem escreve, quem ordena e quando:

## Arquitetura

| Parte | Como existe hoje | O que muda |
|---|---|---|
| Entrada e fila | | |
| Base de conhecimento | | |
| Repositório | | |
| Ambiente de teste | | |
| Portões na pipeline | | |
| Acesso e observabilidade | | |

## Etapas
| Etapa | Quem faz e o que uma pessoa aprova | O que a máquina verifica | Grau de cada atividade (manual, parcial, automático) |
|---|---|---|---|
| 1. Intenção | | | |
| 2. Spec e plano | | | |
| 3. Construção | | | |
| 4. Portões | | | |
| 5. OK e verificação | | | |

- Via rápida: que mudança vai por ela, quem decide a via e quando ela para e vai para o pipeline completo:

## Controles
- Papéis e decisões (PO, arquiteto, agentes, quem dá o OK; a forma dos times):
- Catracas e loops (pisos que sobem, raias de manutenção):
- Medição (lead time do pedido à produção, deploys, falhas, recuperação; o ciclo do bug pequeno, até a triagem e até a correção; a linha de base do dia 1; outros indicadores no modelo 27):
- Segurança e compliance (a classe de dado de cada repositório; sessões na nuvem, sim ou não; o registro de cada acesso de agente a produção; quem é dono do CLAUDE.md, das regras e das skills compartilhados):

## Critérios do piloto
Proposta do workshop, para ajustar:
- Expandir quando o lead time do pod ficar abaixo da linha de base em duas features seguidas, com taxa de falha igual ou menor e nenhum incidente de dado fora da classe permitida.
- Parar ou repensar se, depois de dois meses, o primeiro critério não foi atingido.

## Obstáculos e ações
| Obstáculo e grupo | Causa | Ação e responsável |
|---|---|---|
```

Os grupos de obstáculo são seis: acesso, aprovação manual, silo, conhecimento em pessoas, ferramenta e limite de uso.

Para o acompanhamento remoto ficam o que não cabe em 60 minutos: a topologia em detalhe (times, tamanho, passagens que continuam e por quê), os tempos de trabalho e de espera em cada etapa e as metas de cada indicador.
