# resolveLocale

Wählt aus den Sprachen, die du unterstützt, die passende aus — entlang der üblichen Kette: **Query → Cookie → localStorage → navigator → Rückfallwert**.

Der Katalog der Texte gehört dir; hier wird nur der Schlüssel gewählt.

## API

### resolveLocale(options)

| Option         | Beschreibung                                                                                    | Typ                 | Standard         |
| -------------- | ----------------------------------------------------------------------------------------------- | ------------------- | ---------------- |
| `supported`    | Die Sprachen, die du tatsächlich auslieferst, die genaueste zuerst                              | `readonly string[]` | Erforderlich     |
| `fallback`     | Wird zurückgegeben, wenn nichts passt                                                           | `string`            | `supported[0]`   |
| `query`        | Abfrageparameter mit einer ausdrücklichen Wahl, etwa `lang`                                     | `string`            | —                |
| `cookie`       | Name des Cookies, das die Wahl trägt                                                            | `string`            | —                |
| `storageKey`   | localStorage-Schlüssel mit der zuletzt getroffenen Wahl                                         | `string`            | —                |
| `useNavigator` | Ob `navigator.languages` und `navigator.language` befragt werden, bevor der Rückfallwert greift | `boolean`           | `true`           |
| `url`          | URL, aus der die Query gelesen wird                                                             | `string`            | Der aktuelle Ort |

#### Rückgabe

Der passende Eintrag aus `supported`: immer einer davon, nie eine beliebige Zeichenkette.

## Beispiel

### Die ganze Kette

```js
import { resolveLocale } from 'ranuts';

const locale = resolveLocale({
  supported: ['en', 'zh-CN'],
  query: 'lang',
  cookie: 'lang',
  storageKey: 'app-lang',
});

document.documentElement.lang = locale;
render(messages[locale]);
```

### Regionale Varianten fallen auf die Grundsprache zurück

```js
import { resolveLocale } from 'ranuts';

const supported = ['en', 'zh-CN'];

resolveLocale({ supported, query: 'lang', url: '?lang=en-GB' }); // 'en'
resolveLocale({ supported, query: 'lang', url: '?lang=zh' }); // 'zh-CN'
resolveLocale({ supported, query: 'lang', url: '?lang=de' }); // 'en'  (nicht unterstützt → Rückfallwert)
```

### Zusammen mit sprachbehafteten URLs

```js
import { resolveLocale, createLocalePath } from 'ranuts';

const paths = createLocalePath({
  locales: [{ code: 'en' }, { code: 'zh-CN', prefix: 'zh' }],
});

// Was die URL schon sagt, hat Vorrang; sonst gilt die eigene Vorliebe.
const locale = paths.localeFromPath(location.pathname) ?? resolveLocale({ supported: ['en', 'zh-CN'] });
```

## Hinweise

1. **Auf die Reihenfolge kommt es an.** Ein `?lang=` in der URL ist ausdrücklich, weitergebbar und einmalig — es schlägt daher alles andere. Ein Cookie ist eine Entscheidung, die auch der Server sieht, und schlägt somit reinen Client-Zustand. localStorage ist das, was zuletzt in der Anwendung gewählt wurde. `navigator.language` ist bloß eine Vermutung über jemanden, der zum ersten Mal vorbeikommt. Kehrt man das um, entsteht der klassische Fehler: Ein geteilter Link mit `?lang=en` wird beim Empfänger weiterhin in dessen gespeicherter Sprache dargestellt.

2. **Das Ergebnis ist immer eines aus `supported`.** Ein Wert außerhalb der Liste wird übergangen statt zurückgegeben; mit dem Ergebnis lässt sich also gefahrlos ein Textkatalog ansprechen.

3. **Der Abgleich achtet nicht auf Groß- und Kleinschreibung und fällt auf die Grundsprache zurück.** Bei `supported: ['en', 'zh-CN']` trifft `en-GB` auf `en` und `zh` auf `zh-CN`.

4. **`navigator.languages` wird der Reihe nach befragt**, nicht nur `navigator.language`: Diese Liste ist die tatsächliche Rangfolge der Vorlieben, und ihr erster Eintrag ist oft nicht die beste verfügbare Entsprechung.

5. **Jede Quelle zieht sich leise zurück.** Kein `window`, kein `document.cookie`, kein localStorage: Jede steuert dann einfach nichts bei, sodass die Kette beim serverseitigen Rendern und in Build-Skripten funktioniert.
