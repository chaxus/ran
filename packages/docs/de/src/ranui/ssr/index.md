---
description: 'Rendere ranui-Komponenten auf dem Server zu deklarativem Shadow DOM mit ranui/ssr-stream — für ein korrektes erstes Bild, bevor irgendein JavaScript läuft.'
---

# Server-Rendering

ranui-Komponenten serialisieren zu **deklarativem Shadow DOM**, ein Server kann also das echte
Markup ausgeben, und das erste Bild stimmt, bevor irgendein JavaScript läuft.

> **Nimm es, wenn** du Seiten auf einem Server oder zur Bauzeit renderst (ein SSG, eine
> Express-/Hono-/Workers-Route, ein Job für E-Mail-Vorschauen) und `<r-*>`-Elemente als sichtbares
> Markup ankommen sollen statt als leere Tags, die auf Hydration warten.

## Schnellstart

```js
import 'ranui'; // füllt die SSR-Registry — mach das zuerst
import { renderHTMLToString } from 'ranui/ssr-stream';

const html = await renderHTMLToString(`
  <r-button type="primary">Submit</r-button>
  <r-progress percent="65"></r-progress>
`);
```

Jedes registrierte `<r-*>`-Tag wird instanziiert, seine Attribute werden angewendet, seine Kinder
rekursiv gerendert, und das Ergebnis wird mit einem `<template shadowrootmode="closed">` darin
ausgegeben. Unbekannte Tags gehen unverändert durch, du kannst es also gefahrlos über eine ganze
Seite gewöhnlichen HTMLs laufen lassen.

### Streaming

`renderToStream` ist derselbe Renderer als asynchroner Generator, sodass statische Chunks den
Client erreichen, während spätere Komponenten noch rendern:

```js
import { renderToStream } from 'ranui/ssr-stream';

for await (const chunk of renderToStream(pageHtml)) response.write(chunk);
```

### Eine Komponente auf einmal

`ranui/ssr` rendert eine Instanz, die du selbst gebaut hast — nützlich, wenn du einen Baum in Node
zusammensetzt, statt eine Zeichenkette zu templaten:

```js
import { renderToString } from 'ranui/ssr';
import { Button } from 'ranui';

const html = renderToString(new Button());
```

## API-Referenz

| Export                     | Einstiegspunkt     | Signatur                                   | Beschreibung                                                          |
| -------------------------- | ------------------ | ------------------------------------------ | --------------------------------------------------------------------- |
| `renderHTMLToString(html)` | `ranui/ssr-stream` | `(html: string) => Promise<string>`        | Expandiert jedes registrierte `<r-*>`-Tag in einer HTML-Zeichenkette. |
| `renderToStream(html)`     | `ranui/ssr-stream` | `(html: string) => AsyncGenerator<string>` | Dasselbe, Chunk für Chunk.                                            |
| `renderToString(el)`       | `ranui/ssr`        | `(component) => string`                    | Serialisiert eine Komponenteninstanz.                                 |
| `RanElement`               | `ranui/ssr`        | Klasse                                     | `HTMLElement` im Browser, das SSR-Mock in Node.                       |
| `h(tag, props, …children)` | `ranui/ssr`        | `(tag, props?, ...children) => string`     | Kleiner Helfer, um Markup von Hand zu bauen.                          |

## Was der Server kann und was nicht

**Der Client baut neu; er verwendet nichts wieder.** ranui hängt **geschlossene** Shadow Roots an,
und `attachShadow` an einem Element, das bereits einen deklarativen Shadow Root hat, _entfernt die
Kinder dieses Roots_, wenn der Modus geschlossen ist. Der servergerenderte Baum malt also das erste
Bild und wird dann durch einen identischen, clientseitig gebauten ersetzt. Zwei Folgen:

- Du bekommst ein korrektes erstes Bild, keine Wiederverwendung bei der Hydration: Geschlossene
  Shadow Roots kann der Client aus dem genannten Grund nicht wiederverwenden. Siehe die
  [Coding-Richtlinien](/de/src/ranui/coding-guides/#server-rendering).
- **Lege niemals Zustand in das servergerenderte Shadow-Markup** in der Erwartung, der Client lese
  ihn zurück. Reiche ihn über Attribute weiter — die überleben.

**Nichts Gemessenes existiert auf dem Server.** Alles, was von `getBoundingClientRect` oder
`offsetWidth` abhängt, wird nach dem Mounten im Browser aufgelöst. Genau deshalb sind die
Komponenten so geschrieben, dass ihr Anfangslayout aus dem CSS kommt.

**Vier Elemente rendern derzeit nicht auf dem Server**, jedes, weil es im Konstruktor eine
Browser-API anfasst: `<r-content>` (`MutationObserver`), `<r-link>` (`document`), `<r-modal>` (eine
Slot-Methode, die das SSR-Mock nicht umsetzt) und `<r-radar>` (`ResizeObserver`). Sie gehen als
schlichte Tags durch und werden auf dem Client aufgewertet. Für jedes andere Element gibt es einen
Test, der fehlschlägt, sobald es nicht mehr rendert — diese Liste kann also nicht still wachsen.

## Theming und Aufblitzen

`initTheme()` tut auf dem Server nichts (jeder Zugriff auf `document` / `localStorage` /
`matchMedia` ist abgesichert), das Theme wendet also der Client an. Um ein Aufblitzen des falschen
Themes zu vermeiden, setze `data-ran-theme` am `<html>` deiner Servervorlage (aus einem Cookie oder
aus einem winzigen Inline-Skript, das vor dem ersten Rendern `localStorage` liest) und lass danach
[`initTheme`](/de/src/ranui/theme/) übernehmen.

## Bewährte Praxis

- **Importiere `ranui` (oder die einzelnen `ranui/<component>`-Einstiegspunkte) vor dem Rendern.**
  Die Registry wird durch den Seiteneffekt des Imports gefüllt; ohne ihn geht jedes Tag unexpandiert
  durch und die Seite verliert ihr Markup, ohne dass es auffällt.
- **Rendere die Seite, nicht das Fragment.** `renderHTMLToString` ist über beliebiges HTML sicher, du
  musst die ranui-Teile also nicht herauslösen.
- **Liefere das Stylesheet mit.** DSD-Markup trägt die Styles der Komponente, aber die Tokens auf
  Seitenebene kommen aus `ranui/style` (und `ranui/fonts` für die Schriften).
