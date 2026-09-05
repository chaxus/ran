---
description: 'El DisclosureRow de ranui (<r-disclosure-row>) es una fila de una línea «título · resumen» que se despliega para mostrar un cuerpo, con un destello mientras corre el trabajo que hay detrás.'
---

# DisclosureRow

El marco de una línea `[inicio] título · resumen` que se despliega para mostrar un cuerpo. Es la fila que comparten `<r-reasoning>` y `<r-tool-card>`, de modo que una transcripción con ambos tenga un solo lenguaje de despliegue en vez de dos.

> **Úsalo cuando** tengas una línea compacta que represente algo mayor (una llamada a una herramienta, una cadena de razonamiento, un grupo de registros) y el detalle merezca quedar oculto hasta que alguien lo pida.

## Inicio rápido

### Uso básico

<Demo column>
  <r-disclosure-row heading="Leer archivo" summary="packages/ranui/index.ts" expandable>
    <div style="padding:8px 0">El cuerpo aparece cuando la fila está abierta.</div>
  </r-disclosure-row>
</Demo>

```html
<r-disclosure-row heading="Leer archivo" summary="packages/ranui/index.ts" expandable>
  <div>El cuerpo aparece cuando la fila está abierta.</div>
</r-disclosure-row>
```

El **heading es la mitad izquierda, de ancho fijo**, y el **summary es la mitad derecha, que se recorta**, así que una columna de filas queda alineada sobre el mismo eje por largo que sea cada resumen. Un resumen vacío se lleva consigo el separador.

### Mientras el trabajo está en marcha

`busy` dibuja un barrido de destello a lo ancho de la fila. Una ruleta solo indica que algo, en alguna parte, está ocurriendo; un barrido sobre la fila señala qué fila sigue trabajando.

<Demo column>
  <r-disclosure-row heading="Ejecutar pruebas" summary="2351 superadas" busy expandable></r-disclosure-row>
  <r-disclosure-row heading="Ejecutar pruebas" summary="2351 superadas" expandable></r-disclosure-row>
</Demo>

### Con un indicador al principio

El slot `leading` y la punta de flecha comparten una misma celda de la rejilla, así que intercambiarlos no cuesta maquetación y el título nunca se mueve bajo el puntero.

Sin nada en `leading`, la punta de flecha se queda a la vista, porque es la única marca que le dice a quien lee que la fila se abre. Con contenido al principio, la flecha aparece al pasar el cursor, al recibir el foco o mientras está abierta, y el resto del tiempo es el indicador de estado lo que se ve.

<Demo column>
  <r-disclosure-row heading="Compilar" summary="falló en 4,2 s" tone="error" expandable>
    <r-state-dot slot="leading" state="error"></r-state-dot>
    <div style="padding:8px 0">El paquete supera el límite de tamaño.</div>
  </r-disclosure-row>
</Demo>

```html
<r-disclosure-row heading="Compilar" summary="falló en 4,2 s" tone="error" expandable>
  <r-state-dot slot="leading" state="error"></r-state-dot>
  <div>El paquete supera el límite de tamaño.</div>
</r-disclosure-row>
```

## Referencia de la API

### Propiedades

| Propiedad    | Atributo     | Tipo      | Por defecto | Descripción                                                        |
| ------------ | ------------ | --------- | ----------- | ------------------------------------------------------------------ |
| `heading`    | `heading`    | `string`  | `''`        | La mitad izquierda de la línea, de ancho fijo.                     |
| `summary`    | `summary`    | `string`  | `''`        | La mitad derecha, que se recorta. Vacía, se lleva el separador.    |
| `open`       | `open`       | `boolean` | `false`     | Si el cuerpo está a la vista. Se refleja, así que `:has([open])` funciona. |
| `expandable` | `expandable` | `boolean` | `false`     | Si la fila tiene un cuerpo que merezca abrirse.                    |
| `busy`       | `busy`       | `boolean` | `false`     | Si el trabajo que representa esta fila sigue en marcha.            |
| `tone`       | `tone`       | `string`  | `''`        | `error` colorea el resumen; cualquier otro valor es el tono normal. |
| `name`       | `name`       | `string`  | `''`        | Agrupa filas, de modo que abrir una cierre las demás.              |
| `sheet`      | `sheet`      | `string`  | `''`        | CSS inyectado en el shadow root.                                   |

::: warning El atributo es `heading`, no `title`
`title` es un atributo nativo de `HTMLElement` que el navegador dibuja como un tooltip, así que un componente que lo usara para un encabezado haría que cada instancia sacase un tooltip repitiendo el texto que ya está en pantalla, y nada lo apaga una vez puesto. `<r-card>` y `<r-modal>` llevan el mismo cambio de nombre por la misma razón.
:::

### Eventos

| Evento                   | Detalle             | Despacho                          | Descripción                                  |
| ------------------------ | ------------------- | --------------------------------- | -------------------------------------------- |
| `disclosurebeforetoggle` | `{ open: boolean }` | burbujea, composed, cancelable    | La fila está a punto de abrirse o cerrarse.  |
| `disclosuretoggle`       | `{ open: boolean }` | burbujea, composed                | La fila se abrió o se cerró.                 |

