---
description: 'Eine Mikrofon-Schaltfläche für ein Texteingabefeld, die meldet, was gehört wurde, die Anwendung entscheiden lässt, wohin der Text geht, und niemals stellvertretend für den Sprecher absendet.'
---

# Voice Button

Diktat für ein Texteingabefeld, über die Web-Speech-API.

> **Nimm sie, wenn** Sprache _eine weitere_ Art sein soll, ein Textfeld zu füllen — kein Ersatz
> dafür. Tippen muss verfügbar bleiben: Ein Weg nur über Sprache schließt alle aus, deren Sprechen
> abweicht, alle in einem lauten Raum und alle, deren Browser gar keine Erkennung mitbringt.

Eine Mikrofon-Schaltfläche, sonst nichts. Sie übernimmt die Aufnahme und meldet, was gehört wurde;
wohin dieser Text geht, entscheidet der Aufrufer — denn eine Komponente, die auch in ein Feld
schriebe, müsste wissen, in welches, ob anhängen oder ersetzen und was mit der Einfügemarke geschehen
soll: drei Antworten, die je nach Anwendung anders ausfallen.

## Schnellstart

```html
<r-voice-button label="Spracheingabe starten" active-label="Spracheingabe beenden"></r-voice-button>
```

```ts
const mic = document.createElement('r-voice-button');
mic.label = 'Spracheingabe starten';
mic.activeLabel = 'Spracheingabe beenden';
const input = document.querySelector('textarea');
let base = '';

mic.addEventListener('voicestart', () => {
  // Ein Leerzeichen zwischen Getipptem und Gesprochenem, sofern nicht schon eines da ist.
  base = input.value === '' || /\s$/.test(input.value) ? input.value : `${input.value} `;
});

mic.addEventListener('voiceresult', (event) => {
  input.value = base + event.detail.transcript;
});

composer.append(mic);
```

## Die Entscheidungen dahinter

### Sie meldet die ganze Aufnahme, nicht das neueste Bruchstück

Zwischenergebnisse werden **überarbeitet**, während die Erkennung weiterläuft: Aus „你好“ wird
„你好世界“ — es kommt kein zweites Event mit „世界“ hinterher. Wer jedes Event anhängte, landete bei
`你好你好世界`. Merke dir den Text, der schon im Feld stand, und verkette genau einmal.

### Sie sendet nicht

Erkennung liegt oft genug daneben, dass ein stellvertretendes Absenden dem Sprecher die Prüfung
nimmt, die er braucht. Dies füllt das Feld und hört dort auf. Absenden bleibt eine bewusste
Handlung.

### Sie versteckt sich, wo es keine Erkennung gibt

Firefox liefert keine Spracherkennung, und ebenso wenig jeder Browser, dem die API fehlt. Wird
Erkennung nicht unterstützt, versteckt sich das Element mit `hidden`, statt sich mit `disabled`
abzuschalten: `disabled` legt nahe, dass es die Funktion gibt, sie aber vorübergehend nicht
verfügbar ist — die Schaltfläche zu entfernen ist dagegen zutreffend, wenn es die Funktion auf
dieser Plattform überhaupt nicht gibt. Eine Schaltfläche zu zeigen, die nie funktionieren kann,
lüde zu einem Tippen ein, das nichts tut, und verlangte dann eine Erklärung.

### Nur zwei von vier Fehlern lohnen die Anzeige

| Art        | Was es ist                      | Anzeigen?                   |
| ---------- | ------------------------------- | --------------------------- |
| `denied`   | das Mikrofon wurde verweigert   | **ja** (man kann etwas tun) |
| `failed`   | irgendetwas anderes ging schief | **ja**                      |
| `noSpeech` | eine stille Pause               | nein                        |
| `aborted`  | ein Stopp aus dem Programm      | nein                        |

Die letzten beiden kommen über denselben Kanal wie ein echter Fehlschlag und sind keiner. Sie
anzuzeigen hieße, nach jeder gewöhnlichen Aufnahme einen Fehler zu zeigen, nicht nur bei echten
Fehlschlägen.

### Barrierefreiheit

