---
description: 'Gestaltungsregeln für Oberflächen mit ranui: eine Rolle wählen und den Wert vom Token bestimmen lassen, jeden erreichbaren Zustand entwerfen und prüfen, was tatsächlich gezeichnet wurde.'
---

# Gestaltungsleitlinien

Die Regeln, denen eine aus ranui-Komponenten gebaute Oberfläche folgen sollte, damit sie sich als **ein System** liest und nicht als Haufen von Teilen.

Auf dieser Seite geht es um **Urteilsvermögen**: zu welchem Token man greift und was vor der Auslieferung zu prüfen ist. Der Tokenkatalog selbst ist das [Designsystem](/de/src/ranui/design-system/); Umschalten und Überschreiben zur Laufzeit ist die [Themengestaltung](/de/src/ranui/theme/); welche Form die Seite vor alledem annimmt, ist die [Informationsarchitektur](/de/src/ranui/information-architecture/). Die vollständigen Designregeln stehen im Repository unter [`packages/ranui/docs/DESIGN.md`](https://github.com/chaxus/ran/blob/main/packages/ranui/docs/DESIGN.md).

> **Einsetzen, wenn** du eine Seite anlegst oder aus `<r-*>`-Elementen eine Komponente auf Anwendungsebene baust und über eine Farbe, einen Abstand, eine Textgröße, einen Schatten oder eine Bewegungsdauer entscheiden musst. Die kurze Antwort ist immer dieselbe: **Wähle eine Rolle und lass das Token den Wert bestimmen.**

## Grundsätze

1. **Klarheit vor Eigenart.** Die Hauptaufgabe und die Hauptaktion müssen unverkennbar sein, bevor irgendetwas anderes erwogen wird.
2. **Bestehende Steuerelemente wiederverwenden.** Semantische native Elemente oder passende ranui-Komponenten wie `r-button`, `r-input`, `r-select` und `r-modal` bevorzugen. Formular-, Tastatur- und Barrierefreiheitsverhalten erhalten, statt es nur für die Gestaltung neu zu bauen.
3. **Tokens, niemals rohe Werte.** Ein Hex-Code, ein Abstand von `20px` oder ein von Hand gewählter Schatten sind Entscheidungen, die dem Theme nicht folgen werden.
4. **Nach Rolle und Zustand entscheiden, nicht nach Augenmaß.** „Was ist dieser Text?“ (Überschrift / Beschriftung / Fließtext / Schaltfläche) hat eine Antwort; „welche Größe sieht richtig aus?“ hat keine.
5. **Entwirf jeden erreichbaren Zustand.** Normal, Überfahren, Gedrückt, Fokus, Deaktiviert, Ladend, Leer, Fehler: Der Normalfall ist einer von acht.
6. **Prüfe, was gezeichnet wurde.** In Hell _und_ Dunkel, schmal _und_ breit, mit Maus _und_ Finger. Eine Durchsicht findet keinen Schatten, den man nicht sieht.

Vorrang, wenn zwei Regeln auseinanderziehen: **Ziele der Nutzenden → geprüfte Belege → diese Leitlinien → bereits ausgelieferte Muster → allgemeine Faustregeln.**

## Eine Farbe wählen

Farbe wird nach **Rolle und Zustand** vergeben, nie nach Augenmaß gewählt. Die [Leiter](/de/src/ranui/design-system/#the-ladder) legt bereits fest, wie Überfahren und Gedrücktsein aussehen; deine Aufgabe ist es, die Rolle zu benennen.

| Das Element ist…                           | Nimm                                                           |
| ------------------------------------------ | -------------------------------------------------------------- |
| Der Hintergrund einer Seite oder Fläche    | `--ran-color-bg` / `-bg-subtle` / `-bg-elevated` / `-bg-muted` |
| Unter dem Zeiger / wird gedrückt           | `--ran-color-bg-hover` / `-bg-active`                          |
| Text                                       | `--ran-color-text` / `-text-secondary` / `-text-disabled`      |
| Ein Rahmen                                 | `--ran-color-border` / `-hover` / `-active`                    |
| Die eine Aktion, für die es die Seite gibt | `--ran-color-primary` (darauf `--ran-color-primary-text`)      |
| Ein Status                                 | `--ran-color-success` / `-warning` / `-danger`                 |
| Ein Link                                   | `--ran-color-link`                                             |

**Jede Akzentfarbe hat genau eine Bedeutung.** Primär ist monochrom (schwarz auf weiß im Hellen, weiß auf schwarz im Dunklen), nimm dafür also kein Blau: Blau gehört den Links und dem Fokusring. Grün ist Erfolg, Bernstein ist Warnung, Rot ist Gefahr; wer Rot zur Betonung verbraucht, hat später nichts mehr für die Gefahr.

**Drei Regeln, die stilles Zerbrechen verhindern:**

- Schreib niemals einen Hex-Wert oder ein `rgb()` fest für etwas, das dem Theme folgen soll.
- Ein Rückfallwert muss ein **Token nennen, das mitwechselt**: `var(--ran-color-text, var(--ran-gray-1000))`, niemals `var(--ran-color-text, #171717)` — ein nur fürs Helle gedachter Literalwert verschwindet im Dunkelmodus.
- Ein Rückfallwert muss ein Token nennen, das es **gibt**. Ein `var()` auf einer nicht deklarierten Eigenschaft löst sich zu nichts auf, die ganze Deklaration fällt weg, und das Element behält, was es geerbt hat — was meist _fast_ richtig aussieht. (`--ran-color-error` gibt es nicht; es heißt `--ran-color-danger`.)

## Abstand und Rhythmus

Nimm jeden Abstand aus der [neunstufigen Skala](/de/src/ranui/design-system/#spacing) und lass die Entfernung Bedeutung tragen:

- **8px** zwischen Elementen innerhalb einer Gruppe.
- **16px** zwischen Gruppen.
- **32–40px** zwischen Abschnitten.

Erfinde kein `20px` oder `28px`. Den Rhythmus einer Seite erzeugt gerade die begrenzte Auswahl; ein einziger Abstand außerhalb der Skala bricht ihn. Halte gemeinsame Achsen über Bereiche hinweg (Kanten, Grundlinien und Spalten, die fluchten) und prüfe die Ausrichtung an den gezeichneten Pixeln statt nach Augenmaß.

Vertikale Abstände folgen der Beziehung: Titel/Beschreibung und Feld/Hinweis können 8px,
getrennte Gruppen 16px und zusammengehörige Unterabschnitte 24px verwenden. Jeder Abstand
hat genau einen Verantwortlichen; berücksichtigen Sie Kind-Margins, Innenabstände und
Grundlinienraum bei Inline-Steuerelementen. Prüfen Sie Zeilenumbrüche sowie ausgeblendete
Hinweise und Fehlerzustände im Browser. Die
[verbindlichen Regeln zum vertikalen Rhythmus](https://github.com/chaxus/ran/blob/main/packages/ranui/docs/DESIGN.md#visual-language)
enthalten Ausnahmen und ausführbare Gegenproben, ohne Komponentenvorgaben zu ändern.

## Schrift wählen

Frag, welche **Rolle** der Text spielt (Überschrift, Beschriftung, Fließtext, Schaltfläche, dicktengleich), und Schriftart, Größe, Stärke und Zeilenhöhe ergeben sich alle aus der [Schriftskala](/de/src/ranui/design-system/#typography). Wähl keine rohen Pixelwerte je Einzelfall.

Eine Rolle ist ein Werkzeug, kein Gesetz: Wirklich einmaliger Zierschriftzug (eine aufblitzende Geste als Overlay, ein etwas kräftigerer aktiver Link) fährt mit einem eigenen Komponenten-Token besser als in die nächstbeste Rolle gezwängt.

## Tiefe: Schatten und Stapelung

**Wähle die Schattenstufe danach, was das Element ist** (Fläche im Fluss, schwebendes Overlay oder blockierender Dialog) und stell sicher, dass sie überhaupt wahrnehmbar ist. Ein Schatten, den man nicht sieht, gibt keinen Tiefenhinweis, und ein Overlay, das auf die Kartenstufe zurückfällt, wirkt an die Seite geheftet.

**ranui-Overlays in dein eigenes Rahmenwerk einbetten.** Die [z-index-Leiter](/de/src/ranui/design-system/#stacking) beginnt genau deshalb bei 1000, damit sie gewöhnliches Seitenrahmenwerk überragt. Ein portaltes Overlay braucht daher keine Hilfe von dir. Aber ein Overlay mit `position: fixed`, das in seinem eigenen Shadow DOM bleibt (der Dialog von `r-modal`), entkommt nur bis zu seinem nächsten übergeordneten **Stapelkontext**. Wenn du eingebetteten Inhalt also in etwas einwickelst, das einen erzeugt (`isolation`, `opacity < 1`, `transform`, `filter`, `will-change`), muss die Stapelebene dieser Hülle angehoben werden, damit der Dialog wieder darüberliegt. Begrenze das Anheben auf die Zeit, in der ein Overlay _wirklich_ offen ist:

```css
.embed {
  isolation: isolate; /* billig: kein eigener z-index, also wird nichts angehoben */
}
/* Nur anheben, solange ein echtes Overlay offen ist — nie „für alle Fälle“ */
.embed:has(r-modal[open]),
.embed:has(r-modal[closing]) {
  position: relative;
  z-index: 100;
}
```

Ein pauschaler `z-index` auf der Hülle hebt _alles_ darin (auch völlig statischen Inhalt) über deine klebende Kopfzeile, und zwar für die gesamte Scroll-Lebensdauer. Genau dieser Fehler ging auf dieser Website einmal live. Matche neben `open` auch `closing`: Die Maske zeichnet nach dem Entfernen von `open` noch die Dauer ihres Übergangs weiter.

## Bewegung {#motion}

Zweck und Nutzungshäufigkeit entscheiden, ob Bewegung sinnvoll ist. Häufiges Hover-, Fokus- und Tastaturfeedback erfolgt standardmäßig sofort. Nutze vorhandene Bewegungstokens nur, wenn sie eine Änderung erklären: kleine Übergänge etwa 150ms, Menüs 200ms und Dialoge 300ms sind optionale Beispiele, keine Pflichtverzögerungen. Bewegung muss unterbrechbar bleiben und `prefers-reduced-motion` beachten.

**Lass niemals eine Paletteneigenschaft animieren.** CSS kann nicht wissen, _warum_ sich eine Farbe geändert hat, also feuert eine `transition` auf `background-color`, `color`, `border-color`, `box-shadow`, `fill` oder `stroke` auch beim Wechsel des **Themes** — jedes Element blendet in seinem eigenen Tempo über, während der Rest der Seite längst umgeschaltet hat. Animiere stattdessen Bewegungseigenschaften (`transform`, `opacity`, Geometrie). `transition: all` und nackte Kurzformen wie `transition: 0.2s` bedeuten _alles_, Paletteneigenschaften eingeschlossen; beides ist in ranuis eigenen Stilen verboten und in deinen eine schlechte Idee.

## Zustände und Texte

Jeder erreichbare Zustand gehört zum Entwurf: **Überfahren, Gedrückt, Fokus, Deaktiviert, Ladend, Leer, Fehler**. Bilde sie auf die Leiter ab: Überfahren → `bg-hover` / `border-hover`; Gedrückt → `bg-active`; Deaktiviert → Deaktiviert-Tokens; Deckkraft nur bei Bedarf und erhaltener Lesbarkeit verringern; Fokus → der Fokusring.

Nichts Nicht-Interaktives darf interaktiv aussehen. `r-card` reagiert nur mit dem Attribut `hoverable` auf das Überfahren; lass es bei Karten weg, die man nicht anklickt.

Auch Texte gehören zum System:

- **Schaltflächen** benennen das Ergebnis. Nenne das Objekt, wenn es aus dem Kontext nicht hervorgeht: „Mitglied löschen“. Ein eindeutig benannter Dialog darf „Löschen“ verwenden; vermeide ein allgemeines „OK“.
- **Fehler** sagen, was passiert ist, und dann, wie man es behebt. ✅ „Bauen fehlgeschlagen: Das Bündel überschreitet die Größengrenze. Verkleinere es oder erhöhe die Grenze.“ ❌ „Vorgang fehlgeschlagen, bitte erneut versuchen.“
- **Bestätigungen und Hinweise** benennen die abgeschlossene Änderung. ✅ „Projekt gelöscht“ ❌ „Vorgang erfolgreich“. Den Abschluss erst anzeigen, nachdem er bestätigt wurde.
- Lass den Zusammenhang das Überflüssige wegnehmen: Ein Dialog mit dem Titel „Projekt löschen“ braucht keine Schaltfläche „Projekt endgültig und für immer löschen“.

## Barrierefreiheit {#accessibility}

- Erfülle den Kontrast nach **WCAG AA** für Text gegen seinen Hintergrund.
- **Signalisiere einen Zustand nie allein über Farbe**: Verbinde sie mit einem Symbol, einer Beschriftung oder Text.
- Jedes interaktive Element behält einen **sichtbaren Fokusring** (`--ran-focus-ring`, oder `outline: 2px solid var(--ran-color-primary); outline-offset: 2px`). Entferne ihn nie der Ordnung halber.
- **Alles ist mit der Tastatur erreichbar.** Nichts ist nur mit der Maus zu bedienen.
- Achte auf `prefers-reduced-motion` und `prefers-color-scheme`.

## Maus und Finger, schmal und breit

Weder die Eingabeart noch die Fenstergröße ist das zweitrangige Ziel.

- Ziehen, Schieberegler und Gesten laufen über **Pointer Events** (`pointerdown` / `pointermove` / `pointerup` / `pointercancel`), nie allein über `mouse*`, zusammen mit `touch-action: none` auf genau der gezogenen Fläche. CSS, das `touch-action: none` ohne dahinterliegenden Pointer-Handler deklariert, ist ein kaputtes Bedienelement, keine harmlose Zeile.
- **Ein Hinweis, der nur beim Überfahren erscheint, braucht eine Tipp-Alternative.** `trigger="hover"` an `r-select` oder `r-popover` fällt auf Touch-Geräten auf Klick zurück; was du baust, muss dasselbe tun.
- Zieh **viewport-relative Größen** (`%`, `min()`, `max()`, `clamp()`, `vw`/`vh`, etwa `min(560px, calc(100vw - 32px))`) dem Erfinden eines Umbruchpunkts vor. ranui hat kein gemeinsames Breakpoint-Token, jeder feste Umbruch ist also eine einmalige Zahl, die jemand pflegen muss.
- **Verbirg auf dem Handy nie den einzigen Weg, etwas zu tun.** Ordne den Fluss um, statt zu `display: none` zu greifen.
- **Eine gemessene Position stimmt nur bis zum nächsten Umbruch.** Alles, was aus `getBoundingClientRect()` stammt, veraltet beim Ändern der Fenstergröße, beim Neuumbruch des Containers und (bei einer portalten Fläche) beim Scrollen. Miss bei diesen Ereignissen nach, nicht nur bei der Interaktion, die die erste Messung ausgelöst hat. Eine Seite in schmaler Breite zu laden prüft das anfängliche Layout; es prüft nicht das _Hineinskalieren_ dorthin — und genau dort tritt diese Fehlerklasse tatsächlich auf.

## Was die Bibliothek maschinell durchsetzt

Neun dieser Regeln prüft `pnpm -F ranui verify:design`, das die CI auf ranuis eigenem Quelltext ausführt: im Dunkeln unsichere Farb-Rückfallwerte, rohe Farbliterale, die Abstandsskala, die Größenskala, nur mausgesteuerte Ziehschleifen, `:host`-display-Regeln, die `hidden` brechen, Rückfallwerte auf nicht deklarierte Tokens, Komponenten, die ihren eigenen Shadow-Baum abfragen, und Shadow-Bäume, die außerhalb des Konstruktors entstehen. Bekannte Verstöße sind in einer Basisdatei festgeschrieben, sodass kein neuer hinzukommen und keine Korrektur stillschweigend rückgängig gemacht werden kann.

Diese Prüfungen untersuchen nur die für den Befehl konfigurierten Quellpfade, nicht automatisch alle Anwendungen mit ranui. Das Repository hat eigene Prüfungen für Oberflächen wie die Dokumentation. Anwendungen nutzen ihre eigenen Prüfungen und kontrollieren Layout, Themes und Interaktion im Browser.

## Gestaltungsbeispiele {#design-examples}

<DesignIllustrations />

## Prüfliste vor der Auslieferung

Wähle Prüfungen für die betroffene Oberfläche und das geänderte Verhalten; die Repository-CI führt weiterhin alle Prüfungen aus.

- [ ] Hauptaufgabe und Hauptaktion sind unverkennbar.
- [ ] Funktioniert in **Hell und Dunkel**, bei **schmalen und breiten** Fenstern.
- [ ] Funktioniert mit **Maus und Finger**; jeder Hover-Auslöser hat eine Tipp-Alternative.
- [ ] Betroffene Zustände durchgespielt: Überfahren, Gedrückt, Fokus, Deaktiviert, Ladend, Leer, Fehler.
- [ ] Tastatur und Fokus geprüft; der Fokus ist überall sichtbar.
- [ ] Randfälle: lange Texte, große Zahlen, unterstützte Sprachen.
- [ ] Abstände aus der Skala, Schrift nach Rolle, Farbe aus semantischen Tokens.
- [ ] Keine Paletteneigenschaft in einer `transition`; kein `transition: all`.
- [ ] Text und Kontext machen Aktion und Objekt klar; nichts signalisiert einen Zustand allein über Farbe.

## Nachweise und Abnahme {#evidence-and-acceptance}

[Der Abnahmevertrag](https://github.com/chaxus/ran/blob/main/packages/ranui/docs/DESIGN.md#verifying-a-change) regelt echte Browserprüfungen, die Aktualität von Laufzeit und Aufnahmen sowie getrennte Ergebnisse für automatische Prüfungen, visuelle Agentenprüfung und Nutzerentscheidung. Änderungen an gemeinsamen Stilen erfordern neue betroffene Nachweise; Agentenprüfung ist keine Nutzerabnahme. Vermeide zusätzliche Beschriftungen und Beschreibungen ohne Informationsgewinn; die Anordnung soll offensichtliche Beziehungen erklären. Erhalte zugängliche Namen, hilfreiche Feldbeschriftungen, Einheiten, Fehler und Risikohinweise.
