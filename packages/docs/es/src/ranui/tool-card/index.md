---
description: 'Dibuja una llamada a una herramienta y su resultado a partir de una intención declarada (generic, terminal o diff) en lugar de un marcado que la herramienta tuvo que elegir.'
---

# Tool Card

Dibuja una llamada a una herramienta y su resultado a partir de una **intención declarada**, no de un marcado.

> **Úsalo cuando** enseñes lo que un agente o un trabajo hizo de verdad (un comando de consola,
> una edición de archivo, una búsqueda) y quieras que la herramienta diga _qué es_ mientras la
> superficie decide qué aspecto tiene.

Una herramienta que devuelve HTML ha elegido un renderizador, un tema y una maquetación en nombre
de la interfaz, y lo hace justo en el único sitio (el resultado que ve el modelo) donde los asuntos
de interfaz no pintan nada. Declarar una intención mantiene las dos cosas separadas: la misma
llamada puede dibujarse aquí como un bloque de terminal, como una sola línea en una transcripción
compacta y como un destino de salto en un editor, sin que la herramienta sepa que ninguno existe.

## Inicio rápido

```html
<r-tool-card open></r-tool-card>
```

```ts
const card = document.createElement('r-tool-card');

card.call = { card: 'terminal', title: 'pnpm test', cwd: '/repo' };
card.status = 'running';

// …cuando la llamada vuelve
card.result = { card: 'terminal', output: '2351 passed', exitCode: 0 };
card.status = 'success';

conversation.append(card);
```

## Tipos de tarjeta

### `generic`

El valor por defecto, y también el de reserva. Título, una tabla opcional de clave/valor con los
argumentos que merezca la pena enseñar, y contenido de resultado opcional.

```ts
card.call = { card: 'generic', title: 'Read file', input: { path: 'src/a.ts', limit: '200' } };
card.result = { card: 'generic', content: 'export const a = 1;' };
```

### `terminal`

La llamada _es_ un comando de consola. `title` es el comando; `description` y `cwd` se dibujan
sobre la salida. Un `exitCode` distinto de cero se muestra; el cero no.

```ts
card.call = { card: 'terminal', title: 'ls -la', description: 'List the tree', cwd: '/repo' };
card.result = { card: 'terminal', output: 'total 8\ndrwxr-xr-x …', exitCode: 0 };
```

### `diff`

La llamada crea o modifica archivos. Cada entrada se dibuja como hunks al estilo unified con ambos
márgenes, calculados por `diffLines` de [ranuts/utils](../../ranuts/utils/). **Un `oldText` nulo
significa que el archivo se está creando**, que es lo que sabe una vista en el momento de la
llamada, porque quien llama no tiene contenido previo que leer.

```ts
card.call = {
  card: 'diff',
  title: 'Edit config',
  diffs: [{ path: 'vite.config.ts', oldText: 'port: 3000\n', newText: 'port: 5173\n' }],
};
```

## Dos reglas que muerden

Estas vistas se calculan sobre una llamada en vivo **y otra vez cuando se reproduce un registro**.
Todo lo demás se deriva de eso.

- **Una vista es una función pura de los argumentos de la llamada** (más el resultado, en una vista
  de resultado). Sin E/S, sin reloj, sin estado de sesión; de lo contrario, la reproducción
  discrepa de lo que el usuario vio originalmente.
- **Una tarjeta no reconocida degrada; nunca lanza.** Un tipo de tarjeta de un productor más nuevo,
  o un valor estropeado en el almacenamiento, se dibuja como `generic` con el título que tenga, y
  una vista mal formada se dibuja vacía. La presentación no debe poder romper una reproducción.

## Ubicaciones

Cualquier `locations` de una llamada se dibuja como botones que disparan `locationclick`, para que
un editor pueda seguir el hilo:

```ts
card.call = { card: 'generic', title: 'Read', locations: [{ path: 'src/a.ts', line: 42 }] };
card.addEventListener('locationclick', (e) => openInEditor(e.detail.location));
```

## Referencia de la API

### Propiedades

| Propiedad | Tipo                                | Por defecto | Descripción                                                   |
| --------- | ----------------------------------- | ----------- | ------------------------------------------------------------- |
| `call`    | `ToolCallView \| null`              | `null`      | La vista pendiente, derivada de los argumentos de la llamada. |
| `result`  | `ToolResultView \| null`            | `null`      | La vista completada. Reemplaza a la pendiente.                |
| `status`  | `'running' \| 'success' \| 'error'` | `'running'` | Se refleja, así que los estilos pueden apoyarse en él.        |
| `open`    | `boolean`                           | `false`     | Si el cuerpo está desplegado.                                 |
| `sheet`   | `string`                            | `''`        | CSS inyectado en el shadow DOM del elemento.                  |

Un valor de `status` desconocido se lee como `running`.

### Eventos

| Evento          | Detalle                      | Se dispara cuando                      |
| --------------- | ---------------------------- | -------------------------------------- |
| `locationclick` | `{ location: ToolLocation }` | Se activa una referencia a un archivo. |

### Partes

`card`, `header`, `status`, `title`, `toggle`, `body`, `description`, `exit`, `input`,
`output`, `file`, `path`, `hunk`, `line`, `locations`, `location`.

Las líneas de diff llevan un `data-kind` de `context`, `added` o `removed`.

### Accesibilidad

La cabecera es un `<button type="button">` de verdad con `aria-expanded`, así que se alcanza y se
maneja desde el teclado sin cableado adicional.

## Estilos

`<r-tool-card>` expone **24 propiedades personalizadas de CSS** propias, además de los tokens
semánticos que lee del tema. Define una allí donde se herede: `:root`, un contenedor o el propio
elemento:

```css
r-tool-card {
  --ran-tool-card-io-background: var(--ran-color-bg-subtle);
}
```

Partes: `body` · `exit` · `file` · `hunk` · `io` · `io-text` · `line` · `location` · `locations` · `path` · `row`

La lista completa está en [tokens de estilo](/es/src/ranui/style-tokens#tool-card); cuál elegir lo explica el [sistema de diseño](/es/src/ranui/design-system/).

## Véase también

- [Conversation](../conversation/): úsalo como destino de `mount` para la vista de una llamada
- [ranuts/utils](../../ranuts/utils/): `diffLines`, que dibuja la tarjeta `diff`
