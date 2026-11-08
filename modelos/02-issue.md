# Modelo: issue

Escrita pelo agente a partir da intenção e do código. A pessoa revisa os fatos. Quem lê a issue semanas depois, pessoa ou agente, precisa conseguir agir só com o que está nela.

```markdown
| Campo | Valor |
|---|---|
| Capacidade | <uma capacidade de negócio da lista da empresa> |
| Quem ganha | <a persona> |
| Confiança | <Medido em produção · Lido no código · Hipótese> |
| Horizonte | <P0 agora, P1 próximo, P2 depois ou P3 backlog>: <uma frase com o motivo> |
| Tamanho | <cabe num lote: sim, ou dividir em #…> |

## Contexto
<O que esta parte do sistema faz hoje, para quem nunca viu o código.>

## Problema
<O que está errado ou falta. Fatos, números, arquivo:linha.>

## Impacto
<Quem sente e quanto. Se não há medida, diga isso.>

## Proposta
1. <Um passo por linha, no imperativo.>

## Critério de aceite
- [ ] <Um resultado verificável por linha: teste, comportamento ou número.>

## Dependências
- Depende de: <#N, ou "nenhuma">
- Bloqueio externo: <o que falta fora do código, ou "nenhum">
- Decisão pendente: <a pergunta e a recomendação, ou "nenhuma">

## Referências
- Código: `<caminho>`
- Intenção: <link do épico>
```

Rótulos: um de tipo, pela ordem de decisão do capítulo 8: sondagem (`probe`), bug, estrutural (`structural`), feature ou melhoria (`enhancement`); um horizonte (P0 a P3); e um épico pai. Seção sem conteúdo diz "nenhum". A linha de tamanho é proposta do workshop: uma issue que não cabe num lote é dividida antes de entrar na fila.
