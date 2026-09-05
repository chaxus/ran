---
description: 'Das Loading von ranui (<r-loading>) zeigt eine drehende Anzeige, solange Inhalt lädt oder eine Aktion läuft.'
---

<script setup>
import Loading from '../../../../vue/loading.vue'
</script>

# Loading

Ladekomponente mit einer Sammlung animierter Anzeigen für laufende Arbeit.

> **Nimm sie, wenn** du eine animierte Anzeige brauchst, die laufende Arbeit signalisiert: `<r-loading>` bringt rund 30 eingebaute Animationen mit, die über `name` gewählt und über CSS-Variablen gestaltet werden.

## Schnellstart

### Grundlegende Verwendung

<Demo>
  <r-loading name="circle"></r-loading>
</Demo>

```html
<r-loading name="circle"></r-loading>
```

## API-Referenz

### Eigenschaften

| Eigenschaft | Typ      | Standard   | Beschreibung                                                                    |
| ----------- | -------- | ---------- | ------------------------------------------------------------------------------- |
| `name`      | `string` | `'circle'` | Art der Animation. Fällt auf `circle` zurück, wenn nicht gesetzt oder unbekannt |
| `sheet`     | `string` | `''`       | CSS-Text, der für Styling von außen ins Shadow DOM injiziert wird               |

### Animationsarten `name`

Setze `name` auf eine der eingebauten Animationsarten. Jeder unbekannte Wert zeichnet nichts (nur die Namen aus der Liste unten werden behandelt).

<Demo>
  <r-loading name="double-bounce"></r-loading>
  <r-loading name="rotate"></r-loading>
  <r-loading name="stretch"></r-loading>
  <r-loading name="cube"></r-loading>
</Demo>

```html
<r-loading name="double-bounce"></r-loading>
<r-loading name="rotate"></r-loading>
<r-loading name="stretch"></r-loading>
<r-loading name="cube"></r-loading>
```

Verfügbare Werte:

`double-bounce`, `rotate`, `stretch`, `cube`, `dot`, `triple-bounce`, `scale-out`, `circle`, `circle-line`, `square`, `pulse`, `solar`, `cube-fold`, `circle-fold`, `cube-grid`, `circle-turn`, `circle-rotate`, `circle-spin`, `dot-bar`, `dot-circle`, `line`, `dot-pulse`, `line-scale`, `text`, `cube-dim`, `dot-line`, `arc`, `drop`, `pacman`

### Externe Styles `sheet`

Das Attribut `sheet` injiziert rohes CSS in den Shadow Root der Komponente und lässt dich interne Regeln von außen überschreiben — ohne Build-Schritt.

```html
<r-loading name="circle" sheet=".circle { transform: scale(1.5); }"></r-loading>
```

## Eigenes Styling

Jede Animation wird vollständig über CSS-Variablen gestaltet. Setze sie am Element `r-loading` (oder an einem Vorfahren), um Größe und Farbe zu steuern. `px`-Einheiten geben genauere Kontrolle als die standardmäßige Bemessung in `em`.

### Größe anpassen

```css
/* Circle */
r-loading {
  --loading-circle-width: 32px;
  --loading-circle-height: 32px;
}

/* Double-bounce */
r-loading {
  --loading-double-bounce-width: 40px;
  --loading-double-bounce-height: 40px;
}

/* Rotate */
r-loading {
  --loading-rotate-width: 48px;
  --loading-rotate-height: 48px;
}

/* Stretch */
r-loading {
  --loading-stretch-width: 60px;
  --loading-stretch-height: 72px;
}
```

### Farbe anpassen

```css
/* Circle */
r-loading {
  --loading-circle-container-div-background: #1890ff;
}

/* Double-bounce */
r-loading {
  --loading-double-bounce1-background: #52c41a;
  --loading-double-bounce2-background: #52c41a;
}

/* Rotate */
r-loading {
  --loading-rotate-background: #faad14;
}

/* Stretch */
r-loading {
  --loading-stretch-div-background-color: #f5222d;
}
```

### Beispiele

