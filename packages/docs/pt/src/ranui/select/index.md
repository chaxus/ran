---
description: 'O Select do ranui (<r-select>) é um menu suspenso para escolher um valor entre opções, com busca opcional e participação em formulários nativos.'
---

# Select

Seletor suspenso para escolher um único valor de uma lista de opções, com busca opcional e participação em formulários.

> **Use quando** precisar de um seletor suspenso de valor único montado a partir de filhos `<r-option>`, com busca opcional e participação em formulários nativos. O `<r-select>` cuida de abrir, filtrar e entregar o valor ao `FormData`.

## Início rápido

### Uso básico

As opções são fornecidas como filhos `<r-option>` no slot. O atributo `value` de cada opção é o valor dela, e o texto é o rótulo exibido.

<Demo>
  <r-select style="width: 120px; height: 40px" defaultValue="185">
    <r-option value="185">Mike</r-option>
    <r-option value="186">Tom</r-option>
    <r-option value="187">Lucy</r-option>
  </r-select>
</Demo>

```html
<r-select style="width: 120px; height: 40px" defaultValue="185">
  <r-option value="185">Mike</r-option>
  <r-option value="186">Tom</r-option>
  <r-option value="187">Lucy</r-option>
</r-select>
```

## Referência da API

### Propriedades

| Propriedade           | Tipo      | Padrão     | Descrição                                                                                                                                      |
| --------------------- | --------- | ---------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| `label`               | `string`  | `''`       | Legenda fixa acima do campo (o mesmo padrão do `label` do `r-input`), para que um select rotulado se alinhe a um input rotulado num formulário |
| `value`               | `string`  | `''`       | Valor selecionado. Defini-lo atualiza o rótulo do estado fechado; é ignorado enquanto estiver `disabled`                                       |
| `defaultValue`        | `string`  | `''`       | Valor selecionado no início, comparado com o `value` das opções                                                                                |
| `disabled`            | `boolean` | `false`    | Se o select está desabilitado                                                                                                                  |
| `type`                | `string`  | `''`       | `text` desenha um gatilho sem borda, transparente e sem seta; caso contrário, com borda                                                        |
| `open`                | `boolean` | `false`    | Se o menu suspenso está à vista. Isto _é_ o estado: defina-o para abrir ou fechar o painel                                                     |
| `placement`           | `string`  | `'bottom'` | De que lado o menu abre, com alinhamento opcional: `bottom`, `bottom-end`, `top-center`, …                                                     |
| `showSearch`          | `boolean` | `false`    | Mostra uma caixa de busca embutida que filtra as opções pelo rótulo                                                                            |
| `getPopupContainerId` | `string`  | `''`       | `id` do elemento onde montar o menu (por padrão, `document.body`)                                                                              |
| `dropdownclass`       | `string`  | `''`       | Classe personalizada aplicada ao painel suspenso                                                                                               |
| `trigger`             | `string`  | `'click'`  | Como o menu abre: `click`, `hover` ou `click,hover` (no celular, `hover` é ignorado)                                                           |
| `required`            | `boolean` | `false`    | Se uma seleção é obrigatória para o formulário ser enviado                                                                                     |
| `sheet`               | `string`  | `''`       | CSS injetado no shadow DOM                                                                                                                     |

> **Nota:** `defaultValue` e `showSearch` são reativos: alterá-los depois que o elemento se conectou é reprocessado (junto de `value`, `disabled` e `sheet`) em `attributeChangedCallback`. Atualizar `defaultValue` reaplica a seleção correspondente; alternar `showSearch` liga ou desliga a caixa de busca embutida.

### Propriedades das opções

Forneça as opções por elementos filhos `<r-option>`.

| Propriedade | Tipo      | Padrão  | Descrição                                                                              |
| ----------- | --------- | ------- | -------------------------------------------------------------------------------------- |
| `value`     | `string`  | `''`    | Valor da opção; é emitido como valor do select quando ela é escolhida                  |
| `disabled`  | `boolean` | `false` | Marca a opção como não selecionável; o select a pula tanto no clique quanto no teclado |
| `sheet`     | `string`  | `''`    | CSS injetado no shadow DOM da opção                                                    |

