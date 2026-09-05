# createDocumentFragment

Crea un `DocumentFragment` y le añade varios elementos hijos.

## API

### createDocumentFragment

#### Devuelve

| Argumento                       | Descripción                  | Tipo                            |
| ------------------------------- | ---------------------------- | ------------------------------- |
| `DocumentFragment \| undefined` | El objeto `DocumentFragment` | `DocumentFragment \| undefined` |

#### Parámetros

| Parámetro | Descripción                      | Tipo        | Por defecto |
| --------- | -------------------------------- | ----------- | ----------- |
| `list`    | Array de elementos que se añaden | `Element[]` | Obligatorio |

## Ejemplo

### Uso básico

```js
import { createDocumentFragment } from 'ranuts';

const div1 = document.createElement('div');
const div2 = document.createElement('div');
const fragment = createDocumentFragment([div1, div2]);

// Se añade al DOM de una sola vez
document.body.appendChild(fragment);
```

### Añadir elementos en bloque

```js
import { createDocumentFragment } from 'ranuts';

const elements = Array.from({ length: 100 }, () => {
  const div = document.createElement('div');
  div.textContent = 'Elemento';
  return div;
});

const fragment = createDocumentFragment(elements);
document.getElementById('container').appendChild(fragment);
```

### Seguridad en el servidor

```js
import { createDocumentFragment } from 'ranuts';

// En un entorno de servidor devuelve undefined
const fragment = createDocumentFragment([element]);
console.log(fragment); // undefined (entorno de servidor)
```

## Notas

1. **Mejor rendimiento**: con un `DocumentFragment` se evitan muchas operaciones sobre el DOM, y todo va más rápido.
2. **Seguro en el servidor**: en entornos de servidor (sin objeto `document`) devuelve `undefined` y no lanza errores.
3. **De una sola vez**: al añadir el fragmento al DOM, sus hijos pasan al elemento destino y el fragmento no se conserva.
4. **Cuándo usarlo**: es habitual para añadir elementos en bloque, reducir reflujos y repintados, y ganar velocidad.
