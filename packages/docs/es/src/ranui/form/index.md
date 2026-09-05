---
description: 'Cómo construir formularios con ranui: r-input, r-checkbox y r-select funcionan directamente dentro de un <form> nativo, sin componente envoltorio.'
---

# Forms

ranui no incluye ningún componente que envuelva a `<form>`. `r-input`, `r-checkbox` y `r-select` son ellos mismos [Form-Associated Custom Elements](https://developer.mozilla.org/es/docs/Web/API/Web_components/Using_form-associated_custom_elements) (cada uno llama a `attachInternals()` y transmite su valor con `ElementInternals.setFormValue()`), así que ya funcionan dentro de un `<form>` nativo: `new FormData(form)` los recoge, `form.reset()` restaura su estado previo a la interacción y un campo `required` bloquea el envío y muestra la validación nativa del navegador anclada al campo. Nada de eso necesita marcado propio de ranui.

> **Úsalo cuando** estés montando un formulario con `r-input`/`r-checkbox`/`r-select`: usa un `<form>` de verdad y recurre a `serializeForm()` (más abajo) si quieres los valores enviados como objeto plano en lugar de escribir a mano la iteración de `FormData`.

## Inicio rápido

Los tres tipos de campo, enviados con un `<form>` normal. Cambia un campo y envía para ver el resultado abajo. Esta demo construye el objeto con el propio `FormData`/`Object.fromEntries` del navegador (sin importar nada); `serializeForm()`, que viene a continuación, hace lo mismo más una cosa que `Object.fromEntries` no puede: un nombre de campo repetido vuelve como array en lugar de quedarse en silencio solo con el último valor.

<Demo column>
  <form style="display: flex; flex-direction: column; gap: 16px; width: 100%; max-width: 320px;" onsubmit="event.preventDefault(); message.info(JSON.stringify(Object.fromEntries(new FormData(this))))">
    <r-input name="username" label="Usuario" placeholder="Escribe tu usuario"></r-input>
    <r-select name="role" label="Rol" style="width: 100%" defaultValue="member">
      <r-option value="member">Miembro</r-option>
      <r-option value="admin">Administrador</r-option>
    </r-select>
    <r-checkbox name="subscribe">Suscribirme al boletín</r-checkbox>
    <r-button type="primary"><button type="submit" style="all: unset; cursor: pointer">Enviar</button></r-button>
  </form>
</Demo>

> Como cuenta la sección [Maquetación](#layout) más abajo: los campos no traen ninguna
> maquetación propia a nivel de formulario, así que todos los ejemplos de esta página
> (incluido este) dan su propio CSS al `<form>` (`display: flex; flex-direction: column;
gap: …`). Omitirlo apila los campos en el flujo normal sin separación entre ellos, lo que
> se lee como algo roto o superpuesto en lugar de como un formulario.

```html
<form id="signup" style="display: flex; flex-direction: column; gap: 16px;">
  <r-input name="username" label="Usuario" placeholder="Escribe tu usuario"></r-input>
  <r-select name="role" label="Rol" defaultValue="member">
    <r-option value="member">Miembro</r-option>
    <r-option value="admin">Administrador</r-option>
  </r-select>
  <r-checkbox name="subscribe">Suscribirme al boletín</r-checkbox>
  <button type="submit">Enviar</button>
</form>

<script type="module">
  import { serializeForm } from 'ranui';

  document.getElementById('signup').addEventListener('submit', (event) => {
    event.preventDefault(); // un <form> de verdad, si no, navega la página
    console.log(serializeForm(event.target)); // { username: '...', role: 'member', subscribe: 'true' }
  });
</script>
```

## `serializeForm(form)`

Recoge los campos con nombre de un `<form>` en un objeto plano mediante `FormData`: el andamiaje que todo el mundo escribe a mano para convertir un envío en algo que pueda pasar por `JSON.stringify` o enviarse como cuerpo de un fetch. Es una función normal, sin dependencia de los campos de ranui en particular; sirve con cualquier `<form>` de verdad.

```ts
function serializeForm(form: HTMLFormElement): Record<string, unknown>;
```

Un campo con más de un valor bajo el mismo `name` (por ejemplo, varias casillas que comparten nombre) vuelve como array; todo lo demás vuelve como valor único.

```ts
import { serializeForm } from 'ranui';

const data = serializeForm(document.querySelector('form'));
// { username: 'alice', tags: ['a', 'b'] }
fetch('/api/signup', { method: 'POST', body: JSON.stringify(data) });
```

## Maquetación {#layout}

Los campos no traen maquetación de formulario por defecto: da estilo a tu propio `<form>` con CSS normal:

<Demo column>
  <form style="display: flex; flex-direction: column; gap: 16px;">
    <r-input name="first" label="Nombre"></r-input>
    <r-input name="last" label="Apellidos"></r-input>
    <r-button type="primary"><button type="submit" style="all: unset; cursor: pointer">Continuar</button></r-button>
  </form>
</Demo>

```html
<form style="display: flex; flex-direction: column; gap: 16px;">
  <r-input name="first" label="Nombre"></r-input>
  <r-input name="last" label="Apellidos"></r-input>
  <button type="submit">Continuar</button>
</form>
```

## Validación y reinicio

`r-input`, `r-checkbox` y `r-select` admiten `required` (que bloquea el envío y lanza la burbuja de validación nativa del navegador, exactamente como un campo nativo) además de `checkValidity()`, `reportValidity()`, `validity` y `validationMessage`. Un `form.reset()` nativo (o un `<button type="reset">`) devuelve cada campo a su estado previo a la interacción mediante `formResetCallback()`. Consulta la documentación de cada campo ([Input](/es/src/ranui/input/#form-association), [Checkbox](/es/src/ranui/checkbox/#form-association), [Select](/es/src/ranui/select/#form-association)) para los detalles.

<Demo column>
  <form style="display: flex; flex-direction: column; gap: 16px; width: 100%; max-width: 320px;" onsubmit="event.preventDefault(); message.success('Valid — submitted')">
    <r-input name="username" label="Usuario" required></r-input>
    <r-button type="primary"><button type="submit" style="all: unset; cursor: pointer">Enviar</button></r-button>
  </form>
</Demo>

```html
<form style="display: flex; flex-direction: column; gap: 16px;">
  <r-input name="username" label="Usuario" required></r-input>
  <button type="submit">Enviar</button>
</form>
```

## ¿Por qué no hay un envoltorio `<r-form>`?

Un `<form>` nativo ya basta: los componentes de campo de ranui funcionan dentro de uno directamente, sin envoltorio. `serializeForm()` cubre el único hueco real: convertir un envío en un objeto plano.
