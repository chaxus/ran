# computePlacement

Coloca un panel flotante (desplegable, popover, información sobre herramienta) respecto al rectángulo de un ancla: si al lado preferido le falta sitio y al contrario le sobra, se pasa al contrario, y luego se desplaza por el eje transversal para no salirse de un límite. Hace lo mismo que los middleware `flip` y `shift` de Floating UI, sin la dependencia.

Geometría pura: nunca toca el DOM. Le pasas resultados de `getBoundingClientRect()` y te devuelve las coordenadas que hay que escribir.

## Uso

```ts
import { computePlacement } from 'ranuts/utils';

const anchorRect = trigger.getBoundingClientRect();
const { top, left, placement } = computePlacement({
  anchor: anchorRect,
  floating: { width: panel.offsetWidth, height: panel.offsetHeight },
  placement: 'bottom',
  offset: 4,
});

panel.style.position = 'absolute';
panel.style.top = `${top + window.scrollY}px`;
panel.style.left = `${left + window.scrollX}px`;
// `placement` es el lado que se acabó usando, ya con el volteo aplicado; úsalo para
// elegir la clase de animación de entrada o la dirección de la flecha.
```

## API

### computePlacement

#### Parámetros

| Parámetro           | Descripción                                                                                                | Tipo                                     | Por defecto               |
| ------------------- | ---------------------------------------------------------------------------------------------------------- | ---------------------------------------- | ------------------------- |
| `options.anchor`    | Rectángulo del ancla (el disparador), en coordenadas del viewport (por ejemplo, `getBoundingClientRect()`) | `{ top, left, width, height }`           | Obligatorio               |
| `options.floating`  | El tamaño del propio panel flotante                                                                        | `{ width, height }`                      | Obligatorio               |
| `options.placement` | Lado preferido. Se pasa al contrario cuando le falta sitio y al contrario le sobra                         | `'top' \| 'bottom' \| 'left' \| 'right'` | Obligatorio               |
| `options.offset`    | Hueco que se deja entre el ancla y el panel flotante, en px                                                | `number`                                 | `0`                       |
| `options.boundary`  | Región dentro de la cual debe quedarse el panel, en coordenadas del viewport                               | `{ top, left, width, height }`           | El viewport de la ventana |
| `options.padding`   | Hueco mínimo que se deja entre el panel y el borde del límite al desplazarlo, en px                        | `number`                                 | `8`                       |

#### Devuelve

| Argumento   | Descripción                                                         | Tipo                                     |
| ----------- | ------------------------------------------------------------------- | ---------------------------------------- |
| `top`       | El `top` resuelto, en el mismo espacio de coordenadas que `anchor`  | `number`                                 |
| `left`      | El `left` resuelto, en el mismo espacio de coordenadas que `anchor` | `number`                                 |
| `placement` | El lado que se acabó usando, ya con el volteo                       | `'top' \| 'bottom' \| 'left' \| 'right'` |

## Notas

1. **Las coordenadas son siempre relativas al viewport**, el mismo espacio que `anchor`. Si colocas el panel con `position: absolute` respecto al documento, súmale tú `scrollX` y `scrollY` al escribir el estilo (véase el ejemplo de arriba).
2. **Sin maquetación real, ni volteo ni desplazamiento.** Cuando `anchor` o `floating` tiene ancho o alto cero (jsdom, que nunca maqueta de verdad, o un panel leído antes de que su contenido se asiente), los cálculos de espacio «detectarían» una colisión falsa en cada llamada. Por eso `computePlacement` se salta el volteo y el desplazamiento por completo y devuelve tal cual el `placement` que le pidieron.
3. **El desplazamiento se omite cuando el panel es más grande que el propio límite**: ceñirlo solo lo empujaría fuera de la pantalla por el otro lado.
4. Lo usan por dentro el `r-popover` y el `r-select` de `ranui` para que un desplegable portado al `body` no se salga de la pantalla.
