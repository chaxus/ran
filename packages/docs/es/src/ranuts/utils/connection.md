# connection

Obtiene información sobre la conexión de red actual (Network Information API).

## API

### connection

#### Devuelve

| Argumento                         | Descripción                                  | Tipo                              |
| --------------------------------- | -------------------------------------------- | --------------------------------- |
| `NetworkInformation \| undefined` | El objeto de la conexión de red, o undefined | `NetworkInformation \| undefined` |

#### Parámetros

Sin parámetros

## Ejemplo

### Uso básico

```js
import { connection } from 'ranuts';

const conn = connection();
if (conn) {
  console.log('Tipo de red:', conn.effectiveType);
  console.log('Velocidad de bajada:', conn.downlink, 'Mbps');
  console.log('RTT:', conn.rtt, 'ms');
}
```

### Escuchar los cambios de red

```js
import { connection } from 'ranuts';

const conn = connection();
if (conn) {
  conn.addEventListener('change', () => {
    console.log('Cambió el estado de la red');
    console.log('Nuevo tipo de red:', conn.effectiveType);
  });
}
```

### Adaptar la estrategia a la red

```js
import { connection } from 'ranuts';

const conn = connection();
if (conn) {
  if (conn.effectiveType === 'slow-2g' || conn.effectiveType === '2g') {
    // Red lenta: cargar imágenes de baja calidad
    loadLowQualityImages();
  } else {
    // Red rápida: cargar imágenes de alta calidad
    loadHighQualityImages();
  }
}
```

## Notas

1. **Compatibilidad**: hace falta que el navegador admita la Network Information API; algunos no lo hacen.
2. **Entorno de servidor**: en entornos de servidor (sin objeto `window`) devuelve `undefined`.
3. **Propiedades del objeto de conexión**:
   - `effectiveType`: tipo de red ('slow-2g', '2g', '3g', '4g')
   - `downlink`: velocidad de bajada (Mbps)
   - `rtt`: tiempo de ida y vuelta (milisegundos)
   - `saveData`: si está activo el ahorro de datos
4. **Cuándo usarlo**: es habitual para adaptar la carga de contenido al estado de la red y para optimizar el rendimiento.
