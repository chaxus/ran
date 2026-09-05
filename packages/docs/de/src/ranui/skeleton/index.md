---
description: 'Das Skeleton von ranui (<r-skeleton>) zeigt einen schimmernden Platzhalter, der den Platz des Inhalts einnimmt, solange dieser lädt.'
---

# Skeleton

Platzhaltergrafik, die den Platz des Inhalts einnimmt, solange dieser lädt — mit einer schimmernden Animation.

> **Nimm es, wenn** du einen schimmernden Platzhalterbalken brauchst, der den Platz für Inhalt freihält, solange er lädt. Gib dem Elternelement von `<r-skeleton>` die Maße des echten Inhalts und tausche es aus, sobald die Daten da sind.

## Schnellstart

### Grundlegende Verwendung

Das Skeleton füllt die Breite seines Elternelements und ist standardmäßig `16px` hoch.

<Demo>
  <r-skeleton></r-skeleton>
</Demo>

```html
<r-skeleton></r-skeleton>
```

### Die Breite folgt dem Elternelement

Da das Skeleton `width: 100%` ist, steuerst du seine Länge über die Größe des Containers, in dem es liegt.

<Demo column>
  <div style="width: 100px">
    <r-skeleton></r-skeleton>
  </div>
  <div style="width: 200px">
    <r-skeleton></r-skeleton>
  </div>
  <div style="width: 100%">
    <r-skeleton></r-skeleton>
  </div>
</Demo>

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

<Demo column>
  <div style="width: 100%; display: flex; flex-direction: column; gap: 12px">
    <r-skeleton></r-skeleton>
    <r-skeleton></r-skeleton>
    <r-skeleton></r-skeleton>
  </div>
</Demo>

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

<Demo>
  <r-skeleton sheet=".ran-skeleton { height: 40px; border-radius: 20px; }"></r-skeleton>
</Demo>

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

<Demo>
  <r-skeleton style="--ran-skeleton-height: 32px; --ran-skeleton-border-radius: 16px"></r-skeleton>
</Demo>

```html
<r-skeleton style="--ran-skeleton-height: 32px; --ran-skeleton-border-radius: 16px"></r-skeleton>
```

## Events

Keine. Das Skeleton löst keine eigenen Events aus.

## Slots

Keine. Das Skeleton zeichnet nur seinen eigenen Balken und projiziert keinen Slot-Inhalt.

## Bewährte Praxis

- **Am Layout ausrichten**: Gib dem Elterncontainer solche Maße, dass jedes Skeleton die Breite des echten Inhalts hat, für den es steht.
- **Die Form nachbilden**: Stapele mehrere Skeletons mit gleichmäßigen Abständen, um mehrzeiligen Text oder Listenzeilen darzustellen.
- **Über Variablen gestalten**: Nimm für einfache Anpassungen die CSS-Variablen `--ran-skeleton-*`; greife nur dann zu `sheet`, wenn du Selektoren brauchst, die die Variablen nicht abdecken.
- **Beim Laden austauschen**: Ersetze die Skeletons durch echten Inhalt, sobald die Daten eintreffen, statt sie endlos weiteranimieren zu lassen.
