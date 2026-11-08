# Modelo: política de uso de agentes

O que a empresa decide antes do piloto, com a segurança da informação, o encarregado de dados (DPO) e quem paga. Cada linha da tabela final tem uma resposta, um dono e uma data. Os fatos sobre o Claude vêm da documentação oficial e mudam: confira na data da decisão.

## Dados que podem ir ao modelo

Fatos para decidir:

- Nos planos comerciais (Team, Enterprise e API), a Anthropic não treina modelos com o código e os prompts enviados ao Claude Code, a menos que a empresa opte por um programa de parceria. A retenção padrão é de 30 dias.
- A retenção zero (ZDR) existe para contas qualificadas do Claude for Enterprise, habilitada pela equipe de contas da Anthropic, organização por organização.
- Nos planos pessoais (Free, Pro, Max e Ultra), o uso dos dados para treino é uma escolha da pessoa, e a retenção vai a 5 anos quando ela permite.
- Na máquina, o Claude Code guarda as conversas em texto puro em `~/.claude/projects/` por 30 dias, para retomar sessões; o prazo muda com `cleanupPeriodDays`.

Proposta do workshop: o trabalho da empresa roda na conta da empresa, nunca numa conta pessoal, e cada classe de dado tem uma regra.

| Classe de dado | Pode ir ao modelo? |
|---|---|
| Código e documentação da empresa | Sim, na conta da empresa |
| Dado pessoal de tripulante, passageiro, cliente, colaborador ou parceiro | Não, salvo decisão escrita com o DPO; nos testes e nos exemplos, dados fictícios |
| Segredo (chave, senha, token) | Nunca; regras `deny` no projeto e varredura no commit |
| Documento de cliente que o PO cola no Claude Desktop | Só o que a classificação do documento permite |

## Ferramentas aprovadas

Plugins, servidores MCP, skills de terceiros e extensões de navegador rodam com o acesso de quem usa. A empresa mantém uma lista do que está aprovado, com a versão fixada, e revisa uma mudança nela como uma dependência nova.

A política gerenciada aplica a lista sem depender de cada pessoa. Ela chega pelo console de administração do claude.ai, por MDM ou por um `managed-settings.json`, e nada nas configurações do usuário ou do projeto a sobrepõe. Exemplos de chaves: `deniedMcpServers` para recusar servidores MCP, `availableModels` para limitar os modelos, `permissions.disableBypassPermissionsMode` e `permissions.disableAutoMode` para desligar esses modos.

## Modos de permissão

Proposta do workshop: `auto` como padrão no dia a dia, `default` ou `plan` em repositório com dado sensível, `dontAsk` no CI com lista de ferramentas, e `bypassPermissions` desligado pela política, exceto em container isolado. Os modos estão no capítulo 7.

## Custo e capacidade

Fatos para decidir:

- Nos planos Team e Enterprise, cada pessoa usa uma cota do assento, que se renova numa janela de cinco horas e numa janela semanal e é dividida com o chat. Créditos de uso permitem passar da cota, com limite de gasto por organização, grupo ou pessoa.
- `/usage` mostra a cada pessoa o uso do plano e o que mais consumiu (skills, subagentes, servidores MCP, loops). Com créditos de uso ligados, o administrador vê no analytics da organização o gasto em créditos por pessoa e por modelo; o uso dentro da cota do assento não aparece em dólares.
- A documentação dá uma referência de implantações corporativas: cerca de US$ 13 por desenvolvedor por dia de uso e US$ 150 a 250 por mês, abaixo de US$ 30 por dia para 90% das pessoas. A própria documentação recomenda medir num grupo piloto antes de ampliar.

## As decisões

| Decisão | Resposta | Dono | Data |
|---|---|---|---|
| Plano e conta da empresa (Team, Enterprise ou API) | | | |
| Quem paga e o limite de gasto por time | | | |
| Classes de dado e o que pode ir ao modelo | | | |
| Retenção: padrão ou ZDR | | | |
| Lista de plugins, servidores MCP, skills e extensões aprovados | | | |
| Modo de permissão padrão e o que a política desliga | | | |
| Uso na nuvem e no CI, e com que credencial | | | |
| Quem revisa esta política, e quando | | | |
