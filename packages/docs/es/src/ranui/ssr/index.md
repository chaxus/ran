---
description: 'Renderiza componentes de ranui en el servidor a shadow DOM declarativo con ranui/ssr-stream, para que el primer pintado sea correcto antes de que se ejecute JavaScript.'
---

# Renderizado en servidor

Los componentes de ranui se serializan a **shadow DOM declarativo**, así que un servidor puede
emitir el marcado real y el primer pintado es correcto antes de que se ejecute nada de JavaScript.

> **Úsalo cuando** rendericen páginas en un servidor o en tiempo de compilación (un SSG, una ruta de
> Express/Hono/Workers, un trabajo de vista previa de correo) y quieras que los elementos `<r-*>`
> lleguen como marcado visible y no como etiquetas vacías esperando la hidratación.

## Inicio rápido

```js
import 'ranui'; // llena el registro de SSR — haz esto primero
import { renderHTMLToString } from 'ranui/ssr-stream';

const html = await renderHTMLToString(`
  <r-button type="primary">Submit</r-button>
  <r-progress percent="65"></r-progress>
`);
```

Cada etiqueta `<r-*>` registrada se instancia, se le aplican sus atributos, sus hijos se renderizan
de forma recursiva y el resultado se emite con un `<template shadowrootmode="closed">` dentro. Las
etiquetas desconocidas pasan intactas, así que es seguro ejecutarlo sobre una página entera de HTML
corriente.

### Streaming

`renderToStream` es el mismo renderizador como generador asíncrono, de modo que los fragmentos
estáticos llegan al cliente mientras otros componentes todavía se renderizan:

```js
import { renderToStream } from 'ranui/ssr-stream';

for await (const chunk of renderToStream(pageHtml)) response.write(chunk);
```

### Un componente a la vez

`ranui/ssr` renderiza una instancia que hayas construido tú, útil cuando ensamblas un árbol en Node
en lugar de plantillar una cadena:

```js
import { renderToString } from 'ranui/ssr';
import { Button } from 'ranui';

const html = renderToString(new Button());
```

## Referencia de la API

| Export                     | Entrada            | Firma                                      | Descripción                                                     |
| -------------------------- | ------------------ | ------------------------------------------ | --------------------------------------------------------------- |
| `renderHTMLToString(html)` | `ranui/ssr-stream` | `(html: string) => Promise<string>`        | Expande cada etiqueta `<r-*>` registrada de una cadena de HTML. |
| `renderToStream(html)`     | `ranui/ssr-stream` | `(html: string) => AsyncGenerator<string>` | Lo mismo, fragmento a fragmento.                                |
| `renderToString(el)`       | `ranui/ssr`        | `(component) => string`                    | Serializa la instancia de un componente.                        |
| `RanElement`               | `ranui/ssr`        | clase                                      | `HTMLElement` en un navegador, la simulación de SSR en Node.    |
| `h(tag, props, …children)` | `ranui/ssr`        | `(tag, props?, ...children) => string`     | Pequeña ayuda para construir marcado a mano.                    |

## Qué puede y qué no puede hacer el servidor

**El cliente reconstruye; no reutiliza.** ranui adjunta shadow roots **cerrados**, y `attachShadow`
sobre un elemento que ya tiene un shadow root declarativo _elimina los hijos de ese root_ cuando el
modo es cerrado. Así que el árbol renderizado en el servidor pinta el primer fotograma y luego lo
sustituye uno idéntico construido en el cliente. Dos consecuencias:

- Obtienes un primer pintado correcto, no reutilización de hidratación: los shadow roots cerrados no
  pueden ser reutilizados por el cliente, por lo dicho arriba. Consulta la
  [guía de código](/es/src/ranui/coding-guides/#server-rendering).
- **Nunca guardes estado en el marcado del shadow renderizado en el servidor** esperando que el
  cliente lo lea de vuelta. Pásalo por atributos, que sí sobreviven.

**Nada medido existe en el servidor.** Todo lo que dependa de `getBoundingClientRect` o de
`offsetWidth` se resuelve tras el montaje, en el navegador. Los componentes están escritos para que
su maquetación inicial venga del CSS precisamente por esto.

**Hoy hay cuatro elementos que no se renderizan en servidor**, cada uno porque toca una API del
navegador en su constructor: `<r-content>` (`MutationObserver`), `<r-link>` (`document`),
`<r-modal>` (un método de slot que la simulación de SSR no implementa) y `<r-radar>`
(`ResizeObserver`). Pasan como etiquetas normales y se actualizan en el cliente. Todos los demás
elementos tienen una prueba que falla si dejan de renderizarse, así que esta lista no puede crecer
en silencio.

## Temas y destellos

`initTheme()` no hace nada en el servidor (todo acceso a `document` / `localStorage` / `matchMedia`
está protegido), así que el tema lo aplica el cliente. Para evitar un destello con el tema
equivocado, define `data-ran-theme` en el `<html>` de tu plantilla de servidor (desde una cookie, o
desde un script en línea diminuto que lea `localStorage` antes del primer pintado) y deja que
[`initTheme`](/es/src/ranui/theme/) tome el relevo después.

## Buenas prácticas

- **Importa `ranui` (o las entradas concretas `ranui/<component>`) antes de renderizar.** El registro
  se llena por el efecto secundario del import; sin él, cada etiqueta pasa sin expandirse y la página
  pierde su marcado en silencio.
- **Renderiza la página, no el fragmento.** `renderHTMLToString` es seguro sobre HTML arbitrario, así
  que no hace falta aislar las partes de ranui.
- **Envía la hoja de estilos.** El marcado DSD lleva los estilos del componente, pero los tokens a
  nivel de página vienen de `ranui/style` (y de `ranui/fonts` para las tipografías).
