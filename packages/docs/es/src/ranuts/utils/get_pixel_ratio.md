# getPixelRatio

Obtiene la relación de resolución del contexto de un canvas, para tratar pantallas de alta densidad.

## API

### getPixelRatio

#### Devuelve

| Argumento | Descripción            | Tipo     |
| --------- | ---------------------- | -------- |
| `number`  | La relación de píxeles | `number` |

#### Parámetros

| Parámetro | Descripción                      | Tipo                       | Por defecto |
| --------- | -------------------------------- | -------------------------- | ----------- |
| `context` | Contexto de dibujo 2D del canvas | `CanvasRenderingContext2D` | Obligatorio |

## Ejemplo

### Uso básico

```js
import { getPixelRatio } from 'ranuts';

const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');
const ratio = getPixelRatio(ctx);
console.log('Relación de píxeles:', ratio);
```

### Adaptarse a pantallas de alta densidad

```js
import { getPixelRatio } from 'ranuts';

const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');
const ratio = getPixelRatio(ctx);

// Ajustar el tamaño del canvas a la relación
canvas.width = canvas.clientWidth * ratio;
canvas.height = canvas.clientHeight * ratio;

// Escalar el contexto para conservar el tamaño de dibujo
ctx.scale(ratio, ratio);
```

### Dibujar con nitidez

```js
import { getPixelRatio } from 'ranuts';

function drawHighDPI(canvas) {
  const ctx = canvas.getContext('2d');
  const ratio = getPixelRatio(ctx);

  // Fijar el tamaño real
  canvas.width = canvas.clientWidth * ratio;
  canvas.height = canvas.clientHeight * ratio;

  // Escalar el contexto
  ctx.scale(ratio, ratio);

  // Dibujar el contenido (en píxeles lógicos)
  ctx.fillRect(10, 10, 100, 100);
}
```

## Notas

1. **Compatibilidad**: contempla la propiedad `backingStorePixelRatio` de los distintos navegadores.
2. **Alta densidad**: trata solo las pantallas de alta densidad (Retina), de modo que el dibujo salga nítido.
3. **Cómo lo calcula**: devuelve `devicePixelRatio / backingStorePixelRatio`.
4. **Cuándo usarlo**: es habitual al dibujar en canvas, en librerías de gráficos y en desarrollo de juegos, donde la nitidez importa.
