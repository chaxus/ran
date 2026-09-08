---
description: 'Uma amostra de cor compacta que abre um painel com controles de saturação/luminosidade, matiz e transparência, além de uma entrada HEX/RGB.'
---

# Color Picker

Uma amostra de cor compacta que abre um painel flutuante com uma paleta de saturação e luminosidade, um controle de matiz, um de transparência e uma entrada de valor HEX/RGB. O `value` dela aceita e emite strings de cor CSS padrão.

> **Use quando** quiser deixar as pessoas escolherem uma cor com um painel de saturação, matiz e transparência e entrada HEX/RGB: o `<r-colorpicker>` aceita e emite strings de cor CSS padrão e informa todos os formatos no `change`.

## Início rápido

### Uso básico

<ran-demo align="start">
  <r-colorpicker value="#006bff"></r-colorpicker>
  <r-colorpicker value="rgba(255,0,0,0.5)"></r-colorpicker>
</ran-demo>

```html
<r-colorpicker value="#006bff"></r-colorpicker> <r-colorpicker value="rgba(255,0,0,0.5)"></r-colorpicker>
```

Clique na amostra (ou dê foco nela e aperte Enter/Espaço) para abrir o painel. Os controles de matiz e transparência funcionam pelo teclado: as setas andam de 1 em 1, Shift+seta de 10 em 10, e Home/End saltam para as pontas.

## Referência da API

### Propriedades

| Propriedade | Tipo      | Padrão  | Descrição                                                                        |
| ----------- | --------- | ------- | -------------------------------------------------------------------------------- |
| `value`     | `string`  | `''`    | A cor atual como string de cor CSS (HEX, `rgb(...)`, `rgba(...)`)                |
| `disabled`  | `boolean` | `false` | Presente, a amostra não abre, sai da ordem de tabulação e recebe `aria-disabled` |
| `sheet`     | `string`  | `''`    | CSS injetado no shadow DOM do componente                                         |

### Valor `value`

A cor atual, como string de cor CSS. Na entrada aceita HEX (`#1677FF`, `#fff`), `rgb(...)` e `rgba(...)`. Na saída, o valor canônico lido de volta é uma string HEX de 6 dígitos quando a cor é totalmente opaca, ou uma string `rgba(...)` quando a transparência é menor que 1.

<ran-demo align="start">
  <r-colorpicker value="#00c853"></r-colorpicker>
  <r-colorpicker value="rgb(22, 119, 255)"></r-colorpicker>
  <r-colorpicker value="rgba(255, 0, 0, 0.5)"></r-colorpicker>
</ran-demo>

```html
<r-colorpicker value="#00c853"></r-colorpicker>
<r-colorpicker value="rgb(22, 119, 255)"></r-colorpicker>
<r-colorpicker value="rgba(255, 0, 0, 0.5)"></r-colorpicker>
```

```js
const picker = document.createElement('r-colorpicker');
picker.value = '#00c853';
console.log(picker.value); // lê a cor atual
toolbar.append(picker);
```

### Desabilitado `disabled`

Acrescente o atributo `disabled` para deixar o seletor inerte: a amostra não abre mais o painel (nem por mouse nem por teclado), sai da ordem de tabulação e o host recebe `aria-disabled="true"`. Remover o atributo devolve a interação normal.

<ran-demo align="start">
  <r-colorpicker value="#006bff" disabled></r-colorpicker>
  <r-colorpicker value="rgba(255, 0, 0, 0.5)" disabled></r-colorpicker>
</ran-demo>

```html
<r-colorpicker value="#006bff" disabled></r-colorpicker>
```

```js
const picker = document.createElement('r-colorpicker');
picker.disabled = true; // bloquear a interação
picker.disabled = false; // reabilitar
toolbar.append(picker);
```

### Estilos externos `sheet`

CSS injetado no shadow DOM do componente. Segue a mesma convenção `sheet` de todos os outros componentes do ranui.

```html
<r-colorpicker value="#006bff" sheet=".ran-colorpicker { border-radius: 6px; }"></r-colorpicker>
```

## Eventos

### `change`

Dispara sempre que a cor muda: ao arrastar a paleta, mover um controle, editar a entrada de valor ou definir o atributo `value`. Ele **borbulha** e é **composed** (cruza fronteiras do shadow DOM). O `event.detail` carrega a cor em todos os formatos:

| Campo   | Tipo     | Exemplo                                   |
| ------- | -------- | ----------------------------------------- |
| `value` | `string` | `"#1677ff"` / `"rgba(22, 119, 255, 0.5)"` |
| `hex`   | `string` | `"#1677ff"`                               |
| `rgb`   | `string` | `"rgb(22, 119, 255)"`                     |
| `rgba`  | `string` | `"rgba(22, 119, 255, 0.5)"`               |
| `alpha` | `number` | `0.5`                                     |

```html
<r-colorpicker value="#1677ff"></r-colorpicker>

<script>
  const picker = document.createElement('r-colorpicker');
  picker.addEventListener('change', (e) => {
    console.log(e.detail.hex, e.detail.alpha);
  });
  toolbar.append(picker);
</script>
```

## Partes CSS

A amostra que abre o painel expõe duas partes para estilização de fora do shadow DOM:

| Parte    | Descrição                                       |
| -------- | ----------------------------------------------- |
| `block`  | O contêiner da amostra (caixa com fundo xadrez) |
| `swatch` | O preenchimento interno que mostra a cor atual  |

```css
r-colorpicker::part(block) {
  box-shadow: 0 0 0 1px var(--line);
}
```

O painel flutuante é levado para o `document.body`, então os estilos dele têm espaço de nomes (`.ran-color-picker-*`) e viajam com o painel em vez de morar no host.

### Variáveis CSS

A amostra lê estes tokens:

| Variável                                | Finalidade                     |
| --------------------------------------- | ------------------------------ |
| `--ran-colorpicker-background`          | Fundo da amostra               |
| `--ran-colorpicker-border`              | Borda da amostra               |
| `--ran-colorpicker-hover-border-color`  | Cor da borda ao passar o mouse |
| `--ran-colorpicker-border-radius`       | Raio de canto da amostra       |
| `--ran-colorpicker-block-border-radius` | Raio de canto do bloco interno |
| `--ran-colorpicker-transition`          | Transição ao passar o mouse    |

```css
r-colorpicker {
  --ran-colorpicker-border-radius: 6px;
}
```

## Boas práticas

- **Formatos de entrada**: passe ao `value` qualquer string de cor CSS: HEX, `rgb(...)` ou `rgba(...)`; o seletor normaliza internamente.
- **Ler o resultado**: escute `change` e leia de `event.detail` o formato exato de que precisa (`hex`, `rgb`, `rgba`, `alpha`).
- **Transparência**: use entrada `rgba(...)` ou o controle de transparência quando precisar; o `value` lido de volta vira uma string `rgba(...)` assim que a transparência cai abaixo de 1.
- **Teclado**: a amostra e os dois controles recebem foco e funcionam pelo teclado; mouse não é necessário.
- **Importar**: carregue com `import 'ranui'` (registra todos os componentes) ou com o independente `import 'ranui/colorpicker'`.
