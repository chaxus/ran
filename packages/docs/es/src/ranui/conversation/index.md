---
description: 'Dibuja un registro de eventos de solo anexado como una conversación, ocupándose de la proyección, del seguimiento del fondo y de la reconciliación de filas, con cada tipo de contenido registrado como una vista independiente.'
---

# Conversation

Dibuja un registro de eventos de solo anexado como una conversación. El elemento se ocupa de las
tres cosas que resultan tediosas y fáciles de equivocar, y de nada más: proyectar los eventos en
nodos, mantener la vista anclada al fondo sin pisar el desplazamiento del propio lector, y
reconciliar las filas contra la lista de nodos.

> **Úsalo cuando** estés dibujando una transcripción en streaming (un chat, una sesión de agente,
> un registro) y quieras que cada tipo de contenido (mensaje, llamada a herramienta, línea de
> estado) sea un registro independiente y no otra rama en un renderizador que no para de crecer.

Cómo _se ve_ un mensaje o una llamada a herramienta es cosa de una vista registrada, no del
elemento. Su proyección es [ranuts/conversation](../../ranuts/conversation/) y su desplazamiento es
`createBottomFollower`, de [ranuts/utils](../../ranuts/utils/).

## Inicio rápido

```html
<r-conversation empty="Todavía no hay mensajes" style="height: 400px"></r-conversation>
```

```ts
const chat = document.createElement('r-conversation');

chat.register({
  kind: 'message',
  // Qué eventos son míos y a qué nodo pertenecen.
  match: (e) =>
    e.type === 'message/start'
      ? { id: e.id, role: 'start' }
      : e.type === 'message/delta'
        ? { id: e.id, role: 'update' }
        : null,
  // Cómo se pliegan en mi propio estado.
  start: () => ({ text: '' }),
  update: (state, e) => ({ text: state.text + e.text }),
  // Los deltas por token se agrupan en un repintado por fotograma; los hechos discretos no esperan.
  publication: (e) => (e.type === 'message/delta' ? 'animation-frame' : 'immediate'),
  // Cómo llega ese estado a la pantalla.
  mount: () => document.createElement('r-markdown'),
  patch: (el, node) => {
    el.content = node.state.text;
  },
});

chat.push({ type: 'message/start', id: 'm1' });
chat.push({ type: 'message/delta', id: 'm1', text: 'Hello' });

container.append(chat);
```

`<r-markdown>` es la fila pensada para la prosa: en su `mode="streaming"` por defecto ya cierra
`**bold`, comillas invertidas, enlaces y fórmulas `$$` a medio llegar, así que una vista nunca
tiene que hacerlo.

## Reglas que muerden si se rompen

- **Registra todas las vistas antes del primer `push`.** La proyección se construye una sola vez a
  partir del conjunto registrado, así que un registro posterior se perdería en silencio cada evento
  ya plegado. El elemento lanza un error en lugar de hacer eso.
- **`update` pliega el estado; `patch` lo escribe en el DOM.** Se llaman distinto porque son
  trabajos distintos: `patch` no pliega nada y se ejecuta una vez por fotograma en una fila en
  streaming, así que mantenlo barato.
- **`mount` es opcional.** Una vista sin él aporta estado que otras vistas leen mediante
  `reader.previous`, y no dibuja nada.
- **Las filas conservan la posición en la que se abrieron.** Un mensaje en streaming no salta al
  final de la lista con cada delta.

## Seguimiento del fondo

Activado por defecto. La vista se queda anclada al fondo según llega el contenido, se detiene en
cuanto el lector sube, y vuelve a anclarse cuando baja de nuevo, sin pisar en ningún momento el
desplazamiento manual, porque el seguidor distingue sus propias escrituras de desplazamiento de las
del lector en vez de escuchar los dispositivos de entrada.

```ts
chat.addEventListener('pinnedchange', (e) => {
  jumpButton.hidden = e.detail.pinned;
});
```

`follow="false"` deja el control al lector desde el principio; `scrollToBottom()` lo recupera. Para
paginar contenido antiguo, llama a `captureAnchor()` antes de anteponerlo y a `restoreAnchor()`
después, de modo que el lector siga mirando lo que estaba mirando.

## Referencia de la API

### Propiedades

| Propiedad | Tipo      | Por defecto | Descripción                                                                  |
| --------- | --------- | ----------- | ---------------------------------------------------------------------------- |
| `follow`  | `boolean` | `true`      | Sigue el contenido nuevo hasta que el lector se aleja del fondo.             |
| `empty`   | `string`  | `''`        | Texto mostrado mientras la proyección no ha producido filas. Vacío = oculto. |
| `pinned`  | `boolean` | `true`      | Solo lectura. Si la vista está siguiendo el contenido nuevo ahora mismo.     |
| `sheet`   | `string`  | `''`        | CSS inyectado en el shadow DOM del elemento.                                 |

### Métodos

| Método                | Descripción                                                            |
| --------------------- | ---------------------------------------------------------------------- |
| `register(view)`      | Registra un tipo de contenido. Lanza un error tras el primer `push`.   |
| `push(event)`         | Proyecta un evento y dibuja lo que haya cambiado.                      |
| `reset()`             | Descarta todos los nodos y filas, conservando las vistas registradas.  |
| `scrollToBottom()`    | Baja al fondo y reanuda el seguimiento.                                |
| `captureAnchor(key?)` | Recuerda la posición de una fila antes de anteponer contenido antiguo. |
| `restoreAnchor()`     | Devuelve la fila capturada a donde estaba.                             |

### Eventos

| Evento         | Detalle               | Se dispara cuando                        |
| -------------- | --------------------- | ---------------------------------------- |
| `pinnedchange` | `{ pinned: boolean }` | Se gana o se pierde el anclaje al fondo. |

### Slots

| Slot     | Descripción                                                              |
| -------- | ------------------------------------------------------------------------ |
| `footer` | Zona fija bajo las filas: aquí va un compositor, y se observa su altura. |

### Partes

`conversation` (el puerto de desplazamiento), `list`, `row`, `footer`, `empty`.

Cada fila lleva además `data-kind` y `data-key`, así que quien la consume puede darle estilo o
encontrarla sin hurgar en el árbol del shadow.

## Estilos

`<r-conversation>` expone **14 propiedades personalizadas de CSS** propias, además de los tokens
semánticos que lee del tema. Define una allí donde se herede: `:root`, un contenedor o el propio
elemento:

```css
r-conversation {
  --ran-conversation-background: var(--ran-color-bg-subtle);
}
```

Partes: `conversation` · `empty` · `footer` · `list` · `older`

La lista completa está en [tokens de estilo](/es/src/ranui/style-tokens#conversation); cuál elegir lo explica el [sistema de diseño](/es/src/ranui/design-system/).

## Véase también

- [ranuts/stream](../../ranuts/stream/): convierte el SSE de un proveedor en los eventos que se envían aquí
- [ranuts/conversation](../../ranuts/conversation/): la proyección, incluida su cadencia
- [Markdown](../markdown/): la fila para prosa, consciente del streaming
