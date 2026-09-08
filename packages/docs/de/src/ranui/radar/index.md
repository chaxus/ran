---
description: 'Ein Netz- bzw. Spinnendiagramm, um mehrere Kennzahlen eines Datensatzes auf einer 2D-Canvas zu vergleichen.'
---

# Radar

Netzdiagramm, um mehrere Kennzahlen eines Datensatzes auf einer zweidimensionalen Canvas zu vergleichen.

> **Nimm es, wenn** du ein Netz- oder Spinnendiagramm brauchst, um mehrere Kennzahlen eines Datensatzes zu vergleichen. Gib `<r-radar>` über das Attribut `abilitys` ein JSON-Array aus Achsennamen und Werten.

## Schnellstart

### Grundlegende Verwendung

Die Daten kommen als **JSON-Zeichenkette** (ein Array von Objekten) über das Attribut `abilitys`. Da HTML-Attribute nur Zeichenketten halten können, muss der Wert gültiges JSON sein; intern wird er mit `JSON.parse` gelesen. Der Host `<r-radar>` hat keine eigene Größe — gib ihm also eine ausdrückliche Breite und Höhe.

<ran-demo>
  <r-radar style="width:300px;height:300px;display:block;" abilitys='[{"abilityName":"Leben","scoreRate":"10"},{"abilityName":"Angriff","scoreRate":"90"},{"abilityName":"Verteidigung","scoreRate":"20"},{"abilityName":"Elementarkunde","scoreRate":"50"},{"abilityName":"Krit-Chance","scoreRate":"80"},{"abilityName":"Krit-Schaden","scoreRate":"50"}]'></r-radar>
</ran-demo>

```html
<r-radar
  style="width:300px;height:300px;display:block;"
  abilitys='[{"abilityName":"Leben","scoreRate":"10"},{"abilityName":"Angriff","scoreRate":"90"},{"abilityName":"Verteidigung","scoreRate":"20"},{"abilityName":"Elementarkunde","scoreRate":"50"},{"abilityName":"Krit-Chance","scoreRate":"80"},{"abilityName":"Krit-Schaden","scoreRate":"50"}]'
></r-radar>
```

Du kannst die Daten auch imperativ über die JS-Eigenschaft `abilitys` setzen; sie nimmt ein Array (das als Zeichenkette zurück ans Attribut geschrieben wird) oder eine JSON-Zeichenkette:

```js
const radar = document.createElement('r-radar');
radar.abilitys = [
  { abilityName: 'Leben', scoreRate: 10 },
  { abilityName: 'Angriff', scoreRate: 90 },
  { abilityName: 'Verteidigung', scoreRate: 20 },
];
chart.append(radar);
```

## API-Referenz

### Eigenschaften

| Eigenschaft    | Typ                | Standard                                     | Beschreibung                                                             |
| -------------- | ------------------ | -------------------------------------------- | ------------------------------------------------------------------------ |
| `abilitys`     | `string` / `Array` | `''`                                         | Diagrammdaten als JSON-Zeichenkette (oder Array über die JS-Eigenschaft) |
| `colorPolygon` | `string`           | `var(--ran-radar-polygon-color)` / `#e6e6e6` | Farbe der konzentrischen Gitterpolygone                                  |
| `colorLine`    | `string`           | `var(--ran-radar-line-color)` / `#e6e6e6`    | Farbe der Achsenlinien und der Außenkante                                |
| `fillColor`    | `string`           | `rgba(255,121,35,0.60)`                      | Füllfarbe der Datenfläche                                                |
| `strokeColor`  | `string`           | `rgba(255,121,35,0.60)`                      | Farbe der Umrisslinie und der Eckpunkte                                  |
| `sheet`        | `string`           | `''`                                         | CSS, das in das Shadow DOM der Komponente injiziert wird                 |

Jeder Eintrag des `abilitys`-Arrays nimmt diese Schlüssel an:

| Schlüssel         | Typ      | Pflicht | Beschreibung                                                        |
| ----------------- | -------- | ------- | ------------------------------------------------------------------- |
| `abilityName`     | `string` | Ja      | Beschriftung der Achse                                              |
| `scoreRate`       | `number` | Ja      | Wert auf dieser Achse; das Gitter endet bei `100`                   |
| `backgroundColor` | `string` | Nein    | Hintergrundfarbe der Beschriftung (standardmäßig transparent)       |
| `fontSize`        | `number` | Nein    | Schriftgröße der Beschriftung (standardmäßig ans Diagramm skaliert) |
| `fontColor`       | `string` | Nein    | Textfarbe der Beschriftung (standardmäßig `--ran-color-text`)       |
| `fontFamily`      | `string` | Nein    | Schriftfamilie der Beschriftung (standardmäßig `SimHei`)            |

