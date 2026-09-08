---
description: 'O Checkbox do ranui (<r-checkbox>) alterna uma única escolha de sim ou não, com rótulo opcional e suporte a formulários nativos.'
---

# Checkbox

Componente de caixa de seleção para alternar uma única escolha de sim ou não, com rótulo opcional e suporte a formulários nativos.

> **Use quando** precisar de um único alternador de sim ou não com rótulo que participe de formulários nativos: o `<r-checkbox>` informa o estado marcado ao `FormData` e é operável pelo teclado.

## Início rápido

### Uso básico

<ran-demo>
  <r-checkbox>Lembrar de mim</r-checkbox>
</ran-demo>

```html
<r-checkbox>Lembrar de mim</r-checkbox>
```

O conteúdo do slot padrão vira o rótulo da caixa.

## Referência da API

### Propriedades

| Propriedade | Tipo      | Padrão    | Descrição                                                       |
| ----------- | --------- | --------- | --------------------------------------------------------------- |
| `checked`   | `boolean` | `false`   | Se a caixa está marcada                                         |
| `value`     | `string`  | `'false'` | Valor de formulário; espelha o estado como `'true'` / `'false'` |
| `disabled`  | `boolean` | `false`   | Se a caixa está desabilitada                                    |
| `required`  | `boolean` | `false`   | Se ela precisa estar marcada para o formulário ser enviado      |
| `sheet`     | `string`  | `''`      | CSS injetado no shadow DOM do componente para estilos próprios  |

> Os atributos `checked` e `value` ficam em sincronia: definir um atualiza o outro. Marcada, `value` é `'true'`; desmarcada, `'false'`.

### Estado marcado `checked`

<ran-demo>
  <r-checkbox checked="true">Marcada</r-checkbox>
  <r-checkbox checked="false">Desmarcada</r-checkbox>
</ran-demo>

```html
<r-checkbox checked="true">Marcada</r-checkbox> <r-checkbox checked="false">Desmarcada</r-checkbox>
```

### Valor `value`

<ran-demo>
  <r-checkbox value="true">Valor true</r-checkbox>
  <r-checkbox value="false">Valor false</r-checkbox>
</ran-demo>

```html
<r-checkbox value="true">Valor true</r-checkbox> <r-checkbox value="false">Valor false</r-checkbox>
```

### Estado desabilitado `disabled`

<ran-demo>
  <r-checkbox checked="true" disabled>Marcada</r-checkbox>
  <r-checkbox checked="false" disabled>Desmarcada</r-checkbox>
</ran-demo>

```html
<r-checkbox checked="true" disabled>Marcada</r-checkbox> <r-checkbox checked="false" disabled>Desmarcada</r-checkbox>
```

### Estilo próprio `sheet`

O atributo `sheet` injeta CSS no shadow DOM, deixando você mirar as partes internas pelos nomes de classe.

<ran-demo>
  <r-checkbox checked="true" sheet=".ran-checkbox-label { color: #006bff; }">Rótulo com tema</r-checkbox>
</ran-demo>

```html
<r-checkbox checked="true" sheet=".ran-checkbox-label { color: #006bff; }">Rótulo com tema</r-checkbox>
```

## Eventos

### `change`

Disparado quando a caixa é alternada (por clique ou ao apertar Espaço/Enter). O evento é um `CustomEvent` cujo `detail` carrega o novo estado:

```ts
detail: {
  checked: boolean; // o estado da caixa depois da alternância
}
```

Uma caixa desabilitada não dispara `change`.

<ran-demo>
  <r-checkbox onchange="message.info(this)">Alterne-me</r-checkbox>
</ran-demo>

```html
<r-checkbox onchange="handleChange(event)">Alterne-me</r-checkbox>

<script>
  function handleChange(event) {
    console.log('checked:', event.detail.checked);
  }
</script>
```

## Slots

| Slot     | Descrição                                        |
| -------- | ------------------------------------------------ |
| (padrão) | O rótulo da caixa, desenhado ao lado do quadrado |

## Associação com formulários {#form-association}

O `r-checkbox` é um custom element associado a formulários (`formAssociated = true`). Ele repassa o estado marcado por `ElementInternals.setFormValue`, então participa de formulários nativos e é recolhido por `new FormData(form)` quando é descendente real de um `<form>` nativo. Seguindo a semântica da caixa nativa, ele contribui com o `value` apenas quando está marcado.

O próprio host carrega a semântica acessível de caixa: `role="checkbox"`, `aria-checked`, `aria-disabled` e operação pelo teclado (alterna com Espaço ou Enter).

**Reinício**: um `form.reset()` nativo restaura o estado marcado que a caixa tinha ao se conectar pela primeira vez, via `formResetCallback()`.

**Validação**: `required` torna uma caixa desmarcada inválida via `ElementInternals.setValidity()`, visível para `form.checkValidity()`/`form.reportValidity()`; uma caixa `disabled` nunca bloqueia a validação. `checkValidity()`, `reportValidity()`, `validity` e `validationMessage` estão expostos no elemento, como num campo nativo.

```html
<form>
  <r-checkbox name="terms" required>Concordo com os termos</r-checkbox>
  <button type="submit">Enviar</button>
</form>
```

## Partes CSS

Estilize a estrutura interna com o seletor `::part()`:

| Parte      | Elemento                                                      |
| ---------- | ------------------------------------------------------------- |
| `wrapper`  | O contêiner flex externo com o quadrado e o rótulo            |
| `checkbox` | O contêiner do quadrado                                       |
| `input`    | O `<input type="checkbox">` escondido visualmente             |
| `inner`    | O quadrado desenhado (borda, preenchimento, marca de seleção) |
| `label`    | O rótulo que envolve o slot padrão                            |

```css
r-checkbox::part(inner) {
  border-radius: 50%;
}
r-checkbox::part(label) {
  font-weight: 600;
}
```

## Estilos

O `<r-checkbox>` expõe **32 propriedades personalizadas de CSS** próprias, além dos tokens
semânticos que lê do tema. Defina uma em qualquer lugar de onde ela seja herdada: `:root`, um
contêiner ou o próprio elemento:

```css
r-checkbox {
  --ran-checkbox-color: var(--ran-color-text-secondary);
}
```

Partes: `checkbox` · `inner` · `input` · `label` · `wrapper`

A lista completa está em [tokens de estilo](/pt/src/ranui/style-tokens#checkbox); qual token escolher é assunto do [design system](/pt/src/ranui/design-system/).

## Boas práticas

- **Rotule suas caixas**: coloque texto no slot para que o controle tenha um nome acessível.
- **`checked` e `value`**: use `checked` para o estado booleano; leia `value` (`'true'` / `'false'`) ao recolher os dados do formulário.
- **Estado desabilitado**: use `disabled` quando a escolha não estiver disponível.
- **Escute `change`**: leia `event.detail.checked` em vez de consultar o DOM de novo.
- **Formulários**: coloque o `r-checkbox` dentro de um `<form>`; o valor é recolhido sozinho quando marcado. Veja [Forms](/pt/src/ranui/form/) para o auxiliar `serializeForm()`, que transforma um envio num objeto simples.
