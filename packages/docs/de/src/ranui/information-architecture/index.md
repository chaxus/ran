---
description: 'Wie eine informationsdichte Seite ihre Form bekommt, bevor das erste Token gewählt wird: die drei Fragen, die die Seite festlegen, das Skelett, das die Hauptfrage beantwortet, und der Platz jeder Art von Information.'
---

# Informationsarchitektur

Welche **Form** eine Seite annimmt. Das wird vor jeder Farbe und jedem Abstand entschieden.

Die übrigen Seiten dieses Abschnitts beantworten Fragen zu den Teilen. Diese beantwortet die
Frage davor: Bei allem, was der Bildschirm tragen muss, wozu ist die lesende Person gekommen,
und welche Anordnung lässt sie das tun?

| Seite                                                     | Beantwortet                                       |
| ----------------------------------------------------------- | -------------------------------------------------- |
| **Informationsarchitektur** (diese Seite)                 | _Welche Form_ die Seite haben soll                |
| [Designsystem](/de/src/ranui/design-system/)              | _Was_ die Tokens sind: das Vokabular              |
| [Designrichtlinien](/de/src/ranui/design-guides/)         | _Wie man wählt_, wenn man eine Oberfläche baut    |
| [Themes](/de/src/ranui/theme/)                            | _Wie man zur Laufzeit wechselt und überschreibt_  |

> **Dann lesen**, wenn eine Oberfläche entsteht, die mehrere Objekte, mehrere Zustände und
> deren Beziehungen zugleich tragen muss: eine Konsole, ein Dashboard, ein Backoffice, ein
> Arbeitsplatz, eine Monitoring-Seite. Nicht eine Landingpage oder ein Formular mit einer
> einzigen Conversion — die gewinnen oder verlieren über Überzeugung, nicht darüber, ob
> jemand in dichter Information richtig urteilen kann.

Vollständige Daten sind keine gestaltete Seite. Eine Oberfläche kann jedes Feld zeigen, das
die API liefert, mit Filtern, Statusabzeichen und Massenaktionen, und die lesende Person weiß
trotzdem nicht, worauf sie zuerst schauen soll. Es fehlt keine Information, es fehlt die
Reihenfolge.

## Drei Fragen vor jeder Komponente {#three-questions}

1. **Was ist das eine, das beim Ankommen zu sehen sein muss?** Das ist die Hauptinformation
   der Seite.
2. **Was muss sonst noch sichtbar sein, damit sie Sinn ergibt?** Verwandte Ressourcen,
   verwandte Modelle, Kontext.
3. **Was geschieht danach?** Etwas beurteilen, etwas tun oder weiter nachdenken.

Alle drei werden beantwortet, bevor die Komponentenliste aufgeht. Eine Seite mit drei klaren
Antworten wählt selten die falsche Form; eine Seite, die sie überspringt, ordnet sich am Ende
um die API-Antwort herum.

**Eine Seite, ein Hauptmodell.** Unterstützende Modelle dürfen helfen, das Hauptmodell zu
verstehen oder zu bedienen. Sie dürfen ihm nicht den ersten Bildschirm streitig machen.

## Die Form folgt der Aufgabe, nicht der Nutzlast {#shape}

Zwei Abkürzungen erzeugen die meisten schlecht geformten Seiten:

- Der Endpunkt lieferte ein Array, also wurde es eine Tabelle.
- Die Route trägt eine ID, also wurde es eine Detailseite.

Keine von beiden ist ein Grund. Dasselbe Objekt nimmt unter einer anderen Aufgabe eine andere
Form an: ein Issue ist eine **Sammlung**, solange gesucht wird, ein **Statusfluss**, solange
daran gearbeitet wird, ein **Diskussionsstrang** beim Zusammenarbeiten und eine
**Ereignisfolge** beim Prüfen. Dass ein Datensatz ein Datumsfeld hat, sagt, dass in den Daten
ein Datum steht. Es sagt nicht, dass die Seite ein Kalender ist.

## Das Skelett wählen {#skeletons}

Wähle die Anordnung, die die Hauptfrage mit den wenigsten gedanklichen Umrechnungen
beantwortet.

