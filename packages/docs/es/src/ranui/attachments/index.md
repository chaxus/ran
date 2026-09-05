---
description: 'La tira Attachments de ranui (<r-attachments>) guarda, previsualiza y valida los archivos preparados junto a un mensaje, y se hace cargo de las object URL que crea.'
---

# Attachments

Los archivos preparados junto a un mensaje: `<r-attachments>` guarda la lista, la previsualiza,
valida lo que llega y se hace cargo de las object URL que crea.

> **Úsalo cuando** un compositor necesite enseñar lo que está a punto de enviarse. **No** recoge
> archivos: pegar, arrastrar y soltar y un selector de archivos son tres gestos distintos, cada
> uno de un elemento distinto del compositor, y cuáles de ellos ofrece tu aplicación lo decides
> tú. Llama a `add()` desde el que cablees.

## Inicio rápido

### Uso básico

```html
<r-attachments accept="image/*,.pdf" max-size="5242880" max-count="4"></r-attachments>
```

```js
const strip = document.createElement('r-attachments');

// Un selector de archivos
picker.addEventListener('change', () => strip.add(picker.files));

// Pegar — solo cuando el portapapeles lleva archivos de verdad. Interceptar cada pegado
// rompe pegar texto, que es para lo que sirve el cuadro la mayor parte del tiempo.
input.addEventListener('paste', (event) => {
  if (event.clipboardData?.files.length) {
    event.preventDefault();
    strip.add(event.clipboardData.files);
  }
});

// Arrastrar y soltar
dropZone.addEventListener('drop', (event) => {
  event.preventDefault();
  strip.add(event.dataTransfer.files);
});

composer.append(strip);
```

La tira dibuja una fila por archivo con una miniatura (imágenes), el nombre, el tamaño y un botón
para quitarlo. `count` se refleja en el host y **se retira** cuando la tira está vacía, en vez de
ponerse a `0`, de modo que una tira vacía no ocupe espacio:

```css
r-attachments:not([count]) {
  display: none;
}
```

### Enviar

```js
const body = new FormData();
for (const file of strip.files) body.append('files', file);
await fetch('/api/messages', { method: 'POST', body });
strip.clear();
```

`files` son solo los objetos `File`, en orden: la forma que quiere el cuerpo de una petición.
`attachments` es la lista más rica (`id`, `name`, `size`, `type`, `previewUrl`) para cuando
necesites dibujar tu propia vista de ese mismo estado.

### El rechazo se comunica, nunca en silencio

Un archivo que desaparece porque superaba en 3 MB un límite que nadie mencionó se lee como un fallo
de la página. Cada negativa dispara un evento con el archivo y la regla que rompió:

```js
const explain = {
  'too-large': 'Ese archivo pesa más de 5 MB.',
  'type-not-accepted': 'Aquí no se acepta ese tipo de archivo.',
  'too-many': 'Puedes adjuntar como mucho 4 archivos.',
  duplicate: 'Ese archivo ya está adjunto.',
};

strip.addEventListener('attachmentrejected', (event) => {
  toast(explain[event.detail.reason]);
});
```

`duplicate` compara nombre, tamaño y fecha de modificación a la vez, igual que un gestor de archivos
decide que dos archivos son el mismo. Adjuntar dos veces el mismo archivo es un desliz, no una
instrucción.

## Referencia de la API

### Propiedades

| Propiedad     | Atributo    | Tipo                    | Por defecto | Descripción                                                                     |
| ------------- | ----------- | ----------------------- | ----------- | ------------------------------------------------------------------------------- |
| `accept`      | `accept`    | `string`                | `''`        | Tipos o extensiones separados por comas, en la forma que toma `<input accept>`. |
| `maxSize`     | `max-size`  | `number`                | `10 MB`     | Archivo más grande aceptado, en bytes.                                          |
| `maxCount`    | `max-count` | `number`                | —           | Máximo de archivos preparados a la vez; sin límite si no se define.             |
| `attachments` | —           | `readonly Attachment[]` | `[]`        | Los archivos preparados, en el orden en que llegaron.                           |
| `files`       | —           | `File[]`                | `[]`        | Solo los archivos, para construir el cuerpo de una petición.                    |
| `sheet`       | `sheet`     | `string`                | `''`        | CSS inyectado en el shadow root.                                                |

