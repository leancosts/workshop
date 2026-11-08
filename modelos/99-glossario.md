# Glossário

Os termos do método, com o significado que este livro usa. Quando dois nomes parecem servir, use o da primeira coluna.

| Termo | Significa | Evite |
|---|---|---|
| demanda | O pedido como chega, de qualquer origem, antes da triagem: dúvida, bug, melhoria ou projeto | ticket, chamado (como nome) |
| triagem | A classificação de cada demanda por um agente, com um comentário no item; uma pessoa confere (modelo 24) | |
| intenção | O documento de sete seções do PO, sem solução. No caso, fica no corpo do épico; na empresa, o PO a entrega como PRD | "PRD" sem dizer que é a intenção |
| PRD | A intenção entregue pelo PO, com anexos (mockup, perguntas técnicas, fontes) fora das sete seções | um documento de solução |
| harness | A camada em volta do modelo que dá ferramentas, contexto, permissões e hooks e repete o loop do agente; o Claude Code é um harness | |
| host | Onde a sessão roda: terminal, Desktop, editor, nuvem, pipeline de CI, tarefa agendada | |
| tarefa agendada | Um prompt que roda sozinho por horário, chamada de API ou evento; na nuvem, o Claude Code a chamava de routine | rotina, routine (como nome) |
| base corporativa, base local | As duas camadas da base de conhecimento: uma para a empresa, uma por repositório | |
| épico | A issue que agrupa as issues de uma intenção | |
| issue | A unidade de trabalho, no padrão | ticket, card, história |
| backlog | A fila única de issues, ordenada por critérios escritos | listas paralelas |
| spec | O quê e por quê da mudança, as opções pesadas, a escolhida e o que fica fora | |
| plano | Os arquivos, o teste que falha em cada passo, os critérios de aceite e a ordem | |
| design técnico | A parte da spec que descreve como a escolhida será construída | desenho técnico |
| lote | O conjunto de issues entregues numa execução; cada unidade entra na branch do lote quando é aprovada, e o portão completo roda uma vez, no fim | sprint, batch |
| unidade | Uma issue, ou uma cadeia de issues que tocam os mesmos arquivos e rodam uma depois da outra, dentro de um lote | teste de unidade (outra coisa) |
| onda | Sessões de `/deliver` que rodam em paralelo porque não tocam os mesmos arquivos; a onda seguinte vem depois | |
| via rápida | Uma mudança pequena e certa feita numa sessão e num worktree, sem spec e plano; mantém o teste que falha antes, a revisão do diff por outro modelo e o OK. Para e vai para o `/deliver` se aparece um gatilho de spec, outra área, ou se não fecha no dia | fast lane; no caso, o rótulo `quick-win` |
| grau de automação | Manual (uma pessoa produz a decisão), parcial (o agente produz o artefato e uma pessoa aprova ou edita) ou automático (o agente faz e uma máquina confere), por atividade do SDLC | nível, que fica para o questionário de maturidade |
| follow-up | Trabalho encontrado durante um lote, fora do critério de aceite; vira issue | anotação solta |
| orquestrador | O agente que conduz um lote e reúne os resultados dos outros | |
| subagente | Um agente com contexto e ferramentas próprios, chamado por outro, que devolve só o resultado | |
| modelo (do Claude) | Uma das quatro famílias do Claude Code (Haiku, Sonnet, Opus, Fable); escolhido por sessão, subagente ou etapa (capítulo 7) | (não confundir com os modelos copiáveis do apêndice) |
| esforço | Quanto o modelo pensa antes de agir: `low`, `medium`, `high`, `xhigh`, `max` | effort (na primeira vez, entre parênteses) |
| contexto | Tudo o que o modelo lê numa sessão: instruções, arquivos, resultados de ferramentas e conversa | janela, sozinho |
| teleport | Trazer uma sessão da nuvem para o terminal local, com a branch e a conversa | |
| Remote Control | Conduzir uma sessão local pelo app no celular ou pela web | |
| worktree | Uma cópia de trabalho do repositório, numa branch própria, para um agente | |
| revisão adversarial | Revisão de spec, plano ou diff por outro modelo, instruído a bloquear quando tem dúvida | revisão por outro modelo (como nome) |
| portão | Verificação automática que recusa a mudança | gate |
| guardrail | O que o agente nunca faz num repositório, escrito como regra e, quando possível, hook ou teste | |
| catraca | Piso que só sobe, ou lista de legado que só diminui | |
| raia de teste | Um conjunto de testes que roda junto: unidade, banco, navegador | raia, sozinho |
| raia de manutenção | Um tema de loop com nota: segurança, pacotes, interface, API, documentação | raia, sozinho |
| loop de manutenção | Execução agendada que mede a nota de uma raia, corrige o mecânico e abre issue para o resto | `/loop` (o comando que repete um prompt) |
| horizonte | P0 agora, P1 próximo, P2 depois, P3 backlog | prioridade P0 |
| gravidade | O nível de um achado de auditoria (P0 a P3 na auditoria de tela) | |
| sondagem (`probe`) | Issue que entrega evidência, não código | |
| estrutural (`structural`) | Issue cuja mudança ninguém percebe; prepara ou limpa a base | |
| melhoria (`enhancement`) | Issue que torna melhor algo que já funciona | |
| documento vivo | Documento da base que muda no mesmo commit que o código | doc da feature, doc do módulo |
| registro datado | Spec, plano, ADR, changelog: o que se pretendia numa data; nunca é reescrito | |
| ADR | Registro de uma decisão que uma mudança futura poderia desfazer | |
| bundle OKF | A pasta `docs/` no formato Open Knowledge Format: Markdown com frontmatter, `index.md` e `log.md` | |
| frontmatter | O bloco de metadados no topo de um documento: tipo, fontes, quem gerou, quem verificou, status | |
| branch principal | A branch que vai para produção; no workshop, a branch de desenvolvimento da empresa | |
| lead time | Do pedido à mudança em produção | |
| pull request (PR) | O pedido para juntar uma branch à branch principal, com a descrição e a evidência que a pessoa lê antes do OK | |
| diff | A lista exata das linhas que uma mudança acrescenta, altera ou apaga | |
| lint | A verificação automática de estilo e de erros comuns no código, sem executá-lo | |
| hook | Um comando que roda sozinho antes ou depois de uma ação do agente, de um commit ou de um push | |
| skill | Um procedimento do time em `SKILL.md`, que o agente segue quando é chamado por `/nome` ou quando a descrição se aplica | |
| MCP | Model Context Protocol: o padrão pelo qual o agente lê ou usa um sistema externo, como a base de conhecimento, as issues ou os logs | |
| CI | Integração contínua: os portões que rodam numa máquina a cada push ou PR | |
| design system | Os tokens, os componentes e as regras de uso da interface, escritos uma vez e seguidos por toda tela | |
