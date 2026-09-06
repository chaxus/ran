# once / singleFlight

Ejecuta algo **exactamente una vez** y reutiliza el resultado: inicialización perezosa para analizar la configuración, un cálculo caro que solo se hace una vez, captadores perezosos. `once` es síncrona; `singleFlight` es su equivalente asíncrona.

## API

### once(fn)

| Parámetro | Descripción                                                                    | Tipo              | Por defecto |
| --------- | ------------------------------------------------------------------------------ | ----------------- | ----------- |
| `fn`      | Función que se ejecuta una vez; lo que no sea una función se devuelve tal cual | `Function \| any` | Obligatorio |

Devuelve una función envuelta. La primera llamada evalúa y guarda; todas las siguientes devuelven aquel primer resultado, **se le pasen los argumentos que se le pasen**.

### singleFlight(fn)

| Parámetro | Descripción                              | Tipo               | Por defecto |
| --------- | ---------------------------------------- | ------------------ | ----------- |
| `fn`      | Función asíncrona que se ejecuta una vez | `() => Promise<T>` | Obligatorio |

Devuelve una función envuelta, más:

| Miembro   | Descripción                                                                         | Tipo         |
| --------- | ----------------------------------------------------------------------------------- | ------------ |
| `reset()` | Descarta el resultado guardado para que la siguiente llamada vuelva a ejecutar `fn` | `() => void` |
| `started` | Si ya tiene un resultado o está ejecutándose ahora mismo                            | `boolean`    |

### memoize(fn)

Alias en desuso de `once`. Véase el aviso de abajo.

## Ejemplo

```js
import { once, singleFlight } from 'ranuts';

// Síncrono: la configuración se analiza solo la primera vez que se toca
const config = once(() => JSON.parse(rawConfig));
config(); // analiza
config(); // devuelve lo guardado

// Asíncrono: la base de datos se abre una vez, compitan cuantos compitan
const ready = singleFlight(() => db.openDataBase());
await Promise.all([ready(), ready(), ready()]); // abre una sola vez
```

## Notas

1. **`once` no guarda por argumentos.** Solo cuentan los de la primera llamada. Si necesitas caché por argumento, monta tú un `Map`.
2. **`once` suelta `fn` en cuanto la evalúa**, así que lo que aquella función retuviera puede recogerse como basura.
3. **`singleFlight` no guarda los rechazos.** Un intento fallido limpia la caché, de modo que un tropiezo pasajero de la red se puede reintentar. Guardar una promesa rechazada haría permanente un fallo momentáneo.
4. **Las llamadas concurrentes a `singleFlight` comparten la promesa en curso**, así que `fn` se ejecuta una vez aunque compitan N llamadas. Esta es la solución al clásico fallo de «init() devuelve void, así que quien llama no puede esperarla y las escrituras tempranas fallan».

::: warning Renombrado en la 0.3
`memoize` era un nombre engañoso: nunca guardó nada por argumento, simplemente se ejecutaba una vez. Ahora es un alias de `once` y queda en desuso. La firma de tipos también estaba mal antes (se declaraba sin argumentos aunque los reenviaba); ahora se infiere de `fn`.
:::
