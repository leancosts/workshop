# Modelo: descrição do pull request

O PR é a evidência que a pessoa lê antes de dar o OK. Ele liga a mudança ao rastro inteiro e mostra a prova de que funciona. No workshop, o PR fica em rascunho, contra a branch de desenvolvimento da empresa.

```markdown
## Intenção
<Link do épico ou do PRD, e uma frase com o que muda para quem usa.>

## Rastro
- Issue: <link>
- Spec: <caminho em docs/specs/, ou "mudança pequena, sem spec">
- Plano: <caminho em docs/planos/>

## Evidência
- Teste que falhou antes e passa depois: `<arquivo>`, `<nome do teste>`
- Comando e resultado: `<comando de testes>` verde
- Revisão adversarial: <APROVADO, com o modelo que revisou, e os pontos corrigidos>
- Documento vivo atualizado: <caminho>

## Decisões fora da spec
- <Decisão, motivo e onde foi registrada: commit, comentário da issue ou ADR.>

## Obstáculos
- <Grupo: causa e tempo perdido (modelo 13), ou "nenhum".>

## O que não ficou pronto
<O que falta e por quê, ou "nada".>
```
