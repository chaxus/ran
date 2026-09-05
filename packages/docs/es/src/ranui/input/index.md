---
description: 'El Input de ranui (<r-input>) es el control de formulario básico para escribir con el teclado, con tipos, tamaños y validación, hecho como Web Component nativo para cualquier framework.'
---

# Input

Componente de entrada para escribir contenido con el teclado: el control de formulario más básico.

> **Úsalo cuando** necesites un campo de texto con etiqueta fija encima, icono a la izquierda, estado y mensaje de validación, y participación en formularios nativos: `<r-input>` cubre la entrada de texto, contraseña y números.

## Inicio rápido

### Uso básico

<Demo column>
  <r-input placeholder="Escribe algo"></r-input>
</Demo>

```html
<r-input placeholder="Escribe algo"></r-input>
```

## Referencia de la API

### Propiedades

| Propiedad     | Tipo      | Por defecto | Descripción                                                                |
| ------------- | --------- | ----------- | -------------------------------------------------------------------------- |
| `label`       | `string`  | `''`        | Rótulo fijo dibujado encima del campo                                      |
| `placeholder` | `string`  | `''`        | Texto de marcador, reenviado al `<input>` nativo                           |
| `value`       | `string`  | `''`        | Valor del campo; se refleja como atributo y se transmite al formulario     |
| `disabled`    | `boolean` | `false`     | Si el campo está deshabilitado                                             |
| `type`        | `string`  | `''`        | Tipo nativo reenviado al control interno (`text`, `password`, `number`, …) |
| `icon`        | `string`  | `''`        | Nombre del icono inicial dentro del campo (se dibuja como `r-icon`)        |
| `name`        | `string`  | `''`        | Nombre del campo cuando participa en un formulario                         |
| `status`      | `string`  | `''`        | Estado de validación: `error`, `warning`                                   |
| `message`     | `string`  | `''`        | Texto de ayuda o de validación dibujado bajo el campo                      |
| `min`         | `string`  | `''`        | Valor mínimo; se reenvía al `<input>` interno cuando `type="number"`       |
| `max`         | `string`  | `''`        | Valor máximo; se reenvía al `<input>` interno cuando `type="number"`       |
| `step`        | `string`  | `''`        | Paso del valor; se reenvía al `<input>` interno cuando `type="number"`     |
| `required`    | `boolean` | `false`     | Se reenvía al `<input>` interno para que actúe la validación nativa        |
| `sheet`       | `string`  | `''`        | CSS inyectado en el shadow root                                            |

### Etiqueta `label`

