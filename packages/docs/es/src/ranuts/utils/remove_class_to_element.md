# removeClassToElement

Quita un nombre de clase CSS de un elemento del DOM.

## API

### removeClassToElement

#### Devuelve

Sin valor de retorno (`void`)

#### Parámetros

| Parámetro     | Descripción                  | Tipo      | Por defecto |
| ------------- | ---------------------------- | --------- | ----------- |
| `element`     | Elemento del DOM             | `Element` | Obligatorio |
| `removeClass` | Nombre de clase que se quita | `string`  | Obligatorio |

## Ejemplo

### Uso básico

```js
import { removeClassToElement } from 'ranuts';

const element = document.getElementById('myElement');
removeClassToElement(element, 'active');
// la clase 'active' ya no está en element
```

### Quitarla de forma condicional

```js
import { removeClassToElement } from 'ranuts';

const element = document.querySelector('.button');
if (shouldRemove) {
  removeClassToElement(element, 'highlighted');
}
```

### Seguridad en el servidor

```js
import { removeClassToElement } from 'ranuts';

// En un entorno de servidor no lanza error: falla en silencio
removeClassToElement(element, 'class-name'); // En el servidor: no hace nada
```

## Notas

1. **Comprobación de existencia**: solo quita la clase si el elemento la tiene.
2. **Seguridad en el servidor**: en entornos de servidor (no hay objeto `document`) actúa en silencio, sin lanzar errores.
3. **Usa classList**: emplea la API moderna `classList.remove()`, más segura que manipular `className` directamente.
