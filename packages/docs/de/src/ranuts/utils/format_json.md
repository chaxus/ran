# formatJson

Formatiert JSON lesbar. Nimmt ein Objekt oder eine JSON-Zeichenkette, die neu formatiert werden soll.

## API

### formatJson(value, onError?, indent?)

| Parameter | Beschreibung                                                            | Typ                  | Standard     |
| --------- | ----------------------------------------------------------------------- | -------------------- | ------------ |
| `value`   | Objekt oder JSON-Zeichenkette (einfache Anführungszeichen sind erlaubt) | `string \| object`   | Erforderlich |
| `onError` | Wird mit dem Parse- oder Serialisierungsfehler aufgerufen               | `(e: Error) => void` | tut nichts   |
| `indent`  | Leerzeichen je Ebene                                                    | `number`             | `4`          |

Gibt die formatierte Zeichenkette zurück, oder `''`, wenn sich die Eingabe nicht parsen lässt.

## Beispiel

```js
import { formatJson } from 'ranuts';

formatJson({ a: 1, b: [2, 3] });
formatJson("{'a': 1}"); // einfache Anführungszeichen sind erlaubt
formatJson({ a: 1 }, undefined, 2); // Einrückung mit zwei Leerzeichen
formatJson('nope', (e) => console.warn(e)); // liefert '' und reicht den Fehler an den Callback
```

## Hinweise

1. **Eine Zeichenkette wird neu geparst, nicht durchgereicht.** So ist sie geprüft und das Layout einheitlich, statt sich auf die Abstände des Aufrufers zu verlassen.
2. **Fehler werden gemeldet, nie geworfen.** Ungültiges JSON, zyklische Strukturen und Werte, die `JSON.stringify` nicht darstellen kann, liefern `''` und rufen `onError`.

::: warning In 0.3 neu geschrieben
Das war einmal ein selbstgebauter Formatierer von rund 90 Zeilen, der das Layout neu aufbaute, indem er per regulärem Ausdruck um jede geschweifte Klammer, jede eckige Klammer und jedes Komma Zeilenumbrüche einfügte und den Schaden in Zeichenketten anschließend dadurch beheben wollte, dass er die Anführungszeichen je Zeile zählte. Er kam mit maskierten Anführungszeichen nicht zurecht und hielt eine Klammer oder ein Komma **innerhalb eines Zeichenkettenwerts** für Struktur, weshalb `{ css: 'a { color: red, }' }` verstümmelt herauskam. Heute ist es `JSON.stringify` mit einem nachsichtigen Parser davor: korrekt und um ein Vielfaches schneller. Die Abstände der Ausgabe folgen `JSON.stringify` statt dem alten Eigenbau-Layout.
:::
