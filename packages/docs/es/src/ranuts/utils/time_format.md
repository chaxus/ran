# Formato de tiempos

El tiempo aparece en una interfaz con tres formas distintas, y confundirlas es la fuente habitual de líos. `ranuts` le da a cada una su propia función:

| Lo que el lector se pregunta      | Función                                | Salida de ejemplo     |
| --------------------------------- | -------------------------------------- | --------------------- |
| ¿_Cuándo_ pasó esto, exactamente? | [`formatDate`](./timestamp_to_time.md) | `2026-07-25 14:05:09` |
| ¿_Cuánto dura_ esto?              | `formatDuration`                       | `01:01:01`            |
| ¿_Hace_ cuánto fue?               | `formatRelative`                       | `3 days ago`, `5m`    |

## formatDuration

Da a una cantidad de **segundos** transcurridos la forma de un reloj con dos puntos (la que usa un reproductor para el cabezal): `mm:ss`, que se ensancha a `hh:mm:ss` al pasar de una hora.

#### Parámetros

| Parámetro | Descripción                                          | Tipo     | Por defecto |
| --------- | ---------------------------------------------------- | -------- | ----------- |
| `seconds` | Segundos transcurridos; los negativos se ajustan a 0 | `number` | Obligatorio |

#### Returns

`string`: la duración, o `''` si la entrada no es un número finito.

```js
import { formatDuration } from 'ranuts/utils';

formatDuration(0); // '00:00'
formatDuration(65); // '01:05'
formatDuration(3661); // '01:01:01'
formatDuration(NaN); // ''
```

Devolver cadena vacía ante `NaN` es a propósito: un reproductor pide `video.duration` antes de que carguen los metadatos y recibe `NaN`, y ahí un hueco en blanco se lee mejor que `NaN:NaN`.

::: tip Cambió de nombre
Esta función se llamaba `timeFormat`. Ese nombre sigue como alias obsoleto y se comporta igual, pero no decía _cuál_ de los tres formatos de tiempo producía.
:::

## formatRelative

Describe un momento respecto de otro: «hace 3 días», «dentro de 2 horas».

La localización se delega en el [`Intl.RelativeTimeFormat`](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Intl/RelativeTimeFormat) de la plataforma, presente en todos los navegadores importantes desde 2020, que ya conoce las reglas de plural y de flexión de cada idioma. `formatRelative` pone solo la parte que `Intl` deja fuera a propósito: decidir en _qué_ unidad expresar la diferencia.

Igual que el propio `Intl`, informa de una **sola** unidad: una diferencia de 3 días y 6 horas es «hace 3 días», nunca «hace 3 días y 6 horas».

#### Parámetros

| Parámetro | Descripción                        | Tipo                       | Por defecto |
| --------- | ---------------------------------- | -------------------------- | ----------- |
| `value`   | El momento que se quiere describir | `number \| string \| Date` | Obligatorio |
| `options` | Véase más abajo                    | `FormatRelativeOptions`    | `{}`        |

| Opción    | Descripción                                                                         | Tipo                       | Por defecto    |
| --------- | ----------------------------------------------------------------------------------- | -------------------------- | -------------- |
| `now`     | Contra qué se mide                                                                  | `number \| string \| Date` | la hora actual |
| `locale`  | Etiqueta o etiquetas BCP 47; el estilo `compact` las ignora                         | `string \| string[]`       | la del entorno |
| `style`   | `'long' \| 'short' \| 'narrow' \| 'compact'`                                        | `RelativeStyle`            | `'long'`       |
| `numeric` | Con `'auto'` entran giros como `yesterday`; con `'always'` se mantienen los números | `'always' \| 'auto'`       | `'auto'`       |

#### Returns

`string`: la descripción, o `''` si no se puede interpretar alguno de los dos extremos.

```js
import { formatRelative } from 'ranuts/utils';

const twoHoursAgo = Date.now() - 2 * 3600_000;

formatRelative(twoHoursAgo); // '2 hours ago'
formatRelative(twoHoursAgo, { style: 'short' }); // '2 hr. ago'
formatRelative(twoHoursAgo, { locale: 'zh-CN' }); // '2 小时前'
formatRelative(Date.now() + 60_000); // 'in 1 minute'
formatRelative(Date.now() - 86_400_000); // 'yesterday'
formatRelative(Date.now() - 86_400_000, { numeric: 'always' }); // '1 day ago'
```

### El estilo compact

`compact` es esa forma apretada de insignia que se ve junto a los elementos de un muro o una lista:

```js
formatRelative(Date.now() - 30_000, { style: 'compact' }); // '30s'
formatRelative(Date.now() - 5 * 60_000, { style: 'compact' }); // '5m'
formatRelative(Date.now() - 3 * 3600_000, { style: 'compact' }); // '3h'
formatRelative(Date.now() - 2 * 86_400_000, { style: 'compact' }); // '2d'
```

::: warning No indica el sentido
`compact` es solo una magnitud, así que un instante futuro se ve exactamente igual que uno pasado (`5m` en ambos casos). Está pensado para muros de sucesos ya ocurridos. Usa otro estilo allí donde el lector tenga que distinguir pasado de futuro.
:::

## parseVttTimestamp / parseVttCueTiming

Interpretación de los tiempos de subtítulos WebVTT: las líneas `hh:mm:ss.mmm --> hh:mm:ss.mmm` de un archivo `.vtt`.

`parseVttTimestamp` convierte una marca de tiempo (con `hh:` opcional) en segundos; `parseVttCueTiming` interpreta una línea de tiempos completa —los dos lados separados por `-->`— y devuelve `{ start, end }`, pasando por alto los ajustes de cue que vengan al final (`align:start line:0`).

```js
import { parseVttTimestamp, parseVttCueTiming } from 'ranuts/utils';

parseVttTimestamp('00:00:05.000'); // 5
parseVttTimestamp('01:05.250'); // 65.25
parseVttTimestamp('not a timestamp'); // undefined

parseVttCueTiming('00:00:00.000 --> 00:00:05.000'); // { start: 0, end: 5 }
parseVttCueTiming('00:00:05.000 --> 00:00:10.000 align:start line:0'); // { start: 5, end: 10 }
```

Ambas devuelven `undefined` cuando la entrada no encaja, y nunca lanzan, así que una línea mal formada en un archivo de subtítulos se puede saltar en vez de abortar toda la lectura.

## Notas

1. **Elección de unidad**: `formatRelative` toma la unidad más gruesa que la diferencia llega a llenar y redondea dentro de ella. Cuando el redondeo cae en el umbral de la siguiente (59,6 minutos que redondean a «60 minutos»), asciende, y así lees «hace 1 hora».
2. **Redondeo simétrico**: se redondea la magnitud y luego se le devuelve el signo, porque en JavaScript `Math.round(-1.5)` da `-1` y, de otro modo, hace 90 minutos se leería «hace 1 hora» mientras que dentro de 90 minutos se leería «dentro de 2 horas».
3. **Reaprovechar el formateador**: las instancias de `Intl.RelativeTimeFormat` se guardan en caché por cada combinación de idioma, estilo y `numeric`, así que una lista que pinta cien marcas de tiempo construye un formateador, no cien.
4. **Plan B**: en un entorno sin `Intl.RelativeTimeFormat`, la salida cae al formato compacto en lugar de lanzar.
