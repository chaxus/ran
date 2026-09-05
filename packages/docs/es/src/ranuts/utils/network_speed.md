# networkSpeed

Mide el ping y la fluctuación de la red actual con varias peticiones.

## API

### networkSpeed

#### Devuelve

| Argumento             | Descripción                                               | Tipo      |
| --------------------- | --------------------------------------------------------- | --------- |
| `Promise<ReturnType>` | Promesa que se resuelve con los resultados de la medición | `Promise` |

#### ReturnType

| Propiedad | Descripción                          | Tipo     |
| --------- | ------------------------------------ | -------- |
| `ping`    | Ping medio (milisegundos)            | `number` |
| `jitter`  | Fluctuación de la red (milisegundos) | `number` |

#### Parámetros

| Parámetro | Descripción               | Tipo      | Por defecto |
| --------- | ------------------------- | --------- | ----------- |
| `options` | Opciones de configuración | `Options` | Obligatorio |

#### Opciones

| Parámetro  | Descripción                         | Tipo     | Por defecto |
| ---------- | ----------------------------------- | -------- | ----------- |
| `url`      | URL de la imagen con la que se mide | `string` | Obligatorio |
| `duration` | Intervalo entre peticiones (ms)     | `number` | `3000`      |
| `count`    | Número de mediciones                | `number` | `5`         |

## Ejemplo

### Uso básico

```js
import { networkSpeed } from 'ranuts';

const result = await networkSpeed({
  url: 'https://example.com/test.jpg',
  count: 5,
  duration: 3000,
});

console.log('Latencia media:', result.ping, 'ms');
console.log('Fluctuación de la red:', result.jitter, 'ms');
```

### Valorar la calidad de la red

```js
import { networkSpeed } from 'ranuts';

async function assessNetwork() {
  const { ping, jitter } = await networkSpeed({ count: 10, url: 'https://example.com/test.jpg' });

  if (ping < 50 && jitter < 20) {
    console.log('Calidad de red excelente');
  } else if (ping < 100 && jitter < 50) {
    console.log('Calidad de red buena');
  } else {
    console.log('Calidad de red normal');
  }
}
```

### Cambiar los parámetros de la medición

```js
import { networkSpeed } from 'ranuts';

// Diez mediciones, con dos segundos entre cada una
const result = await networkSpeed({
  url: 'https://example.com/ping.jpg',
  count: 10,
  duration: 2000,
});
```

## Notas

1. **Fluctuación**: describe lo inestable que es la red; es la diferencia entre el valor máximo y el mínimo de varias mediciones, y cuanto menor sea, más estable es la red.
2. **Cómo mide**: lanza varias peticiones de imagen y calcula la latencia media y la fluctuación.
3. **Valores por defecto**: cinco mediciones con tres segundos entre cada una.
4. **Cuándo usarlo**: es habitual para estimar la calidad de la red, en monitorización de rendimiento y para afinar la experiencia de uso.
