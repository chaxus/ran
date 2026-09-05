# imageRequest

Mide la latencia de red (ping) con una petición de imagen.

## API

### imageRequest

#### Devuelve

| Argumento         | Descripción                                                           | Tipo      |
| ----------------- | --------------------------------------------------------------------- | --------- |
| `Promise<number>` | Promesa que se resuelve con la duración de la petición (milisegundos) | `Promise` |

#### Parámetros

| Parámetro | Descripción                                                   | Tipo     | Por defecto |
| --------- | ------------------------------------------------------------- | -------- | ----------- |
| `url`     | URL de la imagen (opcional; por defecto el favicon de GitHub) | `string` | Opcional    |

## Ejemplo

### Uso básico

```js
import { imageRequest } from 'ranuts';

const latency = await imageRequest();
console.log('Latencia de red:', latency, 'ms');
```

### Indicar la URL de prueba

```js
import { imageRequest } from 'ranuts';

const latency = await imageRequest('https://example.com/test-image.jpg');
console.log('Latencia:', latency, 'ms');
```

### Prueba de red

```js
import { imageRequest } from 'ranuts';

async function testNetwork() {
  try {
    const latency = await imageRequest();
    if (latency < 100) {
      console.log('Red buena');
    } else if (latency < 300) {
      console.log('Red normal');
    } else {
      console.log('Red lenta');
    }
  } catch (error) {
    console.error('Falló la prueba:', error);
  }
}
```

## Notas

1. **URL por defecto**: si no se pasa una URL, usa el favicon de GitHub (unos 2,2 KB).
2. **Cómo mide**: cronometra la carga de la imagen, desde que arranca la petición hasta que la imagen termina de cargarse.
3. **Errores**: si la imagen no carga, la promesa se rechaza.
4. **Cuándo usarlo**: es habitual para estimar la calidad de la red, en monitorización de rendimiento y similares.
