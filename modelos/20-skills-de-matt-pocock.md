# Modelo: skills de Matt Pocock: grill-me, research, wayfinder e to-spec

O repositório `mattpocock/skills` (licença MIT) publica skills pequenas, feitas para serem adaptadas. Quatro delas cobrem o começo de uma mudança: entender o pedido, pesquisar os fatos, mapear um trabalho grande e transformar a conversa numa spec.

```bash
claude plugin install mattpocock-skills@claude-plugins-official
```

O plugin se atualiza sozinho e não deixa arquivos no repositório. Para editar uma skill, instale por `npx skills@latest add mattpocock/skills`, que copia os arquivos para o projeto. Depois, uma vez por repositório, `/setup-matt-pocock-skills` registra o rastreador de issues (GitHub, GitLab, arquivos locais ou outro descrito em texto), os rótulos de triagem (só com a skill `triage` instalada) e onde ficam os documentos. Ele escreve uma seção `## Agent skills` no `CLAUDE.md` e os arquivos em `docs/agents/`. O `/grill-me`, o `/wayfinder` e o `/to-spec` só rodam quando alguém os chama pela barra: o agente não os usa por conta própria, nem dentro de um `/loop` agendado (modelo 18). O `/research` não tem essa trava: o agente também o chama quando a pessoa pede uma pesquisa.

{{DIAGRAMA:skills-fluxo}}

## /grill-me: a entrevista

**O que faz.** Entrevista a pessoa até os dois chegarem a um entendimento comum. Ela chama a skill `grilling`, que organiza as decisões como uma árvore: cada decisão abre as que dependem dela. A cada rodada, o agente pergunta tudo o que já pode ser perguntado, com as perguntas numeradas e uma resposta recomendada em cada uma, escrita para que um "sim" aceite a recomendação. A pergunta que depende de outra ainda aberta fica para a rodada seguinte.

**Fato é com o agente; decisão é com a pessoa.** O que se descobre no código ou nas ferramentas, o agente busca sozinho, num subagente, sem perguntar. O que é escolha, ele pergunta e espera. A entrevista termina quando não sobra decisão em aberto, e o agente só age depois que a pessoa confirma.

**Quando usar.** Sempre que um pedido vago vira trabalho: antes de escrever a intenção ou uma spec. O README recomenda o `/grill-me` para o que não é código, como o pedido do PO, e o `/grill-with-docs` para uma mudança no código.

**No método.** Etapa 1. No dia 3, o PO passa a demanda pelo `/grill-me` no Claude Desktop; as perguntas que ele não soube responder mostram o que faltava no pedido (modelo 07), e as técnicas vão em lista para o arquiteto (modelo 01). A variante `/grill-with-docs` faz a mesma entrevista e atualiza o glossário e os ADRs do repositório.

## /research: a pesquisa com fonte

**O que faz.** Abre um agente em segundo plano, com o contexto limpo, e a sessão principal continua enquanto ele lê. O agente investiga a pergunta em fontes primárias (documentação oficial, código-fonte, especificações, a API do próprio fornecedor), e não em resumos de terceiros, seguindo cada afirmação até a fonte que responde por ela. O resultado é um único arquivo Markdown, com a fonte de cada afirmação, gravado onde o repositório já guarda notas desse tipo; sem convenção, ele escolhe um lugar e diz qual.

**Quando usar.** Quando a spec depende de um fato que está fora do repositório: o limite de uma API, o comportamento de uma biblioteca numa versão, uma norma, um preço, o que um fornecedor garante. O que está no código e na base de conhecimento o agente lê direto, ou no subagente do `/grill-me`.

**No método.** Etapa 2, antes da spec. Proposta do workshop: a nota fica em `docs/pesquisas/`, com `type: Pesquisa`, `generated` e as fontes em `sources`; a spec cita a nota nas suas `sources`, e a revisão adversarial confere a nota junto com a spec. O capítulo 4 ("Quem pesquisa é o agente") explica por que a pesquisa não vai colada no prompt.

## /wayfinder: o mapa de um trabalho grande

**O que faz.** Planeja um trabalho grande demais para uma sessão do agente e ainda sem caminho claro. Ele planeja e não constrói: cada ticket resolve uma decisão, e o mapa termina quando não falta nada a decidir.

