# detectLanguage

Bestimmt die vorherrschende Sprache eines Textes über das Verhältnis der Zeichen. Reine Statistik: kein Modell, kein Wörterbuch. Damit verzweigst du zwischen „welcher Tokenizer / welches sprachspezifische Modell / welche typografischen Maße“.

## API

### detectLanguage(text, sampleSize?)

| Parameter    | Beschreibung                  | Typ      | Standard     |
| ------------ | ----------------------------- | -------- | ------------ |
| `text`       | Zu untersuchender Text        | `string` | Erforderlich |
| `sampleSize` | Zahl der betrachteten Zeichen | `number` | `20000`      |

Gibt `'zh' \| 'en' \| 'other'` zurück.

### navigatorLanguage()

Die Oberflächensprache des Browsers, auf dieselben drei Gruppen abgebildet. Das ist der Standard, wenn es keinen Inhalt zu untersuchen gibt. Unter SSR kommt `'other'` zurück.

## Beispiel

```js
import { detectLanguage, navigatorLanguage } from 'ranuts';

const lang = book.content ? detectLanguage(book.content) : navigatorLanguage();
const model = { zh: 'chapter-title-zh-v1', en: 'chapter-title-en-v1' }[lang];
```

## Hinweise

1. **Nur der Anfang wird betrachtet.** Die Sprache eines Textes bleibt durchgehend dieselbe; ein Buch mit einer Million Zeichen zu durchlaufen, um zu erfahren, was schon der erste Absatz verrät, ist Verschwendung.
2. **Chinesischer Text mit etwas Englisch bleibt Chinesisch.** Erst wenn das lateinische Alphabet deutlich überwiegt (mehr als das Dreifache), kippt das Urteil zu Englisch. Englisch in chinesischen Text zu mischen ist verbreitet, umgekehrt nicht.
3. **`'other'` heißt „weder CJK noch lateinisch“.** Japanische Kana, Kyrillisch, Arabisch und Texte aus lauter Ziffern landen alle hier. Das ist eine grobe Dreiteilung, keine Sprachbestimmung.
