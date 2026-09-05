---
description: 'El Checkbox de ranui (<r-checkbox>) alterna una única elección de sí o no, con etiqueta opcional y soporte para formularios nativos.'
---

# Checkbox

Componente de casilla para alternar una única elección de sí o no, con etiqueta opcional y soporte para formularios nativos.

> **Úsalo cuando** necesites un único interruptor de sí o no con etiqueta que participe en formularios nativos: `<r-checkbox>` comunica su estado marcado a `FormData` y se maneja con el teclado.

## Inicio rápido

### Uso básico

<Demo>
  <r-checkbox>Recuérdame</r-checkbox>
</Demo>

```html
<r-checkbox>Recuérdame</r-checkbox>
```

El contenido del slot por defecto se convierte en la etiqueta de la casilla.

## Referencia de la API

### Propiedades

| Propiedad  | Tipo      | Por defecto | Descripción                                                        |
| ---------- | --------- | ----------- | ------------------------------------------------------------------ |
| `checked`  | `boolean` | `false`     | Si la casilla está marcada                                         |
| `value`    | `string`  | `'false'`   | Valor de formulario; refleja el estado como `'true'` / `'false'`   |
| `disabled` | `boolean` | `false`     | Si la casilla está deshabilitada                                   |
| `required` | `boolean` | `false`     | Si hay que marcarla para que el formulario se envíe                |
| `sheet`    | `string`  | `''`        | CSS inyectado en el shadow DOM del componente para estilos propios |

> Los atributos `checked` y `value` se mantienen sincronizados: definir uno actualiza el otro. Marcada, `value` es `'true'`; sin marcar, `'false'`.

### Estado marcado `checked`

<Demo>
  <r-checkbox checked="true">Marcada</r-checkbox>
  <r-checkbox checked="false">Sin marcar</r-checkbox>
</Demo>

```html
<r-checkbox checked="true">Marcada</r-checkbox> <r-checkbox checked="false">Sin marcar</r-checkbox>
```

### Valor `value`

<Demo>
  <r-checkbox value="true">Valor true</r-checkbox>
  <r-checkbox value="false">Valor false</r-checkbox>
</Demo>

```html
<r-checkbox value="true">Valor true</r-checkbox> <r-checkbox value="false">Valor false</r-checkbox>
```

### Estado deshabilitado `disabled`

<Demo>
  <r-checkbox checked="true" disabled>Marcada</r-checkbox>
  <r-checkbox checked="false" disabled>Sin marcar</r-checkbox>
</Demo>

```html
<r-checkbox checked="true" disabled>Marcada</r-checkbox> <r-checkbox checked="false" disabled>Sin marcar</r-checkbox>
```

### Estilos propios `sheet`

El atributo `sheet` inyecta CSS en el shadow DOM y te permite apuntar a las partes internas por su nombre de clase.

<Demo>
  <r-checkbox checked="true" sheet=".ran-checkbox-label { color: #006bff; }">Etiqueta con tema</r-checkbox>
</Demo>

```html
<r-checkbox checked="true" sheet=".ran-checkbox-label { color: #006bff; }">Etiqueta con tema</r-checkbox>
```

## Eventos

### `change`

Se dispara cuando la casilla se alterna (por clic o al pulsar Espacio/Intro). El evento es un `CustomEvent` cuyo `detail` lleva el nuevo estado:

```ts
detail: {
  checked: boolean; // el estado de la casilla tras el cambio
}
```

Una casilla deshabilitada no dispara `change`.

<Demo>
  <r-checkbox onchange="message.info(this)">Púlsame</r-checkbox>
</Demo>

```html
<r-checkbox onchange="handleChange(event)">Púlsame</r-checkbox>

<script>
  function handleChange(event) {
    console.log('checked:', event.detail.checked);
  }
</script>
```

## Slots

| Slot          | Descripción                                         |
| ------------- | --------------------------------------------------- |
| (por defecto) | La etiqueta de la casilla, dibujada junto al cuadro |

## Asociación con formularios {#form-association}

`r-checkbox` es un custom element asociado a formularios (`formAssociated = true`). Comunica su estado marcado mediante `ElementInternals.setFormValue`, así que participa en formularios nativos y `new FormData(form)` lo recoge cuando es descendiente real de un `<form>` nativo. Siguiendo la semántica de la casilla nativa, aporta su `value` solo cuando está marcada.

El propio host lleva la semántica accesible de casilla: `role="checkbox"`, `aria-checked`, `aria-disabled` y manejo por teclado (alterna con Espacio o Intro).

**Reinicio**: un `form.reset()` nativo devuelve la casilla al estado marcado que tenía al conectarse por primera vez, mediante `formResetCallback()`.

**Validación**: `required` hace inválida una casilla sin marcar mediante `ElementInternals.setValidity()`, algo visible para `form.checkValidity()`/`form.reportValidity()`; una casilla `disabled` nunca bloquea la validación. `checkValidity()`, `reportValidity()`, `validity` y `validationMessage` están disponibles en el elemento, igual que en un campo nativo.

```html
<form>
  <r-checkbox name="terms" required>Acepto los términos</r-checkbox>
  <button type="submit">Enviar</button>
</form>
```

## Partes CSS

Da estilo a la estructura interna con el selector `::part()`:

| Parte      | Elemento                                                   |
| ---------- | ---------------------------------------------------------- |
| `wrapper`  | El contenedor flex exterior con el cuadro y la etiqueta    |
| `checkbox` | El contenedor del cuadro                                   |
| `input`    | El `<input type="checkbox">` oculto visualmente            |
| `inner`    | El cuadro dibujado (borde, relleno, marca de verificación) |
| `label`    | La etiqueta que envuelve el slot por defecto               |

```css
r-checkbox::part(inner) {
  border-radius: 50%;
}
r-checkbox::part(label) {
  font-weight: 600;
}
```

## Estilos

`<r-checkbox>` expone **32 propiedades personalizadas de CSS** propias, además de los tokens
semánticos que lee del tema. Define una allí donde se herede: `:root`, un contenedor o el propio
elemento:

```css
r-checkbox {
  --ran-checkbox-color: var(--ran-color-text-secondary);
}
```

Partes: `checkbox` · `inner` · `input` · `label` · `wrapper`

La lista completa está en [tokens de estilo](/es/src/ranui/style-tokens#checkbox); cuál elegir lo explica el [sistema de diseño](/es/src/ranui/design-system/).

## Buenas prácticas

- **Etiqueta tus casillas**: pon texto en el slot para que el control tenga un nombre accesible.
- **`checked` frente a `value`**: usa `checked` para el estado booleano; lee `value` (`'true'` / `'false'`) al recoger los datos del formulario.
- **Estado deshabilitado**: usa `disabled` cuando la elección no esté disponible.
- **Escucha `change`**: lee `event.detail.checked` en lugar de volver a consultar el DOM.
- **Formularios**: pon `r-checkbox` dentro de un `<form>`; su valor se recoge solo cuando está marcada. Consulta [Forms](/es/src/ranui/form/) para el ayudante `serializeForm()`, que convierte un envío en un objeto plano.
