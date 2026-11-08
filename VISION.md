# Visão

## O problema
A validade dos documentos da tripulação fica numa planilha. Um documento vencido só é percebido perto do voo, e a missão atrasa ou é cancelada.

## A solução
O sistema diz, a qualquer momento, se cada tripulante pode ser escalado, com base na validade dos seus documentos.

## Para quem
1. A coordenação de operações, que monta a escala.
2. Quem responde pela segurança operacional.

## Princípios
1. **Tripulante não apto não é escalado.** Nenhuma extensão escala quem a regra recusa. Verificado por teste.
2. **Uma regra, num lugar só.** A prontidão é calculada numa função, usada por todas as extensões. Verificado na revisão.
3. **Dado fictício.** Matrícula no lugar do nome de pessoa e prazos inventados. Verificado na revisão.

## Como é o sucesso
- Os exemplos decididos da tabela de prontidão passam como testes.

## O que não fazemos
- Login, interface elaborada, banco de dados externo, integração com outros sistemas ou regra regulatória real: o exercício cabe numa manhã.
