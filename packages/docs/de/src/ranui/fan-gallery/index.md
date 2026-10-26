---
description: 'Die FanGallery von ranui (<r-fan-gallery>) fächert ihre Kinder wie ein Blatt Spielkarten auf, öffnet sich mit einer Feder, sobald sie zum ersten Mal ins Bild scrollt, und hebt das Kind unter dem Zeiger oder mit dem Fokus an.'
---

# FanGallery

Fächert ihre Kinder wie ein Blatt Spielkarten auf. Jedes Kind dreht sich um einen Punkt unterhalb
der Reihe, sodass die Gruppe als ein Objekt wirkt und nicht als Streifen.

> **Verwenden, wenn** eine Handvoll Cover, Screenshots oder Karten als Satz wirken soll und es
> weniger darauf ankommt, jedes vollständig zu zeigen, als darauf, dass es mehrere sind. Für
> Inhalte, die Leser nebeneinander vergleichen müssen, besser ein Raster verwenden.

## Schnellstart

### Grundlegende Verwendung

<ran-demo>
  <r-fan-gallery>
    <button type="button" style="border:0;font:inherit;display:grid;place-items:center;width:120px;height:160px;border-radius:12px;background:#e8d5b7;color:#333">1</button>
    <button type="button" style="border:0;font:inherit;display:grid;place-items:center;width:120px;height:160px;border-radius:12px;background:#b7d0e8;color:#333">2</button>
    <button type="button" style="border:0;font:inherit;display:grid;place-items:center;width:120px;height:160px;border-radius:12px;background:#c8e8b7;color:#333">3</button>
    <button type="button" style="border:0;font:inherit;display:grid;place-items:center;width:120px;height:160px;border-radius:12px;background:#e8b7c8;color:#333">4</button>
  </r-fan-gallery>
</ran-demo>

```html
<r-fan-gallery>
  <a href="/one">1</a>
  <a href="/two">2</a>
  <a href="/three">3</a>
  <a href="/four">4</a>
</r-fan-gallery>
```

Die Kinder sind Ihre eigenen Elemente. Links, Buttons und Bilder behalten ihre Rollen, ihre Namen
und ihren Platz in der Tab-Reihenfolge; die Galerie bewegt sie nur.

### Fächerwinkel

`spread` ist der Winkel in Grad zwischen dem ersten und dem letzten Kind. Bei `0` liegen alle
übereinander.

<ran-demo>
  <r-fan-gallery spread="48">
    <div style="width:96px;height:128px;border-radius:12px;background:#d2b7e8"></div>
    <div style="width:96px;height:128px;border-radius:12px;background:#b7d0e8"></div>
    <div style="width:96px;height:128px;border-radius:12px;background:#c8e8b7"></div>
    <div style="width:96px;height:128px;border-radius:12px;background:#e8d5b7"></div>
    <div style="width:96px;height:128px;border-radius:12px;background:#e8b7c8"></div>
  </r-fan-gallery>
</ran-demo>

```html
<r-fan-gallery spread="48">…</r-fan-gallery>
```

## Bewegung

- **Öffnen.** Bis die Galerie zum ersten Mal ins Bild scrollt, liegen ihre Kinder gestapelt, das
  vorderste ist also von Anfang an lesbar. Sobald sie erscheint, öffnet sich der Fächer mit einer
  Feder, ein Kind nach dem anderen. Er öffnet sich einmal pro Seite; weg- und zurückscrollen
  spielt ihn nicht erneut ab.
- **Zeiger und Fokus.** Das Kind unter dem Zeiger oder mit dem Fokus hebt sich und kommt nach
  vorn, seine Nachbarn drehen sich ein wenig zur Seite. Die Reaktion ist sofort da, und eine neue
  Geste setzt dort an, wo die vorige gerade war.
- **Reduzierte Bewegung.** Mit `prefers-reduced-motion: reduce` ist der Fächer von Anfang an offen,
  und jede Änderung wird ohne Übergang angewendet.

## API-Referenz

### Eigenschaften

| Eigenschaft | Attribut | Typ      | Standard | Beschreibung                                                        |
| ----------- | -------- | -------- | -------- | ------------------------------------------------------------------- |
| `spread`    | `spread` | `string` | `'24'`   | Winkel in Grad zwischen erstem und letztem Kind im offenen Zustand. |
| `sheet`     | `sheet`  | `string` | `''`     | CSS, das in den Shadow Root injiziert wird.                         |

### Parts

| Part    | Element                                          |
| ------- | ------------------------------------------------ |
| `stage` | Das Raster, in dem alle Kinder gestapelt liegen. |

### Styling

| Token                       | Standard         | Wirkung                                                                  |
| --------------------------- | ---------------- | ------------------------------------------------------------------------ |
| `--ran-fan-gallery-padding` | `--ran-space-10` | Raum um die Stage, in den die gedrehten Ecken ausschwenken.              |
| `--ran-fan-gallery-pivot`   | `320px`          | Wie weit unter der Reihe sich die Kinder drehen. Kürzer fächert weiter.  |
| `--ran-fan-gallery-lift`    | `--ran-space-4`  | Wie weit sich das Kind unter dem Zeiger oder mit dem Fokus herausbewegt. |

Die Galerie ist so hoch wie ihr höchstes Kind. Gedrehte Ecken ragen über die Stage hinaus, also
Platz darum lassen oder `--ran-fan-gallery-padding` erhöhen.