Un rótulo fijo dibujado encima del campo: siempre visible, nunca se solapa con el contenido contiguo y no descoloca la maquetación al enfocar (las etiquetas alineadas arriba, además, se completan más rápido que las en línea o flotantes; véase [la investigación con seguimiento ocular de Luke Wroblewski](https://www.lukew.com/ff/entry.asp?504=)).

<Demo column>
  <r-input label="Nombre de usuario"></r-input>
</Demo>

```html
<r-input label="Nombre de usuario"></r-input>
```

### Marcador `placeholder`

Se comporta igual que el atributo `placeholder` nativo.

<Demo column>
  <r-input placeholder="Escribe tu nombre de usuario"></r-input>
</Demo>

```html
<r-input placeholder="Escribe tu nombre de usuario"></r-input>
```

### Valor `value`

<Demo column>
  <r-input value="1234"></r-input>
</Demo>

```html
<r-input value="1234"></r-input>
```

### Estado deshabilitado `disabled`

<Demo column>
  <r-input label="Nombre de usuario" disabled></r-input>
</Demo>

```html
<r-input label="Nombre de usuario" disabled></r-input>
```

### Icono `icon`

<Demo column>
  <r-input icon="user"></r-input>
</Demo>

```html
<r-input icon="user"></r-input>
```

### Tipos de entrada `type`

<Demo column>
  <r-input icon="lock" type="password" placeholder="Contraseña"></r-input>
  <r-input type="number" placeholder="Número"></r-input>
</Demo>

```html
<r-input icon="lock" type="password" placeholder="Contraseña"></r-input>
<r-input type="number" placeholder="Número"></r-input>
```

### Estado `status`

Acompaña siempre `status` de un `message`, para que el estado lo comunique el texto y no solo el color.

<Demo column>
  <r-input status="error" label="Nombre de usuario" message="Este campo es obligatorio"></r-input>
  <r-input status="warning" label="Nombre de usuario" message="Revisa este valor"></r-input>
</Demo>

```html
<r-input status="error" label="Nombre de usuario" message="Este campo es obligatorio"></r-input>
<r-input status="warning" label="Nombre de usuario" message="Revisa este valor"></r-input>
```

### Mensaje de ayuda `message`

Dibuja texto de ayuda o de validación bajo el campo.

<Demo column>
  <r-input label="Correo" message="Nunca compartiremos tu correo"></r-input>
</Demo>

```html
<r-input label="Correo" message="Nunca compartiremos tu correo"></r-input>
```

### Nombre del campo `name`

```html
<r-input name="username" label="Nombre de usuario"></r-input>
```

## Eventos

Ambos eventos se despachan como `CustomEvent` y llevan el valor actual en `detail`.

| Evento   | Cuándo se dispara                                          | `detail`            |
| -------- | ---------------------------------------------------------- | ------------------- |
| `input`  | En cada pulsación (refleja el `input` nativo)              | `{ value: string }` |
| `change` | Al confirmar o perder el foco (refleja el `change` nativo) | `{ value: string }` |

### Evento de escritura `input`

<Demo column>
  <r-input oninput="console.log(event.detail.value)" label="Nombre de usuario"></r-input>
</Demo>

```javascript
const input = document.createElement('r-input');
input.setAttribute('label', 'Nombre de usuario');
input.addEventListener('input', (event) => {
  console.log('Escribiendo:', event.detail.value);
});
```

### Evento de cambio `change`

<Demo column>
  <r-input onchange="console.log(event.detail.value)" label="Nombre de usuario"></r-input>
</Demo>

```javascript
const input = document.createElement('r-input');
input.setAttribute('label', 'Nombre de usuario');
input.addEventListener('change', (event) => {
  console.log('El valor cambió:', event.detail.value);
});
```

## Asociación con formularios {#form-association}

`r-input` es un elemento personalizado asociado a formularios (`static formAssociated = true`). Adjunta `ElementInternals` y transmite su valor con `setFormValue`, así que `new FormData(form)` lo recoge cuando es descendiente real de un `<form>` nativo; pon `name` para darle una clave al valor. Consulta [Formularios](/es/src/ranui/form/) para el ayudante `serializeForm()`, que convierte un envío en un objeto plano.

```html
<form>
  <r-input name="username" label="Nombre de usuario"></r-input>
</form>
```

**Reinicio**: un `form.reset()` nativo (o un `<button type="reset">`) devuelve el valor que el campo tenía al conectarse por primera vez, mediante `formResetCallback()`, uno de los ganchos de ciclo de vida que el navegador llama solo en un elemento personalizado asociado a formularios.

**Validación**: poner `required` hace que un campo vacío sea inválido a través de `ElementInternals.setValidity()`; `form.checkValidity()` / `form.reportValidity()` lo ven, y al enviar aparece el globo de validación nativo del navegador anclado al campo. Los campos `disabled` nunca bloquean la validación, igual que un `<input>` nativo. `r-input` expone además los métodos y propiedades habituales de un campo nativo: `checkValidity()`, `reportValidity()`, `validity`, `validationMessage`.

```html
<form>
  <r-input name="username" label="Nombre de usuario" required></r-input>
  <button type="submit">Enviar</button>
</form>
```

## Parts CSS

Expuestos vía `::part()` para darles estilo desde fuera.

| Part      | Elemento                                                     |
| --------- | ------------------------------------------------------------ |
| `input`   | El envoltorio del campo                                      |
| `content` | El control `<input>` nativo interno                          |
| `label`   | La etiqueta fija sobre el campo (existe cuando hay `label`)  |
| `message` | El texto de ayuda o validación (existe cuando hay `message`) |

```css
r-input::part(content) {
  font-size: 16px;
}
```

## Estilos

`<r-input>` expone **61 propiedades personalizadas de CSS** propias, además de los tokens semánticos que lee del tema. Define una allí donde se herede: `:root`, un contenedor o el propio elemento:

```css
r-input {
  --ran-input-color: var(--ran-color-text-secondary);
}
```

Partes: `content` · `input` · `label` · `message`

La lista completa está en [tokens de estilo](/es/src/ranui/style-tokens#input); cuál usar lo explica el [sistema de diseño](/es/src/ranui/design-system/).

## Buenas prácticas

- **Etiquetas**: añade un `label` con sentido para que el campo tenga un nombre accesible.
- **Marcadores**: usa `placeholder` como pista de escritura, no como sustituto de la etiqueta.
- **Estado y mensaje**: acompaña `status` de `message` para que el estado no dependa solo del color.
- **Iconos**: añade un `icon` pertinente para que el campo se reconozca antes.
- **Tipos**: elige el `type` adecuado al contenido (`text`, `password`, `number`, …).
- **Formularios**: pon `name` cuando recojas el valor dentro de un formulario.
