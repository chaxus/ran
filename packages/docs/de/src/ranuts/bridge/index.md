# Brücke (postMessage)

Eine kleine Nachrichtenschicht zwischen Kontexten, aufgesetzt auf `window.postMessage`. Sie lässt zwei Browsing-Kontexte – eine Elternseite und ein `<iframe>`, ein Pop-up oder irgendein anderes `Window`, auf das du eine Referenz hältst – miteinander reden, über eine API aus Anfrage und Antwort (im Stil von RPC) und über Rundrufe in eine Richtung.

Nachrichten überqueren die Grenze als **strukturierte Objekte** (über den eingebauten Structured-Clone-Algorithmus von `postMessage`), Typen wie `Date`, `Map`, `Set`, `ArrayBuffer` und `File` kommen also unversehrt an, ganz ohne Serialisierung von Hand. Jede Nachricht trägt eine Protokollmarke, damit sie sich vom `postMessage`-Verkehr anderer Bibliotheken unterscheiden lässt (HMR, DevTools, fremde SDKs).

Es gibt drei Wege, damit zu arbeiten:

- **`PostMessageBridge`**: der Grundbaustein auf unterster Ebene. Eine Instanz umschließt ein Ziel-`Window`. Handler meldest du mit `on` an, mit `send` schickst du und wartest, mit `broadcast` schickst du ohne Rückfrage.
- **`BridgeManager` / `bridgeManager` / `Client` / `Platform`**: eine Ebene darüber, die ein Verzeichnis benannter Brücken führt (ein Singleton), dazu die schlanken Fassaden `Client` (die aufrufende Seite) und `Platform` (die empfangende Seite).
- **`openPortBridge` / `acceptPortBridge` / `createPortBridge`**: eine Punkt-zu-Punkt-Brücke auf `MessageChannel` / `MessagePort` (**für neuen Code empfohlen**). Nach einem einmaligen Handschlag hält jede Seite einen privaten Port; das verhindert schon von der Bauart her Übersprechen zwischen Fenstern, vorgetäuschte Absender, Kanalkollisionen im selben Fenster und das Beantworten der eigenen Anfrage – ganz ohne Filtern nach Herkunft.

> **Verträglichkeit**: Das Übertragungsformat ist ein strukturiertes Objekt, keine Base64-Zeichenkette mehr. Endpunkte derselben Version verstehen sich unmittelbar, und `Client` (`PostMessageBridge`) teilt mit `Platform` dasselbe Umschlagprotokoll. Mischst du über Versionen hinweg eine alte mit einer neuen Seite, passt das Protokoll nicht zusammen.

## API

### `PostMessageBridge`

Die zentrale Klasse. Jede Instanz zielt auf genau ein `Window`. Statt dass jede ihren eigenen anmeldet, teilen sich alle Instanzen **einen einzigen** `message`-Listener auf `window`, und ein interner Verteiler leitet weiter; die Zahl der Listener wächst also nicht mit der Zahl der Instanzen.

```ts
new PostMessageBridge(targetWindow?: Window, targetOrigin?: string, channel?: string)
```

#### Parameter des Konstruktors

| Parameter      | Beschreibung                                                                                                                             | Typ      | Standard    |
| -------------- | ---------------------------------------------------------------------------------------------------------------------------------------- | -------- | ----------- |
| `targetWindow` | Das `Window`, an das Nachrichten gehen (ein iframe, ein Pop-up, `parent`, …)                                                             | `Window` | `window`    |
| `targetOrigin` | Die Herkunft, an die geschickt und von der angenommen wird. `'*'` schaltet die Prüfung ab                                                | `string` | `'*'`       |
| `channel`      | Die Kanal-Id. Sie trennt **mehrere Brücken auf demselben Fenster**: Damit sie sich verstehen, müssen beide Seiten denselben Kanal nehmen | `string` | `'default'` |

#### Methods

