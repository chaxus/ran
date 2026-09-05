# report / setReportUrl / createData

Schickt Telemetrie-Beacons an deinen eigenen Endpunkt.

## API

### setReportUrl(config)

Lege den Standard-Endpunkt einmal beim Start fest. Erlaubt ist eine URL als Zeichenkette oder ein Objekt:

| Feld           | Beschreibung                                             | Typ      |
| -------------- | -------------------------------------------------------- | -------- |
| `url`          | Standard-Endpunkt für jedes `report()` ohne eigene `url` | `string` |
| `userIdCookie` | Cookie mit der Benutzer-ID, die `createData()` mitnimmt  | `string` |

### getReportUrl()

Der eingestellte Endpunkt, sonst `''`.

### report({ url?, type?, payload })

Schickt `payload`. Bevorzugt `navigator.sendBeacon` und weicht sonst auf eine 1x1-Bildanfrage aus. Gibt `true` zurück, wenn irgendein Weg es angenommen hat, und `false`, wenn nichts senden konnte — auch dann, wenn gar kein Endpunkt eingestellt ist.

### createData(params?)

Baut den üblichen Umschlag: Ereignis-ID, Seiten-URL, Zeitstempel, Referrer, Viewport und User Agent, dazu `userId`, sofern `userIdCookie` eingestellt ist. Deine `params` werden zuletzt angewendet. Beim serverseitigen Rendern kommt `{}` zurück.

## Beispiel

```js
import { createData, report, setReportUrl } from 'ranuts';

setReportUrl({ url: 'https://telemetry.example.com/collect', userIdCookie: 'uid' });

report({ payload: { ...createData(), type: 'page_view' } });
```

## Hinweise

1. **Es gibt absichtlich keinen Standard-Endpunkt.** Eine Bibliothek kann nicht wissen, wohin deine Telemetrie gehört, also gibt `report()` lieber `false` zurück, als zu raten.
2. **Welcher Weg genommen wird, entscheidet sich daran, ob `sendBeacon` tatsächlich Erfolg hatte**, nicht daran, ob es `navigator` gibt. `sendBeacon` gibt auch dann `false` zurück, wenn die Warteschlange des Browsers ihr Kontingent überschreitet; auch dieser Fall landet beim Bild-Beacon.
3. **Ruf `createData()` je Ereignis auf, nicht einmal beim Einrichten.** Es hält URL und Zeitstempel in dem Moment fest, in dem es läuft; zieht man es aus dem Handler heraus, meldet jedes spätere Ereignis den Zustand beim Laden der Seite.

::: warning Ersetzt getHost in 0.3
`getHost()` gibt es nicht mehr. Es baute einen Log-Endpunkt aus einer fest einkodierten Domain des Autors dieses Repos, und eine liegen gebliebene Änderung hatte seine Ausgabe bereits auf das wörtliche `'//log.'` heruntergebracht (kein erreichbarer Host), sodass jeder Bericht ohne ausdrückliche `url` stillschweigend ins Leere ging. Auch `createData()` liest kein fest einkodiertes `chaxus_prod`-Cookie mehr; stelle stattdessen `userIdCookie` ein.
:::
