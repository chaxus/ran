---
description: 'ranui/builder es un constructor de DOM encadenable y sin framework, con reactividad de grano fino al estilo de SwiftUI y Solid: construye una vez y luego actualiza solo el nodo al que está atada una señal.'
---

# Builder

`ranui/builder` construye el DOM de forma declarativa, con reactividad de grano fino y sin DOM virtual. Es con lo que están escritos los propios componentes, publicado como entrada independiente para que una aplicación lo use en su propia maquetación y su pegamento.

> **Úsalo cuando** quieras vistas reactivas sin framework (una página, una ruta, un widget) o cuando estés escribiendo un elemento personalizado y quieras el mismo estilo de construcción que ranui usa por dentro.

> **El principio: construir una vez, actualizar en el sitio.** Una función de vista se ejecuta **una sola vez**. Un cambio de estado actualiza únicamente el nodo atado a esa señal; no hay redibujado de un árbol. Elige la primitiva que encaje con la forma: valor → un getter atado; condición → `Show` / `Switch`; lista → `For` / `Index`.

```js
import {
  View,
  Div,
  Span,
  ButtonBuilder, // fábricas de elementos
  signal,
  computed,
  createEffect,
  batch,
  untrack, // reactividad
  createRoot,
  onCleanup,
  getOwner,
  runWithOwner, // propiedad
  EventManager, // eventos atados al ciclo de vida
} from 'ranui/builder';
```

El constructor **no** registra ningún elemento personalizado. Para usar `<r-button>` y compañía, importa también la entrada del componente: `import 'ranui/button'`.

## Elementos

Las fábricas devuelven un `ElementBuilder` encadenable; `build()` devuelve el nodo del DOM.

```js
const header = Div()
  .class('panel-header')
  .attr('part', 'header')
  .role('heading')
  .children(Span().class('title').text('Deploys'), Slot().attr('name', 'extra'))
  .build();
```

`Div()`, `Span()`, `ButtonBuilder()`, `InputBuilder()`, `Label()`, `Ul()`, `Li()`, `Section()`, `Article()`, `Nav()`, `Header()`, `Footer()`, `Main()`, `Style()`, `Slot()`, más `View('any-tag')` para cualquier otra cosa, incluidos los elementos personalizados.

### API encadenable

| Grupo             | Métodos                                                                                                       |
| ----------------- | ------------------------------------------------------------------------------------------------------------- |
| Identidad y clase | `id(v)`, `class(v)`, `addClass(...v)`, `removeClass(...v)`                                                    |
| Atributos         | `attr(name, v)`, `attrs({…})`, `boolAttr(name, on, enabledValue?)`, `part(v)`, `data(key, v)`                 |
| Estilo            | `style(prop, v)` / `style({…})`, `cssVar(name, v)`                                                            |
| Accesibilidad     | `aria(key, v)`, `role(v)`, `tabIndex(n)`, `label(v)`, `labelledBy(id)`, `describedBy(id)`, `ariaHidden(b?)`   |
| Contenido         | `text(v)`, `children(…nodes)`, `replaceChildren(…nodes)`                                                      |
| Refs y shadow     | `ref(holder)`, `shadow(opts?)` → `ShadowBuilder`                                                              |
| Eventos           | `on(type, handler, options?)`, `listen(manager, type, handler)`, `delegate(manager, selector, type, handler)` |
| Terminales        | `build()`, `serialize()` (cadena HTML para SSR)                                                               |

`children()` acepta elementos, cadenas, otros constructores, arrays, `null` / `undefined` (se saltan) y getters (regiones vivas, más abajo).

### Refs

`createRef<T>()` junto con `.ref(holder)` captura el elemento construido. Si tipas la ref con la clase del elemento de un componente, obtienes sus métodos imperativos sin necesidad de conversión:

```ts
import { Popover } from 'ranui';
import { View, createRef } from 'ranui/builder';

const ref = createRef<Popover>();
View<Popover>('r-popover').attr('trigger', 'click').ref(ref).children(/* … */).build();
ref.current?.closePopover();
```

## Reactividad

```js
const [count, setCount] = signal(0);
count(); // lectura — se rastrea dentro de efectos y memos
setCount(1); // escritura; setCount((n) => n + 1) también vale
// una escritura con el mismo valor no hace nada (Object.is; se cambia con signal(v, { equals }))

const double = computed(() => count() * 2); // perezoso y memoizado

const dispose = createEffect(() => {
  console.log(count()); // se ejecuta ya, y en cada cambio de dependencia
  return () => {
    /* limpieza opcional, antes de la siguiente ejecución y al desechar */
  };
});

batch(() => {
  setCount(1);
  setName('x');
}); // un solo vaciado, efectos sin repetir
untrack(() => count()); // leer sin suscribirse
```

- **`computed` es perezoso**: un memo que nadie lee nunca se recalcula, y vuelve a notificar solo cuando su _valor_ cambia, así que los efectos detrás de un memo estable no se repiten.
- **Los efectos se rastrean solos**: solo siguen suscritas las señales leídas en la última ejecución, así que una condición nunca deja tras de sí una suscripción caduca.
- **Un efecto cíclico lanza un error** en vez de dar vueltas: un efecto que escribe una señal que lee es un error, y el motor lanza en lugar de dejarlo correr para siempre.

### Ataduras reactivas

`text`, `attr`, `class`, `boolAttr`, `style`, `part`, `data`, `aria`, `role` y `label` aceptan todos un **getter**, así que la atadura se actualiza sola sin ningún efecto explícito:

