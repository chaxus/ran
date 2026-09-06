# Easing-Funktionen (Tween)

Sieben Easing-Familien, jede mit einer `easeIn`- und einer `easeOut`-Form. Sie sind reine Mathematik: kein DOM, keine eigene RAF-Schleife. Du gibst aus deinem eigenen Animationsbild die aktuelle Zeit hinein und bekommst den Wert zurück, den dieses Bild verwenden soll.

Die Argumente folgen der klassischen Konvention von Robert Penner:

- `t`: aktuelle Zeit (wie viel schon vergangen ist)
- `b`: Anfangswert
- `c`: Änderung des Werts (der Endwert ist `b + c`)
- `d`: Dauer

Jede Funktion begrenzt intern bei `t >= d`; ein Aufruf über das Ende hinaus liefert also den Endwert, statt aus dem Bereich hinaus zu extrapolieren.

## Verwendung

```ts
import { cubic } from 'ranuts/utils';

const start = performance.now();
const tick = (now: number) => {
  const x = cubic.easeOut(now - start, 0, 300, 600); // von 0 auf 300 in 600 ms
  el.style.transform = `translateX(${x}px)`;
  if (now - start < 600) requestAnimationFrame(tick);
};
requestAnimationFrame(tick);
```

## Verfügbare Kurven

| Export  | Kurve                 | Wirkung                                             |
| ------- | --------------------- | --------------------------------------------------- |
| `quad`  | quadratisch (`t²`)    | Die sanfteste Beschleunigung; ein sicherer Standard |
| `cubic` | kubisch (`t³`)        | Merklich flotter als `quad`                         |
| `quart` | biquadratisch (`t⁴`)  | Kräftige Beschleunigung                             |
| `quint` | fünften Grades (`t⁵`) | Sehr kräftig; das Ende bestimmt die Bewegung        |
| `sine`  | sinusförmig           | Die weichste von allen, kaum als Easing zu erkennen |
| `expo`  | exponentiell          | Fast im Stillstand, dann ein plötzlicher Lauf       |
| `circ`  | kreisförmig           | Langsamer Start, sehr abruptes Ende                 |

## API

Jeder Export hat dieselbe Form:

```ts
interface SpeedType {
  easeIn: EasingFn;
  easeOut: EasingFn;
}

type EasingFn = (t: number, b: number, c: number, d: number) => number;
```

### easeIn / easeOut

#### Parameter

| Parameter | Beschreibung                        | Typ      | Standard     |
| --------- | ----------------------------------- | -------- | ------------ |
| `t`       | Vergangene Zeit                     | `number` | Erforderlich |
| `b`       | Anfangswert                         | `number` | Erforderlich |
| `c`       | Änderung des Werts (Ende = `b + c`) | `number` | Erforderlich |
| `d`       | Dauer                               | `number` | Erforderlich |

#### Rückgabe

| Argument | Beschreibung               | Typ      |
| -------- | -------------------------- | -------- |
| `value`  | Der Wert zum Zeitpunkt `t` | `number` |

## Hinweise

`easeIn` beginnt langsam und beschleunigt, `easeOut` beginnt schnell und bremst ab. Für eine Oberfläche, die auf eine Handlung antwortet, wirkt `easeOut` meist besser: Das Element setzt sich sofort in Bewegung und kommt zur Ruhe, statt erst zu zögern.

Mit Dank an [zhangxinxu/Tween](https://github.com/zhangxinxu/Tween).
