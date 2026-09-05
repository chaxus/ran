---
description: 'Reglas de ingeniería para construir con ranui: puntos de entrada, el contrato de atributos/propiedades/eventos, estilos a través de la frontera del shadow DOM, propiedad del estado, SSR, pruebas y los antipatrones que conviene evitar.'
---

# Pautas de código

Cómo _construir_ con ranui: cuál es el contrato de los componentes, dónde la frontera del Shadow DOM cambia las reglas a las que estás acostumbrado y qué errores conviene conocer antes de cometerlos.

La mitad visual de esto son las [pautas de diseño](/es/src/ranui/design-guides/); los tokens son el [sistema de diseño](/es/src/ranui/design-system/).

> **Úsalas cuando** estés conectando componentes de ranui a una aplicación: eligiendo importaciones, enlazando eventos, dando estilo a algo que un selector no alcanza, renderizando en un servidor o escribiendo pruebas.

## Principios

1. **El elemento es la API.** Atributos, propiedades, eventos, slots y `::part()` son todo el contrato. Cualquier otra cosa que veas desde fuera es un detalle de implementación que se moverá.
2. **El estado tiene un único dueño.** O tu aplicación posee el valor y lo empuja hacia dentro, o el componente lo posee y te avisa cuando cambia. Reflejarlo en ambos sentidos es como los valores se desincronizan.
3. **Da estilo a través de la frontera del Shadow DOM con propiedades personalizadas, `::part()`, `sheet` y slots.** Los selectores normales no la cruzan; ninguna cantidad de especificidad cambia eso.
4. **Importa lo que uses.** Cada componente tiene su propia entrada; el barril es una comodidad, no un requisito.
5. **Prefiere la plataforma.** Son elementos personalizados: `addEventListener`, `setAttribute` y `hidden` funcionan tal como están especificados, y las abstracciones de framework encima son opcionales.

## Puntos de entrada

Cada entrada registra exactamente lo que dice su nombre y nada más, así que una página que solo quiere tematización nunca paga por la biblioteca de componentes.

| Importación                     | Contiene                                                                        |
| ------------------------------- | ------------------------------------------------------------------------------- |
| `ranui`                         | Todos los componentes (registra todos los `<r-*>` como efecto secundario)       |
| `ranui/<component>`             | Un componente: `ranui/button`, `ranui/select`, `ranui/modal`, …                 |
| `ranui/theme`                   | `initTheme` / `setTheme` / `getTheme` y sobreescritura de tokens; sin elementos |
| `ranui/i18n`                    | El motor de traducción; sin elementos                                           |
| `ranui/fonts`                   | Geist Sans + Geist Mono autoalojadas (solo el CSS de `@font-face`)              |
| `ranui/style`                   | La hoja de estilos, si tu configuración no la recoge sola                       |
| `ranui/builder`                 | El constructor de DOM encadenable con el que están escritos los componentes     |
| `ranui/ssr`, `ranui/ssr-stream` | Renderizado en el servidor                                                      |
| `ranui/testing`                 | Ayudas para llegar a un shadow root cerrado desde una prueba                    |
| `ranui/typings`                 | Tipos ambientales (declaraciones de elementos para JSX / TS)                    |

```js
import 'ranui/button'; // un elemento
import 'ranui'; // todos
```

**Importa por el efecto secundario.** `import 'ranui/button'` registra `<r-button>`; rara vez necesitas la clase exportada. La excepción es el renderizado en servidor, donde la instancias tú.

## El contrato de los componentes

