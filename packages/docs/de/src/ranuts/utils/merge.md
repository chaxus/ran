# merge

Führt Objekte zusammen: Die Eigenschaften des zweiten werden in das erste kopiert.

## API

### merge

#### Rückgabe

| Argument | Beschreibung                                    | Typ      |
| -------- | ----------------------------------------------- | -------- |
| `Object` | Das zusammengeführte Objekt (nämlich das erste) | `Object` |

#### Parameter

| Parameter | Beschreibung                                       | Typ      | Standard     |
| --------- | -------------------------------------------------- | -------- | ------------ |
| `a`       | Zielobjekt (wird verändert)                        | `Object` | Erforderlich |
| `b`       | Quellobjekt (seine Eigenschaften wandern nach `a`) | `Object` | Optional     |

## Beispiel

### Grundlegende Verwendung

```js
import { merge } from 'ranuts';

const obj1 = { a: 1, b: 2 };
const obj2 = { b: 3, c: 4 };

const result = merge(obj1, obj2);
console.log(result); // { a: 1, b: 3, c: 4 }
console.log(obj1); // { a: 1, b: 3, c: 4 } (das ursprüngliche Objekt wurde verändert)
console.log(result === obj1); // true (zurück kommt das ursprüngliche Objekt)
```

### Konfigurationsobjekte zusammenführen

```js
import { merge } from 'ranuts';

const defaultConfig = {
  host: 'localhost',
  port: 3000,
  timeout: 5000,
};

const userConfig = {
  port: 8080,
  ssl: true,
};

const config = merge(defaultConfig, userConfig);
console.log(config);
// { host: 'localhost', port: 8080, timeout: 5000, ssl: true }
```

### Nur ein Argument übergeben

```js
import { merge } from 'ranuts';

const obj = { a: 1 };
const result = merge(obj);
console.log(result); // { a: 1 } (kommt unverändert zurück)
```

## Hinweise

1. **Verändert das ursprüngliche Objekt**: Statt ein neues zu erzeugen, ändert die Funktion das erste unmittelbar.
2. **Flaches Zusammenführen**: nur eine Ebene; in verschachtelte Objekte steigt sie nicht hinab.
3. **Überschreiben**: Haben beide denselben Schlüssel, gewinnt der Wert des zweiten Objekts.
4. **Rückgabewert**: das erste Objekt, so wie es nun verändert ist.

## mergeExports

Trotz des Namens ein anderes Werkzeug: Es baut aus einer Sammlung von Gettern ein **träge ausgewertetes, eingefrorenes** Export-Objekt, statt schlichte Werte zu kopieren. Jeder Getter läuft höchstens einmal, nämlich beim ersten Zugriff, und das Ergebnis wird von da an gemerkt — über dieselbe `once`-Hülle, die `ranuts/utils` gesondert exportiert. Verschachtelte schlichte Objekte werden rekursiv zusammengeführt (und eingefroren); alles, was weder ein Getter noch ein verschachteltes Objekt ist, wirft.

```js
import { mergeExports } from 'ranuts/utils';

const lazyModule = mergeExports(
  {},
  {
    get expensive() {
      console.log('computing...');
      return heavyComputation();
    },
    nested: {
      get value() {
        return 42;
      },
    },
  },
);

lazyModule.expensive; // gibt 'computing...' aus und liefert dann das Ergebnis
lazyModule.expensive; // liefert das gemerkte Ergebnis und gibt nichts mehr aus
```

#### Notes

1. **Kein Zusammenführen für den allgemeinen Gebrauch.** Für schlichte Werte nimm `merge`; `mergeExports` ist dafür da, ein modulförmiges Objekt zu bauen, bei dem einige Eigenschaften teuer zu berechnen sind und nur dann laufen sollen, wenn sie wirklich gelesen werden.
2. **Das Ergebnis ist eingefroren** (`Object.freeze`), und jede definierte Eigenschaft ist `configurable: false` — dem zurückgegebenen Objekt lässt sich also nichts neu zuweisen und nichts hinzufügen.
3. **Alles andere wirft.** Ein Wert, der weder ein Getter noch ein schlichtes verschachteltes Objekt ist (ein Array, eine Funktion, ein direkt zugewiesener primitiver Wert), wirft `Exposed values must be either
a getter or a nested object`.
