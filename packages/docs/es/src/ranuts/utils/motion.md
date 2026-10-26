# spring / stagger / observeEntry

Primitivas de movimiento que dejan el dibujo en tus manos: un muelle resuelto de forma exacta (también como easing CSS `linear()`), retrasos escalonados, una entrada en pantalla de un solo disparo y la preferencia de movimiento reducido del lector. Ninguna tiene su propio bucle de animación, así que sirven igual con Web Animations, transiciones CSS o tu propio `requestAnimationFrame`.

## API

### spring(options?)

Devuelve `{ at, duration, easing }`. `at(seconds)` es el progreso de 0 a 1 (un muelle subamortiguado pasa de 1 antes de asentarse); `duration` es el tiempo hasta quedar a menos del 0,1 % del objetivo; `easing` es la misma curva como cadena CSS `linear()` para esa duración.

| Opción      | Descripción                                                    | Valor por defecto |
| ----------- | -------------------------------------------------------------- | ----------------- |
| `stiffness` | Fuerza hacia el objetivo; más alta, más rápida                 | `170`             |
| `damping`   | Resistencia; por debajo de `2 * sqrt(stiffness * mass)` rebota | `26`              |
| `mass`      | Inercia                                                        | `1`               |
| `velocity`  | Velocidad inicial, en progreso por segundo                     | `0`               |

### stagger(index, count, options?)

Retraso en segundos del elemento `index` de `count`, empezando por el primero, el último o el centro (`from`).

### observeEntry(element, options)

Llama a `onEnter` una sola vez, cuando el borde superior del elemento cruza `line` (fracción de la altura de la ventana desde arriba), y deja de observar. Recibe `{ reduced }`: si es `true`, muestra el estado final sin animar. Devuelve una función para dejar de observar antes.

### prefersReducedMotion()

`true` cuando el lector pidió movimiento reducido; `false` donde no hay window (SSR, Node).

## Ejemplo

```js
import { observeEntry, prefersReducedMotion, spring, stagger } from 'ranuts';

const { duration, easing } = spring({ stiffness: 260, damping: 20 });
const cards = [...document.querySelectorAll('.card')];

cards.forEach((card, index) => {
  observeEntry(card, {
    line: 0.85,
    onEnter: ({ reduced }) => {
      if (reduced) return; // already in its final place
      card.animate(
        [
          { opacity: 0, transform: 'translateY(24px)' },
          { opacity: 1, transform: 'none' },
        ],
        {
          duration: duration * 1000,
          delay: stagger(index, cards.length, { each: 0.06 }) * 1000,
          easing,
          fill: 'backwards',
        },
      );
    },
  });
});
```

## Notas

1. **El contenido se ve sin script.** Anima _desde_ un desplazamiento con `fill: 'backwards'` en lugar de ocultar elementos con CSS, así un script fallido o el movimiento reducido lo dejan todo en su sitio.
2. **Sin IntersectionObserver, `observeEntry` entra de inmediato** en vez de dejar el elemento esperando.
3. **El muelle es exacto, no por pasos,** así que las mismas opciones dan la misma curva a cualquier frecuencia de fotogramas.