Los atributos, propiedades, eventos (con la forma de su `detail`), slots y parts exactos de cada elemento se generan desde el código fuente en [`COMPONENTS.md`](https://github.com/chaxus/ran/blob/main/packages/ranui/docs/COMPONENTS.md). Las reglas de abajo son lo que esa tabla _no_ dice.

### Los atributos son cadenas; las propiedades tienen tipo

Los atributos HTML van en minúscula y son cadenas; la propiedad correspondiente va en camelCase y toma un valor de verdad. Son el mismo estado, alcanzado de dos maneras:

```html
<r-select showsearch dropdownclass="wide"></r-select>
```

```js
select.showSearch = true; // propiedad — camelCase
select.setAttribute('showsearch', ''); // atributo — minúscula
```

- **Los atributos booleanos cuentan por presencia**, como `disabled` en un `<button>` nativo: `disabled=""` y `disabled="false"` están los dos _deshabilitados_. Quita el atributo (o pon la propiedad a `false`) para apagarlo.
- **Los valores ricos van por propiedades.** Los arrays, los objetos y los `File` no sobreviven a un atributo: el `attachments` de `r-attachments`, por ejemplo, es una propiedad.
- **Los nombres de atributo en el marcado no distinguen mayúsculas**, y por eso el HTML de arriba dice `showsearch` mientras que la propiedad es `showSearch`. En JSX, escribe la forma de atributo.

### Escucha en el propio elemento

Los componentes de ranui despachan `CustomEvent`, y la carga va siempre en `detail`:

```js
select.addEventListener('change', (event) => {
  const { value, label } = event.detail;
});
```

**Que un evento burbujee es una decisión de cada componente, así que enlaza al elemento, no a un contenedor.** El núcleo de formularios y capas (`r-input`, `r-checkbox`, `r-select`, `r-modal`) despacha eventos que no burbujean sobre sí mismo, a propósito: un `change` de un select dentro de tu formulario no debería parecer un `change` del formulario. Otros sí burbujean (y son `composed`, así que cruzan fronteras de shadow): `r-theme-switch`, `r-voice-button`, `r-attachments`, `r-conversation`, `r-tool-card`, `r-markdown`, `r-math`, `r-mermaid`, `r-router`, `r-route`, `r-link`, `r-colorpicker`.

Un escuchador en el elemento funciona en ambos casos; la delegación en un antepasado funciona solo con el segundo grupo, y falla _en silencio_ con el primero. Comprueba el código o [`COMPONENTS.md`](https://github.com/chaxus/ran/blob/main/packages/ranui/docs/COMPONENTS.md) antes de confiar en la delegación.

**Los eventos `before*` son cancelables.** `r-modal` despacha `beforeopen` / `beforeclose` antes de actuar; `event.preventDefault()` veta la transición. Los pares `open` / `close` / `afteropen` / `afterclose` informan de lo ya ocurrido y no se pueden cancelar.

```js
modal.addEventListener('beforeclose', (event) => {
  if (hasUnsavedChanges) event.preventDefault();
});
```

### Slots y parts

El contenido entra por slots (por defecto y con nombre) y se queda en tu documento, así que el CSS de **tu** página le da estilo con normalidad. Solo queda fuera de alcance lo que el componente construye por dentro, y para eso está `::part()`.

## Estilos a través de la frontera del shadow {#styling-across-the-shadow-boundary}

Todos los componentes de ranui se dibujan en un shadow root **cerrado**. El CSS de la página no se filtra hacia dentro y los selectores no llegan a través. Hay exactamente cuatro caminos de entrada, por orden de preferencia:

| Mecanismo                      | Sirve para                                     | Ejemplo                                               |
| ------------------------------ | ---------------------------------------------- | ----------------------------------------------------- |
| **Propiedades personalizadas** | Todo lo que el componente expone como token    | `r-button { --ran-btn-background: #7c3aed; }`         |
| **`::part()`**                 | Un ajuste estructural que los tokens no cubren | `r-card::part(footer) { justify-content: flex-end; }` |
| **El atributo `sheet`**        | CSS programático o dinámico inyectado dentro   | `el.sheet = '.ran-btn { letter-spacing: .02em }'`     |
| **Contenido de slot**          | Marcado que de todos modos es tuyo             | `<span slot="extra">…</span>`                         |

Las propiedades personalizadas son la vía preferida porque **se heredan a través** de la frontera: poner un token en `:root`, en un envoltorio o en el elemento funciona igual, y son los mismos tokens que usa el tema. Las parts y `sheet` te atan a la estructura interna, así que resérvalas para huecos reales y cuenta con revisarlas al actualizar.

Lo que no funciona, con ninguna especificidad: `r-select .some-inner-class { … }`, `!important` o un `querySelector` hacia dentro del componente. Un root cerrado significa que `element.shadowRoot` es `null` tanto para tu CSS como para tus scripts y para los localizadores de tu ejecutor de pruebas.

## Poseer el estado

Decide, valor por valor, quién es el dueño:

- **Lo posee el componente** (no controlado): pon un valor inicial y luego lee el valor del `detail` del evento cuando cambie. Lo más simple, y lo predeterminado para formularios.
- **Lo posee tu aplicación** (controlado): pon la propiedad en cada render y trata el evento como una _petición_ de cambiar tu estado, no como un cambio que ya le ocurrió a tu modelo.

Lo que se rompe es hacer ambas cosas: guardar una copia del valor del componente en tu estado, escribirla de vuelta en cada evento y volver a poner la propiedad desde ese estado. Los dos se desincronizan con la escritura rápida, y escribir durante un evento puede entrar en bucle. Elige una dirección.

```js
// Controlado: el estado es la fuente de verdad, el evento es una petición
input.value = state.query;
input.addEventListener('input', (event) => {
  state.query = event.detail.value;
  render(); // que vuelve a poner input.value, pero desde un solo dueño
});
```

## Integración con frameworks {#framework-integration}

Son elementos personalizados estándar, así que no hace falta nada específico de cada framework, pero tres detalles muerden:

- **React** (antes de la 19) pone cada prop de JSX como **atributo**, así que los valores ricos no llegan y los props al estilo `onChange` no se enlazan a eventos personalizados. Usa un `ref` y pon las propiedades o llama a `addEventListener` en un efecto. React 19 pone propiedades cuando existen y sigue sin enlazar eventos personalizados por nombre, así que conserva el `ref` para los escuchadores.
- **Vue** compila las etiquetas desconocidas como componentes salvo que se le diga otra cosa; añade `r-` a `compilerOptions.isCustomElement` en tu configuración de compilación. Después de eso, `:prop` enlaza una propiedad y `@change` un escuchador de eventos de verdad, ambos correctamente.
- **Angular** necesita `CUSTOM_ELEMENTS_SCHEMA`; Svelte y Solid pasan atributos y escuchadores `on:`/`on` directamente y no necesitan nada.

Quien use TypeScript puede hacer `import 'ranui/typings'` para las declaraciones de elementos intrínsecos de JSX.

## Renderizado en el servidor {#server-rendering}

Los componentes de ranui se serializan a **shadow DOM declarativo**, así que un servidor puede emitir el marcado real y el primer pintado es correcto antes de que corra ningún JavaScript:

```js
import 'ranui'; // llena el registro de SSR
import { renderHTMLToString } from 'ranui/ssr-stream';

const html = await renderHTMLToString(`
  <r-button type="primary">Submit</r-button>
  <r-progress percent="65"></r-progress>
`);
```

`renderToStream(html)` es lo mismo en forma de generador asíncrono, para respuestas por streaming; `renderToString(instance)` en `ranui/ssr` serializa una instancia de componente que construiste tú. Las etiquetas desconocidas pasan intactas, así que es seguro pasarlo por una página entera.

Dos cosas que conviene saber:

- **El cliente reconstruye, no reutiliza.** Como los roots están cerrados, el navegador no puede reutilizar el árbol renderizado en el servidor para el componente, así que al actualizarse cada elemento construye uno idéntico desde cero. Consigues el primer pintado desde el servidor; no consigues reutilización en la hidratación, y no debes meter estado en el marcado shadow del servidor esperando que el cliente lo lea.
- **Nada medido está disponible en el servidor.** Todo lo que dependa de `getBoundingClientRect` o de `offsetWidth` se resuelve después del montaje, en el navegador.

## Rendimiento

- **Importa por componente** en páginas que usan un puñado; el barril es para aplicaciones que usan casi toda la biblioteca.
- **Las variantes se cargan bajo demanda.** `r-icon` y `r-loading` piden una variante por nombre en tiempo de ejecución, así que el coste base no crece con la cantidad de iconos que no usas.
- **Pon propiedades, no reconstruyas elementos.** Reemplazar un elemento personalizado ejecuta su constructor otra vez; poner una propiedad actualiza en el sitio.
- **Agrupa las escrituras de atributos.** Cada escritura puede disparar `attributeChangedCallback`; monta el estado antes de insertar siempre que puedas.

## Pruebas

**Los shadow roots cerrados también detienen a los localizadores de las pruebas.** `getByRole`, `getByText` y `querySelector` de Playwright se paran todos en la frontera y no encuentran _nada_, así que una especificación escrita contra ellos pasa mientras afirma cosas sobre elementos que nunca vio. Dos suites de este repositorio estaban escritas así antes de que alguien se diera cuenta. `ranui/testing` es la costura, con nombre y documentada:

```js
import { insideShadow, settlePainted } from 'ranui/testing';

const label = await insideShadow(page, 'r-button', (root) => root.querySelector('[part=content]')?.textContent);
```

Por lo demás, prueba el contrato, no las tripas: pon un atributo o una propiedad y afirma sobre el evento y sobre lo que la persona puede percibir. Las afirmaciones contra nombres de clase internos se rompen en cada refactorización y no te dicen nada sobre si el componente funciona.

## Antipatrones

| Antipatrón                                                    | Por qué falla                                                                              |
| ------------------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| Delegar `change` en un contenedor para `r-input` / `r-select` | Esos eventos no burbujean; el escuchador nunca se dispara. Enlaza al elemento.             |
| `document.querySelector('r-select').shadowRoot`               | Root cerrado: siempre `null`. Usa la API pública, las parts o `ranui/testing`.             |
| Dar estilo a las tripas con `r-card .inner { … }`             | Los selectores no cruzan la frontera con ninguna especificidad. Usa tokens o `::part()`.   |
| `!important` para ganarle a un componente                     | No hay conflicto de cascada que ganar: la regla nunca se aplica. Mismo arreglo que arriba. |
| Reflejar el valor de un componente en tu estado y de vuelta   | Dos dueños, un valor; se desincronizan y pueden entrar en bucle.                           |
| Recrear elementos para actualizarlos                          | Ejecuta el constructor otra vez, pierde el foco y el estado interno. Pon propiedades.      |
| Escribir un color a mano junto a un componente tematizado     | Se rompe en cuanto cambia el tema. Usa tokens semánticos.                                  |
| `z-index` general en un envoltorio «por si» se abre una capa  | Eleva contenido estático por encima de tu propio marco para siempre. Acótalo con `:has()`. |
| Esperar a `shadowRoot` en una prueba                          | Como arriba: afirma a través de `ranui/testing` o sobre comportamiento observable.         |

## Contribuir a ranui

El repositorio tiene sus propios estándares, más estrictos, para el código de la biblioteca:

- [`docs/DESIGN.md`](https://github.com/chaxus/ran/blob/main/packages/ranui/docs/DESIGN.md): el estándar de diseño ejecutable; nueve reglas las hace cumplir `pnpm -F ranui verify:design`.
- [`docs/CODING.md`](https://github.com/chaxus/ran/blob/main/packages/ranui/docs/CODING.md): la arquitectura de los componentes, la propiedad del estado y las reglas de pruebas para el código de la biblioteca.
- [`docs/BUILDER.md`](https://github.com/chaxus/ran/blob/main/packages/ranui/docs/BUILDER.md): el constructor de DOM encadenable y sus primitivas reactivas.
- `CLAUDE.md` en la raíz del paquete: el archivo de orientación, incluido en el tarball de npm, que tanto las personas como los agentes de código leen primero.

Antes de abrir una pull request: `pnpm -F ranui test:all`, `pnpm -F ranui verify:design` y `pnpm verify:docs` (las tablas de API y de tokens son generadas; CI falla si están desactualizadas).
