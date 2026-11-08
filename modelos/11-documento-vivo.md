# Modelo: documento vivo de uma feature

O documento vivo diz o que a feature faz hoje e muda no mesmo commit que o código. É o que um agente lê antes de mexer na feature, depois do código. No formato da base (modelo 05d), o tipo é Feature e as fontes apontam para o código.

```markdown
---
type: Feature
title: <Nome da feature>
description: <Uma frase com o que ela faz para quem usa.>
status: stable
sources:
  - { id: codigo, resource: <caminho do módulo principal> }
  - { id: testes, resource: <caminho dos testes> }
generated: { by: claude-code/<modelo>, at: <AAAA-MM-DDThh:mm:ssZ> }
verified:
  - { by: human:<id>, at: <AAAA-MM-DDThh:mm:ssZ> }
---

# O que faz
<Para quem, e o resultado que entrega. Duas ou três frases.>

# Como funciona
<As regras que valem, cada uma com o arquivo que a aplica.>

# Onde fica
- Entrada: `<caminho>`
- Dados: `<tabelas ou arquivos>`
- Testes: `<caminho>`

# Limites conhecidos
<O que ela não faz, dito como o produto diz.>

# Decisões
- [<título da ADR>](../decisoes/<arquivo>.md)
```

Quando o código e o documento discordam, vale o código, e o documento é corrigido no mesmo commit da próxima mudança. Uma seção sem conteúdo é removida, não deixada vazia. No laboratório A do dia 3, bastam `type`, `title`, `description`, `status` e `sources`; `generated` e `verified` entram quando o documento é conferido.
