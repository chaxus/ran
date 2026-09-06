# DOM virtual (vnode)

Un DOM virtual ligero al estilo de Snabbdom. Representa tu interfaz con objetos JavaScript llanos (los `VNode`), compara un árbol viejo con uno nuevo y aplica al DOM real solo las diferencias.

- `init()` arma el reconciliador y devuelve una función `patch`. Los módulos que vienen incluidos (class / props / attrs / style / events) se registran solos.
- `patch(oldVnode, newVnode)` monta un árbol (cuando `oldVnode` es un elemento real del DOM) o compara dos árboles de vnodes y actualiza el DOM sobre la marcha.
- `h(sel, dataOrChildren?, children?)` es la ayuda de hyperscript que construye los `VNode`.

## Importar

```js
import { init, h, classModule, propsModule, styleModule, eventListenersModule } from 'ranuts/vnode';
```

> Nota: en esta implementación `init()` **no recibe argumentos**: el juego de módulos es fijo y se registra por dentro, así que no hace falta pasarle a `init` cada `*Module` por separado. Se exportan para consultarlos e inspeccionarlos.

## Ejemplo

### Primeros pasos

```js
import { init, h } from 'ranuts/vnode';

// init() devuelve una función `patch`.
// Los módulos incluidos (class, props, attrs, style, events) se registran solos.
const patch = init();

const container = document.getElementById('app');

// Construye un árbol de vnodes
let vnode = h('div#app.container', { style: { color: 'red' } }, [
  h('h1', 'Hello vnode'),
  h('button', { on: { click: () => console.log('clicked') } }, 'Click me'),
]);

// Primer dibujado: pasa un elemento real del DOM como vnode viejo para montar dentro de él
patch(container, vnode);

// Más tarde: construye el árbol actualizado y aplica sobre él el vnode anterior.
// Al DOM solo llegan las diferencias (texto, estilo, escuchadores).
const newVnode = h('div#app.container', { style: { color: 'green' } }, [
  h('h1', 'Hello again'),
  h('button', { on: { click: () => console.log('clicked') } }, 'Updated'),
]);

patch(vnode, newVnode);
vnode = newVnode; // guarda el último árbol para el siguiente patch
```

### Construir nodos con `h`

```js
// solo la etiqueta
h('div');

// etiqueta + data
h('div', { class: { active: true } });

// etiqueta + un único hijo de texto
h('span', 'hello');

// etiqueta + array de hijos
h('ul', [h('li', 'one'), h('li', 'two')]);

// etiqueta + data + hijos
h('a', { attrs: { href: '/home' } }, 'Home');

// Los selectores al estilo CSS fijan el id y las clases
h('div#main.card.large', 'content'); // <div id="main" class="card large">content</div>

// El espacio de nombres de SVG se aplica solo cuando el selector empieza por "svg"
h('svg', { attrs: { width: 100, height: 100 } }, [h('circle', { attrs: { cx: 50, cy: 50, r: 40 } })]);
```

## API

### `init()`

Crea el reconciliador y devuelve una función `patch`. Los módulos incluidos se registran por dentro; no recibe argumentos.

#### Devuelve

| Valor   | Descripción                                               | Tipo                                                  |
| ------- | --------------------------------------------------------- | ----------------------------------------------------- |
| `patch` | Monta árboles de vnodes contra el DOM real, o los compara | `(oldVnode: VNode \| Element, vnode: VNode) => VNode` |

### `patch(oldVnode, vnode)`

La devuelve `init()`. En la primera llamada, pasa un `Element` real del DOM como `oldVnode` para montar el árbol dentro de él. En las siguientes, pasa el `VNode` anterior para comparar y actualizar sobre la marcha. Devuelve el nuevo `VNode`, que guardas como valor «viejo» para la llamada siguiente.

#### Parámetros

| Parámetro  | Descripción                                                   | Tipo               |
| ---------- | ------------------------------------------------------------- | ------------------ |
| `oldVnode` | El vnode anterior, o un elemento del DOM en el primer montaje | `VNode \| Element` |
| `vnode`    | El nuevo árbol de vnodes que se va a dibujar                  | `VNode`            |

### `h(sel, dataOrChildren?, children?)`

Ayuda de hyperscript que construye un `VNode`. Está sobrecargada:

| Firma                    | Descripción                                                   |
| ------------------------ | ------------------------------------------------------------- |
| `h(sel)`                 | Elemento a partir de un selector, y nada más                  |
| `h(sel, data)`           | Elemento con `VNodeData` (`data` puede ser `null`)            |
| `h(sel, children)`       | Elemento con hijos: un texto o número, un `VNode`, o un array |
| `h(sel, data, children)` | Elemento con datos e hijos                                    |

#### Parámetros

| Parámetro  | Descripción                                                                                                                              | Tipo                |
| ---------- | ---------------------------------------------------------------------------------------------------------------------------------------- | ------------------- |
| `sel`      | Selector al estilo CSS: `tag`, `tag#id`, `tag.class`, o combinados (`div#id.a.b`). Con `svg…` se añade solo el espacio de nombres de SVG | `string`            |
| `data`     | Datos del nodo: class / props / attrs / style / escuchadores / key / hook. Puede ser `null`                                              | `VNodeData \| null` |
| `children` | Un texto o número (que pasa a ser un nodo de texto), un solo `VNode`, o un array de ellos                                                | `VNodeChildren`     |

#### Campos de `VNodeData`

