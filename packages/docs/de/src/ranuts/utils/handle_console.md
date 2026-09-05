# Hooks zur Instrumentierung

Klink dich in `console`, `fetch`, `XMLHttpRequest`, Klicks und nicht abgefangene Fehler ein — für ein Monitoring-Backend, eine Debug-Einblendung oder für Tests.

**Jede davon gibt eine Funktion zum Abbauen zurück. Heb sie auf und ruf sie auf.** Ein Global zu instrumentieren, ohne es rückgängig machen zu können, heißt: Tests können nicht hinter sich aufräumen, und jedes Neuladen im laufenden Betrieb flickt an einem bereits geflickten Global weiter, bis jeder Aufruf durch ein Dutzend Hüllen läuft und jedes Ereignis N-mal gemeldet wird.

## API

| Function                     | Greift ein bei                          | Rückgabe      |
| ---------------------------- | --------------------------------------- | ------------- |
| `handleConsole(hook)`        | `console.log/info/warn/error/assert`    | `restore`     |
| `handleFetchHook(options)`   | `window.fetch`                          | `restore`     |
| `handleXhrHook(options)`     | `XMLHttpRequest#open` / `#send`         | `restore`     |
| `handleError(hook)`          | `error` und `unhandledrejection`        | `unsubscribe` |
| `handleClick(hook)`          | Klicks auf dem Dokument (Capture-Phase) | `unsubscribe` |
| `replaceOld(obj, key, wrap)` | Jede Eigenschaft jedes Objekts          | `restore`     |

`handleFetchHook` und `handleXhrHook` nehmen `{ requestHook, responseHook, errorHook }`.

## Beispiel

```js
import { handleConsole, handleError, handleFetchHook } from 'ranuts';

const teardown = [
  handleConsole((type, ...args) => send({ type, args })),
  handleError((error) => send({ type: 'error', error: String(error) })),
  handleFetchHook({ errorHook: (url, error) => send({ type: 'fetchError', url }) }),
];

// beim Abbauen (HMR, Routenwechsel, Aufräumen nach Tests)
teardown.forEach((off) => off());
```

## Hinweise

1. **Das ursprüngliche Verhalten bleibt.** Antworten gehen durch, Fehler werden erneut geworfen, die Konsole gibt weiterhin aus.
2. **Das `restore` von `replaceOld` macht nur den eigenen Flicken rückgängig.** Hat danach eine andere Schicht darüber geflickt, würde blindes Wiederherstellen sie stillschweigend abmontieren — deshalb lehnt es in dem Fall ab.
3. **`handleXhrHook` flickt am Prototyp**, gilt also für jede Instanz; seine Listener werden mit `{ once: true }` angemeldet, damit ein wiederverwendetes XHR-Objekt sie nicht ansammelt.
4. **Melde die Konsolenausgabe nicht an ein Backend, das selbst in die Konsole schreibt**: Der Hook feuert bei genau dem Aufruf, den er erzeugt. (Deshalb ist der `console`-Kanal von `Monitor` standardmäßig aus.)

::: warning In 0.3 geändert
Früher gaben sie alle `void` zurück, ohne Möglichkeit zum Abmontieren. Jetzt geben sie eine Funktion zum Abbauen zurück; bestehende Aufrufstellen laufen weiter und können sie einfach zu nutzen beginnen.
:::
