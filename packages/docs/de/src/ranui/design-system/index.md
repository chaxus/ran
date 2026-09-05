---
description: 'Die Designsprache von ranui und die vollständige Token-Referenz: jedes globale `--ran-*`-Token, mit der Geist-Farbleiter in Hell und Dunkel, den semantischen Rollen, Abständen, Größen, Typografie, Radien, Elevation, Stapelung, Bewegung, Fokus und den Skin-Primitiven.'
---

# Designsystem

Die **Designsprache**, aus der ranui gebaut ist, und der **vollständige** Katalog der Tokens, die sie ausdrücken: jede globale `--ran-*`-Custom-Property, die die Bibliothek deklariert, samt ihrem Wert in beiden Themes. Komponenten lesen diese Tokens, statt Werte festzuschreiben — ein Token zu überschreiben gestaltet also alles um, was es verwendet.

Drei Seiten beantworten drei verschiedene Fragen, und sie sind bewusst getrennt:

| Seite                                                 | Beantwortet                                            |
| ----------------------------------------------------- | ------------------------------------------------------ |
| **Designsystem** (diese Seite)                        | _Was_ die Tokens sind: das Vokabular                   |
| [Gestaltungsleitlinien](/de/src/ranui/design-guides/) | _Wie man wählt_, wenn man eine Oberfläche baut         |
| [Themengestaltung](/de/src/ranui/theme/)              | _Wie man sie zur Laufzeit umschaltet und überschreibt_ |

> **Einsetzen, wenn** du den Namen oder den Wert eines Tokens brauchst (eine Farbrolle, eine Abstandsstufe, eine Symbolgröße, eine Schattenstufe, eine Beschleunigungskurve) oder verstehen willst, warum die Skalen so geformt sind, wie sie sind.

## Die Sprache: Geist

