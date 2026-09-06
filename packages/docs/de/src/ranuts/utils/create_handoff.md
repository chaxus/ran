# createHandoff

Reicht einen Wert (eine `File`, einen `Blob`, alles strukturiert Klonbare) von einer Seite zur nächsten desselben Ursprungs weiter.

Eine `File`, die auf Seite A ausgewählt wurde, kommt nicht zu Seite B. Sie passt in keine URL und lässt sich nicht serialisieren; `sessionStorage` nimmt nur Zeichenketten. IndexedDB legt strukturiert klonbare Werte ab, wie sie sind: Seite A hinterlegt den Wert und navigiert weiter, Seite B holt ihn heraus.

## API

### createHandoff(options)

| Parameter   | Beschreibung                                             | Typ      | Standard     |
| ----------- | -------------------------------------------------------- | -------- | ------------ |
| `dbName`    | Name der Datenbank; beide Seiten müssen sich einig sein  | `string` | Erforderlich |
| `storeName` | Name des Object Stores, wird beim ersten Öffnen angelegt | `string` | `'files'`    |
| `key`       | Schlüssel, unter dem der eine hinterlegte Wert liegt     | `string` | `'pending'`  |

#### Rückgabe

| Methode      | Beschreibung                                                                  |
| ------------ | ----------------------------------------------------------------------------- |
| `put(value)` | Hinterlegt einen Wert für die nächste Seite. `false`, wenn das nicht gelang   |
| `take()`     | Holt den hinterlegten Wert und löscht ihn. `null`, wenn nichts hinterlegt ist |

## Beispiel

### Die Einstiegsseite reicht der Anwendung eine Datei

```js
import { createHandoff } from 'ranuts';

const handoff = createHandoff({ dbName: 'document-handoff' });

input.addEventListener('change', async () => {
  await handoff.put(input.files[0]);
  location.href = '/app?open=local';
});
```

### Die Anwendung holt sie ab

```js
import { createHandoff, queryFlag } from 'ranuts';

const handoff = createHandoff({ dbName: 'document-handoff' });

if (queryFlag('open')) {
  const file = await handoff.take();
  if (file) openDocument(file); // beim Neuladen null — der Wert ist aufgebraucht
}
```

## Hinweise

1. **Lesen zerstört.** `take()` löscht den Wert in derselben Transaktion, in der es ihn liest. Genau das verhindert, dass ein Neuladen dieselbe Datei noch einmal öffnet, und lässt eine veraltete `?open=local`-URL ins Leere greifen.

2. **Zwei Tabs können nicht beide gewinnen.** Weil Lesen und Löschen sich eine Transaktion teilen, geht der Wert bei einem Wettlauf zwischen Tabs an genau einen von ihnen.

3. **`put` erfüllt sich beim Commit, nicht beim Schreibauftrag.** Erst mit dem Commit steht der Wert dauerhaft, und die Seite navigiert meist unmittelbar danach weiter.

4. **Fehlschläge bleiben leise.** Fehlt IndexedDB oder ist es blockiert (serverseitiges Rendern, privater Modus, ein fremder Frame), erfüllt sich `put` mit `false` und `take` mit `null`. Eine Seite, die bloß _versucht_ hat, etwas zu übergeben, darf nicht daran zerbrechen, dass kein Speicher zur Verfügung stand.

5. **Der Store entsteht in Version 1** — angelegt von der Seite, die die Datenbank zuerst öffnet; die andere findet ihn bereits vor.

6. **Immer nur ein Wert.** Das hier ist eine Übergabe, keine Warteschlange: Ein zweites `put` überschreibt den hinterlegten Wert. Nimm [`WebDB`](/de/src/ranuts/utils/web_db), wenn du echten Speicher brauchst.