1. **Nomeia o destino**, com uma entrevista: uma spec, uma decisão ou uma mudança. O destino define o escopo.
2. **Mapeia a fronteira**, com outra entrevista, em largura. Se o caminho já está claro e o trabalho cabe numa sessão, a skill para e pergunta como seguir: não há mapa.
3. **Cria o mapa no rastreador**: uma issue com o rótulo `wayfinder:map`, com o destino, as notas, "Decisões até aqui", "Ainda não especificado" e "Fora de escopo".
4. **Cria os tickets** como issues filhas, cada um uma pergunta do tamanho de uma sessão, e liga os bloqueios pelo vínculo nativo do rastreador.

| Tipo de ticket | Quem resolve | Para quê |
|---|---|---|
| Pesquisa | O agente sozinho, num subagente | Achar um fato em documentação, API ou base de conhecimento |
| Protótipo | Com a pessoa | Algo rápido e concreto para reagir: um esboço, um stub, uma tela |
| Entrevista | Com a pessoa | A conversa; é o tipo padrão |
| Tarefa | O agente ou a pessoa | Trabalho que destrava uma decisão, como pedir um acesso |

**Como se anda no mapa.** A fronteira são os tickets abertos, desbloqueados e sem responsável. Uma sessão pega o primeiro, atribui-o a si antes de começar, resolve só esse (pesquisas podem correr em paralelo), registra a resposta num comentário, fecha o ticket e acrescenta uma linha ao mapa. O que ainda não dá para perguntar com precisão fica em "Ainda não especificado" e vira ticket quando a fronteira chega lá; o que fica além do destino vai para "Fora de escopo" e só volta se o destino mudar, como um esforço novo.

**Quando usar.** Um épico novo, uma migração grande, uma decisão com muitas dependências, qualquer trabalho em que a pergunta certa ainda não está clara.

**Antes de usar.** O mapa depende de tickets pai e filho e de bloqueio nativo no rastreador. No Azure DevOps, que o setup trata como "outro", o time descreve essas operações. Ao abrir o mapa, cada ticket de pesquisa grava o que achou numa branch `research/<nome>`, enviada sem pull request: confira com a regra de branches do time.

## /to-spec: a conversa vira spec

**O que faz.** Sem nova entrevista, junta o que foi conversado e o que o agente leu do código numa spec, publicada no rastreador com o rótulo `ready-for-agent`. Antes de escrever, propõe onde a feature será testada: prefere os pontos de teste que já existem, os mais altos possíveis, idealmente um só, e confirma com a pessoa. Usa o glossário do repositório e respeita os ADRs da área.

**As seções.** Problema e solução do ponto de vista de quem usa; uma lista longa de histórias de usuário; decisões de implementação (módulos, interfaces, contratos, sem caminho de arquivo nem trecho de código); decisões de teste; fora de escopo; notas.

**Quando usar.** Logo depois do `/grill-me`, enquanto a conversa ainda está no contexto, ou, no fim de um mapa do `/wayfinder`, numa sessão que carregou o mapa e os tickets fechados. Depois, `/to-tickets` divide a spec em fatias verticais com os bloqueios, e `/implement` constrói e faz commit na branch atual.

## Como combinar com o método

Proposta do workshop:

- **Uma forma de spec por time.** O `/to-spec` publica a spec no rastreador, com histórias de usuário e sem as opções consideradas; o modelo 03 fica em `docs/specs/`, com opções, escolha, critérios de aceite e riscos. Escolha um formato e um lugar. Para mudar o template da skill, instale-a como arquivo editável. Duas formas de spec no mesmo repositório deixam o agente sem regra para escolher.
- **A spec passa pela revisão adversarial** de outro modelo (modelo 10) antes do plano. O `/to-spec` e o `/to-tickets` aplicam o rótulo `ready-for-agent` sozinhos; troque o rótulo no template, ou tire-o à mão até o veredito.
- **Os tickets não substituem o plano.** O `/to-tickets` divide o trabalho, mas o plano (modelo 04) e a revisão dele continuam antes da construção, e a construção roda numa branch própria, não na principal.
- **Um mapa do `/wayfinder` é um épico de decisões.** Os tickets dele não levam rótulo de triagem nem entram na fila de construção; a fila recebe as issues que nascem da spec no fim do mapa.
