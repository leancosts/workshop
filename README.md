# Repositório inicial do workshop

Ponto de partida do dia 2 do programa de Engenharia de Software Agêntica. Stack, testes e lint já funcionam, para o laboratório começar pela intenção. A regra de negócio é do time. Os dados são fictícios.

## Antes do dia 1

Cada participante clona este repositório e roda o teste de acesso:

```bash
npm run checar-ambiente
```

O que falhar vai para a lista de obstáculos (modelo 13) e para os facilitadores.

## Começar no dia 2

Cada time trabalha no próprio repositório:

```bash
git clone <este repositório> prontidao-time-N
cd prontidao-time-N
git remote set-url origin <repositório do time>
git push -u origin main
npm ci
npm run verificar
```

| Comando | O que faz |
|---|---|
| `npm run verificar` | Lint, tipos e testes |
| `npm test` | Só os testes |
| `npx vitest run tests/arquivo.test.ts` | Um arquivo de teste |

## O que está aqui

| Caminho | O que tem |
|---|---|
| `src/`, `tests/` | Um arquivo e um teste que só provam que o ambiente funciona. Apague os dois quando o núcleo existir |
| `ci/` | A CI do laboratório 3, para GitHub Actions e Azure Pipelines. Copie o arquivo para o lugar indicado na primeira linha dele |
| `modelos/` | Os modelos do minibook, para copiar e preencher no repositório |
| `scripts/checar-ambiente.mjs` | O teste de acesso |

`VISION.md`, `CLAUDE.md` e `ARCHITECTURE.md` não existem de propósito: o time os escreve no laboratório 1, a partir dos modelos 05, 05a e 05b. O enunciado do sistema está no modelo 08.

## Plano B do laboratório 1

A branch `referencia/nucleo` traz o núcleo com os cinco exemplos decididos como testes. Um time atrasado copia `src/prontidao.ts` e `tests/prontidao.test.ts` e anota o obstáculo. O caso de borda continua a decidir na spec: até lá, a função recusa a data e não escolhe um lado.

## O que não entra aqui

Código da empresa, dado pessoal e segredo. Os dados do exercício são fictícios e não descrevem a regulação aeronáutica.