Der zugängliche **Name ändert sich mit dem Zustand**, nicht nur das Icon, und `aria-pressed` trägt
den Umschaltzustand: Ein Screenreader sagt „Spracheingabe beenden, gedrückt“ an, kein Icon.
**Escape verwirft** eine Aufnahme, statt sie zu übernehmen — genau das will jemand, der mitten im
Satz merkt, dass er das Falsche gesagt hat.

Der Zuhörzustand wird über Rahmen, Füllung _und_ einen Ring vermittelt, hängt also nicht allein an
der Farbe. Der Ring ist die einzige Bewegung und reine Dekoration; `prefers-reduced-motion` lässt
ihn weg, ohne dass Information verloren geht.

### Die Sprache folgt der Seite

`lang` wird **pro Aufnahme** gelesen und übernimmt standardmäßig die des Dokuments — eine Anwendung,
die mitten in der Sitzung die Sprache wechselt, diktiert also in der Sprache, die sie gerade zeigt.

## API-Referenz

### Eigenschaften

| Eigenschaft   | Typ       | Standard              | Beschreibung                                                                                                                         |
| ------------- | --------- | --------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| `lang`        | `string`  | die des Dokuments     | BCP-47-Tag der gesprochenen Sprache. Wird pro Aufnahme gelesen.                                                                      |
| `continuous`  | `boolean` | `true`                | Hört über Pausen hinweg weiter, statt bei der ersten aufzuhören.                                                                     |
| `disabled`    | `boolean` | `false`               | Schaltet die Schaltfläche ab: `start()` wird ignoriert, die innere Schaltfläche deaktiviert. Eine laufende Aufnahme stoppt es nicht. |
| `label`       | `string`  | `'Start voice input'` | Zugänglicher Name im Ruhezustand.                                                                                                    |
| `activeLabel` | `string`  | `'Stop voice input'`  | Zugänglicher Name beim Zuhören.                                                                                                      |
| `listening`   | `boolean` | `false`               | Nur lesbar, gespiegelt: gestalte mit `:host([listening])`.                                                                           |
| `supported`   | `boolean` | —                     | Nur lesbar. Ob diese Plattform Sprache erkennen kann.                                                                                |
| `sheet`       | `string`  | `''`                  | CSS, das in das Shadow DOM des Elements injiziert wird.                                                                              |

### Methoden

`start()` · `stop()` (behält das Erkannte) · `abort()` (verwirft es) · `toggle()`.

`toggle()` liest den Zustand des Erkenners selbst statt des gespiegelten Attributs: Eine Aufnahme,
die begonnen hat, ohne es zu melden, ließe beide sonst auseinanderlaufen, und die nächste
Aktivierung versuchte eine zweite Aufnahme zu öffnen, würde abgewiesen und täte nichts.

### Events

| Event         | Detail                    | Wird ausgelöst, wenn                             |
| ------------- | ------------------------- | ------------------------------------------------ |
| `voicestart`  | —                         | eine Aufnahme beginnt                            |
| `voiceresult` | `{ transcript, isFinal }` | Text eintrifft oder überarbeitet wird            |
| `voiceerror`  | `{ kind, detail }`        | die Plattform ein Problem meldet                 |
| `voiceend`    | —                         | die Aufnahme endet, aus welchem Grund auch immer |

### Parts

`button`, `icon`.

## Styling

`<r-voice-button>` stellt **20 eigene CSS-Custom-Properties** bereit, dazu die semantischen Tokens,
die es aus dem Theme liest. Setze eine dort, wo sie vererbt wird: `:root`, ein Wrapper oder das
Element selbst:

```css
r-voice-button {
  --ran-voice-background: var(--ran-color-bg-subtle);
}
```

Parts: `button` · `hint` · `icon`

Die vollständige Liste steht in den [Style-Tokens](/de/src/ranui/style-tokens#voice-button); welches Token du wählst, klärt das [Designsystem](/de/src/ranui/design-system/).

## Siehe auch

- [`createSpeechRecognizer`](../../ranuts/utils/): der Erkenner, den dies umhüllt
- [Conversation](../conversation/): der Verlauf, in dem eine diktierte Nachricht landet
