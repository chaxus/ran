# getPerformance

Recoge las métricas de rendimiento de la página: resolución de DNS, conexión TCP, carga de recursos y demás indicadores.

## API

### getPerformance

#### Devuelve

| Argumento | Descripción | Tipo |
| ------------------------ | -------------------------- | ------------------------ |
| `BasicType \| undefined` | El objeto con las métricas de rendimiento | `BasicType \| undefined` |

#### BasicType

| Propiedad | Descripción | Tipo |
| -------------- | ------------------------------------------------------- | --------------------- |
| `dnsSearch` | Tiempo de resolución de DNS (ms) | `number` |
| `tcpConnect` | Tiempo de conexión TCP (ms) | `number` |
| `sslConnect` | Tiempo de la conexión segura SSL (ms) | `number` |
| `request` | TTFB: tiempo de la petición de red (ms) | `number` |
| `response` | Tiempo de transferencia de los datos (ms) | `number` |
| `parseDomTree` | Tiempo de análisis del DOM (ms) | `number` |
| `resource` | Tiempo de carga de los recursos (ms) | `number` |
| `domReady` | Tiempo hasta DOM Ready (ms) | `number` |
| `httpHead` | Tamaño de las cabeceras HTTP (bytes) | `number` |
| `interactive` | Tiempo hasta poder interactuar (ms) | `number` |
| `complete` | Tiempo hasta la carga completa de la página (ms) | `number` |
| `redirect` | Número de redirecciones | `number` |
| `redirectTime` | Tiempo de las redirecciones (ms) | `number` |
| `duration` | Tiempo total de las peticiones de recursos (ms) | `number` |
| `fp` | Tiempo hasta el primer pintado (pantalla en blanco, ms) | `number \| undefined` |
| `fcp` | Tiempo hasta el primer pintado con contenido (fin de la primera pantalla, ms) | `number \| undefined` |

#### Parámetros

Sin parámetros

## Ejemplo

### Uso básico

```js
import { getPerformance } from 'ranuts';

const perf = getPerformance();
if (perf) {
  console.log('Resolución de DNS:', perf.dnsSearch, 'ms');
  console.log('Conexión TCP:', perf.tcpConnect, 'ms');
  console.log('Primera pantalla:', perf.fcp, 'ms');
}
```

### Medición del rendimiento

```js
import { getPerformance } from 'ranuts';

window.addEventListener('load', () => {
  const perf = getPerformance();
  if (perf) {
    // Enviar los datos de rendimiento al servidor
    sendToServer({
      dns: perf.dnsSearch,
      tcp: perf.tcpConnect,
      request: perf.request,
      fcp: perf.fcp,
    });
  }
});
```

### Análisis del rendimiento

```js
import { getPerformance } from 'ranuts';

function analyzePerformance() {
  const perf = getPerformance();
  if (!perf) return;

  console.log('=== Análisis del rendimiento ===');
  console.log('Resolución de DNS:', perf.dnsSearch, 'ms');
  console.log('Conexión TCP:', perf.tcpConnect, 'ms');
  console.log('Apretón de manos SSL:', perf.sslConnect, 'ms');
  console.log('Respuesta a la petición:', perf.request, 'ms');
  console.log('Transferencia de datos:', perf.response, 'ms');
  console.log('Análisis del DOM:', perf.parseDomTree, 'ms');
  console.log('Carga de recursos:', perf.resource, 'ms');
  console.log('Primer pintado:', perf.fp, 'ms');
  console.log('Primer pintado con contenido:', perf.fcp, 'ms');
}
```

## Notas

1. **Compatibilidad**: hace falta que el navegador admita la Performance API, cosa que hacen todos los modernos.

2. **En el servidor**: devuelve `undefined` en entornos de servidor (sin objeto `window`).

3. **Cuándo llamarlo**: conviene hacerlo después de que la página termine de cargar (evento `load`) para tener los datos completos.

4. **Unidades**: todos los tiempos van en milisegundos y los tamaños en bytes.

5. **Cuándo usarlo**: es habitual para vigilar, analizar y afinar el rendimiento.