| Die Frage vor der lesenden Person                        | Was zusammenstehen muss                                | Skelett                    |
| ---------------------------------------------------------- | ------------------------------------------------------- | --------------------------- |
| Worin unterscheiden sich diese?                          | Die verglichenen Felder, in festen Spalten             | Vergleichstabelle          |
| Welches ist es, damit ich es öffnen kann?                | Name, Kennung, Status                                  | Liste / Ressourcenkatalog  |
| Welches ist es, wenn das Bild es mir sagt?               | Zuerst das Bild, darum Name und Felder                 | Kartenraster               |
| Was ist dieses Objekt und wie steht es gerade?           | Identität, Status, Hauptaktion, dann Attribute         | Detailseite in Abschnitten |
| Wozu gehört es?                                          | Pfad, Elternknoten, Geschwister                        | Hierarchiebaum             |
| Was hängt davon ab, was bricht bei einer Änderung?       | Vorgelagert und nachgelagert, Wirkungsradius           | Nachbarschaftsliste        |
| In welchem Schritt bin ich und was folgt?                | Stufe, aktuelle Eingabe, die nächsten Schritte         | Schrittfolge               |
| In welcher Stufe steckt jedes Element, Verschieben _ist_ die Arbeit | Die Stufe als Spalte, Identität und Blocker auf der Karte | Kanban                     |
| Warum hängt es fest?                                     | Stufenüberblick, dann Ergebnis je Schritt, dann Rohlog | Trace mit Drilldown        |
| Ist es gesund, und wie weit reicht der Schaden?          | Objektname, Status und das Ereignis, das ihn änderte   | Statuswand                 |
| Was ist passiert, in welcher Reihenfolge, durch wen?     | Zeitpunkt, Akteur, Ereignisart                         | Ereignis-Zeitleiste        |
| Wer hat was gesagt und wie wurde geantwortet?            | Verfasser, Beitrag, Antwortstruktur                    | Diskussionsstrang          |
| Was hat sich geändert, vorher gegen nachher?             | Die beiden Fassungen nebeneinander                     | Diff-Ansicht               |
| Wie ist der Trend und wo sitzt die Anomalie?             | Die Kennzahl, ihre Bezugslinie, der Weg ins Detail     | Dashboard                  |
| Wann ist das belegt und wann kollidiert es?              | Beginn, Ende und Dauer auf einer Achse                 | Kalender / Terminplanung   |
| Was bearbeite ich als Nächstes?                          | Die Warteschlange auf der einen, das Element auf der anderen Seite | Master-Detail-Arbeitsplatz |
| Welche Regeln greifen und was betreffen sie?             | Die Einstellung, ihr Geltungsbereich, ihre Folge       | Konfigurationsformular     |
| Was sagt dieser Text?                                    | Der Fließtext der Reihe nach, daneben eine Gliederung  | Fortlaufendes Dokument     |
| Wo ist es?                                               | Position, Grenzen, Verteilung                          | Karte / Zeichenfläche      |

### Paare, die verwechselt werden {#swapped-pairs}

- **Zeitleiste oder Schritte.** Die Zeitleiste erzählt, was bereits geschehen ist, der Reihe
  nach. Schritte sagen, wo man ist und was kommt. Sie sehen ähnlich aus und zeigen in
  entgegengesetzte Zeitrichtungen.
- **Kanban oder Filter.** Kanban stimmt, wenn das Verschieben einer Karte _die_ Aktion ist.
  Sind die Spalten gespeicherte Filterbedingungen, wurde ein Filter gebaut, der eine
  Ziehbewegung kostet.
- **Kalender oder Zeitleiste.** Der Kalender beantwortet Belegung und Kollision, die Zeitleiste
  Reihenfolge. Das Datum im Datensatz entscheidet nicht zwischen beiden, die Frage tut es.
- **Kartenraster oder Tabelle.** Entweder ist das Bild der Wiedererkennungsanker oder nicht.
  Wird über Zahlen entschieden, begräbt ein Vorschaubild in der ersten Spalte genau die
  Felder, an denen die Entscheidung hängt.
- **Graph oder Nachbarschaftsliste.** Zeichne den Graphen nur, wenn der Pfad oder die
  Ausbreitung selbst das Urteil ist. Sonst liest sich eine gruppierte Liste von Vor- und
  Nachgelagertem schneller.
- **Dokument oder Feldraster.** Fließtext, der der Reihe nach gelesen wird, bleibt Fließtext.
  Jeden Absatz in eine Karte oder eine Schlüssel-Wert-Zeile zu hacken, zerstört genau das, was
  ihn lesbar machte.

Bau nicht alle drei Ansichten, nur weil es geht. Jede zusätzliche Ansicht ist ein weiterer
Filtersatz, eine weitere Statuszuordnung und ein weiterer Satz Aktionen, der synchron bleiben
muss. Füge die zweite hinzu, wenn die zweite Nutzung wirklich häufig ist, nicht vorsorglich.

## Wo welche Information hingehört {#placement}

