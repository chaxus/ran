---
description: 'O Loading do ranui (<r-loading>) exibe um indicador giratório enquanto há conteúdo ou uma ação em andamento.'
---

# Loading

Componente de carregamento com uma coleção de indicadores animados para sinalizar trabalho em andamento.

> **Use quando** precisar de um indicador animado que sinalize trabalho em andamento: o `<r-loading>` traz cerca de 30 animações embutidas, escolhidas por `name` e tematizadas por variáveis CSS.

## Início rápido

### Uso básico

<ran-demo>
  <r-loading name="circle"></r-loading>
</ran-demo>

```html
<r-loading name="circle"></r-loading>
```

## Referência da API

### Propriedades

| Propriedade | Tipo     | Padrão     | Descrição                                                                |
| ----------- | -------- | ---------- | ------------------------------------------------------------------------ |
| `name`      | `string` | `'circle'` | Tipo de animação. Recorre a `circle` quando não definido ou desconhecido |
| `sheet`     | `string` | `''`       | Texto CSS injetado no shadow DOM do componente para estilos externos     |

### Tipos de carregamento `name`

Defina `name` com um dos tipos de animação embutidos. Qualquer valor desconhecido não desenha nada (só os nomes da lista abaixo são tratados).

<ran-demo>
  <r-loading name="double-bounce"></r-loading>
  <r-loading name="rotate"></r-loading>
  <r-loading name="stretch"></r-loading>
  <r-loading name="cube"></r-loading>
</ran-demo>

```html
<r-loading name="double-bounce"></r-loading>
<r-loading name="rotate"></r-loading>
<r-loading name="stretch"></r-loading>
<r-loading name="cube"></r-loading>
```

Valores disponíveis:

`double-bounce`, `rotate`, `stretch`, `cube`, `dot`, `triple-bounce`, `scale-out`, `circle`, `circle-line`, `square`, `pulse`, `solar`, `cube-fold`, `circle-fold`, `cube-grid`, `circle-turn`, `circle-rotate`, `circle-spin`, `dot-bar`, `dot-circle`, `line`, `dot-pulse`, `line-scale`, `text`, `cube-dim`, `dot-line`, `arc`, `drop`, `pacman`

### Estilos externos `sheet`

O atributo `sheet` injeta CSS bruto no shadow root do componente, deixando você sobrescrever regras internas de fora, sem etapa de build.

```html
<r-loading name="circle" sheet=".circle { transform: scale(1.5); }"></r-loading>
```

## Estilos próprios

Cada animação é tematizada inteiramente por variáveis CSS. Defina-as no elemento `r-loading` (ou num ancestral) para controlar tamanho e cor. Usar unidades `px` dá controle mais preciso do que o dimensionamento padrão baseado em `em`.

### Ajustar o tamanho

```css
/* Circle */
r-loading {
  --loading-circle-width: 32px;
  --loading-circle-height: 32px;
}

/* Double-bounce */
r-loading {
  --loading-double-bounce-width: 40px;
  --loading-double-bounce-height: 40px;
}

/* Rotate */
r-loading {
  --loading-rotate-width: 48px;
  --loading-rotate-height: 48px;
}

/* Stretch */
r-loading {
  --loading-stretch-width: 60px;
  --loading-stretch-height: 72px;
}
```

### Ajustar a cor

```css
/* Circle */
r-loading {
  --loading-circle-container-div-background: #1890ff;
}

/* Double-bounce */
r-loading {
  --loading-double-bounce1-background: #52c41a;
  --loading-double-bounce2-background: #52c41a;
}

/* Rotate */
r-loading {
  --loading-rotate-background: #faad14;
}

/* Stretch */
r-loading {
  --loading-stretch-div-background-color: #f5222d;
}
```

### Exemplos ao vivo

<ran-demo>
  <r-loading name="circle" style="--loading-circle-width: 64px; --loading-circle-height: 64px; --loading-circle-container-div-background: #1890ff;"></r-loading>
  <r-loading name="rotate" style="--loading-rotate-width: 48px; --loading-rotate-height: 48px; --loading-rotate-background: #faad14;"></r-loading>
</ran-demo>

```html
<r-loading
  name="circle"
  style="--loading-circle-width: 64px; --loading-circle-height: 64px; --loading-circle-container-div-background: #1890ff;"
></r-loading>
<r-loading
  name="rotate"
  style="--loading-rotate-width: 48px; --loading-rotate-height: 48px; --loading-rotate-background: #faad14;"
></r-loading>
```

### Variáveis CSS comuns

Cada tipo de animação tem o próprio espaço de nomes de tokens. Os mais comuns seguem este padrão:

| Variável                                | Padrão    | Descrição                                    |
| --------------------------------------- | --------- | -------------------------------------------- |
| `--loading-{type}-width`                | `4em`     | Largura da animação (recomenda-se usar `px`) |
| `--loading-{type}-height`               | `4em`     | Altura da animação (recomenda-se usar `px`)  |
| `--loading-{type}-background`           | `#4096ff` | Cor de fundo principal                       |
| `--loading-{type}-div-background-color` | `#4096ff` | Cor de fundo dos subelementos                |

> Troque `{type}` pelo nome concreto da animação, por exemplo `circle`, `double-bounce` ou `rotate`. As cores base recorrem por padrão aos tokens de tema `--ran-color-primary`, `--ran-color-success` e `--ran-color-text`.

## Partes CSS

Cada animação expõe o elemento raiz dela como um `::part()` com o nome do seu valor de `name`, então você pode mirá-lo de fora do shadow DOM:

```css
r-loading::part(rotate) {
  filter: drop-shadow(0 0 4px currentColor);
}
```

Nomes de parte: `double-bounce`, `rotate`, `stretch`, `cube`, `dot`, `triple-bounce`, `scale-out`, `circle`, `circle-line`, `square`, `pulse`, `solar`, `cube-fold`, `circle-fold`, `cube-grid`, `circle-turn`, `circle-rotate`, `circle-spin`, `dot-bar`, `dot-circle`, `line`, `dot-pulse`, `line-scale`, `text`, `cube-dim`, `dot-line`, `arc`, `drop`, `pacman`. A animação `solar` expõe ainda uma parte `sun`.

## Slots

Nenhum. O componente desenha a animação inteiramente a partir do shadow DOM e não projeta filhos do light DOM.

## Eventos

Nenhum. O componente não despacha eventos personalizados.

## Todas as animações de carregamento

<Loading />

## Boas práticas

- **Escolha pela cena**: pegue uma animação que combine com o contexto e o ritmo da tarefa.
- **Variáveis CSS**: personalize tamanho e cor pelos tokens `--loading-{type}-*` em vez de envolver elementos.
- **Dimensionamento**: prefira unidades `px` ao `em` padrão para medidas previsíveis.
- **Desempenho**: evite desenhar muitas animações ao mesmo tempo numa só tela.
- **Carregamento sob demanda**: cada animação é um bloco preguiçoso separado (com JS e CSS próprios), então um `name` só carrega a variante que usa; referenciar uma animação nunca empacota as outras 28. A `circle` padrão e a comum `dot` vêm embutidas para um primeiro desenho imediato e sem lampejo; as demais carregam de forma assíncrona no primeiro uso. O uso não muda: basta definir `name`.
- **Temas**: as cores base seguem os tokens de tema `--ran-color-*`, então as animações se adaptam sozinhas aos modos claro e escuro.
