# encodeUrl

Codifica una URL sin peligro: deja intactas las secuencias ya codificadas y trata los pares suplentes sueltos.

## API

### encodeUrl

#### Devuelve

| Argumento | Descripción       | Tipo     |
| --------- | ----------------- | -------- |
| `string`  | La URL codificada | `string` |

#### Parámetros

| Parámetro | Descripción         | Tipo     | Por defecto |
| --------- | ------------------- | -------- | ----------- |
| `url`     | URL que se codifica | `string` | Obligatorio |

## Ejemplo

### Uso básico

```js
import { encodeUrl } from 'ranuts';

const url = 'https://example.com/path with spaces';
const encoded = encodeUrl(url);
console.log(encoded); // 'https://example.com/path%20with%20spaces'
```

### URL ya codificadas

```js
import { encodeUrl } from 'ranuts';

// Lo que ya estaba codificado no se vuelve a codificar
const url = 'https://example.com/path%20with%20spaces';
const encoded = encodeUrl(url);
console.log(encoded); // 'https://example.com/path%20with%20spaces'
```

### Caracteres especiales

```js
import { encodeUrl } from 'ranuts';

const url = 'https://example.com/search?q=hello world&lang=zh-CN';
const encoded = encodeUrl(url);
console.log(encoded); // La URL codificada
```

### Codificaciones rotas

```js
import { encodeUrl } from 'ranuts';

// Las secuencias rotas (como %foo) sí se codifican
const url = 'https://example.com/path%foo';
const encoded = encodeUrl(url);
console.log(encoded); // 'https://example.com/path%25foo'
```

## Notas

1. **Codificación con criterio**: solo toca lo que no estaba codificado; las secuencias ya codificadas (como `%20`) se quedan como están.
2. **Pares suplentes**: los pares suplentes sueltos se resuelven solos y se sustituyen por el carácter de reemplazo de Unicode.
3. **Sin errores**: no lanza excepciones; intenta codificar la URL lo mejor posible.
4. **Cuándo usarlo**: es habitual para tratar URL escritas por el usuario y para construir URL seguras.
