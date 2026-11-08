# Arquitetura

O mapa do sistema. Hoje ele diz só o que o repositório inicial já decidiu; o time o completa a partir do laboratório 1.

## Stack

.NET 10, com xUnit nos testes e `dotnet format` na formatação. Os dados ficam em memória ou num arquivo local.

## Estrutura

| Caminho | O que tem |
|---|---|
| `src/Prontidao/` | O código do sistema |
| `tests/Prontidao.Tests/` | Os testes |
| `scripts/` | A verificação e o teste de acesso |
| `ci/` | Os arquivos de CI, para copiar no laboratório 3 |

## Como verificar

`dotnet run scripts/verificar.cs` roda formatação, build e testes.

## Opções de stack comparadas

O time registra aqui as opções que o agente trouxe no laboratório 1 e o que mudaria em cada uma.
