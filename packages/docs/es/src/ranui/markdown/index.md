---
description: 'Web Component que renderiza Markdown pensado para streaming: cierra el markdown a medio llegar, redibuja solo el bloque que cambió e incrusta código (shiki), diagramas Mermaid y matemáticas.'
---

# Markdown

Renderiza Markdown (incluida la **salida de una IA token a token**) como un web component independiente del framework. `<r-markdown>` está modelado sobre [Streamdown](https://streamdown.ai) de Vercel: mientras el texto llega, cierra al vuelo el `**bold`, el `` `code ``, los enlaces y las matemáticas `$$` a medio escribir, parte el documento en bloques y redibuja **solo el bloque que cambió**, de modo que una respuesta larga nunca se vuelve a analizar desde arriba con cada token.

Los bloques cercados ` ```mermaid ` se convierten en [`<r-mermaid>`](/es/src/ranui/mermaid/), las matemáticas en [`<r-math>`](/es/src/ranui/math/), y el código puede resaltarse con shiki; todos ellos se cargan de forma diferida la primera vez que el contenido los necesita. La salida se sanea con DOMPurify.

> **Úsalo cuando** muestres Markdown que no controlas del todo (respuestas de chat, flujos de un LLM, comentarios de usuarios, documentación) y quieras streaming, soporte de código, diagramas y matemáticas, y HTML seguro sin tener que juntar tú mismo un analizador, un saneador y un resaltador.

## Inicio rápido

<ran-demo>
  <r-markdown copy highlight data-content="%23%20Hola%0A%0AAlgo%20en%20%2A%2Anegrita%2A%2A%2C%20algo%20en%20%2Acursiva%2A%2C%20un%20%5Benlace%5D%28https%3A%2F%2Fgithub.com%2Fchaxus%2Fran%29%20y%20%60c%C3%B3digo%20en%20l%C3%ADnea%60.%0A%0A%60%60%60ts%0Aconst%20greet%20%3D%20%28name%3A%20string%29%3A%20string%20%3D%3E%20%60Hi%20%24%7Bname%7D%60%3B%0A%60%60%60%0A%0A%7C%20Funci%C3%B3n%20%7C%20Estado%20%7C%0A%7C%20---%20%7C%20---%20%7C%0A%7C%20Streaming%20%7C%20%E2%9C%85%20%7C%0A%7C%20Mermaid%20%2F%20matem%C3%A1ticas%20%7C%20%E2%9C%85%20%7C"></r-markdown>
</ran-demo>

```html
<r-markdown copy highlight content="# Hola ..."></r-markdown>
```

```js
import 'ranui'; // o la entrada independiente:
import 'ranui/markdown';
```

La fuente se lee de la **propiedad `content`** (la preferida: no se refleja, así que transmitir una respuesta larga no revuelve el DOM), del atributo `content` o del texto del propio elemento:

```js
const el = document.createElement('r-markdown');
el.setAttribute('caret', ''); // muestra un cursor parpadeante mientras llega el texto
for await (const chunk of stream) {
  el.content += chunk; // solo se redibuja el último bloque
}
el.removeAttribute('caret');
container.append(el);
```

## Streaming

`mode="streaming"` (el valor por defecto) pasa primero el texto por [remend](https://www.npmjs.com/package/remend), el terminador de markdown incompleto extraído de Streamdown: así un `**bold` recibido a medias se dibuja en negrita en vez de mostrar los asteriscos, `[text](https://exa` se ve como texto plano hasta que la URL se cierra, un `- ` no convierte el párrafo anterior en un encabezado, y así con todo. Para documentos ya terminados, pon `mode="static"` y sáltate esa pasada para renderizar de una sola vez.

<ran-demo>
  <r-markdown caret data-content="%2A%C3%89nfasis%2A%20a%20medio%20escribir%2C%20%60c%C3%B3digo%20en%20l%C3%ADnea%60%20y%20%2A%2Anegrita%20que%20todav%C3%ADa%20est%C3%A1%20llegando"></r-markdown>
</ran-demo>

```html
<r-markdown
  caret
  content="*Énfasis* a medio escribir, `código en línea` y **negrita que todavía está llegando"
></r-markdown>
```

- **cursor**: `caret` muestra un `▋` parpadeante y `caret="circle"` un `●`, después del último bloque. Se oculta solo mientras haya una cerca de código abierta o el último bloque sea una tabla.
- **las cercas de código incompletas** se quedan en texto plano (sin destello de resaltado, sin diagramas a medio dibujar) hasta que llega la cerca de cierre; mientras tanto el contenedor lleva `data-incomplete`.

## Bloques de código

Cada bloque de código recibe una cabecera con el lenguaje y, si lo activas, botones de copiar y descargar. Añade `highlight` para resaltar la sintaxis con [shiki](https://shiki.style) (carga diferida; los lenguajes se cargan bajo demanda; `github-light` / `github-dark` por defecto, siguiendo el tema de la página).

<ran-demo>
  <r-markdown copy download line-numbers highlight data-content="%60%60%60python%0Adef%20fib%28n%3A%20int%29%20-%3E%20int%3A%0A%20%20%20%20return%20n%20if%20n%20%3C%202%20else%20fib%28n%20-%201%29%20%2B%20fib%28n%20-%202%29%0A%0Aprint%28fib%2810%29%29%0A%60%60%60"></r-markdown>
</ran-demo>

```html
<r-markdown copy download line-numbers highlight></r-markdown>
<!-- elige temas: claro oscuro -->
<r-markdown highlight="vitesse-light vitesse-dark"></r-markdown>
```

## Mermaid y matemáticas

<ran-demo>
  <r-markdown data-content="%60%60%60mermaid%0Agraph%20LR%3B%20A%5BPrompt%5D%20--%3E%20B%5BModel%5D%3B%20B%20--%3E%20C%5BTokens%5D%3B%20C%20--%3E%20D%5Br-markdown%5D%0A%60%60%60%0A%0A%24%24%0AE%20%3D%20mc%5E2%0A%24%24%0A%0ALa%20expresi%C3%B3n%20%5C%28e%5E%7Bi%5Cpi%7D%20%2B%201%20%3D%200%5C%29%20fluye%20con%20el%20texto."></r-markdown>
</ran-demo>

- ` ```mermaid ` → `<r-mermaid>` (con pantalla completa; `copy` / `download` se reenvían).
- `$$…$$`, `\[…\]` y ` ```math ` → `<r-math>` en bloque; `\(…\)` → en línea. El dólar simple `$…$` **hay que activarlo** con `inline-math`, porque se confunde con una cantidad de dinero.

## Referencia de la API

### Atributos

| Atributo       | Tipo                                        | Por defecto   | Descripción                                                                                                                                    |
| -------------- | ------------------------------------------- | ------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| `content`      | `string`                                    | —             | Fuente Markdown. La **propiedad** `content` manda y no se refleja; si no hay ninguna, se usa el texto del elemento.                            |
| `mode`         | `'streaming' \| 'static'`                   | `'streaming'` | `streaming` cierra el markdown incompleto y compara por bloques; `static` dibuja todo el texto tal cual, de una pasada.                        |
| `caret`        | booleano / `'circle'`                       | apagado       | Cursor parpadeante tras el último bloque (`▋`, o `●` con `circle`).                                                                            |
| `copy`         | booleano                                    | apagado       | Botón de copiar en los bloques de código (se reenvía al `<r-mermaid>` incrustado).                                                             |
| `download`     | booleano                                    | apagado       | Botón de descargar en los bloques de código (`code.<ext>` según el lenguaje).                                                                  |
| `line-numbers` | booleano                                    | apagado       | Números de línea en los bloques de código.                                                                                                     |
| `highlight`    | booleano / nombres de tema `"claro oscuro"` | apagado       | Resaltado con shiki. A secas → `github-light github-dark`; un nombre → los dos; dos nombres → claro / oscuro.                                  |
| `inline-math`  | booleano                                    | apagado       | Trata `$…$` como matemáticas en línea (`\(…\)` siempre lo es).                                                                                 |
| `link-target`  | `string`                                    | `'_blank'`    | `target` de los enlaces externos (se añade `rel="noopener noreferrer"`). `_self` los deja intactos. Los `#anclajes` internos nunca lo reciben. |
| `theme`        | `'auto' \| 'light' \| 'dark'`               | `'auto'`      | Tema del resaltado y los diagramas. `auto` sigue a la página (`.dark`, `[data-ran-theme]`, si no `prefers-color-scheme`).                      |
| `sheet`        | `string`                                    | —             | CSS adicional inyectado en el shadow root.                                                                                                     |
| `label-*`      | `string`                                    | inglés        | Sobrescribe las etiquetas de los controles: `label-copy`, `label-download`.                                                                    |

Alias de propiedad: `content`, `mode`, `caret`, `copyable`, `downloadable`, `lineNumbers`, `highlight`, `inlineMath`, `linkTarget`, `theme`, `sheet`.

## Eventos

Todos los eventos burbujean y cruzan la frontera del shadow DOM (`composed`).

| Evento     | `detail`                               | Se dispara cuando                                   |
| ---------- | -------------------------------------- | --------------------------------------------------- |
| `render`   | `{ blocks: number, changed: number }`  | una pasada de dibujado cambió al menos un bloque    |
| `copied`   | `{ kind: 'code', language, code }`     | se copió un bloque de código                        |
| `download` | `{ kind: 'code', language, filename }` | se descargó un bloque de código                     |
| `error`    | `{ message: string }`                  | falló el análisis o el dibujado (también se ve ahí) |

## Parts CSS

| Part           | Descripción                                           |
| -------------- | ----------------------------------------------------- |
| `markdown`     | El envoltorio exterior.                               |
| `body`         | El contenedor de bloques.                             |
| `block`        | Cada bloque dibujado.                                 |
| `code`         | El contenedor de un bloque de código.                 |
| `code-header`  | La barra de lenguaje y acciones de un bloque.         |
| `code-lang`    | La etiqueta del lenguaje.                             |
| `code-actions` | El grupo de botones de acción.                        |
| `button`       | Cada botón de copiar o descargar.                     |
| `table`        | El envoltorio de tabla con desplazamiento horizontal. |
| `error`        | La caja de error (cuando el dibujado falla).          |

```css
r-markdown::part(code) {
  border-radius: 8px;
}
```

## Variables CSS

Sobrescríbelas en el elemento (cada una recurre a un token semántico y luego a un valor literal): `--ran-markdown-color`, `--ran-markdown-font-size`, `--ran-markdown-line-height`, `--ran-markdown-gap`, `--ran-markdown-heading-color`, `--ran-markdown-link-color`, `--ran-markdown-inline-code-bg`, `--ran-markdown-code-bg`, `--ran-markdown-code-border`, `--ran-markdown-code-radius`, `--ran-markdown-code-font-size`, `--ran-markdown-mono-font`, `--ran-markdown-blockquote-border`, `--ran-markdown-table-border`, `--ran-markdown-table-header-bg`, `--ran-markdown-caret`, `--ran-markdown-caret-color`, `--ran-markdown-button-color`, `--ran-markdown-error-color`.

## Notas

- **Carga diferida**: el trozo del analizador (marked + DOMPurify + remend) se carga en el primer dibujado; shiki, mermaid y Temml se cargan solo cuando el contenido los usa. Las aplicaciones que nunca dibujan markdown no pagan nada.
- **Saneado**: el HTML crudo dentro del markdown pasa por DOMPurify: se eliminan los scripts, los manejadores de eventos, las URL `javascript:`, `<style>`, los formularios y los iframes. Las casillas de las listas de tareas sobreviven.
- **La comparación por bloques** los indexa por posición, así que el estado del DOM dentro de los bloques intactos (un diagrama abierto a pantalla completa, una tabla desplazada) sobrevive a las actualizaciones del streaming. El documento se analiza léxicamente una vez y cada bloque se dibuja a partir de sus propios tokens, de modo que una definición de referencia de enlace se resuelve entre bloques (`[text][id]` en uno, `[id]: url` en otro).
- **Las notas al pie de GFM** (`[^1]`) **no** están soportadas: marked no tiene tokenizador de notas al pie, así que los marcadores se dibujan como texto literal.
- **shiki se resuelve desde tu propia instalación.** La compilación ES deja `import('shiki')` sin tocar, así que tu empaquetador lo divide en trozos y descarga solo las gramáticas que usan tus cercas de código. shiki es una dependencia normal de ranui, así que `npm i ranui` ya lo trae; no hay que añadir nada más.
- **IIFE independiente**: `dist/iife/markdown.iife.js` no tiene resolutor, así que en su lugar incrusta mermaid, Temml y el paquete de lenguajes _web_ de shiki (unos 50 lenguajes comunes). Para cobertura completa de lenguajes y una descarga menor, prefiere la entrada ES (`ranui/markdown`).
