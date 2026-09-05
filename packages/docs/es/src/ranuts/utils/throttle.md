# throttle

Estrangulamiento: cuando una función se dispara muchas veces seguidas, se ejecuta como mucho una vez por intervalo. La primera llamada corre de inmediato (flanco inicial) y la última de la ventana se repite al cerrarse esta (flanco final), de modo que el estado final nunca se pierde.

Úsalo para el desplazamiento, el movimiento del puntero y el arrastre: todo lo que necesite **respuesta continua**. Si solo importa el valor final (buscar mientras se escribe, guardado automático), usa [debounce](./debounce).

## API

### throttle(fn, delay?)

#### Parámetros

| Parámetro | Descripción | Tipo | Por defecto |
| --------- | --------------------- | ---------- | -------- |
| `fn` | Función a la que aplicar el estrangulamiento | `Function` | Obligatorio |
| `delay` | Intervalo mínimo (ms) | `number` | `300` |

#### Devuelve

Una función estrangulada que conserva el `this` y los argumentos del punto de llamada, además de:

| Miembro | Descripción | Tipo |
| ----------- | ---------------------------------- | --------------- |
| `cancel()` | Descarta la llamada final pendiente | `() => void` |
| `pending()` | Si hay una llamada final esperando | `() => boolean` |

## Ejemplo

```js
import { throttle } from 'ranuts';

const onScroll = throttle(() => update(window.scrollY), 100);
window.addEventListener('scroll', onScroll);

// Al desmontar: quita el escuchador *y* descarta la llamada final pendiente
window.removeEventListener('scroll', onScroll);
onScroll.cancel();
```

## Notas

1. **Flanco inicial y final**: corre de inmediato y una vez más al cerrarse la ventana, con los últimos argumentos.
2. **El `this` y los argumentos** llegan tal cual desde el punto de llamada.
3. **Corre en cualquier parte**: usa el `setTimeout` a secas, así que funciona en Node, en Web Workers y en el servidor.
4. **Cada llamada a `throttle()` tiene su propia ventana**; dos funciones estranguladas nunca se estorban.
5. **Llama siempre a `cancel()` al desmontar**; si no, la llamada final dispara sobre un contexto ya destruido.

::: warning Eliminado en la 0.3
`generateThrottle()` ya no existe. Devolvía una fábrica cuyas funciones **compartían un solo temporizador y una sola marca de tiempo**, así que dos funciones estranguladas sin relación entre sí se anulaban la una a la otra. Sustituye `const g = generateThrottle(); const f = g(fn, delay)` por `throttle(fn, delay)`.
:::
