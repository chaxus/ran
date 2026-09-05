---
description: 'Das Laufzeit-Theming von ranui: initTheme / setTheme / getTheme, heller, dunkler und System-Modus, begrenzte Ziele und Token-Überschreibungen zur Laufzeit.'
---

# Theming

Die **Laufzeit**-Hälfte des Stylings von ranui: zwischen hellem, dunklem und System-Modus wechseln,
die Wahl speichern und Tokens im laufenden Betrieb überschreiben.

Die Tokens selbst (wie sie heißen und wofür jedes gut ist) sind das
[Designsystem](/de/src/ranui/design-system/); die Regeln zur Auswahl sind die
[Designrichtlinien](/de/src/ranui/design-guides/). Diese Seite handelt nur vom _Anwenden_.

> **Nimm es, wenn** du in einer ranui-App helles und dunkles Theming brauchst: rufe `initTheme`
> einmal beim Laden auf, `setTheme` zum Umschalten und `setThemeToken(s)`, wenn du einzelne Tokens
> überschreiben willst, ohne zusätzliches CSS auszuliefern.

Es gibt genau zwei Themes: **light** und **dark**, dazu einen **system**-Modus, der der
Betriebssystem-Einstellung folgt. (Die früheren „Theme-Pack“-APIs wurden entfernt; `setThemePack`
und `RanThemePackName` gibt es nicht mehr.)

## Schnellstart

```js
import { initTheme, setTheme, getTheme } from 'ranui/theme';

// Das gespeicherte Theme ('light' | 'dark' | 'system') aus localStorage wiederherstellen
initTheme();

// Theme wechseln — wird automatisch gespeichert
setTheme('dark');
setTheme('system'); // folgt prefers-color-scheme und aktualisiert live

getTheme(); // → 'light' | 'dark' | 'system' | ''
```

Der eigene Einstiegspunkt **`ranui/theme`** liefert nur die Theming-Engine: Ihn zu importieren
registriert kein einziges Custom Element, eine Seite, die nur Tokens und Dunkelmodus will, zieht
also nie die Komponentenbibliothek nach. Dieselben Funktionen werden auch aus dem Top-Level-Barrel
`ranui` reexportiert.

`setTheme` schreibt ein Attribut `data-ran-theme` (und das alte `theme`) an `<html>`; alle
Komponenten-Styles reagieren darauf. Die Wahl wird unter dem localStorage-Schlüssel `ran-theme`
gespeichert.

Für eine fertige Umschalt-Oberfläche nimm [`<r-theme-switch>`](/de/src/ranui/theme-switch/): ein
Segment-Steuerelement für System, Hell und Dunkel, bereits an diese API angebunden, über Instanzen
hinweg abgeglichen und die `theme-color`-Metas aktualisierend.

## API

| Funktion          | Signatur                                                                | Beschreibung                                                                                                |
| ----------------- | ----------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| `initTheme`       | `(target?: ThemeTarget) => void`                                        | Stellt das im `localStorage` gespeicherte Theme wieder her. Einmal beim Laden aufrufen. Im SSR wirkungslos. |
| `setTheme`        | `(name: RanThemeName, target?: ThemeTarget) => void`                    | Wendet `'light'` \| `'dark'` \| `'system'` an und speichert es. `'system'` folgt dem OS live.               |
| `getTheme`        | `(target?: ThemeTarget) => RanThemeName \| ''`                          | Liest das aktive Theme. Gibt `'system'` im Systemmodus zurück, `''`, wenn nichts gesetzt ist.               |
| `setThemeToken`   | `(name: string, value: string \| number, target?: HTMLElement) => void` | Überschreibt zur Laufzeit ein einzelnes Token (Inline-Style am Ziel).                                       |
| `setThemeTokens`  | `(tokens: ThemeTokenMap, target?: HTMLElement) => void`                 | Überschreibt viele Tokens auf einmal. Ein Wert `null` / `undefined` löscht das Token.                       |
| `clearThemeToken` | `(name: string, target?: HTMLElement) => void`                          | Entfernt eine Laufzeit-Überschreibung eines Tokens.                                                         |

**Typen**

