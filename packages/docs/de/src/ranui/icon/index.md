---
description: 'Das Icon von ranui (<r-icon>) zeichnet semantische Vektorgrafiken (SVG) mit Kontrolle über Größe und Farbe.'
---

# Icon

Zeichnet semantische Vektorgrafiken (SVG) mit Kontrolle über Größe und Farbe.

> **Nimm es, wenn** du ein benanntes, skalierbares und umfärbbares Vektor-Icon (wahlweise mit Dreh-Animation) inline in deiner Oberfläche brauchst: `<r-icon>` zeichnet über `name` ein registriertes SVG.

## Icons verwenden

### Am einfachsten: einen mitgelieferten Namen nehmen (ohne Konfiguration)

ranui liefert seinen Icon-Satz **direkt im Paket eingebettet** aus. Ein mitgelieferter `name` **lädt sich bei Bedarf selbst**: keine Registrierung, keine Imports, keine Asset-Pfade zu verdrahten. Nur das SVG, das du tatsächlich verwendest, wird geholt (jedes ist ein eigener asynchroner Chunk) — ein Icon zu referenzieren zieht also nie den ganzen Satz nach.

```html
<r-icon name="lock"></r-icon> <r-icon name="eye"></r-icon>
```

Die gültigen mitgelieferten Namen sind die Union `RanIconName` bzw. das Tupel `RAN_ICON_NAMES` (siehe unten). Ein **eigener** Name, der nie registriert wurde, zeichnet weiterhin **nichts** (eine Leerstelle); das betrifft nur deine eigenen SVGs und wird unter [Eigene Icons](#custom-icons) behandelt.

### Optional: den ganzen Satz vorab registrieren

Wenn dir lieber ist, dass jedes mitgelieferte Icon **synchron** verfügbar ist (kein Nachladen pro Icon, etwa um bei icon-dichten Ansichten ein Aufblitzen zu vermeiden, oder in einer Umgebung ohne Code-Splitting), rufe `registerBuiltinIcons()` einmal so früh wie möglich auf:

```ts
import { registerBuiltinIcons } from 'ranui'; // oder 'ranui/icons'

registerBuiltinIcons(); // registriert vorab jeden Namen aus RAN_ICON_NAMES (~15 KB)
```

Die gültigen Namen werden als Union-Typ `RanIconName` und als Tupel `RAN_ICON_NAMES` exportiert (dein Editor vervollständigt sie, und Tippfehler fallen auf):

`add-user`, `arrow-down`, `book`, `check-circle`, `check-circle-fill`, `close`, `close-circle`, `close-circle-fill`, `drop`, `eye`, `eye-close`, `github`, `globe`, `home`, `info-circle`, `info-circle-fill`, `issue`, `loading`, `loading-scene`, `lock`, `menu`, `message`, `more`, `plus`, `power-off`, `preview`, `search`, `setting`, `sort`, `team`, `unlock`, `user`, `warning-circle`, `warning-circle-fill`, `without-content`

### Eigene Icons {#custom-icons}

Um eigene SVGs zu registrieren (aus einer beliebigen Icon-Bibliothek oder der Asset-Pipeline deines Builds), übergib rohe SVG-Zeichenketten an `registerIcons` / `registerIcon`:

```ts
import { registerIcon, registerIcons } from 'ranui';
import lock from './icons/lock.svg?raw'; // je nachdem, wie dein Bundler SVG als rohen String liefert

registerIcons({
  lock,
  logo: '<svg viewBox="0 0 24 24"><path d="…" /></svg>', // Inline-String — keine Asset-Datei nötig
});
registerIcon('star', '<svg viewBox="0 0 24 24">…</svg>');
```

Du kannst die Registry auch ganz übergehen und rohes SVG-Markup direkt an `name` übergeben (es wird unverändert gezeichnet, wenn es mit `<svg` beginnt):

```html
<r-icon name='<svg viewBox="0 0 24 24">…</svg>'></r-icon>
```

> **Hinweis:** Die rohen Dateien `assets/icons/*.svg` sind **nicht** Teil des veröffentlichten npm-Pakets (ausgeliefert wird nur `dist/`), `import '…/lock.svg?raw'` aus `ranui` lässt sich also nicht auflösen; nimm für den mitgelieferten Satz `registerBuiltinIcons()` oder registriere eigene SVG-Zeichenketten.

> **SSR / Zeitpunkt.** Die Registrierung muss im Browser laufen. Verbindet sich ein `<r-icon>`, bevor sein Icon registriert ist, bleibt es leer und füllt sich automatisch, sobald die Registrierung fertig ist (das Element hört auf das Event `ranui-icon-registered`). Um ein Aufblitzen leerer Icons zu vermeiden, registriere ganz oben in deinem Einstiegsmodul, damit die Registry gefüllt ist, bevor die erste Komponente rendert. In der Entwicklung protokolliert ein nicht registrierter Name `[ranui-icon] icon not registered: <name>`.

## Code-Demo

<ran-demo>
  <r-icon name="lock" size="50"></r-icon>
  <r-icon name="eye" size="50"></r-icon>
  <r-icon name="user" size="50"></r-icon>
</ran-demo>

```xml
 <r-icon name="lock"  ></r-icon>
 <r-icon name="eye"  ></r-icon>
 <r-icon name="user"  ></r-icon>
```

## Attribute

### `name`

Wählt über den Namen ein anderes Icon.

<ran-demo>
  <r-icon name="lock" size="50"></r-icon>
  <r-icon name="eye" size="50"></r-icon>
  <r-icon name="user" size="50"></r-icon>
</ran-demo>

```html
<r-icon name="lock"></r-icon>
<r-icon name="eye"></r-icon>
<r-icon name="user"></r-icon>
```

### `size`

<ran-demo align="end">
  <r-icon name="lock" size="30"></r-icon>
  <r-icon name="lock" size="50"></r-icon>
  <r-icon name="lock" size="70"></r-icon>
</ran-demo>

```html
<r-icon name="lock" size="30"></r-icon>
<r-icon name="lock" size="50"></r-icon>
<r-icon name="lock" size="70"></r-icon>
```

### `color`

<ran-demo>
  <r-icon name="lock" size="50" color="red"></r-icon>
  <r-icon name="lock" size="50" color="#1E90FF"></r-icon>
  <r-icon name="lock" size="50" color="#F44336"></r-icon>
  <r-icon name="lock" size="50" color="#3F51B5"></r-icon>
</ran-demo>

```html
<r-icon name="lock" size="50" color="red"></r-icon>
<r-icon name="lock" size="50" color="#1E90FF"></r-icon>
<r-icon name="lock" size="50" color="#F44336"></r-icon>
<r-icon name="lock" size="50" color="#3F51B5"></r-icon>
```

### `spin`

Setze spin, um die Drehung einzuschalten, und übergib eine Zahl, um die Drehgeschwindigkeit zu steuern. Je kleiner die Zahl, desto schneller die Drehung.

<ran-demo>
  <r-icon name="loading" size="50" color="#1E90FF" spin="0.7"></r-icon>
  <r-icon name="loading" size="50" color="#1E90FF" spin></r-icon>
  <r-icon name="loading" size="50" color="#1E90FF" spin="5"></r-icon>
</ran-demo>

```html
<r-icon name="loading" size="50" color="#1E90FF" spin="0.7"></r-icon>
<r-icon name="loading" size="50" color="#1E90FF" spin></r-icon>
<r-icon name="loading" size="50" color="#1E90FF" spin="5"></r-icon>
```

## Icon-Liste

Klicke auf ein beliebiges Icon, um sein Markup zu kopieren.

<IconGallery />

## Styling

`<r-icon>` stellt **6 eigene CSS-Custom-Properties** bereit, dazu die semantischen Tokens, die es
aus dem Theme liest. Setze eine dort, wo sie vererbt wird — `:root`, ein Wrapper oder das Element
selbst:

```css
r-icon {
  --ran-icon-color: var(--ran-color-text-secondary);
}
```

Parts: `ran-icon`

Die vollständige Liste steht in den [Style-Tokens](/de/src/ranui/style-tokens#icon); welches Token du wählst, klärt das [Designsystem](/de/src/ranui/design-system/).
