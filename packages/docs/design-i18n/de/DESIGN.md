<!-- source: 59d6fe1249b0ecc5391f8f7b84c17470a00a3023 -->

# Ran Design

Gestaltungsmethoden für das Host-Produkt und seine vorhandene Technik. Lies über [den Aufgabenindex](./INTERFACE_GUIDE.md)
nur die Abschnitte, die für deine Aufgabe zählen. Bibliotheks-Tokens und API-Mechanik gehören in den
jeweiligen Implementierungsadapter, nicht in diese übertragbare Methode.

Jede Regel trägt eine ID und eine Stufe. **MUST** ist ein Defekt, wenn sie verletzt wird, und nennt ihren Nachweis;
**SHOULD** ist der Standard, und wer abweicht, begründet es für den konkreten Fall; **MAY** ist optional.
Der [Regelindex](./RULES.md) führt jede abgestufte Regel mit ihrem Nachweis auf.

## 1. Farbe – eine Zustandsleiter, keine Palette

- **D-COLOR-1 · SHOULD** Semantische Rollen für Inhalte, Flächen, Begrenzungen, Aktionen und Status festlegen.
- **D-COLOR-2 · SHOULD** Standard-, Hover-, Aktiv-, Deaktiviert- und Fokuszustand gemeinsam definieren.
- **D-COLOR-3 · SHOULD** Hell- und Dunkelwerte über die maßgeblichen Tokens des Hosts auflösen und den
  Kontrast in der tatsächlichen Komposition prüfen.

Markenakzente hängen vom Kontext ab.

## 2. Abstände – eine begrenzte, rhythmische Skala

- **D-SPACE-1 · SHOULD** Die vorhandene Abstandsskala des Hosts verwenden.
- **D-SPACE-2 · SHOULD** Zusammengehörige Teile mit engen Abständen gruppieren, Aufgaben oder Bereiche mit
  größeren Abständen trennen.
- **D-SPACE-3 · SHOULD** Erst den Innenabstand festlegen, dann die Abstände nach außen.
- **D-SPACE-4 · SHOULD** Maße eines Referenzprodukts nicht übernehmen, ohne Inhalt, Dichte und Eingabemethode
  zu bewerten.

## 3. Typografie – eine Rolle wählen, keine Größe

- **D-TYPE-1 · SHOULD** Rollen für Überschrift, Label, Fließtext, Aktion und Code mit stimmiger Größe,
  Strichstärke und Zeilenhöhe wählen und für jede Rolle genau eine maßgebliche Quelle behalten.
- **D-TYPE-2 · SHOULD** Tatsächliche Schriftsysteme, Metriken der Ersatzschriften und lange Inhalte prüfen.
- **D-TYPE-3 · SHOULD** Hierarchie zuerst mit Typografie aufbauen, erst dann mit dekorativen Containern.

## 4. Eckenradius & Erhebung

- **D-ELEV-1 · SHOULD** Verschachtelte Eckenradien auf ihren tatsächlichen Einzug abstimmen: innerer Radius =
  äußerer Radius − Einzug. Liegt das Ergebnis bei 2px oder darunter, wirken die Formen nicht mehr konzentrisch;
  dann bekommt die innere Form den Radius ihrer eigenen Rolle oder gar keinen.

Eine Karte mit 16px Radius und 8px Innenabstand gibt ihrem inneren Panel einen Radius von 8px. Dieselbe Karte mit
16px Innenabstand lässt nichts übrig, das sich übertragen ließe; das Panel nimmt dann, was seine eigene Rolle vorsieht.

- **D-ELEV-2 · SHOULD** Erhebung über die Stapelrollen des Hosts einsetzen, um eine schwebende Ebene zu erklären,
  nicht um Wichtigkeit auszudrücken, und Overlays gegen die umgebende Oberfläche prüfen.

## 5. Bewegung – im Zweifel keine

Die Zeiten unten sind ein Ausgangswert, keine Vorgabe.

- **D-MOTION-1 · SHOULD** Die Motion-Tokens des Host-Systems verwenden und Häufigkeit, Kontinuität und reduzierte
  Bewegung in der tatsächlichen Aufgabe prüfen.

| Dauer  | Einsatz                                                                      |
| ------ | ---------------------------------------------------------------------------- |
| 0ms    | Häufiges Feedback auf Hover, Fokus und Tastatur; bereits verstandene Wechsel |
| ~150ms | Optionale, gezielte kleine Bewegung, keine verpflichtende Hover-Verzögerung  |
| ~200ms | Bewegung von Menü/Popover, wenn sie den Ebenenwechsel verdeutlicht           |
| ~300ms | Bewegung eines Dialogs, wenn sie der Orientierung hilft                      |

**Grundsatz:** Zweck und Häufigkeit entscheiden, ob Bewegung Zeit kosten darf.

- **D-MOTION-2 · SHOULD** Wiederholte Interaktion standardmäßig mit sofortigem Feedback beantworten; eine größere
  Änderung ist nicht automatisch ein Grund für eine Animation.
- **D-MOTION-3 · SHOULD** Für gezielte Bewegung vorhandene Tokens verwenden und sie kurz und unterbrechbar halten.
  Reduzierte Bewegung wird unter D-MOTION-10 und D-ACCESS-5 bewertet.

### Vertrag für funktionale Bewegung

- **D-MOTION-4 · SHOULD** Auslöser, Zustandswechsel und Ziel festlegen, bevor ein Effekt gewählt wird.
- **D-MOTION-5 · MUST** Bewegung lässt unbeteiligte Inhalte, Entwürfe und die Leseposition unangetastet. _Proof: recording_
- **D-MOTION-6 · SHOULD** Geschwisterkomponenten mit derselben Interaktionsbedeutung eine gemeinsame
  Bewegungssprache geben; Konsistenz heißt nicht, dass jede Komponente animiert sein muss.
- **D-MOTION-7 · MUST** Wird Bewegung eingesetzt, kann eine neue Absicht sie aus der aktuellen Darstellung heraus
  unterbrechen oder umkehren, ohne Sprung, veralteten Abschluss oder doppelte Auslösung. _Proof: recording_
- **D-MOTION-8 · MUST** Feedback bleibt sofort; eine Animation sperrt keine Eingabe. _Proof: recording_
- **D-MOTION-9 · SHOULD** Beim Einfügen und Entfernen Text nicht sichtbar zusammenquetschen und ausblendende
  Steuerelemente nicht über aktive Aktionen hinwegziehen; Deckkraft und Layout so abstimmen, dass das Ergebnis
  lesbar bleibt.
- **D-MOTION-10 · MUST** Auch bei reduzierter Bewegung bleibt ein sichtbarer, verständlicher Endzustand. _Proof: browser_
- **D-MOTION-11 · MAY** Eine Feder (Spring) verwenden; sie muss nicht überschwingen.

