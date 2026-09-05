# mathjs

Rechnet exakt mit Zahlen, umgeht die Genauigkeitsprobleme der Gleitkommazahlen von JavaScript und lässt sich verketten.

## API

### mathjs

#### Rückgabe

| Argument              | Beschreibung                  | Typ                                  |
| --------------------- | ----------------------------- | ------------------------------------ |
| `ComputeNumberResult` | Objekt mit dem Rechenergebnis | `{ result: number, next: Function }` |

#### Parameter

| Parameter | Beschreibung                   | Typ      | Standard     |
| --------- | ------------------------------ | -------- | ------------ |
| `a`       | Erste Zahl                     | `number` | Erforderlich |
| `type`    | Rechenart (`+`, `-`, `*`, `/`) | `string` | Erforderlich |
| `b`       | Zweite Zahl                    | `number` | Erforderlich |

#### ComputeNumberResult

| Eigenschaft | Beschreibung                 | Typ        |
| ----------- | ---------------------------- | ---------- |
| `result`    | Das Rechenergebnis           | `number`   |
| `next`      | Funktion, um weiterzurechnen | `Function` |

## Beispiel

### Grundlegende Verwendung

```js
import { mathjs } from 'ranuts';

const result = mathjs(0.1, '+', 0.2);
console.log(result.result); // 0.3 (exakt, nicht 0.30000000000000004)
```

### Verkettung

```js
import { mathjs } from 'ranuts';

const result = mathjs(1.3, '-', 1.2).next('+', 1.5).next('*', 2.3).next('/', 0.2);
console.log(result.result); // Das exakte Ergebnis
```

### Genauigkeitsprobleme umgehen

```js
import { mathjs } from 'ranuts';

// Die native Rechnung in JavaScript verliert Genauigkeit
console.log(0.1 + 0.2); // 0.30000000000000004

// Mit mathjs stimmt das Ergebnis
const result = mathjs(0.1, '+', 0.2);
console.log(result.result); // 0.3
```

### Eine längere Rechnung

```js
import { mathjs } from 'ranuts';

const total = mathjs(100, '*', 0.1).next('+', 50).next('-', 20).next('/', 2);
console.log(total.result); // Das exakte Ergebnis
```

## Hinweise

1. **Genauigkeit**: kümmert sich von allein um die Gleitkomma-Probleme und umgeht den Klassiker `0.1 + 0.2 !== 0.3`.
2. **Verkettung**: Mit der Methode `next` lassen sich Rechnungen aneinanderhängen.
3. **Rechenarten**: die vier Grundrechenarten `+` (plus), `-` (minus), `*` (mal) und `/` (geteilt).
4. **Tempo**: etwas langsamer als die nativen Operationen, dafür genau.
