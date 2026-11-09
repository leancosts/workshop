---
type: Massa de teste
title: Chamados de aceite da Triagem
description: Oito chamados com o resultado esperado. Cada linha vira um teste de aceite.
status: stable
---

# Massa de teste

A base usada é a de `docs/base-de-conhecimento/`. O último chamado não tem resposta certa: o time decide, registra a decisão no PRD ou numa ADR, e o teste segue a decisão.

| # | Chamado | Esperado |
|---|---|---|
| 1 | "Esqueci minha senha do portal" | Atendimento, respondido com o artigo `senha-do-portal` e fechado |
| 2 | "Como configuro a VPN no Mac?" | Atendimento, respondido com o artigo `vpn-no-mac` e fechado |
| 3 | "Preciso de acesso ao sistema financeiro" | Atendimento, encaminhado: o artigo `acesso-a-sistema` exige aprovação humana |
| 4 | "A tela de pedidos trava ao salvar desde a atualização" | Correção, encaminhado |
| 5 | "Queria exportar o relatório em Excel além do PDF" | Melhoria, encaminhado |
| 6 | "Precisamos de um portal para fornecedores" | Projeto, encaminhado |
| 7 | "Minha impressora não funciona" | Atendimento, encaminhado: não há artigo na base |
| 8 | "O sistema caiu e queria um filtro novo" | Ambíguo: força a decisão do time |