```ts
type RanThemeName = 'light' | 'dark' | 'system';
type ThemeTarget = HTMLElement | Document; // Standard: document.documentElement
type ThemeTokenMap = Record<string, string | number | null | undefined>;
```

**`target`**: Alle Funktionen zielen standardmäßig auf `<html>` (`document.documentElement`).
Übergib ein Element, um ein Theme oder eine Token-Überschreibung auf einen Teilbaum statt auf die
ganze Seite zu begrenzen.

**SSR-sicher**: Jeder Zugriff auf `document`, `localStorage` und `matchMedia` ist abgesichert, diese
Funktionen sind beim Server-Rendering also wirkungslos (und werfen nicht).

## Wie der Dunkelmodus funktioniert

`setTheme('dark')` setzt `data-ran-theme="dark"` an `<html>`. Das Stylesheet definiert daraufhin
**nur die Basispalette** für Dunkel neu, aus einer einzigen Quelle der Wahrheit; jedes semantische
Token `--ran-color-*` verweist über `var()` auf diese Palette, kippt also automatisch mit — und
keine Komponente trägt eine eigene Dunkelmodus-Überschreibung.

Zwei Folgen, die man kennen sollte:

- **Dein eigenes CSS bekommt den Dunkelmodus geschenkt**, wenn es semantische Tokens verwendet — und
  bekommt ihn falsch, wenn es eine Farbe fest verdrahtet oder einen nur für Hell gedachten Rückfall
  schreibt. Siehe [Tokens im eigenen CSS verwenden](/de/src/ranui/design-system/#using-tokens-in-your-own-css).
- **Beim Theme-Wechsel darf nichts überblenden.** CSS kann nicht wissen, warum sich eine Farbe
  geändert hat; eine `transition` auf einer Palettenfarbe lässt daher beim Umschalten jedes Element
  in seinem eigenen Tempo überblenden. Die Komponenten von ranui tun das bewusst nicht — deine
  sollten es auch nicht.

## Tokens anpassen {#customizing-tokens}

### Zur Laufzeit (JS)

```js
import { setThemeToken, setThemeTokens, clearThemeToken } from 'ranui/theme';

// Ein Token, an <html> (wirkt auf alles)
setThemeToken('--ran-color-primary', '#7c3aed');

// Mehrere auf einmal
setThemeTokens({
  '--ran-color-primary': '#7c3aed',
  '--ran-radius-md': '8px',
});

// Auf einen Teilbaum begrenzen
setThemeToken('--ran-color-primary', '#e11d48', document.querySelector('#panel'));

// Eine Überschreibung entfernen
clearThemeToken('--ran-color-primary');
```

### Zur Bauzeit (CSS)

Überschreibe Tokens unter `:root` oder in jedem beliebigen Bereich:

```css
:root {
  --ran-color-primary: #7c3aed;
  --ran-radius-md: 8px;
}
```

### Welche Ebene überschreiben

Weil der Dunkelmodus nur die Basispalette neu definiert:

- Überschreibe ein **semantisches** Token (`--ran-color-primary`) für eine Änderung, die in beiden
  Themes gleich sein soll.
- Überschreibe eine Stufe der **Basisskala** (`--ran-blue-700`), wenn die Änderung mit dem Theme
  kippen soll: Alles Semantische, das darauf verweist, zieht mit.
- Überschreibe ein **Komponenten**-Token (`--ran-btn-hover-background`), um genau ein Element zu
  ändern.

Diese Schichtung ist auf der Seite zum [Designsystem](/de/src/ranui/design-system/#two-layers)
vollständig beschrieben. Beachte: Eine Laufzeit-Überschreibung ist ein Inline-Style am Ziel — sie
gewinnt für diesen Teilbaum gegen Stylesheet-Regeln. Genau das macht Theming pro Panel möglich und
genau das macht eine vergessene Überschreibung später schwer auffindbar.

## Ein Theme auf einen Teil der Seite begrenzen

Jede Funktion nimmt ein Ziel entgegen, eine Vorschaufläche kann also ein anderes Theme fahren als die
Seite drumherum:

```js
const preview = document.querySelector('#preview');

setTheme('dark', preview); // nur dieser Teilbaum
getTheme(preview); // → 'dark'
```

Das Attribut landet an diesem Element statt an `<html>`, den Rest erledigt die Token-Kaskade.
