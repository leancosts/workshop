# Modelo: o agente no navegador

O agente pode abrir uma página, clicar, preencher um formulário e ler o console e a rede, para conferir uma tela depois de uma mudança ou reproduzir um bug. Há quatro formas comuns de dar um navegador ao Claude Code. Escolha pela página que precisa abrir e pelo login que ela pede.

## As quatro opções

| Opção | Como liga | Que navegador usa | Bom para |
|---|---|---|---|
| Claude in Chrome | Extensão do Chrome ou do Edge e `claude --chrome` (ou `/chrome`) | O da pessoa, numa janela visível, com os logins dela | Ver junto uma tela local, ler o console, usar uma aplicação em que a pessoa já está logada |
| Playwright MCP | `claude mcp add playwright npx @playwright/mcp@latest` | Um navegador próprio, com perfil persistente por padrão (logins salvos em disco) ou isolado (`--isolated`); visível por padrão, `--headless` para esconder | Loops longos que precisam manter o estado da página |
| Playwright CLI | `npm install -g @playwright/cli@latest` e `playwright-cli install --skills` | Um navegador próprio, comandado por linha de comando | O dia a dia do agente de código: abrir, tirar um snapshot, clicar pela referência e conferir |
| agent-browser | `npm install -g agent-browser` e `agent-browser install` | Chrome for Testing, sem janela por padrão (`--headed` para ver), com sessões isoladas (`--session`) | O mesmo uso da Playwright CLI; traz a própria skill (`npx skills add vercel-labs/agent-browser`, que chama `agent-browser skills get core`) |

As três últimas leem a página pela árvore de acessibilidade: o agente pede um snapshot, recebe os elementos com uma referência (`e15`, `@e2`) e age por ela, sem depender de imagem. O README do Playwright MCP recomenda a CLI com skills para agentes de código, porque ela não carrega no contexto os esquemas das ferramentas nem a árvore inteira da página. O agent-browser, da Vercel Labs, tem licença Apache-2.0.

Requisitos do Claude in Chrome: plano direto da Anthropic (Pro, Max, Ultra, Team ou Enterprise), login com `/login` e um navegador Chromium. Não funciona no WSL nem por Amazon Bedrock, Google Cloud ou Microsoft Foundry. Com a opção Enabled by default (em `/chrome`), as ferramentas do navegador ficam sempre carregadas e o contexto cresce; sem ela, ligue com `--chrome` só quando precisar.

## Como escolher

Proposta do workshop:

| Situação | Opção |
|---|---|
| A pessoa quer ver a tela local junto com o agente | Claude in Chrome |
| O agente confere sozinho a tela depois de cada mudança, num loop ou numa sessão na nuvem | Playwright CLI ou agent-browser, sem janela, com perfil isolado. Na nuvem, o navegador precisa estar instalado ou ser baixado pela rede do ambiente |
| Uma exploração longa, em que o estado da página precisa sobreviver entre os passos | Playwright MCP |
| A página está em produção e a conta pode escrever | Nenhuma: o agente lê produção por um acesso só de leitura (capítulo 9) |

## Da conferência ao teste versionado

Uma conferência no navegador vale para aquela execução. O que precisa continuar valendo vira um teste de navegador versionado, que falha antes da mudança e passa depois, e entra nos portões.

No caso, a opção preferida para o agente abrir e conferir telas é o Claude in Chrome. O agent-browser roda em duas conferências: o `npm run route:smoke` percorre todas as rotas da aplicação rodando, no desktop e no celular, e um workflow de QA reconfere cada achado corrigido, com console e requisições com falha. O README do repositório pede um teste num navegador visível em toda mudança de interface. A prova que fica é feita por testes no navegador (Chromium, pela raia de testes) e pelo `npm run ui:audit`, um script em Playwright que mede a tela em várias larguras e tamanhos de texto, no tema claro e escuro, e que, fora dos fluxos marcados para escrever, aborta toda requisição que não seja leitura. A regra do caso é não escrever um script novo para uma medida que esse script já faz.

## Prompts

Conferir uma mudança e transformar a conferência em teste:

```text
Abra localhost:3000/<página> com a conta de teste. Preencha o formulário com dados inválidos
e confira se cada mensagem de erro aparece ao lado do campo. Leia o console
e as requisições: qualquer erro entra no relatório, com a mensagem. Depois,
escreva um teste de navegador que reproduza essa conferência e rode-o.
```

Reproduzir um bug antes de corrigir:

```text
Siga os passos da issue <N> em localhost:3000 com a conta de teste. Se o
bug aparecer, registre na issue o que viu, o erro do console e a requisição
que falhou, sem cabeçalhos, cookies ou tokens. Escreva o teste que falha pelo mesmo motivo antes de mexer no
código.
```

## Cuidados

- **O Claude in Chrome usa os logins da pessoa.** Ele alcança tudo em que ela está logada. As permissões por site ficam na extensão; o agente para e pede ajuda em login e CAPTCHA. Um GIF gravado mostra tudo o que está visível, dados da conta inclusive.
- **Uma página é conteúdo de terceiros.** Um texto na página pode tentar dar instruções ao agente. Use conta de teste e perfil isolado, e não dê ao agente no navegador uma conta que pode escrever em produção.
- **Não é uma barreira de segurança.** O README do Playwright MCP diz isso dele mesmo, e diz o mesmo das listas de origens permitidas e bloqueadas.
- **Estado salvo é segredo.** Um arquivo de estado do agent-browser guarda tokens de sessão em texto puro, a menos que uma chave de criptografia seja definida. Ele não vai para o repositório: entra no `.gitignore` e é apagado depois do uso.
