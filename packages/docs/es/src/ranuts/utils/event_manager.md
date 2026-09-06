# EventManager / createDoubleTapDetector

Un registro de eventos atado al ciclo de vida y apoyado en `AbortController`, más un pequeño detector de doble toque, indiferente al tipo de puntero, para gestos táctiles.

El problema que resuelve es _volver a quitar los escuchadores_. `removeEventListener` solo funciona si le entregas **exactamente la misma** referencia de función y las mismas opciones con que lo registraste. Envuelve el manejador en una función flecha al pasarlo y ya no podrás quitarlo nunca. Los componentes que se montan y desmontan una y otra vez van dejando escapar un escuchador por ciclo. `AbortController` convierte todo eso en un único `abort()`.

## Uso

### Dentro de un Web Component

```ts
import { EventManager } from 'ranuts/utils';

class MyElement extends HTMLElement {
  private _events = new EventManager();

  connectedCallback() {
    this._events.on(this._input, 'input', this.handleInput).on(this, 'click', this.handleClick, { capture: true });
  }

  disconnectedCallback() {
    this._events.abort(); // quita todos los escuchadores y deja el terreno limpio para la próxima conexión
  }
}
```

### En el código normal de una página

```ts
function initSection(container: HTMLElement) {
  const scope = new EventManager();

  scope.on(input, 'input', handleSearch).delegate(container, '[data-action]', 'click', (ev, target) => {
    handleAction(target.getAttribute('data-action'));
  });

  return () => scope.abort(); // llámalo cuando se desmonte la sección
}
```

## API

### on

Registra un escuchador atado a este gestor. Se puede encadenar.

#### Parámetros

| Parámetro | Descripción                                       | Tipo                                     | Por defecto |
| --------- | ------------------------------------------------- | ---------------------------------------- | ----------- |
| `target`  | El objetivo del evento                            | `EventTarget`                            | Obligatorio |
| `type`    | Nombre del evento                                 | `string`                                 | Obligatorio |
| `handler` | La función manejadora                             | `EventListener`                          | Obligatorio |
| `options` | Las opciones de `addEventListener` menos `signal` | `Omit<AddEventListenerOptions,'signal'>` | `-`         |

#### Devuelve

| Argumento | Descripción                      | Tipo           |
| --------- | -------------------------------- | -------------- |
| `this`    | El propio gestor, para encadenar | `EventManager` |

### delegate

Delegación de eventos: pone **un solo** escuchador en `parent` y llama a `handler` únicamente cuando el evento nació de un descendiente que casa con `selector`. Se puede encadenar.

El manejador recibe el evento original y el elemento que casó.

```ts
scope.delegate(list, '.item', 'click', (ev, item) => {
  console.log(item.getAttribute('data-id'));
});
```

#### Parámetros

| Parámetro  | Descripción                                       | Tipo                                     | Por defecto |
| ---------- | ------------------------------------------------- | ---------------------------------------- | ----------- |
| `parent`   | El elemento al que se ata ese único escuchador    | `HTMLElement`                            | Obligatorio |
| `selector` | El selector con que debe casar el descendiente    | `string`                                 | Obligatorio |
| `type`     | Nombre del evento                                 | `string`                                 | Obligatorio |
| `handler`  | `(event, matchedElement) => void`                 | `Function`                               | Obligatorio |
| `options`  | Las opciones de `addEventListener` menos `signal` | `Omit<AddEventListenerOptions,'signal'>` | `-`         |

#### Devuelve

| Argumento | Descripción                      | Tipo           |
| --------- | -------------------------------- | -------------- |
| `this`    | El propio gestor, para encadenar | `EventManager` |

### abort

Quita todos los escuchadores registrados y renueva el `AbortController` interno. Se puede llamar más de una vez sin problema; las llamadas posteriores a `on()` o `delegate()` parten de un ámbito limpio.

#### Devuelve

Sin valor de retorno (`void`)

### signal

El `AbortSignal` subyacente, por si quieres pasárselo tú a `addEventListener`.

| Argumento | Descripción                        | Tipo          |
| --------- | ---------------------------------- | ------------- |
| `signal`  | La señal de cancelación del gestor | `AbortSignal` |

## createDoubleTapDetector

Detección de doble toque a partir de muestras crudas de `(x, y, tiempo)`. Es indiferente al tipo de puntero, así que funciona igual la alimentes con eventos Pointer, Touch o Mouse. Está pensada para gestos táctiles (doble toque para avanzar, para hacer zoom, para dar un «me gusta»), donde rehacer en cada sitio la lógica del umbral de tiempo y distancia es fácil de equivocar de forma sutil: comparar un solo eje, u olvidar reiniciar tras un acierto y que tres toques rápidos cuenten como dos dobles toques solapados.

```ts
import { createDoubleTapDetector } from 'ranuts/utils';

const detector = createDoubleTapDetector();
el.addEventListener('pointerup', (e) => {
  if (detector.check(e.clientX, e.clientY)) seek();
});
```

### `createDoubleTapDetector(options?)`

#### Parámetros (`DoubleTapDetectorOptions`)

| Opción          | Descripción                                              | Tipo     | Por defecto |
| --------------- | -------------------------------------------------------- | -------- | ----------- |
| `windowMs`      | Separación máxima entre los dos toques, en ms            | `number` | `300`       |
| `maxDistancePx` | Distancia máxima en el plano entre los dos toques, en px | `number` | `60`        |

#### `DoubleTapDetector`

| Miembro | Descripción                                                                                                                                                                                                                                          | Tipo                                              |
| ------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------- |
| `check` | Anota un toque en `(x, y)` y dice si forma un doble toque con el inmediatamente anterior. Al detectar uno, el seguimiento se reinicia, de modo que un tercer toque rápido empieza una pareja nueva en vez de contar como parte del mismo doble toque | `(x: number, y: number, now?: number) => boolean` |
| `reset` | Olvida el último toque anotado; llámalo cuando empiece un gesto que no sea un toque (un arrastre)                                                                                                                                                    | `() => void`                                      |
