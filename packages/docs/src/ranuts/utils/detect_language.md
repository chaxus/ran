# detectLanguage

Decide the dominant language of a piece of text by character ratio. Pure statistics: no
model, no dictionary. Use it to branch on "which tokenizer / which language-specific model /
which typographic metrics".

## API

### detectLanguage(text, sampleSize?)

| Parameter    | Description          | Type     | Default  |
| ------------ | -------------------- | -------- | -------- |
| `text`       | Text to inspect      | `string` | Required |
| `sampleSize` | Characters to sample | `number` | `20000`  |

Returns `'zh' \| 'en' \| 'other'`.

### navigatorLanguage()

The browser's UI language mapped to the same three buckets. This is the default when there
is no content to inspect. Returns `'other'` under SSR.

## Example

```js
import { detectLanguage, navigatorLanguage } from 'ranuts';

const lang = book.content ? detectLanguage(book.content) : navigatorLanguage();
const model = { zh: 'chapter-title-zh-v1', en: 'chapter-title-en-v1' }[lang];
```

## Notes

1. **Only the head is sampled.** Prose language is consistent throughout; scanning a
   million-character book to learn what its first paragraph already tells you is waste.
2. **Chinese text with some English stays Chinese.** Latin has to clearly dominate (more than
   3×) before the verdict flips to English. Mixing English into Chinese is common; the
   reverse is not.
3. **`'other'` means "neither CJK nor Latin."** Japanese kana, Cyrillic, Arabic and
   digits-only text all land here. This is a coarse three-way bucket, not language identification.