| Methode                        | Beschreibung                                                                                                                 | Signatur                                                      |
| ------------------------------ | ---------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------- |
| `on(type, handler)`            | Meldet einen Handler für einen Nachrichten-`type` an. Sein Rückgabewert (oder der aufgelöste Wert) geht als Antwort zurück.  | `<T, R>(type: string, handler: MessageHandler<T, R>) => void` |
| `off(type)`                    | Entfernt den für `type` angemeldeten Handler.                                                                                | `(type: string) => void`                                      |
| `send(type, payload)`          | Schickt eine Nachricht und wartet auf die Antwort. Lehnt mit dem Fehler des Handlers auf der Gegenseite ab, oder nach 120 s. | `<T, R>(type: string, payload: T) => Promise<R>`              |
| `broadcast({ type, payload })` | Abschicken und vergessen: eine Nachricht senden, ohne eine Antwort zu erwarten.                                              | `<T>(data: { type: string; payload: T }) => void`             |
| `destroy()`                    | Meldet sich beim Verteiler ab, löscht alle Handler und lehnt alle offenen Anfragen ab.                                       | `() => void`                                                  |

> **Schutz vor Selbstbeantwortung**: Jede Instanz trägt eine eigene Absender-Id und bearbeitet eine Anfrage, die sie selbst geschickt hat, **nicht**. Für Anfrage und Antwort **innerhalb eines einzigen Fensters** nimm zwei Brückeninstanzen (eine meldet die Handler an, die andere schickt).

### `BridgeManager`

