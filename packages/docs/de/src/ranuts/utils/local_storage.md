# Helfer für localStorage

Zugriff auf localStorage, der nicht werfen kann, dazu eine Sicht mit Präfix und JSON-Serialisierung darüber.

`localStorage` fehlt beim serverseitigen Rendern nicht bloß — es wirft auch schon beim _Zugriff_ in einem fremden iframe mit blockierten Cookies, und beim _Schreiben_ im privaten Modus von Safari oder wenn das Kontingent erschöpft ist. Hier ist jedes Lesen und jedes Schreiben abgesichert, denn ein Speicherfehler soll eine Einstellung verlieren lassen, niemals die Seite zerreißen.

## API

### localStorageSetItem

Schreibt einen Wert in localStorage.

#### Parameter

| Parameter | Beschreibung        | Typ      | Standard     |
| --------- | ------------------- | -------- | ------------ |
| `name`    | Name des Schlüssels | `string` | Erforderlich |
| `value`   | Der Wert            | `string` | Erforderlich |

#### Rückgabe

Kein Rückgabewert (`void`)

### localStorageGetItem

Liest einen Wert aus localStorage.

#### Parameter

| Parameter | Beschreibung        | Typ      | Standard     |
| --------- | ------------------- | -------- | ------------ |
| `name`    | Name des Schlüssels | `string` | Erforderlich |

#### Rückgabe

| Argument | Beschreibung                                                           | Typ      |
| -------- | ---------------------------------------------------------------------- | -------- |
| `string` | Der gespeicherte Wert; eine leere Zeichenkette, wenn es ihn nicht gibt | `string` |

### localStorageRemoveItem

Entfernt einen Schlüssel.

| Parameter | Beschreibung        | Typ      | Standard     |
| --------- | ------------------- | -------- | ------------ |
| `name`    | Name des Schlüssels | `string` | Erforderlich |

### createStore(prefix?)

Eine Sicht auf localStorage mit Präfix und JSON-Serialisierung.

#### Rückgabe

| Methode              | Beschreibung                                                                                  |
| -------------------- | --------------------------------------------------------------------------------------------- |
| `get(key, fallback)` | Der gespeicherte Wert, sonst `fallback` — wenn er fehlt, nicht erreichbar oder beschädigt ist |
| `set(key, value)`    | Serialisiert und speichert; `false`, wenn nichts geschrieben wurde                            |
| `remove(key)`        | Entfernt den Schlüssel                                                                        |
| `keyOf(key)`         | Der vollständige Schlüssel (`prefix + key`), nützlich für `storage`-Listener                  |

## Beispiel

### Grundlegende Verwendung

```js
import { localStorageSetItem, localStorageGetItem } from 'ranuts';

// Den Wert schreiben
localStorageSetItem('username', 'john');

// Den Wert lesen
const username = localStorageGetItem('username');
console.log(username); // 'john'
```

### Ein Objekt speichern

```js
import { localStorageSetItem, localStorageGetItem } from 'ranuts';

const user = { name: 'John', age: 30 };
localStorageSetItem('user', JSON.stringify(user));

const storedUser = JSON.parse(localStorageGetItem('user'));
console.log(storedUser); // { name: 'John', age: 30 }
```

### Sicherheit auf dem Server

```js
import { localStorageSetItem, localStorageGetItem } from 'ranuts';

// Wirft in einer Server-Umgebung keinen Fehler, scheitert lautlos
localStorageSetItem('key', 'value'); // Auf dem Server: passiert nichts
const value = localStorageGetItem('key'); // Auf dem Server: liefert ''
```

### Prüfen, ob etwas da ist

```js
import { localStorageGetItem } from 'ranuts';

const value = localStorageGetItem('myKey');
if (value) {
  console.log('Der Wert ist da:', value);
} else {
  console.log('Der Wert fehlt');
}
```

### JSON-Speicher mit Namensraum

```js
import { createStore } from 'ranuts';

const history = createStore('agent_history_');

history.set('default', messages); // schreibt agent_history_default
const restored = history.get('default', []); // [], wenn er fehlt oder beschädigt ist
history.remove('default');
```

### Mehrere Funktionen, ein Ursprung

```js
import { createStore } from 'ranuts';

// Präfixe bewahren voneinander unabhängige Funktionen davor, sich in die Quere zu kommen.
const keys = createStore('agent_api_key_');
const prefs = createStore('editor_prefs_');

keys.set('anthropic', token);
prefs.set('theme', 'dark');
```

## Hinweise

1. **Hier wirft nichts.** Fehlender Speicher, ein blockierter fremder Frame, der private Modus, das Kontingent: All das gibt still nach. `localStorageGetItem` liefert `''`, die schreibenden Funktionen tun nichts, und `createStore().set()` meldet `false`.

2. **Abgesichert wird beim Aufruf, nicht beim Laden des Moduls.** Der Speicher wird bei jedem Aufruf neu nachgeschlagen; das funktioniert also nach serverseitigem Rendern samt Hydration und lässt sich in Tests ersetzen.

3. **`createStore` prüft nichts.** Was gespeichert war, kommt als `T` typisiert zurück; prüfe es selbst, wenn es eine Versionsgrenze überschreitet. Der Ersatzwert deckt nur Abwesenheit und misslungenes Parsen ab — ein Wert, den eine ältere Fassung deines Codes geschrieben hat, kann der aufrufenden Seite keinen `SyntaxError` entgegenwerfen, aber die falsche Form haben durchaus.

4. **`set` liefert `false`** bei einer zyklischen Struktur, bei einem `BigInt` und bei einem Schreibvorgang, der nicht ankam. Es liest den Wert zur Sicherheit wieder aus.

5. **Typische Einschränkung**: Die rohen Helfer verarbeiten nur Zeichenketten. Nimm `createStore`, statt an jeder Aufrufstelle `JSON.stringify` / `JSON.parse` samt try/catch selbst zu schreiben.

6. **Rückgabewert**: Fehlt der Wert, liefert `localStorageGetItem` `''` und nicht `null`.
