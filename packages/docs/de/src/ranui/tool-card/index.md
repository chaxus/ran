---
description: 'Rendert einen Werkzeugaufruf und sein Ergebnis aus einer deklarierten Absicht (generic, terminal oder diff) statt aus Markup, das ein Werkzeug wählen musste.'
---

# Tool Card

Rendert einen Werkzeugaufruf und sein Ergebnis aus einer **deklarierten Absicht** statt aus Markup.

> **Nimm sie, wenn** du zeigst, was ein Agent oder ein Job tatsächlich getan hat (ein
> Shell-Kommando, eine Dateiänderung, eine Suche) und das Werkzeug nur sagen soll, _was es ist_,
> während die Oberfläche entscheidet, wie es aussieht.

Ein Werkzeug, das HTML zurückgibt, hat Renderer, Theme und Layout stellvertretend für die
Oberfläche gewählt — und zwar an der einen Stelle (dem Ergebnis, das das Modell sieht), an die
UI-Belange nicht gehören. Eine deklarierte Absicht hält beides getrennt: Derselbe Aufruf kann hier
als Terminalblock erscheinen, in einem kompakten Verlauf als einzelne Zeile und in einem Editor als
Sprungziel — ohne dass das Werkzeug von einem davon weiß.

## Schnellstart

```html
<r-tool-card open></r-tool-card>
```

```ts
const card = document.createElement('r-tool-card');

card.call = { card: 'terminal', title: 'pnpm test', cwd: '/repo' };
card.status = 'running';

// …wenn der Aufruf zurückkommt
card.result = { card: 'terminal', output: '2351 passed', exitCode: 0 };
card.status = 'success';

conversation.append(card);
```

## Kartenarten

### `generic`

Der Standard und zugleich der Rückfall. Titel, wahlweise eine Schlüssel-Wert-Tabelle der Argumente,
die zu zeigen sich lohnt, und wahlweise Ergebnisinhalt.

```ts
card.call = { card: 'generic', title: 'Read file', input: { path: 'src/a.ts', limit: '200' } };
card.result = { card: 'generic', content: 'export const a = 1;' };
```

### `terminal`

Der Aufruf _ist_ ein Shell-Kommando. `title` ist das Kommando; `description` und `cwd` erscheinen
über der Ausgabe. Ein `exitCode` ungleich null wird gezeigt, null nicht.

```ts
card.call = { card: 'terminal', title: 'ls -la', description: 'List the tree', cwd: '/repo' };
card.result = { card: 'terminal', output: 'total 8\ndrwxr-xr-x …', exitCode: 0 };
```

### `diff`

Der Aufruf legt Dateien an oder ändert sie. Jeder Eintrag erscheint als Hunk im Unified-Stil mit
beiden Rändern, berechnet von `diffLines` aus [ranuts/utils](../../ranuts/utils/). **Ein `oldText`
von null bedeutet, dass die Datei angelegt wird** — genau das weiß eine Ansicht zum Zeitpunkt des
Aufrufs, denn der Aufrufer hat keinen vorherigen Inhalt zu lesen.

```ts
card.call = {
  card: 'diff',
  title: 'Edit config',
  diffs: [{ path: 'vite.config.ts', oldText: 'port: 3000\n', newText: 'port: 5173\n' }],
};
```

## Zwei Regeln, die beißen

Diese Ansichten werden bei einem laufenden Aufruf berechnet **und noch einmal, wenn ein Protokoll
abgespielt wird**. Alles Weitere folgt daraus.

- **Eine Ansicht ist eine reine Funktion der Aufrufargumente** (plus des Ergebnisses, bei einer
  Ergebnisansicht). Kein I/O, keine Uhr, kein Sitzungszustand; sonst widerspricht die Wiedergabe
  dem, was der Nutzer ursprünglich sah.
- **Eine unbekannte Karte degradiert, sie wirft nie.** Eine Kartenart von einem neueren Erzeuger
  oder ein im Speicher verstümmelter Wert erscheint als `generic` mit dem Titel, den er hat, und
  eine fehlerhafte Ansicht erscheint leer. Die Darstellung darf eine Wiedergabe nicht kaputtmachen
  können.

## Fundstellen

Alle `locations` eines Aufrufs erscheinen als Schaltflächen, die `locationclick` auslösen, damit ein
Editor mitziehen kann:

```ts
card.call = { card: 'generic', title: 'Read', locations: [{ path: 'src/a.ts', line: 42 }] };
card.addEventListener('locationclick', (e) => openInEditor(e.detail.location));
```

## API-Referenz

### Eigenschaften

| Eigenschaft | Typ                                 | Standard    | Beschreibung                                                |
| ----------- | ----------------------------------- | ----------- | ----------------------------------------------------------- |
| `call`      | `ToolCallView \| null`              | `null`      | Die laufende Ansicht, aus den Aufrufargumenten abgeleitet.  |
| `result`    | `ToolResultView \| null`            | `null`      | Die abgeschlossene Ansicht. Ersetzt die laufende.           |
| `status`    | `'running' \| 'success' \| 'error'` | `'running'` | Wird gespiegelt, das Styling kann sich also darauf stützen. |
| `open`      | `boolean`                           | `false`     | Ob der Rumpf aufgeklappt ist.                               |
| `sheet`     | `string`                            | `''`        | CSS, das in das Shadow DOM des Elements injiziert wird.     |

Ein unbekannter `status`-Wert liest sich als `running` zurück.

### Events

| Event           | Detail                       | Wird ausgelöst, wenn               |
| --------------- | ---------------------------- | ---------------------------------- |
| `locationclick` | `{ location: ToolLocation }` | eine Dateireferenz aktiviert wird. |

### Parts

`card`, `header`, `status`, `title`, `toggle`, `body`, `description`, `exit`, `input`,
`output`, `file`, `path`, `hunk`, `line`, `locations`, `location`.

Diff-Zeilen tragen ein `data-kind` von `context`, `added` oder `removed`.

### Barrierefreiheit

Der Kopf ist ein echter `<button type="button">` mit `aria-expanded` und damit ohne Zusatzaufwand
per Tastatur erreichbar und bedienbar.

## Styling

`<r-tool-card>` stellt **24 eigene CSS-Custom-Properties** bereit, dazu die semantischen Tokens, die
es aus dem Theme liest. Setze eine dort, wo sie vererbt wird: `:root`, ein Wrapper oder das Element:

```css
r-tool-card {
  --ran-tool-card-io-background: var(--ran-color-bg-subtle);
}
```

Parts: `body` · `exit` · `file` · `hunk` · `io` · `io-text` · `line` · `location` · `locations` · `path` · `row`

Die vollständige Liste steht in den [Style-Tokens](/de/src/ranui/style-tokens#tool-card); welches Token du wählst, klärt das [Designsystem](/de/src/ranui/design-system/).

## Siehe auch

- [Conversation](../conversation/): dies als `mount`-Ziel für die Ansicht eines Werkzeugaufrufs nutzen
- [ranuts/utils](../../ranuts/utils/): `diffLines`, das die `diff`-Karte zeichnet
