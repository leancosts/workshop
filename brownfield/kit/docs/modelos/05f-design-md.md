# Modelo: DESIGN.md

A referência de estilo que o agente lê antes de mexer numa tela: os tokens, os componentes e o que fazer e evitar. Sem ela, cada sessão escolhe cores, espaços e botões por conta própria. As cores abaixo são as deste workshop; a tipografia e o espaço são exemplos, para mostrar o nível de detalhe. Troque tudo pelos valores do seu sistema. Referências prontas para adaptar estão em [styles.refero.design](https://styles.refero.design/).

```markdown
# <Nome do sistema>: referência de estilo
> <Uma frase: a atmosfera do produto e o papel do único acento.>

**Tema:** claro

<Um parágrafo: a voz visual, as superfícies, como a cor é racionada e o que torna
o sistema reconhecível.>

## Tokens: cores

| Nome | Valor | Token | Papel |
|---|---|---|---|
| Graphite | `#202020` | `--color-graphite` | Texto principal e títulos |
| Canvas | `#ffffff` | `--color-canvas` | Fundo da página |
| Ash | `#efefef` | `--color-ash` | Cartões e seções |
| Steel | `#4d4d4d` | `--color-steel` | Texto secundário |
| Ember | `#ff682c` | `--color-ember` | Acento: linhas, pontos, realces. Nunca fundo de botão |
| Brass | `#816729` | `--color-brass` | Texto de destaque sobre o claro |

## Tokens: tipografia

### Inter Tight: títulos · `--font-display`
- **Pesos:** 400
- **Tamanhos:** 32, 40, 66 px
- **Entrelinha:** 0,91 a 1,20
- **Espaçamento entre letras:** -0,02em
- **Papel:** títulos; nunca em negrito

### Inter: corpo e interface · `--font-body`
- **Pesos:** 400, 500, 600
- **Tamanhos:** 12 a 18 px
- **Entrelinha:** 1,15 a 1,50

## Tokens: espaço e forma

**Unidade base:** 4 px

| Elemento | Raio |
|---|---|
| Botões | 0 |
| Cartões | 8 px |
| Cartão em destaque | 6 px 0 0 0 |
| Etiquetas | 20 px |

- **Largura máxima da página:** 1200 px
- **Entre seções:** 80 px
- **Entre elementos:** 20 px

## Componentes

### Botão principal
**Papel:** a ação de maior ênfase da tela.
Fundo Graphite, texto branco, canto reto, 10 px por 20 px, sem sombra.

### Botão secundário
**Papel:** a ação ao lado da principal.
Fundo transparente, borda de 1 px em Graphite, canto reto.

### Cartão
**Papel:** um bloco de conteúdo.
Fundo Ash, raio de 8 px, sem sombra: a superfície faz a separação.

## Faça
- Mantenha a página quase toda acromática; o acento é pontuação.
- Separe seções alternando superfícies, sem linhas nem sombras.

## Não faça
- Não use Ember como fundo de botão.
- Não ponha sombra em cartão nem em botão.
- Não introduza outra cor de acento.

## Superfícies e elevação
<Quais fundos existem, em que ordem se empilham e como a profundidade é mostrada.>

## Guia para o agente
- Use só os tokens acima; nunca um valor solto.
- Antes de criar um componente, procure um nesta lista.
- Um padrão novo entra neste arquivo no mesmo commit.
```

O caso guarda o mesmo conteúdo em `docs/design-guidelines.md` e `docs/features/design-system.md`, e um teste recusa cor fora dos tokens.