<Demo>
  <r-loading name="circle" style="--loading-circle-width: 64px; --loading-circle-height: 64px; --loading-circle-container-div-background: #1890ff;"></r-loading>
  <r-loading name="rotate" style="--loading-rotate-width: 48px; --loading-rotate-height: 48px; --loading-rotate-background: #faad14;"></r-loading>
</Demo>

```html
<r-loading
  name="circle"
  style="--loading-circle-width: 64px; --loading-circle-height: 64px; --loading-circle-container-div-background: #1890ff;"
></r-loading>
<r-loading
  name="rotate"
  style="--loading-rotate-width: 48px; --loading-rotate-height: 48px; --loading-rotate-background: #faad14;"
></r-loading>
```

### Häufige CSS-Variablen

Jede Animationsart hat ihren eigenen Token-Namensraum. Die gängigsten folgen diesem Muster:

| Variable                                | Standard  | Beschreibung                                    |
| --------------------------------------- | --------- | ----------------------------------------------- |
| `--loading-{type}-width`                | `4em`     | Breite der Animation (`px`-Einheiten empfohlen) |
| `--loading-{type}-height`               | `4em`     | Höhe der Animation (`px`-Einheiten empfohlen)   |
| `--loading-{type}-background`           | `#4096ff` | Haupthintergrundfarbe                           |
| `--loading-{type}-div-background-color` | `#4096ff` | Hintergrundfarbe der Unterelemente              |

> Ersetze `{type}` durch einen konkreten Animationsnamen, etwa `circle`, `double-bounce` oder `rotate`. Die Grundfarben greifen standardmäßig auf die Theme-Tokens `--ran-color-primary`, `--ran-color-success` und `--ran-color-text` zurück.

## CSS-Parts

Jede Animation stellt ihr Wurzelelement als `::part()` mit dem Namen ihres `name`-Werts bereit, du kannst es also von außerhalb des Shadow DOM ansprechen:

```css
r-loading::part(rotate) {
  filter: drop-shadow(0 0 4px currentColor);
}
```

Part-Namen: `double-bounce`, `rotate`, `stretch`, `cube`, `dot`, `triple-bounce`, `scale-out`, `circle`, `circle-line`, `square`, `pulse`, `solar`, `cube-fold`, `circle-fold`, `cube-grid`, `circle-turn`, `circle-rotate`, `circle-spin`, `dot-bar`, `dot-circle`, `line`, `dot-pulse`, `line-scale`, `text`, `cube-dim`, `dot-line`, `arc`, `drop`, `pacman`. Die Animation `solar` stellt zusätzlich einen Part `sun` bereit.

## Slots

Keine. Die Komponente zeichnet ihre Animation vollständig aus dem Shadow DOM und projiziert keine Light-DOM-Kinder.

## Events

Keine. Die Komponente löst keine eigenen Events aus.

## Alle Lade-Animationen

<Loading />

## Bewährte Praxis

- **Passend zur Situation wählen**: Nimm eine Animation, die zum Kontext und zum Tempo der Aufgabe passt.
- **CSS-Variablen**: Passe Größe und Farbe über die Tokens `--loading-{type}-*` an, statt Elemente drumherum zu bauen.
- **Bemessung**: Bevorzuge `px` gegenüber der Standardbemessung in `em`, damit die Maße vorhersehbar sind.
- **Performance**: Vermeide viele gleichzeitige Animationen auf einem Bildschirm.
- **Bedarfsgesteuertes Laden**: Jede Animation ist ein eigener nachgeladener Chunk (mit eigenem JS und CSS), ein `name` lädt also nur die Variante, die er verwendet; eine Animation zu referenzieren bündelt nie die anderen 28. Das voreingestellte `circle` und das häufige `dot` sind fest eingebaut, damit das erste Bild sofort und ohne Aufblitzen erscheint; alle übrigen laden beim ersten Gebrauch asynchron. Die Verwendung bleibt gleich: einfach `name` setzen.
- **Theming**: Die Grundfarben folgen den Theme-Tokens `--ran-color-*`, die Animationen passen sich also von selbst an helle und dunkle Modi an.
