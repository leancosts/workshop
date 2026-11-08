# Modelo: plano

Escrito pelo agente, lido pelo time e submetido à revisão adversarial (modelo 10) antes da construção. Cada passo tem um teste que falha antes da mudança. Fica em `docs/planos/`, como registro datado.

```markdown
---
type: Plano
title: <título>
description: <Uma frase.>
status: draft
sources:
  - { id: spec, resource: <caminho da spec> }
---

# Plano: <título>

Spec: <link> · Issue: <link>

## Arquivos
- `<caminho>`: <o que muda>

## Passos
1. Teste `<arquivo de teste>`: <o que ele afirma>. Deve falhar porque <motivo>.
   Mudança: <a menor mudança que o faz passar>.
2. <...>

## Critérios de aceite
- [ ] <copiados da spec, cada um ligado a um passo>

## Verificações antes do PR
- [ ] Build e testes verdes
- [ ] Lint do que mudou
- [ ] Documento vivo da feature atualizado no mesmo commit
```
