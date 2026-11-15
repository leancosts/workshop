---
description: Gera a base de conhecimento deste repositório legado, de uma vez
argument-hint: [opcional: uma pasta, uma tela ou uma tabela onde o time vai mexer]
---

Gere a base de conhecimento deste repositório, do começo ao fim, sem parar para perguntar.
Onde o time vai mexer (pode vir vazio): $ARGUMENTS

Se veio vazio, não pergunte: leia o repositório inteiro por alto, liste no inventário as áreas que encontrou (o nome, a pasta e o que faz, uma linha cada) e as features do sistema na granularidade que couber; num repositório grande, uma linha por módulo. O detalhe de uma área entra no dia da mudança, pelo `/pedido`. Se veio preenchido, leia essa parte em detalhe e o resto por alto.

## Antes de escrever

1. Se a branch atual é a principal do repositório (`main`, `master`, `develop`, `trunk`), crie a branch `base-de-conhecimento` e trabalhe nela.
2. Faça um commit só com os arquivos do kit (`.claude/`, `docs/`, `scripts/` e `openspec/`), se eles ainda não estão num commit.
3. Em `openspec/config.yaml`, troque a linha `Stack:` pelo que você ler nos manifestos do repositório.
4. Confira que `.claude/settings.json` tem o hook `PreToolUse` com o matcher `Edit|Write|MultiEdit|Bash`, o comando `node` e o argumento `${CLAUDE_PROJECT_DIR}/scripts/guard-status.mjs`. Se o repositório já tinha esse arquivo sem o hook, acrescente só o hook ao que existe e diga o que mudou.

## Regras para todos os documentos

- Só leitura no sistema: não altere código, esquema nem configuração. Você só cria e edita os documentos abaixo, e cada commit leva só esses documentos (nunca um arquivo que um comando de instalação ou de build tenha alterado).
- Tudo que você escrever fora do commit (rascunhos, scripts, saídas) vai em `.tmp/`, dentro do repositório. Crie `.tmp/.gitignore` com a linha `*`, para nada disso entrar no commit e o `.gitignore` do time não mudar. Nenhum arquivo fora do repositório (`../`).
- Nos documentos, toda afirmação cita o arquivo e a função, a tabela ou a rota, ou o comando que você rodou. Não escreva número de linha neles: a linha muda a cada commit. Na conversa, ao responder, cite a linha. O que você deduziu sem ler leva a palavra "hipótese".
- Sem contagens ("8 testes", "9 migrações", "seis arquivos") em nenhum documento: a próxima mudança as desatualiza e elas conflitam no merge. A exceção é a contagem de cada variante, nos padrões e em "Decisões para o time", que é o conteúdo deles.
- Toda data escrita no corpo de um documento vem da saída de `date`, lida na hora, nunca de cabeça.
- Um comando que você não rodou, inclusive o de instalar, não entra no `CLAUDE.md` nem no `README.md`.
- Quando o código faz uma coisa e um comentário ou um documento antigo diz outra, não escolha: a divergência vira uma pergunta em "Decisões para o time" do `ARCHITECTURE.md`, com as duas versões, e nada muda até o time decidir.
- Um documento antigo que já existia em `docs/` ganha o frontmatter com `status: deprecated`, e o conteúdo dele fica como está.
- O que o código não responde vira uma pergunta numerada na seção "Decisões para o time", no fim do documento. Nunca escreva um palpite como fato, e nunca escolha entre duas variantes: conte quantas vezes cada uma aparece.
- Arquivo que já existe: não apague o conteúdo. Acrescente o que falta e liste o que mudou. No `README.md` que já existe, uma instrução que o código desmente não fica no arquivo: ela vai para o inventário, na parte da documentação antiga, com a data.
- O banco do `docker-compose.yml` do repositório é local, não compartilhado: suba-o, rode as migrações e a carga inicial e teste o comando que sobe o sistema, para o `README.md` e o `CLAUDE.md` trazerem esses comandos. Para saber se um container está no ar, use `docker ps --filter name=<nome>`, nunca uma lista cortada.
- Se você subir um processo para testar um comando, guarde o PID do que você abriu e encerre só esse, pelo PID. Nunca encerre processos pelo nome (`taskkill /IM`, `pkill`, `killall`).
- Você nunca altera um banco de dados compartilhado e não lê linhas das tabelas dele. Se o `.env` tem as variáveis `BANCO_` (o time só de banco, depois do `/banco`), conecte ao banco de homologação como o `/banco` conectou, só com `SELECT` no catálogo, e conte no banco inteiro as variantes de cada padrão (prefixos de nome, tipos de coluna, onde há trigger): os arquivos de `banco/` são só a parte que o time vai mudar. Sem essas variáveis, o que você precisar saber do banco, peça ao time.
- Senha, token e chave ficam no arquivo `.env`, fora do commit, e nunca aparecem na conversa, num documento nem num comando escrito na resposta. Você não mostra o conteúdo do `.env`. Se o `.gitignore` não tem a linha `.env`, acrescente-a.
- Todo documento, menos o CLAUDE.md e o README.md, começa com o frontmatter de `docs/modelos/05d-documento-okf.md`: `status: draft`, e `sources` com os arquivos lidos. Quem escreveu e quando é o que o git registra: não acrescente campos de autoria. O status fica só no frontmatter: não o escreva no corpo do documento. Só uma pessoa muda o status para `stable`: você nunca escreve `status: stable`.
- Os formatos estão em `docs/modelos/`. Não altere essa pasta.

