# querystring

Convierte un objeto en una cadena de consulta para una URL.

## API

### querystring

#### Devuelve

| Argumento | Descripción | Tipo |
| -------- | ---------------- | -------- |
| `string` | La cadena de consulta | `string` |

#### Parámetros

| Parámetro | Descripción | Tipo | Por defecto |
| --------- | ----------------- | -------- | ------- |
| `data` | Objeto que se convierte | `Object` | `{}` |

## Ejemplo

### Uso básico

```js
import { querystring } from 'ranuts';

const params = {
  name: 'John',
  age: 30,
  city: 'New York',
};

const query = querystring(params);
console.log(query); // 'name=John&age=30&city=New%20York'
```

### Construir una URL

```js
import { querystring } from 'ranuts';

const baseUrl = 'https://api.example.com/users';
const params = {
  page: 1,
  limit: 10,
  sort: 'name',
};

const url = `${baseUrl}?${querystring(params)}`;
console.log(url);
// 'https://api.example.com/users?page=1&limit=10&sort=name'
```

### Caracteres especiales

```js
import { querystring } from 'ranuts';

const params = {
  search: 'hello world',
  category: 'web development',
};

const query = querystring(params);
console.log(query); // 'search=hello%20world&category=web%20development'
```

### Se descartan undefined y null

```js
import { querystring } from 'ranuts';

const params = {
  name: 'John',
  age: undefined,
  city: null,
  active: true,
};

const query = querystring(params);
console.log(query); // 'name=John&active=true'
// Los valores undefined y null se descartan
```

## Notas

1. **Codificación**: los valores se codifican solos para la URL.
2. **Valores vacíos**: los `undefined` y `null` se descartan y no aparecen en la cadena.
3. **Debe ser un objeto**: si se pasa otra cosa, se lanza un `TypeError`.
4. **Paso previo**: tanto las claves como los valores pasan por `decodeURIComponent` antes de codificarse.
