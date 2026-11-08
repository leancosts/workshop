# Modelo: condição de /goal

O `/goal` mantém a sessão trabalhando até a condição ser verdadeira. Escreva a condição como um estado que alguém consegue verificar, não como um esforço, e inclua as regras de trabalho.

| Meta fraca | Meta verificável |
|---|---|
| "Melhorar a página de pedidos" | "As issues 12, 13 e 14 estão fechadas por commits, cada uma com os critérios de aceite marcados" |
| "Corrigir a interface" | "A auditoria da tela não tem achado P0 ou P1 aberto" |
| "Implementar os follow-ups" | "Cada follow-up virou issue, foi construído e fechado, ou está marcado como bloqueado" |

```text
/goal Os critérios de aceite da issue <N> estão cobertos por testes
que falharam antes da mudança e passam depois; o comando de testes
termina verde; o lint do que mudou passa; o documento vivo foi
atualizado no mesmo commit; o plano passou pela revisão adversarial. Construa com <modelo A> e revise com <modelo B>.
```