Ein Singleton-Verzeichnis, dem mehrere benannte `PostMessageBridge`-Instanzen gehören. Die gemeinsame Instanz bekommst du über `BridgeManager.getInstance()`, oder du nimmst den fertigen Export [`bridgeManager`](#bridgemanager-singleton). Der Konstruktor ist privat.

| Methode                        | Beschreibung                                                                       | Signatur                                                                       |
| ------------------------------ | ---------------------------------------------------------------------------------- | ------------------------------------------------------------------------------ |
| `BridgeManager.getInstance()`  | Gibt die gemeinsame Singleton-Instanz zurück.                                      | `() => BridgeManager`                                                          |
| `connectClient(options)`       | Erzeugt und registriert eine neue Brücke. Wirft, wenn die `id` schon vergeben ist. | `(options: BridgeManagerOptions) => { bridge: PostMessageBridge; id: string }` |
| `getClient(id)`                | Schlägt eine registrierte Brücke anhand ihrer Id nach.                             | `(id: string) => PostMessageBridge \| undefined`                               |
| `removeClient(id)`             | Zerstört die Brücke mit dieser Id und nimmt sie aus dem Verzeichnis.               | `(id: string) => void`                                                         |
| `removeAllClient()`            | Zerstört alle Brücken und nimmt sie aus dem Verzeichnis.                           | `() => void`                                                                   |
| `broadcast({ type, payload })` | Sendet eine Nachricht über jede registrierte Brücke.                               | `<T>(payload: { type: string; payload: T }) => void`                           |
| `sendTo(id, type, payload)`    | Schickt eine Anfrage über die Brücke mit dieser Id und wartet auf die Antwort.     | `<T, R>(id: string, type: string, payload: T) => Promise<R>`                   |

Lässt du `id` in `connectClient` weg, wird eine zufällige Id aus zehn Zeichen erzeugt und zurückgegeben. `options` nimmt außerdem `channel` entgegen, das an die darunterliegende `PostMessageBridge` weitergereicht wird.

### `bridgeManager` (Singleton)

Die schon erzeugte gemeinsame `BridgeManager`-Instanz, gleichbedeutend mit `BridgeManager.getInstance()`. Importiere diese, statt dir eine eigene zu bauen.

```ts
import { bridgeManager } from 'ranuts/utils';
```

### `Client`

Eine schlanke Fassade über `bridgeManager` für die **aufrufende** Seite (den Kontext, der Anfragen anstößt). Es ist ein schlichtes Objekt, keine Klasse.

| Methode                       | Beschreibung                                                                                 | Signatur                                                                       |
| ----------------------------- | -------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------ |
| `connect(options)`            | Verbindet mit einem Zielfenster (gibt an `bridgeManager.connectClient` weiter).              | `(options: BridgeManagerOptions) => { bridge: PostMessageBridge; id: string }` |
| `remove(id)`                  | Entfernt eine Verbindung anhand ihrer Id.                                                    | `(id: string) => void`                                                         |
| `removeAll()`                 | Entfernt alle Verbindungen.                                                                  | `() => void`                                                                   |
| `broadcast(payload)`          | Sendet an alle verbundenen Plattformen.                                                      | `(payload: BroadcastPayload) => void`                                          |
| `call({ id, type, payload })` | Schickt eine Anfrage an die Plattform hinter `id` und wartet auf die Rückmeldung.            | `<T, R>(payload: CallToPayload<T>) => Promise<R>`                              |
| `broadcastToAll(payload)`     | Schickt an das aktuelle Fenster mit der Herkunft `'*'`. Aus Sicherheitsgründen nicht ratsam. | `(payload: BroadcastPayload) => void`                                          |

### `Platform`

Eine Fassade für die **empfangende** Seite (meist der Code, der in einem iframe läuft). Es ist ein schlichtes Objekt mit einer einzigen Methode und teilt dasselbe Umschlagprotokoll wie `Client` (`PostMessageBridge`), die beiden Enden verstehen sich also unmittelbar.

| Methode                 | Beschreibung                                                                                                                                                                                                                                                                          | Signatur                                                                          |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------- |
| `Platform.init(events)` | Meldet eine Zuordnung von `type` zu Handler an. Bei jeder eingehenden Nachricht läuft der passende Handler, und sein Ergebnis geht an `event.source` zurück; wirft der Handler, geht der Fehler zurück (der Aufrufer erhält eine Ablehnung). Gibt ein `destroy()` zum Abbauen zurück. | `<T, R>(events: Record<string, MessageHandler<T, R>>) => { destroy: () => void }` |

### PortBridge (auf MessagePort, für neuen Code empfohlen)

Eine Punkt-zu-Punkt-Brücke auf `MessageChannel` / `MessagePort`. Ein Port ist eine **Befugnis auf einen privaten Kanal**, die der Browser vergibt: Reden können nur die beiden Seiten, die den Port beim Handschlag erhalten haben. Das verhindert schon von der Bauart her Übersprechen zwischen Fenstern, vorgetäuschte Absender, Kanalkollisionen im selben Fenster und das Beantworten der eigenen Anfrage – ohne Filtern nach Herkunft und ohne Protokollmarke. Die Nutzlasten reisen ebenfalls per Structured Clone.

| Funktion                     | Beschreibung                                                                                                                                              | Signatur                                                     |
| ---------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------ |
| `openPortBridge(options)`    | **Die anstoßende Seite**: erzeugt einen `MessageChannel`, reicht einen Port an das Zielfenster und behält das andere Ende.                                | `(options: OpenPortBridgeOptions) => PortBridge`             |
| `acceptPortBridge(options?)` | **Die empfangende Seite**: wartet auf den Port, den die anstoßende Seite überreicht; löst mit einer Brücke auf, sobald er da ist.                         | `(options?: AcceptPortBridgeOptions) => Promise<PortBridge>` |
| `createPortBridge(port)`     | Baut eine Brücke über **jeden beliebigen** `MessagePort` (etwa einen Web Worker oder SharedWorker, oder einen Port, dessen Handschlag schon erfolgt ist). | `(port: MessagePort) => PortBridge`                          |

Die zurückgegebene `PortBridge` bietet dieselben `on`, `off`, `send`, `broadcast` und `destroy` wie `PostMessageBridge`.

- **`OpenPortBridgeOptions`**: `{ targetWindow: Window; targetOrigin?: string; name?: string }`. `name` unterscheidet mehrere voneinander unabhängige Portverbindungen in einer Seite und muss auf beiden Seiten übereinstimmen (voreingestellt `'default'`).
- **`AcceptPortBridgeOptions`**: `{ targetOrigin?: string; name?: string }`.

### `MessageCodec`

Kodiert Daten in eine Base64-Zeichenkette und wieder zurück, wobei alle Unicode-Zeichen erhalten bleiben (Chinesisch, Emoji und so fort). Nützlich, um strukturierte Daten durch **Kanäle zu tragen, die nur Zeichenketten zulassen** (URLs, Cookies, `localStorage`, …).

> Hinweis: Die Brücke benutzt das **nicht mehr**, um jede Nachricht zu serialisieren (sie nimmt Structured Clone). Es bleibt als eigenständiges Werkzeug für Zeichenkettenkanäle exportiert.

| Methode               | Beschreibung                                                                                       | Signatur                               |
| --------------------- | -------------------------------------------------------------------------------------------------- | -------------------------------------- |
| `encode(data)`        | Serialisiert jeden JSON-fähigen Wert in eine Base64-Zeichenkette. Gibt bei Misserfolg `''` zurück. | `(data: any) => string`                |
| `decode(encodedStr)`  | Liest eine Base64-Zeichenkette wieder als Wert ein. Gibt bei Misserfolg `null` zurück.             | `<T>(encodedStr: string) => T \| null` |
| `encodeFile(file)`    | Kodiert eine `File` samt Metadaten und Bytes in eine Base64-Zeichenkette.                          | `(file: File) => Promise<string>`      |
| `decodeFile(encoded)` | Dekodiert eine von `encodeFile` erzeugte Zeichenkette wieder zu einer `File`.                      | `(encoded: string) => File`            |

### Schnittstellen

#### `MessageHandler<T, R>`

Ein Nachrichten-Handler. Er bekommt die `payload` und gibt die Antwort zurück (darf asynchron sein).

```ts
interface MessageHandler<T = unknown, R = unknown> {
  (payload: T): Promise<R> | R;
}
```

#### `MessageData<T>`

Der Aufbau einer Nachricht auf dem Weg – der Umschlag.

| Feld         | Beschreibung                                                                           | Typ        |
| ------------ | -------------------------------------------------------------------------------------- | ---------- |
| `type`       | Die Art der Nachricht beziehungsweise der Kanalname.                                   | `string`   |
| `payload`    | Der Inhalt der Nachricht.                                                              | `T`        |
| `id`         | Die Id, die Anfrage und Antwort einander zuordnet; sie steht bei solchen Paaren dabei. | `string?`  |
| `isResponse` | `true`, wenn diese Nachricht eine Antwort ist.                                         | `boolean?` |
| `isError`    | `true`, wenn die Antwort einen Fehler trägt.                                           | `boolean?` |
| `channel`    | Die Kanal-Id; sie trennt mehrere Brücken auf einem Fenster.                            | `string?`  |
| `senderId`   | Die Id der absendenden Instanz; sie verhindert das Beantworten der eigenen Anfrage.    | `string?`  |

#### `PendingRequest<R>`

Ein laufendes `send()`, das auf seine Antwort wartet (interne Buchführung).

| Feld      | Beschreibung                      | Typ                        |
| --------- | --------------------------------- | -------------------------- |
| `resolve` | Löst das ausstehende Promise auf. | `(value: R) => void`       |
| `reject`  | Lehnt das ausstehende Promise ab. | `(error: unknown) => void` |

#### `BridgeManagerOptions`

Optionen für `connectClient` und `Client.connect`.

| Feld           | Beschreibung                                                                       | Typ       | Standard                                   |
| -------------- | ---------------------------------------------------------------------------------- | --------- | ------------------------------------------ |
| `id`           | Eine ausdrücklich gesetzte Brücken-Id. Ohne Angabe wird eine erzeugt.              | `string?` | eine zufällige Zeichenkette aus 10 Zeichen |
| `targetOrigin` | Die Herkunft, die an `PostMessageBridge` weitergereicht wird.                      | `string?` | `'*'`                                      |
| `targetWindow` | Das Ziel-`Window`, das an die Brücke weitergereicht wird.                          | `Window?` | `window`                                   |
| `channel`      | Die Kanal-Id; setz sie ausdrücklich, um Verbindungen im selben Fenster zu trennen. | `string?` | `'default'`                                |

#### `BroadcastPayload`

Eine Rundrufnachricht in eine Richtung.

| Feld      | Beschreibung              | Typ       |
| --------- | ------------------------- | --------- |
| `type`    | Die Art der Nachricht.    | `string`  |
| `payload` | Der Inhalt der Nachricht. | `unknown` |

#### `CallToPayload<T>`

Das Argument von `Client.call`.

| Feld      | Beschreibung                                         | Typ      |
| --------- | ---------------------------------------------------- | -------- |
| `id`      | Die Id der Zielbrücke beziehungsweise Zielplattform. | `string` |
| `type`    | Die Art der Nachricht.                               | `string` |
| `payload` | Der Inhalt der Anfrage.                              | `T`      |

## Beispiel

### Untere Ebene: `PostMessageBridge` zwischen einer Seite und einem iframe

**Elternseite**, im Gespräch mit dem `contentWindow` des iframes:

```js
import { PostMessageBridge } from 'ranuts/utils';

const iframe = document.querySelector('iframe');

// Warten, bis das iframe geladen ist, und dann eine Brücke dorthin bauen.
iframe.addEventListener('load', async () => {
  const bridge = new PostMessageBridge(iframe.contentWindow, '*');

  // Anfrage und Antwort: 'getUser' schicken und auf die Rückmeldung warten.
  const user = await bridge.send('getUser', { id: 42 });
  console.log(user); // => { id: 42, name: 'Ada' }

  // Rundruf, ohne auf eine Antwort zu warten.
  bridge.broadcast({ type: 'theme:change', payload: { mode: 'dark' } });
});
```

**Im iframe**, mit den angemeldeten Handlern:

```js
import { PostMessageBridge } from 'ranuts/utils';

// Auf das Elternfenster zielen.
const bridge = new PostMessageBridge(window.parent, '*');

bridge.on('getUser', async ({ id }) => {
  // Was du hier zurückgibst, wird zur Antwort auf das send() des Aufrufers.
  return { id, name: 'Ada' };
});

bridge.on('theme:change', ({ mode }) => {
  document.documentElement.dataset.theme = mode;
});
```

### Obere Ebene: `Client` (Elternseite) und `Platform` (iframe)

**Im iframe**, wo `Platform` eine Reihe von Methoden bereitstellt:

```js
import { Platform } from 'ranuts/utils';

const { destroy } = Platform.init({
  add: ({ a, b }) => a + b,
  getTime: async () => Date.now(),
});

// Später, um das Zuhören zu beenden:
// destroy();
```

**Elternseite**, die sich verbindet und über die Id aufruft:

```js
import { Client } from 'ranuts/utils';

const iframe = document.querySelector('iframe');

iframe.addEventListener('load', async () => {
  // Eine benannte Verbindung zum iframe-Fenster anmelden.
  const { id } = Client.connect({
    id: 'calculator',
    targetWindow: iframe.contentWindow,
    targetOrigin: '*',
  });

  // Eine von Platform.init bereitgestellte Methode aufrufen und ihr Ergebnis abwarten.
  const sum = await Client.call({ id, type: 'add', payload: { a: 2, b: 3 } });
  console.log(sum); // => 5

  // An jede verbundene Plattform rundsenden.
  Client.broadcast({ type: 'ping', payload: Date.now() });

  // Abbauen, wenn es erledigt ist.
  Client.remove(id);
});
```

### Punkt zu Punkt: `openPortBridge` und `acceptPortBridge` (empfohlen)

**Elternseite** (die anstoßende Seite), die einen Kanal erzeugt und ein Ende ans iframe reicht:

```js
import { openPortBridge } from 'ranuts/utils';

const iframe = document.querySelector('iframe');

iframe.addEventListener('load', async () => {
  const bridge = openPortBridge({
    targetWindow: iframe.contentWindow,
    targetOrigin: 'https://app.example.com',
  });

  const pong = await bridge.send('ping', { n: 1 });
  console.log(pong); // => 2
});
```

**Im iframe** (die empfangende Seite), das auf den überreichten Port wartet:

```js
import { acceptPortBridge } from 'ranuts/utils';

const bridge = await acceptPortBridge({ targetOrigin: 'https://parent.example.com' });

bridge.on('ping', ({ n }) => n + 1);
```

### Das Singleton `bridgeManager` unmittelbar benutzen

```js
import { bridgeManager } from 'ranuts/utils';

const { bridge, id } = bridgeManager.connectClient({
  targetWindow: someIframe.contentWindow,
});

const result = await bridgeManager.sendTo(id, 'ping', { at: Date.now() });

bridgeManager.removeClient(id);
```

### Kodieren für sich allein mit `MessageCodec` (Kanäle nur für Zeichenketten)

```js
import { MessageCodec } from 'ranuts/utils';

const encoded = MessageCodec.encode({ msg: 'héllo 👋', n: 1 });
// -> eine Base64-Zeichenkette, sicher für URLs, Cookies und localStorage

const decoded = MessageCodec.decode(encoded);
console.log(decoded); // => { msg: 'héllo 👋', n: 1 }
```

## Hinweise

1. **Serialisierung**: Die Brücke verständigt sich über strukturierte Objekte (Structured Clone), `Date`, `Map`, `Set`, `ArrayBuffer`, `File` und dergleichen bleiben also auch ohne `MessageCodec` erhalten. Lässt sich eine `payload` nicht klonen (eine Funktion, ein DOM-Knoten), lehnt `send` sofort ab.
2. **Protokollmarke**: Verarbeitet werden nur Nachrichten mit der internen Protokollmarke; der `postMessage`-Verkehr anderer Bibliotheken wird übergangen.
3. **Prüfung der Herkunft**: Steht `targetOrigin` auf `'*'` (die Voreinstellung), werden eingehende Nachrichten nicht nach Herkunft gefiltert. Gib im Produktivbetrieb eine ausdrückliche Herkunft an (etwa `'https://app.example.com'`), damit nur diese angenommen wird.
4. **Weitergabe von Fehlern**: Wirft ein Handler auf der anderen Seite, lehnen `send`, `sendTo` und `Client.call` mit eben diesem Fehler ab – statt den Fehlertext aufzulösen, als wäre er ein gültiges Ergebnis.
5. **Zeitgrenze**: Kommt binnen 120 Sekunden keine Antwort, lehnen `send` und `sendTo` mit `Error('Request timeout')` ab.
6. **Trennung nach Kanälen**: Um mehrere Brücken auf demselben Fenster zu betreiben, gib beiden Seiten denselben `channel`, damit sie sich nicht ins Gehege kommen.
7. **Eindeutige Ids**: `connectClient` wirft `Bridge <id> already exists`, wenn du eine Id wiederverwendest. Lass `id` weg, dann wird eine erzeugt.
8. **Aufräumen**: Alle `PostMessageBridge`-Instanzen teilen sich einen globalen `message`-Listener (er wird von selbst entfernt, sobald die letzte Brücke zerstört ist). Ruf `destroy()` (oder `Client.remove` / `removeClient`) auf, sobald eine Verbindung nicht mehr gebraucht wird, damit offene Anfragen abgelehnt und Ressourcen freigegeben werden.
9. **Außerhalb des Browsers**: Ohne `window` (Node oder SSR) wirft das Erzeugen einer `PostMessageBridge` nicht; `send` lehnt mit einem klaren Fehler ab, und `broadcast` und `destroy` tun schlicht nichts.
10. **Nimm lieber PortBridge**: Für neuen Code `openPortBridge` und `acceptPortBridge`. Ein Punkt-zu-Punkt-Kanal verhindert schon von der Bauart her Übersprechen, vorgetäuschte Absender und Selbstbeantwortung.
11. **`broadcastToAll`**: `Client.broadcastToAll` schickt an das aktuelle Fenster mit der Herkunft `'*'` und ist aus Sicherheitsgründen nicht ratsam. Nimm lieber ein gezieltes `call` oder `broadcast`.
12. **`BRIDGE_MARKER` und `DEFAULT_CHANNEL`**: Die beiden rohen Werte hinter den Punkten 2 und 6 sind ebenfalls exportiert – für den Fall, dass du den `postMessage`-Verkehr unmittelbar untersuchst (ein Listener in den Devtools, ein Test), statt über `PostMessageBridge` zu gehen. `BRIDGE_MARKER` ist die Zeichenkette der Protokollmarke, die jede Brückennachricht trägt; `DEFAULT_CHANNEL` ist genau jene Kanal-Id `'default'`, die gilt, wenn keine übergeben wird.
