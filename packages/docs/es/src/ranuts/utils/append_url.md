# appendUrl

Añade al final de una URL un objeto de parámetros de consulta.

## API

### appendUrl

#### Devuelve

| Argumento | Descripción                                 | Tipo     |
| --------- | ------------------------------------------- | -------- |
| `string`  | La URL completa con los parámetros añadidos | `string` |

#### Parámetros

| Parámetro | Descripción                           | Tipo                     | Por defecto |
| --------- | ------------------------------------- | ------------------------ | ----------- |
| `url`     | URL de partida                        | `string`                 | Obligatorio |
| `params`  | Objeto con los parámetros de consulta | `Record<string, string>` | `{}`        |

## Ejemplo

### Uso básico

```js
import { appendUrl } from 'ranuts';

const url = 'https://example.com';
const params = { page: '1', limit: '10' };
const fullUrl = appendUrl(url, params);
console.log(fullUrl); // 'https://example.com?page=1&limit=10'
```

### URL que ya trae parámetros

```js
import { appendUrl } from 'ranuts';

const url = 'https://example.com?sort=name';
const params = { page: '1' };
const fullUrl = appendUrl(url, params);
console.log(fullUrl); // 'https://example.com?sort=name&page=1'
```

### URL relativas al protocolo

```js
import { appendUrl } from 'ranuts';

// A las URL que empiezan por // se les añade https:// solo
const url = '//example.com';
const params = { id: '123' };
const fullUrl = appendUrl(url, params);
console.log(fullUrl); // 'https://example.com?id=123'
```

### Los valores vacíos se descartan

```js
import { appendUrl } from 'ranuts';

const url = 'https://example.com';
const params = { page: '1', empty: '' };
const fullUrl = appendUrl(url, params);
// Los valores que son una cadena vacía se descartan
console.log(fullUrl); // 'https://example.com?page=1'
```

## Notas

1. **Protocolo**: si la URL empieza por `//`, se le antepone `https://`.

2. **Combinación**: si la URL ya lleva parámetros de consulta, los nuevos se añaden detrás.

3. **Valores vacíos**: los parámetros cuyo valor es una cadena vacía se descartan y no llegan a la URL.

4. **Codificación**: los valores se codifican solos para la URL.

5. **Sobrescritura**: si el nombre de un parámetro ya existe, el valor nuevo sustituye al anterior (así se comporta `URLSearchParams`).