Beispiele und Grenzen stehen in der optionalen [Recherche zum Komponenten-Handwerk](./REFERENCE_RESEARCH.md#component-craft-设计垂点--wxaddesign),
den Nachweis beschreibt die [zeitliche Abnahme](./ACCEPTANCE.md#review-motion-over-time).

- **D-MOTION-12 · SHOULD** Theme-Paletten geschlossen umschalten lassen. Implizite Überblendungen der Palette oder
  `transition: all` vermeiden; nur dort ausdrücklich zuschalten, wo der Host einen abgestimmten Effekt beabsichtigt
  und prüft.
- **D-MOTION-13 · MUST** Bei der Rückkehr zu einer Arbeitsfläche erscheinen Sachwerte und lesbare Inhalte sofort,
  ohne animiertes Hochzählen. _Proof: browser_
- **D-MOTION-16 · SHOULD** Dekorative Titelauftritte nicht bei jeder Rückkehr zu einer Arbeitsfläche erneut
  abspielen.
- **D-MOTION-17 · SHOULD** Die Einblendung danach wählen, was ein Bereich enthält (siehe Tabelle unten). Innerhalb
  eines Bereichs in Lesereihenfolge staffeln, nicht über die ganze Seite.

| Bereich enthält                                                     | Einblendung                                                                                         | Danach                                                                     |
| ------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------- |
| Text, Überschriften, Werte, Formulare, Navigation, Handlungsaufrufe | Keine: beim ersten Rendern vorhanden (D-MOTION-13)                                                  | Keine                                                                      |
| Ein dekoratives Bild neben Text: Icon-Set, Diagramm, Skizze         | Nur Transform, einmal, wenn es zum ersten Mal in den Blick scrollt; keine, wenn beim Laden sichtbar | Eine erklärende Schleife darf laufen, solange es sichtbar ist (D-CRAFT-19) |
| Ein Produkt-Mockup oder eine Live-Demo                              | Keine für den Inhalt; eine Ladedemonstration darf sich bewegen (D-MOTION-14)                        | Gesteuert durch die eigene Interaktion der Lesenden                        |
| Eine Statusanzeige                                                  | Keine                                                                                               | Ein Pulsieren nur, solange die Aktivität läuft (D-MOTION-15)               |

Bei reduzierter Bewegung beginnt jeder Bereich in seinem Endzustand (D-MOTION-10).

- **D-MOTION-14 · MAY** Eine Ladedemonstration darf sich bewegen, um das Laden zu zeigen.
- **D-MOTION-15 · MUST** Ein Status-Pulsieren erscheint nur, solange die Aktivität läuft. _Proof: review_

## 6. Inhalt – Text gehört zum System

- **D-COPY-1 · SHOULD** Buttons benennen das Ergebnis. Das Objekt gehört dazu, wenn der Kontext es nicht schon
  klärt: „Projekt bereitstellen“, „Mitglied löschen“. In einem klar benannten Objekt oder Dialog genügt „Speichern“
  oder „Löschen“; ein generisches „OK“ vermeiden. Siehe [Wortwahl im Kontext](#words-are-part-of-the-interface).
- **D-COPY-2 · SHOULD** Fehlermeldungen sagen, **was passiert ist**, und dann, **wie es sich beheben lässt**.
  ✅ „Build fehlgeschlagen: Das Bundle überschreitet die Größengrenze. Verkleinere es oder hebe die Grenze an.“
  ❌ „Vorgang fehlgeschlagen, bitte erneut versuchen.“
- **D-COPY-3 · SHOULD** Bestätigungen und Toasts nennen die abgeschlossene **Änderung**. ✅ „Projekt gelöscht“.
  ❌ „Vorgang erfolgreich“.
- **D-COPY-4 · MUST** Abschlussfeedback erst zeigen, wenn der Vorgang bestätigt ist. _Proof: unit, browser_
- **D-COPY-5 · SHOULD** Konkret sein; jeder Satz nimmt Rätselraten weg, statt neues zu erzeugen.

## 7. Barrierefreiheit – das System dient allen

- **D-ACCESS-1 · MUST** Text behält ausreichenden Kontrast zu seinem Hintergrund (**WCAG AA**). _Proof: browser_
- **D-ACCESS-2 · MUST** Zustand nie allein über Farbe signalisieren; immer mit Icon oder Text kombinieren (etwa
  Labels mit ✓ / ✕, nicht nur Grün/Rot). _Proof: review_
- **D-ACCESS-3 · MUST** Jedes interaktive Element hat einen zu seiner Fläche passenden **sichtbaren Fokusring**;
  ihn nie für mehr „Sauberkeit“ entfernen. _Proof: browser_
- **D-ACCESS-4 · MUST** **Vollständige Tastaturnavigation**: Nichts ist nur mit der Maus erreichbar. _Proof: browser_
- **D-ACCESS-5 · MUST** `prefers-reduced-motion` respektieren. _Proof: browser_
- **D-ACCESS-6 · MUST** Unterstützt der Host beide Farbschemata, folgt das erste Rendern
  `prefers-color-scheme`. _Proof: browser_

## 8. Eingabe & Viewport – mobil und Desktop, beides

- **D-INPUT-1 · MUST** Maus, Tastatur und Touch bei schmalen und breiten Breiten unterstützen. _Proof: browser_
- **D-INPUT-2 · MUST** Steuerelemente umbrechen, statt den einzigen Weg zu einer Aktion auszublenden. _Proof: browser_
- **D-INPUT-3 · MUST** Zu einem Hover-Angebot gibt es eine Alternative per Klick oder Tippen. _Proof: browser_
- **D-INPUT-4 · MUST** Ziehen läuft über Pointer Events, einschließlich Abbruch. _Proof: browser_
- **D-INPUT-5 · MUST** `touch-action` auf die tatsächliche Ziehfläche beschränken und mit einem echten Handler
  koppeln; normales Scrollen funktioniert überall sonst weiter. _Proof: browser_
- **D-INPUT-6 · SHOULD** Grenzen relativ zu Inhalt oder Viewport (`min()`, `max()`, `clamp()`) willkürlichen
  Breakpoints vorziehen.
- **D-INPUT-7 · SHOULD** Die vorhandenen Breakpoints des Hosts verwenden und eine begründete gemeinsame Rolle erst
  einführen, wenn sich der Bedarf wiederholt.

Eine gemessene Position veraltet nach Größenänderung, Umbruch im Container oder Scrollen.

- **D-INPUT-8 · SHOULD** Das Verkleinern in ein schmales Layout durchspielen, nicht nur das Laden in einem schmalen.
- **D-INPUT-9 · MUST** Die Position eines Overlays folgt seinem Auslöser, solange es offen ist. _Proof: browser_

Die Lebenszyklus-Mechanik gehört dem Host; [ranui engineering](https://github.com/chaxus/ran/blob/main/packages/ranui/docs/CODING.md#3-state-and-ownership) ist ein Implementierungsadapter dafür.

- **D-INPUT-10 · SHOULD** Wo betroffen, echte Zeiger- und Touch-Gesten, den Hover-Ersatz und Tastaturwege testen;
  zwei geprüfte Farbschemata belegen keine gleichwertige Eingabe.

## 9. Komposition – die Seite, nicht die Komponente

- **D-COMP-1 · SHOULD** Zuerst die Seitenstruktur aus §10 wählen; danach die Komponenten nach diesen Regeln
  zusammensetzen.

### Stilistische Stimmigkeit über Komponenten und Seiten hinweg

- **D-COMP-2 · SHOULD** Vor der Umsetzung ein kurzes Design-Briefing in der vorhandenen Aufgabennotiz oder beim
  zuständigen Produktdesign festhalten. Das vorhandene System verwenden; für eine kleine Korrektur reichen die
  betroffenen Entscheidungen. Das Briefing klärt jede zutreffende Entscheidung aus der Tabelle unten (D-COMP-2).

„Premium“, „modern“ oder „wie Claude“ ist eine Richtung, die es zu untersuchen gilt, keine umsetzbare Spezifikation.

| Entscheidung           | Was das Briefing klärt                                                                                                                              |
| ---------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| Aufgabe und Hierarchie | Der echte Inhalt, die Hauptaktion und der erste Lesefokus; was zurücktreten oder wegfallen kann.                                                    |
| Proportion             | Schriftrollen und Zeilenhöhen, Zeilenlänge, Dichte der Steuerelemente, Icon-Gewicht und Ausrichtungsachsen mit Host-Tokens.                         |
| Flächensprache         | Welche Bereiche eine Einfassung brauchen, Beziehungen verschachtelter Radien und Einzüge, semantische Akzent- und Erhebungsrollen.                  |
| Zustandskomposition    | Ein repräsentativer Standardzustand plus lange Inhalte, Ausstehend/Fehler und schmale Eingabewege; kombinierte Zustände inklusive.                  |
| Bewegung               | Der Zustandswechsel, den sie erklärt, Auslöser und Häufigkeit, Unterbrechen/Umkehren und das Ergebnis bei reduzierter Bewegung; „keine“ ist gültig. |
| Referenzentscheidung   | Wo eine Referenz verwendet wird: ihre Quelle verlinken, das übernommene Prinzip und die Anpassung, die die Host-Aufgabe braucht.                    |
| Abnahme                | Das beobachtbare Ergebnis und die tatsächlichen Ansichten oder Aufnahmen, die es belegen oder widerlegen können.                                    |

- **D-COMP-4 · SHOULD** Das Briefing für Geschwisterkomponenten und die Doku-Oberfläche wiederverwenden; die Betonung
  nach der Aufgabe verschieben.

Einheitlichkeit heißt nicht überall gleich große Steuerelemente oder eingerahmte Abschnitte.

- **D-COMP-5 · SHOULD** Eine ausdrucksstarke Demo sichtbar von der Oberfläche ihrer Dokumentation abheben.
- **D-COMP-6 · SHOULD** Das Briefing aktualisieren, bevor die visuelle Richtung geändert wird; den Standard nicht
  stillschweigend umschreiben, um eine Umsetzung zu rechtfertigen, die die Prüfung nicht bestanden hat.
- **D-COMP-7 · SHOULD** Ein repräsentatives, fertig komponiertes Standbild mit unterschiedlichen echten Inhalten
  vergleichen, bevor es animiert wird, und dann Zustandswechsel und Rückweg in normaler Geschwindigkeit ansehen.

Eine gemeinsame Farbe allein kann uneinheitliche Proportionen, Icon-Gewichte, Einfassungen oder Bewegungen nicht
versöhnen.

- **D-COMP-8 · SHOULD** Wirkt ein Beispiel wie aus einem anderen Produkt importiert, die Beziehung beim zuständigen
  Token, der Komponente oder dem Stil korrigieren, statt einen seitenspezifischen Patch hinzuzufügen.
- **D-COMP-9 · SHOULD** Beobachtungen zu Referenzen und Grenzen der Validierung im optionalen
  [Rechercheindex](./REFERENCE_RESEARCH.md#style-coherence-and-transition-research) festhalten.

### Struktur vor Containern

- **D-BOX-1 · SHOULD** **Erst zu Abstand, Ausrichtung, Gewicht und einer Haarlinie greifen, dann zu einer Box.**

Ein Container behauptet, sein Inhalt sei ein eigenständiges Objekt. Die meisten Bereiche brauchen einen Hintergrund,
eine Haarlinie und bewusst gesetzte Abstände – mehr nicht.

- **D-BOX-2 · SHOULD** Eine Box **einem wirklich eigenständigen Objekt** vorbehalten: einer Live-Demo-Bühne, einem
  Overlay, einem schwebenden Panel. Nicht einem Codeblock, einer Tabelle, einer Listenzeile, einem Zurück/Weiter-Link
  oder einer Zelle in einer Galerie.
- **D-BOX-3 · SHOULD** **Überflüssig verschachtelte Container und doppelte Innenabstände vermeiden.** Eine Karte in
  einem Panel mit Innenabstand braucht keinen weiteren dekorativen Rahmen oder Einzug.
- **D-BOX-4 · SHOULD** Funktional nötige verschachtelte Steuerelemente oder Flächen behalten und ihre Radien auf den
  tatsächlichen Einzug abstimmen; Einfassung allein ist kein Grund für eine Box.
- **D-BOX-5 · SHOULD** **Jede dauerhafte Begrenzung braucht eine eigene Aufgabe.** Inhalte zuerst mit Überschriften,
  Ausrichtung und Nähe gruppieren. Rahmen, Flächenfüllung oder Erhebung erst hinzufügen, wenn diese Struktur eine
  echte Grenze unklar lässt.
- **D-BOX-6 · SHOULD** Dieselbe Gruppierung nicht gleichzeitig mit Panel-Rahmen, verschachtelter Karte, Zeilenlinien
  und einem weiteren Einzug wiederholen.

Auch blasse Linien sind zusätzliche Hierarchie; wer ihren Kontrast senkt oder sie kürzt, macht eine überflüssige
Einfassung nicht weniger überflüssig.

Die Tabelle unten wendet D-BOX-5 und D-BOX-8 an.

- **D-BOX-8 · MUST** Tastaturfokus und dauerhafte Auswahlhinweise behalten; sie nie entfernen, damit das Layout im
  Ruhezustand ruhiger wirkt. _Proof: browser_

| Begrenzung                    | Behalten, wenn sie Folgendes vermittelt                                              | Entfernen, wenn sie nur wiederholt                                                 |
| ----------------------------- | ------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------- |
| Rahmen von Feld/Steuerelement | Wo Werte eingegeben oder eine Auswahl getroffen werden kann                          | Eine dekorative Hülle um bereits gut lesbare Befehle                               |
| Bereichsrahmen oder Trenner   | Einen eigenen Viewport, eine Größenänderungsgrenze oder einen großen Aufgabenwechsel | Einen Titel und einen Abstand, die dieselbe Gruppe schon klar machen               |
| Verschachtelte Fläche         | Eine eigene schwebende Ebene, Vorschau, Ablagefläche oder Interaktionsgrenze         | Einen weiteren Container in einem etablierten Einstellungsbereich                  |
| Fokus-/Auswahlkontur          | Tastaturfokus oder dauerhaften Auswahlzustand                                        | Diesen Zustandshinweis behalten, auch wenn das Ruhelayout ohne ihn ruhiger aussähe |

- **D-BOX-9 · SHOULD** Den ganzen Bereich oder die ganze Seite prüfen, nicht nur die zugeschnittene Gruppe. Für jede
  verbleibende feste Kontur, Füllung oder Trennlinie benennen, welche Beziehung oder Interaktion sie vermittelt, und
  prüfen, was ohne sie mehrdeutig würde.

Ein Rahmen ist optional; ein erreichbares, erkennbares Steuerelement nicht.

### Betonung ist ein Budget

**Farbe, Gewicht, Badges, Füllungen und Erhebung sind knapp.** Ist alles betont, wirkt nichts mehr wichtig.

- **D-COMP-10 · SHOULD** Priorität zuerst mit Struktur und Nähe herstellen und Betonung für das eine Element
  aufheben, das sie verdient.

**Erhebung erklärt Stapelung, nicht Wichtigkeit.**

- **D-ELEV-3 · SHOULD** Schatten Flächen vorbehalten, die wirklich über dem Inhalt schweben: Popovers, Menüs,
  Dialoge, Benachrichtigungen. Nicht jede Karte mit Schatten versehen.

### Abstände tragen Bedeutung

Die Skala aus §2 ist nicht nur ein Rhythmus; jede Stufe drückt eine Beziehung aus.

Die Stufe danach wählen, was der Abstand _bedeutet_ (D-SPACE-2):

| Beziehung                    | Relativer Abstand          |
| ---------------------------- | -------------------------- |
| Teile eines Steuerelements   | Engster bewusster Abstand  |
| Eng verwandte Steuerelemente | Kompakter Gruppenabstand   |
| Eine Inhaltsgruppe           | Gruppenrhythmus            |
| Getrennte Gruppen            | Größere Trennung           |
| Grenze eines großen Bereichs | Stärkste bewusste Trennung |

**Innen vor außen:** Der Innenabstand einer Komponente wird festgelegt, bevor der Abstand zwischen Komponenten
entschieden wird (D-SPACE-3). **Kleinerer Abstand bedeutet engere Beziehung** – mehr teilt vertikaler Rhythmus
nicht mit.

- **D-SPACE-6 · SHOULD** Die Beziehung, die ein Abstand ausdrückt, nicht mit einer dekorativen Trennlinie aufheben.

### Vertikaler Rhythmus über Geschwisteransichten hinweg

- **D-SPACE-7 · SHOULD** Beziehungen wiederholen, keine festen Höhen. Abstände zwischen Titel und Beschreibung,
  Feld und Hinweis, Gruppen und Bereichen nach ihrer Beziehung aus der Host-Skala wählen.

Das sind Kompositionsentscheidungen, keine allgemeingültigen Komponentenmaße.

- **D-SPACE-8 · SHOULD** Übersetzungen natürlich wachsen lassen und für eine fehlende Beschreibung keine leere Zeile
  freihalten.
- **D-SPACE-9 · SHOULD** Jeder Abstand hat genau einen Eigentümer: den übergeordneten Stack oder einen expliziten
  Außenabstand des Kindes. Selbst gesetzte lokale Außenabstände von Überschriften und Absätzen zurücksetzen, statt
  sie zum Abstand des Elternelements zu addieren.
- **D-SPACE-10 · SHOULD** Eigenen Innenabstand von Steuerelementen, zusammenfallende Außenabstände und den Platz der
  Inline-Grundlinie einrechnen; nicht mit Transforms oder kleinerer Schrift ausgleichen.
- **D-SPACE-11 · SHOULD** Hinweise beim Feld oder bei der Aktion platzieren, die sie erklären.
- **D-SPACE-12 · MUST** Ausgeblendete Hilfstexte hinterlassen keinen versehentlichen Abstand. _Proof: browser_
- **D-SPACE-16 · SHOULD** Eine reservierte Zeile für asynchronen Status hat einen benannten Zweck und Grenzen.
  Beide Achsen messen, nachdem sich der Inhalt gesetzt hat; [ACCEPTANCE](./ACCEPTANCE.md) bewertet das als V-PROOF-6.

`next.top - previous.bottom` misst den Abstand der Rahmen, nicht den Raum von Glyphen oder Zeilenboxen.

- **D-SPACE-14 · SHOULD** Zeilenabstand, Innenabstand und Haarlinien auseinanderhalten: 16px Innenabstand plus eine
  1px-Linie sind kein 17px-Abstandstoken.
- **D-SPACE-15 · SHOULD** Unabhängige Erwartungswerte verwenden und Umbruch, Größenänderung, Sichtbarkeit von Hinweis
  und Fehler sowie die relevante Dichte durchspielen.

[ACCEPTANCE](./ACCEPTANCE.md#browser-proof) regelt die Prüfungen nach dem Setzen und nach Änderungen auf doppelte
Außenabstände, Phantomzeilen und Verschiebungen, die nur den Text betreffen.

### Die Zeilenlänge begrenzt den Text, nicht die Spalte

- **D-TYPE-4 · SHOULD** **Eine lesbare Zeilenlänge für das tatsächliche Schriftsystem und die Schrift wählen.**

Für lateinischen Fließtext sind 60–75 Zeichen pro Zeile ein Ausgangswert, kein allgemeiner Bereich für jedes
Schriftsystem.

- **D-TYPE-5 · SHOULD** Realistischen Text in den unterstützten Breiten, Zoomstufen und Ersatzschriften prüfen;
  CJK und gemischte Schriftsysteme brauchen ein eigenes Urteil.

[WCAG zur visuellen Darstellung](https://www.w3.org/WAI/WCAG22/Understanding/visual-presentation.html)
unterscheidet CJK ebenfalls in ihrem AAA-Kriterium; das ist kein verpflichtender Standard für Bibliotheken.

- **D-TYPE-6 · SHOULD** Einer Tabelle, einem Codeblock, einer Demo-Bühne oder einem Bild die Breite lassen, die ihr
  Inhalt braucht. Die Textelemente begrenzen, nicht die Spalte, die sie enthält.
- **D-TYPE-7 · SHOULD** **Die Zeilenlänge in `rem` angeben, nie in `em`.**

`em` bezieht sich auf die eigene Schriftgröße des Elements: Je größer die Schrift, desto länger die Zeile – genau
verkehrt herum.

- **D-TYPE-8 · SHOULD** **Hierarchie aus Typografie aufbauen, bevor zu einer Box gegriffen wird.**

Eine Stufe größer und eine Stufe zurückgenommen in der Farbe machen aus einem Titel und seinem ersten Satz einen
Titel mit Unterzeile, ohne neuen Container und ohne neuen Rahmen.

### Sagt das Layout, zwei Dinge seien ein Objekt, muss der Abstand zustimmen

**Ein gemeinsamer Rahmen, ein gemeinsamer Radius und ein Abstand dazwischen widersprechen sich.**

- **D-ALIGN-1 · SHOULD** Entscheiden, ob die Elemente ein Objekt sind oder zwei, und jede Eigenschaft dasselbe
  sagen lassen.
- **D-ALIGN-2 · SHOULD** **Muss ein Wert einem anderen entsprechen, ihm einen Namen geben.** Ein Abstand, den ein
  Kind abziehen muss, ist kein Literal an zwei Stellen, sondern eine Custom Property, auf die zweimal verwiesen wird.

### Eine Spalte nur reservieren, wenn ihr Inhalt existiert

**Eine bedingungslos deklarierte Spalte bleibt eine Spalte, auch auf Seiten, die nichts für sie haben.**

- **D-ALIGN-3 · SHOULD** Die Spur davon abhängig machen, dass das Element tatsächlich vorhanden ist (`:has()`),
  nicht von einem Seitentyp, von dem man annimmt, er bringe es mit.

### Ausrichtung ist Struktur, kein Feinschliff

- **D-ALIGN-4 · SHOULD** **Jede Ausrichtungsachse und die Geometrie, die sie ausrichtet, benennen.** Angeben, welche
  Geschwister sich jede Achse teilen; Kopfzeilen, Fließtext, Zeilen, Aktionen und Inhalte für Leer-, Lade- und
  Fehlerzustand einschließen.

Die Inhaltsachse einer Seite, eine Navigationsspalte und eine verschachtelte Achse für Formular-Labels dürfen
bewusst voneinander abweichen.

- **D-ALIGN-5 · SHOULD** Ein Zurück-Button plus Abstand kann eine eigene Titelspalte bilden: diesen Titel nicht
  stillschweigend als am Fließtext ausgerichtet behandeln.
- **D-ALIGN-6 · MUST** Ein fehlendes optionales Icon oder Badge rückt Labels nie aus ihrer deklarierten Spalte.
  _Proof: browser_
- **D-ALIGN-7 · SHOULD** Eine verschachtelte Ebene kehrt an ihrem Ende genau zur Achse ihres Elternelements zurück.
  Die richtigen Boxen vergleichen. Das sind getrennte Messungen, auch wenn sie zufällig übereinstimmen; das Messen
  auf der Ebene des Defekts bewertet [ACCEPTANCE](./ACCEPTANCE.md) als V-PROOF-10.

| Geometrie     | Was gemessen wird                                                                                                |
| ------------- | ---------------------------------------------------------------------------------------------------------------- |
| Rahmen        | Die Border-Box der Hülle bzw. des Hosts aus `getBoundingClientRect()`                                            |
| Inhalt        | Die Innenkante nach tatsächlichem Rahmen und Innenabstand, einschließlich verschachtelter Hüllen                 |
| Text          | Ein DOM-`Range` um die Textknoten des gerenderten Labels; bei Umbruch die Rechtecke der ersten und letzten Zeile |
| Icon-Viewport | Die SVG-/Viewbox- oder Bild-Box; die gemalte Glyphe kann darin asymmetrisch sitzen                               |
| Trefferfläche | Das tatsächliche Event-Ziel und seine Hover-/Fokusfläche; Punkte nahe ihren Rändern prüfen                       |

Ein Button-Rahmen, der mit einem Absatz fluchtet, belegt nicht, dass sein Text fluchtet: Interner Innenabstand kann
das Label verschieben, während der Rahmen stehen bleibt. `Range` liefert typografische Geometrie, nicht die exakte
Tinte der Glyphe.

- **D-ALIGN-9 · SHOULD** Optische Glyphenkorrekturen getrennt prüfen.
  Bei Web Components den Host, dokumentierte Shadow Parts und geslotteten Text über unterstützte Testschnittstellen
  messen. Das regelt V-PROOF-11 in [ACCEPTANCE](./ACCEPTANCE.md), einschließlich des Verbots von Shadow-Abfragen im
  Produktionscode und der Annahme, Dokument-CSS reiche über die Grenze.
- **D-ALIGN-11 · SHOULD** **Die Trefferfläche eines Kopfzeilenbefehls von Layout-Füllraum trennen.** Ein Titel- oder
  Menüauslöser umschließt seinen Inhalt plus bewussten Innenabstand, begrenzt durch die verfügbare Breite. Eine eigene
  Flex- oder Grid-Spur nimmt den restlichen Platz auf.
- **D-ALIGN-12 · SHOULD** Für lange Übersetzungen Kürzen bzw. Umbrechen und das Verhalten benachbarter Aktionen
  festlegen.
- **D-ALIGN-13 · MUST** Die Trefferfläche des Titelauslösers reicht nicht über ungenutzten Kopfzeilenraum (etwa durch
  `flex: 1` am Titel-Button), es sei denn, D-ALIGN-14 greift. _Proof: browser_
- **D-ALIGN-14 · SHOULD** Eine Zeile, die bewusst über ihre ganze Breite auswählt, ist eine andere Rolle; diesen
  Vertrag ausdrücklich festhalten.
- **D-ALIGN-15 · MAY** Ziele für grobe Zeiger dürfen größer werden.
- **D-ALIGN-22 · SHOULD** Die Hover-Füllung eines vergrößerten Ziels bleibt auf dem eigenen Inhalt des
  Steuerelements, nicht über fremdem Inhalt.
- **D-ALIGN-16 · SHOULD** **Jeden Einzug vom gemeinsamen Vorfahren bis zum sichtbaren Text zählen.** Innenabstand des
  Elternelements, Innenabstand verschachtelter Panels, interner Innenabstand eines Steuerelements, Rahmen und
  Navigationsspalten tragen alle dazu bei.
- **D-ALIGN-17 · SHOULD** Einen überflüssigen Einzug bei seinem Eigentümer entfernen, statt ihn mit einem
  unerklärten negativen Außenabstand aufzuheben.
- **D-ALIGN-18 · SHOULD** Leerzustände behalten die Inhaltsachse und Breite ihres Bereichs; zusätzlicher Freiraum
  erzeugt nie eine zweite linke Kante und lässt keine kompakte Aktion den Bereich füllen.
- **D-ALIGN-19 · SHOULD** Produktspezifische Einzüge und Zielgrößen als Anwendungs-Aliase führen, nicht als neue
  Grundwerte oder allgemeine Komponentenstandards.
- **D-ALIGN-20 · SHOULD** **Sollen zwei Layoutkanten oder Abstände gleich sein, ist ein Pixel Unterschied ein
  Defekt.** Die optische Glyphenkorrektur (D-ALIGN-21) ist die einzige Toleranz.
- **D-ALIGN-21 · SHOULD** Die optische Korrektur einer asymmetrischen Glyphe als eigene, dokumentierte Asset- oder
  Komponentenentscheidung behandeln, die in unterstützten Größen wiederverwendet wird, während Geschwisterabstände,
  Grundlinien und Achsen exakt bleiben.

Optische Korrektur ist keine Erlaubnis, Seitenränder so lange zu verschieben, bis ein Screenshot ausgewogen aussieht.

### Auswahl, Links und andere semantische Lügen

- **D-SEM-1 · MUST** **Auswahl ist dauerhafter Zustand und sieht nie wie Hover aus.** _Proof: browser_

Hover ist flüchtig; wird das aktuelle Element mit derselben Füllung markiert wie Hover, hat die Oberfläche zwei Namen
für ein Erscheinungsbild.

- **D-SEM-2 · MUST** **Aktions- und Link-Rollen bleiben unterscheidbar.** _Proof: browser_
- **D-SEM-3 · SHOULD** Inline-Links gegen den umgebenden Fließtext prüfen, auch in Themes, in denen Aktions- und
  Textfarbe zufällig übereinstimmen.

**Ein Link führt weg; ein Button handelt.**

- **D-SEM-4 · MUST** Alles, was den Anwendungszustand ändert, ist ein Button, egal wie es aussieht.
  _Proof: review, browser_
- **D-SEM-5 · SHOULD** Ein Link in Button-Form trägt keine Unterstreichung.

### Befehlshierarchie in engen Bereichen

- **D-CMD-1 · SHOULD** **Überflüssige Gruppeneinfassungen entfernen, ohne die Erkennbarkeit der Steuerelemente zu
  tilgen.**

Überschriften, Ausrichtung und Nähe bilden Gruppen in einem Einstellungsbereich; für sich allein lassen sie ein Icon
mit Label aber ohne anklickbares Aussehen zurück.

- **D-CMD-2 · SHOULD** Flache Zeilen verwenden, wenn ein erkennbares Menü- oder Listenmuster die Aktion schon
  vermittelt; sie nicht in jedem Kontext verlangen.
- **D-CMD-3 · SHOULD** Einem eigenständigen Befehl, der es braucht, eine eigene zurückhaltende Button-Fläche oder
  funktionale Kontur geben, die in jedem unterstützten Theme schon vor dem Hover sichtbar ist.
- **D-CMD-4 · SHOULD** Die eigene Form eines Buttons sein Ziel kenntlich machen lassen; eine umschließende Karte, eine
  gedämpfte Gruppenfüllung und Zeilenlinien müssen trotzdem den Test auf eigenständige Begrenzung bestehen (D-BOX-5).
- **D-CMD-5 · MUST** Die erste Entdeckung beruht nicht allein auf Hover, Zeigercursor, Verb-Labels oder
  Tastaturfokus. _Proof: browser_
- **D-CMD-6 · SHOULD** Den ganzen Bereich im Ruhezustand mit weggezogenem Zeiger prüfen, auch bei Touch-Bedienung.
- **D-CMD-7 · MUST** Hover, Drücken, Deaktiviert und Tastaturfokus bleiben unterscheidbar, nachdem das
  Steuerelement entdeckt wurde. _Proof: browser_
- **D-CMD-8 · SHOULD** Lange übersetzte Labels innerhalb einer Befehlsspalte umbrechen, statt eine ausgefranste
  horizontale Button-Wolke zu bilden.
- **D-CMD-9 · MUST** Sofortigen Befehlen keine Navigationspfeile (Chevrons) hinzufügen. _Proof: review_
- **D-CMD-10 · SHOULD** Angeben, welche sichtbaren Spalten mit benachbarten Checkboxen oder Steuerelementen geteilt
  werden: Kanten von Icons und Checkboxen sowie Text-Ranges messen, nicht nur Button-Rechtecke oder die Ausrichtung
  innerhalb der Befehlsgruppe.
- **D-CMD-11 · MAY** Eine Trefferfläche darf in einen eigenen Randbereich hineinreichen, um diese Spalten zu
  erhalten; die Erweiterung benennen.
- **D-CMD-12 · MUST** Eine erweiterte Trefferfläche bleibt innerhalb ihres Bereichs, überlappt keine anderen Ziele
  und hält den Fokus sichtbar. _Proof: browser_
- **D-CMD-13 · SHOULD** Destruktive Befehle von Wiederherstellungs- und Übertragungsaktionen trennen.
- **D-CMD-14 · SHOULD** Gefahren-Label und -Icon die Absicht vermitteln lassen, ohne jeden ruhenden Befehl mit einer
  großen roten Kontur zu versehen; die stärkste Gefahrenfüllung der ausdrücklichen Bestätigung vorbehalten.
- **D-CMD-15 · MUST** Destruktive Befehle behalten Bestätigung, Abbruch, Fokusrückgabe und Schutz vor doppelter
  Auslösung während der Ausführung. _Proof: browser_
- **D-CMD-16 · SHOULD** Einen Befehlsbereich im Ruhezustand abnehmen, nicht nur im Hover-Zustand.

Die Abnahme umfasst die Auffindbarkeit im Ruhezustand, deklarierte gemeinsame Spalten, die Begrenzungshierarchie des
ganzen Bereichs, Zielgrenzen, abgeschnittene Labels, Kontrast und Interaktionszustände.

- **D-CMD-17 · SHOULD** Auch das tatsächliche Rendering ansehen: Eine automatisierte Prüfung auf Flächenunterschiede
  findet unsichtbare Steuerelement-Füllungen, belegt aber nicht, dass Nutzer die Aktion erkennen.
- **D-CMD-18 · SHOULD** Grundrollen und Zielanforderungen für grobe Eingabe wiederverwenden; diese Anleitung ändert
  keine Komponentenstandards.

### Ein Produkt, ein Token-Satz

- **D-TOKEN-1 · SHOULD** Die maßgeblichen semantischen Tokens des Produkts verwenden. Aliase dürfen die Lesbarkeit
  verbessern, sollen aber aus dieser Quelle auflösen, statt eine konkurrierende Palette zu erfinden.
- **D-TOKEN-2 · SHOULD** Komponenten von Drittanbietern über unterstützte Theme-APIs abstimmen und das
  zusammengesetzte Ergebnis prüfen.

### Dichte folgt den Rollen der Steuerelemente

Abstände, Eigenmaße und Trefferflächen lösen verschiedene Probleme. Eine kleine Glyphe kann ein größeres natives
Button-Ziel haben.

- **D-TOKEN-3 · SHOULD** Tatsächliche Trefferflächen, Fokus und angrenzende Abstände messen.
- **D-TOKEN-4 · SHOULD** Wiederkehrende Host-Aliase aus Grund-Tokens ableiten, nicht aus den Maßen einer einzelnen
  Anwendung, die in die Bibliothek kopiert wurden.
- **D-TOKEN-5 · SHOULD** Zielgrenzen für die tatsächliche Eingabemethode wählen, ohne jede Glyphe zu vergrößern oder
  Platz für versteckte Steuerelemente freizuhalten. Unterstützte öffentliche Theme-APIs verwenden.
- **D-TOKEN-6 · MUST** Steuerelemente, die nur aus einem Icon bestehen, haben einen zugänglichen Namen. _Proof: browser_
- **D-TOKEN-7 · SHOULD** Berechtigte Ausnahmen für Viewport, Haarlinien, Grafiken und optische Geometrie
  dokumentieren.

### Handwerk anhand von Belegen bewerten

Feinschliff folgt der Klarheit der Aufgabe, nicht einem Baukasten aus Karten, Weichzeichnern oder Einblendungen.

- **D-CRAFT-1 · SHOULD** Eine bewusste visuelle Richtung mit realistischen Objekten, Texten und Zuständen wählen;
  eine generische leere Hülle kann keine Produktqualität belegen.

Arbeitsoberflächen brauchen ausdauerndes Lesen und häufige Aktionen; Marketingseiten brauchen unter Umständen eine
andere Komposition.

- **D-CRAFT-2 · SHOULD** Den kleinstmöglichen Eingriff an echten Inhalten, Sprachen, Geräten und wiederholter Nutzung
  bewerten.

Primäre Referenzen beantworten konkrete Fragen:
[Linear-Hierarchie](https://linear.app/now/behind-the-latest-design-refresh),
[Geist-Typografie](https://vercel.com/geist/typography),
[optische Ausrichtung](https://craft.gustavofior.com/optical-alignment) und
[Unterbrechbarkeit](https://craft.gustavofior.com/interruptibility).

- **D-CRAFT-3 · SHOULD** Ihre Prinzipien mit den Tokens und tatsächlichen Möglichkeiten des Hosts übertragen; keine
  Pixelmaße eines Produkts kopieren und keine Rezepte als Regeln importieren.
- **D-CRAFT-4 · SHOULD** Referenzen als Grundlage für Entscheidungen behandeln, nicht als zusätzliche Regelwerke;
  [Don't Make Me Think](https://sensible.com/dont-make-me-think/) etwa liefert Hinweise zu Überfliegen, Hierarchie
  und klaren Entscheidungen.

[taste-skill](https://github.com/leonxlnx/taste-skill) liefert Hinweise zu bewusster Richtung und Kritik;
[ryugi](https://github.com/Innei/ryugi) zu ausführbarer Arbeit und frischen Belegen.

- **D-CRAFT-5 · SHOULD** Eine stilistische Vorliebe braucht Kontext; eine Anforderung nennt die Aufgabe oder den
  beobachtbaren Vertrag, den sie schützt.
- **D-CRAFT-6 · SHOULD** Referenzen nach der Aufgabe wählen, die sie stützen: Logo und App-Identität,
  Marketing-Komposition und häufige Arbeitsinteraktionen lösen verschiedene Probleme.
- **D-CRAFT-7 · SHOULD** Das beobachtete Muster und seine Anpassung festhalten; das Ergebnis mit echten Inhalten
  prüfen.

Der optionale [Rechercheindex](./REFERENCE_RESEARCH.md) ordnet Quellen Fragen zu und zeigt diese Übertragung, ohne
ein weiteres Regelwerk hinzuzufügen.

- **D-CRAFT-8 · SHOULD** Ist die Richtung noch offen, zwei kleine Varianten im echten Host mit gleichem Inhalt,
  gleicher Breite und gleichem Theme vergleichen und dabei jeweils nur eine Dimension ändern. Erklären, was jeder
  Unterschied für die Aufgabe bewirkt.

Eine klare Richtung oder eine kleine Korrektur geht direkt weiter; es gibt kein verpflichtendes Freigaberitual.

- **D-CRAFT-9 · SHOULD** Kurze Überschriften schrittweise mit `text-wrap: balance` ausgleichen und den normalen
  Umbruch erhalten.
- **D-CRAFT-10 · MUST** Überschriften enthalten keine sprachabhängigen manuellen Zeilenumbrüche und werden nicht
  abgeschnitten, um einen Screenshot zu erhalten. _Proof: browser_
- **D-CRAFT-11 · SHOULD** Kosten und Unterstützung prüfen, bevor `pretty` auf langen Live-Inhalten verwendet wird.
- **D-CRAFT-12 · SHOULD** Tabellenziffern verwenden, um die Ziffernbreiten zu stabilisieren, sofern die Schrift sie
  unterstützt.
- **D-CRAFT-13 · SHOULD** Für Änderungen der Stellenzahl wie 99 → 100 eine sinnvolle Spalte reservieren.
- **D-CRAFT-14 · MUST** Eine Änderung der Stellenzahl schneidet den Wert nie ab. _Proof: browser_
- **D-CRAFT-15 · SHOULD** Asymmetrische Glyphen in einem wiederverwendbaren Asset oder einer Komponente korrigieren
  und dabei exakte Layoutachsen erhalten.
- **D-CRAFT-16 · SHOULD** Die Geometrie verschachtelter Ecken aus dem tatsächlichen Einzug ableiten; eine unnötige
  verschachtelte Fläche zuerst entfernen.
- **D-CRAFT-17 · SHOULD** Bewegung eine Aufgabe geben: sofortiges Feedback bei Häufigem, unterbrechbare Übergänge,
  reduzierte Bewegung und sofortige Theme-Wechsel. Siehe §5.
- **D-CRAFT-18 · MUST** Optionale Effekte zur Freude verzögern nie das Tippen und verdecken nie einen Status. _Proof: recording_
- **D-CRAFT-19 · SHOULD** Dekoration außerhalb des sichtbaren Bereichs pausieren und realistische Inhalte messen,
  bevor teure Effekte übernommen werden.

### Wörter sind Teil der Oberfläche

- **D-COPY-6 · SHOULD** Unnötige sekundäre Labels und Beschreibungen vermeiden. Das Layout erklären lassen.
- **D-COPY-7 · SHOULD** Eine Überschrift, Gruppierung, Nähe oder ein offensichtliches Steuerelement braucht keinen
  weiteren Satz, der seinen Zweck wiederholt.
- **D-COPY-8 · SHOULD** Text ohne neue Entscheidung, Einschränkung oder Folge entfernen; ihn nicht durch ein
  dekoratives Badge oder einen Tooltip ersetzen.
- **D-COPY-9 · MUST** Zugängliche Namen, Feld-Labels, Einheiten, Fehlermeldungen und Risikohinweise erhalten.
  _Proof: browser_
- **D-COPY-10 · SHOULD** Nützliche Hinweise für die erste Nutzung erhalten und testen, ob die Aufgabe verständlich
  bleibt.
- **D-COPY-11 · SHOULD** Den Kontext den Kontext tragen lassen: `Users` statt `User Management`; die Frage eines
  Dialogs nicht in seinem Text wiederholen.
- **D-COPY-12 · SHOULD** Ergebnisse benennen (`Save`, `Move`, `Delete`), keine Gesten (`Click to save`). Das Objekt
  nur nennen, wenn der Kontext es nicht schon klärt.
- **D-COPY-13 · MUST** `Cancel` verlässt den Vorgang, ohne etwas zu übernehmen. _Proof: browser_
- **D-COPY-14 · SHOULD** Satzschreibung verwenden, keinen Punkt hinter kurzen Labels, einen Punkt hinter
  erklärenden Sätzen.
- **D-COPY-15 · SHOULD** Ein einzelnes `…` verwenden, wenn eine Aktion vor dem Abschluss weitere Eingaben braucht;
  GROSSBUCHSTABEN kurzen Statusangaben, Dachzeilen und Akronymen vorbehalten.

### Prüfliste für eine zusammengesetzte Oberfläche

- **D-REVIEW-1 · SHOULD** Diese Fragen auf die betroffene Oberfläche und die erreichbaren geänderten Zustände
  anwenden. Irrelevante Varianten überspringen; ein kleiner Patch verlangt kein Redesign unbeteiligter Seiten. Ein
  „Nein“ innerhalb des Umfangs ist ein Befund.

1. Erkennt jemand, der neu liest, Zweck und Hauptaktion, ohne zu raten?
2. Beschreiben Label, Zustand und Ergebnis jedes Steuerelements ein und dasselbe Ergebnis?
3. Ist Betonung knapp – bekommt das Wesentliche das Gewicht, während Farbe, Badges und primäre Buttons selten bleiben?
4. Ginge es mit weniger: Lässt sich ein Einstieg, eine Option oder ein Zustand entfernen, ohne die Aufgabe zu schwächen?
5. Sind benannte Achsen auf der Ebene des sichtbaren Texts bzw. Inhalts exakt, auch in verschachtelten und leeren Zuständen, mit bewussten Navigationsspalten und ohne doppelten Innenabstand?
6. Teilen benachbarte Steuerelemente ihre deklarierten Icon- und Textspalten?
7. Umschließen die Trefferflächen von Titeln eng ihren Inhalt?
8. Nutzen wiederkehrende vertikale Beziehungen einheitliche Abstände mit genau einem Eigentümer, auch bei umbrochenem Text und ausgeblendeten Hinweis- oder Fehlerinhalten?
9. Liest sich Fließtext in seinen tatsächlichen Schriftsystemen, Schriften und Zoomstufen angenehm, und ist alles, was **kein** Fließtext ist, von dieser Längenbegrenzung befreit?
10. Stimmt bei jedem Element, das wie Teil eines Objekts aussieht, alles überein – Rahmen, Radius **und** Abstand –, und hat jede reservierte Spalte tatsächlich Inhalt? Vermittelt jeder dauerhafte Rahmen, jede Füllung und jede Trennlinie eine eigene Grenze, statt dieselbe Gruppe erneut zu verschachteln?
11. Hält es in den relevanten geänderten Zuständen: leer, Laden, Fehler, lange Übersetzungen, schmale Breite, unterstützte Themes, reduzierte Bewegung und **RTL**, wo betroffen?
12. Wurde die betroffene Oberfläche bei Layout- oder Interaktionsänderungen in einem echten Browser in den relevanten Breiten und Themes geprüft? Sind eigenständige Aktionen vor dem Hover erkennbar, auch bei Touch-Bedienung, ohne überflüssige Gruppeneinfassungen?

Ein Screenshot des Idealablaufs belegt kein Tastaturverhalten, keinen Fokus, keine dynamischen Inhalte, keine
Größenänderung und keine Fehlerbehebung.

- **D-REVIEW-2 · SHOULD** Für unabhängige Erwartungswerte, die tatsächliche Identität von Laufzeit und Aufnahme,
  Browsermessungen und getrennte Ergebnisse von Automatisierung, Agent und Mensch [ACCEPTANCE](./ACCEPTANCE.md)
  folgen.

Das nur im Quellcode vorhandene [Browser-Beispiel](https://github.com/chaxus/ran/blob/main/packages/ranui/test/e2e/layout-contract.md)
enthält Einrichtungsbefehle und Details zu Testwerkzeugen; das sind keine öffentlichen Paket-APIs.

## 10. Informationsarchitektur – die Form vor der Komposition

- **D-IA-1 · SHOULD** Für informationsdichte Konsolen, Dashboards und Arbeitsplätze die Struktur vor der
  Komposition wählen.

Vollständige API-Daten sind noch kein Seitendesign: Lesende brauchen weiterhin eine klare Reihenfolge, um Objekte,
ihren Zustand und ihre Beziehungen zu verstehen und dann zu handeln.

- **D-IA-2 · SHOULD** Seiten mit einer einzigen Konversion und Landingpages eine eigene Aufgabenstruktur geben statt
  einer Vorlage für dichte Konsolen.

### Drei Fragen beantworten, bevor eine Komponente benannt wird

- **D-IA-3 · SHOULD** Alle drei Antworten klären, bevor Komponenten gewählt werden.

1. **Was müssen Lesende beim Ankommen sehen?** Das ist die primäre Information.
2. **Was muss außerdem sichtbar sein, damit sie Sinn ergibt?** Verwandte Ressourcen, verwandte Modelle, Kontext.
3. **Was tun sie als Nächstes?** Beurteilen, handeln oder weiterdenken.

- **D-IA-4 · SHOULD** **Eine Seite hat genau ein primäres Modell.** Unterstützende Modelle dürfen helfen, es zu
  verstehen oder zu bedienen; sie dürfen nicht um den ersten Bildschirm konkurrieren.
- **D-IA-5 · SHOULD** Eine klare, eindeutige nächste Wahl einem willkürlichen Klickbudget vorziehen. Testen, ob
  Lesende die nächste Aktion erkennen, nicht nur, ob das Ziel erreichbar ist.

### Die Form folgt der Aufgabe, nicht den Nutzdaten

- **D-IA-6 · SHOULD** Ein Grundgerüst nach der Frage der Lesenden wählen, nicht nach einem API-Array oder einer
  Routen-ID; die Tabelle unten hilft dabei.

| Aufgabe                                                   | Passende Form                                                          |
| --------------------------------------------------------- | ---------------------------------------------------------------------- |
| Werte/Unterschiede vergleichen                            | Tabelle oder Diff                                                      |
| Eine Ressource erkennen/öffnen                            | Liste; Bildraster nur, wenn Bilder sie kennzeichnen                    |
| Den aktuellen Zustand eines Objekts verstehen             | Gegliederte Detailansicht                                              |
| Zugehörigkeit/Abhängigkeiten verstehen                    | Baum oder Nachbarschaftsliste; Graph nur, wenn der Pfad zählt          |
| Den nächsten Schritt planen / Arbeit durch Stufen bewegen | Schrittfolge / Kanban, wenn das Verschieben die eigentliche Arbeit ist |
| Prüfen, was wann durch wen geschah                        | Zeitleiste oder Trace-Drilldown                                        |
| Fortlaufenden Text diskutieren oder lesen                 | Thread oder Dokument                                                   |
| Zustand, Trends oder Anomalien beurteilen                 | Statuswand oder Dashboard                                              |
| Belegung/Konflikte oder Orte finden                       | Kalender oder Karte/Canvas                                             |
| Am nächsten Element arbeiten / Regeln ändern              | Master-Detail-Arbeitsplatz / Konfigurationsformular                    |

- **D-IA-7 · SHOULD** Vergangene Ereignisse nicht mit künftigen Schritten verwechseln, einen Filter nicht mit Kanban
  und geordneten Fließtext nicht mit einem Feldraster. Ein Datum allein rechtfertigt keinen Kalender.
- **D-IA-8 · SHOULD** Mehrere Ansichten nur ausliefern, wenn jede eine eigene Aufgabe erfüllt, die den Pflegeaufwand
  für Filter, Zustand und Aktionen wert ist.

### Jede Art von Information hat ihren Platz

- **D-IA-9 · SHOULD** Mit Identität und Status im Titel- oder Zusammenfassungsbereich beginnen und Aktionen, Feedback
  und Belege bei ihrem Gegenstand halten, wie die Tabelle unten zeigt.

| Information | Gehört hierhin                                                          | Falscher Ort                                        |
| ----------- | ----------------------------------------------------------------------- | --------------------------------------------------- |
| Identität   | Titel, Objektzusammenfassung                                            | Die letzte Spalte oder hinter einem Tab             |
| Status      | Titel- oder Zusammenfassungsbereich                                     | Nur in einem Detailfeld auffindbar                  |
| Attribute   | Detailbereich, so gruppiert, wie Menschen darüber denken                | Flach in der Reihenfolge der API-Felder             |
| Beziehungen | Eigener Bereich oder Tab; Zugehörigkeit, Abhängigkeit, Verweis getrennt | In die Attributtabelle gemischt                     |
| Änderungen  | Diff-Bereich, Zeitleiste                                                | Nur als neuer Wert gezeigt                          |
| Belege      | Neben dem Urteil, aufklappbar                                           | Eine Log-Seite anderswo                             |
| Aktionen    | Die primäre im Titelbereich, die übrigen neben ihrem Objekt             | Unter „Mehr“ vergraben                              |
| Feedback    | Neben der Aktion, mit erhaltenem Aufgabenkontext                        | Ein globaler Toast, losgelöst von seinem Gegenstand |

- **D-IA-10 · SHOULD** **Jede Tatsache hat genau einen maßgeblichen Ort.** Anderswo steht eine Zusammenfassung oder
  ein Einstieg, der dorthin zurückverlinkt.
- **D-IA-11 · SHOULD** Der Standard-Lesereihenfolge folgen: Identität der Seite → aktueller Status oder Ausnahme →
  Hauptaufgabe und Hauptaktion → die Informationen, die das Urteil braucht → Beziehungen, Änderungen, Belege →
  Nebeninformationen und seltene Aktionen.
- **D-IA-12 · SHOULD** **Eine Hauptaktion pro Aufgabenbereich**, und zwar der wahrscheinlichste nächste Schritt,
  nicht der destruktivste (§9, „Betonung ist ein Budget“, regelt, wie viel Gewicht sie bekommen darf).

### Dichte heißt wirksame Information, nicht Steuerelemente pro Zoll

Engere Abstände erhöhen die visuelle Dichte und lassen die wirksame Dichte, wo sie war. Wer irrelevante Felder
entfernt und den Vergleich an einer Stelle bündelt, erhöht die echte.

- **D-IA-13 · SHOULD** **Höchstens zwei benachbarte Dichtestufen auf einer Seite verwenden**: großzügig für die erste
  Nutzung und riskante Bestätigungen, Standard für die meisten Listen und Detailansichten, kompakt für
  Experten-Arbeitsplätze.
- **D-IA-14 · MAY** Innenabstände von Containern und Zeilenhöhen dürfen enger werden.
- **D-IA-15 · MUST** Lesbarer Fließtext, ein sichtbarer Fokusring und die Größe von Zeigerzielen schrumpfen nicht mit
  der Dichte (§7, §8). _Proof: browser_

### Container reparieren keine Struktur

- **D-IA-16 · SHOULD** **Ein kontextueller Rückweg pro Ansicht.** Nicht gleichzeitig ein äußeres „Zurück zum Chat“
  und ein inneres „Zurück zu den Artefakten“ zeigen.
- **D-IA-17 · SHOULD** Die Detailansicht führt zu ihrem unmittelbaren Elternelement zurück.
- **D-IA-18 · MUST** Vorfahren bleiben über die Routenhierarchie oder klar benannte Breadcrumbs erreichbar.
  _Proof: browser_
- **D-IA-19 · SHOULD** Den ganzen Weg prüfen, einschließlich Fokusrückgabe und langer übersetzter Zielnamen.
- **D-IA-27 · MUST** Die Rückkehr zum Elternelement setzt den Fokus auf das Ausgangselement zurück. _Proof: browser_
- **D-IA-20 · MUST** Passt Text nicht, umbrechen oder ein sinnvoll kürzeres Ziel verwenden; Auslassungspunkte oder
  ein Tooltip verbergen nie den einzigen Hinweis auf das Ziel. _Proof: browser_
- **D-IA-21 · SHOULD** Für den übergeordneten Kontext eine einzige Komposition wählen. Keinen Breadcrumb hinzufügen,
  nur um eine überflüssige Rücksprungabkürzung umzubenennen, und das Elternelement nicht als inaktives Krümelglied
  über seinem Rücksprungbefehl wiederholen.

Erreicht die Rückkehr über das Elternelement bereits den Vorfahren, erhält dieser Weg den Zugang, ohne eine weitere
Zeile in der Detail-Kopfzeile hinzuzufügen.

- **D-IA-22 · SHOULD** Breadcrumbs verwenden, wenn die Hierarchie selbst der Aufgabe hilft.

**Ein Modal ist keine Navigationsebene.**

- **D-IA-23 · SHOULD** Allem eine Route geben, was einen kopierbaren Link, einen Verlauf, einen Vergleich
  nebeneinander oder Arbeit braucht, die ein Neuladen übersteht.
- **D-IA-24 · SHOULD** Ein Modal einer kurzen Bestätigung oder einem einzelnen Feld vorbehalten, ein Popover oder Menü
  flüchtigem Kontext und eine aufklappbare Zeile der schrittweisen Offenlegung.
- **D-IA-25 · SHOULD** **Tabs tragen gleichrangige Ansichten eines Objekts** – seine Unterhaltung, seine Prüfungen,
  seinen Diff –, nie unverbundene Module; das ist Aufgabe der Navigation.
- **D-IA-26 · SHOULD** Fehlt der gewählten Bibliothek ein passendes Grundelement, vorhandene semantische Elemente und
  Host-Tokens verwenden; die nötige Interaktion prüfen, statt nicht unterstützte APIs zu erfinden.

## Prüfliste (vor der Auslieferung von UI)

- **D-VERIFY-1 · SHOULD** Prüfungen für die betroffene Oberfläche, die unterstützten Varianten und das geänderte
  Verhalten auswählen; keine unbeteiligten Abläufe erzeugen, nur um die Liste zu erfüllen.

Die CI des Repositorys führt weiterhin ihre vollständigen Prüfungen aus.

- **D-VERIFY-2 · SHOULD** Hauptaufgabe und Hauptaktion sind unverkennbar.

Betroffene Layout- und Theme-Änderungen funktionieren in den relevanten **schmalen und breiten** Breiten und in den
unterstützten Themes (D-INPUT-1). Maus und Touch funktionieren beide: Ziehen läuft über Pointer Events, und jedes
`trigger="hover"` hat einen Ersatz per Tippen (D-INPUT-3, D-INPUT-4). Tastatur und sichtbarer Fokus sind durch
D-ACCESS-3 und D-ACCESS-4 abgedeckt.

- **D-VERIFY-5 · SHOULD** Alle geänderten **Zustände** durchspielen (Hover, aktiv, Fokus, deaktiviert, Laden, leer,
  Fehler).
- **D-VERIFY-7 · SHOULD** Relevante Grenzfälle abdecken: lange Texte, große Zahlen und die vom Host unterstützten
  Schriftsysteme und Sprachen.
- **D-VERIFY-8 · SHOULD** Abstände stammen aus der Skala; Schrift nutzt eine Rolle; Farbe nutzt semantische Tokens.
- **D-VERIFY-9 · SHOULD** Die zutreffenden Prüfungen des Hosts ausführen und echte Belege aus dem Browser ansehen.
- **D-VERIFY-10 · SHOULD** Texte folgen §6.

Zustandssignale allein über Farbe deckt D-ACCESS-2 ab.

- **D-VERIFY-12 · SHOULD** Für eine dichte Oberfläche: ein primäres Modell, ein Grundgerüst, das nach der Frage statt
  nach den Nutzdaten gewählt ist, und für jede Tatsache ein maßgeblicher Ort (§10).
