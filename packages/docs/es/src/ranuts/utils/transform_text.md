# transformText

Convierte un `ArrayBuffer` en texto: detecta la codificación y decodifica.

## API

### transformText

#### Devuelve

| Argumento                    | Descripción                             | Tipo                         |
| ---------------------------- | --------------------------------------- | ---------------------------- |
| `TransformText \| undefined` | El objeto con el resultado, o undefined | `TransformText \| undefined` |

#### TransformText

| Propiedad  | Descripción               | Tipo     |
| ---------- | ------------------------- | -------- |
| `encoding` | La codificación detectada | `string` |
| `content`  | El texto decodificado     | `string` |

#### Parámetros

| Parámetro | Descripción                | Tipo                    | Por defecto |
| --------- | -------------------------- | ----------------------- | ----------- |
| `content` | Contenido que se convierte | `string \| ArrayBuffer` | Obligatorio |

## Ejemplo

### Uso básico

```js
import { transformText } from 'ranuts';

const arrayBuffer = new TextEncoder().encode('Hello World').buffer;
const result = transformText(arrayBuffer);
if (result) {
  console.log('Codificación:', result.encoding);
  console.log('Contenido:', result.content); // 'Hello World'
}
```

### Procesar un archivo

```js
import { transformText } from 'ranuts';

async function readTextFile(file) {
  const arrayBuffer = await file.arrayBuffer();
  const result = transformText(arrayBuffer);
  if (result) {
    return result.content;
  }
  return null;
}
```

### Detección automática de la codificación

```js
import { transformText } from 'ranuts';

// Detecta la codificación y decodifica
const result = transformText(arrayBuffer);
if (result) {
  console.log(`Decodificado con la codificación ${result.encoding}`);
  console.log(result.content);
}
```

## Notas

1. **Detección automática**: usa `jschardet` para averiguar la codificación.
2. **Solo `ArrayBuffer`**: por ahora solo admite `ArrayBuffer`; con una cadena emite un aviso.
3. **Cuándo devuelve algo**: solo cuando detecta la codificación y la decodificación sale bien; en otro caso devuelve `undefined`.
4. **Cuándo usarlo**: es habitual al leer archivos, decodificar texto y convertir entre codificaciones.
