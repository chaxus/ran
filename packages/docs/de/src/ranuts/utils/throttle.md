# throttle

Drosseln: Wird eine Funktion in schneller Folge ausgelöst, läuft sie höchstens einmal je Intervall. Der erste Aufruf läuft sofort (vordere Flanke), der letzte innerhalb eines Fensters wird beim Schließen des Fensters nachgeholt (hintere Flanke) — der Endzustand geht also nie verloren.

Nimm es fürs Scrollen, für Zeigerbewegungen und fürs Ziehen: für alles, was **fortlaufende Rückmeldung** braucht. Zählt nur der letzte Wert (Suche während der Eingabe, automatisches Speichern), nimm [debounce](./debounce).

## API

### throttle(fn, delay?)

#### Parameter

| Parameter | Beschreibung | Typ | Standard |
| --------- | --------------------- | ---------- | -------- |
| `fn` | Zu drosselnde Funktion | `Function` | Erforderlich |
| `delay` | Kleinster Abstand (ms) | `number` | `300` |

#### Rückgabe

Eine gedrosselte Funktion, die das `this` und die Argumente der Aufrufstelle behält, dazu:

| Element | Beschreibung | Typ |
| ----------- | ---------------------------------- | --------------- |
| `cancel()` | Verwirft den ausstehenden Aufruf der hinteren Flanke | `() => void` |
| `pending()` | Ob ein Aufruf der hinteren Flanke wartet | `() => boolean` |

## Beispiel

```js
import { throttle } from 'ranuts';

const onScroll = throttle(() => update(window.scrollY), 100);
window.addEventListener('scroll', onScroll);

// Beim Abbau: den Listener entfernen *und* den ausstehenden Aufruf verwerfen
window.removeEventListener('scroll', onScroll);
onScroll.cancel();
```

## Hinweise

1. **Vordere und hintere Flanke**: läuft sofort und am Ende des Fensters noch einmal, mit den neuesten Argumenten.
2. **`this` und die Argumente** werden unverändert von der Aufrufstelle durchgereicht.
3. **Läuft überall**: benutzt das blanke `setTimeout` und funktioniert daher in Node, in Web Workers und beim serverseitigen Rendern.
4. **Jeder Aufruf von `throttle()` bekommt sein eigenes Fenster** — zwei gedrosselte Funktionen kommen sich nie in die Quere.
5. **Beim Abbau immer `cancel()` aufrufen**, sonst feuert der Aufruf der hinteren Flanke in einen bereits zerstörten Kontext.

::: warning In 0.3 entfernt
`generateThrottle()` gibt es nicht mehr. Es lieferte eine Fabrik, deren Funktionen sich **einen Timer und einen Zeitstempel teilten**, sodass zwei völlig unabhängige gedrosselte Funktionen einander unterdrückten. Ersetze `const g = generateThrottle(); const f = g(fn, delay)` durch `throttle(fn, delay)`.
:::
