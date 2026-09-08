---
description: 'Web Component zum Rendern von Markdown, gebaut fürs Streaming: schließt halb eingetroffenes Markdown, zeichnet nur den geänderten Block neu und bettet Code (shiki), Mermaid-Diagramme und Formeln ein.'
---

<script setup>
const quick = `# Hallo

Etwas **fett**, etwas *kursiv*, ein [Link](https://github.com/chaxus/ran) und \`Inline-Code\`.

\`\`\`ts
const greet = (name: string): string => \`Hi \${name}\`;
\`\`\`

| Funktion | Stand |
| --- | --- |
| Streaming | ✅ |
| Mermaid / Formeln | ✅ |`;
const partial = 'Halb getippte *Betonung*, `Inline-Code` und **Fettdruck, der noch eintrifft';
const code = `\`\`\`python
def fib(n: int) -> int:
    return n if n < 2 else fib(n - 1) + fib(n - 2)

print(fib(10))
\`\`\``;
const rich = `\`\`\`mermaid
graph LR; A[Prompt] --> B[Model]; B --> C[Tokens]; C --> D[r-markdown]
\`\`\`

$$
E = mc^2
$$

Das eingebettete \\(e^{i\\pi} + 1 = 0\\) fließt im Text mit.`;
</script>

# Markdown

