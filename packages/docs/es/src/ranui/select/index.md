---
description: 'El Select de ranui (<r-select>) es un desplegable para elegir un valor entre varias opciones, con búsqueda opcional y participación en formularios nativos.'
---

# Select

Selector desplegable para elegir un único valor de una lista de opciones, con búsqueda opcional y participación en formularios.

> **Úsalo cuando** necesites un desplegable de un solo valor construido con hijos `<r-option>`, con búsqueda opcional y participación en formularios nativos. `<r-select>` se encarga de abrir, filtrar y entregar el valor a `FormData`.

## Inicio rápido

### Uso básico

Las opciones se dan como hijos `<r-option>` en el slot. El atributo `value` de cada opción es su valor, y su texto es la etiqueta que se muestra.

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

## Referencia de la API

### Propiedades

| Propiedad             | Tipo      | Por defecto | Descripción                                                                                                                                                           |
| --------------------- | --------- | ----------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `label`               | `string`  | `''`        | Rótulo fijo sobre el campo (el mismo patrón que el `label` de `r-input`), para que un select con etiqueta se alinee con un input con etiqueta dentro de un formulario |
| `value`               | `string`  | `''`        | Valor seleccionado. Asignarlo actualiza la etiqueta en estado cerrado; se ignora mientras esté `disabled`                                                             |
| `defaultValue`        | `string`  | `''`        | Valor seleccionado al inicio, cotejado con el `value` de las opciones                                                                                                 |
| `disabled`            | `boolean` | `false`     | Si el select está deshabilitado                                                                                                                                       |
| `type`                | `string`  | `''`        | `text` dibuja un disparador sin borde ni fondo y sin flecha; en otro caso, con borde                                                                                  |
| `open`                | `boolean` | `false`     | Si el desplegable está a la vista. Esto _es_ el estado: asígnalo para abrir o cerrar el panel                                                                         |
| `placement`           | `string`  | `'bottom'`  | Por qué lado se abre el desplegable, con una alineación opcional: `bottom`, `bottom-end`, `top-center`, …                                                             |
| `showSearch`          | `boolean` | `false`     | Muestra un buscador incorporado que filtra las opciones por su etiqueta                                                                                               |
| `getPopupContainerId` | `string`  | `''`        | `id` del elemento donde montar el desplegable (por defecto, `document.body`)                                                                                          |
| `dropdownclass`       | `string`  | `''`        | Clase personalizada aplicada al panel desplegable                                                                                                                     |
| `trigger`             | `string`  | `'click'`   | Cómo se abre el desplegable: `click`, `hover` o `click,hover` (en móvil se ignora `hover`)                                                                            |
| `required`            | `boolean` | `false`     | Si hace falta una selección para que el formulario se envíe                                                                                                           |
| `sheet`               | `string`  | `''`        | CSS inyectado en el shadow DOM                                                                                                                                        |

> **Nota:** `defaultValue` y `showSearch` son reactivos: cambiarlos después de que el elemento se haya conectado se vuelve a procesar (junto con `value`, `disabled` y `sheet`) en `attributeChangedCallback`. Actualizar `defaultValue` reaplica la selección que coincida; alternar `showSearch` conecta o desconecta el buscador incorporado.

### Propiedades de las opciones

Las opciones se dan mediante elementos hijos `<r-option>`.

| Propiedad  | Tipo      | Por defecto | Descripción                                                                               |
| ---------- | --------- | ----------- | ----------------------------------------------------------------------------------------- |
| `value`    | `string`  | `''`        | Valor de la opción; se emite como valor del select cuando se elige                        |
| `disabled` | `boolean` | `false`     | Marca la opción como no seleccionable; el select la salta tanto con clic como con teclado |
| `sheet`    | `string`  | `''`        | CSS inyectado en el shadow DOM de la opción                                               |

Las opciones con etiquetas o valores repetidos registran un `console.warn`.

### Etiqueta `label`

Un rótulo fijo dibujado encima del campo: siempre visible, nunca se solapa con el contenido contiguo. Usa los mismos tokens y la misma maquetación que el `label` de `r-input`, así que un select con etiqueta y un input con etiqueta puestos uno al lado del otro en un formulario quedan alineados (misma altura, mismo borde superior).

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

