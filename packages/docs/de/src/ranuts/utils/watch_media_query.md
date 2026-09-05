# matchMediaQuery / watchMediaQuery

Eine CSS-Media-Query aus JavaScript lesen und abonnieren.

Für Layout-Entscheidungen nimm lieber das hier als `isMobile()`: Am User Agent zu schnüffeln erkennt das **Gerät**, eine Media-Query erkennt den **Viewport** — und nur Letzteres stimmt, wenn ein Browser am Rechner schmaler gezogen oder ein Tablet gedreht wird.

## API

| Funktion                           | Beschreibung                                                        |
| ---------------------------------- | ------------------------------------------------------------------- |
| `matchMediaQuery(query)`           | Passt die Abfrage gerade? Unter SSR `false`                         |
| `watchMediaQuery(query, callback)` | Abonniert Änderungen; gibt eine Funktion zum Abbestellen zurück     |
| `MOBILE_MEDIA_QUERY`               | `'(max-width: 768px)'`, der gemeinsame Umbruchpunkt fürs Mobilgerät |

## Beispiel

```js
import { MOBILE_MEDIA_QUERY, watchMediaQuery } from 'ranuts';

const off = watchMediaQuery(MOBILE_MEDIA_QUERY, (isMobile) => render(isMobile));
onCleanup(off);
```

## Hinweise

1. **Die Rückruffunktion läuft einmal synchron** mit dem aktuellen Wert, den Anfangszustand musst du also nie gesondert lesen.
2. **Bestelle immer ab.** Ein nicht freigegebener `MediaQueryList`-Listener hält die Closure (und alles DOM, das sie eingefangen hat) am Leben.
3. **Altes Safari ist bedacht.** `addEventListener` an `MediaQueryList` kam erst mit Safari 14; als Rückfall dienen `addListener`/`removeListener`.