| Campo   | Descripción                                                                                     | Tipo                                          | Lo aplica                       |
| ------- | ----------------------------------------------------------------------------------------------- | --------------------------------------------- | ------------------------------- |
| `props` | Propiedades del DOM asignadas con `elm[key] = value`                                            | `Record<string, any>`                         | `propsModule`                   |
| `attrs` | Atributos HTML puestos con `setAttribute` (`true` y `false` ponen y quitan el atributo)         | `Record<string, string \| number \| boolean>` | `attributesModule`              |
| `class` | Clases condicionales: una correspondencia `name → boolean`                                      | `Record<string, boolean>`                     | `classModule`                   |
| `style` | Estilos en línea: una correspondencia `name → value` (las claves `--var` pasan a variables CSS) | `Record<string, any>`                         | `styleModule`                   |
| `on`    | Escuchadores de eventos: `event → handler` (o un array de manejadores)                          | `Record<string, Function \| Function[]>`      | `eventListenersModule`          |
| `key`   | Identidad estable que usa el algoritmo de comparación para emparejar y reordenar los hijos      | `string \| number`                            | (el núcleo de la comparación)   |
| `ns`    | URI del espacio de nombres (se pone sola en los subárboles SVG)                                 | `string`                                      | (el núcleo de la comparación)   |
| `hook`  | Ganchos de ciclo de vida por vnode (`Hooks`)                                                    | `Hooks`                                       | (solo como tipo: véase la nota) |

> Nota: `hook` y el tipo `Hooks` forman parte de la superficie pública de tipos. Esta implementación recortada mueve el DOM a través del ciclo de vida de los **módulos** (`create` / `update` / `destroy`); el bucle de `patch` actual no llama a los `data.hook` de cada vnode.

### Módulos

Cada módulo se ocupa de una porción de `VNodeData`. `init()` los registra todos; además se exportan uno a uno.

| Exportación            | Se ocupa de  | Descripción                                                                       |
| ---------------------- | ------------ | --------------------------------------------------------------------------------- |
| `classModule`          | `data.class` | Pone y quita clases a partir de una correspondencia `name → boolean`              |
| `propsModule`          | `data.props` | Asigna propiedades del DOM directamente (`elm[key] = value`)                      |
| `attributesModule`     | `data.attrs` | Pone y quita atributos HTML con `setAttribute` (xml y xlink incluidos)            |
| `styleModule`          | `data.style` | Aplica estilos en línea y propiedades personalizadas de CSS                       |
| `eventListenersModule` | `data.on`    | Engancha y desengancha escuchadores de eventos                                    |
| `modules`              | —            | El objeto de registro por defecto, que asocia cada nombre de módulo con su módulo |

### Exportaciones de más bajo nivel

| Exportación  | Tipo                                        | Descripción                                                                                                                                         |
| ------------ | ------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| `vnode`      | `(sel, data, children, text, elm) => VNode` | Fábrica de `VNode` de bajo nivel que usa `h` por dentro. En el código de tu aplicación, mejor `h`.                                                  |
| `addNS`      | `(data, children, sel) => void`             | Aplica el espacio de nombres de SVG a todo un subárbol. `h` la llama sola con los selectores `svg…`.                                                |
| `htmlDomApi` | `DOMAPI`                                    | El adaptador de DOM de navegador por defecto que `patch` usa por dentro (crear, insertar, quitar, nodos de texto, etc.).                            |
| `is`         | `{ array, isStr, primitive, isVnode }`      | Pequeñas ayudas de comprobación de tipos usadas por todo el interior de vnode.                                                                      |
| `Chain`      | `class Chain`                               | Un constructor de DOM imperativo y encadenable (`setAttribute`, `append`, `setTextContent`, …). No tiene nada que ver con la comparación de vnodes. |
| `create`     | `(tagName, options?) => Chain`              | Fábrica de conveniencia que devuelve un `Chain` nuevo.                                                                                              |

### Tipos

| Tipo                | Forma y significado                                                                           |
| ------------------- | --------------------------------------------------------------------------------------------- |
| `VNode`             | `{ sel, data, children, elm, text, key, listener? }`: un nodo virtual                         |
| `VNodeData`         | `{ props?, attrs?, class?, style?, on?, key?, ns?, hook? }`: véanse los campos de arriba      |
| `VNodes`            | `VNode[]`                                                                                     |
| `VNodeChildElement` | `VNode \| string \| number`                                                                   |
| `VNodeChildren`     | `VNodeChildElement \| VNodeChildElement[]`                                                    |
| `ArrayOrElement<T>` | `T \| T[]`                                                                                    |
| `Key`               | `string \| number`                                                                            |
| `Hooks`             | `{ pre?, init?, create?, insert?, prepatch?, update?, postpatch?, destroy?, remove?, post? }` |
| `DOMAPI`            | Interfaz que describe las operaciones de DOM que usa `patch` (véase `htmlDomApi`)             |
| `Fragment`          | Extensión de `DocumentFragment` para el manejo de fragmentos                                  |
| `Modules`           | `Record<string, Record<string, ModuleHook>>`: la forma del registro de módulos                |
| `ModuleHook`        | Una sola llamada del ciclo de vida de un módulo                                               |

## Notas

1. **Solo navegador.** `ranuts/vnode` toca `document` y las API del DOM; impórtalo en código de navegador, no en Node.
2. **Guarda el último vnode.** `patch` devuelve el nuevo `VNode`. Guárdalo y pásalo como `oldVnode` en la siguiente actualización, para que las diferencias se calculen contra el árbol vigente.
3. **En un `VNode`, `text` y `children` se excluyen entre sí**: un nodo es o bien un nodo de texto, o bien un elemento con hijos.
4. **Usa `key` en las listas.** Al dibujar listas que cambian, dale a los hermanos valores de `key` estables, para que la comparación pueda emparejar y reordenar nodos en vez de rehacerlos.