Rendert Markdown (auch **Token für Token eintreffende KI-Ausgabe**) als Framework-unabhängiges Web Component. `<r-markdown>` ist Vercels [Streamdown](https://streamdown.ai) nachempfunden: Während der Text hereinströmt, schließt es halb getipptes `**bold`, `` `code ``, Links und `$$`-Formeln im Vorbeigehen, zerlegt das Dokument in Blöcke und zeichnet **nur den geänderten Block** neu — eine lange Antwort wird also nie bei jedem Token von oben neu geparst.

Umzäunte ` ```mermaid `-Blöcke werden zu [`<r-mermaid>`](/de/src/ranui/mermaid/), Formeln zu [`<r-math>`](/de/src/ranui/math/), und Code lässt sich mit shiki hervorheben; all das wird beim ersten Mal, wenn der Inhalt es braucht, nachgeladen. Die Ausgabe wird mit DOMPurify bereinigt.

> **Einsetzen, wenn** du Markdown anzeigst, das du nicht vollständig kontrollierst (Chat-Antworten, LLM-Ströme, Nutzerkommentare, Dokumentation), und Streaming, Unterstützung für Code, Diagramme und Formeln sowie sicheres HTML willst, ohne dir Parser, Bereiniger und Highlighter selbst zusammenzustecken.

## Schnellstart

<ran-demo>
  <r-markdown copy highlight :content.prop="quick"></r-markdown>
</ran-demo>

```html
<r-markdown copy highlight content="# Hallo ..."></r-markdown>
```

```js
import 'ranui'; // oder der eigenständige Einstieg:
import 'ranui/markdown';
```

Die Quelle wird aus der **Eigenschaft `content`** gelesen (bevorzugt, wird nicht gespiegelt, sodass das Streamen einer langen Antwort das DOM nicht aufwühlt), aus dem Attribut `content` oder aus dem Textinhalt des Elements:

```js
const el = document.createElement('r-markdown');
el.setAttribute('caret', ''); // zeigt beim Streamen eine blinkende Schreibmarke
for await (const chunk of stream) {
  el.content += chunk; // nur der letzte Block wird neu gezeichnet
}
el.removeAttribute('caret');
container.append(el);
```

## Streaming

`mode="streaming"` (der Standard) schickt den Text zuerst durch [remend](https://www.npmjs.com/package/remend) — den aus Streamdown herausgelösten Abschluss für unvollständiges Markdown. Ein halb empfangenes `**bold` erscheint dadurch fett statt als Sternchen, `[text](https://exa` bleibt einfacher Text, bis die URL schließt, ein `- ` macht aus dem vorigen Absatz keine Überschrift, und so weiter. Für fertige Dokumente setzt du `mode="static"`, überspringst diesen Durchgang und zeichnest alles in einem Zug.

<ran-demo>
  <r-markdown caret :content.prop="partial"></r-markdown>
</ran-demo>

```html
<r-markdown caret content="Halb getippte *Betonung*, `Inline-Code` und **Fettdruck, der noch eintrifft"></r-markdown>
```

- **Schreibmarke**: `caret` zeigt nach dem letzten Block ein blinkendes `▋`, `caret="circle"` ein `●`. Sie verbirgt sich von selbst, solange ein Codezaun noch offen ist oder der letzte Block eine Tabelle ist.
- **Unvollständige Codezäune** bleiben schlichter Text (kein Aufblitzen der Hervorhebung, kein halb gezeichnetes Diagramm), bis der schließende Zaun eintrifft; solange trägt der Container `data-incomplete`.

## Codeblöcke

Jeder Codeblock bekommt eine Kopfzeile mit der Sprache und, wenn gewünscht, Schaltflächen zum Kopieren und Herunterladen. Ergänze `highlight` für Syntaxhervorhebung mit [shiki](https://shiki.style) (wird nachgeladen; Sprachen kommen bei Bedarf; standardmäßig `github-light` / `github-dark`, dem Seitenthema folgend).

<ran-demo>
  <r-markdown copy download line-numbers highlight :content.prop="code"></r-markdown>
</ran-demo>

```html
<r-markdown copy download line-numbers highlight></r-markdown>
<!-- Themes wählen: hell dunkel -->
<r-markdown highlight="vitesse-light vitesse-dark"></r-markdown>
```

## Mermaid und Formeln

<ran-demo>
  <r-markdown :content.prop="rich"></r-markdown>
</ran-demo>

- ` ```mermaid ` → `<r-mermaid>` (mit Vollbild; `copy` / `download` werden durchgereicht).
- `$$…$$`, `\[…\]` und ` ```math ` → `<r-math>` als Block; `\(…\)` → im Text. Das einfache Dollarzeichen `$…$` **muss** über `inline-math` **eingeschaltet werden**, weil es sich mit Geldbeträgen überschneidet.

## API-Referenz

### Attribute

| Attribut       | Typ                                    | Standard      | Beschreibung                                                                                                                                   |
| -------------- | -------------------------------------- | ------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| `content`      | `string`                               | —             | Markdown-Quelle. Die **Eigenschaft** `content` hat Vorrang und wird nicht gespiegelt; sonst gilt der Textinhalt des Elements.                  |
| `mode`         | `'streaming' \| 'static'`              | `'streaming'` | `streaming` schließt unvollständiges Markdown und vergleicht blockweise; `static` zeichnet den ganzen Text in einem Durchgang.                 |
| `caret`        | boolesch / `'circle'`                  | aus           | Blinkende Schreibmarke nach dem letzten Block (`▋`, mit `circle` ein `●`).                                                                     |
| `copy`         | boolesch                               | aus           | Schaltfläche zum Kopieren an Codeblöcken (wird an eingebettete `<r-mermaid>` durchgereicht).                                                   |
| `download`     | boolesch                               | aus           | Schaltfläche zum Herunterladen an Codeblöcken (`code.<ext>` je nach Sprache).                                                                  |
| `line-numbers` | boolesch                               | aus           | Zeilennummern in Codeblöcken.                                                                                                                  |
| `highlight`    | boolesch / Themennamen `"hell dunkel"` | aus           | Syntaxhervorhebung über shiki. Ohne Wert → `github-light github-dark`; ein Name → für beide; zwei Namen → hell / dunkel.                       |
| `inline-math`  | boolesch                               | aus           | Behandelt `$…$` als Formel im Text (`\(…\)` ist es immer).                                                                                     |
| `link-target`  | `string`                               | `'_blank'`    | `target` für externe Links (`rel="noopener noreferrer"` kommt dazu). `_self` lässt Links unangetastet. Seiteninterne `#Anker` bekommen es nie. |
| `theme`        | `'auto' \| 'light' \| 'dark'`          | `'auto'`      | Thema für Hervorhebung und Diagramme. `auto` folgt der Seite (`.dark`, `[data-ran-theme]`, sonst `prefers-color-scheme`).                      |
| `sheet`        | `string`                               | —             | Zusätzliches CSS, das in den Shadow Root eingefügt wird.                                                                                       |
| `label-*`      | `string`                               | englisch      | Überschreibt die Beschriftungen der Bedienelemente: `label-copy`, `label-download`.                                                            |

Eigenschaftsnamen: `content`, `mode`, `caret`, `copyable`, `downloadable`, `lineNumbers`, `highlight`, `inlineMath`, `linkTarget`, `theme`, `sheet`.

## Ereignisse

Alle Ereignisse steigen auf und überqueren die Shadow-Grenze (`composed`).

| Ereignis   | `detail`                               | Wird ausgelöst, wenn                                       |
| ---------- | -------------------------------------- | ---------------------------------------------------------- |
| `render`   | `{ blocks: number, changed: number }`  | ein Zeichendurchgang mindestens einen Block verändert hat  |
| `copied`   | `{ kind: 'code', language, code }`     | ein Codeblock kopiert wurde                                |
| `download` | `{ kind: 'code', language, filename }` | ein Codeblock heruntergeladen wurde                        |
| `error`    | `{ message: string }`                  | Parsen oder Zeichnen fehlschlug (wird auch dort angezeigt) |

## CSS-Parts

| Part           | Beschreibung                                       |
| -------------- | -------------------------------------------------- |
| `markdown`     | Die äußere Hülle.                                  |
| `body`         | Der Container für die Blöcke.                      |
| `block`        | Jeder gezeichnete Block.                           |
| `code`         | Der Container eines Codeblocks.                    |
| `code-header`  | Die Sprach- und Aktionsleiste eines Codeblocks.    |
| `code-lang`    | Die Sprachbezeichnung.                             |
| `code-actions` | Die Gruppe der Aktionsschaltflächen.               |
| `button`       | Jede Schaltfläche zum Kopieren oder Herunterladen. |
| `table`        | Die waagerecht scrollende Tabellenhülle.           |
| `error`        | Der Fehlerkasten (wenn das Zeichnen scheitert).    |

```css
r-markdown::part(code) {
  border-radius: 8px;
}
```

## CSS-Variablen

Am Element überschreibbar (jede fällt auf ein semantisches Token und dann auf einen festen Wert zurück): `--ran-markdown-color`, `--ran-markdown-font-size`, `--ran-markdown-line-height`, `--ran-markdown-gap`, `--ran-markdown-heading-color`, `--ran-markdown-link-color`, `--ran-markdown-inline-code-bg`, `--ran-markdown-code-bg`, `--ran-markdown-code-border`, `--ran-markdown-code-radius`, `--ran-markdown-code-font-size`, `--ran-markdown-mono-font`, `--ran-markdown-blockquote-border`, `--ran-markdown-table-border`, `--ran-markdown-table-header-bg`, `--ran-markdown-caret`, `--ran-markdown-caret-color`, `--ran-markdown-button-color`, `--ran-markdown-error-color`.

## Hinweise

- **Nachgeladen**: Das Parser-Bündel (marked + DOMPurify + remend) lädt beim ersten Zeichnen; shiki, mermaid und Temml laden jeweils erst, wenn der Inhalt sie braucht. Anwendungen, die nie Markdown zeichnen, zahlen nichts.
- **Bereinigt**: Rohes HTML im Markdown geht durch DOMPurify: Skripte, Ereignis-Handler, `javascript:`-URLs, `<style>`, Formulare und Iframes fliegen raus. Die Kästchen von Aufgabenlisten bleiben.
- **Der Blockvergleich** schlüsselt Blöcke nach ihrer Position, sodass der DOM-Zustand in unberührten Blöcken (ein offenes Vollbilddiagramm, eine gescrollte Tabelle) die Streaming-Aktualisierungen überlebt. Das Dokument wird einmal lexikalisch zerlegt, und jeder Block zeichnet sich aus seinen eigenen Tokens — eine Linkreferenz löst sich daher über Blockgrenzen hinweg auf (`[text][id]` im einen Block, `[id]: url` im anderen).
- **GFM-Fußnoten** (`[^1]`) werden **nicht** unterstützt: marked hat keinen Fußnoten-Tokenizer, also erscheinen die Markierungen als wörtlicher Text.
- **shiki wird aus deiner eigenen Installation aufgelöst.** Der ES-Build lässt `import('shiki')` unangetastet, sodass dein Bundler es auftrennt und nur die Grammatiken herunterlädt, die deine Codezäune verwenden. shiki ist eine gewöhnliche Abhängigkeit von ranui, `npm i ranui` bringt es also schon mit; du musst nichts ergänzen.
- **Eigenständiges IIFE**: `dist/iife/markdown.iife.js` hat keinen Resolver und bettet daher mermaid, Temml und shikis _web_-Sprachbündel (rund 50 verbreitete Sprachen) direkt ein. Für vollständige Sprachabdeckung und einen kleineren Download nimm lieber den ES-Einstieg (`ranui/markdown`).
