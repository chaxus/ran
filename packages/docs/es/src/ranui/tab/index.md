---
description: 'Las Tabs de ranui (<r-tabs>), un Web Component nativo utilizable en cualquier framework, organizan el contenido en paneles intercambiables.'
---

# Tab

Contenedor con pestañas que alterna entre paneles. Compón `<r-tabs>` como contenedor con uno o más paneles `<r-tab>` dentro.

> **Úsalo cuando** necesites un contenedor con pestañas que alterne entre paneles. Compón `<r-tabs>` con hijos `<r-tab>`, cada uno con su `label` de cabecera y el cuerpo del panel.

## Inicio rápido

### Uso básico

<Demo column>
  <r-tabs>
    <r-tab label="tab1">11111</r-tab>
    <r-tab label="tab2">22222</r-tab>
    <r-tab label="tab3">33333</r-tab>
  </r-tabs>
</Demo>

```html
<r-tabs>
  <r-tab label="tab1">11111</r-tab>
  <r-tab label="tab2">22222</r-tab>
  <r-tab label="tab3">33333</r-tab>
</r-tabs>
```

Cada `<r-tab>` se convierte en un panel; su `label` se dibuja como el botón de la cabecera y su contenido asignado es el cuerpo del panel. Al elegir una cabecera, el panel correspondiente se desliza a la vista.

## Referencia de la API

### Propiedades de `r-tabs`

El contenedor. Alberga la fila de cabeceras, el indicador de activo y el área de contenido de los paneles.

| Propiedad | Tipo      | Por defecto                | Descripción                                                                |
| --------- | --------- | -------------------------- | -------------------------------------------------------------------------- |
| `active`  | `string`  | primera pestaña habilitada | El `r-key` de la pestaña activa                                            |
| `type`    | `string`  | `'flat'`                   | Estilo de cabecera: `flat`, `line`                                         |
| `align`   | `string`  | `'start'`                  | Alineación de la cabecera: `start`, `center`, `end`                        |
| `effect`  | `boolean` | `false`                    | Activa la onda en los botones de cabecera y oculta el indicador deslizante |
| `sheet`   | `string`  | `''`                       | Texto CSS inyectado en el shadow DOM                                       |

> El setter de `active` acepta una cadena de clave; asignarle `null` quita el atributo. Cuando no hay `active`, al montar se selecciona la primera pestaña no deshabilitada.

### Propiedades de `r-tab`

Un solo panel. Sus atributos los lee el `<r-tabs>` padre para construir el botón de cabecera correspondiente.

| Propiedad  | Tipo      | Por defecto | Descripción                                                           |
| ---------- | --------- | ----------- | --------------------------------------------------------------------- |
| `label`    | `string`  | `''`        | Texto mostrado en la cabecera de la pestaña                           |
| `r-key`    | `string`  | índice      | Identificador único dentro de un `<r-tabs>`; se coteja con `active`   |
| `icon`     | `string`  | —           | Nombre de `r-icon` mostrado antes de la etiqueta                      |
| `iconSize` | `string`  | —           | Tamaño del icono de la cabecera                                       |
| `disabled` | `boolean` | `false`     | Vuelve la pestaña no seleccionable                                    |
| `effect`   | `boolean` | —           | Efecto de onda en la cabecera (normalmente lo pone el `effect` padre) |
| `sheet`    | `string`  | `''`        | Texto CSS inyectado en el shadow DOM                                  |

> El getter/setter de la propiedad `key` lee y escribe el atributo `r-key` (se evita el nombre simple `key` porque es un campo reservado). Pon `label` y `r-key` antes de que el elemento se conecte: los cambios en esos dos atributos no se vuelven a procesar una vez construidas las cabeceras.

### Estilo de cabecera `type`

`flat` (por defecto) muestra un subrayado deslizante como indicador; `line` dibuja cabeceras con borde.

<Demo column>
  <r-tabs type="flat">
    <r-tab label="tab1">11111</r-tab>
    <r-tab label="tab2">22222</r-tab>
    <r-tab label="tab3">33333</r-tab>
  </r-tabs>
  <r-tabs type="line">
    <r-tab label="tab1">11111</r-tab>
    <r-tab label="tab2">22222</r-tab>
    <r-tab label="tab3">33333</r-tab>
  </r-tabs>
