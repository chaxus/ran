# addClassToElement

Añade un nombre de clase CSS a un elemento del DOM.

## API

### addClassToElement

#### Devuelve

Sin valor de retorno (`void`)

#### Parámetros

| Parámetro  | Descripción                  | Tipo      | Por defecto |
| ---------- | ---------------------------- | --------- | ----------- |
| `element`  | Elemento del DOM             | `Element` | Obligatorio |
| `addClass` | Nombre de clase que se añade | `string`  | Obligatorio |

## Ejemplo

### Uso básico

```js
import { addClassToElement } from 'ranuts';

const element = document.getElementById('myElement');
addClassToElement(element, 'active');
// ahora element tiene la clase 'active'
```

### Evitar añadirla dos veces

```js
import { addClassToElement } from 'ranuts';

const element = document.querySelector('.button');
addClassToElement(element, 'highlighted');
addClassToElement(element, 'highlighted'); // No la añade por duplicado
```

### Seguridad en el servidor

```js
import { addClassToElement } from 'ranuts';

// En un entorno de servidor no lanza error: falla en silencio
addClassToElement(element, 'class-name'); // En el servidor: no hace nada
```

## Notas

1. **Comprobación de duplicados**: si el elemento ya tiene esa clase, no la vuelve a añadir.
2. **Seguridad en el servidor**: en entornos de servidor (no hay objeto `document`) actúa en silencio, sin lanzar errores.
3. **Usa classList**: emplea la API moderna `classList.add()`, más segura que manipular `className` directamente.
