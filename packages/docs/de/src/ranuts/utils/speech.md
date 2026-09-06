# createSpeechRecognizer / isSpeechRecognitionSupported

Eine Hülle um `SpeechRecognition` aus der Web Speech API — das Gegenstück zu [`AudioRecorder`](./audio_recorder.md), der Audio-**Bytes** aufzeichnet; dieses hier bittet die Plattform, Gesprochenes in **Text** zu verwandeln.

Die native API lohnt es, einmal zu umhüllen, statt sie unmittelbar anzufassen: In WebKit trägt sie weiterhin ein Präfix (`webkitSpeechRecognition`), in `lib.dom.d.ts` fehlt sie, und sie meldet Alltägliches, das gar kein Ereignis ist (eine stille Pause, ein selbst aufgerufenes `stop()`), über denselben Fehlerkanal wie ein verweigertes Mikrofon.

## Verwendung

```ts
import { createSpeechRecognizer } from 'ranuts/utils';

const mic = createSpeechRecognizer({
  lang: () => currentLocale(), // wird bei jeder Aufnahme neu gelesen, nicht nur einmal
  onResult: (text, isFinal) => {
    input.value = text;
  },
  onError: (e) => {
    if (e.kind === 'denied') toast('Der Zugriff aufs Mikrofon wurde verweigert');
  },
  onStart: () => button.classList.add('recording'),
  onEnd: () => button.classList.remove('recording'),
});

if (!mic.supported) button.style.display = 'none'; // die Mikrofon-Schaltfläche gleich ausblenden
button.addEventListener('click', () => mic.toggle());
```

## API

### `isSpeechRecognitionSupported()`

Gibt `boolean` zurück. Geprüft wird beim Aufruf, nicht beim Laden des Moduls gemerkt; du kannst dieses Modul also beim serverseitigen Rendern importieren und die Prüfung ausführen, sobald die Seite hydratisiert ist.

### `createSpeechRecognizer(options?)`

Baut einen wiederverwendbaren `SpeechRecognizer`. `start()` erzeugt jedes Mal eine frische native Instanz, sodass jede Option, die du als **Funktion** übergibst (besonders `lang`), zu Beginn jeder Aufnahme neu gelesen wird, statt beim Erzeugen einzufrieren.

#### Parameter (`SpeechRecognizerOptions`)

| Option           | Beschreibung                                                                                           | Typ                                              | Standard |
| ---------------- | ------------------------------------------------------------------------------------------------------ | ------------------------------------------------ | -------- |
| `lang`           | BCP-47-Kennung (`'en-US'`, `'zh-CN'`) oder eine Funktion, die zu Beginn jeder Aufnahme gelesen wird    | `string \| (() => string)`                       | `''`     |
| `continuous`     | Über Pausen hinweg weiterhören, statt bei der ersten aufzuhören                                        | `boolean`                                        | `true`   |
| `interimResults` | Zwischenergebnisse ausgeben, während gesprochen wird                                                   | `boolean`                                        | `true`   |
| `onResult`       | Wird mit der Abschrift der **gesamten bisherigen Aufnahme** aufgerufen und damit, ob sie endgültig ist | `(transcript: string, isFinal: boolean) => void` | `-`      |
| `onError`        | Wird mit einem bereits eingeordneten Fehler aufgerufen                                                 | `(error: SpeechError) => void`                   | `-`      |
| `onStart`        | Feuert, wenn eine Aufnahme beginnt                                                                     | `() => void`                                     | `-`      |
| `onEnd`          | Feuert einmal je Aufnahme, gleich wie sie endete (gestoppt, abgelaufen oder mit Fehler)                | `() => void`                                     | `-`      |

#### `SpeechRecognizer`

| Element     | Beschreibung                                                                                                         | Typ                |
| ----------- | -------------------------------------------------------------------------------------------------------------------- | ------------------ |
| `supported` | `false`, wenn die Plattform keine Spracherkennung hat; dann tut jede Methode nichts                                  | `boolean` (Getter) |
| `active`    | Ob gerade eine Aufnahme läuft                                                                                        | `boolean` (Getter) |
| `start()`   | Beginnt eine Aufnahme. Wird übergangen, wenn schon eine läuft                                                        | `() => void`       |
| `stop()`    | Beendet die laufende Aufnahme; bereits Erkanntes bleibt, danach folgt `onEnd`                                        | `() => void`       |
| `abort()`   | Beendet die laufende Aufnahme und verwirft noch offene Ergebnisse                                                    | `() => void`       |
| `toggle()`  | Startet, wenn nichts läuft, und stoppt, wenn etwas läuft: genau das, was eine einzelne Mikrofon-Schaltfläche braucht | `() => void`       |

#### `SpeechError`

| Feld     | Beschreibung                                                                                                                                       | Typ               |
| -------- | -------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------- |
| `kind`   | `'denied'` (Mikrofon verweigert, sollte man zeigen), `'noSpeech'` / `'aborted'` (alltäglich, meist nicht der Rede wert), `'failed'` (alles Übrige) | `SpeechErrorKind` |
| `detail` | Die rohe `error`-Zeichenkette aus dem Ereignis der Plattform                                                                                       | `string`          |

## Hinweise

1. **Nicht überall vorhanden.** Firefox hat überhaupt keine Umsetzung von `SpeechRecognition`; prüfe immer `recognizer.supported` (oder `isSpeechRecognitionSupported()`), bevor du ein Mikrofon anbietest, statt anzunehmen, der Konstruktor sei da.
2. **`supported` und `active` sind Getter und werden bei jedem Zugriff neu ausgewertet**, nicht einmal beim Erzeugen festgehalten. Das zählt, wenn `createSpeechRecognizer()` läuft, bevor es `window` oder den Konstruktor mit Herstellerpräfix gibt (serverseitiges Rendern, ein früher Aufruf im Modulrumpf vor der Hydration): Der Erkenner greift die echte API auf, sobald sie erscheint, statt für immer `supported === false` zu melden.
3. **Die Abschrift in `onResult` sammelt sich an**, sie kommt nicht in Häppchen: Es ist der volle Text der bisherigen Aufnahme, überarbeitet, während die Zwischenergebnisse fester werden. Füg sie nicht selbst zusammen.
4. Den nativen Erkenner zu erzeugen oder sein `start()` aufzurufen kann synchron werfen (etwa wegen einer Permissions-Policy-Beschränkung oder wegen Chromes `InvalidStateError`, wenn schon eine Aufnahme läuft); `createSpeechRecognizer` fängt das ab und meldet es über `onError` und `onEnd`, statt es entwischen zu lassen.
