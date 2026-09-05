# matchMediaQuery / watchMediaQuery

Lee una media query de CSS desde JavaScript y suscríbete a ella.

Para decidir la maquetación, prefiere esto antes que `isMobile()`: olfatear el UA identifica el **dispositivo**, una media query identifica la **ventana**, y solo lo segundo acierta cuando se estrecha un navegador de escritorio o se gira una tableta.

## API

| Función                            | Descripción                                                        |
| ---------------------------------- | ------------------------------------------------------------------ |
| `matchMediaQuery(query)`           | ¿Coincide la consulta ahora mismo? `false` en SSR                  |
| `watchMediaQuery(query, callback)` | Se suscribe a los cambios; devuelve una función para darse de baja |
| `MOBILE_MEDIA_QUERY`               | `'(max-width: 768px)'`, el punto de ruptura móvil compartido       |

## Ejemplo

```js
import { MOBILE_MEDIA_QUERY, watchMediaQuery } from 'ranuts';

const off = watchMediaQuery(MOBILE_MEDIA_QUERY, (isMobile) => render(isMobile));
onCleanup(off);
```

## Notas

1. **La función se llama una vez de forma síncrona** con el valor actual, así que nunca hace falta leer el estado inicial aparte.
2. **Date de baja siempre.** Un escuchador de `MediaQueryList` que no se libera mantiene viva la clausura (y todo el DOM que haya capturado).
3. **El Safari viejo está contemplado.** `addEventListener` sobre `MediaQueryList` no llegó hasta Safari 14; como recurso se usan `addListener`/`removeListener`.
