
# Proposta de greenfield: prontidão da tripulação

Um sistema novo e pequeno do ramo de aviação executiva para o dia 2. Cada time parte do repositório inicial (stack, testes e lint prontos), escreve o `VISION.md` e o `CLAUDE.md` e constrói uma fatia seguindo o método. Neste exercício, um tripulante só pode ser escalado com os documentos em dia, e um documento vencido percebido perto do voo cancela ou atrasa a missão. O domínio tem regras claras de data e de estado, usa dados fictícios sem dado pessoal e cabe numa manhã.

Os tipos de documento, os prazos e as funções abaixo são fictícios e simplificados para o exercício. Não descrevem a regulação aeronáutica nem as regras de uma empresa.

## Como a manhã usa a proposta

| Momento | O que se constrói |
|---|---|
| Demonstração (facilitador) | O núcleo: a regra de prontidão, da intenção ao teste verde |
| Laboratório 1 (cada time) | A partir do repositório inicial: o `VISION.md`, o `CLAUDE.md` e o núcleo, com os cinco exemplos decididos abaixo como testes |
| Laboratório 2 (cada time) | A intenção da extensão, a issue escrita pelo agente, a spec e o plano, com uma revisão adversarial só para os dois |
| Laboratório 3 (cada time) | A extensão, com teste primeiro, sob um `/goal`; um hook, a CI no pull request e a revisão do diff |
| Demonstrações (cada time) | O resultado: a fatia funcionando, o teste, uma decisão da spec e uma coisa que o agente errou |

Cada time trabalha no próprio repositório. O repositório inicial usa TypeScript com Vitest, e não precisa ser a stack da empresa. O time pede ao agente duas ou três opções (por exemplo, Python com pytest, Go), com prós e contras para este domínio, e registra no `ARCHITECTURE.md` o que mudaria. Interface por linha de comando ou API HTTP, à escolha do time. Os dados ficam em memória ou num arquivo local.

## O núcleo, comum a todos os times

```markdown
## Objetivo
Saber, a qualquer momento, se cada tripulante pode ser escalado, com base
na validade dos seus documentos.

## Quem ganha
A coordenação de operações, que monta a escala, e quem responde pela
segurança operacional.

## Problema hoje
A validade dos documentos fica numa planilha. Um documento vencido só é
percebido perto do voo.

## Como medimos
Os exemplos decididos da tabela de prontidão passam como testes; o caso
de borda ganha teste depois que a spec o decide. A regra existe numa
função só, usada por todas as extensões.

## Fora de escopo
Login, interface elaborada, banco de dados externo, integração com os
sistemas da operadora, envio real de mensagem, regra regulatória real.

## Restrições
Dados fictícios. Matrícula fictícia no lugar do nome de pessoa. Roda
localmente com um comando.

## Pronto quando
O núcleo e uma extensão têm testes que falharam antes e passam depois,
e o commit liga a intenção, a spec, o plano e o veredito da revisão.
```

Dados do núcleo:

- **Tripulante:** matrícula, função (comandante, copiloto ou comissário), base.
- **Documento:** matrícula, tipo (certificado médico, habilitação de tipo, treinamento periódico), tipo de aeronave (só na habilitação de tipo), válido até (data), situação (ativo ou suspenso).
- **Documentos exigidos:** comandante e copiloto precisam dos três tipos; comissário, do certificado médico e do treinamento periódico.

Regra de prontidão, avaliada numa data de referência, na ordem da tabela (vale a primeira linha que se aplica):

| Situação | Prontidão |
|---|---|
| Falta um documento exigido pela função | incompleto |
| Algum documento suspenso | bloqueado |
| Algum documento venceu há 10 dias | não apto |
| O primeiro documento a vencer vence em 20 dias | apto, vence em breve (30 dias ou menos) |
| Todos os documentos vencem em mais de 30 dias | apto |
| Um documento vale até exatamente a data de referência | a decidir na spec: apto, vence em breve, ou não apto? |

A última linha é de propósito: o time decide a borda na spec do laboratório 2, escreve o teste dela depois da decisão, e a revisão adversarial confere se a decisão foi escrita.

## As cinco extensões, uma por time

### 1. Escala de voo
Escalar uma matrícula num voo (data, base de saída, tipo de aeronave, função).

- Recusa o tripulante que não está apto na data do voo, com o motivo, usando a regra do núcleo.
- Recusa comandante ou copiloto sem habilitação de tipo para a aeronave do voo.
- Recusa o tripulante já escalado em outro voo na mesma data.

### 2. Alertas de vencimento
Listar o que vence nos próximos N dias, por base.

- Inclui os documentos já vencidos, no topo, e depois os que vencem em até N dias, por data de vencimento.
- Lista à parte os tripulantes incompletos.
- Com N igual a 0, lista só os vencidos e os incompletos.
- Gera um arquivo de aviso por base, com o mesmo conteúdo da lista.

### 3. Trilha de auditoria
Registrar cada mudança como um evento.

- Cadastro e renovação de documento geram um evento com quem, quando, o antes e o depois.
- A consulta por matrícula devolve os eventos em ordem de registro.
- O repositório de eventos não expõe alteração nem exclusão; um teste tenta as duas e falha.

### 4. Importação de planilha
Importar tripulantes e documentos de um arquivo CSV.

- Aceita as linhas válidas e recusa as inválidas, com o número da linha e o motivo.
- Importar o mesmo arquivo duas vezes não duplica nada.
- Uma data num formato inválido é recusada, nunca adivinhada.

### 5. Painel da operação
Indicadores por base e por função, e um arquivo para a operação.

- Por base: total, apto, vence em breve, não apto, bloqueado, incompleto.
- Em cada base, o total é igual à soma das cinco categorias; um teste prova isso.
- Exporta os indicadores em CSV.

## O que a revisão adversarial deve encontrar

Cada extensão tem um ponto onde é fácil esquecer um caso. Bons revisores perguntam:

- A escala avalia a prontidão na data do voo, ou na data de hoje?
- A escala usa a mesma regra do núcleo, ou uma cópia que pode divergir?
- O alerta trata o tripulante incompleto?
- O repositório de eventos tem algum caminho que altera ou apaga um evento?
- A importação repetida duplica algum documento?
- O total de cada base inclui os incompletos?
