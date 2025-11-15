# getMatchingSentences

Extract complete sentences containing search keywords from text, keeping only the longest one for duplicate sentences.

## API

### getMatchingSentences

#### Return

| Argument | Description                                           | Type       |
| -------- | ----------------------------------------------------- | ---------- |
| `Array`  | Array of sentences containing keywords (deduplicated) | `string[]` |

#### Parameters

| Parameter     | Description    | Type     | Default  |
| ------------- | -------------- | -------- | -------- |
| `text`        | Source text    | `string` | Required |
| `searchValue` | Search keyword | `string` | Required |

## Example

### Basic Usage

```js
import { getMatchingSentences } from 'ranuts';

const text = 'This is the first sentence. This is the second sentence containing keyword. This is the third sentence.';
const sentences = getMatchingSentences(text, 'keyword');
console.log(sentences); // ['This is the second sentence containing keyword.']
```

### Multiple Sentence Matching

```js
import { getMatchingSentences } from 'ranuts';

const text = 'First sentence contains keyword. Second sentence also contains keyword. Third sentence does not.';
const sentences = getMatchingSentences(text, 'keyword');
console.log(sentences); // ['First sentence contains keyword.', 'Second sentence also contains keyword.']
```

### Handle Overlapping Sentences

```js
import { getMatchingSentences } from 'ranuts';

const text = 'Short sentence keyword. This is a long sentence containing keyword.';
const sentences = getMatchingSentences(text, 'keyword');
// Only keeps the longest sentence
console.log(sentences); // ['This is a long sentence containing keyword.']
```

### Handle Empty Values

```js
import { getMatchingSentences } from 'ranuts';

console.log(getMatchingSentences('', 'keyword')); // []
console.log(getMatchingSentences('text', '')); // []
```

## Notes

1. **Sentence recognition**: Identifies sentence boundaries through periods (。), dots (.), line breaks (\n), exclamation marks (！), question marks (?, ？).
2. **Deduplication**: For overlapping sentences, only keeps the longest one.
3. **Case insensitive**: Search ignores case.
4. **Use case**: Commonly used for search highlighting, text summarization, search result display, etc.
