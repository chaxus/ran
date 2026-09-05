# isClient

Determina si el entorno actual es de cliente (navegador).

## API

### isClient

#### Devuelve

| Argumento | Descripción                 | Tipo      |
| --------- | --------------------------- | --------- |
| `boolean` | Si es un entorno de cliente | `boolean` |

#### Parámetros

Sin parámetros

## Ejemplo

### Uso básico

```js
import { isClient } from 'ranuts';

if (isClient) {
  console.log('Ahora mismo en un entorno de navegador');
  // Se pueden usar API del navegador como window o document
  window.localStorage.setItem('key', 'value');
} else {
  console.log('Ahora mismo en un entorno de servidor');
}
```

### Ejecución condicional

```js
import { isClient } from 'ranuts';

// Ejecutar solo en el cliente
if (isClient) {
  document.addEventListener('click', handleClick);
}
```

### Seguridad con renderizado en el servidor

```js
import { isClient } from 'ranuts';

function getWindowSize() {
  if (isClient) {
    return {
      width: window.innerWidth,
      height: window.innerHeight,
    };
  }
  return { width: 0, height: 0 };
}
```

## Notas

1. **Cómo lo detecta**: comprueba `typeof window !== 'undefined'`.
2. **Es una constante**: `isClient` es una constante, no una función; al usarla no hacen falta paréntesis.
3. **Cuándo usarlo**: es habitual para distinguir el cliente del servidor y evitar errores al tocar API del navegador desde el servidor.
