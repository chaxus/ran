---
description: 'El Modal de ranui (<r-modal>) es un diálogo para interacciones concentradas, con captura del foco, bloqueo del desplazamiento, inertización del fondo y una API imperativa Modal.confirm.'
---

# Modal

Componente de diálogo para interacciones concentradas sobre la página actual, con captura del foco, bloqueo del desplazamiento e inertización del fondo.

> **Úsalo cuando** necesites un diálogo para una interacción concentrada sobre la página, con captura del foco, bloqueo del desplazamiento e inertización del fondo. Gobierna `<r-modal>` con el atributo `open` o con los ayudantes imperativos `Modal.confirm` / `Modal.info`.

## Inicio rápido

### Uso básico

La visibilidad del modal se controla con el atributo `open` (o la propiedad `open`). Empieza cerrado y no dibuja nada hasta que se abre, así que conecta un disparador que lo alterne.

<Demo>
  <r-button onclick="document.getElementById('quickstart-modal').open = true">Abrir modal</r-button>
  <r-modal id="quickstart-modal" heading="Modal básico">
    <p>Este es el contenido del modal.</p>
    <div slot="footer">
      <r-button type="primary" onclick="document.getElementById('quickstart-modal').open = false">Aceptar</r-button>
    </div>
  </r-modal>
</Demo>

```html
<r-button onclick="modal.open = true">Abrir modal</r-button>

<r-modal id="modal" heading="Modal básico">
  <p>Este es el contenido del modal.</p>
  <div slot="footer">
    <r-button type="primary" onclick="modal.open = false">Aceptar</r-button>
  </div>
</r-modal>
```

## Referencia de la API

### Propiedades

| Propiedad      | Tipo      | Por defecto | Descripción                                                                |
| -------------- | --------- | ----------- | -------------------------------------------------------------------------- |
| `open`         | `boolean` | `false`     | Si el modal está visible                                                   |
| `heading`      | `string`  | `''`        | Texto del título de la cabecera (si está vacío, recurre a `Modal`)         |
| `closable`     | `boolean` | `true`      | Si se muestra el botón de cerrar (`x`)                                     |
| `maskClosable` | `boolean` | `true`      | Si al hacer clic en la máscara de fondo se cierra el modal                 |
| `closeOnEsc`   | `boolean` | `true`      | Si pulsar `Escape` cierra el modal                                         |
| `lockScroll`   | `boolean` | `true`      | Si el desplazamiento del body se bloquea mientras el modal está abierto    |
| `autoFocus`    | `boolean` | `true`      | Si al abrir se enfoca el primer elemento enfocable                         |
| `hideHeader`   | `boolean` | `false`     | Suprime por completo la barra de título y deja un botón de cerrar flotante |
| `sheet`        | `string`  | `''`        | CSS inyectado en el shadow DOM                                             |

`closing` es un atributo de solo lectura que el elemento refleja sobre sí mismo (no una propiedad asignable): está presente desde el instante en que se ejecuta `close()` hasta que la transición de desvanecido y reducción de la máscara y el diálogo termina de verdad (~0,3 s después, la misma marca que el evento `afterclose`). Es útil para una página anfitriona que necesita que el modal siga contando como «presente» durante esa cola visual; véanse las buenas prácticas más abajo.

### Título `title`

```html
<r-modal open heading="Eliminar elemento">
  <p>¿Seguro que quieres eliminar este elemento?</p>
</r-modal>
```

### Botón de cerrar `closable`

Oculta el botón de cerrar de la cabecera, de modo que el modal solo pueda descartarse desde tus propios controles.

```html
<r-modal open heading="Términos" closable="false">
  <p>Debes aceptar los términos para continuar.</p>
  <div slot="footer">
    <r-button type="primary">Aceptar</r-button>
  </div>
</r-modal>
```

### Cerrar con la máscara `maskClosable`

Por defecto, hacer clic en el fondo cierra el modal. Ponlo a `false` para exigir una acción explícita.

```html
<r-modal open heading="Cambios sin guardar" maskClosable="false">
  <p>Hacer clic fuera no descartará este diálogo.</p>
</r-modal>
```

### Cerrar con Escape `closeOnEsc`

```html
<r-modal open heading="Informe" closeOnEsc="false">
  <p>La tecla Escape está desactivada para este diálogo.</p>
</r-modal>
```

### Bloquear el desplazamiento `lockScroll`

```html
<r-modal open heading="Vista previa" lockScroll="false">
  <p>La página detrás del modal todavía puede desplazarse.</p>
</r-modal>
```

### Foco automático `autoFocus`

```html
<r-modal open heading="Buscar" autoFocus="false">
  <input type="text" placeholder="Escribe para buscar" />
</r-modal>
```

### Modo sin cabecera `hideHeader`

Suprime por completo la barra de título y su borde, y deja solo un botón de cerrar flotante (arriba a la derecha) cuando hay `closable`. Va bien para diálogos que son solo contenido, como una caja de luz con una imagen o un diagrama, donde una barra de título no haría más que comerse el contenido. El diálogo conserva un nombre accesible mediante `aria-label` (derivado de `title`) aunque el `<h3>` visible haya desaparecido, así que pon `title` para dar una etiqueta al lector de pantalla incluso en este modo.

```html
<r-modal open hide-header>
  <img src="/diagram.png" alt="Diagrama de arquitectura" style="display: block; max-width: 100%;" />
</r-modal>
```

## Slots

| Slot          | Descripción                                                         |
| ------------- | ------------------------------------------------------------------- |
| (por defecto) | Contenido del cuerpo del modal                                      |
| `footer`      | Acciones del pie; la barra solo aparece cuando este slot tiene algo |

