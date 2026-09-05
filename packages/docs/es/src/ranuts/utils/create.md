# create

Función de ayuda para crear elementos del DOM, tanto HTML como SVG.

## API

### create

#### Devuelve

| Argumento     | Descripción                | Tipo          |
| ------------- | -------------------------- | ------------- |
| `HTMLElement` | El elemento del DOM creado | `HTMLElement` |

#### Parámetros

| Parámetro | Descripción                     | Tipo                     | Por defecto |
| --------- | ------------------------------- | ------------------------ | ----------- |
| `tagName` | Nombre de la etiqueta           | `string`                 | Obligatorio |
| `options` | Opciones de creación (opcional) | `ElementCreationOptions` | Opcional    |

## Ejemplo

### Uso básico

```js
import { create } from 'ranuts';

const div = create('div');
div.textContent = 'Hello World';
document.body.appendChild(div);
```

### Crear un elemento SVG

```js
import { create } from 'ranuts';

const svg = create('svg');
svg.setAttribute('width', '100');
svg.setAttribute('height', '100');

const circle = create('circle');
circle.setAttribute('cx', '50');
circle.setAttribute('cy', '50');
circle.setAttribute('r', '40');
svg.appendChild(circle);
```

### Usar las opciones de creación

```js
import { create } from 'ranuts';

// Crear un elemento personalizado
const customElement = create('my-custom-element', { is: 'my-element' });
```

## Notas

1. **Reconocimiento automático**: reconoce solo las etiquetas SVG y las crea con el espacio de nombres correcto.
2. **Elementos HTML**: los elementos HTML normales se crean con `document.createElement`.
3. **Elementos SVG**: los elementos SVG se crean con `document.createElementNS`.
4. **Cuándo usarlo**: es habitual cuando hace falta crear elementos SVG, porque acorta el trámite.
