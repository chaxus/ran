# isMobile

Determina si el dispositivo actual es móvil.

## API

### isMobile

#### Devuelve

| Argumento | Descripción                | Tipo      |
| --------- | -------------------------- | --------- |
| `boolean` | Si es un dispositivo móvil | `boolean` |

#### Parámetros

Sin parámetros

## Ejemplo

### Uso básico

```js
import { isMobile } from 'ranuts';

if (isMobile()) {
  console.log('El dispositivo actual es móvil');
} else {
  console.log('El dispositivo actual es de escritorio');
}
```

### Maquetación adaptable

```js
import { isMobile } from 'ranuts';

const layout = isMobile() ? 'mobile' : 'desktop';
console.log(`Usando la maquetación ${layout}`);
```

### Carga condicional

```js
import { isMobile } from 'ranuts';

if (isMobile()) {
  // Carga el código propio de móvil
  import('./mobile-module');
} else {
  // Carga el código de escritorio
  import('./desktop-module');
}
```

## Notas

1. **Reglas de detección**: reconoce estos dispositivos a partir del User Agent:
   - Android
   - webOS
   - iPhone
   - iPod
   - iPad
   - BlackBerry

2. **Renderizado en el servidor**: devuelve `false` en entornos de servidor (no hay objeto `window`).

3. **Exactitud**: se basa en el User Agent, así que un UA modificado puede engañarlo.

4. **El iPad**: según el User Agent, en algunos casos el iPad se identifica como dispositivo móvil.
