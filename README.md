# Repositório inicial do workshop

Ponto de partida do dia 2 do programa de Engenharia de Software Agêntica. O .NET, os testes e a formatação já funcionam, para o laboratório começar pela intenção. A regra de negócio é do time. Os dados são fictícios.

## Antes do dia 1

Instale o SDK do .NET 10. Depois, cada participante clona este repositório e roda o teste de acesso:

```bash
dotnet run scripts/checar-ambiente.cs
```

O que falhar vai para a lista de obstáculos (modelo 13) e para os facilitadores.

## Começar no dia 2

Cada time trabalha no próprio repositório:

```bash
git clone <este repositório> prontidao-time-N
cd prontidao-time-N
git remote set-url origin <repositório do time>
git push -u origin main
dotnet run scripts/verificar.cs
```

| Comando | O que faz |
|---|---|
| `dotnet run scripts/verificar.cs` | Formatação, build e testes |
| `dotnet test` | Só os testes |
| `dotnet format` | Corrige a formatação |

## O que está aqui

| Caminho | O que tem |
|---|---|
| `src/`, `tests/` | Uma classe e um teste que só provam que o ambiente funciona. A demonstração os troca pelo núcleo |
| `VISION.md`, `CLAUDE.md`, `docs/` | A base de que a demonstração parte, com a intenção do núcleo |
| `ARCHITECTURE.md` | O que o repositório já decidiu. O time o completa |
| `ci/` | A CI do laboratório 3, para GitHub Actions e Azure Pipelines. Copie o arquivo para o lugar indicado na primeira linha dele |
| `modelos/` | Os modelos do minibook, para copiar e preencher no repositório |
| `scripts/` | A verificação e o teste de acesso |

`VISION.md` e `CLAUDE.md` não existem na `main` de propósito: o time os escreve no laboratório 1, a partir dos modelos 05 e 05a. O enunciado do sistema está no modelo 08.

## Branches

| Branch | Para quê |
|---|---|
| `main` | O ponto de partida de cada time |
| `demo/inicio` | A demonstração do facilitador: `VISION.md`, `CLAUDE.md`, `ARCHITECTURE.md` e a intenção do núcleo |
| `referencia/nucleo` | Plano B do laboratório 1: o mesmo, mais o núcleo com os cinco exemplos decididos como testes. O caso de borda continua a decidir na spec: até lá, a função recusa a data e não escolhe um lado |

## O que não entra aqui

Código da empresa, dado pessoal e segredo. Os dados do exercício são fictícios e não descrevem a regulação aeronáutica.
