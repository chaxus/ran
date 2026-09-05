---
description: 'Technische Regeln für die Arbeit mit ranui: Einstiegspunkte, der Vertrag aus Attributen, Eigenschaften und Ereignissen, Gestaltung über die Shadow-Grenze hinweg, Zustandsbesitz, SSR, Tests und die zu vermeidenden Antimuster.'
---

# Coding-Leitlinien

Wie man mit ranui _baut_: worin der Komponentenvertrag besteht, wo die Shadow-DOM-Grenze die gewohnten Regeln verändert und welche Fehler es wert sind, sie zu kennen, bevor man sie macht.

Die gestalterische Hälfte davon sind die [Gestaltungsleitlinien](/de/src/ranui/design-guides/); die Tokens sind das [Designsystem](/de/src/ranui/design-system/).

> **Einsetzen, wenn** du ranui-Komponenten in eine Anwendung einbindest: Importe auswählen, Ereignisse verdrahten, etwas gestalten, an das kein Selektor herankommt, auf einem Server rendern oder Tests schreiben.

## Grundsätze

1. **Das Element ist die API.** Attribute, Eigenschaften, Ereignisse, Slots und `::part()` sind der gesamte Vertrag. Alles andere, was du von außen siehst, ist ein Implementierungsdetail, das sich verschieben wird.
2. **Zustand gehört genau einer Stelle.** Entweder besitzt deine Anwendung den Wert und schiebt ihn hinein, oder die Komponente besitzt ihn und sagt dir, wenn er sich ändert. In beide Richtungen zu spiegeln ist genau der Weg, auf dem Werte auseinanderlaufen.
3. **Gestalte über die Shadow-DOM-Grenze mit Custom Properties, `::part()`, `sheet` und Slots.** Gewöhnliche Selektoren überqueren sie nicht; keine noch so hohe Spezifität ändert das.
4. **Importiere, was du benutzt.** Jede Komponente hat ihren eigenen Einstiegspunkt; das Barrel ist Bequemlichkeit, keine Pflicht.
5. **Nimm lieber die Plattform.** Das sind Custom Elements: `addEventListener`, `setAttribute` und `hidden` funktionieren wie spezifiziert, und Framework-Abstraktionen darüber sind optional.

## Einstiegspunkte

Jeder Einstiegspunkt registriert genau das, was sein Name sagt, mehr nicht — eine Seite, die nur Themenwechsel will, zahlt also nie für die Komponentenbibliothek.

| Import                          | Enthält                                                                          |
| ------------------------------- | -------------------------------------------------------------------------------- |
| `ranui`                         | Alle Komponenten (registriert als Nebeneffekt sämtliche `<r-*>`-Elemente)        |
| `ranui/<component>`             | Eine Komponente: `ranui/button`, `ranui/select`, `ranui/modal`, …                |
| `ranui/theme`                   | `initTheme` / `setTheme` / `getTheme` und Token-Überschreibungen; keine Elemente |
| `ranui/i18n`                    | Die Übersetzungs-Engine; keine Elemente                                          |
| `ranui/fonts`                   | Selbst gehostete Geist Sans + Geist Mono (nur das `@font-face`-CSS)              |
| `ranui/style`                   | Das Stylesheet, falls dein Setup es nicht von selbst aufgreift                   |
| `ranui/builder`                 | Der verkettete DOM-Builder, mit dem die Komponenten geschrieben sind             |
| `ranui/ssr`, `ranui/ssr-stream` | Serverseitiges Rendern                                                           |
| `ranui/testing`                 | Helfer, um aus einem Test in einen geschlossenen Shadow Root zu greifen          |
| `ranui/typings`                 | Umgebungstypen (Elementtypen für JSX / TS)                                       |

```js
import 'ranui/button'; // ein Element
import 'ranui'; // alle
```

**Importiere wegen des Nebeneffekts.** `import 'ranui/button'` registriert `<r-button>`; die exportierte Klasse brauchst du selten. Die Ausnahme ist das serverseitige Rendern, wo du sie selbst instanziierst.

## Der Komponentenvertrag

