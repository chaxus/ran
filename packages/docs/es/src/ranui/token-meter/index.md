---
description: 'El TokenMeter de ranui (<r-token-meter>) muestra cuánta ventana de contexto está usando una conversación, antes de que el proveedor rechace la siguiente petición.'
---

# TokenMeter

Cuánta ventana de contexto está usando una conversación.

> **Úsalo cuando** estés construyendo una interfaz de chat contra un modelo con límite de
> contexto. Un cliente que no muestra esto funciona bien al principio y luego falla: cada turno
> reenvía todo el historial, la petición solo crece y en algún momento el proveedor la rechaza
> por superar el límite. Este componente enseña ese crecimiento antes del rechazo.

## Inicio rápido

### Uso básico

<ran-demo column>
  <r-token-meter limit="65536" used="12800"></r-token-meter>
  <r-token-meter limit="65536" used="54000"></r-token-meter>
  <r-token-meter limit="65536" used="69000"></r-token-meter>
</ran-demo>

```html
<r-token-meter limit="65536" used="12800"></r-token-meter>
```

```js
const meter = document.createElement('r-token-meter');
meter.limit = 65536;
meter.used = 41200; // el contexto que llevará la próxima petición
meter.spent = 128431; // tokens facturados en toda la conversación, opcional
composer.append(meter);
```

La barra se llena hasta `used / limit` y escala por tres niveles: **ok**, **warn** (desde el 80%
del límite) y **over**. `level` se refleja en el host, así que la página puede reaccionar a la
misma escalada que muestra la barra:

```css
r-token-meter[level='warn'] ~ .composer-hint {
  display: block;
}
```

### `used` y `spent` son números distintos

- **`used`**: lo que llevará la _próxima petición_, es decir el historial, no toda la
  conversación. Es el número al que se aplica el límite y el que dibuja la barra.
- **`spent`**: lo que se ha facturado _a lo largo_ de la conversación. Solo crece y no está
  acotado por la ventana.

Truncar una transcripción baja `used` y deja `spent` intacto. Mostrar solo uno de los dos responde
solo a una de las dos preguntas que tiene un usuario («¿cabrá el próximo mensaje?» y «¿cuánto me ha
costado esto?»).

### Sin límite

Con `limit` sin definir o a cero la barra desaparece y solo quedan los recuentos, útil mientras no
se conoce el tamaño de la ventana.

<ran-demo>
  <r-token-meter used="41200" spent="128431"></r-token-meter>
</ran-demo>

### Cambiar la etiqueta

<ran-demo>
  <r-token-meter label="Contexto" limit="65536" used="41200"></r-token-meter>
</ran-demo>

```html
<r-token-meter label="Contexto" limit="65536" used="41200"></r-token-meter>
<!-- label="" deja solo los recuentos -->
```

## Referencia de la API

### Propiedades

| Propiedad | Atributo | Tipo                       | Por defecto | Descripción                                                                     |
| --------- | -------- | -------------------------- | ----------- | ------------------------------------------------------------------------------- |
| `limit`   | `limit`  | `number`                   | `0`         | Tamaño de la ventana de contexto en tokens. Cero o ausente oculta la barra.     |
| `used`    | `used`   | `number`                   | `0`         | Tokens que llevará la próxima petición.                                         |
| `spent`   | `spent`  | `number`                   | `0`         | Tokens facturados en la conversación hasta ahora.                               |
| `label`   | `label`  | `string`                   | `'Context'` | Prefijo del texto; `''` deja solo los recuentos.                                |
| `level`   | `level`  | `'ok' \| 'warn' \| 'over'` | derivado    | Cuán llena está la ventana. **Lo fija el elemento**: escribirlo se sobrescribe. |
| `sheet`   | `sheet`  | `string`                   | `''`        | CSS inyectado en el shadow root.                                                |

Los recuentos se formatean para leerse de un vistazo: exactos por debajo de mil (`847` es lo
bastante corto para leerse exacto) y abreviados por encima (`41.2k`, `128k`); el tercer dígito de
`128.431` no cambia lo que el lector hace con él.

### Partes

| Parte   | Elemento                    |
| ------- | --------------------------- |
| `meter` | El elemento entero          |
| `track` | El fondo de la barra        |
| `fill`  | La porción llena            |
| `text`  | La etiqueta y los recuentos |

## Accesibilidad

El elemento siempre lleva un `title` que enuncia los números, así que **el color nunca es el único
portador** del aviso: que la barra se vuelva ámbar es una segunda señal, no la única. Mantenlo así
si cambias el estilo de los niveles.

## Estilos

`<r-token-meter>` expone **9 propiedades personalizadas de CSS** propias, además de los tokens
semánticos que lee del tema. Define una allí donde se herede: `:root`, un contenedor o el propio
elemento:

```css
r-token-meter {
  --ran-token-meter-fill-background: var(--ran-color-bg-subtle);
}
```

Partes: `fill` · `meter` · `text` · `track`

La lista completa está en [tokens de estilo](/es/src/ranui/style-tokens#token-meter); cuál elegir lo explica el [sistema de diseño](/es/src/ranui/design-system/).

## Buenas prácticas

- **Actualiza `used` desde el mismo sitio donde construyes la petición**, no desde una pasada de
  renderizado: el número en el que la gente confía es el que la próxima petición enviará de verdad.
- **Escala alrededor del medidor, no dentro de él.** En `level="over"` la interfaz útil es una
  sugerencia (resumir, empezar un hilo nuevo), y eso pertenece a la aplicación.
- **No animes el relleno al cambiar de tema**: consulta la
  [guía de diseño](/es/src/ranui/design-guides/#motion).
