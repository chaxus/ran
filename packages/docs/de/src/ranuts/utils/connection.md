# connection

Liefert Angaben zur aktuellen Netzwerkverbindung (Network Information API).

## API

### connection

#### Rückgabe

| Argument                          | Beschreibung                                     | Typ                               |
| --------------------------------- | ------------------------------------------------ | --------------------------------- |
| `NetworkInformation \| undefined` | Das Objekt der Netzwerkverbindung oder undefined | `NetworkInformation \| undefined` |

#### Parameter

Keine Parameter

## Beispiel

### Grundlegende Verwendung

```js
import { connection } from 'ranuts';

const conn = connection();
if (conn) {
  console.log('Netztyp:', conn.effectiveType);
  console.log('Downlink-Geschwindigkeit:', conn.downlink, 'Mbps');
  console.log('RTT:', conn.rtt, 'ms');
}
```

### Auf Netzwerkänderungen hören

```js
import { connection } from 'ranuts';

const conn = connection();
if (conn) {
  conn.addEventListener('change', () => {
    console.log('Der Netzzustand hat sich geändert');
    console.log('Neuer Netztyp:', conn.effectiveType);
  });
}
```

### Das Vorgehen ans Netz anpassen

```js
import { connection } from 'ranuts';

const conn = connection();
if (conn) {
  if (conn.effectiveType === 'slow-2g' || conn.effectiveType === '2g') {
    // Langsames Netz: Bilder in niedriger Qualität laden
    loadLowQualityImages();
  } else {
    // Schnelles Netz: Bilder in hoher Qualität laden
    loadHighQualityImages();
  }
}
```

## Hinweise

1. **Browser-Unterstützung**: Der Browser muss die Network Information API kennen; manche tun das nicht.
2. **Server-Umgebung**: In Server-Umgebungen (kein `window`-Objekt) kommt `undefined` zurück.
3. **Eigenschaften des Verbindungsobjekts**:
   - `effectiveType`: Netztyp ('slow-2g', '2g', '3g', '4g')
   - `downlink`: Downlink-Geschwindigkeit (Mbps)
   - `rtt`: Umlaufzeit (Millisekunden)
   - `saveData`: ob der Datensparmodus aktiv ist
4. **Einsatz**: üblich, um das Laden von Inhalten an das Netz anzupassen und die Leistung zu verbessern.