### Estado deshabilitado `disabled`

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

### Dirección del desplegable `placement`

`placement` es una preferencia, no una garantía: cuando el disparador está cerca del borde de la ventana y al lado preferido le falta sitio, el desplegable voltea solo al otro lado y se desplaza en horizontal para no salirse de la pantalla. Esto solo se aplica al montaje por defecto a nivel de `body`; con `getPopupContainerId` puesto, elige un `placement` que quepa en el contenedor.

Un lado puede llevar un sufijo de alineación: `bottom-end`, `top-center`, etcétera, la misma gramática que acepta `r-popover`. Un lado a secas significa `-start`, que alinea el borde inicial del panel con el del disparador.

El sufijo solo cambia algo cuando el panel tiene una anchura distinta a la de su disparador, ya que por defecto el panel sigue el ancho del disparador. Ensánchalo (`r-dropdown::part(dropdown)`, al que se llega mediante `dropdownclass`, porque el panel se portaliza a `<body>` en vez de vivir en el shadow root del select) y la alineación se calcula contra lo que se pinta de verdad:

```html
<style>
  r-dropdown.wide::part(dropdown) {
    min-width: 220px;
  }
</style>

<!-- el borde derecho del panel sobre el borde derecho del disparador -->
<r-select placement="bottom-end" dropdownclass="wide" style="width: 80px">
  <r-option value="a">Una etiqueta de opción bien larga</r-option>
</r-select>
```

Ten en cuenta que el desplazamiento por el borde manda sobre la alineación: a un disparador lo bastante cerca del borde de la ventana se le empuja el panel de vuelta a la pantalla, sea cual sea la alineación pedida.

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

### Estado de apertura `open`

`open` es el estado del desplegable, reflejado como atributo igual que en `<details open>` y `<dialog open>`. Nada deduce el estado del `display` del panel (que va por detrás lo que dure la animación de salida), así que el atributo, `aria-expanded` y lo que se ve en pantalla no pueden contradecirse.

Eso lo convierte en una forma admitida de gobernar el componente, y en algo a lo que dar estilo y sobre lo que hacer aserciones:

```html
<r-select id="picker" open>
  <r-option value="185">Mike</r-option>
</r-select>

<script>
  const picker = document.getElementById('picker');
  picker.open = true; // o picker.show()
  picker.open = false; // o picker.hide()
  picker.toggle();
</script>

<style>
  /* el disparador, mientras su panel está abierto */
  r-select[open]::part(selection) {
    border-color: var(--ran-color-primary);
  }
</style>
```

`show()`, `hide()` y `toggle()` son envoltorios finos sobre él, para cuando un método se lee mejor que una asignación.

### Función de búsqueda `showSearch`

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
<!-- Apertura con clic (por defecto) -->
<r-select trigger="click">
  <r-option value="185">Mike</r-option>
  <r-option value="186">Tom</r-option>
  <r-option value="187">Lucy</r-option>
</r-select>

<!-- Apertura al pasar el cursor (se ignora en móvil) -->
<r-select trigger="hover">
  <r-option value="185">Mike</r-option>
  <r-option value="186">Tom</r-option>
  <r-option value="187">Lucy</r-option>
</r-select>

<!-- Clic y cursor a la vez -->
<r-select trigger="click,hover">
  <r-option value="185">Mike</r-option>
  <r-option value="186">Tom</r-option>
  <r-option value="187">Lucy</r-option>
</r-select>
```

### Contenedor de montaje `getPopupContainerId`

Por defecto, el desplegable se portaliza a `document.body`. Pasa el `id` de otro elemento para montarlo allí.

```html
<r-select getPopupContainerId="my-container">
  <r-option value="185">Mike</r-option>
  <r-option value="186">Tom</r-option>
  <r-option value="187">Lucy</r-option>
</r-select>
```

### Clase personalizada del desplegable `dropdownclass`

```html
<r-select dropdownclass="custom-dropdown">
  <r-option value="185">Mike</r-option>
  <r-option value="186">Tom</r-option>
  <r-option value="187">Lucy</r-option>
