---
description: 'Renderiza diagramas de Mermaid (flujo, secuencia, clases, estados, gantt) como un web component independiente de framework, con carga diferida.'
---

# Mermaid

Renderiza diagramas de [Mermaid](https://mermaid.js.org/) (flujo, secuencia, clases, estados,
gantt…) como un web component independiente de cualquier framework. `<r-mermaid>` carga la
biblioteca mermaid de forma diferida en el primer render (las aplicaciones que nunca la usan no
pagan nada) y dibuja el diagrama en su shadow root, de modo que queda aislado de los estilos de la
página.

> **Úsalo cuando** quieras poner en cualquier página un diagrama escrito como texto sin cablear
> mermaid tú mismo, opcionalmente con una barra de copiar / descargar / pantalla completa y un
> visor con desplazamiento y zoom.

## Inicio rápido

<Demo>
  <r-mermaid>graph LR; A[Request] --> B[Validate]; B --> C[Store]; C --> D[Respond]</r-mermaid>
</Demo>

```html
<r-mermaid>graph LR; A[Request] --> B[Validate]; B --> C[Store]</r-mermaid>
```

```js
import 'ranui'; // o la entrada independiente:
import 'ranui/mermaid';
```

El origen del diagrama se lee del **contenido de texto** del elemento o de un atributo `code`
codificado en URI (usa `code` cuando la sintaxis contenga `<`, por ejemplo el `<|--` de
`classDiagram`, para que sobreviva al análisis del HTML):

```js
el.code = 'classDiagram\n  Dog --|> Animal'; // el setter de la propiedad codifica en URI por ti
```

## Controles

Cada control se activa **explícitamente** con un atributo booleano; un `<r-mermaid>` a secas es un
diagrama estático y limpio. La barra aparece al pasar el ratón (arriba a la derecha).

<Demo>
  <r-mermaid copy download fullscreen>graph TD; A[Start] --> B[Do work]; B --> C[End]</r-mermaid>
</Demo>

```html
<r-mermaid copy download fullscreen>graph TD; A --> B; B --> C</r-mermaid>
```

- **copy**: copia el origen del diagrama al portapapeles.
- **download**: SVG / PNG / origen (`.mmd`); con un solo formato descarga directamente, con varios
  muestra un menú. Limítalo con `download="svg"` o `download="svg png"`.
- **fullscreen**: abre una caja de luz sin cabecera (r-modal) con **desplazamiento y zoom** (rueda
  para acercar, arrastrar para mover, con reinicio); se cierra con la ✕, un clic en el fondo o `Esc`.

## Referencia de la API

### Atributos

| Atributo     | Tipo                          | Por defecto | Descripción                                                                                                                                                            |
| ------------ | ----------------------------- | ----------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `code`       | `string` (codificado en URI)  | —           | Origen del diagrama. Si falta, recurre al contenido de texto del elemento.                                                                                             |
| `theme`      | `'auto' \| 'light' \| 'dark'` | `'auto'`    | Tema de mermaid. `auto` sigue a la página (`.dark` / `[data-ran-theme]`) y vuelve a renderizar al cambiar.                                                             |
| `copy`       | booleano                      | apagado     | Muestra el botón de copiar el origen.                                                                                                                                  |
| `download`   | booleano / `"svg png source"` | apagado     | Muestra el botón de descarga; el valor limita los formatos ofrecidos.                                                                                                  |
| `fullscreen` | booleano                      | apagado     | Muestra el botón de pantalla completa.                                                                                                                                 |
| `sheet`      | `string`                      | —           | CSS extra inyectado en el shadow root.                                                                                                                                 |
| `label-*`    | `string`                      | Inglés      | Sobrescribe las etiquetas: `label-copy`, `label-download`, `label-fullscreen`, `label-zoom-in`, `label-zoom-out`, `label-reset`, `label-diagram` (nombre del diálogo). |

## Eventos

Todos los eventos burbujean y cruzan el límite del shadow (`composed`).

| Evento             | `detail`                                 | Se dispara cuando                              |
| ------------------ | ---------------------------------------- | ---------------------------------------------- |
| `render`           | `{ ok: true }`                           | un diagrama termina de renderizarse            |
| `copied`           | `{ kind: 'source' }`                     | se copió el origen                             |
| `download`         | `{ format: 'svg' \| 'png' \| 'source' }` | se descargó un archivo                         |
| `error`            | `{ message: string }`                    | el diagrama falló al analizarse o renderizarse |
| `fullscreenchange` | `{ open: boolean }`                      | la caja de luz se abrió o se cerró             |

## Partes CSS

| Parte     | Descripción                                  |
| --------- | -------------------------------------------- |
| `mermaid` | El envoltorio exterior.                      |
| `diagram` | El contenedor del diagrama renderizado.      |
| `toolbar` | La barra de controles que aparece al pasar.  |
| `button`  | Cada botón de icono de la barra.             |
| `error`   | El cuadro de error (cuando falla el render). |

```css
r-mermaid::part(toolbar) {
  background: var(--surface);
}
```

## Variables CSS

Sobrescríbelas en el elemento (cada una recurre a un token semántico y luego a un literal):
`--ran-mermaid-padding`, `--ran-mermaid-toolbar-background`, `--ran-mermaid-toolbar-gap`,
`--ran-mermaid-button-size`, `--ran-mermaid-button-color`, `--ran-mermaid-button-hover-background`,
`--ran-mermaid-error-color`.

## Notas

- **Carga diferida**: mermaid (y el r-modal que usa la pantalla completa) son importaciones
  dinámicas, así que llegan como fragmentos asíncronos aparte solo cuando se renderiza un diagrama
  o se abre la pantalla completa.
- **Fidelidad del render**: `<r-mermaid>` usa el render propio de mermaid, así que admite todos los
  tipos de diagrama y todos los temas.
- **Exportar a PNG**: los diagramas con etiquetas HTML (`htmlLabels` de mermaid) se dibujan con
  `<foreignObject>`, lo que puede contaminar el canvas y hacer fallar la exportación a PNG; en ese
  caso se despacha un evento `error`. Exportar SVG y el origen siempre funciona.
