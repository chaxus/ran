# clearStr

Quita de una cadena los espacios de los extremos, la codificación de URL y las comillas.

## API

### clearStr

#### Devuelve

| Argumento | Descripción | Tipo |
| -------- | -------------- | -------- |
| `string` | La cadena limpia | `string` |

#### Parámetros

| Parámetro | Descripción | Tipo | Por defecto |
| --------- | --------------------- | ---------------- | -------- |
| `str` | Cadena que se limpia | `string` | Obligatorio |
| `options` | Opciones de configuración | `ClearStrOption` | `{}` |

#### Opciones

| Parámetro | Descripción | Tipo | Por defecto |
| ------------ | ----------------------------- | --------- | ------- |
| `urlencoded` | Si se decodifica la URL | `boolean` | `true` |

## Ejemplo

### Uso básico

```js
import { clearStr } from 'ranuts';

const str = '  "hello world"  ';
const cleaned = clearStr(str);
console.log(cleaned); // 'hello world'
```

### Cadena codificada para URL

```js
import { clearStr } from 'ranuts';

const encoded = '  "hello%20world"  ';
const cleaned = clearStr(encoded);
console.log(cleaned); // 'hello world' (decodificado solo)
```

### Desactivar la decodificación

```js
import { clearStr } from 'ranuts';

const str = '  "hello%20world"  ';
const cleaned = clearStr(str, { urlencoded: false });
console.log(cleaned); // 'hello%20world' (sin decodificar)
```

### Comillas

```js
import { clearStr } from 'ranuts';

const str1 = "'test'";
const str2 = '"test"';
console.log(clearStr(str1)); // 'test'
console.log(clearStr(str2)); // 'test'
```

## Notas

1. **Qué quita**: los espacios de los extremos, las comillas simples y las dobles.
2. **Decodificación**: por defecto decodifica la URL; se desactiva con `urlencoded: false`.
3. **Cuándo usarlo**: es habitual para limpiar lo que escribe el usuario o los valores sacados de los parámetros de una URL.
