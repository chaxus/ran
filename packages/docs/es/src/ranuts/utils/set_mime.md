# setMime

Define o actualiza la correspondencia de tipos MIME.

## API

### setMime

#### Devuelve

| Argumento             | Descripción                                   | Tipo                  |
| --------------------- | --------------------------------------------- | --------------------- |
| `Map<string, string>` | El `Map` con la correspondencia de tipos MIME | `Map<string, string>` |

#### Parámetros

| Parámetro  | Descripción           | Tipo     | Por defecto |
| ---------- | --------------------- | -------- | ----------- |
| `ext`      | Extensión del archivo | `string` | Obligatorio |
| `mimeType` | Tipo MIME             | `string` | Obligatorio |

## Ejemplo

### Uso básico

```js
import { setMime, getMime } from 'ranuts';

// Definir un tipo MIME propio
setMime('.myext', 'application/x-my-custom-type');

// Leer el tipo MIME
const mime = getMime('.myext');
console.log(mime); // 'application/x-my-custom-type'
```

### Actualizar un tipo existente

```js
import { setMime, getMime } from 'ranuts';

// Cambiar el tipo MIME de .js
setMime('.js', 'application/javascript-custom');

const mime = getMime('script.js');
console.log(mime); // 'application/javascript-custom'
```

### Añadir un tipo nuevo

```js
import { setMime } from 'ranuts';

// Añadir la correspondencia de un tipo de archivo nuevo
setMime('.xyz', 'application/x-xyz-format');
```

## Notas

1. **Alcance global**: lo que definas afecta a toda la correspondencia de tipos MIME, y con ella a cualquier lugar que use `getMime`.
2. **Sobrescribe**: si la extensión ya existía, su tipo MIME anterior se pierde.
3. **Valor devuelto**: devuelve el `Map` entero, así que puedes seguir operando sobre él.
4. **Cuándo usarlo**: es habitual para registrar tipos MIME de formatos propios.

## MimeType

El `Map<string, string>` de base que leen y escriben `getMime`, `setMime` y `getExtensions`. Impórtalo directamente si quieres recorrer todos los pares extensión/tipo conocidos en lugar de consultar uno.

```js
import { MimeType } from 'ranuts/utils';

MimeType.get('.pdf'); // 'application/pdf'
MimeType.size; // total de extensiones conocidas
[...MimeType.entries()].filter(([, type]) => type.startsWith('image/'));
```

Es la misma instancia de `Map` que modifica `setMime`, así que los cambios hechos con `setMime` se ven aquí al momento, y al revés también. Modificarlo directamente funciona igual; `setMime` no es más que una puerta de entrada con nombre para el caso habitual.
