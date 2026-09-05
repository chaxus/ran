# setFontSize2html

Setzt die `font-size` des Wurzelelements `<html>` im Verhältnis zum Viewport, sodass ein Entwurf mit fester Breite (375px, die übliche Breite mobiler Entwürfe) mit dem echten Bildschirm mitwächst: die klassische Technik des „flexiblen rem“ für mobile Layouts in `rem`-Einheiten.

## Verwendung

```ts
import { setFontSize2html } from 'ranuts/utils';

setFontSize2html(); // die Entwurfsbreite ist standardmäßig 375px
// oder, für einen Entwurf in anderer Breite:
setFontSize2html(414);
```

Ruf es einmal beim Start auf. Es läuft bei Größenänderung und Drehung von allein erneut, ein einziger Aufruf reicht also für die gesamte Lebensdauer der Seite.

```css
/* Ein Kasten, im 375px breiten Entwurf mit 200px gezeichnet */
.box {
  width: 5.33333rem; /* 200 / 375 * 100 */
}
```

## API

### `setFontSize2html(designWidth?)`

#### Parameter

| Parameter     | Beschreibung                                        | Typ      | Standard |
| ------------- | --------------------------------------------------- | -------- | -------- |
| `designWidth` | Die Breite in px, in der der Entwurf angelegt wurde | `number` | `375`    |

#### Rückgabe

Kein Rückgabewert (`void`). Als Nebenwirkung setzt es `documentElement.style.fontSize` und meldet eigene Listener für `resize` und `orientationchange` an.

## Hinweise

1. **Für das iPad gilt automatisch eine andere Grundlage.** Meldet `currentDevice()` ein iPad, wechseln Entwurfsbreite und Seitenverhältnis auf `768` / `1024:768`, statt das übergebene `designWidth` zu verwenden. Die Funktion geht von einem Telefon-Entwurf aus und gleicht die eine häufige Ausnahme aus.
2. **Es gibt kein Aufräumen.** Anders als die meisten Helfer dieser Bibliothek, die Listener anmelden, gibt `setFontSize2html` keine Abmeldefunktion zurück. Es ist dafür gedacht, einmal für die gesamte Lebensdauer der Seite aufgerufen zu werden, nicht innerhalb einer Komponente, die kommt und geht.
3. Braucht `document` und `window`; sichere die Aufrufstelle ab, falls der Code beim serverseitigen Rendern laufen kann.
4. Passt zu einem CSS-Build-Schritt (postcss-pxtorem oder ähnlich), der die `px`-Werte des Entwurfs mit derselben Grundlage in `rem` umrechnet. `setFontSize2html` setzt nur die Schriftgröße der Wurzel; dein Stylesheet rechnet es nicht um.