</Demo>

```html
<r-tabs type="flat">
  <r-tab label="tab1">11111</r-tab>
  <r-tab label="tab2">22222</r-tab>
  <r-tab label="tab3">33333</r-tab>
</r-tabs>

<r-tabs type="line">
  <r-tab label="tab1">11111</r-tab>
  <r-tab label="tab2">22222</r-tab>
  <r-tab label="tab3">33333</r-tab>
</r-tabs>
```

### Alineación de la cabecera `align`

Alinea la fila de cabeceras. Por defecto, `start`.

<Demo column>
  <r-tabs type="line" align="start">
    <r-tab label="tab1">11111</r-tab>
    <r-tab label="tab2">22222</r-tab>
    <r-tab label="tab3">33333</r-tab>
  </r-tabs>
  <r-tabs type="line" align="center">
    <r-tab label="tab1">11111</r-tab>
    <r-tab label="tab2">22222</r-tab>
    <r-tab label="tab3">33333</r-tab>
  </r-tabs>
  <r-tabs type="line" align="end">
    <r-tab label="tab1">11111</r-tab>
    <r-tab label="tab2">22222</r-tab>
    <r-tab label="tab3">33333</r-tab>
  </r-tabs>
</Demo>

```html
<r-tabs type="line" align="start"> ... </r-tabs>
<r-tabs type="line" align="center"> ... </r-tabs>
<r-tabs type="line" align="end"> ... </r-tabs>
```

### Pestaña activa: `active` y `r-key`

- `r-key` es un atributo de `<r-tab>` que da a cada panel una identidad estable dentro del mismo `<r-tabs>`. Si se omite, toma el índice del panel.
- `active` es un atributo de `<r-tabs>` que elige la pestaña activa inicial: se muestra el panel cuyo `r-key` coincide con `active`.

Sin claves explícitas, `active` coincide con el índice empezando en cero:

<Demo column>
  <r-tabs active="1">
    <r-tab label="tab1">11111</r-tab>
    <r-tab label="tab2">22222</r-tab>
    <r-tab label="tab3">33333</r-tab>
  </r-tabs>
</Demo>

```html
<r-tabs active="1">
  <r-tab label="tab1">11111</r-tab>
  <r-tab label="tab2">22222</r-tab>
  <r-tab label="tab3">33333</r-tab>
</r-tabs>
```

Con valores `r-key` explícitos (los paneles sin clave recurren a su índice):

<Demo column>
  <r-tabs active="c">
    <r-tab label="tab1" r-key="a">11111</r-tab>
    <r-tab label="tab2" r-key="b">22222</r-tab>
    <r-tab label="tab3" r-key="c">33333</r-tab>
    <r-tab label="tab4">4</r-tab>
  </r-tabs>
</Demo>

```html
<r-tabs active="c">
  <r-tab label="tab1" r-key="a">11111</r-tab>
  <r-tab label="tab2" r-key="b">22222</r-tab>
  <r-tab label="tab3" r-key="c">33333</r-tab>
  <r-tab label="tab4">4</r-tab>
</r-tabs>
```

> Todos los `r-key` dentro de un mismo `<r-tabs>` deben ser únicos: claves duplicadas o ausentes en algunos paneles lanzan un error mientras se construyen las cabeceras.

### Panel deshabilitado `disabled`

Un `<r-tab>` deshabilitado no se puede seleccionar y se salta al elegir la pestaña activa por defecto.

<Demo column>
  <r-tabs active="c">
    <r-tab label="tab1" r-key="a" disabled>11111</r-tab>
    <r-tab label="tab2" r-key="b">22222</r-tab>
    <r-tab label="tab3" r-key="c">33333</r-tab>
    <r-tab label="tab4">4</r-tab>
  </r-tabs>
</Demo>

```html
<r-tabs active="c">
  <r-tab label="tab1" r-key="a" disabled>11111</r-tab>
  <r-tab label="tab2" r-key="b">22222</r-tab>
  <r-tab label="tab3" r-key="c">33333</r-tab>
  <r-tab label="tab4">4</r-tab>
</r-tabs>
```

### Icono de la cabecera: `icon` y `iconSize`

