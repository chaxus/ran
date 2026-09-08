---
description: 'Uma primitiva de painel flutuante de baixo nível que fornece o posicionamento e o z-index sobre os quais o r-popover e o r-select são construídos.'
---

# Dropdown

Uma primitiva de painel flutuante de baixo nível: uma superfície arredondada e elevada com uma seta direcional opcional. Ela carrega o z-index das camadas sobrepostas e é a peça que o `r-popover` e o `r-select` posicionam e levam para o `<body>`.

> **Use quando** precisar de um painel flutuante de baixo nível para montar camadas como popovers ou menus de seleção: o `<r-dropdown>` já carrega o z-index e a seta, então você não precisa montar o posicionamento na mão.

## Início rápido

### Uso básico

<ran-demo>
  <r-dropdown arrow="top" style="display: inline-block; width: 220px;">
    <div style="padding: 12px;">Conteúdo do painel flutuante</div>
  </r-dropdown>
</ran-demo>

```html
<r-dropdown arrow="top">
  <div style="padding: 12px;">Conteúdo do painel flutuante</div>
</r-dropdown>
```

## Referência da API

### Propriedades

| Propriedade | Tipo     | Padrão | Descrição                                                                   |
| ----------- | -------- | ------ | --------------------------------------------------------------------------- |
| `arrow`     | `string` | `''`   | Lado da seta: `top`, `bottom`, `left`, `right`. Omita para não ter seta.    |
| `transit`   | `string` | `''`   | Classe de animação espelhada no painel enquanto o atributo estiver presente |
| `sheet`     | `string` | `''`   | CSS injetado no shadow DOM do componente                                    |

### Direção da seta `arrow`

Desenha uma seta apontando a partir de um dos lados do painel. Omita o atributo para não ter seta.

<ran-demo column>
  <r-dropdown arrow="top" style="display: inline-block; width: 220px; margin: 20px;">
    <div style="padding: 12px;">arrow="top"</div>
  </r-dropdown>
  <r-dropdown arrow="bottom" style="display: inline-block; width: 220px; margin: 20px;">
    <div style="padding: 12px;">arrow="bottom"</div>
  </r-dropdown>
  <r-dropdown arrow="left" style="display: inline-block; width: 220px; margin: 20px;">
    <div style="padding: 12px;">arrow="left"</div>
  </r-dropdown>
  <r-dropdown arrow="right" style="display: inline-block; width: 220px; margin: 20px;">
    <div style="padding: 12px;">arrow="right"</div>
  </r-dropdown>
</ran-demo>

```html
<r-dropdown arrow="top">
  <div style="padding: 12px;">arrow="top"</div>
</r-dropdown>
<r-dropdown arrow="bottom">
  <div style="padding: 12px;">arrow="bottom"</div>
</r-dropdown>
<r-dropdown arrow="left">
  <div style="padding: 12px;">arrow="left"</div>
</r-dropdown>
<r-dropdown arrow="right">
  <div style="padding: 12px;">arrow="right"</div>
</r-dropdown>
```

### Animação de entrada `transit`

Um nome de classe CSS espelhado no painel para tocar uma animação de entrada ou saída. O componente traz estas: `ran-dropdown-down-in` / `-down-out` / `-up-in` / `-up-out` / `-left-in` / `-left-out` / `-right-in` / `-right-out`.

A classe vive exatamente o tempo que o atributo vive: quem o define decide quando a animação acabou, e remover o atributo remove a classe. (Antes ela expirava sozinha depois de uns 300 ms, uma duração guardada no JS além da que estava na folha de estilos. Aquele temporizador removia o que o `transit` dissesse no instante em que disparava, e não a classe que ele mesmo tinha acrescentado, então inverter a direção dentro daquela janela deixava a primeira classe grudada no painel para sempre, com `-in` e `-out` aplicados ao mesmo tempo.)

`getAnimationTarget()` devolve o elemento em que a animação de fato roda. Ele fica dentro do shadow root, então `getAnimations()` no host não relata nada e `{ subtree: true }` não cruza a fronteira. Código que espera a transição do painel terminar deve chamar `getAnimationTarget()` em vez de vasculhar a árvore do shadow atrás de um nome de classe.