Opções com rótulos ou valores repetidos registram um `console.warn`.

### Rótulo `label`

Uma legenda fixa desenhada acima do campo: sempre visível, nunca se sobrepõe ao conteúdo vizinho. Usa os mesmos tokens e o mesmo layout do `label` do `r-input`, então um select rotulado e um input rotulado postos lado a lado num formulário se alinham (mesma altura, mesma borda de cima).

<Demo>
  <r-select label="País" style="width: 180px" defaultValue="185">
    <r-option value="185">Estados Unidos</r-option>
    <r-option value="186">Canadá</r-option>
    <r-option value="187">México</r-option>
  </r-select>
</Demo>

```html
<r-select label="País" defaultValue="185">
  <r-option value="185">Estados Unidos</r-option>
  <r-option value="186">Canadá</r-option>
  <r-option value="187">México</r-option>
</r-select>
```

### Valor inicial `defaultValue`

<Demo>
  <r-select style="width: 120px; height: 40px" defaultValue="185">
    <r-option value="185">Mike</r-option>
    <r-option value="186">Tom</r-option>
    <r-option value="187">Lucy</r-option>
  </r-select>
</Demo>

```html
<r-select style="width: 120px; height: 40px" defaultValue="185">
  <r-option value="185">Mike</r-option>
  <r-option value="186">Tom</r-option>
  <r-option value="187">Lucy</r-option>
</r-select>
```

### Estado desabilitado `disabled`

<Demo>
  <r-select style="width: 120px; height: 40px" disabled defaultValue="185">
    <r-option value="185">Mike</r-option>
    <r-option value="186">Tom</r-option>
    <r-option value="187">Lucy</r-option>
  </r-select>
</Demo>

```html
<r-select style="width: 120px; height: 40px" disabled defaultValue="185">
  <r-option value="185">Mike</r-option>
  <r-option value="186">Tom</r-option>
  <r-option value="187">Lucy</r-option>
</r-select>
```

### Tipo texto `type`

<Demo>
  <r-select style="width: 120px; height: 40px" type="text" defaultValue="185">
    <r-option value="185">Mike</r-option>
    <r-option value="186">Tom</r-option>
    <r-option value="187">Lucy</r-option>
  </r-select>
</Demo>

```html
<r-select style="width: 120px; height: 40px" type="text" defaultValue="185">
  <r-option value="185">Mike</r-option>
  <r-option value="186">Tom</r-option>
  <r-option value="187">Lucy</r-option>
</r-select>
```

### Direção do menu `placement`

`placement` é uma preferência, não uma garantia: quando o gatilho está perto da borda da janela e falta espaço do lado preferido, o menu inverte sozinho para o outro lado e desliza na horizontal para continuar na tela. Isso vale só para a montagem padrão no nível do `body`; com `getPopupContainerId` definido, escolha um `placement` que caiba no contêiner.

Um lado pode carregar um sufixo de alinhamento: `bottom-end`, `top-center` e assim por diante, a mesma gramática que o `r-popover` aceita. Só o lado significa `-start`, que alinha a borda inicial do painel com a do gatilho.

O sufixo só muda alguma coisa quando o painel tem largura diferente da do gatilho, já que por padrão o painel acompanha a largura dele. Alargue o painel (`r-dropdown::part(dropdown)`, alcançado por `dropdownclass`, porque o painel é portalizado para o `<body>` em vez de morar no shadow root do select) e o alinhamento passa a ser calculado sobre o que de fato é pintado:

```html
<style>
  r-dropdown.wide::part(dropdown) {
    min-width: 220px;
  }
</style>

<!-- borda direita do painel sobre a borda direita do gatilho -->
<r-select placement="bottom-end" dropdownclass="wide" style="width: 80px">
  <r-option value="a">Um rótulo de opção bem comprido</r-option>
</r-select>
```

Repare que o deslocamento pela borda vence o alinhamento: um gatilho perto o bastante da borda da janela tem o painel empurrado de volta para a tela, seja qual for o alinhamento pedido.

