---
description: 'Der Progress von ranui (<r-progress>) zeigt den Fortschritt einer Aufgabe als Balken, wahlweise mit ziehbarem Griff.'
---

# Progress

Fortschrittsbalken für den Stand einer Aufgabe, wahlweise mit ziehbarem Griff.

> **Nimm ihn, wenn** du einen Balken brauchst, der den Fortschritt einer Aufgabe zeigt. Nimm `<r-progress>` unverändert für reine Anzeige oder `type="drag"`, wenn der Nutzer den Wert über einen ziehbaren Griff setzen soll.

## Schnellstart

<ran-demo>
  <r-progress percent="40%"></r-progress>
</ran-demo>

```html
<r-progress percent="40%"></r-progress>
```

> 💡 **Tipp**: `r-progress` ist ein Blockelement ohne eigene Breite. In einer Flex-Zeile kann es auf null Breite zusammenfallen; gib ihm eine explizite Breite (etwa `style="width:100%"`) oder setze es in einen Blockkontext.

## API-Referenz

### Eigenschaften

| Eigenschaft | Typ      | Standard    | Beschreibung                                                                    |
| ----------- | -------- | ----------- | ------------------------------------------------------------------------------- |
| `percent`   | `string` | `'0'`       | Aktueller Fortschritt; Zahl oder Prozentwert. Nach oben durch `total` begrenzt. |
| `total`     | `string` | `'100'`     | Gesamtfortschritt; Zahl oder Prozentwert.                                       |
| `type`      | `string` | `'primary'` | Balkentyp: `primary` (statisch) oder `drag` (klick- und ziehbar).               |
| `dot`       | `string` | `'true'`    | Ob der Ziehgriff gezeigt wird: `true` oder `false`.                             |
| `sheet`     | `string` | `''`        | CSS, das in das Shadow DOM der Komponente injiziert wird.                       |

### Fortschrittswert `percent`

Setzt den aktuellen Fortschritt. Zahl oder Prozent-Zeichenkette, und nie größer als `total`. Ist `total` nicht gesetzt, gilt `100` — `percent` wird also als Prozentwert von 100 gelesen.

<ran-demo column>
  <r-progress percent="30%"></r-progress>
  <r-progress percent="70%"></r-progress>
  <r-progress percent="100%"></r-progress>
</ran-demo>

```html
<r-progress percent="30%"></r-progress>
<r-progress percent="70%"></r-progress>
<r-progress percent="100%"></r-progress>
```

### Gesamtfortschritt `total`

Setzt den Nenner für `percent`. Zahlen und Prozentwerte sind erlaubt, `percent="30" total="1000"` füllt den Balken also zu 3 %.

<ran-demo column>
  <r-progress percent="30" total="1000"></r-progress>
  <r-progress percent="70" total="100"></r-progress>
  <r-progress percent="10%" total="100%"></r-progress>
</ran-demo>

```html
<r-progress percent="30" total="1000"></r-progress>
<r-progress percent="70" total="100"></r-progress>
<r-progress percent="10%" total="100%"></r-progress>
```

### Balkentyp `type`

- `primary`: statischer Fortschrittsbalken. Der Standard, wenn `type` nicht gesetzt ist.
- `drag`: klick- und ziehbarer Balken. Ein Klick auf die Schiene oder ein Zug am Griff aktualisiert `percent` und löst ein `change`-Event aus. Das Ziehen des Griffs setzt `dot="true"` voraus.

<ran-demo column>
  <r-progress type="drag" percent="30%"></r-progress>
  <r-progress type="primary" percent="40%"></r-progress>
</ran-demo>

```html
<r-progress type="drag" percent="30%"></r-progress> <r-progress type="primary" percent="40%"></r-progress>
```

### Ziehgriff `dot`

Schaltet den Griff um. Er wird nur gezeichnet, wenn `dot="true"` **und** `type="drag"` gilt; auf einem statischen `primary`-Balken bleibt er absichtlich weg, dort hat `dot` also keine sichtbare Wirkung.

<ran-demo column>
  <r-progress type="drag" percent="30%" dot="true"></r-progress>
  <r-progress type="drag" percent="30%" dot="false"></r-progress>
</ran-demo>

```html
<r-progress type="drag" percent="30%" dot="true"></r-progress>
<r-progress type="drag" percent="30%" dot="false"></r-progress>
```

## Events

### `change`

Wird beim Typ `drag` immer dann ausgelöst, wenn der Nutzer die Schiene anklickt oder den Griff zieht und dabei `percent` ändert. Das `detail`-Objekt enthält:

| Feld      | Typ      | Beschreibung          |
| --------- | -------- | --------------------- |
| `value`   | `string` | Aktueller Fortschritt |
| `percent` | `string` | Aktueller Fortschritt |
| `total`   | `string` | Gesamtfortschritt     |

```html
<r-progress type="drag" percent="30%"></r-progress>

<script>
  const progress = document.createElement('r-progress');
  progress.type = 'drag';
  progress.percent = '30%';
  progress.addEventListener('change', (e) => {
    console.log(e.detail.value, e.detail.percent, e.detail.total);
  });
  container.append(progress);
</script>
```

## CSS-Parts

| Part    | Beschreibung                           |
| ------- | -------------------------------------- |
| `track` | Die Fortschrittsschiene (Hintergrund). |
| `fill`  | Der gefüllte Teil der Schiene.         |
| `dot`   | Der Ziehgriff.                         |

```css
r-progress::part(fill) {
  background: var(--ran-color-primary);
}
```

## Bewährte Praxis

- **Statische Balken**: Nimm den Standard `type="primary"`, um Fortschritt nur anzuzeigen.
- **Interaktive Balken**: Nimm `type="drag"`, wenn der Nutzer den Wert setzen können soll, und höre auf das `change`-Event.
- **Prozent oder Zahl**: Kombiniere `percent` und `total` frei — rohe Zahlen, wenn sie zu einer bekannten Gesamtmenge gehören, Prozentwerte für direkte Kontrolle.
- **Breite im Layout**: Setze den Balken in einen Blockcontainer oder gib ihm eine explizite Breite, damit er in Flex-Layouts nicht zusammenfällt.
