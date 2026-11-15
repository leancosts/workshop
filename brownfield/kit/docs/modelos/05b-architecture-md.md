# Modelo: ARCHITECTURE.md

O mapa para o agente achar onde mexer antes de abrir o código, e as regras que o código não mostra. Mantenha em uma tela. Quando uma regra crescer, ela vai para um documento do tema, e este arquivo fica só com o link.

```markdown
# Arquitetura

Mapa de onde as coisas ficam e das regras que sustentam o sistema. Leia
antes de explorar; para qualquer detalhe, confie no código.

## Stack
- <Linguagem, framework, banco, filas, onde roda.>

## Mapa de pastas
- `<pasta>`: <o que tem, e o ponto de entrada>
- `<pasta>`: <...>

## Regras transversais (não óbvias)
### <Nome da regra>
<A regra, o incidente ou o motivo que a criou, e o arquivo que a aplica.>

## Para saber mais
- <Link para o documento de cada tema.>
```

O caso tem a estrutura deste modelo. O `ARCHITECTURE.md` do leancosts se declara um mapa de uma tela e tem 134 KB; o hook de tamanho impede que ele cresça mais. Comece pequeno e divida por tema desde o início.
