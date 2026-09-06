# createObjectURL

Crea una URL de objeto a partir de un Blob, un ArrayBuffer o una Response.

## API

### createObjectURL

#### Devuelve

| Argumento | Descripción | Tipo |
| ----------------- | ----------------------------------- | --------- |
| `Promise<string>` | Promesa que se resuelve con la URL de objeto | `Promise` |

#### Parámetros

| Parámetro | Descripción | Tipo | Por defecto |
| --------- | ----------- | ------------------------------------------- | -------- |
| `src` | El origen de los datos | `Blob \| ArrayBuffer \| Response \| string` | Obligatorio |

## Ejemplo

### Uso básico (Blob)

```js
import { createObjectURL } from 'ranuts';

const blob = new Blob(['Hello World'], { type: 'text/plain' });
const url = await createObjectURL(blob);
console.log(url); // 'blob:http://example.com/...'
```

### Crear a partir de un ArrayBuffer

```js
import { createObjectURL } from 'ranuts';

const buffer = new ArrayBuffer(8);
const url = await createObjectURL(buffer);
console.log(url); // 'blob:http://example.com/...'
```

### Crear a partir de una Response

```js
import { createObjectURL } from 'ranuts';

const response = await fetch('https://example.com/image.jpg');
const url = await createObjectURL(response);
console.log(url); // 'blob:http://example.com/...'
```

### Cuando se pasa una cadena

```js
import { createObjectURL } from 'ranuts';

// Si se le pasa una cadena, la devuelve tal cual
const url = await createObjectURL('https://example.com/image.jpg');
console.log(url); // 'https://example.com/image.jpg'
```

### Vista previa de una imagen

```js
import { createObjectURL } from 'ranuts';

async function previewImage(file) {
  const url = await createObjectURL(file);
  document.getElementById('preview').src = url;
}
```

## Notas

1. **Es asíncrono**: devuelve una promesa, así que hay que usar `await` o `.then()`.
2. **Tipos admitidos**: Blob, ArrayBuffer, Response y cadena.
3. **Memoria**: las URL creadas hay que liberarlas llamando tú a `URL.revokeObjectURL()`.
4. **Cuándo usarlo**: es habitual para previsualizar archivos, generar URL temporales y procesar imágenes.

## requestUrlToBuffer

Trae el contenido de una URL como bytes en bruto mediante `XMLHttpRequest`. Esos bytes suelen ir a parar al `createObjectURL` de arriba, cuando necesitas inspeccionarlos o transformarlos (comprobar un número mágico, descodificar audio) antes de convertirlos en una URL que se pueda mostrar.

```js
import { requestUrlToBuffer, createObjectURL } from 'ranuts/utils';

const result = await requestUrlToBuffer('/assets/clip.webm', {});
if (result.success) {
  const url = await createObjectURL(new Blob([result.data]));
  video.src = url;
}
```

#### Parámetros

| Parámetro | Descripción | Tipo | Por defecto |
| --------- | ----------------------------------------------------------------------- | ---------------------------------------- | -------- |
| `src` | La URL que se descarga | `string` | Obligatorio |
| `options` | `method` (por defecto `'GET'`) y `responseType` (por defecto `'arraybuffer'`) | `Partial<RequestUrlToArraybufferOption>` | Obligatorio |

#### Devuelve

Una `Promise` que se resuelve con `{ success: true, data, message: '' }` ante un HTTP 200, y que **se rechaza** con `{ success: false, data: status, message }` en cualquier otro caso. Una petición fallida es un rechazo, no una promesa resuelta con `success: false`, así que un `.then()` a secas sin `.catch()` lo sacará a la luz como un rechazo sin gestionar.

::: tip Para código nuevo, mejor `fetch`
Esto viene de antes de que `fetch` estuviera disponible en todas partes y por dentro usa `XMLHttpRequest`. Si no necesitas XHR en concreto (eventos de progreso de subida, `abort()`), `fetch(url).then(r =>
r.arrayBuffer())` hace lo mismo con la forma de rechazo propia de las promesas.
:::
