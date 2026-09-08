---
description: 'Die Message-API von ranui zeigt globale Rückmeldungen (info, success, warning, error, toast) imperativ an, gerendert als leichtes Overlay.'
---

# Message

Komponente für globale Rückmeldungen zu Aktionsergebnissen, imperativ über die `message`-API aufgerufen und als schließbarer Toast gerendert.

> **Nimm sie, wenn** du eine kurzlebige, sich selbst schließende Meldung brauchst, die ein Aktionsergebnis bestätigt. Rufe die imperative API `message.info` / `success` / `warning` / `error` / `toast` auf, statt Markup zu platzieren.

## Schnellstart

<ran-demo>
  <r-button type="primary" onclick="message.info('Das ist ein Hinweis')">Meldung zeigen</r-button>
</ran-demo>

```html
<r-button type="primary" onclick="message.info('Das ist ein Hinweis')">Meldung zeigen</r-button>
```

Message wird normalerweise aus JavaScript aufgerufen. Das globale Objekt `message` wird an `window` registriert (auch als `window.ranui.message` erreichbar), sobald das Komponentenmodul geladen ist.

```js
message.info('Das ist ein Hinweis');
message.success('Projekt gelöscht');
```

## API-Referenz

### Globale Methoden

Jede Methode hängt einen Toast an und schließt ihn nach `duration` Millisekunden von selbst (Standard `3000`). Alle fünf haben dieselbe Signatur.

| Methode             | Beschreibung                                               |
| ------------------- | ---------------------------------------------------------- |
| `message.info()`    | Neutraler Hinweis-Toast (blaues Info-Icon)                 |
| `message.success()` | Erfolgs-Toast (grünes Häkchen-Icon)                        |
| `message.warning()` | Warnungs-Toast (bernsteinfarbenes Icon), bestimmt angesagt |
| `message.error()`   | Fehler-Toast (rotes Icon), bestimmt angesagt               |
| `message.toast()`   | Schlichter dunkler Toast ohne Icon                         |

### Signatur der Methoden

Jede Methode nimmt entweder eine `string` (den Inhalt) oder ein Optionsobjekt.

```js
// 1. Eine Zeichenkette übergeben — nur Inhalt, schließt nach 3000 ms
message.info('Das ist ein Hinweis');

// 2. Ein Optionsobjekt übergeben
message.info({
  content: 'Das ist ein Hinweis',
  duration: 2000,
  close: () => console.log('closed'),
});
```

### Optionen

| Option         | Typ                         | Standard        | Beschreibung                                                         |
| -------------- | --------------------------- | --------------- | -------------------------------------------------------------------- |
| `content`      | `string`                    | —               | Anzuzeigender Text (Pflicht, wenn ein Objekt übergeben wird)         |
| `duration`     | `number`                    | `3000`          | Verzögerung in Millisekunden bis zum automatischen Schließen         |
| `close`        | `() => void`                | —               | Callback, das nach dem Entfernen des Toasts läuft                    |
| `top`          | `number \| string`          | `8`             | Abstand des Toast-Stapels vom oberen Rand des Containers (Zahl = px) |
| `zIndex`       | `number \| string`          | `1200`          | Stapelreihenfolge des Toast-Containers                               |
| `getContainer` | `() => HTMLElement \| null` | `document.body` | Liefert das Element, in das der Toast-Stapel eingehängt wird         |

> `null`, `undefined` oder gar kein Argument bewirken nichts: Es wird nichts angezeigt.

### Attribute des Elements `r-message`

Jeder Toast ist ein Custom Element `<r-message>`. Die globale API setzt diese Attribute für dich, sie lassen sich aber auch direkt verwenden.

| Attribut  | Typ      | Standard | Beschreibung                                                                                       |
| --------- | -------- | -------- | -------------------------------------------------------------------------------------------------- |
| `type`    | `string` | —        | Eines von `info`, `success`, `warning`, `error`, `toast`. Wählt Icon/Farbe und die ARIA-Live-Rolle |
| `content` | `string` | —        | Text, der im Toast gerendert wird                                                                  |
| `sheet`   | `string` | `''`     | CSS, das in das Shadow DOM der Komponente injiziert wird                                           |

## Meldungsarten `type`

