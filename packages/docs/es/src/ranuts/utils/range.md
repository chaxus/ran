# range

Mantiene un número dentro de un mínimo y un máximo dados.

## API

### range

#### Devuelve

| Argumento | Descripción         | Tipo     |
| --------- | ------------------- | -------- |
| `number`  | El número ya ceñido | `number` |

#### Parámetros

| Parámetro | Descripción           | Tipo     | Por defecto |
| --------- | --------------------- | -------- | ----------- |
| `num`     | El número que se ciñe | `number` | Obligatorio |
| `min`     | Valor mínimo          | `number` | `0`         |
| `max`     | Valor máximo          | `number` | `1`         |

## Ejemplo

### Uso básico

```js
import { range } from 'ranuts';

console.log(range(5, 0, 10)); // 5
console.log(range(15, 0, 10)); // 10 (ceñido al máximo)
console.log(range(-5, 0, 10)); // 0 (ceñido al mínimo)
```

### Ceñir un porcentaje

```js
import { range } from 'ranuts';

const progress = 150; // 150%
const clamped = range(progress, 0, 100);
console.log(clamped); // 100
```

### Un rango propio

```js
import { range } from 'ranuts';

const value = 25;
const clamped = range(value, 10, 20);
console.log(clamped); // 20 (fuera de rango, así que se ciñe)
```

### Ceñir un valor de color

```js
import { range } from 'ranuts';

const red = 300; // un valor RGB debería ir de 0 a 255
const clamped = range(red, 0, 255);
console.log(clamped); // 255
```

## Notas

1. **Cómo ciñe**: si el número es menor que el mínimo, devuelve el mínimo; si es mayor que el máximo, devuelve el máximo; en otro caso devuelve el valor tal cual.
2. **Rango por defecto**: de 0 a 1, cómodo para porcentajes y proporciones.
3. **Cuándo usarlo**: es habitual para limitar lo que escribe la persona y para calcular valores de progreso o de color.

## Interpolación y cambio de rango

Interpolación y cambio de rango al estilo de los shaders: las mismas piezas que ofrecen `mix`, `clamp` y `smoothstep` de GLSL. Van bien para suavizar animaciones, para llevar una posición de desplazamiento a una opacidad, o para convertir entre rangos numéricos sin relación entre sí.

### clamp

Hace lo mismo que el `range` de arriba, pero con el orden de argumentos de GLSL: `clamp(value, min, max)` frente a `range(num, min, max)`. Se añadió junto al resto de este grupo por coherencia; elige el orden que se lea mejor donde lo escribas.

```ts
import { clamp } from 'ranuts/utils';

clamp(150, 0, 100); // 100
clamp(-10, 0, 100); // 0
```

### lerp / inverseLerp

`lerp(a, b, t)` interpola de `a` a `b` según `t` (`t=0` → `a`, `t=1` → `b`). `inverseLerp(a, b, value)` es lo contrario: dado un `value` entre `a` y `b`, dice dónde queda, de `0` a `1`. Ninguna de las dos ciñe: si `value` cae fuera de `[a, b]`, `t` (o el resultado) sale de `0..1`.

```ts
import { lerp, inverseLerp } from 'ranuts/utils';

lerp(0, 100, 0.25); // 25
inverseLerp(0, 100, 25); // 0.25
inverseLerp(0, 100, 150); // 1.5 — no se ciñe
```

#### Parámetros

| Función                    | Parámetro | Descripción              | Tipo     |
| -------------------------- | --------- | ------------------------ | -------- |
| `lerp(a, b, t)`            | `a`, `b`  | Valor inicial y final    | `number` |
|                            | `t`       | Factor de interpolación  | `number` |
| `inverseLerp(a, b, value)` | `a`, `b`  | Valor inicial y final    | `number` |
|                            | `value`   | El valor que se consulta | `number` |

### remap / fit

`remap(value, a1, a2, b1, b2)` lleva `value` de `[a1, a2]` a `[b1, b2]` de forma lineal, sin ceñir. `fit` es la versión que sí ciñe: el mismo cambio de rango y, después, ceñido al rango de salida.

```ts
import { remap, fit } from 'ranuts/utils';

remap(5, 0, 10, 0, 100); // 50
remap(15, 0, 10, 0, 100); // 150 — fuera de [0,10], así que también fuera de [0,100]

fit(15, 0, 10, 0, 100); // 100 — ceñido al rango de salida
```

### linearstep / smoothstep

Las dos suben de `0` a `1` a medida que `x` va de `edge0` a `edge1`, y ciñen fuera de ese tramo. `linearstep` es una recta; `smoothstep` es la curva de Hermite suavizada de GLSL (`3t² - 2t³`), una entrada y salida suaves en vez de una rampa recta, y lo que normalmente se elige para animaciones y para los fundidos de un shader.

```ts
import { linearstep, smoothstep } from 'ranuts/utils';

linearstep(0, 1, 0.5); // 0.5
smoothstep(0, 1, 0.5); // 0.5 (el punto medio coincide; la curva difiere en el resto)
smoothstep(0, 1, 0.1); // 0.028 — suavizado, tarda más en despegar de 0 que el 0.1 de linearstep
```

#### Notes

1. **No ciñen: `lerp`, `inverseLerp`, `remap`.** Dales un `value` o una `t` fuera del rango previsto y obtendrás un resultado extrapolado, no un error ni un valor ceñido.
2. **Sí ciñen: `fit`, `linearstep`, `smoothstep`.** Estas tres devuelven siempre un valor dentro de su rango de salida.
3. `linearstep(edge0, edge1, x)` con `edge0 === edge1` devuelve `0` para `x < edge0` y `1` en los demás casos, en lugar de dividir entre cero.
