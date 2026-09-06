# detectLanguage

Decide the dominant script of a piece of text by character ratio. Pure statistics: no
model, no dictionary. Use it to branch on "which tokenizer / which language-specific model /
which typographic metrics".

## API

### detectLanguage(text, sampleSize?)

| Parameter    | Description          | Type     | Default  |
| ------------ | -------------------- | -------- | -------- |
| `text`       | Text to inspect      | `string` | Required |
| `sampleSize` | Characters to sample | `number` | `20000`  |

Returns `'zh' \| 'ja' \| 'ko' \| 'en' \| 'other'`.

### navigatorLanguage()

The browser's UI language mapped to the same buckets. This is the default when there
is no content to inspect. Returns `'other'` under SSR.

## Example

```js
import { detectLanguage, navigatorLanguage } from 'ranuts';

const lang = book.content ? detectLanguage(book.content) : navigatorLanguage();
const model = { zh: 'title-zh-v1', ja: 'title-ja-v1', ko: 'title-ko-v1', en: 'title-en-v1' }[lang];
```

## Notes

1. **Only the head is sampled.** Prose language is consistent throughout; scanning a
   million-character book to learn what its first paragraph already tells you is waste.
2. **Chinese text with some English stays Chinese.** Latin has to clearly dominate (more than
   3×) before the verdict flips to English. Mixing English into Chinese is common; the
   reverse is not.
3. **Kana and Hangul are what settle CJK.** Han alone cannot separate Chinese from
   Japanese — Japanese writes kanji too. Kana can: Japanese uses it for every particle and
   inflection, Chinese not at all, and Hangul plays the same role for Korean. Han with no
   marker script is read as Chinese, the only one of the three written in Han alone.
4. **One quoted title does not flip the verdict.** A marker script has to make up at least
   5% of the CJK characters, so a Chinese page citing a Japanese film title stays Chinese.
5. **These are scripts wearing language names.** Spanish, Portuguese and German all report
   `'en'` — they are Latin script and want the same segmentation and line-breaking, and
   nothing downstream of this can tell them apart. Cyrillic, Arabic, Thai and digits-only
   text land in `'other'`. It is a coarse script bucket, not language identification.