<ran-demo>
  <r-dropdown transit="ran-dropdown-down-in" style="display: inline-block; width: 220px;">
    <div style="padding: 12px;">Entra animado ao conectar</div>
  </r-dropdown>
</ran-demo>

```html
<r-dropdown transit="ran-dropdown-down-in">
  <div style="padding: 12px;">Entra animado ao conectar</div>
</r-dropdown>
```

### Estilos externos `sheet`

CSS injetado no shadow DOM do painel. Segue a mesma convenção `sheet` de todos os outros componentes do ranui.

```html
<r-dropdown arrow="top" sheet=".ranui-dropdown { border: 1px solid #999; }">
  <div style="padding: 12px;">Painel com estilo próprio</div>
</r-dropdown>
```

## Eventos

O `r-dropdown` é uma superfície passiva e não despacha eventos personalizados. Quem o consome (por exemplo o `r-popover` ou o `r-select`) é quem o posiciona, mostra e esconde.

## Slots

| Slot     | Descrição                                 |
| -------- | ----------------------------------------- |
| (padrão) | O conteúdo do painel, desenhado como está |

## Partes CSS

| Parte      | Descrição                                                |
| ---------- | -------------------------------------------------------- |
| `dropdown` | A superfície do painel, para estilizar de fora do shadow |

```css
r-dropdown {
  --ran-dropdown-background: var(--ran-color-bg-muted);
  --ran-dropdown-border-radius: 8px;
}
r-dropdown::part(dropdown) {
  border: 1px solid var(--ran-color-border);
}
```

Toda propriedade visual pode ser sobrescrita pelos tokens `--ran-dropdown-*`, por exemplo `--ran-dropdown-background`, `--ran-dropdown-border-radius`, `--ran-dropdown-box-shadow`, `--ran-dropdown-padding`, `--ran-dropdown-arrow-width` e `--ran-dropdown-host-z-index`. A seta é um SVG inline escalado pelo próprio `viewBox`, então `--ran-dropdown-arrow-width`/`-height` mudam o tamanho do triângulo de verdade, não o de uma caixa vazia em volta dele:

<ran-demo>
  <r-dropdown arrow="top" style="display: inline-block; width: 220px; margin: 20px; --ran-dropdown-arrow-width: 28px; --ran-dropdown-arrow-height: 28px;">
    <div style="padding: 12px;">--ran-dropdown-arrow-width: 28px</div>
  </r-dropdown>
</ran-demo>

```css
r-dropdown {
  --ran-dropdown-arrow-width: 28px;
  --ran-dropdown-arrow-height: 28px;
}
```

## Boas práticas

- **Primitiva de baixo nível**: use o `r-dropdown` diretamente só quando precisar de um painel flutuante próprio; para os casos comuns prefira `r-popover` ou `r-select`.
- **Dê tamanho ao host**: o painel assume por padrão `width` e `height: 100%` do host, então dê ao host um tamanho e uma posição explícitos e depois leve-o para o body.
- **Empilhamento**: o host carrega `--ran-z-dropdown` (`1100`), então fica acima dos diálogos; sobrescreva com `--ran-dropdown-host-z-index` se precisar.
- **A seta se centraliza em si por padrão**: o `r-dropdown` não acompanha nenhum elemento "disparador" externo — ele só tem as dimensões do próprio painel. Sem ninguém posicionando, `arrow="top"`/`"bottom"` se centraliza pela largura do próprio painel; esse é o padrão certo para usar o `r-dropdown` sozinho (como nas demonstrações acima). O `r-popover` fica em cima do `r-dropdown` justamente para acrescentar o acompanhamento do disparador: ele mede o elemento disparador real e devolve um deslocamento em pixels por `--ran-dropdown-arrow-anchor-offset`, empurrando a seta para apontar ao centro do disparador mesmo quando o painel é mais largo e se alinha por uma borda em vez de se centralizar nele. Quem montar o próprio painel com acompanhamento de disparador sobre o `r-dropdown` pode definir essa variável direto, em vez de refazer a lógica de posicionamento do `r-popover`.
- **Importar**: carregue com `import 'ranui'` (registra todos os componentes) ou com o independente `import 'ranui/dropdown'`.