<Demo>
  <r-select style="width: 120px; height: 40px" defaultValue="185" placement="top">
    <r-option value="185">Mike</r-option>
    <r-option value="186">Tom</r-option>
    <r-option value="187">Lucy</r-option>
  </r-select>
</Demo>

```html
<r-select style="width: 120px; height: 40px" defaultValue="185" placement="top">
  <r-option value="185">Mike</r-option>
  <r-option value="186">Tom</r-option>
  <r-option value="187">Lucy</r-option>
</r-select>
```

### Estado de abertura `open`

`open` é o estado do menu, refletido como atributo do mesmo jeito que em `<details open>` e `<dialog open>`. Nada deduz o estado a partir do `display` do painel (que fica atrás pelo tempo da animação de saída), então o atributo, o `aria-expanded` e o que está na tela não podem se contradizer.

Isso faz dele uma forma admitida de conduzir o componente, e algo para estilizar e para verificar em testes:

```html
<r-select id="picker" open>
  <r-option value="185">Mike</r-option>
</r-select>

<script>
  const picker = document.getElementById('picker');
  picker.open = true; // ou picker.show()
  picker.open = false; // ou picker.hide()
  picker.toggle();
</script>

<style>
  /* o gatilho, enquanto o painel dele está aberto */
  r-select[open]::part(selection) {
    border-color: var(--ran-color-primary);
  }
</style>
```

`show()`, `hide()` e `toggle()` são invólucros finos sobre ele, para quando um método se lê melhor que uma atribuição.

### Função de busca `showSearch`

<Demo>
  <r-select style="width: 120px; height: 40px" showSearch="true">
    <r-option value="185">Mike</r-option>
    <r-option value="186">Tom</r-option>
    <r-option value="187">Lucy</r-option>
  </r-select>
</Demo>

```html
<r-select style="width: 120px; height: 40px" showSearch="true">
  <r-option value="185">Mike</r-option>
  <r-option value="186">Tom</r-option>
  <r-option value="187">Lucy</r-option>
</r-select>
```

### Forma de abrir `trigger`

<Demo>
  <r-select style="width: 120px; height: 40px" trigger="click,hover">
    <r-option value="185">Mike</r-option>
    <r-option value="186">Tom</r-option>
    <r-option value="187">Lucy</r-option>
  </r-select>
</Demo>

```html
<!-- Abertura por clique (padrão) -->
<r-select trigger="click">
  <r-option value="185">Mike</r-option>
  <r-option value="186">Tom</r-option>
  <r-option value="187">Lucy</r-option>
</r-select>

<!-- Abertura ao passar o cursor (ignorada no celular) -->
<r-select trigger="hover">
  <r-option value="185">Mike</r-option>
  <r-option value="186">Tom</r-option>
  <r-option value="187">Lucy</r-option>
</r-select>

<!-- Clique e cursor juntos -->
<r-select trigger="click,hover">
  <r-option value="185">Mike</r-option>
  <r-option value="186">Tom</r-option>
  <r-option value="187">Lucy</r-option>
</r-select>
```

### Contêiner de montagem `getPopupContainerId`

Por padrão, o menu é portalizado para o `document.body`. Passe o `id` de outro elemento para montá-lo ali.

```html
<r-select getPopupContainerId="my-container">
  <r-option value="185">Mike</r-option>
  <r-option value="186">Tom</r-option>
  <r-option value="187">Lucy</r-option>
</r-select>
```

### Classe personalizada do menu `dropdownclass`

```html
<r-select dropdownclass="custom-dropdown">
  <r-option value="185">Mike</r-option>
  <r-option value="186">Tom</r-option>
  <r-option value="187">Lucy</r-option>
</r-select>
```

## Eventos

### `change`

Disparado quando uma opção é escolhida. `event.detail` é `{ value, label }`, em que `value` é o valor da opção escolhida e `label` o texto exibido dela. Selecionar o `defaultValue` inicial não dispara `change`.

