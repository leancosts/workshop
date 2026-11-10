# Proposta de greenfield: Triagem, o assistente de atendimento de chamados

Um sistema novo e pequeno para o dia 2. Cada time parte do repositório `greenfield` (`github.com/leancosts/workshop`), escreve o `VISION.md` e o PRD e leva o PRD ao código pelo OpenSpec. O cenário é fictício: o domínio é conhecido de todos, as regras cabem numa manhã e as lacunas do enunciado são de propósito.

## O problema de negócio

**Cenário.** Uma área de TI interna atende cerca de 800 colaboradores. Todo pedido entra numa fila única: dúvidas operacionais, bugs, pedidos de ajuste e ideias de sistemas novos. Três analistas fazem a triagem manualmente.

**A dor.** Boa parte dos chamados repete perguntas que já têm resposta documentada, como redefinir senha, configurar a VPN ou pedir acesso a um sistema. Mesmo assim, cada um espera na fila até um analista ler. Chamados mal categorizados chegam ao time errado e voltam. O solicitante fica sem saber se alguém viu o pedido.

**A visão.** Um agente faz a primeira leitura de todo chamado. Ele entende o pedido, classifica o chamado e resolve na hora o que a base de conhecimento já cobre. Os casos que dependem de uma pessoa chegam aos analistas já organizados, e o solicitante sempre recebe um retorno imediato e honesto.

## Atores

- **Solicitante:** abre o chamado e recebe o retorno.
- **Agente de triagem:** classifica, responde quando pode e encaminha quando não pode.
- **Analista:** assume os chamados encaminhados e os encerra.
- **Base de conhecimento:** artigos curtos com respostas validadas pela equipe.

## Categorias

| Categoria | Definição | Exemplo |
|---|---|---|
| Atendimento | Dúvida ou pedido operacional, sem mudança em sistema | "Como redefino minha senha?" |
| Correção | Algo que funcionava e deixou de funcionar | "O relatório de vendas dá erro desde ontem" |
| Melhoria | Mudança de escopo pequeno em algo que já existe | "Incluir filtro por data na tela de pedidos" |
| Projeto | Algo novo, que exige priorização e orçamento | "Precisamos de um app para os vendedores externos" |

## Fluxo principal

1. O solicitante abre um chamado com um texto livre.
2. O agente classifica o chamado e justifica a classificação.
3. Se for atendimento e a base tiver a resposta, o agente responde, registra a resposta no chamado e fecha o chamado.
4. Se não conseguir responder, o agente mantém o chamado aberto e avisa o solicitante de que uma pessoa vai assumir.

## Indicadores de sucesso

- Taxa de autoatendimento: chamados fechados pelo agente sem intervenção humana.
- Acurácia da classificação.
- Tempo até o primeiro retorno ao solicitante.
- Taxa de respostas automáticas erradas, medida pelos chamados reabertos.

**Fora de escopo:** canais reais (e-mail, Slack, WhatsApp), autenticação, SLA e integração com ferramentas de mercado como Jira e ServiceNow.

## Decisões em aberto, de propósito

O enunciado deixa estas lacunas sem resposta. É nelas que o time sente o esforço de decidir e alinhar antes de gerar código, e é por elas que o `/grill-me` e a revisão adversarial começam.

- **Correção, melhoria e projeto:** o enunciado só diz o que fazer com atendimento. Esses chamados vão todos para pessoas? Para filas diferentes?
- **"Conseguir responder":** quando o agente pode dizer que sabe a resposta? Como ele decide que não sabe? Qual o limiar de confiança, e quem o define?
- **Chamado ambíguo ou com dois pedidos:** um texto como "O sistema caiu e, aproveitando, queria um filtro novo" cabe em qual categoria?
- **Resposta errada:** se o solicitante disser que a resposta não resolveu, o chamado reabre?
- **Rastreabilidade:** como saber depois qual artigo da base sustentou cada resposta?

## As features

Cada feature cabe numa mudança curta do OpenSpec e pode ser construída sem infraestrutura real.

**Núcleo (caminho crítico, todos os times):**

| # | Feature | Critério de aceite essencial |
|---|---|---|
| F1 | Abrir e registrar chamado | O chamado tem id, solicitante, descrição, status e histórico de eventos |
| F2 | Classificar chamado | Atribui uma das quatro categorias, com a justificativa registrada no histórico |
| F3 | Responder pela base de conhecimento | Para atendimento coberto pela base: responde, registra a resposta e o artigo usado, e fecha o chamado |
| F4 | Encaminhar para humano | Quando não há resposta: mantém o chamado aberto, muda o status para "aguardando analista" e avisa o solicitante |

**Complementares (para quem terminar antes):**

| # | Feature | Critério de aceite essencial |
|---|---|---|
| F5 | Fila do analista | Lista os chamados abertos por categoria; o analista registra a resposta e fecha |
| F6 | Feedback do solicitante | O solicitante diz se a resposta resolveu; se não resolveu, o chamado reabre e vai para uma pessoa |
| F7 | Painel de indicadores | Mostra a taxa de autoatendimento e a distribuição por categoria |
| F8 | Alimentar a base | O analista transforma a resposta dada a um chamado num novo artigo da base |

A F8 mostra que o valor do agente cresce com a base de conhecimento, não com a interface.

## Massa de teste

O repositório traz uma base de seis artigos curtos (`docs/base-de-conhecimento/`) e esta massa (`docs/massa-de-teste.md`). A resposta esperada vira teste de aceite.

| Chamado | Esperado |
|---|---|
| "Esqueci minha senha do portal" | Atendimento, respondido e fechado |
| "Como configuro a VPN no Mac?" | Atendimento, respondido e fechado |
| "Preciso de acesso ao sistema financeiro" | Atendimento, encaminhado (exige aprovação humana) |
| "A tela de pedidos trava ao salvar desde a atualização" | Correção, encaminhado |
| "Queria exportar o relatório em Excel além do PDF" | Melhoria, encaminhado |
| "Precisamos de um portal para fornecedores" | Projeto, encaminhado |
| "Minha impressora não funciona" (sem artigo na base) | Atendimento, encaminhado |
| "O sistema caiu e queria um filtro novo" | Ambíguo: força a decisão do time |

## O que a revisão adversarial deve encontrar

Uma proposta que fecha sem decidir as lacunas acima não passa. O revisor procura, em especial: a regra de "conseguir responder" sem critério verificável; uma resposta registrada sem o artigo que a sustenta; o chamado de acesso a sistema respondido sem aprovação humana; e um cenário da massa de teste sem teste correspondente.
