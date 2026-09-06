# getPerformance

Holt die Leistungsdaten der Seite: DNS-Auflösung, TCP-Verbindung, Laden der Ressourcen und weitere Kennzahlen.

## API

### getPerformance

#### Rückgabe

| Argument                 | Beschreibung                      | Typ                      |
| ------------------------ | --------------------------------- | ------------------------ |
| `BasicType \| undefined` | Das Objekt mit den Leistungsdaten | `BasicType \| undefined` |

#### BasicType

| Eigenschaft    | Beschreibung                                                                | Typ                   |
| -------------- | --------------------------------------------------------------------------- | --------------------- |
| `dnsSearch`    | Dauer der DNS-Auflösung (ms)                                                | `number`              |
| `tcpConnect`   | Dauer der TCP-Verbindung (ms)                                               | `number`              |
| `sslConnect`   | Dauer der sicheren SSL-Verbindung (ms)                                      | `number`              |
| `request`      | TTFB: Dauer der Netzwerkanfrage (ms)                                        | `number`              |
| `response`     | Dauer der Datenübertragung (ms)                                             | `number`              |
| `parseDomTree` | Dauer des DOM-Parsens (ms)                                                  | `number`              |
| `resource`     | Dauer des Ressourcenladens (ms)                                             | `number`              |
| `domReady`     | Zeit bis DOM Ready (ms)                                                     | `number`              |
| `httpHead`     | Größe der HTTP-Header (Bytes)                                               | `number`              |
| `interactive`  | Zeit bis zur ersten Bedienbarkeit (ms)                                      | `number`              |
| `complete`     | Zeit bis die Seite vollständig geladen ist (ms)                             | `number`              |
| `redirect`     | Anzahl der Weiterleitungen                                                  | `number`              |
| `redirectTime` | Dauer der Weiterleitungen (ms)                                              | `number`              |
| `duration`     | Gesamtdauer der Ressourcenanfragen (ms)                                     | `number`              |
| `fp`           | Zeit bis zum ersten Zeichnen (Dauer des weißen Bildschirms, ms)             | `number \| undefined` |
| `fcp`          | Zeit bis zum ersten inhaltlichen Zeichnen (Ende des ersten Bildschirms, ms) | `number \| undefined` |

#### Parameter

Keine Parameter

## Beispiel

### Grundlegende Verwendung

```js
import { getPerformance } from 'ranuts';

const perf = getPerformance();
if (perf) {
  console.log('DNS-Auflösung:', perf.dnsSearch, 'ms');
  console.log('TCP-Verbindung:', perf.tcpConnect, 'ms');
  console.log('Erster Bildschirm:', perf.fcp, 'ms');
}
```

### Leistungsmessung

```js
import { getPerformance } from 'ranuts';

window.addEventListener('load', () => {
  const perf = getPerformance();
  if (perf) {
    // Die Leistungsdaten an den Server schicken
    sendToServer({
      dns: perf.dnsSearch,
      tcp: perf.tcpConnect,
      request: perf.request,
      fcp: perf.fcp,
    });
  }
});
```

### Analyse der Leistung

```js
import { getPerformance } from 'ranuts';

function analyzePerformance() {
  const perf = getPerformance();
  if (!perf) return;

  console.log('=== Analyse der Leistung ===');
  console.log('DNS-Auflösung:', perf.dnsSearch, 'ms');
  console.log('TCP-Verbindung:', perf.tcpConnect, 'ms');
  console.log('SSL-Handschlag:', perf.sslConnect, 'ms');
  console.log('Antwort auf die Anfrage:', perf.request, 'ms');
  console.log('Datenübertragung:', perf.response, 'ms');
  console.log('DOM-Parsen:', perf.parseDomTree, 'ms');
  console.log('Ressourcen laden:', perf.resource, 'ms');
  console.log('Erstes Zeichnen:', perf.fp, 'ms');
  console.log('Erstes inhaltliches Zeichnen:', perf.fcp, 'ms');
}
```

## Hinweise

1. **Browser-Unterstützung**: Der Browser muss die Performance API kennen — alle modernen tun das.

2. **Server-Umgebung**: Gibt in Server-Umgebungen (kein `window`-Objekt) `undefined` zurück.

3. **Zeitpunkt**: Ruf es am besten auf, nachdem die Seite fertig geladen hat (`load`-Ereignis), damit die Daten vollständig sind.

4. **Einheiten**: Alle Zeiten in Millisekunden, alle Größen in Bytes.

5. **Einsatz**: üblich zur Überwachung, zur Analyse und zur Verbesserung der Leistung.
