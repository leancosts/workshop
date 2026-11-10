# Visão

## O problema
Uma área de TI interna atende cerca de 800 colaboradores numa fila única, com três analistas fazendo a triagem à mão. Boa parte dos chamados repete perguntas que já têm resposta documentada (senha, VPN, acesso a sistema), e mesmo assim cada um espera um analista ler. Chamados mal categorizados chegam ao time errado e voltam, e o solicitante não sabe se alguém viu o pedido. (Cenário fictício; o enunciado completo está em `docs/problema.md`.)

## A solução
Um agente faz a primeira leitura de todo chamado: entende o pedido, classifica, e resolve na hora o que a base de conhecimento já cobre. O que depende de uma pessoa chega ao analista já organizado, e o solicitante sempre recebe um retorno imediato.

## Para quem
1. **Solicitante:** o colaborador que abre o chamado e espera o retorno.
2. **Analista:** quem assume os chamados encaminhados e os encerra.
3. **Equipe de TI:** quem mantém a base de conhecimento.

## Princípios
<!-- O time escreve de três a cinco princípios. Cada um muda uma decisão em aberto de docs/problema.md e diz onde é verificado. -->
1. **<Nome curto>.** <A regra e o que ela impede. Onde é verificada:
   um teste, um portão, uma revisão.>
2. **<Nome curto>.** <...>
3. **<Nome curto>.** <...>

## Como é o sucesso
<!-- O time escolhe os indicadores de docs/problema.md e a meta de cada um. -->
- <Um resultado observável, com número.>

## O que não fazemos
- Canais reais (e-mail, Slack, WhatsApp): o chamado entra pela aplicação.
- Autenticação e SLA.
- Integração com ferramentas de mercado como Jira e ServiceNow.