| Information      | Beantwortet                       | Gehört nach                                                        | Darf nicht landen                                |
| ----------------- | --------------------------------- | ------------------------------------------------------------------- | ------------------------------------------------- |
| **Identität**    | Was ist das?                      | Titel, Objektüberblick                                              | In die letzte Spalte oder hinter einen Tab       |
| **Status**       | Wie steht es gerade?              | Titel- oder Überblicksbereich                                       | Nur in einem Detailfeld auffindbar               |
| **Attribute**    | Wie ist es beschaffen?            | Detailtext, gruppiert, wie Menschen darüber denken                  | Flach in der Reihenfolge der API-Felder          |
| **Beziehungen**  | Womit hängt es zusammen?          | Eigener Bereich oder Tab, Besitz, Abhängigkeit und Verweis getrennt | Vermischt in der Attributtabelle                 |
| **Änderungen**   | Was ist anders als vorher?        | Diff-Bereich, Zeitleiste                                            | Nur als der neue Wert gezeigt                    |
| **Belege**       | Warum trägt dieses Urteil?        | Direkt neben dem Urteil, aufklappbar                                | Auf einer Logseite anderswo                      |
| **Aktionen**     | Was kann ich jetzt tun?           | Hauptaktion im Titelbereich, der Rest neben seinem Objekt           | Vergraben unter „mehr“                           |
| **Rückmeldung**  | Was hat das bewirkt?              | Neben der Aktion, mit erhaltenem Aufgabenkontext                    | Ein globaler Toast ohne Bezug zum Gegenstand     |

**Jede Tatsache hat genau einen maßgeblichen Ort.** Überall sonst stehen eine Zusammenfassung
oder ein Einstieg, der dorthin zurückführt.

## Lesereihenfolge {#reading-order}

```text
Seitenidentität
→ aktueller Status oder Ausnahme
→ Hauptaufgabe und Hauptaktion
→ die Information, die das Urteil braucht
→ Beziehungen, Änderungen, Belege
→ Nebeninformation und selten genutzte Aktionen
```

- **Eine visuelle Hauptüberschrift pro Seite.** Abschnittsüberschriften schreiten semantisch
  voran, nicht über eine Schriftgröße, die Hierarchie vortäuscht.
- **Höchstens eine Hauptaktion pro Aufgabenbereich.** Der Hauptbutton ist der
  wahrscheinlichste nächste Schritt, nicht der zerstörerischste. Gefährliches bekommt
  Gefahrensemantik, nicht das größte visuelle Gewicht.
- Warn- und Gefahrenfarbe gehören Zuständen, die wirklich Aufmerksamkeit brauchen. Eine Seite,
  auf der alles grün ist, hat ihr Signal bereits ausgegeben.
- Badges, Tags und Banner teilen sich ein Aufmerksamkeitsbudget. Hervorgehoben wird nur, was
  eine Entscheidung ändern würde.

## Dichte {#density}

Dichte ist nicht, wie viele Bedienelemente pro Fläche passen, sondern wie viel _brauchbare_
Information ein Blick mitnimmt. Engere Abstände heben die visuelle Dichte und lassen die
wirksame genau dort, wo sie war; irrelevante Felder zu entfernen und den Vergleich an einen
Ort zu legen, hebt die echte.

| Stufe        | Wo sie hingehört                                      | Was sie einbringt                                                |
| ------------- | ----------------------------------------------------- | ----------------------------------------------------------------- |
| **Großzügig** | Erstnutzung, seltene Konfiguration, riskante Bestätigung | Raum zum Erklären, größere Gruppenabstände, sichtbare Wirkungsvorschau |
| **Standard** | Die meisten Listen, Details und Formulare             | Das Standardgleichgewicht aus Überfliegbarkeit und Information je Bildschirm |
| **Kompakt**  | Arbeitsplätze für Profis: Monitoring, Betrieb, Audit  | Stabile Spaltenbreiten, kurze Texte, Tastatureffizienz, gespeicherte Ansichten |

- Verwende auf einer Seite **höchstens zwei benachbarte Stufen**. Eine kompakte Tabelle in
  einer Standardseite ist in Ordnung; dass jeder Bereich seinen eigenen Maßstab erfindet,
  nicht.
- Kompakt heißt nicht „Schrift und Trefferflächen zusammen schrumpfen“. Innenabstand und
  Zeilenhöhe dürfen enger werden; Lesbarkeit des Fließtexts, sichtbarer Fokusring und
  Zeigerzielgröße nicht.
- Für Profis bringen Spaltenverwaltung, gespeicherte Ansichten, Massenaktionen und Kürzel mehr
  als auf einmal mehr zu zeigen.

## Aufgabenkontext halten {#context}

Steht das Skelett, wird entschieden, wo der unterstützende Inhalt lebt:

