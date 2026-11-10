# Modelo: autoavaliação do SDLC mínimo

Proposta do workshop. Cada time marca, até o dia 3, os oito itens que o agente precisa encontrar funcionando, na área da feature. O resultado volta no dia 3 (pronto para o agente) e no dia 5 (o que vem antes do piloto).

- **Verde:** funciona sem depender de uma pessoa.
- **Amarelo:** existe, mas depende de alguém ou não barra o merge.
- **Vermelho:** não existe.

```markdown
Time: <nome do time>. Repositório: <nome>. Data: <AAAA-MM-DD>.

| Item | O que confere | Cor | Evidência | Dono | Até quando |
|---|---|---|---|---|---|
| Versionamento | Todo o código em git, com branch curta | | | | |
| Pull request | Toda mudança entra por PR, com um responsável | | | | |
| Build | Um comando, sem intervenção manual | | | | |
| Testes | Automáticos, na área que vai mudar | | | | |
| CI no PR | Lint e testes barram o merge | | | | |
| Ambiente de teste | Dados fictícios, sem depender de uma pessoa | | | | |
| Uma fila | Toda demanda num rastreador, com dono e estado | | | | |
| Critério de pronto | Critério de aceite escrito antes do código | | | | |
```

A evidência é um link, um comando ou o nome de um arquivo. Um item sem evidência fica amarelo. Dono e data só são obrigatórios nos itens que não estão verdes.