```html
<r-select id="picker">
  <r-option value="185">Mike</r-option>
  <r-option value="186">Tom</r-option>
  <r-option value="187">Lucy</r-option>
</r-select>

<script>
  document.getElementById('picker').addEventListener('change', (e) => {
    console.log(e.detail.value, e.detail.label); // ex.: "186" "Tom"
  });
</script>
```

### `search`

Disparado só com `showSearch` ligado, conforme se digita na caixa de busca (com limitação de frequência). `event.detail` é `{ value }`, o texto de busca atual. O componente também filtra internamente as opções visíveis pelo rótulo.

```html
<r-select showSearch="true" id="searchable">
  <r-option value="185">Mike</r-option>
  <r-option value="186">Tom</r-option>
  <r-option value="187">Lucy</r-option>
</r-select>

<script>
  document.getElementById('searchable').addEventListener('search', (e) => {
    console.log(e.detail.value);
  });
</script>
```

### `show` / `after-show` / `hide` / `after-hide`

Disparados em torno das transições do painel. `show` e `hide` anunciam a intenção, quando a transição começa; `after-show` e `after-hide` disparam depois que o painel realmente chegou e qualquer animação terminou. É esse o par a escutar quando algo só pode acontecer depois que o painel some de verdade.

Eles não levam `detail`.

```html
<script>
  const picker = document.getElementById('picker');
  picker.addEventListener('show', () => console.log('abrindo'));
  picker.addEventListener('after-hide', () => console.log('fechado, e a animação acabou'));
</script>
```

O que se espera é a própria animação da folha de estilos, não uma duração copiada para o script — então sob `prefers-reduced-motion` (onde o painel não tem animação a tocar) o `after-hide` vem logo depois do `hide`, em vez de após um atraso fixo.

## Associação a formulários {#form-association}

O `r-select` é um elemento personalizado associado a formulários (`static formAssociated = true`). Ele repassa o `value` selecionado por meio do `ElementInternals`, então é recolhido por `new FormData(form)` sob o `name` do select, quando é descendente real de um `<form>` nativo. O valor do formulário nasce de qualquer seleção inicial na conexão e é mantido em sincronia conforme o valor muda.

**Reinício**: um `form.reset()` nativo restaura a seleção do `defaultValue`, se houver um, e caso contrário limpa a seleção por inteiro, via `formResetCallback()`.

**Validação**: `required` torna uma seleção vazia inválida via `ElementInternals.setValidity()`, visível para `form.checkValidity()` / `form.reportValidity()`; um select `disabled` nunca bloqueia a validação. `checkValidity()`, `reportValidity()`, `validity` e `validationMessage` estão expostos no elemento, igual a um campo nativo.

```html
<form>
  <r-select name="country" required>
    <r-option value="us">Estados Unidos</r-option>
    <r-option value="ca">Canadá</r-option>
  </r-select>
  <button type="submit">Enviar</button>
</form>
```

## Slots

| Slot     | Descrição                                                         |
| -------- | ----------------------------------------------------------------- |
| (padrão) | Aceita elementos `<r-option>` que definem as opções selecionáveis |

## Parts CSS

| Part             | Descrição                                               |
| ---------------- | ------------------------------------------------------- |
| `select`         | Invólucro raiz do select                                |
| `selection`      | A caixa do gatilho (borda, fundo, layout)               |
| `icon`           | O ícone de seta do menu                                 |
| `selection-item` | Elemento que mostra o rótulo da opção escolhida         |
| `search`         | O campo de busca embutido (visível com `showSearch`)    |
| `label`          | O rótulo fixo acima do campo (existe quando há `label`) |

## Boas práticas

- **Muitas opções**: ligue `showSearch` para que dê para filtrar pelo rótulo.
- **Forma de abrir**: ajuste `trigger` ao que as pessoas esperam; no celular o `hover` é ignorado, então mantenha o `click` disponível.
- **Onde monta**: em layouts com rolagem ou com corte por transbordo, use `getPopupContainerId` para controlar onde o menu é montado.
- **Estilos próprios**: use `dropdownclass` ou os nomes de `::part()` expostos para redesenhar o gatilho e o menu.
- **Formulários**: dê um `name` ao select para que o valor dele seja capturado pelo `FormData` dentro de um `<form>` nativo.