::: warning El evento es `disclosuretoggle`, no `toggle`
`toggle` es lo que dispara `<details>`, y su `ToggleEvent` lleva `oldState` / `newState` en vez de un `detail`; un escuchador tipado contra el nombre de la plataforma no encuentra nada dentro. Lee el estado del elemento: `row.open`.
:::

```js
row.addEventListener('disclosuretoggle', () => {
  console.log(row.open ? 'opened' : 'closed');
});
```

`disclosurebeforetoggle` se dispara primero y se puede rechazar, y eso es lo que hace expresables «trae el cuerpo la primera vez que se abra» y «niégate a plegar mientras haya una edición sin guardar». La plataforma no tiene equivalente: `<details>` dispara solo el `toggle` de después, y la petición de un `beforetoggle` cancelable sigue abierta.

```js
row.addEventListener('disclosurebeforetoggle', async (event) => {
  if (!event.detail.open || row.dataset.loaded) return;
  event.preventDefault(); // mantenla cerrada hasta que el cuerpo esté ahí
  row.append(await fetchBody());
  row.dataset.loaded = 'true';
  row.open = true;
});
```

Solo lo dispara una pulsación. Un `row.open = true` desde el código es la aplicación cambiando de opinión, y no tiene a quién preguntar.

### Una fila a la vez

`name` agrupa filas igual que `name` agrupa los `<details>`: abrir una cierra las otras. El grupo es el documento entero, y las filas no tienen por qué ser hermanas.

```html
<r-disclosure-row name="run" heading="Install" expandable>…</r-disclosure-row>
<r-disclosure-row name="run" heading="Build" expandable>…</r-disclosure-row>
<r-disclosure-row name="run" heading="Test" expandable>…</r-disclosure-row>
```

### Accesibilidad

Una fila es un control solo cuando tiene algo que abrir. Con `expandable`, la fila lleva `role="button"`, una parada de tabulación, `aria-expanded` y un `aria-controls` que apunta al cuerpo; sin él no lleva ninguno, porque anunciar una línea de texto como botón invita a una pulsación que no hace nada. `busy` pone `aria-busy`, así que el barrido no es la única señal de que el trabajo sigue en marcha.

Un cuerpo plegado se recorta en vez de retirarse, para que pueda animarse. Además se marca como `inert` y su contenido se salta con `content-visibility: hidden`, lo que lo deja fuera del orden de tabulación y del camino de dibujado mientras está cerrado.

La fila mide 24px de alto, que es exactamente el mínimo de la WCAG 2.5.8, y las filas se apilan sin hueco. Con un puntero grueso, la altura por defecto pasa a 32px, porque el área de pulsación no se puede agrandar más allá de la fila sin solaparse con la de arriba, lo que cambiaría un objetivo pequeño por uno equivocado. Fijar `--ran-disclosure-row-height` clava la altura con cualquier tipo de entrada.

### Slots

| Slot      | Contenido                                                                     |
| --------- | ----------------------------------------------------------------------------- |
| `default` | El cuerpo, a la vista mientras esté `open`.                                   |
| `leading` | Un indicador antes del título, normalmente `<r-state-dot>`.                   |
| `heading` | Marcado para la mitad izquierda, que sustituye al texto plano del atributo `heading`. |
| `summary` | Marcado para la mitad derecha, que sustituye al texto plano del atributo `summary`. |

`heading` y `summary` toman cadenas simples como atributos, que es lo que suele necesitar la fila de una llamada a una herramienta. Cuando la mitad tenga que llevar marcado —código, un enlace, una abreviatura— ponlo en el slot. El texto del atributo es el respaldo del slot, así que el contenido del slot simplemente lo sustituye:

```html
<r-disclosure-row expandable>
  <code slot="heading">fetch()</code>
  <a slot="summary" href="https://example.com">https://example.com</a>
  <pre>…</pre>
</r-disclosure-row>
```

El contenido del slot cuenta como una mitad de la línea, así que el separador aparece y desaparece igual que con los atributos.

### Parts

`row` · `leading` · `title` · `separator` · `summary` · `disclosure` · `body`

## Estilos

`<r-disclosure-row>` expone **15 propiedades personalizadas de CSS** propias, además de los tokens semánticos que lee del tema. Define una allí donde se herede: `:root`, un contenedor o el propio elemento:

```css
r-disclosure-row {
  --ran-disclosure-hover-background: var(--ran-color-bg-subtle);
}
```

Partes: `body` · `disclosure` · `leading` · `row` · `separator` · `summary` · `title`

La lista completa está en [tokens de estilo](/es/src/ranui/style-tokens#disclosure-row); cuál elegir lo explica el [sistema de diseño](/es/src/ranui/design-system/).

## Buenas prácticas

- **Dale un cuerpo a la fila, o no la hagas desplegable.** Una flecha que abre sobre un espacio vacío no sirve de nada; deja `expandable` sin poner y la fila se queda en una sola línea.
- **Mantén el título con un vocabulario fijo** (`Leer archivo`, `Ejecutar pruebas`, `Buscar`) y pon la parte variable en el resumen. Eso es lo que hace que una columna de filas se pueda recorrer con la vista.
- **Acompaña `tone="error"` de palabras, nunca solo de color**: el resumen debería decir qué falló.
