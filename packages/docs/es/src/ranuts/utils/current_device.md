# currentDevice

Obtiene el tipo del dispositivo actual.

## API

### currentDevice

#### Devuelve

| Argumento       | Descripción                       | Tipo                                      |
| --------------- | --------------------------------- | ----------------------------------------- |
| `CurrentDevice` | Cadena con el tipo de dispositivo | `'ipad' \| 'android' \| 'iphone' \| 'pc'` |

#### Parámetros

Sin parámetros

## Ejemplo

### Uso básico

```js
import { currentDevice } from 'ranuts';

const device = currentDevice();
console.log(`Dispositivo actual: ${device}`);
// Puede imprimir: 'ipad', 'android', 'iphone' o 'pc'
```

### Ejecutar lógica distinta según el dispositivo

```js
import { currentDevice } from 'ranuts';

const device = currentDevice();
switch (device) {
  case 'iphone':
    // Lógica propia del iPhone
    break;
  case 'android':
    // Lógica propia de Android
    break;
  case 'ipad':
    // Lógica propia del iPad
    break;
  case 'pc':
    // Lógica propia del PC
    break;
}
```

### Estilos propios de cada dispositivo

```js
import { currentDevice } from 'ranuts';

const device = currentDevice();
document.body.classList.add(`device-${device}`);
```

## Notas

1. **Orden de detección**: comprueba en este orden:
   - iPad/iPod
   - Android
   - iPhone
   - El resto (por defecto devuelve 'pc')

2. **Renderizado en el servidor**: devuelve `'pc'` en entornos de servidor (no hay objeto `window`).

3. **Cómo lo detecta**: a partir de la cadena del User Agent.

4. **Valor devuelto**: es un tipo enumerado; solo puede ser `'ipad'`, `'android'`, `'iphone'` o `'pc'`.
