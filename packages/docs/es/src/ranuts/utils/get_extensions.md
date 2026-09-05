# getExtensions

Devuelve el array de extensiones de archivo que corresponden a un tipo MIME.

## API

### getExtensions

#### Devuelve

| Argumento | Descripción | Tipo |
| -------- | ---------------------------------- | ---------- |
| `Array` | Array de extensiones (sin el punto) | `string[]` |

#### Parámetros

| Parámetro | Descripción | Tipo | Por defecto |
| ---------- | ----------- | -------- | -------- |
| `mimeType` | Tipo MIME | `string` | Obligatorio |

## Ejemplo

### Uso básico

```js
import { getExtensions } from 'ranuts';

const exts = getExtensions('image/jpeg');
console.log(exts); // ['jpeg', 'jpg', 'jpe']
```

### Obtener todas las extensiones

```js
import { getExtensions } from 'ranuts';

const jsExts = getExtensions('application/javascript');
console.log(jsExts); // ['js', 'jsx', 'ts', 'tsx']
```

### Validar el tipo de archivo

```js
import { getExtensions } from 'ranuts';

function isValidImageFile(filename, mimeType) {
  const exts = getExtensions(mimeType);
  const fileExt = filename.split('.').pop();
  return exts.includes(fileExt);
}

console.log(isValidImageFile('photo.jpg', 'image/jpeg')); // true
```

## Notas

1. **Formato devuelto**: las extensiones no llevan punto (`.`); por ejemplo `'jpg'`, no `'.jpg'`.
2. **Varias extensiones**: un mismo tipo MIME puede corresponder a varias, y se devuelven todas las que coincidan.
3. **Array vacío**: si el tipo MIME no existe, devuelve un array vacío.
4. **Cuándo usarlo**: es habitual para validar tipos de archivo, comprobar subidas y similares.
