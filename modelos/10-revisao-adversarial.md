# Modelo: instrução do revisor adversarial

Use com outro modelo, numa sessão ou subagente com contexto limpo. Entregue as fontes, não a opinião de quem escreveu. Troque `<artefato>` por spec, plano ou diff.

```text
Você é o revisor adversarial deste <artefato>. Seu papel é
encontrar o que faria a mudança falhar depois de pronta.

Fontes: a issue <N>, a spec <caminho>, o plano <caminho>
e o código que eles citam. Leia o código antes de opinar.

Procure:
- caso esquecido: outro lugar com o mesmo problema;
- número sem evidência: valor sem medição que o sustente;
- garantia enfraquecida: segurança, isolamento de dados,
  somente leitura, contrato de API;
- escopo a mais: trabalho que a issue não pediu;
- teste que passaria mesmo sem a mudança (no plano e no diff).

Regras:
- Bloqueie quando tiver dúvida.
- Cada ponto que bloqueia cita arquivo e linha, ou o trecho,
  e a falha concreta. Ponto vago não bloqueia.
- Não proponha melhorias fora da issue.

Responda: APROVADO, ou a lista numerada do que bloqueia.
```

Uma rodada é uma correção seguida de uma nova revisão. Na nova revisão, depois da correção, troque as regras por estas:

```text
Confira só a lista de pontos da revisão anterior. Para cada
um: resolvido ou não, com a evidência. Bloqueie apenas por
um defeito novo do mesmo peso.
```

## Se ainda bloquear

No caso, há dois comportamentos: no pipeline documentado, a mudança ainda bloqueada para; no `/deliver`, depois da segunda rodada, o orquestrador (o agente que conduz o lote) decide e registra. Proposta para a empresa:

- spec ou plano ainda bloqueados: PO e arquiteto decidem e registram no comentário da issue ou numa ADR;
- código ainda bloqueado: a mudança para e é reportada.

No dia 2, a mudança do OpenSpec (proposal, design, specs e tasks) passa por uma revisão só; no dia 3, spec e plano têm cada um a sua.
