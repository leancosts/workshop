# Modelo: regras de exemplo para o CLAUDE.md

Regras que o leancosts usa no `CLAUDE.md` e em `.claude/rules/`, traduzidas e adaptadas para qualquer time. Cada uma nasceu de um erro que se repetiu. Copie as que servem, troque os comandos pelos do seu repositório e apague as que não se aplicam. Uma regra que a máquina consegue verificar deve virar também um hook, um lint ou um teste (capítulo 5).

## Antes de afirmar

```markdown
- Nunca afirme algo sobre um código que você não abriu. Leia o arquivo
  inteiro antes de responder.
- O que o sistema faz hoje vem do código, depois do documento vivo, nunca
  de um registro datado (spec, plano, ADR antigos). Se discordarem, o
  código vale.
- Uma linha de log é uma alegação, não uma prova. Antes de um diagnóstico,
  confirme em duas fontes independentes: o registro estruturado e o que
  ele deveria implicar nos dados.
- Procure sempre a causa raiz.
```

Evita: respostas confiantes sobre código que mudou, e diagnósticos errados a partir de um resumo.

## Antes de escrever código

```markdown
- Antes de escrever qualquer coisa, procure um motivo para não escrever.
  O melhor código é o que não foi escrito.
- Não crie uma feature se ela puder ser a extensão de uma que já existe.
  Não crie duas soluções para o mesmo problema.
- Nunca ligue uma implementação falsa ou vazia num caminho real.
- Nunca invente números num caminho real.
- Use TDD: o teste que falha vem antes do código.
```

Evita: código duplicado, padrões concorrentes e um sistema que parece funcionar porque um pedaço finge.

## Antes de dizer que está pronto

```markdown
- Antes de dar uma mudança por concluída, rode a suíte inteira e corrija
  todos os testes que falham, inclusive os que já falhavam antes.
- Para confirmar que uma falha é antiga, rode o teste num worktree
  descartável na branch principal. Nunca use git stash.
- Corrija os problemas antigos que encontrar. Nunca adie o que precisa
  ser feito. Todo follow-up vira issue. O que bloqueia o critério de aceite
  é construído no mesmo lote; o resto entra na fila.
- Um piso (cobertura, nota da documentação) só sobe. Nunca o abaixe para
  deixar um build verde.
```

Evita: "pronto" que quebra outra coisa, dívida que cresce em silêncio e um piso que cai um pouco a cada push.

## Dados e tela

```markdown
- Uma leitura que falhou é um estado de erro, com nova tentativa, nunca
  uma lista vazia.
- Nunca escreva nomes reais de clientes em código, comentários, testes
  ou documentos. Anonimize para os fatos que importam. (No caso, um
  script no push recusa os nomes de uma lista.)
```

Evita: uma tela que mostra "nenhum item" quando o banco caiu, e dado de cliente vazando para o repositório.

## Ao conversar com a pessoa

```markdown
- Tente resolver antes de perguntar: leia o arquivo inteiro, confira o
  contexto, procure.
- Quando perguntar, traga sempre a sua recomendação.
- Seja honesto, mesmo quando a resposta for ruim.
- Não gaste tempo discutindo detalhe sem importância.
```

Evita: perguntas que o próprio repositório responde, e decisões devolvidas à pessoa sem uma proposta.

## Como manter

- Cada regra cabe numa ou duas linhas e diz o que fazer, não o que pensar.
- Uma regra nova entra quando um erro se repete; o commit que a acrescenta cita o caso.
- O arquivo fica curto: no caso, cada arquivo de instrução tem no máximo 5.000 tokens, conferido no commit. O que não cabe vai para um arquivo de regras por tema (`.claude/rules/`).
