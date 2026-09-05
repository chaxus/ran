# checkEncoding

Detecta la codificación de caracteres de unos datos en `Uint8Array`.

## API

### checkEncoding

#### Devuelve

| Argumento | Descripción | Tipo |
| -------- | ---------------------- | -------- |
| `string` | La codificación detectada | `string` |

#### Parámetros

| Parámetro | Descripción | Tipo | Por defecto |
| ------------ | -------------- | ------------ | -------- |
| `uint8Array` | Datos que se analizan | `Uint8Array` | Obligatorio |

## Ejemplo

### Uso básico

```js
import { checkEncoding } from 'ranuts';

const data = new Uint8Array([0x48, 0x65, 0x6c, 0x6c, 0x6f]); // "Hello"
const encoding = checkEncoding(data);
console.log(encoding); // 'UTF-8' u otra codificación detectada
```

### Detectar la codificación de un archivo

```js
import { checkEncoding } from 'ranuts';

async function detectFileEncoding(file) {
  const arrayBuffer = await file.arrayBuffer();
  const uint8Array = new Uint8Array(arrayBuffer);
  const encoding = checkEncoding(uint8Array);
  return encoding;
}
```

### Decodificar texto

```js
import { checkEncoding } from 'ranuts';

function decodeText(uint8Array) {
  const encoding = checkEncoding(uint8Array);
  const decoder = new TextDecoder(encoding);
  return decoder.decode(uint8Array);
}
```

## Notas

1. **Dependencia**: usa la biblioteca `jschardet` para detectar la codificación.
2. **Codificación por defecto**: si la detección falla, recurre a `'utf-8'`.
3. **Exactitud**: detectar la codificación no acierta el 100 % de las veces, sobre todo con textos cortos.
4. **Cuándo usarlo**: es habitual al tratar archivos, decodificar texto o convertir entre codificaciones.