Die Tokens von ranui beruhen auf [Geist](https://vercel.com/geist), dem quelloffenen Designsystem von Vercel. Jede Farbskala ist eine Leiter fester Aufgaben, eine je Sprosse, kein Vorrat an Tönen zur Auswahl: Sprosse 200 ist nicht „ein etwas dunkleres Grau“, sie ist „der Hintergrund beim Überfahren“. Steht die Aufgabe einer Sprosse fest, ist die Farbwahl für einen Interaktionszustand ein Nachschlagen, keine Ermessensfrage.

ranui übernimmt diese Leiter als seine `--ran-*`-Skalen, legt semantische Tokens darüber und liefert **Geist Sans / Geist Mono** als Standardschriften mit.

## Zwei Ebenen {#two-layers}

**Ebene 1: die Basispalette.** Die rohen Skalen weiter unten. Selten unmittelbar verwendet.

**Ebene 2: die semantischen Tokens.** `--ran-color-*` und Verwandte, auf Ebene 1 abgebildet. **Verwende diese Ebene.** Der Dunkelmodus definiert nur Ebene 1 neu, jedes semantische Token wechselt also über `var()` mit — ohne eine einzige Dunkel-Sonderregel je Komponente irgendwo in der Bibliothek.

```
--ran-gray-1000        →  #171717 (hell)   /  #ededed (dunkel)   ← Ebene 1, wechselt
--ran-color-text       →  var(--ran-gray-1000)                    ← Ebene 2, folgt
--ran-btn-color        →  var(--ran-color-text, …)                ← Komponenten-Token
```

Diese Kette ist die ganze Architektur: Ändere eine Basissprosse, und es wirkt überall; ändere ein semantisches Token, und es ändert eine Rolle; ändere ein Komponenten-Token, und es ändert ein Element.

## Farbe

### Die Leiter {#the-ladder}

Jede Farbtonskala läuft von `100` bis `1000`, und jede Sprosse hat genau eine Aufgabe:

| Sprosse | Rolle                       | Sprosse | Rolle                                     |
| ------- | --------------------------- | ------- | ----------------------------------------- |
| 100     | Standardhintergrund         | 600     | Rahmen im gedrückten Zustand              |
| 200     | Hintergrund beim Überfahren | 700     | Deckende Füllung (Schaltfläche/Abzeichen) |
| 300     | Hintergrund beim Drücken    | 800     | Deckende Füllung (Überfahren)             |
| 400     | Standardrahmen              | 900     | Sekundärer Text und Symbole               |
| 500     | Rahmen beim Überfahren      | 1000    | Primärer Text und Symbole                 |

### Hintergründe

| Token                  | Hell                                                            | Dunkel                                                          | Wofür                   |
| ---------------------- | --------------------------------------------------------------- | --------------------------------------------------------------- | ----------------------- |
| `--ran-background-100` | <span class="swatch" style="--swatch:#ffffff"></span> `#ffffff` | <span class="swatch" style="--swatch:#000000"></span> `#000000` | Seitenhintergrund       |
| `--ran-background-200` | <span class="swatch" style="--swatch:#fafafa"></span> `#fafafa` | <span class="swatch" style="--swatch:#000000"></span> `#000000` | Dezente Zonen der Seite |

### Grau — `--ran-gray-100..1000`

Die Skala hinter Text, Rahmen und Flächen.

| Sprosse | Hell                                                            | Dunkel                                                          |
| ------- | --------------------------------------------------------------- | --------------------------------------------------------------- |
| 100     | <span class="swatch" style="--swatch:#f2f2f2"></span> `#f2f2f2` | <span class="swatch" style="--swatch:#1a1a1a"></span> `#1a1a1a` |
| 200     | <span class="swatch" style="--swatch:#ebebeb"></span> `#ebebeb` | <span class="swatch" style="--swatch:#1f1f1f"></span> `#1f1f1f` |
| 300     | <span class="swatch" style="--swatch:#e6e6e6"></span> `#e6e6e6` | <span class="swatch" style="--swatch:#292929"></span> `#292929` |
| 400     | <span class="swatch" style="--swatch:#eaeaea"></span> `#eaeaea` | <span class="swatch" style="--swatch:#2e2e2e"></span> `#2e2e2e` |
| 500     | <span class="swatch" style="--swatch:#c9c9c9"></span> `#c9c9c9` | <span class="swatch" style="--swatch:#454545"></span> `#454545` |
| 600     | <span class="swatch" style="--swatch:#a8a8a8"></span> `#a8a8a8` | <span class="swatch" style="--swatch:#878787"></span> `#878787` |
| 700     | <span class="swatch" style="--swatch:#8f8f8f"></span> `#8f8f8f` | <span class="swatch" style="--swatch:#8f8f8f"></span> `#8f8f8f` |
| 800     | <span class="swatch" style="--swatch:#7d7d7d"></span> `#7d7d7d` | <span class="swatch" style="--swatch:#7d7d7d"></span> `#7d7d7d` |
| 900     | <span class="swatch" style="--swatch:#4d4d4d"></span> `#4d4d4d` | <span class="swatch" style="--swatch:#a0a0a0"></span> `#a0a0a0` |
| 1000    | <span class="swatch" style="--swatch:#171717"></span> `#171717` | <span class="swatch" style="--swatch:#ededed"></span> `#ededed` |

### Grau mit Alpha — `--ran-gray-alpha-100..1000`

Durchscheinend, legt sich also über jede Fläche: die richtige Wahl für einen Schleier, einen Hover-Hauch oder eine Trennlinie, die auf unbekanntem Inhalt liegen muss.

| Sprosse | Hell                                                                         | Dunkel                                                                       |
| ------- | ---------------------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| 100     | <span class="swatch is-alpha" style="--swatch:#0000000d"></span> `#0000000d` | <span class="swatch is-alpha" style="--swatch:#ffffff12"></span> `#ffffff12` |
| 200     | <span class="swatch is-alpha" style="--swatch:#00000015"></span> `#00000015` | <span class="swatch is-alpha" style="--swatch:#ffffff17"></span> `#ffffff17` |
| 300     | <span class="swatch is-alpha" style="--swatch:#0000001a"></span> `#0000001a` | <span class="swatch is-alpha" style="--swatch:#ffffff21"></span> `#ffffff21` |
| 400     | <span class="swatch is-alpha" style="--swatch:#00000014"></span> `#00000014` | <span class="swatch is-alpha" style="--swatch:#ffffff24"></span> `#ffffff24` |
| 500     | <span class="swatch is-alpha" style="--swatch:#00000036"></span> `#00000036` | <span class="swatch is-alpha" style="--swatch:#ffffff3d"></span> `#ffffff3d` |
| 600     | <span class="swatch is-alpha" style="--swatch:#0000003d"></span> `#0000003d` | <span class="swatch is-alpha" style="--swatch:#ffffff82"></span> `#ffffff82` |
| 700     | <span class="swatch is-alpha" style="--swatch:#00000070"></span> `#00000070` | <span class="swatch is-alpha" style="--swatch:#ffffff8a"></span> `#ffffff8a` |
| 800     | <span class="swatch is-alpha" style="--swatch:#00000082"></span> `#00000082` | <span class="swatch is-alpha" style="--swatch:#ffffff78"></span> `#ffffff78` |
| 900     | <span class="swatch is-alpha" style="--swatch:#000000b3"></span> `#000000b3` | <span class="swatch is-alpha" style="--swatch:#ffffff9c"></span> `#ffffff9c` |
| 1000    | <span class="swatch is-alpha" style="--swatch:#000000e8"></span> `#000000e8` | <span class="swatch is-alpha" style="--swatch:#ffffffeb"></span> `#ffffffeb` |

### Blau — `--ran-blue-100..1000`

Reserviert für Links und den Fokusring.

| Sprosse | Hell                                                            | Dunkel                                                          |
| ------- | --------------------------------------------------------------- | --------------------------------------------------------------- |
| 100     | <span class="swatch" style="--swatch:#f0f7ff"></span> `#f0f7ff` | <span class="swatch" style="--swatch:#06193a"></span> `#06193a` |
| 200     | <span class="swatch" style="--swatch:#e9f4ff"></span> `#e9f4ff` | <span class="swatch" style="--swatch:#022248"></span> `#022248` |
| 300     | <span class="swatch" style="--swatch:#dfefff"></span> `#dfefff` | <span class="swatch" style="--swatch:#002f62"></span> `#002f62` |
| 400     | <span class="swatch" style="--swatch:#cae7ff"></span> `#cae7ff` | <span class="swatch" style="--swatch:#003674"></span> `#003674` |
| 500     | <span class="swatch" style="--swatch:#94ccff"></span> `#94ccff` | <span class="swatch" style="--swatch:#00418b"></span> `#00418b` |
| 600     | <span class="swatch" style="--swatch:#48aeff"></span> `#48aeff` | <span class="swatch" style="--swatch:#0090ff"></span> `#0090ff` |
| 700     | <span class="swatch" style="--swatch:#006bff"></span> `#006bff` | <span class="swatch" style="--swatch:#006efe"></span> `#006efe` |
| 800     | <span class="swatch" style="--swatch:#0059ec"></span> `#0059ec` | <span class="swatch" style="--swatch:#005be7"></span> `#005be7` |
| 900     | <span class="swatch" style="--swatch:#005ff2"></span> `#005ff2` | <span class="swatch" style="--swatch:#47a8ff"></span> `#47a8ff` |
| 1000    | <span class="swatch" style="--swatch:#002359"></span> `#002359` | <span class="swatch" style="--swatch:#eaf6ff"></span> `#eaf6ff` |

### Rot — `--ran-red-100..1000`

Gefahr und Fehler.

| Sprosse | Hell                                                            | Dunkel                                                          |
| ------- | --------------------------------------------------------------- | --------------------------------------------------------------- |
| 100     | <span class="swatch" style="--swatch:#ffeeef"></span> `#ffeeef` | <span class="swatch" style="--swatch:#330a11"></span> `#330a11` |
| 200     | <span class="swatch" style="--swatch:#ffe8ea"></span> `#ffe8ea` | <span class="swatch" style="--swatch:#440d13"></span> `#440d13` |
| 300     | <span class="swatch" style="--swatch:#ffe3e4"></span> `#ffe3e4` | <span class="swatch" style="--swatch:#5d0e17"></span> `#5d0e17` |
| 400     | <span class="swatch" style="--swatch:#ffd7d6"></span> `#ffd7d6` | <span class="swatch" style="--swatch:#6f101b"></span> `#6f101b` |
| 500     | <span class="swatch" style="--swatch:#ffb1b3"></span> `#ffb1b3` | <span class="swatch" style="--swatch:#88151f"></span> `#88151f` |
| 600     | <span class="swatch" style="--swatch:#ff676d"></span> `#ff676d` | <span class="swatch" style="--swatch:#f32e40"></span> `#f32e40` |
| 700     | <span class="swatch" style="--swatch:#fc0035"></span> `#fc0035` | <span class="swatch" style="--swatch:#f13242"></span> `#f13242` |
| 800     | <span class="swatch" style="--swatch:#ea001d"></span> `#ea001d` | <span class="swatch" style="--swatch:#e2162a"></span> `#e2162a` |
| 900     | <span class="swatch" style="--swatch:#d8001b"></span> `#d8001b` | <span class="swatch" style="--swatch:#ff565f"></span> `#ff565f` |
| 1000    | <span class="swatch" style="--swatch:#47000c"></span> `#47000c` | <span class="swatch" style="--swatch:#ffe9ed"></span> `#ffe9ed` |

### Bernstein — `--ran-amber-100..1000`

Warnungen.

| Sprosse | Hell                                                            | Dunkel                                                          |
| ------- | --------------------------------------------------------------- | --------------------------------------------------------------- |
| 100     | <span class="swatch" style="--swatch:#fff6de"></span> `#fff6de` | <span class="swatch" style="--swatch:#2a1700"></span> `#2a1700` |
| 200     | <span class="swatch" style="--swatch:#fff4cf"></span> `#fff4cf` | <span class="swatch" style="--swatch:#361900"></span> `#361900` |
| 300     | <span class="swatch" style="--swatch:#fff1c1"></span> `#fff1c1` | <span class="swatch" style="--swatch:#502800"></span> `#502800` |
| 400     | <span class="swatch" style="--swatch:#ffdc73"></span> `#ffdc73` | <span class="swatch" style="--swatch:#5b3000"></span> `#5b3000` |
| 500     | <span class="swatch" style="--swatch:#ffc543"></span> `#ffc543` | <span class="swatch" style="--swatch:#703e00"></span> `#703e00` |
| 600     | <span class="swatch" style="--swatch:#ffa600"></span> `#ffa600` | <span class="swatch" style="--swatch:#ed9a00"></span> `#ed9a00` |
| 700     | <span class="swatch" style="--swatch:#ffae00"></span> `#ffae00` | <span class="swatch" style="--swatch:#ffae00"></span> `#ffae00` |
| 800     | <span class="swatch" style="--swatch:#ff9300"></span> `#ff9300` | <span class="swatch" style="--swatch:#ff9300"></span> `#ff9300` |
| 900     | <span class="swatch" style="--swatch:#aa4d00"></span> `#aa4d00` | <span class="swatch" style="--swatch:#ff9300"></span> `#ff9300` |
| 1000    | <span class="swatch" style="--swatch:#561900"></span> `#561900` | <span class="swatch" style="--swatch:#fff3d5"></span> `#fff3d5` |

### Grün — `--ran-green-100..1000`

Erfolg.

| Sprosse | Hell                                                            | Dunkel                                                          |
| ------- | --------------------------------------------------------------- | --------------------------------------------------------------- |
| 100     | <span class="swatch" style="--swatch:#ecfdec"></span> `#ecfdec` | <span class="swatch" style="--swatch:#002608"></span> `#002608` |
| 200     | <span class="swatch" style="--swatch:#e5fce7"></span> `#e5fce7` | <span class="swatch" style="--swatch:#00320b"></span> `#00320b` |
| 300     | <span class="swatch" style="--swatch:#d3fad1"></span> `#d3fad1` | <span class="swatch" style="--swatch:#003a0e"></span> `#003a0e` |
| 400     | <span class="swatch" style="--swatch:#b9f5bc"></span> `#b9f5bc` | <span class="swatch" style="--swatch:#004615"></span> `#004615` |
| 500     | <span class="swatch" style="--swatch:#82eb8d"></span> `#82eb8d` | <span class="swatch" style="--swatch:#006717"></span> `#006717` |
| 600     | <span class="swatch" style="--swatch:#4ce15e"></span> `#4ce15e` | <span class="swatch" style="--swatch:#00952d"></span> `#00952d` |
| 700     | <span class="swatch" style="--swatch:#28a948"></span> `#28a948` | <span class="swatch" style="--swatch:#00ac3a"></span> `#00ac3a` |
| 800     | <span class="swatch" style="--swatch:#279141"></span> `#279141` | <span class="swatch" style="--swatch:#009432"></span> `#009432` |
| 900     | <span class="swatch" style="--swatch:#107d32"></span> `#107d32` | <span class="swatch" style="--swatch:#00ca50"></span> `#00ca50` |
| 1000    | <span class="swatch" style="--swatch:#003a00"></span> `#003a00` | <span class="swatch" style="--swatch:#d8ffe4"></span> `#d8ffe4` |

### Semantische Farbtokens

Die Ebene, die Komponenten tatsächlich lesen. Alles hier löst sich über die Skalen oben auf und wechselt daher von selbst mit dem Theme.

| Token                          | Löst auf zu                                                                                                                                | Rolle                                   |
| ------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------- |
| `--ran-color-bg`               | `--ran-background-100`                                                                                                                     | Seitenhintergrund                       |
| `--ran-color-bg-subtle`        | `--ran-background-200`                                                                                                                     | Dezente Zonen der Seite                 |
| `--ran-color-bg-elevated`      | `--ran-background-100` · gray-100 (dunkel)                                                                                                 | Karten, Flächen                         |
| `--ran-color-bg-muted`         | `--ran-gray-100`                                                                                                                           | Eingesenkte / gedämpfte Füllungen       |
| `--ran-color-bg-hover`         | `--ran-gray-200`                                                                                                                           | Fläche beim Überfahren                  |
| `--ran-color-bg-active`        | `--ran-gray-300`                                                                                                                           | Fläche beim Drücken                     |
| `--ran-color-text`             | `--ran-gray-1000`                                                                                                                          | Haupttext                               |
| `--ran-color-text-secondary`   | `--ran-gray-900`                                                                                                                           | Sekundärer Text                         |
| `--ran-color-text-disabled`    | `--ran-gray-700`                                                                                                                           | Deaktivierter Text                      |
| `--ran-color-border`           | `--ran-gray-400`                                                                                                                           | Standardrahmen                          |
| `--ran-color-border-secondary` | `--ran-gray-300`                                                                                                                           | Dezenterer Rahmen                       |
| `--ran-color-border-hover`     | `--ran-gray-500`                                                                                                                           | Rahmen beim Überfahren                  |
| `--ran-color-border-active`    | `--ran-gray-600`                                                                                                                           | Rahmen beim Drücken                     |
| `--ran-color-primary`          | `--ran-gray-1000`                                                                                                                          | Die Hauptaktion (monochrom)             |
| `--ran-color-primary-hover`    | <span class="swatch" style="--swatch:#383838"></span> `#383838` · <span class="swatch" style="--swatch:#cccccc"></span> `#cccccc` (dunkel) | Primär beim Überfahren                  |
| `--ran-color-primary-active`   | <span class="swatch" style="--swatch:#4d4d4d"></span> `#4d4d4d` · <span class="swatch" style="--swatch:#b3b3b3"></span> `#b3b3b3` (dunkel) | Primär beim Drücken                     |
| `--ran-color-primary-text`     | `--ran-background-100`                                                                                                                     | Die Tinte **auf** einer primären Fläche |
| `--ran-color-success`          | `--ran-green-700`                                                                                                                          | Erfolg                                  |
| `--ran-color-warning`          | `--ran-amber-700`                                                                                                                          | Warnung                                 |
| `--ran-color-danger`           | `--ran-red-700`                                                                                                                            | Gefahr / Fehler                         |
| `--ran-color-link`             | `--ran-blue-700`                                                                                                                           | Links                                   |

`--ran-color-primary-hover` / `-active` sind die beiden Literale der semantischen Ebene: Sie bewegen sich auf den Seitenhintergrund zu statt entlang einer Skala, deshalb definiert der Dunkelmodus sie unmittelbar neu.

### Was jeder Akzent bedeutet

- **Primär ist monochrom**: schwarz auf weiß im Hellen, weiß auf schwarz im Dunklen (der Markenton von Geist, `<r-button type="primary">`). Text und Symbole darauf nutzen `--ran-color-primary-text`, das mitwechselt. Ein eigenes „Kontrast“-Token gibt es nicht: Primär _ist_ die Aktion mit dem höchsten Kontrast.
- **Blau ist reserviert** für Links (`--ran-color-link`) und den Fokusring. Es ist kein alternatives Primär.
- **Grün = Erfolg · Bernstein = Warnung · Rot = Gefahr.** Je eine Bedeutung.

Es gibt kein `--ran-color-error`; das Token heißt `--ran-color-danger`. Ein `var()`, das eine nie deklarierte Eigenschaft nennt, löst sich zu nichts auf, und die ganze Deklaration fällt stillschweigend weg — deshalb lohnt es, einen falschen Namen an dieser Tabelle zu prüfen statt zu raten.

## Abstand {#spacing}

Die Zwischenräume zwischen Dingen: `padding`, `margin`, `gap`. Eine Basiseinheit von 4px mit **neun Werten**, mehr nicht:

| Token           | Wert | Token            | Wert |
| --------------- | ---- | ---------------- | ---- |
| `--ran-space-1` | 4px  | `--ran-space-8`  | 32px |
| `--ran-space-2` | 8px  | `--ran-space-10` | 40px |
| `--ran-space-3` | 12px | `--ran-space-16` | 64px |
| `--ran-space-4` | 16px | `--ran-space-24` | 96px |
| `--ran-space-6` | 24px |                  |      |

Die Zahl ist das Vielfache von 4px, die Skala springt also: Ein `--ran-space-5` gibt es nicht. Genau darum geht es: Eine begrenzte Auswahl erzeugt den Rhythmus einer Seite.

## Größen

Die eigenen Maße eines Elements: Symbolgrößen, Höhen von Bedienelementen, kleine quadratische oder rechteckige Steuerelemente.

| Token          | Wert | Typischerweise                                       |
| -------------- | ---- | ---------------------------------------------------- |
| `--ran-size-1` | 16px | Kästchen einer Checkbox, kleines Symbol im Fließtext |
| `--ran-size-2` | 18px | —                                                    |
| `--ran-size-3` | 20px | Symbol innerhalb eines Bedienelements                |
| `--ran-size-4` | 24px | Symbolschaltfläche in einer Werkzeugleiste           |
| `--ran-size-5` | 28px | Höhe eines kompakten Bedienelements                  |
| `--ran-size-6` | 30px | —                                                    |
| `--ran-size-7` | 32px | Standardhöhe eines Bedienelements                    |

**Das ist mit Absicht eine eigene Skala neben dem Abstand**, und beide zu mischen ist ein maschinell geprüfter Fehler (`sizing-scale`). Die beiden haben unterschiedliche Bereiche und Abstufungen (eine Abstandsskala, die ab 4px verdoppelt, ergibt für Symbol- und Bedienelementgrößen ungeschickte Werte), und wer sie verwendet, muss die eine nachjustieren können, ohne die andere zu stören: Ein größer werdendes Symbol soll nicht zugleich jeden Zwischenraum verbreitern, der zufällig denselben Pixelwert teilt. Wo eine Sprosse zahlenmäßig mit einer Abstandsstufe zusammenfällt (`--ran-size-4` und `--ran-space-6` sind beide 24px), ist das Zufall, kein Alias.

Ein wirklich einmaliges Maß, das keine andere Komponente teilt (etwa das `min-width` eines Menüs), bleibt ein schlichtes Komponenten-Token mit eigenem literalen Rückfallwert, statt in eine Stufe gezwungen zu werden.

## Typografie {#typography}

| Token               | Wert                                                           |
| ------------------- | -------------------------------------------------------------- |
| `--ran-font-family` | Geist / Geist Sans, danach der System-UI-Stapel                |
| `--ran-font-mono`   | Geist Mono, danach `ui-monospace`, SF Mono, Menlo, Consolas, … |
| `--ran-font-size`   | `14px` (die Basisgröße)                                        |
| `--ran-line-height` | `1.5715`                                                       |

Schrift ist nach **Rolle** geordnet, und die Rolle legt Schriftart, Größe, Stärke und Zeilenhöhe gemeinsam fest:

| Rolle       | Verwendung                 | Stärke-Token                                                                   | Größen-Tokens                             |
| ----------- | -------------------------- | ------------------------------------------------------------------------------ | ----------------------------------------- |
| **heading** | Überschriften              | `--ran-text-heading-weight` (600)                                              | `--ran-text-heading-1..4` (32/24/20/16px) |
| **label**   | Einzeilig, zum Überfliegen | `--ran-text-label-weight` (500)                                                | `--ran-text-label-1..3` (14/13/12px)      |
| **copy**    | Mehrzeiliger Fließtext     | `--ran-text-copy-weight` (400)                                                 | `--ran-text-copy-1..2` (16/14px)          |
| **button**  | Text auf Schaltflächen     | `--ran-text-button-weight` (500)                                               | `--ran-text-button-size` (14px)           |
| **mono**    | Code, Daten, Dachzeilen    | `--ran-text-mono-weight-regular` (400) / `--ran-text-mono-weight-medium` (500) | übernimmt die Größen von label / copy     |

Zwei Tokens gibt es nur, damit eine Rolle richtig sitzt:

| Token                           | Wert      | Warum                                                                  |
| ------------------------------- | --------- | ---------------------------------------------------------------------- |
| `--ran-text-heading-tracking`   | `-0.03em` | Überschriften brauchen in großen Graden eine engere Laufweite.         |
| `--ran-text-button-line-height` | `1`       | Sauberes vertikales Zentrieren in einem Bedienelement mit fester Höhe. |

Geist deckelt die Stärke bei 600 (Semibold). Betonung kommt aus Größe und Abstand, nicht aus einem fetteren Schnitt. Ein `--ran-text-copy-3` gibt es nicht: Die 12px-Stufe heißt `--ran-text-label-3`.

### Schriften

ranui hostet beide Schnitte selbst (variable Stärke 100–900, SIL OFL 1.1), ein einziger Import lädt sie also ohne CDN-Abhängigkeit:

```js
import 'ranui/fonts'; // Bundler
```

```html
<link rel="stylesheet" href="…/ranui/dist/fonts/fonts.css" />
```

Ohne ihn fallen die Tokens auf die Schriftstapel des Systems zurück; alles funktioniert weiter, nur ohne die Geist-Schnitte.

## Radius

| Token               | Wert     | Wofür                                              |
| ------------------- | -------- | -------------------------------------------------- |
| `--ran-radius-sm`   | `6px`    | Bedienelemente: Schaltfläche, Eingabefeld, Auswahl |
| `--ran-radius-md`   | `12px`   | Karten, Dialoge                                    |
| `--ran-radius-lg`   | `16px`   | Große Flächen                                      |
| `--ran-radius-full` | `9999px` | Pillenformen, Profilbilder                         |

## Elevation

Schatten ist eine **Rolle**, keine Dekoration. Wähle die Stufe danach, was das Element ist. Der Dunkelmodus ersetzt alle drei, denn ein für eine weiße Seite abgestimmter Schatten verschwindet auf einer schwarzen.

| Token                   | Wofür                                                                              | Hell                                                            | Dunkel                                                                                      |
| ----------------------- | ---------------------------------------------------------------------------------- | --------------------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| `--ran-shadow-elevated` | Flächen im Fluss, die zusätzlich einen Rahmen haben: `r-card`, `r-section`         | `0 1px 2px rgba(0,0,0,.04), 0 2px 4px -2px rgba(0,0,0,.05)`     | `0 1px 2px rgba(0,0,0,.16)`                                                                 |
| `--ran-shadow-menu`     | Vorübergehende Ebenen über dem Inhalt: Auswahlliste, Select-Menü, Popover, Hinweis | `0 2px 4px rgba(0,0,0,.05), 0 8px 24px -6px rgba(0,0,0,.14)`    | `0 1px 1px rgba(0,0,0,.2), 0 4px 8px -4px rgba(0,0,0,.4), 0 16px 24px -8px rgba(0,0,0,.5)`  |
| `--ran-shadow-modal`    | Blockierende Dialoge: `r-modal`                                                    | `0 4px 12px rgba(0,0,0,.08), 0 20px 48px -12px rgba(0,0,0,.22)` | `0 1px 1px rgba(0,0,0,.2), 0 8px 16px -4px rgba(0,0,0,.4), 0 24px 32px -8px rgba(0,0,0,.5)` |

Rahmenlose Overlays verlassen sich für die Abgrenzung allein auf den Schatten, die Overlay-Stufen tragen also echtes Gewicht; ein Overlay, das auf die gehobene Stufe zurückfällt, wirkt flach und an die Seite geheftet.

## Stapelung {#stacking}

Schwebende Overlays werden nach `<body>` portalt und brauchen daher eine ausdrückliche Stufe:

| Token              | Standard | Wofür                                                                                                      |
| ------------------ | -------- | ---------------------------------------------------------------------------------------------------------- |
| `--ran-z-modal`    | `1000`   | Blockierende Dialoge und ihre Maske                                                                        |
| `--ran-z-dropdown` | `1100`   | Auswahlliste / Select-Menü / Popover: **über** dem Modal, damit ein Select in einem Dialog sichtbar bleibt |
| `--ran-z-message`  | `1200`   | Hinweise und Benachrichtigungen: immer obenauf                                                             |

Die Leiter beginnt bei 1000, damit sie gewöhnliches Seitenrahmenwerk überragt (Navigationsleisten und Hintergründe liegen üblicherweise im Zehnerbereich). Überschreibe eine Stufe an `:root` oder je Komponente (`--ran-dropdown-host-z-index`, `--ran-modal-root-z-index`, `--ran-message-z-index`), niemals mit `!important`.

## Bewegung

| Token                        | Wert    | Verwendung                            |
| ---------------------------- | ------- | ------------------------------------- |
| `--ran-motion-duration-fast` | `0.15s` | Übergänge beim Überfahren und Drücken |
| `--ran-motion-duration-base` | `0.2s`  | Popovers, Menüs                       |
| `--ran-motion-duration-slow` | `0.35s` | Größere Einblendungen                 |

| Beschleunigungs-Token        | Kurve                               | Charakter                                                |
| ---------------------------- | ----------------------------------- | -------------------------------------------------------- |
| `--ran-motion-ease-standard` | `cubic-bezier(0.645,0.045,0.355,1)` | Ein und aus, für den allgemeinen Gebrauch                |
| `--ran-motion-ease-snappy`   | `cubic-bezier(0.33,0,0.15,1)`       | Schnell, ohne Überschwingen: Schalter                    |
| `--ran-motion-ease-spring`   | `cubic-bezier(0.34,1.26,0.5,1)`     | Leichtes Überschwingen: Schaltflächen, Karten            |
| `--ran-motion-ease-bouncy`   | `cubic-bezier(0.34,1.56,0.64,1)`    | Verspieltes Überschwingen: Gefällt mir, In den Warenkorb |
| `--ran-motion-ease-smooth`   | `cubic-bezier(0.4,0,0.2,1)`         | Ruhig, ohne Überschwingen: Einblendungen, Layout         |

Die spring-Familie ist aus abgestimmten SwiftUI-Federn destilliert (Response und Dämpfung auf eine Bézier mit einem einzigen Überschwingen eingedampft).

**Kombiniere sie nur mit Bewegungseigenschaften**: `transform`, `opacity`, die Geometrie des Kastens. Paletteneigenschaften (`background-color`, `color`, `border-color`, `box-shadow`, `fill`, `stroke`) tragen bewusst keinen Standardübergang, denn CSS kann eine Interaktion nicht von einem Themenwechsel unterscheiden: Jede Überblendung, die du einer Farbe gibst, feuert auch beim Wechsel zwischen hell und dunkel. Jede Komponente bietet trotzdem einen `--ran-*-transition`-Haken, falls du es doch willst.

## Fokus

| Token                            | Wert                                                                 | Wofür                                                            |
| -------------------------------- | -------------------------------------------------------------------- | ---------------------------------------------------------------- |
| `--ran-focus-ring`               | `0 0 0 2px var(--ran-background-100), 0 0 0 4px var(--ran-blue-700)` | Der Standardring, als `box-shadow`                               |
| `--ran-focus-ring-inverse-color` | `#fff`                                                               | Die Ringfarbe für eine Fläche, die in _beiden_ Themes dunkel ist |

Der Ring hat zwei Lagen: einen inneren in der Hintergrundfarbe und einen äußeren in Blau. So bleibt er auf jeder Fläche sichtbar und bleibt blau, statt dem inzwischen monochromen Primär zu folgen.

`--ran-focus-ring-inverse-color` wird **bewusst nicht im Dunkelmodus neu definiert**: Es gibt ihn für eine Komponente, deren eigene Fläche unabhängig vom Seitenthema fest dunkel ist (die Steuerleiste von `r-player`, über beliebigem Video), und diese Fläche ändert sich nicht, wenn die Seite es tut.

## Skin-Primitive

Die wenigen strukturellen Werte, die Komponenten teilen und die weder Farbe noch Größe noch Schrift sind. Bewusst knapp gehalten: Diese Ebene war einmal viel größer, und das meiste davon fiel mit den Theme-Paketen weg.

| Token                           | Wert                         | Wofür                                                                                |
| ------------------------------- | ---------------------------- | ------------------------------------------------------------------------------------ |
| `--ran-skin-border-width`       | `1px`                        | Die Rahmenstärke, die Komponenten zeichnen                                           |
| `--ran-skin-border-style`       | `solid`                      | Der Rahmenstil, den Komponenten zeichnen                                             |
| `--ran-skin-border-image-width` | `4px`                        | Der Einzug von `border-image-slice`, geteilt von button/checkbox/input/modal/message |
| `--ran-skin-raised-shadow`      | `var(--ran-shadow-elevated)` | Der Schatten gehobener Flächen, indirekt, damit ein Skin ihn ändern kann             |
| `--ran-skin-font-family`        | `var(--ran-font-family)`     | Die Schriftfamilie der Komponenten, auf dieselbe Weise indirekt                      |

## Was der Dunkelmodus neu definiert

`data-ran-theme="dark"` an `<html>` (oder an einem beliebigen Teilbaum, siehe [Themengestaltung](/de/src/ranui/theme/)) definiert **die Basispalette neu und sonst nichts**, mit drei Ausnahmen, die sich nicht über eine Skala auflösen lassen:

- die gesamte Ebene 1: jede Sprosse von Grau, Grau-Alpha, Blau, Rot, Bernstein und Grün sowie beide Hintergründe;
- `--ran-color-bg-elevated`, das im Dunklen auf `--ran-gray-100` zeigt, damit sich eine Karte von einer schwarzen Seite abhebt, statt darin zu verschwinden;
- `--ran-color-primary-hover` / `-active`, die Literale sind statt Verweise auf eine Skala;
- alle drei Schattenstufen, für einen dunklen Grund neu abgestimmt.

Alles andere (jedes weitere semantische Token, jede Größe, jede Dauer) ist genau einmal definiert.

## Komponenten-Tokens

Unterhalb der semantischen Ebene stellt jede Komponente eigene Haken bereit, benannt als:

```
--ran-{component}-{element}[-{state}]-{property}
```

zum Beispiel `--ran-btn-hover-background`, `--ran-select-search-active-border-width`. Sie fallen standardmäßig auf semantische Tokens zurück: `var(--ran-btn-background, var(--ran-color-primary, #171717))`. Ein semantisches Token zu überschreiben erreicht sie also alle, ein Komponenten-Token zu überschreiben verengt die Änderung auf ein einzelnes Element.

Die vollständige erzeugte Liste ist [style-tokens-public.md](https://github.com/chaxus/ran/blob/main/packages/ranui/docs/style-tokens-public.md) im Repository; die API je Element steht [hier](/de/src/ranui/api). Wie man sie anwendet, zeigt die [Themengestaltung](/de/src/ranui/theme/#customizing-tokens).

## Tokens im eigenen CSS verwenden {#using-tokens-in-your-own-css}

```css
.panel {
  background: var(--ran-color-bg-elevated);
  color: var(--ran-color-text);
  border: var(--ran-skin-border-width) var(--ran-skin-border-style) var(--ran-color-border);
  border-radius: var(--ran-radius-md);
  padding: var(--ran-space-4);
  box-shadow: var(--ran-shadow-elevated);
}
```

Drei Regeln halten das im Dunkeln sicher:

1. **Kein roher Hex-Wert** für etwas, das dem Theme folgen soll.
2. **Ein Rückfallwert muss ein Token nennen, das mitwechselt**: `var(--ran-color-text, var(--ran-gray-1000))`, niemals `var(--ran-color-text, #171717)`.
3. **Ein Rückfallwert muss ein Token nennen, das es gibt**, sonst fällt die Deklaration weg und das Element behält stillschweigend, was es geerbt hat.

> Jedes globale Token, das die Bibliothek deklariert, steht auf dieser Seite, und ein Unit-Test schlägt fehl, wenn eines hinzukommt, ohne hier dokumentiert zu sein. Komponentenbezogene Tokens werden getrennt erzeugt, in [style-tokens-public.md](https://github.com/chaxus/ran/blob/main/packages/ranui/docs/style-tokens-public.md).
