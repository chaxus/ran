<!-- source: 28f660782f4b364a2424b4125d8920431adf8bac -->

# UI-Abnahme – Belege und Entscheidungen

Diesen Vertrag für ein geändertes visuelles oder interaktives Ergebnis verwenden. [DESIGN](./DESIGN.md) regelt
Erscheinungsbild und Komposition; [INTERACTION](./INTERACTION.md) regelt beobachtbares Verhalten.
Der [Schnittstellenindex](./INTERFACE_GUIDE.md) ordnet die Aufgabe zu. Nur die zutreffenden Abschnitte lesen.

Jede Regel trägt eine ID und eine Stufe. **MUST** ist ein Defekt, wenn sie verletzt wird, und nennt ihren Nachweis;
**SHOULD** ist der Standard, und wer abweicht, begründet es für den konkreten Fall; **MAY** ist optional.
Der [Regelindex](./RULES.md) führt jede abgestufte Regel mit ihrem Nachweis auf.

## Sich auf das beobachtbare Ergebnis einigen

- **V-AGREE-1 · SHOULD** Vor dem Bearbeiten das
  [Design-Briefing](./DESIGN.md#style-coherence-across-components-and-pages) klären und in derselben Notiz die
  betroffene Aufgabe, Ansichten und Zustände sowie unabhängige Erwartungswerte festhalten.
- **V-AGREE-2 · SHOULD** Den zuständigen Eigentümer, die unterstützte öffentliche API und die Grenzen der
  Host-Fähigkeiten benennen.
- **V-AGREE-3 · SHOULD** Breiten, Themes, Sprachen und Eingabewege aus der tatsächlichen Änderung ableiten, ohne
  unbeteiligte Arbeit zu erfinden.
- **V-AGREE-4 · SHOULD** Für die Komposition Inhalts-, Text- und Icon-Achsen, bewusste Navigationsspalten,
  Trefferflächen und vertikale Beziehungen angeben.
- **V-AGREE-5 · MUST** Den Erwartungswert nicht aus der zu prüfenden Implementierung ableiten.
  _Proof: review_
- **V-AGREE-6 · SHOULD** In dieser Reihenfolge prüfen: Aufgabe/Hierarchie, statische Komposition, erreichbare
  kombinierte Zustände, dann Bewegung.
- **V-AGREE-7 · SHOULD** Keine Animation hinzufügen, um ungelöste Proportionen oder unklare Navigation zu
  überspielen.
- **V-AGREE-8 · SHOULD** Ändert eine Prüfung das beabsichtigte Design, zuerst das vorhandene Briefing aktualisieren
  und den Beleg nennen, der dazu geführt hat.

Das ist ein Entscheidungsprotokoll, keine neue Freigabezeremonie für Arbeit, die die Person bereits autorisiert hat.

Eine API-/Token-Prüfung bestätigt Quellverträge; ein Bildvergleich bestätigt Pixel; ein Agentenlauf bestätigt, ob
die Anleitung befolgt wurde.

- **V-AGREE-9 · SHOULD** Für jede Regel genau einen Eigentümer behalten.
- **V-AGREE-10 · MUST** Keine Art von Prüfung eine andere ersetzen lassen: Eine API-/Token-Prüfung, ein Bildvergleich
  und ein Agentenlauf belegen jeweils nur ihr eigenes Ergebnis. _Proof: review_
- **V-AGREE-11 · MUST** Ein Fixture belegt sein eigenes Ergebnis, nicht die Abnahme einer Host-Anwendung, die es nicht
  gerendert hat; es nicht als Host-Abnahme ausgeben. _Proof: review_

## Nachweis im Browser

- **V-PROOF-1 · MUST** Beim Nachstellen eines sichtbaren Defekts die tatsächlich laufende Oberfläche vor der
  Korrektur aufnehmen. _Proof: browser_
- **V-PROOF-2 · MUST** Nach der Korrektur denselben relevanten Zustand aufnehmen und den ganzen Bereich mit
  realistischen Texten und umgebender Oberfläche ansehen. _Proof: browser_
- **V-PROOF-3 · MUST** Kein Mockup, keinen Quell-Diff, keine geänderte Assertion und keinen Screenshot eines
  fremden Builds als Nachweis anbieten. _Proof: review_
- **V-PROOF-4 · SHOULD** Die Komposition ansehen, nicht nur die Zahl der Links: Wird ein überflüssiger Rückweg als
  Breadcrumb umbenannt, kann er weiterhin denselben Kontext wiederholen und eine unnötige Kopfzeile hinzufügen.
- **V-PROOF-5 · SHOULD** Die Erreichbarkeit der Vorfahren über das Elternelement nachverfolgen, bevor entschieden
  wird, dass eine weitere sichtbare Abkürzung nötig ist.
- **V-PROOF-6 · MUST** Vor dem Messen auf Komponentenregistrierung, ausstehende Inhalte, Schriften und gerenderte
  Frames warten. _Proof: browser_
- **V-PROOF-7 · MUST** Bei fehlenden oder nullgroßen Zielen fehlschlagen. _Proof: browser_
- **V-PROOF-8 · MUST** Jede Subpixel-Toleranz festhalten und sie bei exakten Achsen unter einem ganzen CSS-Pixel
  halten (das Quellbeispiel nutzt 0,5px). _Proof: review_
- **V-PROOF-9 · MUST** Bei Live-Overlays prüfen, dass die Aufnahme den Viewport erhält und Auslöser und Panel
  vollständig enthält; ein ganzseitiger Screenshot kann einen Ausschnitt ungültig machen, weil er einen responsiven
  Umbruch oder eine Neupositionierung des Portals auslöst. _Proof: browser_
- **V-PROOF-10 · MUST** Auf der Ebene des Defekts messen: Hülle, innerer Inhalt, gerenderter Text-Range,
  Icon-Viewport und tatsächliches Zeigerziel sind verschiedene Dinge. Ein Range ist nicht die exakte Tinte der
  Glyphe. _Proof: browser_
- **V-PROOF-11 · MUST** Shadow Parts über unterstützte Testschnittstellen berücksichtigen; keine Shadow-Abfragen im
  Produktionscode für die Abnahme einführen. _Proof: review_
- **V-PROOF-12 · SHOULD** Betroffene Umbrüche, umbrochene Übersetzungen, optionale Inhalte und Eingabewege
  durchspielen.
- **V-PROOF-13 · MUST** Einen statischen Screenshot nicht als Nachweis für Fokusrückgabe, Tastaturnavigation,
  Entdeckbarkeit per Touch, Unterbrechbarkeit oder asynchrones Abschließen verwenden. _Proof: review_
- **V-PROOF-14 · MUST** Eine fortlaufende Interaktion aufzeichnen, wenn sich der Defekt über die Zeit entfaltet.
  _Proof: recording_
- **V-PROOF-15 · MUST** Für eine Layout-Assertion belegen, dass sie den relevanten Defekt erkennt: nur den
  Label-Text verschieben, während der Rahmen stehen bleibt, einen doppelten Außenabstand oder einen Phantom-Hilfstext
  einführen oder ein Titelziel in den Füllraum ausdehnen. _Proof: browser_
- **V-PROOF-16 · MUST** Bestätigen, dass die Mutation die Kaskade gewonnen hat, den Fehlschlag beobachten,
  zurücksetzen und den Erfolg beobachten. _Proof: browser_
- **V-PROOF-17 · SHOULD** Für die Aufgabe relevante Mutationen verwenden, statt für eine winzige Korrektur die
  gesamte Beispielsuite zu wiederholen.
- **V-PROOF-18 · MUST** Bei Änderungen an der Darstellung die Rohdaten prüfen. _Proof: browser, unit_
- **V-PROOF-19 · MUST** Bei Code die Quelldaten kopieren, nicht den hervorgehobenen DOM-Text: Tabs, Leerzeilen, den
  abschließenden Zeilenumbruch und gestreamte Ergänzungen erhalten. _Proof: unit_
- **V-PROOF-20 · MUST** Erfolg und Fehlschlag der Zwischenablage, native Auswahl und das Scrollen langer Zeilen
  unabhängig voneinander prüfen. _Proof: browser_
- **V-PROOF-21 · MUST** Die Normalisierung der Auswahl durch den Browser dokumentieren, ohne dass sie die rohen Daten
  in der Zwischenablage verändern darf. _Proof: unit, review_

Das nur im Quellcode vorhandene [Layout-Beispiel](https://github.com/chaxus/ran/blob/main/packages/ranui/test/e2e/layout-contract.md)
enthält ausführbare Befehle und Geometrie-Hilfsfunktionen. Nutzende übertragen seine Beziehungen auf ihren Host;
diese Hilfsfunktionen sind keine neuen Exporte von ranui.

- **V-PROOF-22 · MUST** Aus einem Belastungstest mit CSS-`zoom` keine Unterstützung für nativen Browser-Zoom oder
  barrierefreie Textgrößen ableiten. _Proof: review_
- **V-PROOF-23 · MUST** Angeben, welche Wege ungeprüft bleiben. _Proof: review_

### Bewegung über die Zeit prüfen

- **V-MOTION-1 · MUST** Bei geänderter Bewegung eine fortlaufende Aktion in normaler Geschwindigkeit ansehen und
  sie dort, wo ein Übergang bricht, langsam wiederholen. _Proof: recording_
- **V-MOTION-2 · MUST** Auslösung, Zwischenzustand, Abschluss und Rückweg einbeziehen; Eingaben vor dem Abschluss
  wiederholen oder umkehren. _Proof: recording_
- **V-MOTION-3 · MUST** Endzustand, Fokus, Anzahl der Events und Leseposition unabhängig von der Animation prüfen.
  _Proof: browser_
- **V-MOTION-4 · MUST** Eine langsame Wiedergabe zur Diagnose von Brüchen verwenden, nicht als Benchmark für die
  Bildrate. _Proof: review_
- **V-MOTION-5 · MUST** Reduzierter Bewegung eine eigene Prüfung des sichtbaren Zustands geben, nicht nur eine
  kürzere Aufnahme. _Proof: browser_
- **V-MOTION-6 · SHOULD** Einen zeitlichen Defekt als
  `element → input → observed frame/state → expected continuity` melden.
- **V-MOTION-7 · SHOULD** Eine repräsentative echte Aufgabe über alle betroffenen Geschwister hinweg verwenden, um
  eine uneinheitliche Bewegungssprache zu erkennen.
- **V-MOTION-8 · SHOULD** Nach lokalen Korrekturen die ganze Komposition erneut prüfen.
- **V-MOTION-9 · SHOULD** Fehlgeschlagene Durchgänge als Diagnose aufbewahren, getrennt von abgenommenen Aufnahmen.

Diese Prüfungen ergänzen die Bindung der Belege weiter unten.

## Die Aufgabe durchgehen

- **V-WALK-1 · SHOULD** Bei einem geänderten Ablauf oder einer geänderten Komposition mit einem realistischen Ziel
  beginnen, das formuliert ist, ohne das zu verwendende Steuerelement zu nennen.
- **V-WALK-2 · SHOULD** Das Ziel vom tatsächlichen Einstieg aus erreichen, über Ergebnis, Wiederherstellung und
  Rückkehr, soweit relevant.
- **V-WALK-3 · SHOULD** Die erste Wahl, jedes mehrdeutige Label, jedes Zögern oder Zurückgehen festhalten und ob das
  Ergebnis den nächsten Schritt klar macht.

Ein kürzerer Klickweg nützt nichts, wenn die Wahlmöglichkeiten unklar sind.

- **V-WALK-4 · SHOULD** Realistische Inhalte verwenden, einschließlich eines repräsentativen langen oder
  fehlschlagenden Falls, nicht nur einen polierten Leerzustand.
- **V-WALK-5 · SHOULD** Aufgabenstruktur und Inhaltshierarchie korrigieren, bevor dekorative Effekte hinzukommen.
- **V-WALK-6 · SHOULD** Die folgenreichsten beobachteten Probleme melden (bis zu drei), jeweils mit dem Zustand und
  dem Beleg, die es zeigen.
- **V-WALK-7 · MUST** Keine Befunde erfinden, um eine Quote zu erfüllen. _Proof: review_
- **V-WALK-8 · SHOULD** Den betroffenen Weg nach der Korrektur wiederholen.
- **V-WALK-9 · MUST** Einen Durchgang durch einen Agenten als Defektsuche melden, nicht als Usability-Studie mit
  Menschen. _Proof: review_
- **V-WALK-10 · SHOULD** Bei der Beobachtung einer echten Testperson sie das Ziel versuchen lassen, bevor die
  Oberfläche erklärt wird, und diese Unterscheidung in den Ergebnissen unten beibehalten.

## Belege an das binden, was tatsächlich lief

Jeder geprüfte Zustand bekommt einen knappen Eintrag mit diesen Feldern:

- **V-FRESH-1 · MUST** Laufzeit: die getestete Quellrevision bzw. den Build und relevante ungespeicherte Eingaben
  oder deren Fingerabdruck festhalten, einschließlich gemeinsamer Stile und Komponenten sowie eingehender Daten, wenn
  sie das Ergebnis beeinflussen. Ein Git-HEAD allein reicht nicht, wenn der laufende Build oder das Arbeitsverzeichnis
  abweicht. _Proof: review_
- **V-FRESH-2 · MUST** Umfang/Umgebung: betroffene Ansicht bzw. Gruppenzugehörigkeit, Route/Zustand, Viewport,
  Theme, Sprache, Browser und Eingabe- oder Reduced-Motion-Einstellungen festhalten, soweit relevant.
  _Proof: review_
- **V-FRESH-3 · MUST** Medien: Speicherorte von Aufnahmen und Aufzeichnungen sowie ihre Inhaltsidentität (etwa
  SHA-256) festhalten, verknüpft mit dieser Laufzeit und diesem Zustand. _Proof: review_
- **V-FRESH-4 · MUST** Vorher und Nachher getrennt halten; das einzige Vorher-Bild nie überschreiben.
  _Proof: review_
- **V-FRESH-5 · MUST** Prüfung: festhalten, was die automatisierte Prüfung und die Inspektion durch den Agenten
  tatsächlich belegt haben, getrennt von jeder menschlichen Entscheidung und jedem ungeprüften Zustand. _Proof: review_
- **V-FRESH-6 · MAY** Einen kurzen Markdown-Eintrag verwenden; ein vorhandenes Manifest kann diese Felder liefern.
- **V-FRESH-7 · SHOULD** Für eine gewöhnliche Änderung keinen neuen Belegdienst und kein neues
  Konfigurations-Framework einführen.
- **V-FRESH-8 · MUST** Hashes neben den Dateien oder in einem referenzierten Manifest aufbewahren, damit sich die
  behauptete Bindung unabhängig prüfen lässt. _Proof: review_

**Eine Prüfung gilt nur für die Belege und den Laufzeitumfang, die sie angesehen hat.**

- **V-FRESH-9 · MUST** Die betroffene Prüfung als veraltet behandeln, nachdem ein Bild ersetzt, eine Aufzeichnung
  bearbeitet, die Gruppenzugehörigkeit oder relevante Laufzeiteingaben geändert wurden. _Proof: review_
- **V-FRESH-10 · MUST** Nach einer Änderung an gemeinsamen Stilen oder Komponenten jeden betroffenen Zustand
  auffrischen, bei Bedarf neu bauen und dann die neuen Belege ansehen. _Proof: browser, review_
- **V-FRESH-11 · MUST** Keine alte Aufnahme als aktuellen Nachweis ausgeben. _Proof: review_
- **V-FRESH-12 · MUST** Werden Laufzeitbelege über eine reine Doku-Änderung oder eine unbeteiligte Quelländerung
  hinweg behalten, festhalten, warum ihr Abhängigkeitsumfang nicht betroffen ist. _Proof: review_

Alte Aufnahmen dürfen als Verlauf bleiben. Eine reine Doku-Änderung oder eine unbeteiligte Quelländerung lässt
identische Laufzeitbelege gültig; alles allein wegen eines neuen HEAD neu aufzunehmen, ist unnötig.

## Zuständigkeit wahrheitsgemäß melden

| Ergebnis                       | Wer/was es belegen kann                                                                      | Was es nicht belegt                                  |
| ------------------------------ | -------------------------------------------------------------------------------------------- | ---------------------------------------------------- |
| Automatisierte Prüfungen       | Frische Befehlsausgabe oder Browser-Assertions für die angegebene Laufzeit                   | Visuelle Qualität oder eine menschliche Entscheidung |
| Visuelle Prüfung durch Agenten | Der Agent hat aktuelle Aufnahmen und die betroffene Interaktion angesehen                    | Abnahme durch die Person                             |
| Menschliche Entscheidung       | Die Entscheidung einer echten Person, mit Verweis auf Nachricht/Aktion und Umfang der Belege | Abnahme später geänderter Belege                     |

- **V-REPORT-1 · MUST** Diese drei Ergebnisse getrennt halten, auch in einem Bericht von einem Absatz.
  _Proof: review_
- **V-REPORT-2 · MUST** Jedes Ergebnis nur aus der Quelle beanspruchen, die die Tabelle oben nennt, und nie für das,
  was es laut Tabelle nicht belegt. _Proof: review_
- **V-REPORT-3 · SHOULD** Ausdrückliche Ergebnisse verwenden wie `automated: passed`,
  `agent review: passed with limits`, `human: not requested`.
- **V-REPORT-4 · MUST** Wurde eine menschliche Prüfung angefragt und steht noch aus, `pending` angeben.
  _Proof: review_
- **V-REPORT-5 · MUST** Hat eine Person abgelehnt, `rejected` und den Befund beibehalten, bis diese Person den
  aktualisierten Umfang prüft. _Proof: review_
- **V-REPORT-6 · MUST** Ein Agent darf seine Korrektur und frische Prüfungen melden, erfindet aber nie eine
  Entscheidung der Person und hebt nie eine menschliche Ablehnung auf. _Proof: review_
- **V-REPORT-7 · MUST** Ein „abgenommen“, „freigegeben“oder „验收通过“ohne Urheberangabe vermeiden. _Proof: review_

Die Autorisierung durch die Person entscheidet, ob gepusht, ein PR aktualisiert oder eine andere externe Aktion
ausgeführt wird. Dieses Dokument fügt keine pauschale menschliche Freigabeschranke hinzu.

- **V-REPORT-8 · SHOULD** Autorisierte Arbeit abschließen und ausliefern und dabei `not requested`/`pending`
  wahrheitsgemäß melden.
- **V-REPORT-9 · SHOULD** Nur nachfragen, wenn die tatsächliche Autorisierung oder eine nötige Produktentscheidung
  fehlt.
- **V-REPORT-10 · MUST** Die eigene visuelle Prüfung des Agenten nie als „von der Person abgenommen“ bezeichnen.
  _Proof: review_

Eine minimale Liefernotiz kann so aussehen:

> Laufzeit und Umfang: Build/Quelle …; Zustand/Umgebung …; relevanter Eingabe-Fingerabdruck …
> Belege: vorher/nachher/Interaktion …; Identitäten festgehalten in …
> Automatisiert: Befehle/Ergebnisse …
> Agentenprüfung: beobachtetes Ergebnis, verbleibender Befund oder Grenze …
> Menschliche Entscheidung: nicht angefragt / ausstehend / tatsächliche Entscheidung und Verweis …
> Ungeprüft: …; autorisierter PR/Update: …

## Regression der Anleitung selbst

Deterministische Kontrollen prüfen den Bewerter ohne Modellaufrufe; Live-Läufe brauchen eine verfügbare
Agentenumgebung und sind keine verpflichtende Schranke für jede Textänderung.

- **V-EVAL-1 · SHOULD** Für eine freiwillige oder durch die Aufgabe autorisierte Live-Bewertung von Änderungen an
  Skills, Routing oder Abnahme die nur im Quellcode vorhandenen
  [sechs Agentenszenarien](https://github.com/chaxus/ran/tree/main/plugins/ran/evals) verwenden.
- **V-EVAL-2 · MUST** Aufgaben, Fixtures, Werkzeuge und unabhängige Bewertungsraster vor Live-Läufen einfrieren.
  _Proof: review_
- **V-EVAL-3 · MUST** Frische Sitzungen mit gleichem Modell und gleichen Einstellungen verwenden. _Proof: review_
- **V-EVAL-4 · MUST** Baseline- und Kandidatenanleitung in getrennten Arbeitsbereichen festschreiben. _Proof: review_
- **V-EVAL-5 · MUST** Die tatsächliche Arbeit der Agenten, Prompts, Ergebnisprüfungen und Belege aufbewahren.
  _Proof: review_
- **V-EVAL-6 · MUST** Bestandene Baseline-Läufe als Kontrollen und fehlgeschlagene Kandidatenläufe als Fehlschläge
  festhalten. _Proof: review_
- **V-EVAL-7 · MUST** Den ausführenden Agenten weder die Schwellenwerte des Bewerters noch Reparatur-Patches zeigen.
  _Proof: review_

Prüfungen mit eingestreuten Defekten, die abgelehnt und nach dem Zurücksetzen bestanden werden, belegen die
Empfindlichkeit des Bewerters.

- **V-EVAL-8 · MUST** Verhalten bei diesen Aufgaben nur aus Live-Agentenläufen beanspruchen; Textabgleich, von Hand
  geschriebene Antworten oder korrigierte Testerwartungen sind dafür kein Beleg. _Proof: review_
- **V-EVAL-9 · MUST** Das visuelle Urteil unabhängig von mechanischen Prüfungen ansehen. _Proof: review_
- **V-EVAL-10 · MUST** Stichprobengröße, Werkzeuge und nicht abgedeckte Bedingungen angeben. _Proof: review_
- **V-EVAL-11 · MUST** Sechs erfolgreiche Aufgaben sind kein Nachweis von Zuverlässigkeit über Modelle hinweg; das
  nicht daraus ableiten. _Proof: review_