| Die lesende Person…                                     | bekommt                                                           |
| --------------------------------------------------------- | ------------------------------------------------------------------ |
| wechselt ständig zwischen Objekten oder Belegen         | eine Master-Detail-Teilung: die Warteschlange links, das Element rechts |
| wirft einen Blick auf etwas Leichtes und Flüchtiges     | eine aufklappbare Zeile (`r-disclosure-row`) oder ein Popover (`r-popover`) |
| arbeitet an etwas Teilbarem oder Platzbedürftigem       | eine eigene Route                                                  |
| bestätigt etwas oder tippt ein einzelnes Feld           | einen Dialog (`r-modal`)                                           |

**Ein Dialog ist keine Navigationsebene.** Alles, was einen kopierbaren Link, Verlauf, einen
Vergleich nebeneinander oder Arbeit braucht, die einen Reload übersteht, bekommt eine Route.

## Was ranui auf dieser Ebene beisteuert {#with-ranui}

ranui bezieht bewusst keine Position zur Seitenform: es liefert Primitive und Tokens, keine
Seitenvorlagen. Was es hier gibt:

- `r-section` für die Bänder, in die ein Skelett zerfällt, `r-card` für einen wirklich
  eigenständigen wiederholten Eintrag. Nie eine Karte in einer Karte; Formularfelder werden
  mit einer Überschrift oder einer Trennlinie gruppiert.
- `r-tabs` für **gleichrangige Ansichten eines Objekts** (seine Diskussion, seine Prüfungen,
  sein Diff), nie für unverwandte Module: dafür ist die Navigation da.
- `r-disclosure-row` für schrittweise Offenlegung, `r-popover` und `r-dropdown` für flüchtigen
  Kontext, `r-modal` nur für das, was die Tabelle oben ihm erlaubt.
- `r-state-dot` für Status, immer mit Beschriftung:
  [nie allein über Farbe](/de/src/ranui/design-guides/#accessibility).
- `r-skeleton`, solange der erste Bildschirm lädt, `r-progress` für alles, was lang genug
  dauert, um jemanden zweifeln zu lassen, `r-message` für das Ergebnis.

In ranui gibt es **keine Tabelle, keinen Baum, keinen Kalender, kein Kanban und keine
Zeitleiste**. Wer eines baut, baut es auf [den Tokens](/de/src/ranui/design-system/) und den
[Designrichtlinien](/de/src/ranui/design-guides/) auf statt auf einem zweiten visuellen
System: Abstände aus der Skala, Schrift nach Rolle, Farbe aus semantischen Tokens, jeder
erreichbare Zustand entworfen.

## Antimuster {#anti-patterns}

- Jedes Feld, das der Endpunkt liefert, wird eine Detailzeile, sodass Identität, Status,
  Beziehungen und Belege alle mit demselben Gewicht ankommen.
- Hierarchie aus Karten, Farbe und dekorativen Abständen hergestellt, ohne zu sagen, was
  zuerst zu lesen ist.
- Mehrere Aktionen teilen sich den Hauptstil, oder eine seltene Aktion sitzt im Titelbereich.
- Status, Attribute, Beziehungen und Änderungen in einer Tabelle vermischt, sodass sich
  nirgends ein Vergleich bilden lässt.
- Ein Beziehungsgraph, wo jemand nur einen Namen und einen Status nachschlagen wollte.
- Ein Dialog, der einen langen Ablauf, einen Vergleich oder etwas trägt, dessen Link jemand
  verschicken will.
- Derselbe Satz in Titel, Überblick, Tab-Beschriftung und Tabelle wiederholt, ohne irgendwo
  etwas Neues zu ergänzen.

## Checkliste vor dem Ausliefern einer Seite

- [ ] Hauptinformation, unterstützende Information und die nächste Aktion sind aufgeschrieben.
- [ ] Das Skelett wurde aus der Frage gewählt, nicht aus der Form der Antwort.
- [ ] Die Seite hat ein Hauptmodell; unterstützende Ansichten dienen ihm, statt zu
      konkurrieren.
- [ ] Ohne Spezifikation sind Objekt, Status und Hauptaktion in fünf Sekunden klar.
- [ ] Der Vergleich passiert an einem Ort; nichts muss über Tabs oder Seiten hinweg erinnert
      werden.
- [ ] Jede Tatsache hat einen maßgeblichen Ort, und überall sonst wird darauf verlinkt.
- [ ] Die Dichte passt zur Nutzungshäufigkeit, und es treten nicht mehr als zwei benachbarte
      Stufen auf.
- [ ] Langer Text, große Zahlen und ein schmaler Viewport brechen die Informationsordnung nicht.
- [ ] Jeder Block, jedes Feld, jedes Tag und jeder Button ohne Beitrag zum Urteil wurde
      gelöscht.
