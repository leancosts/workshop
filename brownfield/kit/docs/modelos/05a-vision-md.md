# Modelo: VISION.md

O porquê do sistema e os princípios que não se negociam. O agente lê este arquivo no início de toda tarefa; quando uma tarefa conflita com um princípio, ele levanta o conflito em vez de contorná-lo. Escreva o problema, o que o sistema resolve e os princípios, sem implementação, tecnologia ou roteiro de entrega. Um princípio só entra se mudar alguma decisão, e, quando der, um teste o verifica.

```markdown
# Visão

## O problema
<O que dói hoje, para quem, com um fato observado.>

## A solução
<O que o sistema faz, em duas ou três frases, sem tecnologia.>

## Para quem
<As personas, na ordem de importância.>

## Princípios
1. **<Nome curto>.** <A regra e o que ela impede. Onde é verificada:
   um teste, um portão, uma revisão.>
2. **<Nome curto>.** <...>
3. **<Nome curto>.** <...>

## Como é o sucesso
- <Um resultado observável.>

## O que não fazemos
- <Um não objetivo, e por quê.>
```

Exemplo do caso: "Somente leitura por construção. O leancosts nunca altera um recurso na nuvem do cliente. Isso é verificado no código por um teste: um caminho de escrita reintroduzido quebra o build."
