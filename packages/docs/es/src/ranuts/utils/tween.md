# Funciones de suavizado (tween)

Siete familias de suavizado, cada una con su forma `easeIn` y su forma `easeOut`. Son matemáticas puras: ni DOM, ni un bucle de animación propio. Tú le das el tiempo actual desde tu propio fotograma y te devuelve el valor que ese fotograma debe usar.

Los parámetros siguen la convención clásica de Robert Penner:

- `t`: tiempo actual (cuánto ha transcurrido)
- `b`: valor inicial
- `c`: variación del valor (el valor final es `b + c`)
- `d`: duración

Todas las funciones acotan por dentro en `t >= d`, así que llamarlas pasado el final devuelve el valor definitivo en lugar de extrapolar fuera de rango.

## Uso

```ts
import { cubic } from 'ranuts/utils';

const start = performance.now();
const tick = (now: number) => {
  const x = cubic.easeOut(now - start, 0, 300, 600); // de 0 a 300 en 600 ms
  el.style.transform = `translateX(${x}px)`;
  if (now - start < 600) requestAnimationFrame(tick);
};
requestAnimationFrame(tick);
```

## Curvas disponibles

| Exportación | Curva             | Sensación                                   |
| ----------- | ----------------- | ------------------------------------------- |
| `quad`      | cuadrática (`t²`) | La aceleración más suave; una opción segura |
| `cubic`     | cúbica (`t³`)     | Bastante más viva que `quad`                |
| `quart`     | cuártica (`t⁴`)   | Aceleración fuerte                          |
| `quint`     | quíntica (`t⁵`)   | Muy fuerte; el final domina el movimiento   |
| `sine`      | sinusoidal        | La más suave de todas, apenas se percibe    |
| `expo`      | exponencial       | Casi quieta, y de pronto se lanza           |
| `circ`      | circular          | Arranque lento, final muy brusco            |

## API

Todas las exportaciones tienen la misma forma:

```ts
interface SpeedType {
  easeIn: EasingFn;
  easeOut: EasingFn;
}

type EasingFn = (t: number, b: number, c: number, d: number) => number;
```

### easeIn / easeOut

#### Parámetros

| Parámetro | Descripción                               | Tipo     | Por defecto |
| --------- | ----------------------------------------- | -------- | ----------- |
| `t`       | Tiempo transcurrido                       | `number` | Obligatorio |
| `b`       | Valor inicial                             | `number` | Obligatorio |
| `c`       | Variación del valor (el final es `b + c`) | `number` | Obligatorio |
| `d`       | Duración                                  | `number` | Obligatorio |

#### Devuelve

| Argumento | Descripción                 | Tipo     |
| --------- | --------------------------- | -------- |
| `value`   | El valor en el instante `t` | `number` |

## Notas

`easeIn` arranca lento y acelera; `easeOut` arranca rápido y frena. Para una interfaz que responde a una acción de la persona, `easeOut` suele quedar mejor: el elemento se mueve al momento y se asienta, en lugar de dudar primero.

Con agradecimiento a [zhangxinxu/Tween](https://github.com/zhangxinxu/Tween).
