---
description: 'Das Image von ranui (<r-image>) zeigt ein Bild mit einem eingebauten Ersatzbild, das erscheint, wenn die Quelle nicht geladen werden kann.'
---

# Image

Bildkomponente, die auf ein eingebautes Ersatzbild wechselt, wenn die Quelle nicht geladen werden kann.

> **Nimm sie, wenn** du ein Bild brauchst, das bei einer fehlschlagenden Quelle sauber auf einen Platzhalter zurückfällt: `<r-img>` wechselt auf eine eingebaute „Bild kaputt“-Grafik oder auf dein eigenes `fallback`.

## Schnellstart

### Grundlegende Verwendung

<Demo>
  <r-img src="https://picsum.photos/id/1015/240/160"></r-img>
</Demo>

```html
<r-img src="https://picsum.photos/id/1015/240/160"></r-img>
```

## API-Referenz

### Eigenschaften

| Eigenschaft | Typ      | Standard                           | Beschreibung                                                                     |
| ----------- | -------- | ---------------------------------- | -------------------------------------------------------------------------------- |
| `src`       | `string` | `''`                               | Bild-URL. Reaktiv: Ändern nach dem Mounten lädt das Bild neu.                    |
| `alt`       | `string` | `''`                               | Alternativtext, der an das innere `<img>` weitergereicht wird. Leer = dekorativ. |
| `fallback`  | `string` | eingebauter „Bild kaputt“-Data-URI | Bild, das gezeigt wird, wenn `src` nicht geladen werden kann.                    |
| `sheet`     | `string` | `''`                               | CSS, das in das Shadow DOM der Komponente injiziert wird.                        |

`src`, `alt`, `fallback` und `sheet` werden alle beobachtet und aktualisieren sich reaktiv: Jede Änderung an einem gemounteten Element wirkt sofort.

### Bildquelle `src`

<Demo>
  <r-img src="https://picsum.photos/id/1025/240/160"></r-img>
</Demo>

```html
<r-img src="https://picsum.photos/id/1025/240/160"></r-img>
```

### Alternativtext `alt`

`alt` wird an das innere `<img>` weitergereicht. Lass ihn bei dekorativen Bildern leer (der Standard), damit Screenreader sie überspringen, und beschreibe Bilder, die etwas aussagen.

<Demo>
  <r-img src="https://picsum.photos/id/1035/240/160" alt="Ein Bergsee in der Dämmerung"></r-img>
</Demo>

```html
<r-img src="https://picsum.photos/id/1035/240/160" alt="Ein Bergsee in der Dämmerung"></r-img>
```

### Ladefehler `fallback`

Wenn `src` nicht geladen werden kann, wechselt die Komponente auf `fallback`. Ist `fallback` nicht gesetzt, wird ein eingebauter „Bild kaputt“-Platzhalter verwendet. Unten ist `src` eine ungültige URL, deshalb erscheint das Ersatzbild.

<Demo>
  <r-img src="https://example.invalid/does-not-exist.png" fallback="data:image/png;base64,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"></r-img>
</Demo>

```html
<r-img
  src="https://example.invalid/does-not-exist.png"
  fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...(Platzhalter für ein kaputtes Bild)..."
></r-img>
```

### Externe Styles `sheet`

`sheet` injiziert rohes CSS in das Shadow DOM der Komponente. Damit gestaltest du den internen Container `.ran-image` oder das innere `<img>`.

<Demo>
  <r-img
    src="https://picsum.photos/id/1043/240/160"
    sheet="img { border-radius: 12px; box-shadow: 0 2px 12px rgba(0,0,0,.25); }"
  ></r-img>
</Demo>

```html
<r-img
  src="https://picsum.photos/id/1043/240/160"
  sheet="img { border-radius: 12px; box-shadow: 0 2px 12px rgba(0,0,0,.25); }"
></r-img>
```

## Events

Keine. `r-img` löst keine eigenen Events aus.

## Bewährte Praxis

- **`src` jederzeit ändern**: `src` ist reaktiv — es an einem gemounteten Element zu aktualisieren lädt das Bild neu; das Ersatzbild greift auch dann, wenn die neue URL fehlschlägt.
- **Aussagekräftigen Bildern ein `alt` geben**: Beschreibe den Inhalt für Screenreader; lass `alt` nur bei rein dekorativen Bildern leer.
- **Auf das eingebaute Ersatzbild vertrauen**: Der Standardplatzhalter wird automatisch verwendet — gib ein eigenes `fallback` nur an, wenn du einen zur Marke oder zum Kontext passenden Platzhalter willst.
- **Mit `sheet` gestalten**: Da das Bild im Shadow DOM liegt, setzt du Rahmen, Radius oder Größe über das Attribut `sheet` (oder die CSS-Variablen der Komponente).
