# range

Hält eine Zahl zwischen einem vorgegebenen Kleinst- und Größtwert.

## API

### range

#### Rückgabe

| Argument | Beschreibung       | Typ      |
| -------- | ------------------ | -------- |
| `number` | Die begrenzte Zahl | `number` |

#### Parameter

| Parameter | Beschreibung            | Typ      | Standard     |
| --------- | ----------------------- | -------- | ------------ |
| `num`     | Die zu begrenzende Zahl | `number` | Erforderlich |
| `min`     | Kleinstwert             | `number` | `0`          |
| `max`     | Größtwert               | `number` | `1`          |

## Beispiel

### Grundlegende Verwendung

```js
import { range } from 'ranuts';

console.log(range(5, 0, 10)); // 5
console.log(range(15, 0, 10)); // 10 (auf den Größtwert begrenzt)
console.log(range(-5, 0, 10)); // 0 (auf den Kleinstwert begrenzt)
```

### Einen Prozentwert begrenzen

```js
import { range } from 'ranuts';

const progress = 150; // 150%
const clamped = range(progress, 0, 100);
console.log(clamped); // 100
```

### Ein eigener Bereich

```js
import { range } from 'ranuts';

const value = 25;
const clamped = range(value, 10, 20);
console.log(clamped); // 20 (außerhalb des Bereichs, also begrenzt)
```

### Einen Farbwert begrenzen

```js
import { range } from 'ranuts';

const red = 300; // ein RGB-Wert sollte zwischen 0 und 255 liegen
const clamped = range(red, 0, 255);
console.log(clamped); // 255
```

## Hinweise

1. **Wie begrenzt wird**: Ist die Zahl kleiner als der Kleinstwert, kommt der Kleinstwert zurück; ist sie größer als der Größtwert, der Größtwert; sonst der Wert unverändert.
2. **Voreingestellter Bereich**: 0 bis 1, praktisch für Prozentangaben und Verhältnisse.
3. **Einsatz**: üblich, um Eingaben zu begrenzen und um Fortschritts- oder Farbwerte zu berechnen.

## Interpolation und Bereichsumrechnung

Interpolation und Bereichsumrechnung nach Art der Shader: dieselben Grundbausteine, die `mix`, `clamp` und `smoothstep` in GLSL bieten. Nützlich, um Animationen weich zu machen, eine Scrollposition auf eine Deckkraft abzubilden oder zwischen zwei zusammenhanglosen Zahlenbereichen umzurechnen.

### clamp

Tut dasselbe wie `range` oben, nur mit der Argumentreihenfolge von GLSL: `clamp(value, min, max)` gegenüber `range(num, min, max)`. Der Gleichförmigkeit halber zusammen mit dem Rest dieser Gruppe hinzugefügt; nimm die Reihenfolge, die sich an der Aufrufstelle besser liest.

```ts
import { clamp } from 'ranuts/utils';

clamp(150, 0, 100); // 100
clamp(-10, 0, 100); // 0
```

### lerp / inverseLerp

`lerp(a, b, t)` interpoliert um `t` von `a` nach `b` (`t=0` → `a`, `t=1` → `b`). `inverseLerp(a, b, value)` ist die Umkehrung: Zu einem `value` zwischen `a` und `b` sagt es, wo dieser liegt, als `0..1`. Keines von beiden begrenzt: Liegt `value` außerhalb von `[a, b]`, verlässt auch `t` (beziehungsweise das Ergebnis) den Bereich `0..1`.

```ts
import { lerp, inverseLerp } from 'ranuts/utils';

lerp(0, 100, 0.25); // 25
inverseLerp(0, 100, 25); // 0.25
inverseLerp(0, 100, 150); // 1.5 — nicht begrenzt
```

#### Parameter

| Funktion                   | Parameter | Beschreibung             | Typ      |
| -------------------------- | --------- | ------------------------ | -------- |
| `lerp(a, b, t)`            | `a`, `b`  | Anfangs- und Endwert     | `number` |
|                            | `t`       | Anteil der Interpolation | `number` |
| `inverseLerp(a, b, value)` | `a`, `b`  | Anfangs- und Endwert     | `number` |
|                            | `value`   | Der abgefragte Wert      | `number` |

### remap / fit

`remap(value, a1, a2, b1, b2)` bildet `value` linear von `[a1, a2]` auf `[b1, b2]` ab, ohne zu begrenzen. `fit` ist die begrenzende Fassung: dieselbe Umrechnung, danach in den Zielbereich begrenzt.

```ts
import { remap, fit } from 'ranuts/utils';

remap(5, 0, 10, 0, 100); // 50
remap(15, 0, 10, 0, 100); // 150 — außerhalb von [0,10], also auch außerhalb von [0,100]

fit(15, 0, 10, 0, 100); // 100 — auf den Zielbereich begrenzt
```

### linearstep / smoothstep

Beide steigen von `0` auf `1`, während `x` von `edge0` nach `edge1` läuft, und begrenzen außerhalb dieses Abschnitts. `linearstep` ist eine Gerade; `smoothstep` ist die hermitisch geglättete Kurve aus GLSL (`3t² - 2t³`), ein weiches Anfahren und Auslaufen statt einer geraden Rampe — und die übliche Wahl für Animationen und für Überblendungen in Shadern.

```ts
import { linearstep, smoothstep } from 'ranuts/utils';

linearstep(0, 1, 0.5); // 0.5
smoothstep(0, 1, 0.5); // 0.5 (in der Mitte gleich; anderswo verläuft die Kurve anders)
smoothstep(0, 1, 0.1); // 0.028 — geglättet, löst sich langsamer von 0 als die 0.1 von linearstep
```

#### Notes

1. **Nicht begrenzt: `lerp`, `inverseLerp`, `remap`.** Gib ihnen ein `value` oder ein `t` außerhalb des erwarteten Bereichs, und du bekommst ein extrapoliertes Ergebnis — keinen Fehler und keinen begrenzten Wert.
2. **Begrenzt: `fit`, `linearstep`, `smoothstep`.** Diese drei liefern stets einen Wert innerhalb ihres Zielbereichs.
3. `linearstep(edge0, edge1, x)` liefert bei `edge0 === edge1` für `x < edge0` den Wert `0` und sonst `1`, statt durch null zu teilen.
