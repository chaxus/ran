# report / setReportUrl / createData

Envía balizas de telemetría a tu propio punto de recogida.

## API

### setReportUrl(config)

Configura el punto de recogida por defecto una vez, al arrancar. Acepta una URL como cadena, o un objeto:

| Campo          | Descripción                                                                      | Tipo     |
| -------------- | -------------------------------------------------------------------------------- | -------- |
| `url`          | Punto de recogida por defecto para todo `report()` que no traiga su propia `url` | `string` |
| `userIdCookie` | Cookie con el identificador de usuario, que `createData()` recoge                | `string` |

### getReportUrl()

El punto de recogida configurado, o `''`.

### report({ url?, type?, payload })

Envía `payload`. Prefiere `navigator.sendBeacon` y, si no puede, recurre a una petición de imagen de 1x1. Devuelve `true` si algún transporte lo aceptó y `false` si nada pudo enviarlo, incluido el caso de que no se haya configurado ningún punto de recogida.

### createData(params?)

Construye el sobre habitual: identificador del evento, URL de la página, marca de tiempo, referente, viewport y user agent, más `userId` cuando `userIdCookie` está configurado. Tus `params` se aplican al final. Bajo renderizado en servidor devuelve `{}`.

## Ejemplo

```js
import { createData, report, setReportUrl } from 'ranuts';

setReportUrl({ url: 'https://telemetry.example.com/collect', userIdCookie: 'uid' });

report({ payload: { ...createData(), type: 'page_view' } });
```

## Notas

1. **No hay punto de recogida por defecto, y es a propósito.** Una librería no puede saber a dónde va tu telemetría, así que `report()` devuelve `false` en vez de adivinar.
2. **El transporte se elige según si `sendBeacon` funcionó de verdad**, no según si existe `navigator`. `sendBeacon` también devuelve `false` cuando la cola del navegador ha superado su cupo; ese caso también pasa a la baliza de imagen.
3. **Llama a `createData()` en cada evento, no una vez al configurar.** Toma una instantánea de la URL y la marca de tiempo en el momento en que corre; sacarlo del manejador hace que todos los eventos posteriores informen del estado de la carga de la página.

::: warning Sustituye a getHost en la 0.3
`getHost()` ya no existe. Construía un punto de recogida de registros a partir de un dominio escrito a fuego, el del autor de este repositorio, y una edición a medio hacer había degradado su salida al literal `'//log.'` (que no es un host alcanzable), de modo que todo informe sin una `url` explícita se enviaba en silencio a la nada. `createData()` tampoco lee ya una cookie `chaxus_prod` escrita a fuego; configura `userIdCookie` en su lugar.
:::