> Hinweis: `colorPolygon`, `colorLine`, `fillColor` und `strokeColor` werden ohne Rücksicht auf Groß- und Kleinschreibung gelesen, sie zeichnen also richtig, ob das Attribut von Anfang an da ist oder erst nach dem Mounten geändert wird; jede Änderung zeichnet das Diagramm neu. Für themebewusstes Styling nimm lieber die CSS-Variablen weiter unten.

### Diagrammdaten `abilitys`

Das Aussehen einzelner Beschriftungen (`backgroundColor`, `fontSize`, `fontColor`) lässt sich pro Eintrag setzen:

<ran-demo>
  <r-radar style="width:300px;height:300px;display:block;" abilitys='[{"abilityName":"Leben","scoreRate":"10","backgroundColor":"red","fontSize":"30","fontColor":"blue"},{"abilityName":"Angriff","scoreRate":"90"},{"abilityName":"Verteidigung","scoreRate":"20"},{"abilityName":"Elementarkunde","scoreRate":"50"},{"abilityName":"Krit-Chance","scoreRate":"80"},{"abilityName":"Krit-Schaden","scoreRate":"50"}]'></r-radar>
</ran-demo>

```html
<r-radar
  style="width:300px;height:300px;display:block;"
  abilitys='[{"abilityName":"Leben","scoreRate":"10","backgroundColor":"red","fontSize":"30","fontColor":"blue"},{"abilityName":"Angriff","scoreRate":"90"},{"abilityName":"Verteidigung","scoreRate":"20"},{"abilityName":"Elementarkunde","scoreRate":"50"},{"abilityName":"Krit-Chance","scoreRate":"80"},{"abilityName":"Krit-Schaden","scoreRate":"50"}]'
></r-radar>
```

### Gitterfarbe `colorPolygon`

<ran-demo>
  <r-radar style="width:300px;height:300px;display:block;" colorPolygon="green" abilitys='[{"abilityName":"Leben","scoreRate":"10"},{"abilityName":"Angriff","scoreRate":"90"},{"abilityName":"Verteidigung","scoreRate":"20"},{"abilityName":"Elementarkunde","scoreRate":"50"},{"abilityName":"Krit-Chance","scoreRate":"80"},{"abilityName":"Krit-Schaden","scoreRate":"50"}]'></r-radar>
</ran-demo>

```html
<r-radar
  style="width:300px;height:300px;display:block;"
  colorPolygon="green"
  abilitys='[{"abilityName":"Leben","scoreRate":"10"},{"abilityName":"Angriff","scoreRate":"90"},{"abilityName":"Verteidigung","scoreRate":"20"},{"abilityName":"Elementarkunde","scoreRate":"50"},{"abilityName":"Krit-Chance","scoreRate":"80"},{"abilityName":"Krit-Schaden","scoreRate":"50"}]'
></r-radar>
```

### Achsenfarbe `colorLine`

<ran-demo>
  <r-radar style="width:300px;height:300px;display:block;" colorLine="blue" abilitys='[{"abilityName":"Leben","scoreRate":"10"},{"abilityName":"Angriff","scoreRate":"90"},{"abilityName":"Verteidigung","scoreRate":"20"},{"abilityName":"Elementarkunde","scoreRate":"50"},{"abilityName":"Krit-Chance","scoreRate":"80"},{"abilityName":"Krit-Schaden","scoreRate":"50"}]'></r-radar>
</ran-demo>

```html
<r-radar
  style="width:300px;height:300px;display:block;"
  colorLine="blue"
  abilitys='[{"abilityName":"Leben","scoreRate":"10"},{"abilityName":"Angriff","scoreRate":"90"},{"abilityName":"Verteidigung","scoreRate":"20"},{"abilityName":"Elementarkunde","scoreRate":"50"},{"abilityName":"Krit-Chance","scoreRate":"80"},{"abilityName":"Krit-Schaden","scoreRate":"50"}]'
></r-radar>
```

### Füllfarbe der Fläche `fillColor`

<ran-demo>
  <r-radar style="width:300px;height:300px;display:block;" fillColor="red" abilitys='[{"abilityName":"Leben","scoreRate":"10"},{"abilityName":"Angriff","scoreRate":"90"},{"abilityName":"Verteidigung","scoreRate":"20"},{"abilityName":"Elementarkunde","scoreRate":"50"},{"abilityName":"Krit-Chance","scoreRate":"80"},{"abilityName":"Krit-Schaden","scoreRate":"50"}]'></r-radar>
</ran-demo>

```html
<r-radar
  style="width:300px;height:300px;display:block;"
  fillColor="red"
  abilitys='[{"abilityName":"Leben","scoreRate":"10"},{"abilityName":"Angriff","scoreRate":"90"},{"abilityName":"Verteidigung","scoreRate":"20"},{"abilityName":"Elementarkunde","scoreRate":"50"},{"abilityName":"Krit-Chance","scoreRate":"80"},{"abilityName":"Krit-Schaden","scoreRate":"50"}]'
></r-radar>
```

