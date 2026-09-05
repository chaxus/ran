# getMatchingSentences

Extrae de un texto las frases completas que contienen una palabra buscada; si dos se solapan, conserva solo la más larga.

## API

### getMatchingSentences

#### Devuelve

| Argumento | Descripción                                              | Tipo       |
| --------- | -------------------------------------------------------- | ---------- |
| `Array`   | Array de frases que contienen la palabra (sin repetidos) | `string[]` |

#### Parámetros

| Parámetro     | Descripción     | Tipo     | Por defecto |
| ------------- | --------------- | -------- | ----------- |
| `text`        | Texto de origen | `string` | Obligatorio |
| `searchValue` | Palabra buscada | `string` | Obligatorio |

## Ejemplo

### Uso básico

```js
import { getMatchingSentences } from 'ranuts';

const text = 'This is the first sentence. This is the second sentence containing keyword. This is the third sentence.';
const sentences = getMatchingSentences(text, 'keyword');
console.log(sentences); // ['This is the second sentence containing keyword.']
```

### Cuando coinciden varias frases

```js
import { getMatchingSentences } from 'ranuts';

const text = 'First sentence contains keyword. Second sentence also contains keyword. Third sentence does not.';
const sentences = getMatchingSentences(text, 'keyword');
console.log(sentences); // ['First sentence contains keyword.', 'Second sentence also contains keyword.']
```

### Frases que se solapan

```js
import { getMatchingSentences } from 'ranuts';

const text = 'Short sentence keyword. This is a long sentence containing keyword.';
const sentences = getMatchingSentences(text, 'keyword');
// Solo se conserva la frase más larga
console.log(sentences); // ['This is a long sentence containing keyword.']
```

### Valores vacíos

```js
import { getMatchingSentences } from 'ranuts';

console.log(getMatchingSentences('', 'keyword')); // []
console.log(getMatchingSentences('text', '')); // []
```

## Notas

1. **Dónde acaba una frase**: por el punto ideográfico (。), el punto (.), el salto de línea (\n), la exclamación (！) y la interrogación (?, ？).
2. **Sin repetidos**: cuando dos frases se solapan, solo queda la más larga.
3. **Sin distinguir mayúsculas**: la búsqueda las ignora.
4. **Cuándo usarlo**: es habitual para resaltar resultados de búsqueda, resumir textos y mostrar coincidencias.