## Primeiro, o que o time confere hoje (um commit por item)

1. `docs/inventario.md` (type: Pesquisa): a stack e as versões, lidas dos manifestos; as entradas (rotas, jobs, filas, telas); as áreas ou módulos; as features, numa tabela (a feature, por onde entra, os arquivos, objetos e tabelas que a implementam, os testes que a cobrem); o banco (tabelas, migrações, procedures, triggers); os comandos de instalar, build, testes e lint, cada um rodado, com o resultado; os testes que existem e o que não cobrem; a documentação antiga, com a data, e as instruções do `README.md` que o código desmente.
2. `ARCHITECTURE.md` (modelo 05b, type: Arquitetura) e `README.md` (o que o sistema faz, instalar, rodar e testar, só com comandos que passaram).
3. `docs/padroes/modelagem-de-banco.md` (modelo 32): para cada tema, o que a maioria das tabelas faz, com três exemplos, o arquivo de cada um e a contagem.
4. `docs/padroes/escrita-de-codigo.md` (modelo 33): camadas, nomes, tratamento de erro, log e acesso ao banco, com um arquivo de referência por camada. Num repositório de código de banco, o padrão descreve o SQL procedural: nomes, transação, erro e SQL dinâmico. Feche com a seção "Testes" (modelo 34): o comando que roda tudo, o que roda um arquivo só, onde os testes ficam e quais pastas não têm teste.
5. `CLAUDE.md` (modelo 05), em no máximo 60 linhas: os comandos que passaram e os caminhos, sem contagens; uma linha por arquivo da base, dizendo quando ler; "toda tabela nova segue docs/padroes/modelagem-de-banco.md"; "todo código novo segue docs/padroes/escrita-de-codigo.md"; "nos documentos, cite o arquivo e a função, a tabela ou a rota, sem número de linha; a linha fica só na conversa" (no lugar do "citar arquivo e linha" do modelo); "um documento com status: draft é hipótese: confira no código"; "um documento com status: stable não é editado pelo agente sem o OK do time: ele propõe o trecho na resposta; com o OK, aplica o trecho no /fechar, num commit próprio"; "a base muda no mesmo commit que o código"; "só uma pessoa muda o status de um documento para stable, no editor; o agente não muda, nem a pedido do time"; "senha, token e chave ficam no .env, fora do commit e fora da conversa; o agente não mostra o conteúdo do .env"; "ao construir, uma task por vez: o teste antes do código, a falha mostrada antes de o código existir, os testes da área depois de cada task e um commit por task; se um teste que passava falhar, pare e pergunte"; e, só quando o repositório é de código de banco, "o agente só lê o catálogo do banco de homologação, com SELECT; não roda DDL, não altera dados e não lê linhas de tabela: a mudança é um script versionado, o teste é um script que termina em ROLLBACK, e o time roda os dois e cola a saída".
"Código de banco" quer dizer que o sistema do time é PL/SQL, T-SQL ou procedures num banco compartilhado. Uma aplicação com migrações e um banco local (o do `docker-compose.yml`, por exemplo) não é: nela você sobe o banco local, roda as migrações e os testes você mesmo.
6. Atualize `docs/index.md` e os índices das pastas, acrescente uma linha em `docs/log.md` e rode `node scripts/check-docs.mjs` até passar. Faça o commit e escreva: "A base mínima está pronta."

## Depois, o que fica em rascunho

7. `VISION.md` (modelo 05a, type: Visão): só o que o código e a documentação antiga sustentam. Cada princípio entra como pergunta para o PO. `DESIGN.md` (modelo 05f, type: Design), só se o sistema tem telas.
8. `docs/adrs/` (modelo 12): no máximo cinco decisões que o histórico sustenta (mensagens de commit, README antigo, comentários), com Status: proposta e a origem em `sources`. `docs/prds/` fica só com o índice: o primeiro PRD é o pedido do dia da mudança.
9. Acrescente ao `CLAUDE.md` uma linha para cada documento novo, atualize os índices e rode a checagem de novo.

## A resposta final

1. Os arquivos criados, uma linha cada.
2. Quantas "Decisões para o time" cada documento tem, e as três que mais pesam, com a sua recomendação.
3. O que você não conseguiu ler ou rodar, e por quê.
4. O próximo passo, nesta frase: "Digite /conferir: eu faço as perguntas do ARCHITECTURE.md, uma por vez."
