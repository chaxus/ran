# Zeitangaben formatieren

Zeit erscheint in einer Oberfläche in drei verschiedenen Gestalten, und sie durcheinanderzubringen ist die übliche Quelle von Verwirrung. `ranuts` gibt jeder davon ihre eigene Funktion:

| Wonach der Leser fragt         | Funktion                               | Beispielausgabe       |
| ------------------------------ | -------------------------------------- | --------------------- |
| _Wann_ genau ist das passiert? | [`formatDate`](./timestamp_to_time.md) | `2026-07-25 14:05:09` |
| _Wie lang_ ist das?            | `formatDuration`                       | `01:01:01`            |
| Wie lange ist das _her_?       | `formatRelative`                       | `3 days ago`, `5m`    |

## formatDuration

Bringt eine Anzahl vergangener **Sekunden** in die durch Doppelpunkte getrennte Uhrenform, die ein Medienplayer für die Abspielposition benutzt: `mm:ss`, jenseits einer Stunde erweitert zu `hh:mm:ss`.

#### Parameter

| Parameter | Beschreibung                                             | Typ      | Standard     |
| --------- | -------------------------------------------------------- | -------- | ------------ |
| `seconds` | Vergangene Sekunden; negative Werte werden auf 0 gezogen | `number` | Erforderlich |

#### Returns

`string`: die Dauer, oder `''`, wenn die Eingabe keine endliche Zahl ist.

```js
import { formatDuration } from 'ranuts/utils';

formatDuration(0); // '00:00'
formatDuration(65); // '01:05'
formatDuration(3661); // '01:01:01'
formatDuration(NaN); // ''
```

Die leere Zeichenkette bei `NaN` ist Absicht: Ein Player fragt `video.duration` ab, bevor die Metadaten geladen sind, und bekommt `NaN` – an dieser Stelle liest sich eine leere Beschriftung besser als `NaN:NaN`.

::: tip Umbenannt
Diese Funktion hieß früher `timeFormat`. Der Name bleibt als veralteter Zweitname erhalten und verhält sich genauso, sagte aber nicht, _welches_ der drei Zeitformate er erzeugt.
:::

## formatRelative

Beschreibt einen Zeitpunkt im Verhältnis zu einem anderen: „vor 3 Tagen“, „in 2 Stunden“.

