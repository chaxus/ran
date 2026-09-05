---
description: 'Rendert Mermaid-Diagramme (Flussdiagramme, Sequenz, Klassen, Zustände, Gantt) als frameworkunabhängige Web Component mit nachgeladener Bibliothek.'
---

# Mermaid

Rendert [Mermaid](https://mermaid.js.org/)-Diagramme (Flussdiagramme, Sequenz, Klassen, Zustände,
Gantt …) als frameworkunabhängige Web Component. `<r-mermaid>` lädt die mermaid-Bibliothek beim
ersten Rendern nach (Anwendungen, die sie nie verwenden, zahlen nichts) und zeichnet das Diagramm in
seinen Shadow Root, wodurch es von den Seitenstilen isoliert bleibt.

> **Nimm es, wenn** du ein aus Text beschriebenes Diagramm in eine beliebige Seite setzen willst,
> ohne mermaid selbst zu verdrahten — wahlweise mit Kopier-, Download- und Vollbild-Leiste sowie
> einem Betrachter zum Schwenken und Zoomen.

## Schnellstart

<Demo>
  <r-mermaid>graph LR; A[Request] --> B[Validate]; B --> C[Store]; C --> D[Respond]</r-mermaid>
</Demo>

```html
<r-mermaid>graph LR; A[Request] --> B[Validate]; B --> C[Store]</r-mermaid>
```

```js
import 'ranui'; // oder der eigenständige Einstiegspunkt:
import 'ranui/mermaid';
```

Die Diagrammquelle wird aus dem **Textinhalt** des Elements gelesen oder aus einem URI-kodierten
Attribut `code` (nimm `code`, wenn die Syntax ein `<` enthält, etwa das `<|--` von `classDiagram`,
damit sie das HTML-Parsing übersteht):

```js
el.code = 'classDiagram\n  Dog --|> Animal'; // der Property-Setter kodiert für dich als URI
```

## Bedienelemente

Jedes Bedienelement wird **ausdrücklich** über ein boolesches Attribut eingeschaltet; ein nacktes
`<r-mermaid>` ist ein sauberes statisches Diagramm. Die Leiste erscheint beim Überfahren (oben
rechts).

<Demo>
  <r-mermaid copy download fullscreen>graph TD; A[Start] --> B[Do work]; B --> C[End]</r-mermaid>
</Demo>

```html
<r-mermaid copy download fullscreen>graph TD; A --> B; B --> C</r-mermaid>
```

- **copy**: kopiert die Diagrammquelle in die Zwischenablage.
- **download**: SVG / PNG / Quelle (`.mmd`); bei einem einzigen Format wird direkt heruntergeladen,
  bei mehreren erscheint ein Menü. Einschränken mit `download="svg"` oder `download="svg png"`.
- **fullscreen**: öffnet eine kopfzeilenlose Lightbox (r-modal) mit **Schwenken und Zoomen**
  (Mausrad zum Zoomen, Ziehen zum Schwenken, Zurücksetzen); Schließen über ✕, Klick auf den
  Hintergrund oder `Esc`.

## API-Referenz

### Attribute

| Attribut     | Typ                           | Standard | Beschreibung                                                                                                                                                                       |
| ------------ | ----------------------------- | -------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `code`       | `string` (URI-kodiert)        | —        | Diagrammquelle. Fehlt sie, wird auf den Textinhalt des Elements zurückgegriffen.                                                                                                   |
| `theme`      | `'auto' \| 'light' \| 'dark'` | `'auto'` | mermaid-Theme. `auto` folgt der Seite (`.dark` / `[data-ran-theme]`) und rendert beim Umschalten neu.                                                                              |
| `copy`       | boolesch                      | aus      | Zeigt die Schaltfläche zum Kopieren der Quelle.                                                                                                                                    |
| `download`   | boolesch / `"svg png source"` | aus      | Zeigt die Download-Schaltfläche; der Wert schränkt die angebotenen Formate ein.                                                                                                    |
| `fullscreen` | boolesch                      | aus      | Zeigt die Vollbild-Schaltfläche.                                                                                                                                                   |
| `sheet`      | `string`                      | —        | Zusätzliches CSS, das in den Shadow Root injiziert wird.                                                                                                                           |
| `label-*`    | `string`                      | Englisch | Überschreibt die Beschriftungen: `label-copy`, `label-download`, `label-fullscreen`, `label-zoom-in`, `label-zoom-out`, `label-reset`, `label-diagram` (Name des Vollbilddialogs). |

## Events

Alle Events bubbeln und überschreiten die Shadow-Grenze (`composed`).

| Event              | `detail`                                 | Wird ausgelöst, wenn                               |
| ------------------ | ---------------------------------------- | -------------------------------------------------- |
| `render`           | `{ ok: true }`                           | ein Diagramm fertig gerendert ist                  |
| `copied`           | `{ kind: 'source' }`                     | die Quelle kopiert wurde                           |
| `download`         | `{ format: 'svg' \| 'png' \| 'source' }` | eine Datei heruntergeladen wurde                   |
| `error`            | `{ message: string }`                    | das Diagramm nicht geparst/gerendert werden konnte |
| `fullscreenchange` | `{ open: boolean }`                      | die Vollbild-Lightbox geöffnet/geschlossen wurde   |

## CSS-Parts

| Part      | Beschreibung                                         |
| --------- | ---------------------------------------------------- |
| `mermaid` | Der äußere Wrapper.                                  |
| `diagram` | Der Container des gerenderten Diagramms.             |
| `toolbar` | Die beim Überfahren erscheinende Bedienleiste.       |
| `button`  | Jede Icon-Schaltfläche der Leiste.                   |
| `error`   | Die Fehlermeldungsbox (bei fehlgeschlagenem Render). |

```css
r-mermaid::part(toolbar) {
  background: var(--surface);
}
```

## CSS-Variablen

Am Element überschreiben (jede greift auf ein semantisches Token und dann auf einen Literalwert
zurück): `--ran-mermaid-padding`, `--ran-mermaid-toolbar-background`, `--ran-mermaid-toolbar-gap`,
`--ran-mermaid-button-size`, `--ran-mermaid-button-color`, `--ran-mermaid-button-hover-background`,
`--ran-mermaid-error-color`.

## Hinweise

- **Nachgeladen**: mermaid (und das r-modal für das Vollbild) sind dynamische Importe und kommen
  daher nur als separate asynchrone Chunks, wenn ein Diagramm rendert bzw. das Vollbild öffnet.
- **Rendertreue**: `<r-mermaid>` nutzt mermaids eigenen Render, alle Diagrammtypen und Themes werden
  also unterstützt.
- **PNG-Export**: Diagramme mit HTML-Beschriftungen (mermaids `htmlLabels`) werden über
  `<foreignObject>` gezeichnet, was das Canvas verunreinigen und den PNG-Export scheitern lassen
  kann; in dem Fall wird ein `error`-Event ausgelöst. SVG- und Quell-Export funktionieren immer.
