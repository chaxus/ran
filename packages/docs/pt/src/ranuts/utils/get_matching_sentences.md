# getMatchingSentences

Extrai de um texto as frases inteiras que contêm a palavra buscada; quando duas se sobrepõem, guarda só a mais longa.

## API

### getMatchingSentences

#### Retorna

| Argumento | Descrição                                              | Tipo       |
| --------- | ------------------------------------------------------ | ---------- |
| `Array`   | Array das frases que contêm a palavra (sem repetições) | `string[]` |

#### Parâmetros

| Parâmetro     | Descrição       | Tipo     | Padrão      |
| ------------- | --------------- | -------- | ----------- |
| `text`        | Texto de origem | `string` | Obrigatório |
| `searchValue` | Palavra buscada | `string` | Obrigatório |

## Exemplo

### Uso básico

```js
import { getMatchingSentences } from 'ranuts';

const text = 'This is the first sentence. This is the second sentence containing keyword. This is the third sentence.';
const sentences = getMatchingSentences(text, 'keyword');
console.log(sentences); // ['This is the second sentence containing keyword.']
```

### Quando várias frases combinam

```js
import { getMatchingSentences } from 'ranuts';

const text = 'First sentence contains keyword. Second sentence also contains keyword. Third sentence does not.';
const sentences = getMatchingSentences(text, 'keyword');
console.log(sentences); // ['First sentence contains keyword.', 'Second sentence also contains keyword.']
```

### Frases que se sobrepõem

```js
import { getMatchingSentences } from 'ranuts';

const text = 'Short sentence keyword. This is a long sentence containing keyword.';
const sentences = getMatchingSentences(text, 'keyword');
// Só a frase mais longa é guardada
console.log(sentences); // ['This is a long sentence containing keyword.']
```

### Valores vazios

```js
import { getMatchingSentences } from 'ranuts';

console.log(getMatchingSentences('', 'keyword')); // []
console.log(getMatchingSentences('text', '')); // []
```

## Notas

1. **Onde uma frase termina**: pelo ponto ideográfico (。), pelo ponto (.), pela quebra de linha (\n), pela exclamação (！) e pela interrogação (?, ？).
2. **Sem repetições**: quando duas frases se sobrepõem, fica só a mais longa.
3. **Sem diferenciar maiúsculas**: a busca as ignora.
4. **Quando usar**: é comum para destacar resultados de busca, resumir textos e exibir ocorrências.