<ran-demo>
  <r-button onclick="message.info('Das ist ein Hinweis')">Hinweis</r-button>
  <r-button onclick="message.success('Das ist ein Hinweis')">Erfolg</r-button>
  <r-button onclick="message.warning('Das ist ein Hinweis')">Warnung</r-button>
  <r-button onclick="message.error('Das ist ein Hinweis')">Fehler</r-button>
  <r-button onclick="message.toast('Das ist ein Hinweis')">Toast</r-button>
</ran-demo>

```html
<r-button onclick="message.info('Das ist ein Hinweis')">Hinweis</r-button>
<r-button onclick="message.success('Das ist ein Hinweis')">Erfolg</r-button>
<r-button onclick="message.warning('Das ist ein Hinweis')">Warnung</r-button>
<r-button onclick="message.error('Das ist ein Hinweis')">Fehler</r-button>
<r-button onclick="message.toast('Das ist ein Hinweis')">Toast</r-button>
```

## Eigene Dauer `duration`

<ran-demo>
  <r-button onclick="message.info({ content: 'Bleibt 6 s', duration: 6000 })">6-Sekunden-Toast</r-button>
  <r-button onclick="message.info({ content: 'Bleibt 1 s', duration: 1000 })">1-Sekunden-Toast</r-button>
</ran-demo>

```html
<r-button onclick="message.info({ content: 'Bleibt 6 s', duration: 6000 })">6-Sekunden-Toast</r-button>
<r-button onclick="message.info({ content: 'Bleibt 1 s', duration: 1000 })">1-Sekunden-Toast</r-button>
```

## Callback beim Schließen `close`

Das Callback `close` läuft, nachdem der Toast aus dem DOM entfernt wurde.

<ran-demo>
  <r-button onclick="message.success({ content: 'Gespeichert', close: () => message.info('Toast geschlossen') })">Verkettete Meldung</r-button>
</ran-demo>

```html
<r-button onclick="message.success({ content: 'Gespeichert', close: () => message.info('Toast geschlossen') })"
  >Verkettete Meldung</r-button
>
```

```js
message.success({
  content: 'Gespeichert',
  close: () => {
    // läuft, sobald der Toast verschwunden ist
    console.log('toast closed');
  },
});
```

## Eigene Platzierung `top` / `zIndex` / `getContainer`

<ran-demo>
  <r-button onclick="message.info({ content: 'Nach unten geschoben', top: 120 })">Vom oberen Rand versetzen</r-button>
</ran-demo>

```js
message.info({
  content: 'Nach unten geschoben',
  top: 120, // Abstand vom oberen Rand des Containers
  zIndex: 1300, // Stapelreihenfolge
  getContainer: () => document.querySelector('#app'), // eigener Einhängepunkt
});
```

## Styling

Der Toast-Stapel liegt in einem an den Body portalierten Container; jedes `<r-message>` rendert seinen Inhalt in ein Shadow DOM, dessen Fläche sich über CSS-Variablen gestalten lässt (alle mit sinnvollen Rückfallwerten).

| CSS-Variable                          | Standard                       | Beschreibung                 |
| ------------------------------------- | ------------------------------ | ---------------------------- |
| `--ran-message-content-background`    | `var(--ran-color-bg-elevated)` | Hintergrund der Toast-Fläche |
| `--ran-message-content-border-radius` | `var(--ran-radius-md)`         | Eckenradius des Toasts       |
| `--ran-message-content-box-shadow`    | `var(--ran-shadow-menu)`       | Erhebung des Toasts          |
| `--ran-message-text-color`            | `var(--ran-color-text)`        | Textfarbe des Toasts         |
| `--ran-message-z-index`               | `var(--ran-z-message, 1200)`   | z-index des Stapels          |
| `--ran-message-top`                   | `8px`                          | Abstand des Stapels von oben |

## Bewährte Praxis

- **Benenne die Änderung**: Formuliere den Toast-Text als Ergebnis, etwa „Projekt gelöscht“ oder „Änderungen gespeichert“, nicht als vages „Erfolg“.
- **Erfolg / Hinweis**: Nimm `message.success` / `message.info` für Bestätigungen, die nicht blockieren.
- **Fehler / Warnungen**: Nimm `message.error` / `message.warning`; sie steigen in eine bestimmte ARIA-Live-Region auf, sodass Screenreader unterbrechen.
- **Halte es kurz**: Ein Toast verschwindet von selbst — hebe lange oder handlungsbedürftige Inhalte für einen Dialog auf.
- **Dauer sparsam anpassen**: Erhöhe `duration` für längere Meldungen, mache eine kurzlebige Rückmeldung aber nicht dauerhaft.
