---
description: 'Der StateDot von ranui (<r-state-dot>) ist eine 8px große Lebenszyklus-Anzeige (idle, running, success, warning, error) aus Halo und Kern in einem einzigen Element.'
---

# StateDot

Eine 8px große Lebenszyklus-Anzeige: Halo und Kern in einem Element, beide `currentColor` —
ein Zustand ist damit eine Farbregel statt zweier Tokens.

> **Nimm ihn, wenn** eine Zeile zeigen soll, wo eine Arbeit gerade steht (eingereiht, läuft,
> fertig, fehlgeschlagen), ohne dafür eine ganze Zeile aufzuwenden. Es ist derselbe Punkt, den
> `<r-tool-card>` und die Verdichtungsmarkierung verwenden.

## Schnellstart

### Grundlegende Verwendung

<Demo>
  <r-state-dot state="idle"></r-state-dot>
  <r-state-dot state="running"></r-state-dot>
  <r-state-dot state="success"></r-state-dot>
  <r-state-dot state="warning"></r-state-dot>
  <r-state-dot state="error"></r-state-dot>
</Demo>

```html
<r-state-dot state="idle"></r-state-dot>
<r-state-dot state="running"></r-state-dot>
<r-state-dot state="success"></r-state-dot>
<r-state-dot state="warning"></r-state-dot>
<r-state-dot state="error"></r-state-dot>
```

`running` pulsiert, alle anderen stehen still. Ein unbekannter Wert wird als `idle` gezeichnet
statt zu verschwinden — ein Zustand, den die erzeugende Seite ergänzt hat und die Seite noch
nicht kennt, behält so seinen Platz in der Zeile.

### Neben einer Beschriftung

Der Punkt kodiert den Zustand allein über Farbe; was die Farbe bedeutet, erklärt er nicht. Lass
die Farbe niemals das Einzige sein, was zwei Zeilen unterscheidet. Siehe die
[Designrichtlinien](/de/src/ranui/design-guides/#accessibility).

<Demo column>
  <div style="display:flex;align-items:center;gap:8px">
    <r-state-dot state="running"></r-state-dot>
    <span>Tests laufen</span>
  </div>
  <div style="display:flex;align-items:center;gap:8px">
    <r-state-dot state="error"></r-state-dot>
    <span>2 Tests fehlgeschlagen</span>
  </div>
</Demo>

## API-Referenz

### Eigenschaften

| Eigenschaft | Attribut | Typ                                                        | Standard | Beschreibung                                             |
| ----------- | -------- | ---------------------------------------------------------- | -------- | -------------------------------------------------------- |
| `state`     | `state`  | `'idle' \| 'running' \| 'success' \| 'warning' \| 'error'` | `'idle'` | Welcher Schritt gezeigt wird. Unbekannte Werte → `idle`. |
| `label`     | `label`  | `string`                                                   | `''`     | Zugänglicher Name. Siehe unten.                          |
| `sheet`     | `sheet`  | `string`                                                   | `''`     | CSS, das in den Shadow Root injiziert wird.              |

### Barrierefreiheit

**Der Punkt ist `aria-hidden`, bis du ihm ein `label` gibst.** Ein Punkt neben einer Zeile, die
ihr Ergebnis bereits im Text nennt, ist im Screenreader nur Lärm: „läuft“ zweimal anzusagen
hilft niemandem. Setze `label` nur, wenn der Punkt der _einzige_ Träger des Zustands ist:

```html
<!-- Der Text sagt es schon: lass den Punkt stumm -->
<r-state-dot state="error"></r-state-dot> <span>Build fehlgeschlagen</span>

<!-- Der Punkt steht allein in der Zelle: benenne ihn -->
<r-state-dot state="error" label="Build fehlgeschlagen"></r-state-dot>
```

### Parts

| Part  | Element          |
| ----- | ---------------- |
| `dot` | Der Punkt selbst |

### Styling

Jeder Zustand ist **eine** Farbe: Der Halo ist diese Farbe bei 16 %, der Kern eine um 60 %
eingerückte Fassung davon — beide aus `currentColor` gemalt. Ein Zustand ist also ein Token,
nicht zwei:

| Token                           | Standard                           |
| ------------------------------- | ---------------------------------- |
| `--ran-state-dot-size`          | `8px`                              |
| `--ran-state-dot-color`         | `--ran-color-text-disabled` (idle) |
| `--ran-state-dot-running-color` | `--ran-color-primary`              |
| `--ran-state-dot-success-color` | `--ran-color-success`              |
| `--ran-state-dot-warning-color` | `--ran-color-warning`              |
| `--ran-state-dot-error-color`   | `--ran-color-danger`               |
| `--ran-state-dot-halo-opacity`  | `0.16`                             |

`running` lässt den Kern pulsieren statt rotieren (bei 8px ist ein drehendes Symbol zu klein,
um als Drehung gelesen zu werden), und das Pulsieren stoppt unter `prefers-reduced-motion`.
