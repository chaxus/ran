# detectLanguage

Bestimmt die vorherrschende Schrift eines Textes über das Verhältnis der Zeichen. Reine Statistik: kein Modell, kein Wörterbuch. Damit verzweigst du zwischen „welcher Tokenizer / welches sprachspezifische Modell / welche typografischen Maße“.

## API

### detectLanguage(text, sampleSize?)

| Parameter    | Beschreibung                  | Typ      | Standard     |
| ------------ | ----------------------------- | -------- | ------------ |
| `text`       | Zu untersuchender Text        | `string` | Erforderlich |
| `sampleSize` | Zahl der betrachteten Zeichen | `number` | `20000`      |

Gibt `'zh' \| 'ja' \| 'ko' \| 'en' \| 'other'` zurück.

### navigatorLanguage()

Die Oberflächensprache des Browsers, auf dieselben Gruppen abgebildet. Das ist der Standard, wenn es keinen Inhalt zu untersuchen gibt. Unter SSR kommt `'other'` zurück.

## Beispiel

```js
import { detectLanguage, navigatorLanguage } from 'ranuts';

const lang = book.content ? detectLanguage(book.content) : navigatorLanguage();
const model = { zh: 'title-zh-v1', ja: 'title-ja-v1', ko: 'title-ko-v1', en: 'title-en-v1' }[lang];
```

## Hinweise

1. **Nur der Anfang wird betrachtet.** Die Sprache eines Textes bleibt durchgehend dieselbe; ein Buch mit einer Million Zeichen zu durchlaufen, um zu erfahren, was schon der erste Absatz verrät, ist Verschwendung.
2. **Chinesischer Text mit etwas Englisch bleibt Chinesisch.** Erst wenn das lateinische Alphabet deutlich überwiegt (mehr als das Dreifache), kippt das Urteil zu Englisch. Englisch in chinesischen Text zu mischen ist verbreitet, umgekehrt nicht.
3. **Innerhalb des CJK entscheiden Kana und Hangul.** Han-Zeichen allein trennen Chinesisch nicht von Japanisch, denn auch Japanisch schreibt Kanji. Kana trennt sehr wohl: Japanisch benutzt es für jede Partikel und jede Beugung, Chinesisch überhaupt nicht, und im Koreanischen übernimmt Hangul dieselbe Rolle. Han ohne jede kennzeichnende Schrift wird als Chinesisch gelesen — von den dreien wird nur Chinesisch allein in Han geschrieben.
4. **Ein zitierter Titel dreht das Urteil nicht um.** Die kennzeichnende Schrift muss mindestens 5% der CJK-Zeichen ausmachen; eine chinesische Seite, die einen japanischen Filmtitel zitiert, bleibt also Chinesisch.
5. **Das sind Schriften unter dem Namen von Sprachen.** Spanisch, Portugiesisch und Deutsch geben alle `'en'` zurück: Sie teilen sich das lateinische Alphabet, wollen dieselbe Segmentierung und denselben Zeilenumbruch, und nichts unterhalb dieser Funktion könnte sie auseinanderhalten. Kyrillisch, Arabisch, Thai und Texte aus lauter Ziffern landen in `'other'`. Es ist eine grobe Einteilung nach Schrift, keine Sprachbestimmung.
