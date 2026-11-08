# Modelo: outros arquivos de apoio

**AGENTS.md.** Para ferramentas de agente que procuram esse nome. Uma linha que aponta para a fonte única:

```markdown
Leia o CLAUDE.md.
```

**Regras por tema.** Quando o `CLAUDE.md` passar de uma tela, mova cada assunto para `.claude/rules/<tema>.md` (git, testes, documentação, stack, domínio) e deixe no `CLAUDE.md` a lista com um link por arquivo. No caso, o Claude Code carrega esses arquivos no início da sessão.

**CLAUDE.md de uma pasta.** Regras que valem só para uma área (por exemplo, `workshop/CLAUDE.md` neste repositório). Confirme na documentação do Claude Code quando ele é carregado antes de depender disso.

**PRODUCT.md.** Opcional: quem usa, o propósito e o posicionamento, quando o `VISION.md` não basta para decisões de tela e de texto.

**Começar do zero.** O comando `/init` do Claude Code gera um primeiro `CLAUDE.md` a partir do código. Corte o que não se aplica e confira cada comando antes de commitar.