Die genauen Attribute, Eigenschaften, Ereignisse (samt Form ihres `detail`), Slots und Parts jedes Elements werden aus dem Quelltext nach [`COMPONENTS.md`](https://github.com/chaxus/ran/blob/main/packages/ranui/docs/COMPONENTS.md) erzeugt. Die Regeln unten sind das, was jene Tabelle _nicht_ sagt.

### Attribute sind Zeichenketten, Eigenschaften sind typisiert

HTML-Attribute stehen klein geschrieben und sind Zeichenketten; die passende Eigenschaft ist camelCase und nimmt einen echten Wert. Es ist derselbe Zustand, auf zwei Wegen erreicht:

```html
<r-select showsearch dropdownclass="wide"></r-select>
```

```js
select.showSearch = true; // Eigenschaft — camelCase
select.setAttribute('showsearch', ''); // Attribut — klein geschrieben
```

- **Boolesche Attribute zählen nach Anwesenheit**, wie `disabled` an einem nativen `<button>`: `disabled=""` und `disabled="false"` sind beide _deaktiviert_. Entferne das Attribut (oder setze die Eigenschaft auf `false`), um es abzuschalten.
- **Reiche Werte gehen über Eigenschaften.** Arrays, Objekte und `File`s überleben kein Attribut: `attachments` an `r-attachments` etwa ist eine Eigenschaft.
- **Attributnamen im Markup unterscheiden keine Groß- und Kleinschreibung**, deshalb steht im HTML oben `showsearch`, während die Eigenschaft `showSearch` heißt. In JSX schreibst du die Attributform.

### Höre am Element selbst

ranui-Komponenten senden `CustomEvent`s, und die Nutzlast steckt immer in `detail`:

```js
select.addEventListener('change', (event) => {
  const { value, label } = event.detail;
});
```

**Ob ein Ereignis aufsteigt, entscheidet jede Komponente für sich — binde also ans Element, nicht an einen Container.** Der Kern für Formulare und Overlays (`r-input`, `r-checkbox`, `r-select`, `r-modal`) sendet absichtlich nicht aufsteigende Ereignisse an sich selbst: Ein `change` von einem Select in deinem Formular soll nicht wie ein `change` des Formulars aussehen. Andere steigen sehr wohl auf (und sind `composed`, überqueren also Shadow-Grenzen): `r-theme-switch`, `r-voice-button`, `r-attachments`, `r-conversation`, `r-tool-card`, `r-markdown`, `r-math`, `r-mermaid`, `r-router`, `r-route`, `r-link`, `r-colorpicker`.

Ein Listener am Element funktioniert in beiden Fällen; Delegation an einem Vorfahren funktioniert nur bei der zweiten Gruppe und scheitert bei der ersten _stillschweigend_. Prüfe den Quelltext oder [`COMPONENTS.md`](https://github.com/chaxus/ran/blob/main/packages/ranui/docs/COMPONENTS.md), bevor du dich auf Delegation verlässt.

**`before*`-Ereignisse sind abbrechbar.** `r-modal` sendet `beforeopen` / `beforeclose`, bevor es handelt; `event.preventDefault()` legt gegen den Übergang ein Veto ein. Die Paare `open` / `close` / `afteropen` / `afterclose` melden, was bereits geschehen ist, und lassen sich nicht abbrechen.

```js
modal.addEventListener('beforeclose', (event) => {
  if (hasUnsavedChanges) event.preventDefault();
});
```

### Slots und Parts

Inhalt kommt über Slots herein (den Default-Slot und benannte) und bleibt in deinem Dokument, sodass **dein** Seiten-CSS ihn ganz normal gestaltet. Außer Reichweite ist nur, was die Komponente intern baut — und dafür ist `::part()` da.

## Gestalten über die Shadow-Grenze hinweg {#styling-across-the-shadow-boundary}

Jede ranui-Komponente zeichnet in einen **geschlossenen** Shadow Root. Seiten-CSS sickert nicht hinein, und Selektoren greifen nicht hindurch. Es gibt genau vier Wege hinein, in der Reihenfolge der Empfehlung:

| Mittel                   | Wofür                                              | Beispiel                                              |
| ------------------------ | -------------------------------------------------- | ----------------------------------------------------- |
| **Custom Properties**    | Alles, was die Komponente als Token bereitstellt   | `r-button { --ran-btn-background: #7c3aed; }`         |
| **`::part()`**           | Eine strukturelle Feinheit, die kein Token abdeckt | `r-card::part(footer) { justify-content: flex-end; }` |
| **Das Attribut `sheet`** | Programmatisch oder dynamisch eingefügtes CSS      | `el.sheet = '.ran-btn { letter-spacing: .02em }'`     |
| **Slot-Inhalt**          | Markup, das ohnehin dir gehört                     | `<span slot="extra">…</span>`                         |

Custom Properties sind der bevorzugte Weg, weil sie **über die Grenze vererbt** werden: Ein Token auf `:root`, an einer Hülle oder am Element zu setzen wirkt gleichermaßen, und es sind dieselben Tokens, die auch das Theme benutzt. Parts und `sheet` binden dich an die innere Struktur — nimm sie also für echte Lücken und rechne damit, sie bei Aktualisierungen wieder anzufassen.

Was bei keiner Spezifität funktioniert: `r-select .some-inner-class { … }`, `!important` oder ein `querySelector` in die Komponente hinein. Ein geschlossener Root bedeutet, dass `element.shadowRoot` für dein CSS, deine Skripte und die Locator deines Test-Runners gleichermaßen `null` ist.

## Zustand besitzen

Entscheide für jeden Wert, wem er gehört:

- **Die Komponente besitzt ihn** (unkontrolliert): Setze einen Anfangswert und lies den Wert danach aus dem `detail` des Ereignisses, wenn er sich ändert. Am einfachsten, und der Normalfall bei Formularen.
- **Deine Anwendung besitzt ihn** (kontrolliert): Setze die Eigenschaft bei jedem Rendern und behandle das Ereignis als _Bitte_, deinen Zustand zu ändern — nicht als Änderung, die deinem Modell bereits widerfahren ist.

Was zerbricht, ist beides zu tun: eine Kopie des Komponentenwerts im eigenen Zustand halten, sie bei jedem Ereignis zurückschreiben und die Eigenschaft aus diesem Zustand neu setzen. Bei schneller Eingabe laufen die beiden auseinander, und ein Schreiben während des Ereignisses kann in eine Schleife geraten. Wähle eine Richtung.

```js
// Kontrolliert: Der Zustand ist die Quelle der Wahrheit, das Ereignis ist eine Bitte
input.value = state.query;
input.addEventListener('input', (event) => {
  state.query = event.detail.value;
  render(); // was input.value erneut setzt — aber aus einer einzigen Quelle
});
```

## Framework-Anbindung {#framework-integration}

Es handelt sich um gewöhnliche Custom Elements, framework-spezifisch ist also nichts nötig; drei Einzelheiten beißen jedoch:

- **React** (vor 19) setzt jedes JSX-Prop als **Attribut**, reiche Werte kommen also nicht an, und Props im Stil von `onChange` binden nicht an Custom Events. Nimm eine `ref` und setze Eigenschaften bzw. rufe `addEventListener` in einem Effekt auf. React 19 setzt Eigenschaften, wenn es welche gibt, bindet Custom Events aber weiterhin nicht über den Namen — behalte die `ref` also für Listener.
- **Vue** kompiliert unbekannte Tags als Komponenten, sofern man nichts anderes sagt; ergänze `r-` in `compilerOptions.isCustomElement` deiner Build-Konfiguration. Danach bindet `:prop` eine Eigenschaft und `@change` einen echten Ereignis-Listener, beides korrekt.
- **Angular** braucht `CUSTOM_ELEMENTS_SCHEMA`; Svelte und Solid reichen Attribute und `on:`/`on`-Listener direkt durch und brauchen nichts.

Wer TypeScript nutzt, kann `import 'ranui/typings'` für die JSX-Deklarationen der intrinsischen Elemente einbinden.

## Serverseitiges Rendern {#server-rendering}

ranui-Komponenten serialisieren zu **deklarativem Shadow DOM**, ein Server kann also das echte Markup ausgeben, und das erste Bild stimmt schon, bevor irgendein JavaScript läuft:

```js
import 'ranui'; // füllt das SSR-Register
import { renderHTMLToString } from 'ranui/ssr-stream';

const html = await renderHTMLToString(`
  <r-button type="primary">Submit</r-button>
  <r-progress percent="65"></r-progress>
`);
```

`renderToStream(html)` ist dasselbe als asynchroner Generator, für gestreamte Antworten; `renderToString(instance)` in `ranui/ssr` serialisiert eine Komponenteninstanz, die du selbst gebaut hast. Unbekannte Tags gehen unberührt durch, es ist also gefahrlos, das über eine ganze Seite laufen zu lassen.

Zwei Dinge, die man wissen sollte:

- **Der Client baut neu, er verwendet nichts wieder.** Weil die Roots geschlossen sind, kann der Browser den serverseitig gerenderten Baum für die Komponente nicht wiederverwenden; beim Upgrade baut daher jedes Element einen identischen von Grund auf. Du bekommst das erste Bild vom Server; du bekommst keine Wiederverwendung bei der Hydration, und du darfst keinen Zustand in das serverseitige Shadow-Markup legen in der Erwartung, dass der Client ihn liest.
- **Nichts Gemessenes steht auf dem Server bereit.** Alles, was von `getBoundingClientRect` oder `offsetWidth` abhängt, klärt sich nach dem Einhängen im Browser.

## Leistung

- **Importiere je Komponente** auf Seiten, die nur eine Handvoll nutzen; das Barrel ist für Anwendungen, die den Großteil der Bibliothek verwenden.
- **Varianten laden bei Bedarf.** `r-icon` und `r-loading` holen eine Variante zur Laufzeit über ihren Namen, die Grundkosten wachsen also nicht mit der Zahl der Symbole, die du nicht verwendest.
- **Setze Eigenschaften, baue keine Elemente neu.** Ein Custom Element zu ersetzen lässt seinen Konstruktor erneut laufen; eine Eigenschaft zu setzen aktualisiert an Ort und Stelle.
- **Fasse Attributschreibungen zusammen.** Jede Schreibung kann `attributeChangedCallback` auslösen; stelle den Zustand nach Möglichkeit vor dem Einfügen zusammen.

## Testen

**Geschlossene Shadow Roots halten auch Test-Locator auf.** Playwrights `getByRole`, `getByText` und `querySelector` bleiben alle an der Grenze stehen und finden _nichts_ — eine damit geschriebene Spezifikation läuft also grün durch, während sie über Elemente urteilt, die sie nie gesehen hat. Zwei Suiten in diesem Repository waren so geschrieben, bevor es jemandem auffiel. `ranui/testing` ist die benannte, dokumentierte Nahtstelle:

```js
import { insideShadow, settlePainted } from 'ranui/testing';

const label = await insideShadow(page, 'r-button', (root) => root.querySelector('[part=content]')?.textContent);
```

Ansonsten teste den Vertrag, nicht das Innenleben: Setze ein Attribut oder eine Eigenschaft und prüfe das Ereignis sowie das, was die Nutzenden wahrnehmen können. Prüfungen gegen interne Klassennamen brechen bei jedem Umbau und sagen nichts darüber, ob die Komponente funktioniert.

## Antimuster

| Antimuster                                                           | Warum es scheitert                                                                             |
| -------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| `change` für `r-input` / `r-select` an einem Container delegieren    | Diese Ereignisse steigen nicht auf; der Listener feuert nie. Binde ans Element.                |
| `document.querySelector('r-select').shadowRoot`                      | Geschlossener Root: immer `null`. Nimm die öffentliche API, Parts oder `ranui/testing`.        |
| Innenleben mit `r-card .inner { … }` gestalten                       | Selektoren überqueren die Grenze bei keiner Spezifität. Nimm Tokens oder `::part()`.           |
| `!important`, um gegen eine Komponente zu gewinnen                   | Es gibt keinen Kaskadenkonflikt zu gewinnen: Die Regel greift nie. Gleiche Lösung wie oben.    |
| Den Wert einer Komponente in den eigenen Zustand und zurück spiegeln | Zwei Besitzer, ein Wert; sie laufen auseinander und können in Schleifen geraten.               |
| Elemente neu erzeugen, um sie zu aktualisieren                       | Lässt den Konstruktor erneut laufen, verliert Fokus und internen Zustand. Setze Eigenschaften. |
| Eine Farbe neben einer themenbewussten Komponente festschreiben      | Bricht in dem Moment, in dem das Theme wechselt. Nimm semantische Tokens.                      |
| Pauschales `z-index` an einer Hülle, „falls“ ein Overlay aufgeht     | Hebt statischen Inhalt für immer über dein eigenes Rahmenwerk. Grenze es mit `:has()` ein.     |
| Im Test auf `shadowRoot` warten                                      | Siehe oben: Prüfe über `ranui/testing` oder anhand beobachtbaren Verhaltens.                   |

## Zu ranui beitragen

Das Repository führt für Bibliothekscode eigene, strengere Maßstäbe:

- [`docs/DESIGN.md`](https://github.com/chaxus/ran/blob/main/packages/ranui/docs/DESIGN.md): der ausführbare Gestaltungsstandard; neun Regeln setzt `pnpm -F ranui verify:design` durch.
- [`docs/CODING.md`](https://github.com/chaxus/ran/blob/main/packages/ranui/docs/CODING.md): die Komponentenarchitektur, der Zustandsbesitz und die Testregeln für Bibliothekscode.
- [`docs/BUILDER.md`](https://github.com/chaxus/ran/blob/main/packages/ranui/docs/BUILDER.md): der verkettete DOM-Builder und seine reaktiven Primitiven.
- `CLAUDE.md` im Wurzelverzeichnis des Pakets: die Orientierungsdatei, die im npm-Tarball mitgeliefert wird und die Menschen wie Coding-Agenten zuerst lesen.

Vor dem Öffnen eines Pull Requests: `pnpm -F ranui test:all`, `pnpm -F ranui verify:design` und `pnpm verify:docs` (die API- und Token-Tabellen werden erzeugt; die CI schlägt fehl, wenn sie veraltet sind).