`attachments` y `files` son vistas de solo lectura. Prepara archivos con `add()`.

### Métodos

| Método       | Devuelve       | Descripción                                                       |
| ------------ | -------------- | ----------------------------------------------------------------- |
| `add(files)` | `Attachment[]` | Prepara un iterable de `File`; devuelve los que fueron aceptados. |
| `detach(id)` | `boolean`      | Quita un adjunto por id; `false` si no existía ese id.            |
| `clear()`    | `void`         | Quita todo y revoca sus object URL.                               |

::: tip Es `detach(id)`, no `remove(id)`
Todo elemento ya tiene un `remove()` que no toma argumentos y se saca a sí mismo del documento.
Taparlo con otra semántica es una trampa para quien busque el método estándar.
:::

### Eventos

| Evento               | Detalle            | Despacho           | Descripción                                                                                          |
| -------------------- | ------------------ | ------------------ | ---------------------------------------------------------------------------------------------------- |
| `attachmentschange`  | `{ attachments }`  | burbujea, composed | Cambió la lista de preparados.                                                                       |
| `attachmentrejected` | `{ file, reason }` | burbujea, composed | Se rechazó un archivo. `reason` es uno de `too-large`, `type-not-accepted`, `too-many`, `duplicate`. |

### Tipos

```ts
interface Attachment {
  id: string; // estable durante la vida de este adjunto
  file: File;
  name: string;
  size: number;
  type: string;
  previewUrl: string | null; // object URL para imágenes, null en el resto
}

type AttachmentRejection = 'too-large' | 'type-not-accepted' | 'too-many' | 'duplicate';
```

### Partes

`list` · `attachment` · `thumb` · `icon` · `name` · `size` · `remove`

## Cómo funcionan las vistas previas

Las vistas previas son **object URL, no data URL**. Previsualizar cuesta una referencia a unos bytes
que el navegador ya tiene; leer una foto de 10 MB a una cadena base64 para enseñar una miniatura de
40px cuesta la cadena. Construye la data URL más tarde, una sola vez, en aquello que envíe.

Cada URL que el elemento crea la revoca también: al quitar un adjunto, al vaciar y al desconectarse.
No conserves `previewUrl` más allá de la vida del adjunto.

## Accesibilidad

El texto alternativo de una miniatura es **el nombre del archivo**, no «imagen»: cuatro adjuntos
anunciados todos como «imagen» no le han dicho al lector nada sobre cuál es cuál. Cada botón de
quitar lleva el nombre de su archivo por el mismo motivo.

## Estilos

`<r-attachments>` expone **17 propiedades personalizadas de CSS** propias, además de los tokens
semánticos que lee del tema. Define una allí donde se herede: `:root`, un contenedor o el propio
elemento:

```css
r-attachments {
  --ran-attachment-background: var(--ran-color-bg-subtle);
}
```

Partes: `attachment` · `icon` · `list` · `name` · `remove` · `size` · `thumb`

La lista completa está en [tokens de estilo](/es/src/ranui/style-tokens#attachments); cuál elegir lo explica el [sistema de diseño](/es/src/ranui/design-system/).

## Buenas prácticas

- **Valida también en el servidor.** `accept` y `max-size` son una cortesía hacia quien adjunta, no
  una frontera de seguridad.
- **Vacía tras un envío correcto**, no antes. Una petición fallida debe dejar los archivos
  preparados para poder reintentar.
- **Explica cada rechazo.** El evento existe para que la tira nunca descarte un archivo en silencio.
