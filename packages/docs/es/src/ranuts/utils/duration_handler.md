# durationHandler

Crea una función de ejecución diferida que llama a la función indicada pasado un tiempo.

## API

### durationHandler

#### Devuelve

| Argumento  | Descripción                                         | Tipo                               |
| ---------- | --------------------------------------------------- | ---------------------------------- |
| `Function` | Devuelve una función que recibe el tiempo de espera | `(duration: number) => Promise<U>` |

#### Parámetros

| Parámetro   | Descripción                  | Tipo       | Por defecto |
| ----------- | ---------------------------- | ---------- | ----------- |
| `handler`   | Función que se va a ejecutar | `Function` | Obligatorio |
| `...params` | Argumentos que se le pasan   | `T[]`      | Obligatorio |

## Ejemplo

### Uso básico

```js
import { durationHandler } from 'ranuts';

const delayedFn = durationHandler((name) => {
  console.log('Hola', name);
  return 'done';
}, 'World');

// Se ejecuta al cabo de un segundo
const result = await delayedFn(1000);
console.log(result); // 'done'
```

### Diferir una petición a la API

```js
import { durationHandler } from 'ranuts';

const delayedRequest = durationHandler(async (url) => {
  const response = await fetch(url);
  return response.json();
}, 'https://api.example.com/data');

// La petición se lanza a los dos segundos
const data = await delayedRequest(2000);
console.log(data);
```

### Combinado con networkSpeed

```js
import { durationHandler, imageRequest } from 'ranuts';

// Crear una petición de imagen diferida
const delayedImageRequest = durationHandler(imageRequest, 'https://example.com/test.jpg');

// Se ejecuta a los tres segundos
const latency = await delayedImageRequest(3000);
console.log('Latencia:', latency, 'ms');
```

## Notas

1. **Función currificada**: devuelve una función que recibe el tiempo de espera, lo que encaja con un estilo funcional.
2. **Funciona con async**: admite funciones asíncronas y espera a que terminen.
3. **Errores**: si la función falla, la promesa se rechaza.
4. **Cuándo usarlo**: es habitual para ejecución diferida, tareas programadas y pruebas de red.
