# formatDate / timestampToTime

Da formato a una fecha con un patrón de tokens.

## API

### formatDate(value?, pattern?)

| Parámetro | Descripción | Tipo | Por defecto |
| --------- | ---------------------------------------------- | -------------------------- | ----------------------- |
| `value` | Marca de tiempo, cadena de fecha o `Date`; omítelo para el momento actual | `number \| string \| Date` | ahora |
| `pattern` | Patrón de tokens | `string` | `'YYYY-MM-DD HH:mm:ss'` |

| Token | Significado | Token | Significado |
| ----------- | ------------ | -------- | ------------- |
| `YYYY`/`YY` | Año | `mm`/`m` | Minuto |
| `MM`/`M` | Mes (1–12) | `ss`/`s` | Segundo |
| `DD`/`D` | Día | `SSS` | Milisegundos |
| `HH`/`H` | Hora (0–23) | `A`/`a` | AM/PM · am/pm |
| `hh`/`h` | Hora (1–12) | `[...]` | Texto literal |

Devuelve `'Invalid Date'` cuando la entrada no se puede interpretar.

### timestampToTime(timestamp?)

En desuso. Devuelve un `Date` con un método `format` colgado de la instancia.

## Ejemplo

```js
import { formatDate } from 'ranuts';

formatDate(); // '2026-07-25 14:30:00'
formatDate(1753425000000, 'YYYY/MM/DD'); // '2026/07/25'
formatDate(new Date(), 'YYYY[年]MM[月]DD[日] hh:mm a');
formatDate('not a date'); // 'Invalid Date'
```

## Notas

1. **Las mayúsculas cuentan.** `MM` es el mes y `mm` el minuto; `HH` va en 24 horas y `hh` en 12.
2. **El patrón se sustituye en una sola pasada**, de modo que un valor recién escrito nunca lo puede volver a capturar un token posterior.
3. **Encierra el texto literal entre `[]`** para que sus letras queden fuera de la sustitución.

::: warning Corregido y sustituido en la 0.3
El formateador antiguo encadenaba seis llamadas a `.replace()` con la bandera de ignorar mayúsculas. De ahí dos consecuencias: un patrón posterior podía capturar los dígitos que otro anterior acababa de escribir, y `/M+/g`, `/m+/g` y `/D+/gi` se solapaban, así que un patrón en minúsculas como `yyyy-mm-dd` daba año-minuto-día.

`timestampToTime` queda en desuso en favor de `formatDate`: colgar un método de una instancia de `Date` no sobrevive a la serialización y no se puede tipar más allá de `Function`. Su `format` ahora delega en `formatDate`, así que quien ya lo usaba recibe el tratamiento de tokens ya corregido.
:::
