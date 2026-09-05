# getMatchingSentences

Holt aus einem Text die vollständigen Sätze heraus, die das Suchwort enthalten; überschneiden sich zwei, bleibt nur der längere.

## API

### getMatchingSentences

#### Rückgabe

| Argument | Beschreibung                                       | Typ        |
| -------- | -------------------------------------------------- | ---------- |
| `Array`  | Array der Sätze mit dem Suchwort (ohne Dopplungen) | `string[]` |

#### Parameter

| Parameter     | Beschreibung | Typ      | Standard     |
| ------------- | ------------ | -------- | ------------ |
| `text`        | Ausgangstext | `string` | Erforderlich |
| `searchValue` | Suchwort     | `string` | Erforderlich |

## Beispiel

### Grundlegende Verwendung

```js
import { getMatchingSentences } from 'ranuts';

const text = 'This is the first sentence. This is the second sentence containing keyword. This is the third sentence.';
const sentences = getMatchingSentences(text, 'keyword');
console.log(sentences); // ['This is the second sentence containing keyword.']
```

### Wenn mehrere Sätze passen

```js
import { getMatchingSentences } from 'ranuts';

const text = 'First sentence contains keyword. Second sentence also contains keyword. Third sentence does not.';
const sentences = getMatchingSentences(text, 'keyword');
console.log(sentences); // ['First sentence contains keyword.', 'Second sentence also contains keyword.']
```

### Sich überschneidende Sätze

```js
import { getMatchingSentences } from 'ranuts';

const text = 'Short sentence keyword. This is a long sentence containing keyword.';
const sentences = getMatchingSentences(text, 'keyword');
// Nur der längste Satz bleibt übrig
console.log(sentences); // ['This is a long sentence containing keyword.']
```

### Leere Werte

```js
import { getMatchingSentences } from 'ranuts';

console.log(getMatchingSentences('', 'keyword')); // []
console.log(getMatchingSentences('text', '')); // []
```

## Hinweise

1. **Satzgrenzen**: erkannt an ideografischem Punkt (。), Punkt (.), Zeilenumbruch (\n), Ausrufezeichen (！) und Fragezeichen (?, ？).
2. **Ohne Dopplungen**: Überschneiden sich zwei Sätze, bleibt nur der längere.
3. **Groß- und Kleinschreibung**: bei der Suche egal.
4. **Einsatz**: üblich, um Treffer hervorzuheben, Texte zusammenzufassen und Suchergebnisse anzuzeigen.
