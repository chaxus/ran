---
description: 'Das ranui-Popover (<r-popover>) blendet beim Überfahren oder Klicken eine schwebende Sprechblasenkarte ein — für Tooltips, Menüs und kontextbezogene Inhalte.'
---

# Popover

Popover-Komponente, die eine schwebende Sprechblasenkarte einblendet, sobald der Auslöser überfahren oder angeklickt wird.

> **Einsetzen, wenn** du eine schwebende Fläche brauchst, die beim Überfahren oder Anklicken eines Auslösers aufgeht. `<r-popover>` positioniert die `<r-content>`-Fläche, portalt sie und verdrahtet die Barrierefreiheit für dich.

## Schnellstart

### Grundlegende Verwendung

Der Auslöser steht im Default-Slot; der schwebende Inhalt wird in ein verschachteltes `<r-content>`-Element gepackt.

<Demo>
  <r-popover style="display: inline-block;">
    <r-button>popover</r-button>
    <r-content>
      <div>das ist der Inhalt</div>
    </r-content>
  </r-popover>
</Demo>

```html
<r-popover style="display: inline-block;">
  <r-button>popover</r-button>
  <r-content>
    <div>das ist der Inhalt</div>
  </r-content>
</r-popover>
```

## API-Referenz

### Eigenschaften

| Eigenschaft           | Typ      | Standard  | Beschreibung                                                                                                                                       |
| --------------------- | -------- | --------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| `placement`           | `string` | `'top'`   | Lage der Fläche relativ zum Auslöser: `top`, `bottom`, `left`, `right`, jeweils optional mit dem Zusatz `-start` (Standard), `-center` oder `-end` |
| `trigger`             | `string` | `'hover'` | Wie die Fläche aufgeht: `hover` oder `click` (ein `click`-Handler ist immer gebunden)                                                              |
| `getPopupContainerId` | `string` | `''`      | `id` des Elements, innerhalb dessen die Fläche positioniert wird (beim Öffnen gelesen; nicht gespiegelt)                                           |
| `sheet`               | `string` | `''`      | CSS, das in das Shadow DOM der Komponente eingefügt wird                                                                                           |

### Auslöseart `trigger`

<Demo>
  <r-popover trigger="hover" style="display: inline-block;">
    <r-button>hover</r-button>
    <r-content>
      <div>hover</div>
    </r-content>
  </r-popover>
  <r-popover trigger="click" style="display: inline-block;">
    <r-button>click</r-button>
    <r-content>
      <div>click</div>
    </r-content>
  </r-popover>
</Demo>

```html
<r-popover trigger="hover" style="display: inline-block;">
  <r-button>hover</r-button>
  <r-content>
    <div>hover</div>
  </r-content>
</r-popover>

<r-popover trigger="click" style="display: inline-block;">
  <r-button>click</r-button>
  <r-content>
    <div>click</div>
  </r-content>
</r-popover>
```

### Lage `placement`

<Demo column>
  <r-popover trigger="hover" placement="top" style="display: inline-block;">
    <r-button>top</r-button>
    <r-content>
      <div>top</div>
    </r-content>
  </r-popover>
  <r-popover trigger="hover" placement="bottom" style="display: inline-block;">
    <r-button>bottom</r-button>
    <r-content>
      <div>bottom</div>
    </r-content>
  </r-popover>
  <r-popover trigger="hover" placement="left" style="display: inline-block;">
    <r-button>left</r-button>
    <r-content>
      <div>left</div>
    </r-content>
  </r-popover>
  <r-popover trigger="hover" placement="right" style="display: inline-block;">
    <r-button>right</r-button>
    <r-content>
      <div>right</div>
    </r-content>
  </r-popover>
</Demo>

```html
<r-popover trigger="hover" placement="top" style="display: inline-block;">
  <r-button>top</r-button>
  <r-content>
    <div>top</div>
  </r-content>
</r-popover>

<r-popover trigger="hover" placement="bottom" style="display: inline-block;">
  <r-button>bottom</r-button>
  <r-content>
    <div>bottom</div>
  </r-content>
</r-popover>

<r-popover trigger="hover" placement="left" style="display: inline-block;">
  <r-button>left</r-button>
  <r-content>
    <div>left</div>
  </r-content>
</r-popover>

<r-popover trigger="hover" placement="right" style="display: inline-block;">
  <r-button>right</r-button>
  <r-content>
    <div>right</div>
  </r-content>
</r-popover>
```

### Ausrichtung `placement="<Seite>-<Ausrichtung>"`

Eine Seite allein bringt die vordere Kante der Fläche mit der des Auslösers auf eine Linie. Ergänze `-center` oder `-end`, wenn sie stattdessen mittig über dem Auslöser oder bündig mit dessen hinterer Kante sitzen soll — das will ein Menü am rechten Ende einer Kopfleiste, damit es nach innen aufgeht, statt erst über den Rand hinauszuragen und vom Versatz zurückgeschoben zu werden. Der Zusatz überlebt ein automatisches Umklappen: `bottom-end` wird zu `top-end`, nicht zu `top`.

