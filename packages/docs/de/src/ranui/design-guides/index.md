---
description: 'So setzt du ranui auf einer Oberfläche ein: eine Rolle wählen und den Wert vom Token bestimmen lassen, jeden erreichbaren Zustand entwerfen und prüfen, was tatsächlich gezeichnet wurde.'
---

# Gestaltungsleitlinien

So setzt du ranui auf einer echten Oberfläche ein: Wähle eine Rolle und einen Zustand, und lass die Tokens die Werte liefern.

Die Regeln selbst stehen an zwei Stellen, und diese Seite verlinkt sie, statt sie zu wiederholen: der
[Designleitfaden](/src/design/guide) für die Methode, die für jedes Produkt gilt, und der
[ranui-Implementierungsadapter](https://github.com/chaxus/ran/blob/main/packages/ranui/docs/adapters/DESIGN.md)
für ranuis Tokens, Stufen und Komponentenregeln. Beide werden in `node_modules/ranui/docs/DESIGN.md` ausgeliefert. Das
[Designsystem](/de/src/ranui/design-system/) listet jedes Token und seinen Wert, die
[Themengestaltung](/de/src/ranui/theme/) behandelt Überschreibungen zur Laufzeit und die
[Informationsarchitektur](/de/src/ranui/information-architecture/) den Aufbau der Seite.

> **Einsetzen, wenn** du Farbe, Abstand, Schrift, Tiefe oder Bewegung für eine Oberfläche aus `<r-*>`-Elementen wählst.

## Grundsätze

1. **Klarheit vor Eigenart.** Zuerst müssen die Hauptaufgabe und die Hauptaktion unverkennbar sein.
2. **Bestehende Steuerelemente wiederverwenden.** `r-button`, `r-input`, `r-select` und `r-modal` bringen Formular-,
   Tastatur- und Barrierefreiheitsverhalten bereits mit; gestalte sie um, statt sie nachzubauen.
3. **Nach Rolle und Zustand entscheiden.** „Was ist dieser Text?“ hat eine Antwort; „welche Größe sieht richtig aus?“ hat
   keine. Das Token der Rolle liefert den Wert, und er folgt dem Theme.
4. **Entwirf jeden erreichbaren Zustand und sieh dir das Ergebnis an.** Der Normalzustand ist einer von acht, und einen
   Schatten, den niemand sieht, bemerkt man erst im Browser.

Das sind Ausgangspunkte. Weiche von einem ab, wenn die Oberfläche dadurch besser wird, und sag, warum.

## Eine Farbe wählen

Die [Leiter](/de/src/ranui/design-system/#the-ladder) legt bereits fest, wie Überfahren und Gedrücktsein aussehen;
deine Aufgabe ist es, die Rolle zu benennen.

| Das Element ist…                           | Nimm                                                           |
| ------------------------------------------ | -------------------------------------------------------------- |
| Der Hintergrund einer Seite oder Fläche    | `--ran-color-bg` / `-bg-subtle` / `-bg-elevated` / `-bg-muted` |
| Unter dem Zeiger / wird gedrückt           | `--ran-color-bg-hover` / `-bg-active`                          |
| Text                                       | `--ran-color-text` / `-text-secondary` / `-text-disabled`      |
| Ein Rahmen                                 | `--ran-color-border` / `-hover` / `-active`                    |
| Die eine Aktion, für die es die Seite gibt | `--ran-color-primary` (darauf `--ran-color-primary-text`)      |
| Ein Status                                 | `--ran-color-success` / `-warning` / `-danger`                 |
| Ein Link                                   | `--ran-color-link`                                             |

**Jede Akzentfarbe hat genau eine Bedeutung.** Primär ist einfarbig, also bleibt Blau für Links und den
Fokusring; Grün ist Erfolg, Bernstein Warnung, Rot Gefahr. Wer Rot zur Betonung nutzt, hat später nichts mehr,
um „Gefahr“ zu sagen.

Ein roher Hex-Wert, ein Fallback, der nicht mit dem Theme wechselt, oder ein Fallback, der ein nicht
existierendes Token nennt, bricht im Dunkelmodus still oder verwirft die ganze Deklaration; die
[Farbregeln](https://github.com/chaxus/ran/blob/main/packages/ranui/docs/DESIGN.md#ranui-color) des Adapters
erklären jeden Fall, und `verify:design` findet sie in ranuis eigenem Quellcode.

## Abstand und Rhythmus

Nimm Abstände aus der [4px-Skala](/de/src/ranui/design-system/#spacing) und lass die Entfernung Bedeutung tragen:

- **8px** zwischen Elementen innerhalb einer Gruppe.
- **16px** zwischen Gruppen.
- **24–32px** zwischen Bereichen.

Ein kleinerer Abstand bedeutet eine engere Beziehung, also bricht schon ein einziger Abstand außerhalb der Skala den Rhythmus. Gib jedem
Abstand genau einen Verantwortlichen: Zähl den Margin des Kindes und das Padding des Elternelements, bevor du einen dritten Abstand
dazwischen setzt.

## Schrift wählen

Frag, welche **Rolle** der Text spielt (Überschrift, Beschriftung, Fließtext, Schaltfläche, dicktengleich); Schriftart, Größe, Stärke und
Zeilenhöhe ergeben sich aus der [Schriftskala](/de/src/ranui/design-system/#typography). Wirklich einmaliger Text,
etwa eine Gesteneinblendung auf einem Video, fährt mit einem eigenen Komponenten-Token besser, als in die
nächstliegende Rolle gezwängt zu werden.

## Tiefe: Schatten und Stapelung

Wähle die Schattenstufe danach, was das Element ist: eine Fläche im Fluss, ein schwebendes Overlay oder ein blockierender
Dialog. Ein Overlay, das auf die Kartenstufe zurückfällt, wirkt wie an die Seite geheftet.

**ranui-Overlays in dein eigenes Rahmenwerk einbetten.** Die [z-index-Leiter](/de/src/ranui/design-system/#stacking)
beginnt bei 1000, also überragt ein portaltes Overlay gewöhnliches Seitenrahmenwerk von selbst. Ein Overlay mit `position: fixed`,
das in seinem eigenen Shadow DOM bleibt (der Dialog von `r-modal`), entkommt nur bis zu seinem nächsten übergeordneten
**Stapelkontext**. Wenn du eingebetteten Inhalt in etwas einwickelst, das einen erzeugt
(`isolation`, `opacity < 1`, `transform`, `filter`, `will-change`), heb diese Hülle nur an, solange ein
Overlay tatsächlich offen ist:

```css
.embed {
  isolation: isolate; /* cheap: no z-index of its own, so nothing is promoted */
}
/* Escalate only while a real overlay is open — never "just in case" */
.embed:has(r-modal[open]),
.embed:has(r-modal[closing]) {
  position: relative;
  z-index: 100;
}
```

Ein dauerhafter `z-index` auf der Hülle hebt alles darin, statischen Inhalt eingeschlossen, über deine
fixierte Kopfzeile, und zwar während des gesamten Scrollens; so wurde diese Seite einmal ausgeliefert. Berücksichtige `closing` ebenso
wie `open`: Die Maske wird während ihres Schließübergangs weiter gezeichnet.

## Bewegung {#motion}

Häufiges Feedback (Überfahren, Fokus, Drücken) erfolgt sofort. Wenn Bewegung eine Änderung erklärt, bleibt Rückmeldung
bei 0–100ms, Einblenden dauert 250–400ms und bremst ab, Ausblenden dauert 150–200ms und beschleunigt.
Halte sie unterbrechbar und beachte `prefers-reduced-motion`.

**Lass niemals eine Farbeigenschaft animieren.** CSS kann nicht wissen, _warum_ sich eine Farbe geändert hat, also feuert eine `transition`
auf `background-color`, `color`, `border-color`, `box-shadow`, `fill` oder `stroke` auch beim Wechsel des
**Themes**: Jedes Element blendet in seinem eigenen Tempo über, während die Seite längst umgeschaltet hat. Animiere
stattdessen `transform` und `opacity`. Auch `transition: all` und ein nacktes `transition: 0.2s` schließen Farbe ein.

## Zustände und Texte

Jeder erreichbare Zustand gehört zum Entwurf: Überfahren, Gedrückt, Fokus, Deaktiviert, Ladend, Leer, Fehler.
Überfahren entspricht `bg-hover` / `border-hover`, Gedrückt `bg-active`, Fokus dem Fokusring. Nichts, was man nicht
anklicken kann, darf anklickbar aussehen: `r-card` reagiert nur mit `hoverable` auf das Überfahren.

Auch Texte gehören zum System:

- **Schaltflächen** benennen das Ergebnis, mit dem Objekt, wenn der Kontext es nicht liefert: „Mitglied löschen“. Ein
  eindeutig benannter Dialog darf „Löschen“ sagen; vermeide ein allgemeines „OK“.
- **Fehler** sagen, was passiert ist, und dann, wie man es behebt. ✅ „Bauen fehlgeschlagen: Das Bündel überschreitet die
  Größengrenze. Verkleinere es oder erhöhe die Grenze.“ ❌ „Vorgang fehlgeschlagen, bitte erneut versuchen.“
- **Bestätigungen** nennen die Änderung, nicht den Erfolg, und erscheinen erst, wenn sie bestätigt ist.
  ✅ „Projekt gelöscht“ ❌ „Vorgang erfolgreich“.
- Lass den Zusammenhang das Überflüssige wegnehmen: Ein Dialog mit dem Titel „Projekt löschen“ braucht keine Schaltfläche
  „Projekt endgültig und für immer löschen“.

## Barrierefreiheit {#accessibility}

- Erfülle den Kontrast nach **WCAG AA** für Text gegen seinen Hintergrund.
- **Signalisiere einen Zustand nie allein über Farbe**: Verbinde sie mit einem Symbol, einer Beschriftung oder Text.
- Jedes interaktive Element behält einen **sichtbaren Fokusring** (`--ran-focus-ring`, oder
  `outline: 2px solid var(--ran-color-focus); outline-offset: 2px`).
- **Alles ist mit der Tastatur erreichbar.**
- Achte auf `prefers-reduced-motion` und `prefers-color-scheme`.

## Maus und Finger, schmal und breit

Weder die Eingabeart noch die Fenstergröße ist das zweitrangige Ziel.

- Ziehen, Schieberegler und Gesten nutzen **Pointer Events**, mit `touch-action: none` genau auf der
  Ziehfläche. `touch-action: none` ohne Zeiger-Handler dahinter ist ein kaputtes Steuerelement.
- **Was nur beim Überfahren erscheint, braucht eine Tipp-Alternative.** `trigger="hover"` an `r-select` oder `r-popover`
  wird auf Touch-Geräten zum Klick; alles, was du selbst baust, sollte es genauso machen.
- Bevorzuge **viewportbezogene Größen** (`min(560px, calc(100vw - 32px))`, `clamp()`), statt einen
  Breakpoint zu erfinden: ranui hat kein Breakpoint-Token, also ist jeder feste Breakpoint eine Zahl, die jemand pflegen muss.
- **Verstecke auf Mobilgeräten nie den einzigen Weg, etwas zu tun.** Ordne stattdessen um.
- **Eine gemessene Position stimmt nur bis zum nächsten Reflow.** Alles, was aus
  `getBoundingClientRect()` abgeleitet ist, veraltet beim Ändern der Fenstergröße, beim Reflow des Containers und, bei einem portalten Panel, beim
  Scrollen. Bei schmaler Breite zu laden testet nicht das _Verkleinern auf_ diese Breite, und genau dort bricht es.

## Was die Bibliothek maschinell durchsetzt

`pnpm -F ranui verify:design` prüft neun Regeln in ranuis eigenem Quellcode: Farb-Fallbacks, die nicht
mit dem Theme wechseln, rohe Farbliterale, die Abstands- und Größenskalen, reine Maus-Ziehvorgänge, `:host`-Regeln, die
`hidden` aushebeln, Fallbacks mit nicht deklarierten Tokens, Komponenten, die ihren eigenen Shadow-Baum durchsuchen, und Shadow-Bäume,
die außerhalb des Konstruktors gebaut werden. Eine Zeile, die eine Regel absichtlich bricht, sagt das mit
`design-ok: <rule> <reason>`. Die Prüfungen decken nur die konfigurierten Quellverzeichnisse ab; eine Anwendung, die
ranui nutzt, führt ihre eigenen Prüfungen aus und sieht sich ihre eigenen Seiten an.

## Gestaltungsbeispiele {#design-examples}

<DesignIllustrations />

## Nachweise und Abnahme {#evidence-and-acceptance}

Der Abschnitt [eine Änderung prüfen](/src/design/guide#verifying-a-change) des Leitfadens sagt, was in einem echten
Browser zu prüfen und was zu berichten ist: was du beobachtet hast, was du nur gefolgert hast und was du nicht prüfen konntest.
Die Prüfung durch einen Agenten ist keine Abnahme durch den Nutzer.
