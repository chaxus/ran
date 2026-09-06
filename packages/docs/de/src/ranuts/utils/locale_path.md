# createLocalePath

Die URL-Rechnerei einer mehrsprachigen Website. Reine Funktionen, kein globaler Zustand, kein DOM — brauchbar im Build-Skript (Sitemap, `hreflang`) wie im Browser.

Nimmt **Unterverzeichnisse** (`/zh/book/`) statt Subdomains (`zh.example.com/book/`): Suchmaschinen behandeln eine Subdomain als eigene Site, deren Ansehen bei null beginnt, während ein Unterverzeichnis das der Hauptsite erbt. Die Standardsprache liegt an der Wurzel; alle anderen tragen ein Präfix.

## API

### createLocalePath(config)

| Parameter       | Beschreibung                                                                            | Typ             | Standard              |
| --------------- | --------------------------------------------------------------------------------------- | --------------- | --------------------- |
| `locales`       | `{ code, prefix? }[]`; kein Präfix heißt „die Standardsprache, sie liegt an der Wurzel“ | `LocaleRoute[]` | Erforderlich          |
| `defaultLocale` | Code der Standardsprache                                                                | `string`        | die erste ohne Präfix |
| `base`          | Unterpfad der Auslieferung, etwa `/weread`; ein Schrägstrich am Ende wird übergangen    | `string`        | `''`                  |

Zurück kommt:

| Element                         | Beschreibung                                                                |
| ------------------------------- | --------------------------------------------------------------------------- |
| `base` / `defaultLocale`        | Die normalisierte Konfiguration, nur lesbar                                 |
| `localeFromPath(pathname)`      | Erkennt die Sprache; unbekannte Pfade fallen auf die Standardsprache zurück |
| `stripLocale(pathname)`         | Entfernt das Sprachpräfix: der sprachfreie Pfad fürs Routing                |
| `href(path, code?)`             | Baut einen Link für eine Sprache                                            |
| `hrefForLocale(pathname, code)` | Richtet den aktuellen Pfad auf eine andere Sprache aus (Sprachumschalter)   |
| `alternates(pathname)`          | Die URL jeder Sprache, für `<link rel="alternate" hreflang>`                |

## Beispiel

```js
import { createLocalePath } from 'ranuts';

const paths = createLocalePath({
  locales: [{ code: 'en' }, { code: 'zh-CN', prefix: 'zh' }, { code: 'zh-HK', prefix: 'zh-hant' }],
  base: '/docs',
});

paths.href('/book/walden/'); // '/docs/book/walden/'
paths.href('/book/walden/', 'zh-CN'); // '/docs/zh/book/walden/'
paths.localeFromPath('/docs/zh/book/'); // 'zh-CN'
paths.stripLocale('/docs/zh/book/'); // '/docs/book/'
paths.hrefForLocale('/docs/zh/book/', 'zh-HK'); // '/docs/zh-hant/book/'

// hreflang-Tags
paths.alternates(location.pathname).forEach(({ code, href }) => {
  head.append(link({ rel: 'alternate', hreflang: code, href }));
});
```

## Hinweise

1. **`href` ist idempotent.** Es entfernt ein vorhandenes Präfix, bevor es das neue setzt; einen bereits lokalisierten Pfad hineinzugeben verdoppelt also nichts — und `hrefForLocale` ist nichts anderes als `href`.
2. **Das längste Präfix gewinnt**, `zh` verschluckt also nicht `/zh-hant/...`.
3. **`base` wird nur am Anfang entfernt.** `replace(base, '')` würde das erste Vorkommen irgendwo entfernen, was bricht, sobald der Pfad dieselbe Zeichenfolge in der Mitte enthält.
4. **Query und Hash bleiben erhalten**: Die Rechnerei fasst nur den Pfadteil an.
5. **Es gibt keine globale „aktuelle Sprache“.** Übergib den Code ausdrücklich oder lass den Standard greifen. Welche Sprache aktiv ist, entscheidet die i18n-Laufzeit, nicht dieses Modul.
