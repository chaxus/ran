# getAllQueryString

Saca todos los parámetros de consulta de una URL y los convierte en un objeto.

## API

### getAllQueryString

#### Devuelve

| Argumento | Descripción                           | Tipo                     |
| --------- | ------------------------------------- | ------------------------ |
| `Object`  | Objeto con los parámetros de consulta | `Record<string, string>` |

#### Parámetros

| Parámetro | Descripción                                                       | Tipo     | Por defecto |
| --------- | ----------------------------------------------------------------- | -------- | ----------- |
| `url`     | URL que se analiza (opcional; por defecto la de la página actual) | `string` | Opcional    |

## Ejemplo

### Uso básico

```js
import { getAllQueryString } from 'ranuts';

// Supongamos que la URL actual es https://example.com?name=John&age=30
const params = getAllQueryString();
console.log(params); // { name: 'John', age: '30' }
```

### Analizar una URL concreta

```js
import { getAllQueryString } from 'ranuts';

const url = 'https://example.com?page=1&limit=10&sort=name';
const params = getAllQueryString(url);
console.log(params); // { page: '1', limit: '10', sort: 'name' }
```

### Leer un parámetro concreto

```js
import { getAllQueryString } from 'ranuts';

const params = getAllQueryString();
const page = params.page || '1';
const limit = params.limit || '10';
console.log(`Página: ${page}, límite: ${limit}`);
```

### Parámetros codificados

```js
import { getAllQueryString } from 'ranuts';

// URL: https://example.com?search=hello%20world
const params = getAllQueryString();
console.log(params.search); // 'hello world' (decodificado solo)
```

## Notas

1. **Una bandera a secas conserva su sitio.** `?embed` y `?embed=` dan los dos `{ embed: '' }`. Antes de la 0.3 se descartaba cualquier parámetro sin valor, lo que hacía que `?readonly` y `?embed` (la forma habitual de escribir una bandera booleana) no se distinguieran de que el parámetro no estuviera. Lee esas banderas con [`queryFlag`](/es/src/ranuts/utils/query_flag).

2. **El fragmento nunca se cuela en el último valor.** `?lang=en#section` da `{ lang: 'en' }`.

3. **Solo parte el primer `=`**, de modo que un valor puede contener otro: `?next=/a?b=1` da `{ next: '/a?b=1' }`.

4. **Decodificación**: claves y valores se decodifican de porcentaje, y el `+` pasa a ser un espacio, igual que en `URLSearchParams`. Un escape mal formado como `%zz` se conserva tal cual en vez de descartar el parámetro, para que un valor defectuoso no oculte los demás.

5. **En el servidor**: devuelve `{}` cuando no hay `window` ni se pasó una `url`. Pásale una URL para usarlo en un script de compilación.

6. **URL por defecto**: sin `url`, usa `window.location.href`.

7. **Parámetros repetidos**: solo se conserva el último valor.
