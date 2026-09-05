# ranuts/conversation — Del registro de eventos a nodos dibujables

Proyecta un registro de eventos de solo añadido en los nodos que dibuja una vista de conversación.

```js
import { createConversationEngine } from 'ranuts/conversation';
```

**Es un punto de entrada propio** y no toca el DOM: la proyección se puede probar, y dibujar en el servidor, por sí sola. [`<r-conversation>`](../../ranui/conversation/) es quien la consume en el DOM.

## Por qué no ramificar según el tipo de evento

Lo habitual para dibujar una conversación es una vista que ramifica según el tipo de evento y muta un árbol de componentes. Eso mete el orden, la identidad y la reconciliación de las actualizaciones parciales **dentro de la vista**, así que cada nuevo tipo de contenido (una llamada a una herramienta, una petición de aprobación, una línea de estado) hay que enhebrarlo a mano, y la vista gana una rama por tipo.

Aquí cada tipo es una **máquina de estados registrada por su cuenta**. Una definición dice qué eventos son suyos, los pliega en su propio estado y nunca se entera de que existen los demás. Añadir un tipo es añadir una definición, no editar un renderizador.

## Una definición

```ts
const message = {
  kind: 'message',
  // Qué eventos son míos, y a qué nodo pertenecen.
  match: (event) =>
    event.type === 'message/start'
      ? { id: event.id, role: 'start' }
      : event.type === 'message/delta'
        ? { id: event.id, role: 'update' }
        : null,
  // Pliégalos en mi propio estado.
  start: (event, reader) => ({ text: '', after: reader.previous('message')?.id }),
  update: (state, event) => ({ ...state, text: state.text + event.text }),
  // Con qué frecuencia deben ver el resultado quienes se suscriban.
  publication: (event) => (event.type === 'message/delta' ? 'animation-frame' : 'immediate'),
};

const engine = createConversationEngine({ definitions: [message, toolCall] });
engine.subscribe((nodes) => render(nodes));
engine.push(event);
```

`definitions` está declarado sobre un estado `unknown`, así que definiciones con tipos de estado distintos se registran una junto a otra sin ninguna conversión en el punto de llamada, mientras cada una sigue plenamente tipada allí donde está escrita.

## Semántica

- **Toda definición ve todos los eventos.** El motor no se detiene en la primera que reclama, así que un solo evento del registro puede mover dos nodos.
- **El orden queda fijado en `start`.** Un nodo que sigue actualizándose se queda donde se abrió, así que un mensaje que llega por streaming no salta al final de la lista con cada delta.
- **Un `update` para un id sin nodo abierto se descarta.** Ese es el resultado correcto cuando el evento de inicio quedó fuera de una ventana paginada; construir un nodo solo a partir de una actualización parcial dibujaría algo que nunca existió.
- **Un `start` repetido reabre el nodo en su sitio.** La definición decidió que esto es un nodo nuevo, así que el estado anterior se descarta en vez de fusionarse, y se conserva la posición.
- **`reader.previous(kind)` solo mira hacia atrás.** Una definición que pudiera ver nodos iniciados después de ella daría una respuesta distinta según cuándo se ejecutara, y reproducir el mismo registro no daría la misma vista.

## Ritmo de publicación

`publication` controla con qué frecuencia ven las actualizaciones quienes se suscriben, y es el único ajuste que hace falta tocar por rendimiento:

| Ritmo             | Sirve para                                                                                                  |
| ----------------- | ----------------------------------------------------------------------------------------------------------- |
| `animation-frame` | deltas por token: todas las que caigan entre dos pintados se funden en una sola notificación                |
| `immediate`       | hechos discretos: el resultado de una herramienta, una aprobación; esperar un fotograma solo añade latencia |
| `none`            | estado que una publicación posterior llevará igualmente; se registra sin despertar la vista                 |

**El ritmo sube y nunca se relaja.** Una publicación `immediate` mientras hay un fotograma pendiente dispara ya y cancela el fotograma, en vez de notificar dos veces. Omitir `publication` significa `immediate`.

La opción `scheduler` sustituye la programación por fotogramas, y es como se prueba el ritmo sin un pintado. Por defecto usa `requestAnimationFrame` en un navegador y una microtarea en cualquier otro sitio.

## Nodos

```ts
interface ConversationNode<State> {
  key: string; // `kind:id`, estable durante toda la vida del nodo
  kind: string;
  id: string;
  seq: number; // el ordinal del evento de inicio: la clave de ordenación
  state: State;
}
```

`nodes()` devuelve el mismo array hasta el siguiente evento aceptado, y cada nodo está congelado, así que una vista puede sostener uno a través de una publicación sin que le cambie por debajo.

## Véase también

- [ranuts/stream](../stream/): produce los eventos
- [`<r-conversation>`](../../ranui/conversation/): dibuja los nodos
- `createBottomFollower` en [ranuts/utils](../utils/): mantiene la vista pegada abajo