```js
const [active, setActive] = signal(true);

Div()
  .class(() => (active() ? 'row active' : 'row'))
  .boolAttr('disabled', () => !active())
  .build();
```

Solo las formas de un único valor son reactivas: `style(prop, getter)` lo es; las formas de mapa `style({…})` y `attrs({…})` se aplican una sola vez.

### Condiciones y listas

| Forma                                       | Usa                                  | Comportamiento                                                      |
| ------------------------------------------- | ------------------------------------ | ------------------------------------------------------------------- |
| Una rama                                    | `Show({ when, children, fallback })` | Reconstruye solo cuando la _veracidad_ de `when` cambia.            |
| Varias ramas                                | `Switch` + `Match`                   | Reconstruye solo cuando cambia la rama elegida.                     |
| Una lista con ids estables                  | `For({ each, key, render })`         | Empareja los elementos por `key` y **reutiliza sus nodos**.         |
| Una lista donde la posición es la identidad | `Index({ each, render })`            | Reutiliza el nodo de cada posición; el elemento en sí es una señal. |
| Contenido que cambia de forma entera        | un getter suelto como hijo           | Grueso: derriba y reconstruye toda la región en cada lectura.       |

```js
Ul().children(
  For({
    each: () => rows(), // array de origen reactivo
    key: (row) => row.id, // estable y único
    render: (row, index) => Li().text(() => `${index()}. ${row.title}`),
  }),
);
```

Cuatro reglas deciden si `For` reutiliza algo de verdad:

- **La `key` debe ser única.** Una repetida se ignora (solo se dibuja el primer elemento) y se avisa en desarrollo. No uses el índice del array como clave: eso echa por tierra la reutilización al reordenar.
- **Actualiza con un array nuevo.** `each` lee una señal, así que mutar el mismo array en el sitio y volver a asignarlo se salta por igualdad y la lista nunca se actualiza.
- **`render` se ejecuta una vez por elemento**, no en cada cambio de la lista. Gobierna las actualizaciones de cada fila con señales; `index` es un getter, así que sigue siendo correcto tras un reordenamiento.
- **Quitar un elemento desecha el ámbito de esa fila**: sus efectos y sus limpiezas se van con él.

Prefiere `Show` / `For` a un getter suelto como hijo: el getter reconstruye toda su región en cada cambio que lee, incluso uno que no altera el resultado, así que se pierden el foco, la posición del desplazamiento, los valores de los campos y las transiciones que hubiera dentro.

## Propiedad

Todo efecto, memo y atadura reactiva pertenece al ámbito que lo creó. Desechar el ámbito desecha todo lo que hay bajo él.

```js
import { createRoot, onCleanup } from 'ranui/builder';

const dispose = createRoot((dispose) => {
  const el = Div().text(message).build(); // esta atadura pertenece a la raíz
  onCleanup(() => console.log('torn down'));
  mount(el);
  return dispose;
});

dispose(); // retira el efecto de la atadura y ejecuta las limpiezas
```

**Construye la interfaz reactiva dentro de un `createRoot`.** Una atadura creada sin dueño funciona igual, pero nunca se desecha sola.

### Desmontaje por página

Dale a cada página o ruta su propia raíz y deséchala al navegar: todo efecto, atadura, temporizador y escuchador que creó esa página se va en una sola llamada:

```js
let disposePage = null;

function showPage(render, host) {
  disposePage?.();
  disposePage = createRoot((dispose) => {
    render(host);
    return dispose;
  });
}
```

[`<r-route>`](/es/src/ranui/route/) lo trae de serie: con `src`, el módulo de la página se importa al coincidir, su exportación por defecto se ejecuta dentro de un `createRoot`, y esa raíz se desecha al salir. `getOwner()` / `runWithOwner()` permiten a un router llevar un ámbito a través de un `await`.

::: warning Dentro de un Web Component, no uses ataduras con getter
El `constructor` y el `connectedCallback` de un componente **no** son ámbitos reactivos, así que una atadura con getter o un `createEffect` creados ahí quedan huérfanos y nunca se desechan; siguen disparándose sobre un nodo desconectado y, si la señal sobrevive al elemento, lo dejan clavado en memoria. Construye con valores simples y gobierna las actualizaciones con `createEffect` explícitos cuyas funciones de desecho recojas y llames en `disconnectedCallback`, volviéndolas a armar al reconectar. Consulta las [pautas de código](/es/src/ranui/coding-guides/).
:::

## Escuchadores dentro de un elemento personalizado

`EventManager` se apoya en un `AbortController`, así que una sola llamada retira todos los escuchadores:

```js
const events = new EventManager();

connectedCallback() {
  events
    .on(this.input, 'input', this.onInput)
    .delegate(this, '[data-action]', 'click', (event, el) => this.run(el.dataset.action));
}

disconnectedCallback() {
  events.abort(); // los retira todos, y se reinicia para la próxima conexión
}
```

## Renderizado en el servidor

Los constructores funcionan bajo [SSR](/es/src/ranui/ssr/): `build()` devuelve un nodo simulado y `serialize()` devuelve HTML. Las ataduras reactivas, `For` y `Show` se dibujan **una sola vez** en el servidor, como una instantánea estática; no hay reconciliación hasta que el código corre en un navegador.

## Referencia completa

Esta página es el subconjunto de trabajo. La referencia completa (todas las fábricas, todos los operadores, las reglas del espacio de nombres SVG y los detalles de `Switch` / `Match`) está en [BUILDER.md](https://github.com/chaxus/ran/blob/main/packages/ranui/docs/BUILDER.md), en el repositorio, y también viaja dentro del paquete de npm.
