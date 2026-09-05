# getFrame

Calcula la tasa de fotogramas por milisegundo; para tenerla por segundo hay que multiplicar por 1000.

## API

### getFrame

#### Devuelve

| Argumento         | Descripción                                                         | Tipo      |
| ----------------- | ------------------------------------------------------------------- | --------- |
| `Promise<number>` | Promesa que se resuelve con la tasa de fotogramas (por milisegundo) | `Promise` |

#### Parámetros

| Parámetro | Descripción                      | Tipo     | Por defecto |
| --------- | -------------------------------- | -------- | ----------- |
| `n`       | Número de fotogramas muestreados | `number` | `10`        |

## Ejemplo

### Uso básico

```js
import { getFrame } from 'ranuts';

const fps = await getFrame();
console.log('Fotogramas por ms:', fps);
console.log('Fotogramas por segundo:', fps * 1000);
```

### Cambiar el número de muestras

```js
import { getFrame } from 'ranuts';

// Muestrear 20 fotogramas para sacar la media
const fps = await getFrame(20);
console.log('FPS:', fps * 1000);
```

### Medición del rendimiento

```js
import { getFrame } from 'ranuts';

async function monitorPerformance() {
  const fps = await getFrame(30);
  const fpsPerSecond = fps * 1000;

  if (fpsPerSecond < 30) {
    console.warn('Tasa de fotogramas baja:', fpsPerSecond);
  } else {
    console.log('Tasa de fotogramas normal:', fpsPerSecond);
  }
}
```

### Comprobar el rendimiento de una animación

```js
import { getFrame } from 'ranuts';

async function checkAnimationPerformance() {
  const fps = await getFrame(60);
  const fpsPerSecond = fps * 1000;
  console.log(`Fotogramas de la animación: ${fpsPerSecond.toFixed(2)} FPS`);
}
```

## Notas

1. **Unidades**: devuelve fotogramas por milisegundo; multiplica por 1000 para tenerlos por segundo (FPS).
2. **Cómo muestrea**: usa `requestAnimationFrame` y promedia el intervalo de varios fotogramas.
3. **Es asíncrono**: devuelve una promesa, así que hay que usar `await` o `.then()`.
4. **Cuándo usarlo**: es habitual para vigilar el rendimiento, comprobar animaciones y medir los fotogramas de un juego.
