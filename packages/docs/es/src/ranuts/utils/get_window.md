# getWindow

Obtiene el tamaño de la ventana visible, sea cual sea el navegador.

## API

### getWindow

#### Devuelve

| Argumento     | Descripción                           | Tipo          |
| ------------- | ------------------------------------- | ------------- |
| `ClientRatio` | El objeto con el tamaño de la ventana | `ClientRatio` |

#### ClientRatio

| Propiedad | Descripción                   | Tipo     |
| --------- | ----------------------------- | -------- |
| `width`   | Ancho de la ventana (píxeles) | `number` |
| `height`  | Alto de la ventana (píxeles)  | `number` |

#### Parámetros

Sin parámetros

## Ejemplo

### Uso básico

```js
import { getWindow } from 'ranuts';

const windowSize = getWindow();
console.log('Ancho de la ventana:', windowSize.width);
console.log('Alto de la ventana:', windowSize.height);
```

### Maquetación adaptable

```js
import { getWindow } from 'ranuts';

function handleResize() {
  const { width, height } = getWindow();
  if (width < 768) {
    // Diseño para móvil
  } else {
    // Diseño para escritorio
  }
}

window.addEventListener('resize', handleResize);
```

### Seguridad en el servidor

```js
import { getWindow } from 'ranuts';

// En un entorno de servidor no lanza error: devuelve { width: 0, height: 0 }
const size = getWindow();
console.log(size); // { width: 0, height: 0 }
```

### Calcular la proporción

```js
import { getWindow } from 'ranuts';

const { width, height } = getWindow();
const aspectRatio = width / height;
console.log('Proporción:', aspectRatio);
```

## Notas

1. **Compatibilidad**: usa `window.innerWidth` y `window.innerHeight`, presentes en todos los navegadores modernos.

2. **Seguro en el servidor**: en entornos de servidor (sin objeto `window`) devuelve `{ width: 0, height: 0 }` y no lanza errores.

3. **Instantáneo**: devuelve el tamaño en el momento de la llamada; si la ventana cambia, hay que volver a llamar.

4. **Cuándo usarlo**: es habitual en diseños adaptables, en media queries y para vigilar el tamaño de la ventana.
