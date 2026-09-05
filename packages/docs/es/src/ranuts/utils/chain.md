# Chain

Clase para manipular el DOM encadenando llamadas: crear elementos, poner atributos, escuchar eventos y demás.

## API

### Chain

#### Constructor

```typescript
new Chain(tagName: string, options?: ElementCreationOptions)
```

#### Métodos principales

| Método             | Descripción                             | Valor devuelto |
| ------------------ | --------------------------------------- | -------------- |
| `setAttribute`     | Pone un atributo en el elemento         | `Chain`        |
| `removeAttribute`  | Quita un atributo del elemento          | `Chain`        |
| `append`           | Añade un elemento hijo                  | `Chain`        |
| `remove`           | Quita un elemento hijo                  | `Chain`        |
| `setTextContent`   | Pone el contenido de texto              | `Chain`        |
| `setStyle`         | Pone un estilo                          | `Chain`        |
| `addChild`         | Añade un hijo (también acepta un array) | `Chain`        |
| `listen`           | Registra un escuchador de eventos       | `Chain`        |
| `clearListener`    | Quita un escuchador de eventos          | `Chain`        |
| `clearAllListener` | Quita todos los escuchadores            | `Chain`        |

#### Propiedades

| Propiedad | Descripción         | Tipo          |
| --------- | ------------------- | ------------- |
| `element` | El elemento del DOM | `HTMLElement` |

## Ejemplo

### Uso básico

```js
import { Chain } from 'ranuts';

const div = new Chain('div')
  .setAttribute('id', 'myDiv')
  .setAttribute('class', 'container')
  .setTextContent('Hello World')
  .setStyle('color', 'red');

document.body.appendChild(div.element);
```

### Encadenamiento

```js
import { Chain } from 'ranuts';

const button = new Chain('button')
  .setAttribute('type', 'button')
  .setTextContent('Púlsame')
  .setStyle('padding', '10px')
  .setStyle('background', 'blue')
  .listen('click', () => {
    console.log('Botón pulsado');
  });

document.body.appendChild(button.element);
```

### Añadir elementos hijos

```js
import { Chain } from 'ranuts';

const container = new Chain('div')
  .addChild(new Chain('h1').setTextContent('Título'))
  .addChild(new Chain('p').setTextContent('Contenido'));

document.body.appendChild(container.element);
```

### Añadir varios hijos de una vez

```js
import { Chain } from 'ranuts';

const list = new Chain('ul').addChild([
  new Chain('li').setTextContent('Elemento 1'),
  new Chain('li').setTextContent('Elemento 2'),
  new Chain('li').setTextContent('Elemento 3'),
]);

document.body.appendChild(list.element);
```

### Elementos SVG

```js
import { Chain } from 'ranuts';

const svg = new Chain('svg').setAttribute('width', '100').setAttribute('height', '100');

const circle = new Chain('circle').setAttribute('cx', '50').setAttribute('cy', '50').setAttribute('r', '40');

svg.addChild(circle);
```

## Notas

1. **Encadenamiento**: todos los métodos devuelven la instancia de `Chain`, así que se pueden encadenar.
2. **Con SVG**: reconoce solo las etiquetas SVG y las crea con el espacio de nombres correcto.
3. **Gestión de eventos**: por dentro guarda la correspondencia de escuchadores, lo que facilita manejarlos y quitarlos.
4. **Cuándo usarlo**: es habitual para construir estructuras del DOM sobre la marcha y montar componentes de interfaz.