### Umrissfarbe der Fläche `strokeColor`

<ran-demo>
  <r-radar style="width:300px;height:300px;display:block;" strokeColor="blue" abilitys='[{"abilityName":"Leben","scoreRate":"10"},{"abilityName":"Angriff","scoreRate":"90"},{"abilityName":"Verteidigung","scoreRate":"20"},{"abilityName":"Elementarkunde","scoreRate":"50"},{"abilityName":"Krit-Chance","scoreRate":"80"},{"abilityName":"Krit-Schaden","scoreRate":"50"}]'></r-radar>
</ran-demo>

```html
<r-radar
  style="width:300px;height:300px;display:block;"
  strokeColor="blue"
  abilitys='[{"abilityName":"Leben","scoreRate":"10"},{"abilityName":"Angriff","scoreRate":"90"},{"abilityName":"Verteidigung","scoreRate":"20"},{"abilityName":"Elementarkunde","scoreRate":"50"},{"abilityName":"Krit-Chance","scoreRate":"80"},{"abilityName":"Krit-Schaden","scoreRate":"50"}]'
></r-radar>
```

### Vollständige Beispieldaten

Weil ein HTML-`attribute` nur eine `string` tragen kann, müssen die übergebenen Daten eine `json`-Zeichenkette sein, die mit `JSON.parse` zurück in ein Array von Objekten gelesen wird; fehlerhaftes `JSON` lässt sich nicht lesen:

```json
[
  {
    "abilityName": "Leben",
    "scoreRate": "10",
    "backgroundColor": "red",
    "fontSize": "30",
    "fontColor": "blue"
  },
  {
    "abilityName": "Angriff",
    "scoreRate": "90"
  },
  {
    "abilityName": "Verteidigung",
    "scoreRate": "20"
  },
  {
    "abilityName": "Elementarkunde",
    "scoreRate": "50"
  },
  {
    "abilityName": "Krit-Chance",
    "scoreRate": "80"
  },
  {
    "abilityName": "Krit-Schaden",
    "scoreRate": "50"
  }
]
```

### CSS-Variablen

Die Diagrammfarben lassen sich auch (themereaktiv) über CSS-Custom-Properties am Host setzen:

| Variable                    | Standard                              | Beschreibung                     |
| --------------------------- | ------------------------------------- | -------------------------------- |
| `--ran-radar-polygon-color` | `var(--ran-color-border)` / `#e6e6e6` | Farbe der Gitterpolygone         |
| `--ran-radar-line-color`    | `var(--ran-color-border)` / `#e6e6e6` | Farbe der Achsenlinien           |
| `--ran-radar-fill-color`    | `rgba(255,121,35,0.60)`               | Füllfarbe der Datenfläche        |
| `--ran-radar-stroke-color`  | `rgba(255,121,35,0.60)`               | Umrissfarbe der Datenfläche      |
| `--ran-radar-width`         | `100%`                                | Breite des Canvas-Containers     |
| `--ran-radar-height`        | `100%`                                | Höhe des Canvas-Containers       |
| `--ran-radar-display`       | `block`                               | `display` des Canvas-Containers  |
| `--ran-radar-position`      | `relative`                            | `position` des Canvas-Containers |

Die Textfarbe der Beschriftungen greift ebenfalls auf das Theme-Token `--ran-color-text` zurück, damit sie im hellen wie im dunklen Modus lesbar bleiben.

## Events

Keine. `<r-radar>` löst keine eigenen Events aus.

## Bewährte Praxis

- **Größe**: Der Host hat keine eigene Größe; setze immer eine ausdrückliche `width`/`height` (über `style` oder die Variablen `--ran-radar-width`/`--ran-radar-height`). Bei Größenänderungen des Containers zeichnet sich das Diagramm über einen `ResizeObserver` selbst neu.
- **Datenformat**: Übergib gültiges JSON in `abilitys`; fehlerhaftes JSON wird protokolliert und kann nicht gelesen werden. Arbeite im Skript mit echten Arrays über die JS-Eigenschaft `abilitys`.
- **Skala**: `scoreRate` misst gegen ein festes Maximum von `100`; normalisiere deine Werte auf diesen Bereich.
- **Theming**: Die Farbattribute (`colorPolygon`, `colorLine`, `fillColor`, `strokeColor`) sind reaktiv und zeichnen das Diagramm neu, wenn du sie nach dem Mounten änderst. Sollen die Farben dem hellen bzw. dunklen Theme von selbst folgen, nimm die CSS-Variablen `--ran-radar-*`.