`<r-tab>` acepta un atributo `icon` (un nombre de `r-icon`) que se dibuja antes de la etiqueta; `iconSize` fija su tamaño.

<Demo column>
  <r-tabs>
    <r-tab label="tab1" icon="edit">11111</r-tab>
    <r-tab label="tab2" icon="delete" iconSize="16">22222</r-tab>
    <r-tab label="tab3">33333</r-tab>
  </r-tabs>
</Demo>

```html
<r-tabs>
  <r-tab label="tab1" icon="edit">11111</r-tab>
  <r-tab label="tab2" icon="delete" iconSize="16">22222</r-tab>
  <r-tab label="tab3">33333</r-tab>
</r-tabs>
```

### Efecto de onda `effect`

Pon `effect` en `<r-tabs>` para activar la onda al hacer clic en los botones de cabecera. Con `effect` activo, el subrayado deslizante queda oculto.

<Demo column>
  <r-tabs effect="true">
    <r-tab label="tab1">11111</r-tab>
    <r-tab label="tab2">22222</r-tab>
    <r-tab label="tab3">33333</r-tab>
  </r-tabs>
</Demo>

```html
<r-tabs effect="true">
  <r-tab label="tab1">11111</r-tab>
  <r-tab label="tab2">22222</r-tab>
  <r-tab label="tab3">33333</r-tab>
</r-tabs>
```

## Slots

| Elemento | Slot          | Descripción                                                 |
| -------- | ------------- | ----------------------------------------------------------- |
| `r-tabs` | (por defecto) | Acepta los paneles `<r-tab>`                                |
| `r-tab`  | (por defecto) | El cuerpo del panel, mostrado cuando la pestaña está activa |

## Parts CSS

`r-tabs` expone:

| Part           | Descripción                                       |
| -------------- | ------------------------------------------------- |
| `tabs`         | Envoltorio raíz                                   |
| `header`       | Envoltorio de la fila de cabeceras                |
| `nav`          | La tablist que contiene los elementos de cabecera |
| `indicator`    | La línea de subrayado deslizante                  |
| `content`      | Ventana del contenido de los paneles              |
| `content-wrap` | La pista deslizante que sostiene los paneles      |

`r-tab` expone:

| Part      | Descripción                    |
| --------- | ------------------------------ |
| `content` | El slot de contenido del panel |

## Eventos

### `change`

`<r-tabs>` despacha un `CustomEvent` `change` cuando cambia un atributo observado, sobre todo al cambiar de pestaña activa. `event.detail.active` es la clave activa actual (el `r-key` del `<r-tab>` seleccionado, o su índice si no hay `r-key`).

```js
const tabs = document.createElement('r-tabs');
tabs.addEventListener('change', (e) => {
  console.log('pestaña activa:', e.detail.active);
});
tabbar.append(tabs);
```

`<r-tab>` no despacha ningún evento personalizado.

## Estilos

`<r-tabs>` expone **10 propiedades personalizadas de CSS** propias, además de los tokens semánticos que lee del tema. Define una allí donde se herede: `:root`, un contenedor o el propio elemento:

```css
r-tabs {
  --ran-tab-content-background: var(--ran-color-bg-subtle);
}
```

Partes: `content` · `content-wrap` · `header` · `indicator` · `nav` · `tabs`

La lista completa está en [tokens de estilo](/es/src/ranui/style-tokens#tab); cuál elegir lo explica el [sistema de diseño](/es/src/ranui/design-system/).

## Buenas prácticas

- **Identidad estable**: da a cada `<r-tab>` un `r-key` único y gobierna la selección con `active` en `<r-tabs>`, en vez de fiarte de los índices posicionales.
- **Elección de estilo**: usa `type="line"` para una tira de pestañas con borde, al estilo documento; `type="flat"` (por defecto) para el subrayado deslizante mínimo.
- **Alineación**: usa `align="center"` o `align="end"` para recolocar la fila de cabeceras en contenedores anchos.
- **Paneles deshabilitados**: marca con `disabled` los paneles no disponibles; se saltan tanto en los clics como en la selección por defecto.
- **Navegación con teclado**: la fila de cabeceras es una tablist WAI-ARIA: las flechas mueven entre pestañas (con `Inicio`/`Fin`) y solo la pestaña activa entra en el orden de tabulación.
