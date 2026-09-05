# adoptStyles / adoptSheetText

Bringt CSS in ein Shadow DOM ein und bevorzugt dabei **Constructable Stylesheets**: Ein CSS wird einmal geparst und dann _als Referenz_ von allen Instanzen der Komponente geteilt, sodass auch tausend Instanzen nur ein geparstes Ergebnis halten. Wo es die nicht gibt, weichen beide darauf aus, ein `<style>`-Tag einzufügen.

Beide sind serverseitig sicher (sie kehren sofort zurück, wenn es kein `document` gibt) und idempotent.

## Verwendung

```ts
import css from './index.less?inline';
import { adoptStyles } from 'ranuts/utils';

class MyElement extends HTMLElement {
  constructor() {
    super();
    const root = this.shadowRoot || this.attachShadow({ mode: 'closed' });
    adoptStyles(root, css);
  }
}
```

## API

### adoptStyles

Für die **statischen** Stile einer Komponente. Der Ausweichpfad entdoppelt je **Wurzel**: Ein Shadow Root behält genau ein markiertes `<style>`, und wer zuerst schreibt, gewinnt. Die statischen Stile einer Komponente sollten je Wurzel einmal vorhanden sein — ein zweiter Aufruf heißt also, dass die aufrufende Seite sich geirrt hat.

#### Parameter

| Parameter    | Beschreibung                                     | Typ          | Standard               |
| ------------ | ------------------------------------------------ | ------------ | ---------------------- |
| `shadowRoot` | Das Ziel-Shadow-Root                             | `ShadowRoot` | Erforderlich           |
| `cssText`    | Der Stiltext                                     | `string`     | Erforderlich           |
| `marker`     | Markierendes Attribut am ausweichenden `<style>` | `string`     | `'data-adopted-style'` |

#### Rückgabe

Kein Rückgabewert (`void`)

### adoptSheetText

Für **dynamische** Stile, die zur Laufzeit hereinkommen (etwa die `sheet`-Eigenschaft einer Komponente). Der einzige Unterschied zu `adoptStyles` ist, woran der Ausweichpfad entdoppelt: hier am **cssText**, sodass eine Wurzel mehrere verschiedene dynamische Stylesheets stapeln kann, während ein identisches nur einmal eingefügt wird.

#### Parameter

| Parameter    | Beschreibung                                     | Typ          | Standard               |
| ------------ | ------------------------------------------------ | ------------ | ---------------------- |
| `shadowRoot` | Das Ziel-Shadow-Root                             | `ShadowRoot` | Erforderlich           |
| `cssText`    | Der Stiltext                                     | `string`     | Erforderlich           |
| `marker`     | Markierendes Attribut am ausweichenden `<style>` | `string`     | `'data-adopted-sheet'` |

#### Rückgabe

Kein Rückgabewert (`void`)

## Konstanten

| Name                   | Wert                   | Bedeutung                                                    |
| ---------------------- | ---------------------- | ------------------------------------------------------------ |
| `ADOPTED_STYLE_MARKER` | `'data-adopted-style'` | Standardmarkierung für das Ausweich-Tag von `adoptStyles`    |
| `ADOPTED_SHEET_MARKER` | `'data-adopted-sheet'` | Standardmarkierung für das Ausweich-Tag von `adoptSheetText` |

Das Argument `marker` gibt es, damit eine Bibliothek die von ihr eingefügten Stile zeichnen und später wiederfinden kann. ranui übergibt zum Beispiel `data-ranui` und `data-ranui-sheet`.