Die sprachliche Anpassung übernimmt das [`Intl.RelativeTimeFormat`](https://developer.mozilla.org/de/docs/Web/JavaScript/Reference/Global_Objects/Intl/RelativeTimeFormat) der Plattform, seit 2020 in jedem großen Browser vorhanden, das die Plural- und Beugungsregeln jeder Sprache bereits kennt. `formatRelative` steuert nur den Teil bei, den `Intl` absichtlich auslässt: die Entscheidung, in _welcher_ Einheit der Abstand ausgedrückt wird.

Wie `Intl` selbst nennt es **eine einzige** Einheit: Ein Abstand von 3 Tagen und 6 Stunden ist „vor 3 Tagen“, nie „vor 3 Tagen und 6 Stunden“.

#### Parameter

| Parameter | Beschreibung                   | Typ                        | Standard     |
| --------- | ------------------------------ | -------------------------- | ------------ |
| `value`   | Der zu beschreibende Zeitpunkt | `number \| string \| Date` | Erforderlich |
| `options` | Siehe unten                    | `FormatRelativeOptions`    | `{}`         |

| Option    | Beschreibung                                                               | Typ                        | Standard                 |
| --------- | -------------------------------------------------------------------------- | -------------------------- | ------------------------ |
| `now`     | Woran gemessen wird                                                        | `number \| string \| Date` | die aktuelle Zeit        |
| `locale`  | BCP-47-Kennung(en); der Stil `compact` übergeht sie                        | `string \| string[]`       | die der Laufzeitumgebung |
| `style`   | `'long' \| 'short' \| 'narrow' \| 'compact'`                               | `RelativeStyle`            | `'long'`                 |
| `numeric` | `'auto'` setzt Wendungen wie `yesterday` ein; `'always'` behält Zahlen bei | `'always' \| 'auto'`       | `'auto'`                 |

#### Returns

`string` – die Beschreibung, oder `''`, wenn eines der beiden Enden nicht lesbar ist.

```js
import { formatRelative } from 'ranuts/utils';

const twoHoursAgo = Date.now() - 2 * 3600_000;

formatRelative(twoHoursAgo); // '2 hours ago'
formatRelative(twoHoursAgo, { style: 'short' }); // '2 hr. ago'
formatRelative(twoHoursAgo, { locale: 'zh-CN' }); // '2 小时前'
formatRelative(Date.now() + 60_000); // 'in 1 minute'
formatRelative(Date.now() - 86_400_000); // 'yesterday'
formatRelative(Date.now() - 86_400_000, { numeric: 'always' }); // '1 day ago'
```

### Der Stil compact

`compact` ist jene gedrängte Plakettenform, die neben den Einträgen eines Feeds oder einer Liste steht:

```js
formatRelative(Date.now() - 30_000, { style: 'compact' }); // '30s'
formatRelative(Date.now() - 5 * 60_000, { style: 'compact' }); // '5m'
formatRelative(Date.now() - 3 * 3600_000, { style: 'compact' }); // '3h'
formatRelative(Date.now() - 2 * 86_400_000, { style: 'compact' }); // '2d'
```

::: warning Es trägt keine Richtung
`compact` ist bloß ein Betrag, ein künftiger Zeitpunkt sieht also genauso aus wie ein vergangener (`5m` in beide Richtungen). Gedacht ist es für Feeds bereits geschehener Ereignisse. Überall dort, wo der Leser Vergangenheit von Zukunft unterscheiden muss, nimm einen der anderen Stile.
:::

## parseVttTimestamp / parseVttCueTiming

Liest die Zeitangaben von WebVTT-Untertiteln: die Zeilen `hh:mm:ss.mmm --> hh:mm:ss.mmm` in einer `.vtt`-Datei.

`parseVttTimestamp` wandelt einen einzelnen Zeitstempel (`hh:` ist freigestellt) in Sekunden um; `parseVttCueTiming` liest eine ganze Cue-Zeitzeile – beide durch `-->` getrennten Seiten – als `{ start, end }` und übergeht dabei angehängte Cue-Einstellungen (`align:start line:0`).

```js
import { parseVttTimestamp, parseVttCueTiming } from 'ranuts/utils';

parseVttTimestamp('00:00:05.000'); // 5
parseVttTimestamp('01:05.250'); // 65.25
parseVttTimestamp('not a timestamp'); // undefined

parseVttCueTiming('00:00:00.000 --> 00:00:05.000'); // { start: 0, end: 5 }
parseVttCueTiming('00:00:05.000 --> 00:00:10.000 align:start line:0'); // { start: 5, end: 10 }
```

Beide geben `undefined` zurück, wenn die Eingabe nicht passt, und werfen nie. So lässt sich eine fehlerhafte Zeile in einer Untertiteldatei überspringen, statt die ganze Auswertung abzubrechen.

## Hinweise

1. **Wahl der Einheit**: `formatRelative` nimmt die gröbste Einheit, die der Abstand tatsächlich füllt, und rundet innerhalb davon. Landet das Runden auf der Schwelle zur nächsten Einheit (59,6 Minuten, die zu „60 Minuten“ werden), steigt es auf, und du liest „vor 1 Stunde“.
2. **Symmetrisches Runden**: Gerundet wird der Betrag, danach kommt das Vorzeichen zurück – in JavaScript ergibt `Math.round(-1.5)` nämlich `-1`, und sonst hieße es „vor 1 Stunde“ für 90 Minuten zurück, aber „in 2 Stunden“ für 90 Minuten voraus.
3. **Formatter wiederverwenden**: `Intl.RelativeTimeFormat`-Instanzen werden je Kombination aus Sprache, Stil und `numeric` zwischengespeichert. Eine Liste mit hundert Zeitangaben baut daher einen Formatter, nicht hundert.
4. **Rückfall**: In einer Laufzeitumgebung ohne `Intl.RelativeTimeFormat` weicht die Ausgabe auf die kompakte Form aus, statt zu werfen.
