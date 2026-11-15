---
description: Time só de banco. Conecta ao banco de homologação, só para leitura, mapeia e traz para arquivos o código que o time vai mudar
argument-hint: [opcional: o nome de um objeto que o time vai mudar. Exemplo: PKG_COBRANCA]
---

O que o time informou (pode vir vazio): $ARGUMENTS

Este time trabalha só no banco de dados (procedures, functions, packages, triggers). O banco pode ser de qualquer fabricante (Oracle, SQL Server, PostgreSQL, MySQL, DB2 ou outro), grande, pouco organizado ou de um ERP, com milhares de objetos que não são do time. O time não precisa saber em que schema as coisas estão nem como o banco é organizado: você se conecta ao banco de homologação, lê o catálogo e descobre.

## Regras

- Só leitura. Você roda apenas `SELECT` no catálogo do banco e as funções que devolvem a definição de um objeto. Nunca DDL, nunca `INSERT`, `UPDATE`, `DELETE` ou `MERGE`, nunca uma procedure do sistema que grave algo. A única exceção é ajustar o formato da própria extração (no Oracle, `DBMS_METADATA.SET_TRANSFORM_PARAM`). Onde o banco permite, abra a sessão ou a transação em modo de leitura.
- Nenhuma linha de tabela de negócio sai do banco: só o catálogo e a estrutura.
- Só o banco de homologação ou de desenvolvimento. Se o endereço parecer de produção, pare e pergunte.
- A senha fica no arquivo `.env` e nunca aparece na conversa, num comando escrito na resposta, num arquivo de `banco/` nem num commit. Nunca mostre o conteúdo do `.env`, nem com a senha mascarada: o programa que conecta lê as variáveis. Se o time colar uma senha na conversa, diga que ela ficou exposta, peça que a troquem no banco e que a ponham no `.env`.
- Para escrever um programa em `.tmp/`, use a ferramenta de escrita de arquivos, não um heredoc do terminal.
- O banco inteiro nunca é copiado: só os objetos de partida e o que está em volta deles. O resto entra quando uma mudança pedir.
- O que você escrever para se conectar e consultar fica em `.tmp/` (crie `.tmp/.gitignore` com a linha `*`), fora do commit.

## 1. A conexão

1. Confira que o `.gitignore` do repositório tem a linha `.env`; se não tem, acrescente-a e diga isso.
2. Confira, sem mostrar os valores, se o `.env` existe e tem as variáveis `BANCO_TIPO`, `BANCO_SERVIDOR`, `BANCO_PORTA`, `BANCO_NOME`, `BANCO_USUARIO` e `BANCO_SENHA` preenchidas. Se falta algo, peça ao time, nestas palavras, e pare: "Copie o arquivo `.env.banco.example` para `.env`, nesta pasta, e preencha no editor a conexão do banco de homologação: o tipo do banco, o servidor, a porta, o nome do banco ou do serviço, o usuário e a senha. De preferência, um usuário só de leitura. Não escreva a senha aqui na conversa. Depois escreva: pronto."
3. Com o `.env`, conecte com o que a máquina já tem (`sqlplus`, `sql`, `sqlcmd`, `psql`, `mysql`). Se não houver cliente, instale um driver em `.tmp/` (por exemplo, `npm install --prefix .tmp oracledb`, `mssql`, `pg` ou `mysql2`) e escreva lá o que precisar.
4. Se a conexão falhar, diga ao time, em uma linha, o que a mensagem de erro significa e o que conferir (o endereço, a rede ou a VPN, o usuário). Não tente adivinhar outra senha nem outro servidor.

## 2. O mapa

Leia o catálogo e monte o mapa:

1. Os schemas (ou bancos, ou owners) que não são do próprio sistema de banco, com a quantidade de objetos de código de cada um.
2. Os 40 objetos de código alterados por último, com o schema, o tipo e a data: num ERP, é onde costumam estar as customizações do time.

Se o time informou um nome, ele é o ponto de partida. Se não, mostre o mapa em até quinze linhas e faça uma pergunta só, com a sua recomendação: "Qual destes objetos o time vai mudar?" O time pode responder com o nome de um objeto ou com as palavras do negócio ("a cobrança"): procure no catálogo e confirme o que achou. Se o time ainda não sabe, use os dez alterados por último. Não recomende trazer um schema inteiro.

## 3. O export

1. Traga a definição de cada objeto de partida, do que ele usa diretamente (as tabelas que uma procedure lê ou grava, por exemplo) e, para cada tabela que entrou, dos triggers, índices, chaves estrangeiras e permissões dela: um trigger dispara na gravação que a procedure faz. Um nível só. Deixe de fora os objetos do próprio sistema de banco.
2. Grave do cliente direto para o disco, sem passar o texto pela conversa: um objeto por arquivo, em `banco/<schema>/<tipo>/<objeto>.sql`, com o schema e o objeto em maiúsculas ou minúsculas como estão no catálogo, e com estes nomes de tipo, sempre: `table`, `foreign_key`, `index`, `view`, `type`, `sequence`, `synonym`, `package`, `procedure`, `function`, `trigger`, `job` e `grant`. A especificação e o corpo de um package ficam no mesmo arquivo. Sem atributos de armazenamento e sem o valor atual de uma sequence, que mudam de ambiente para ambiente.
3. Grave `banco/dependencias.csv`: quem usa o quê, lido do catálogo, inclusive os objetos que não foram exportados.
4. Confira e mostre ao time, sempre, uma tabela com três colunas: o schema e o tipo, quantos objetos foram selecionados e quantos arquivos saíram. Mostre a tabela mesmo quando tudo bate, e antes de qualquer outro aviso. Uma diferença é um objeto que o usuário não alcança: diga qual.
5. Procure senha, token e endereço nos arquivos que saíram. Se achar, pare antes de qualquer commit e mostre só o arquivo, a linha e o nome da constante ou da coluna, nunca o valor. Depois que o time decidir, troque por um marcador só o que o time mandou trocar.
6. Escreva `banco/README.md`, curto: o tipo e a versão do banco, de que ambiente veio, a data (da saída de `date`), o ponto de partida e como repetir o export. Sem o endereço do servidor e sem o usuário.
7. Faça um commit com `banco/`, as pastas do kit e o `.env.banco.example`. Nunca com o `.env` nem com `.tmp/`.
8. Diga, em linguagem simples, o que ficou de fora e o time precisa saber, só com o que você leu nos arquivos: o SQL dinâmico, a ação de um job e as chamadas a outros sistemas que os objetos exportados de fato têm, e os objetos que ficaram só no arquivo de dependências. Não liste um risco que os arquivos não mostram.
9. Diga o próximo passo: "Digite /base."

## Sem conexão

Quando a empresa não permite a conexão, você escreve e o time roda: um script de export para o cliente que o time usa, com o mesmo resultado (os mesmos arquivos, as dependências e a contagem), que roda sem pedir valor nenhum. Diga o comando com um exemplo preenchido, peça a saída inteira e siga do item 4 do export.
