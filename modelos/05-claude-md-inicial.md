# Modelo: CLAUDE.md inicial de um repositório

Um ponto de partida para o repositório do time. Ele diz como trabalhar; o que é verdade sobre o sistema (regras de negócio, features, decisões) fica na base de conhecimento em `docs/`, e este arquivo aponta para lá. Corte o que não se aplica e acrescente cada regra que o agente precisar aprender durante a semana. Mantenha o arquivo curto: instrução longa demais é lida pela metade.

```markdown
# <Nome do sistema>

## O que é
<Uma frase sobre o que o sistema faz e para quem.>

## Como rodar
- Instalar: `<comando>`
- Build: `<comando>`
- Testes: `<comando>`; um arquivo só: `<comando>`
- Lint: `<comando>`

## Mapa
<Quando existir um ARCHITECTURE.md, troque esta seção por um link para ele.>
- `<pasta>`: <o que tem>
- `<pasta>`: <o que tem>

## Como trabalhamos
- Teste primeiro: o teste novo falha antes da mudança e passa depois.
- Nunca afirmar algo sobre um código que não foi aberto. Citar arquivo e linha.
- O documento vivo muda no mesmo commit que o código.
- Toda decisão fora da spec é registrada: no commit, no comentário da issue ou numa ADR.

## Nunca
- Editar migração já aplicada.
- Tocar em configuração de produção.
- Usar dados fora da classe permitida pela segurança.
- Escrever segredo, senha ou token em arquivo.

## Base de conhecimento
- Regras de negócio, features, processos e decisões: `docs/index.md`.
- O frontmatter de cada documento segue o padrão da empresa; a checagem do modelo 15 confere.
```

Regras de exemplo, prontas para copiar e adaptar: modelo 05e.