```html
<r-modal open heading="Confirmar">
  <p>El contenido del cuerpo va en el slot por defecto.</p>
  <div slot="footer">
    <r-button onclick="modal.open = false">Cancelar</r-button>
    <r-button type="primary">Confirmar</r-button>
  </div>
</r-modal>
```

## Eventos

Todos los eventos relacionados con el cierre llevan un `trigger` en `event.detail` que describe qué lo provocó: `'mask'`, `'button'`, `'escape'` o `'program'`.

| Evento        | Cancelable | `detail`      | Descripción                                               |
| ------------- | ---------- | ------------- | --------------------------------------------------------- |
| `beforeopen`  | Sí         | —             | Antes de abrir; llama a `preventDefault()` para cancelar  |
| `open`        | No         | —             | Se dispara cuando el modal se abre                        |
| `afteropen`   | No         | —             | Se dispara al terminar la transición de apertura          |
| `beforeclose` | Sí         | `{ trigger }` | Antes de cerrar; llama a `preventDefault()` para cancelar |
| `close`       | No         | `{ trigger }` | Se dispara cuando el modal se cierra                      |
| `afterclose`  | No         | `{ trigger }` | Se dispara al terminar la transición de cierre            |

```html
<r-modal id="modal" heading="Ejemplo"></r-modal>

<script>
  const modal = document.getElementById('modal');

  modal.addEventListener('beforeclose', (e) => {
    if (!confirm('¿Descartar los cambios?')) e.preventDefault();
  });

  modal.addEventListener('close', (e) => {
    console.log('cerrado por', e.detail.trigger); // 'mask' | 'button' | 'escape' | 'program'
  });
</script>
```

## API programática

La clase `Modal` expone ayudantes estáticos que crean, montan y resuelven un modal sin marcado. Cada uno devuelve una `Promise<{ action, trigger }>` donde `action` es `'confirm'`, `'cancel'` o `'dismiss'`.

| Método                | Descripción                                          |
| --------------------- | ---------------------------------------------------- |
| `Modal.open(opts)`    | Abre un modal con un único botón de aceptar          |
| `Modal.confirm(opts)` | Abre un modal con botones de aceptar y cancelar      |
| `Modal.info(opts)`    | Modal informativo (el título recurre a `Info`)       |
| `Modal.success(opts)` | Modal de éxito (el título recurre a `Success`)       |
| `Modal.warning(opts)` | Modal de advertencia (el título recurre a `Warning`) |
| `Modal.error(opts)`   | Modal de error (el título recurre a `Error`)         |

Opciones (todas opcionales): `title`, `content`, `okText`, `cancelText`, `showCancel`, `maskClosable`, `closeOnEsc`, `lockScroll`, `autoFocus`, `closable`, `onConfirm`, `onCancel`. `onConfirm` / `onCancel` pueden devolver `false` (o una promesa que resuelva a `false`) para dejar el modal abierto.

```js
import { Modal } from 'ranui/modal';

const result = await Modal.confirm({
  title: 'Eliminar proyecto',
  content: 'Esta acción no se puede deshacer.',
  okText: 'Eliminar',
  cancelText: 'Conservar',
  onConfirm: async () => {
    await deleteProject();
  },
});

if (result.action === 'confirm') {
  // eliminado
}
```

## Parts CSS

Da estilo a las piezas internas con `::part()`.

| Part     | Descripción                    |
| -------- | ------------------------------ |
| `root`   | Contenedor exterior de la capa |
| `mask`   | Fondo tras el diálogo          |
| `dialog` | La caja del diálogo            |
| `header` | Barra de cabecera              |
| `title`  | Encabezado del título          |
| `close`  | Botón de cerrar (`x`)          |
| `body`   | Región del cuerpo, desplazable |
| `footer` | Barra de acciones del pie      |

```css
r-modal::part(dialog) {
  border-radius: 8px;
}
r-modal::part(mask) {
  background: rgba(0, 0, 0, 0.6);
}
```

## Estilos

`<r-modal>` expone **23 propiedades personalizadas de CSS** propias, además de los tokens semánticos que lee del tema. Define una allí donde se herede: `:root`, un contenedor o el propio elemento:

```css
r-modal {
  --ran-modal-mask-background: var(--ran-color-bg-subtle);
}
```

Partes: `body` · `close` · `dialog` · `footer` · `header` · `mask` · `root` · `title`

La lista completa está en [tokens de estilo](/es/src/ranui/style-tokens#modal); cuál usar lo explica el [sistema de diseño](/es/src/ranui/design-system/).

## Buenas prácticas

- **Disparador y alternancia**: abre con `modal.open = true` y cierra con `modal.open = false`, o llama a `close()`.
- **Protege los cierres destructivos**: escucha `beforeclose` y llama a `preventDefault()` para confirmar antes de descartar trabajo sin guardar.
- **Acciones del pie**: pon los botones primario y secundario en `slot="footer"`; la barra del pie solo aparece cuando el slot tiene contenido.
- **Flujos que no se descartan**: pon `closable="false"` y `maskClosable="false"` para forzar una elección explícita.
- **Diálogos puntuales**: usa `Modal.confirm` / `Modal.info` para preguntas rápidas en lugar de escribir marcado.
- **Elevar una página anfitriona por encima del modal mientras está abierto**: haz coincidir `:has(r-modal[open]), :has(r-modal[closing])`, no solo `[open]`. `open` desaparece en el instante en que se ejecuta `close()`, pero la transición de la máscara y el diálogo sigue pintando unos 0,3 s más; retirar la elevación de `z-index` a mitad del desvanecido deja que la máscara, todavía visible, se repinte por debajo de aquello sobre lo que estaba levantada.