</r-select>
```

## Eventos

### `change`

Se dispara al elegir una opción. `event.detail` es `{ value, label }`, donde `value` es el valor de la opción elegida y `label` su texto visible. Seleccionar el `defaultValue` inicial no dispara `change`.

```html
<r-select id="picker">
  <r-option value="185">Mike</r-option>
  <r-option value="186">Tom</r-option>
  <r-option value="187">Lucy</r-option>
</r-select>

<script>
  document.getElementById('picker').addEventListener('change', (e) => {
    console.log(e.detail.value, e.detail.label); // p. ej. "186" "Tom"
  });
</script>
```

### `search`

Se dispara solo con `showSearch` activo, mientras se escribe en el buscador (con limitación de frecuencia). `event.detail` es `{ value }`, el texto de búsqueda actual. El componente además filtra por dentro las opciones visibles según su etiqueta.

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

Se disparan alrededor de las transiciones del panel. `show` y `hide` anuncian la intención, cuando la transición empieza; `after-show` y `after-hide` se disparan una vez que el panel ha llegado de verdad y cualquier animación ha terminado. Ese es el par que hay que escuchar cuando algo debe ocurrir solo después de que el panel se haya ido del todo.

No llevan `detail`.

```html
<script>
  const picker = document.getElementById('picker');
  picker.addEventListener('show', () => console.log('abriendo'));
  picker.addEventListener('after-hide', () => console.log('cerrado, y con la animación terminada'));
</script>
```

Lo que se espera es la animación de la propia hoja de estilos, no una duración copiada al script, así que bajo `prefers-reduced-motion` (donde el panel no tiene animación que reproducir) `after-hide` sigue a `hide` de inmediato en vez de tras un retardo fijo.

## Asociación con formularios {#form-association}

`r-select` es un elemento personalizado asociado a formularios (`static formAssociated = true`). Transmite el `value` seleccionado a través de `ElementInternals`, así que `new FormData(form)` lo recoge bajo el `name` del select cuando es descendiente real de un `<form>` nativo. El valor del formulario se siembra con la selección inicial al conectarse y se mantiene sincronizado conforme el valor cambia.

**Reinicio**: un `form.reset()` nativo restaura la selección de `defaultValue` si hay una, y si no, borra la selección por completo, mediante `formResetCallback()`.

**Validación**: `required` hace que una selección vacía sea inválida a través de `ElementInternals.setValidity()`, visible para `form.checkValidity()` / `form.reportValidity()`; un select `disabled` nunca bloquea la validación. `checkValidity()`, `reportValidity()`, `validity` y `validationMessage` están expuestos en el elemento, igual que en un campo nativo.

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

| Slot          | Descripción                                                           |
| ------------- | --------------------------------------------------------------------- |
| (por defecto) | Acepta elementos `<r-option>` que definen las opciones seleccionables |

## Parts CSS

| Part             | Descripción                                                 |
| ---------------- | ----------------------------------------------------------- |
| `select`         | Envoltorio raíz del select                                  |
| `selection`      | La caja del disparador (borde, fondo, maquetación)          |
| `icon`           | La flecha del desplegable                                   |
| `selection-item` | Elemento que muestra la etiqueta de la opción elegida       |
| `search`         | El campo de búsqueda incorporado (visible con `showSearch`) |
| `label`          | La etiqueta fija sobre el campo (existe cuando hay `label`) |

## Buenas prácticas

- **Muchas opciones**: activa `showSearch` para que se pueda filtrar por etiqueta.
- **Forma de abrir**: ajusta `trigger` a lo que la gente espera; en móvil se ignora `hover`, así que deja `click` disponible.
- **Dónde se monta**: en maquetaciones con desplazamiento o con recorte por desbordamiento, usa `getPopupContainerId` para controlar dónde se monta el desplegable.
- **Estilos propios**: usa `dropdownclass` o los nombres de `::part()` expuestos para rediseñar el disparador y el desplegable.
- **Formularios**: dale un `name` al select para que su valor se recoja en `FormData` dentro de un `<form>` nativo.