<Demo column>
  <r-popover trigger="hover" placement="bottom" style="display: inline-block;">
    <r-button>bottom</r-button>
    <r-content>
      <div style="width: 200px;">bottom — dasselbe wie bottom-start</div>
    </r-content>
  </r-popover>
  <r-popover trigger="hover" placement="bottom-center" style="display: inline-block;">
    <r-button>bottom-center</r-button>
    <r-content>
      <div style="width: 200px;">bottom-center</div>
    </r-content>
  </r-popover>
  <r-popover trigger="hover" placement="bottom-end" style="display: inline-block;">
    <r-button>bottom-end</r-button>
    <r-content>
      <div style="width: 200px;">bottom-end</div>
    </r-content>
  </r-popover>
</Demo>

```html
<r-popover trigger="hover" placement="bottom-end" style="display: inline-block;">
  <r-button>bottom-end</r-button>
  <r-content>
    <div style="width: 200px;">bottom-end</div>
  </r-content>
</r-popover>
```

## Slots

| Komponente    | Slot       | Beschreibung                                                                                                |
| ------------- | ---------- | ----------------------------------------------------------------------------------------------------------- |
| `<r-popover>` | (Standard) | Das Auslöserelement plus die `<r-content>`-Hülle                                                            |
| `<r-content>` | (Standard) | Der Inhalt der schwebenden Fläche; diese Kinder werden nach `document.body` portalt und beim Öffnen gezeigt |

Beide Komponenten stellen genau einen unbenannten Default-Slot bereit; benannte Slots gibt es nicht.

## Offener Zustand `open`

`open` ist der Zustand der Fläche und wird als Attribut gespiegelt, so wie bei `<details open>` und `<dialog open>`. Nirgends wird er aus dem `display` der Fläche abgeleitet, das dem Zustand um die Dauer der Ausblendanimation hinterherhinkt — Attribut, `aria-expanded` und das Bild auf dem Schirm können sich also nicht widersprechen.

```html
<r-popover id="pop" trigger="click">
  <r-button>Auslöser</r-button>
  <r-content><div>Inhalt</div></r-content>
</r-popover>

<script>
  const pop = document.getElementById('pop');
  pop.open = true; // oder pop.show()
  pop.open = false; // oder pop.hide()
  pop.toggle();
</script>
```

`show()`, `hide()` und `toggle()` sind dünne Hüllen darum. `closePopover()` bleibt als Alias für `hide()` bestehen.

## Ereignisse

`<r-popover>` löst rund um die Übergänge der Fläche vier Ereignisse aus, keines davon mit einem `detail`:

| Ereignis     | Wann                                                      |
| ------------ | --------------------------------------------------------- |
| `show`       | Die Fläche wird gleich erscheinen.                        |
| `after-show` | Sie ist erschienen und die Einblendanimation ist fertig.  |
| `hide`       | Die Fläche wird gleich schließen.                         |
| `after-hide` | Sie ist geschlossen und die Ausblendanimation ist fertig. |

Gewartet wird auf die Animation des Stylesheets selbst, nicht auf eine ins Skript kopierte Dauer. Unter `prefers-reduced-motion` (wo es nichts abzuspielen gibt) folgt `after-hide` deshalb unmittelbar auf `hide` statt nach einer festen Verzögerung.

Ansonsten treibt ganz gewöhnliche DOM-Interaktion das Ganze an:

- **Öffnen**: `mouseenter` (wenn `trigger` `hover` enthält), `click`, oder `Enter` / `Leertaste` bei gesetztem Fokus.
- **Schließen**: `mouseleave` (Hover-Modus), `Escape`, oder ein `click` woanders im Dokument.

Intern beobachtet das begleitende `<r-content>`-Element seinen eigenen Teilbaum mit einem `MutationObserver` und sendet ein `change`-`CustomEvent` (`detail: { type, value: { content, mutation } }`), das das Popover aufgreift, um die Fläche synchron zu halten. Das ist ein Implementierungsdetail, keine öffentliche API.

Barrierefreiheit wird automatisch verdrahtet: Der Host bekommt `tabindex="0"`, `aria-haspopup="dialog"` und ein `aria-expanded`, das beim Öffnen und Schließen zwischen `"false"` und `"true"` wechselt.

## Bewährte Vorgehensweisen

- **Auslöserelement**: Nimm ein fokussierbares Bedienelement (etwa `<r-button>`) als Auslöser, damit Öffnen und Schließen per Tastatur funktionieren.
- **Hülle für den Inhalt**: Packe den Inhalt der Fläche immer in `<r-content>`. Kinder, die nicht darin stehen, erscheinen nicht als schwebende Fläche.
- **Größe im Textfluss**: Der Host ist `display: block`; ergänze `style="display: inline-block;"` (oder setze ihn in einen Inline-Kontext), damit er auf die Breite des Auslösers schrumpft.
- **Lage**: `placement` ist ein Wunsch, keine Zusage: Steht der Auslöser nahe am Rand des Viewports und fehlt auf der gewünschten Seite der Platz, klappt die Fläche selbsttätig auf die Gegenseite und verschiebt sich entlang der Querachse, um sichtbar zu bleiben. Dieses automatische Umklappen greift nur bei der voreingestellten Positionierung auf `body`-Ebene.
- **Eingegrenzter Container**: Verwende `getPopupContainerId`, um die Fläche in einem bestimmten Scroll- oder Positionierungscontainer zu verankern, wenn die Positionierung auf `body`-Ebene nicht passt. In diesem Modus greifen Umklappen und Versatz nicht, wähle also ein `placement`, das in den Container passt. Der Ausrichtungszusatz gilt dort weiterhin, genau wie im `body`-Portal.
