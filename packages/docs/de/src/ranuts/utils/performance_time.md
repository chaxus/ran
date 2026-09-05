# performanceTime

Liefert einen hochauflösenden Zeitstempel, im Browser wie in Node.js.

## API

### performanceTime

#### Rückgabe

| Argument | Beschreibung                                | Typ      |
| -------- | ------------------------------------------- | -------- |
| `number` | Hochauflösender Zeitstempel (Millisekunden) | `number` |

#### Parameter

Keine Parameter

## Beispiel

### Grundlegende Verwendung

```js
import { performanceTime } from 'ranuts';

const start = performanceTime();
// Ein paar Operationen ausführen
const end = performanceTime();
console.log(`Dauer: ${end - start} ms`);
```

### Laufzeit messen

```js
import { performanceTime } from 'ranuts';

const start = performanceTime();
// Aufwendige Operationen ausführen
for (let i = 0; i < 1000000; i++) {
  Math.sqrt(i);
}
const end = performanceTime();
console.log(`Dauer der Operation: ${end - start} ms`);
```

### Ausführungszeit einer Funktion

```js
import { performanceTime } from 'ranuts';

function expensiveFunction() {
  // Aufwendige Berechnung
  return Math.random() * 1000;
}

const start = performanceTime();
const result = expensiveFunction();
const end = performanceTime();
console.log(`Ergebnis: ${result}, Dauer: ${end - start} ms`);
```

## Hinweise

1. **Unterstützte Umgebungen**:
   - Browser: nutzt `performance.now()`
   - Node.js: nutzt `process.hrtime()`
   - sonst: fällt auf `Date.now()` zurück

2. **Auflösung**: `performance.now()` und `process.hrtime()` lösen bis in den Mikrosekundenbereich auf, feiner als `Date.now()`.

3. **Relative Zeit**: Der Zeitstempel ist relativ; er taugt zum Messen von Abständen, nicht als absolute Uhrzeit.

4. **Einheit**: Der Rückgabewert ist in Millisekunden.
