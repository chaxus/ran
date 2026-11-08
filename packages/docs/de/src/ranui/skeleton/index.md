---
description: 'Das Skeleton von ranui (<r-skeleton>) zeigt einen schimmernden Platzhalter, der den Platz des Inhalts einnimmt, solange dieser lädt.'
---

# Skeleton

Platzhaltergrafik, die den Platz des Inhalts einnimmt, solange dieser lädt — mit einer schimmernden Animation.

> **Nimm es, wenn** du einen schimmernden Platzhalterbalken brauchst, der den Platz für Inhalt freihält, solange er lädt. Gib dem Elternelement von `<r-skeleton>` die Maße des echten Inhalts und tausche es aus, sobald die Daten da sind.

## Schnellstart

### Grundlegende Verwendung

Das Skeleton füllt die Breite seines Elternelements und ist standardmäßig `16px` hoch.

<ran-demo>
  <r-skeleton></r-skeleton>
</ran-demo>

```html
<r-skeleton></r-skeleton>
```

### Die Breite folgt dem Elternelement

Da das Skeleton `width: 100%` ist, steuerst du seine Länge über die Größe des Containers, in dem es liegt.

<ran-demo column>
  <div style="width: 100px">
    <r-skeleton></r-skeleton>
  </div>
  <div style="width: 200px">
    <r-skeleton></r-skeleton>
  </div>
  <div style="width: 100%">
    <r-skeleton></r-skeleton>
  </div>
</ran-demo>

```html
<div style="width: 100px">
  <r-skeleton></r-skeleton>
</div>
<div style="width: 200px">
  <r-skeleton></r-skeleton>
</div>
<div style="width: 100%">
  <r-skeleton></r-skeleton>
</div>
```

### Platzhalter stapeln

Setze mehrere Skeletons zusammen, um einen Textblock oder einen Absatz nachzubilden.

<ran-demo column>
  <div style="width: 100%; display: flex; flex-direction: column; gap: 12px">
    <r-skeleton></r-skeleton>
    <r-skeleton></r-skeleton>
    <r-skeleton></r-skeleton>
  </div>
</ran-demo>

```html
<div style="display: flex; flex-direction: column; gap: 12px">
  <r-skeleton></r-skeleton>
  <r-skeleton></r-skeleton>
  <r-skeleton></r-skeleton>
</div>
```

## API-Referenz

### Eigenschaften

| Eigenschaft | Typ      | Standard | Beschreibung                                                           |
| ----------- | -------- | -------- | ---------------------------------------------------------------------- |
| `sheet`     | `string` | `''`     | CSS, das für gekapselte Überschreibungen ins Shadow DOM injiziert wird |

### Eigenes Styling `sheet`

Übergib über `sheet` eine CSS-Zeichenkette, um das Aussehen des Skeletons in seinem Shadow DOM zu überschreiben.

<ran-demo>
  <r-skeleton sheet=".ran-skeleton { height: 40px; border-radius: 20px; }"></r-skeleton>
</ran-demo>

```html
<r-skeleton sheet=".ran-skeleton { height: 40px; border-radius: 20px; }"></r-skeleton>
```

### CSS-Variablen

Für Theming ohne `sheet` stellt das Skeleton außerdem CSS-Custom-Properties bereit:

| Variable                                    | Standard                       | Beschreibung                   |
| ------------------------------------------- | ------------------------------ | ------------------------------ |
| `--ran-skeleton-height`                     | `16px`                         | Höhe des Platzhalterbalkens    |
| `--ran-skeleton-background`                 | `var(--ran-gray-alpha-200, …)` | Grundfarbe ohne Schimmer       |
| `--ran-skeleton-border-radius`              | `var(--ran-radius-sm, 6px)`    | Eckenradius                    |
| `--ran-skeleton-shimmer-background`         | `linear-gradient(90deg, …)`    | Verlauf des wandernden Glanzes |
| `--ran-skeleton-shimmer-animation-duration` | `1.4s`                         | Dauer eines Schimmerdurchlaufs |

<ran-demo>
  <r-skeleton style="--ran-skeleton-height: 32px; --ran-skeleton-border-radius: 16px"></r-skeleton>
</ran-demo>

```html
<r-skeleton style="--ran-skeleton-height: 32px; --ran-skeleton-border-radius: 16px"></r-skeleton>
```

## Events

Keine. Das Skeleton löst keine eigenen Events aus.

## Slots

Keine. Das Skeleton zeichnet nur seinen eigenen Balken und projiziert keinen Slot-Inhalt.
