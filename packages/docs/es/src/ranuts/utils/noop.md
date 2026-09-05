# noop

Función vacía que no hace nada. Se usa como callback por defecto o como marcador de posición.

## API

### noop

#### Devuelve

| Argumento | Descripción          | Tipo   |
| --------- | -------------------- | ------ |
| `void`    | Sin valor de retorno | `void` |

#### Parámetros

Sin parámetros

## Ejemplo

### Uso básico

```js
import { noop } from 'ranuts';

// Como callback por defecto
const callback = noop;
callback(); // No hace nada
```

### Como valor por defecto de un argumento

```js
import { noop } from 'ranuts';

function processData(data, onSuccess = noop, onError = noop) {
  try {
    // Procesar los datos
    onSuccess(data);
  } catch (error) {
    onError(error);
  }
}

// Solo se pasa el callback de éxito
processData({ id: 1 }, (data) => {
  console.log('Éxito:', data);
});

// No se pasa ningún callback
processData({ id: 2 }); // No lanza ningún error
```

### Callback condicional

```js
import { noop } from 'ranuts';

const handleClick = isEnabled
  ? () => {
      console.log('Ejecutar la acción');
    }
  : noop;

button.addEventListener('click', handleClick);
```

### Hueco para un escuchador de eventos

```js
import { noop } from 'ranuts';

const unsubscribe = someService.subscribe(noop); // De momento no se atienden los eventos
```

## Notas

1. **Coste**: llamar a una función vacía cuesta casi nada, así que va bien como valor por defecto.
2. **Tipado**: en TypeScript `noop` tiene el tipo `() => void`, y encaja sin riesgo allí donde se espera una función.
3. **Legibilidad**: `noop` expresa la intención de «no hacer nada» con más claridad que `() => {}`.
