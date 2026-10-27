<!-- source: 2546d093271a44411b5a6a28a982efbdc0c4a805 -->

# Interaktionsstandard

Diese Datei regelt **beobachtbares Verhalten**, unabhängig vom fachlichen Gebiet eines Bildschirms und seiner
visuellen Gestaltung. [DESIGN.md](./DESIGN.md) regelt das Erscheinungsbild; die Umsetzung gehört dem Host. Für
Mitwirkende an ranui liefert [CODING.md](https://github.com/chaxus/ran/blob/main/packages/ranui/docs/CODING.md) den technischen Adapter.
[WORKFLOW_PATTERNS.md](./WORKFLOW_PATTERNS.md) nur für eine passende mehrstufige Aufgabe heranziehen.
Diese allgemeinen Regeln setzen keine Workflow-Infrastruktur voraus.

Jede Regel trägt eine ID und eine Stufe. **MUST** ist ein Defekt, wenn sie verletzt wird, und nennt ihren Nachweis;
**SHOULD** ist der Standard, und wer abweicht, begründet es für den konkreten Fall; **MAY** ist optional.
Der [Regelindex](./RULES.md) führt jede abgestufte Regel mit ihrem Nachweis auf.

## 1. Eingaben, Entwürfe und Absicht

- **X-INPUT-1 · MUST** Labels, Voraussetzungen und Validierungsmeldungen nahe an dem Feld halten, das sie betreffen.
  _Proof: browser_
- **X-INPUT-2 · SHOULD** Einen fehlenden Wert von einem nicht verfügbaren Dienst unterscheiden und erklären, warum
  das Absenden nicht möglich ist, wenn die Voraussetzung nicht offensichtlich ist.
- **X-INPUT-3 · SHOULD** Die passende native Eingabesemantik und Autovervollständigung verwenden und die
  Bearbeitungskonventionen der Plattform erhalten; Tastenkürzel anbieten, wo sie helfen.

| Übergang                              | Erwartetes Verhalten                                                                                   |
| ------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| Leer → gültiges Formular              | Die passende Absendeaktion aktivieren; Kontext-Steuerelemente bleiben nutzbar                          |
| Absenden → läuft                      | Einmal auslösen; Belegt-Zustand anzeigen, ohne den Fokus unerwartet zu verschieben                     |
| Läuft → neue Änderungen               | Festlegen, ob Änderungen diesen Auftrag, einen späteren oder einen behaltenen Entwurf betreffen        |
| Fehlgeschlagen → Wiederherstellen     | Wiederherstellen füllt die Felder nur wieder; es sendet sie nicht ab                                   |
| Fehlgeschlagen → Wiederholen          | Wiederholen löst erneut aus; den ursprünglichen Umfang erhalten oder bei geändertem Kontext nachfragen |
| Einstellungs-/Quellwechsel → Rückkehr | Unfertige Eingaben und die Auswahl der Person nach Möglichkeit behalten                                |

- **X-INPUT-4 · MUST** Absenden löst pro Aktivierung genau einmal aus, und Wiederherstellen füllt die Felder nur
  wieder, ohne sie abzusenden. _Proof: unit_
- **X-INPUT-5 · SHOULD** Den übrigen Zeilen der Tabelle zu Eingabeübergängen folgen.
- **X-INPUT-6 · MUST** Enter sendet nur dort ab, wo die dokumentierte Konvention des Felds es vorsieht, und nie
  während einer IME-Komposition (`isComposing` prüfen). Mehrzeilige Eingabe funktioniert weiter. _Proof: browser_
- **X-INPUT-7 · MUST** Diktieren aktualisiert den Text und sendet nie von selbst ab; der Text vor der Aufnahme
  bleibt erhalten. _Proof: browser_
- **X-INPUT-8 · MUST** Ein fokussiertes Eingabefeld nicht neu aufbauen, wenn eine Suchantwort, ein Stream-Update,
  eine Größenänderung oder ein Statuswechsel eintrifft. _Proof: browser_
- **X-INPUT-9 · MUST** Die jüngste Absicht gewinnt: Eine ältere Abfrage ersetzt nie neuere Ergebnisse, und eine
  Vorschau für eine Datei erscheint nie unter einer anderen. _Proof: unit_
- **X-INPUT-10 · SHOULD** X-INPUT-9 mit den Mechanismen des Hosts für asynchrone Identität und Abbruch umsetzen;
  Mitwirkende an ranui finden dazu
  [CODING §3](https://github.com/chaxus/ran/blob/main/packages/ranui/docs/CODING.md#3-state-and-ownership).
- **X-INPUT-11 · MUST** Speicherung erst zusagen, wenn sie gelungen ist; ein behaltener Entwurf ist kein
  gespeicherter. _Proof: unit_
- **X-INPUT-12 · MUST** Suchtreffer mit sicheren Textknoten oder gleichwertigem Escaping hervorheben, nie, indem die
  Abfrage als HTML eingefügt wird. _Proof: unit_
- **X-INPUT-13 · SHOULD** Um einen hervorgehobenen Treffer genug Text stehen lassen, damit erkennbar ist, warum das
  Element passt.

## 2. Erreichbare Steuerelemente und vorhersehbarer Fokus

- **X-FOCUS-1 · SHOULD** Steuerelemente aus nativer Semantik und unterstützten Komponentenverträgen aufbauen.
- **X-FOCUS-2 · MUST** Jede Aktion, die nur aus einem Icon besteht, hat einen zugänglichen Namen. _Proof: browser_
- **X-FOCUS-3 · MUST** Eine Nebenaktion, die bei Hover erscheint, erscheint auch bei Tastaturfokus und hat bei
  grober Eingabe einen dauerhaften Weg per Tippen. _Proof: browser_
- **X-FOCUS-4 · SHOULD** Wichtige Wiederherstellungsaktionen sichtbar halten, statt sie erst bei Hover zu zeigen.
- **X-FOCUS-5 · MUST** Deaktivierte Steuerelemente reagieren nicht auf Hover und können nichts auslösen. _Proof: browser_
- **X-FOCUS-6 · MUST** Zielbox und Fokusring behalten Größe und Position, während sich ein Label oder Status ändert.
  _Proof: browser_
- **X-FOCUS-7 · MUST** Über öffentliche Attribute, Events, Slots, Variablen und Parts integrieren; keine privaten
  Shadow Roots patchen. _Proof: review_
- **X-FOCUS-8 · MUST** Keine Tab-Stopps am Host hinzufügen, die ins Leere führen oder ein inneres Steuerelement
  doppeln. _Proof: browser_
- **X-FOCUS-9 · MUST** Ein zusammengesetzter Dialog setzt den ersten Fokus in sich selbst, hält Tab und Shift+Tab
  innerhalb, schließt bei Escape und Abbrechen, löst bei Enter seine Standardaktion aus und gibt den Fokus beim
  Schließen an das öffnende Element zurück. _Proof: browser_
- **X-FOCUS-10 · SHOULD** Erreicht eine Fokusfalle ein Steuerelement nicht (etwa einen Button in einem geschlossenen
  Shadow Root in einer Fußzeile), die unterstützte Integration korrigieren oder native Buttons in den dafür
  vorgesehenen Slot setzen.
- **X-FOCUS-11 · MUST** Ein eingeklappter Bereich zeigt weiterhin Inhalt und Zustand an, und das Einklappen verbirgt
  nie einen ungelösten Fehler, der eine Handlung verlangt. _Proof: browser_
- **X-FOCUS-12 · MUST** Wird ein Bereich mit Fokus eingeklappt, kehrt der Fokus zu seinem Umschalter zurück; wird das
  fokussierte Objekt entfernt, wandert der Fokus zur nächsten sinnvollen Aktion oder zu einem stabilen
  übergeordneten Steuerelement. _Proof: browser_
- **X-FOCUS-13 · MUST** Den Fokus nicht verschieben, nur weil eine Hintergrundanfrage abgeschlossen ist. _Proof: browser_
- **X-FOCUS-14 · SHOULD** Die eingeklappte Zusammenfassung so schreiben, dass Lesende entscheiden können, ob sie
  aufklappen; zeigt der aufgeklappte Inhalt dasselbe bereits, die wiederholte Zusammenfassung weglassen und Titel
  und Zustand behalten.

Ein tastatursicheres Grundelement macht einen zusammengesetzten Dialog noch nicht sicher; X-FOCUS-9 betrifft die
Zusammensetzung.

## 3. Feedback und Leseposition

- **X-FEEDBACK-1 · SHOULD** Feedback neben dem Objekt zeigen, auf das sich die Handlung bezieht. Ein „Kopiert“ neben
  Kopieren lässt sich leichter zuordnen als eine globale Benachrichtigung ohne Bezug; ein Toast passt zu Änderungen
  über das aktuelle Objekt hinaus oder zu Feedback, das sonst unbemerkt bliebe.
- **X-FEEDBACK-2 · MUST** Eine Erfolgsbestätigung erst zeigen, wenn der Vorgang gelungen ist (bei Kopieren nach
  erfolgreichem Zugriff auf die Zwischenablage), und eine Ablehnung vor Ort behandeln, ohne Button-Geometrie und
  Fokus zu verändern. _Proof: browser_
- **X-FEEDBACK-3 · MUST** Asynchrones Feedback gehört zum Quellstand des Vorgangs: Ändert sich der Inhalt, während
  Kopieren noch läuft, markiert der ältere Abschluss nie den neuen Inhalt als „Kopiert“, und veraltetes Feedback
  wird entfernt oder als veraltet gekennzeichnet. _Proof: unit, browser_
- **X-FEEDBACK-4 · MUST** Nicht jedes gestreamte Zeichen an Hilfstechnologien ansagen.
  _Proof: browser_
- **X-FEEDBACK-5 · MUST** Live-Logs und gestreamte Ergebnisse folgen nur, solange die lesende Person beim neuesten
  Inhalt ist; Wegscrollen setzt das Mitlaufen aus, und „Zum Neuesten springen“ stellt es wieder her, ohne die
  Leseposition zu entreißen. _Proof: recording_
- **X-FEEDBACK-6 · SHOULD** Einen unterstützten Folge-/Anheften-Vertrag des Hosts oder der gewählten Komponente
  verwenden und Auftrags- und Speicherzustand in der Anwendung halten; ein reines Anhänge-Leselog ist keine
  Auftragsverwaltung.

Für X-FEEDBACK-3 verzögerten Erfolg und Fehlschlag über ein dazwischenliegendes Stream-Update hinweg durchspielen,
nicht nur eine isolierte Verzögerung.

## 4. Fortschritt, Fehler und Wiederherstellung

- **X-RECOVER-1 · SHOULD** Eine bekannte Phase benennen („Dateien werden gelesen“, „Berechtigungen werden geprüft“,
  „Export wird geschrieben“), statt nur einen Spinner zu zeigen, und bedeutsame Phasenwechsel ansagen, nicht jeden
  Timer-Tick.
- **X-RECOVER-2 · MUST** Einen Prozentwert nur mit messbarem Nenner zeigen; verstrichene Zeit ist zweitrangig und
  wird nie als Schätzung bis zum Abschluss dargestellt. _Proof: review_
- **X-RECOVER-3 · MUST** Ein Fehler beantwortet, was fehlgeschlagen ist, ob sich etwas geändert hat und was als
  Nächstes zu tun ist, und verspricht nur, was der Host belegen kann. _Proof: review_
- **X-RECOVER-4 · MUST** Eingaben im Speicher erhalten, wenn das Speichern fehlschlägt, und den
  Speicherfehler getrennt melden. _Proof: unit_
- **X-RECOVER-5 · SHOULD** Diagnosedaten ohne Zugangsdaten in optionale Details legen.
- **X-RECOVER-6 · SHOULD** Einem Fehler eine stimmige Wiederherstellung geben, keine doppelten Zeilen und Toasts.
- **X-RECOVER-7 · MUST** Ein Timeout belegt kein Zurückrollen: Vor dem Wiederholen klären, ob ein ändernder Vorgang
  übernommen wurde, wo verfügbar über den Idempotenz- oder Deduplizierungsvertrag des Hosts.
  _Proof: unit_

Zum Beispiel: „Der Import wurde vor dem Speichern abgebrochen. Deine ausgewählten Dateien sind noch da. Import
wiederholen.“

| Bedingung                                 | Hilfreiche Reaktion                                                             | Vermeiden                                                                                |
| ----------------------------------------- | ------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| Kein lesbarer Dateiinhalt                 | Eine andere Datei wählen oder ohne sie fortfahren, falls unterstützt            | So tun, als bräuchte jede Aktion Dokumenttext                                            |
| Netzwerk unterbrochen                     | Eingaben und Teilergebnisse erhalten; wiederholen, sobald erreichbar            | Das Formular leeren oder die ganze Anwendung für unbenutzbar erklären                    |
| Berechtigung oder Konfiguration abgelehnt | Die Kategorie erklären; zum passenden Konto bzw. zu den Einstellungen verlinken | Automatische Wiederholungsschleifen bei fehlender Freigabe oder ungültiger Konfiguration |
| Von der Person abgebrochen                | Als abgebrochen markieren; wiederherstellbare Ergebnisse behalten               | Rote Fehlerdarstellung oder Neustart pausierter Arbeit                                   |
| Kontext geändert                          | Veraltete Ergebnisse kennzeichnen; gegen aktuelle Daten aktualisieren           | Ein altes Ergebnis stillschweigend auf ein neueres Dokument anwenden                     |

## 5. Abbrechen, Wiederholen und Abschluss sind verschiedene Ergebnisse

- **X-CANCEL-1 · MUST** Abbrechen und Absenden unabhängig voneinander erreichbar halten, wenn beides unterstützt wird,
  mit klaren zugänglichen Namen und stabilen Positionen. _Proof: browser_
- **X-CANCEL-2 · MUST** Eine Abbruchanfrage ist kein bestätigter Abbruch: Den ausstehenden Zustand bis zur Bestätigung
  zeigen, und wenn der Client nur aufhören kann zu warten, genau das sagen, statt zu behaupten, der Auftrag sei
  gestoppt. _Proof: unit_
- **X-CANCEL-3 · MUST** Ein Abbruch wird nicht als Fehler dargestellt. _Proof: browser_
- **X-CANCEL-4 · MUST** Wiederholen löst die Arbeit erneut aus, ohne stillschweigend den Umfang zu erweitern oder das
  Ziel zu wechseln; Wiederherstellen füllt nur bearbeitbare Eingaben wieder. _Proof: unit_
- **X-CANCEL-5 · MUST** Erfolgreiches Speichern oder Anwenden erst melden, wenn der Schreibvorgang bestätigt ist, und
  wiederherstellbare Teilergebnisse behalten. _Proof: unit_
- **X-CANCEL-6 · MUST** Rückgängig nur anbieten, wenn der Host den Vorgang tatsächlich umkehren kann, und nie
  versprechen, dass Abbrechen einen abgeschlossenen Schreibvorgang rückgängig macht. _Proof: review_

## 6. Prüfen, was ein Mensch beobachten kann

- **X-VERIFY-1 · SHOULD** Belege nach dem Defekt auswählen und dabei die Ebenen unten nutzen, statt für eine kleine
  Änderung jeden möglichen Test auszuführen.
- **X-VERIFY-2 · SHOULD** Offline- und Fehlerpfade einbeziehen, wenn die Aufgabe von externer Arbeit abhängt.
- **X-VERIFY-3 · SHOULD** Den getesteten Commit und alle verbleibenden externen Voraussetzungen angeben.

| Belegebene              | Relevante Regression                                                                                         |
| ----------------------- | ------------------------------------------------------------------------------------------------------------ |
| Unit/Zustand            | Abbruch, späte Antworten, Identität des Umfangs sowie Wiederholen gegenüber Wiederherstellen                 |
| Integration             | Entwurf übersteht einen Kontextwechsel hin und zurück; ein stimmiger Fehler; Tastaturweg im Overlay          |
| Echter Browser          | Berechnete Maße/Grundlinien/Überlauf, Zielboxen, Fokus, Hover im deaktivierten Zustand und IME               |
| Oberflächenübergreifend | Betroffene Formulare, Suche, Verlauf, Einstellungen, Import/Export, Vorschauen und Bestätigungen             |
| Varianten               | Relevante Themes, Breiten, Größenänderung, Tastatur/grobe Eingabe, Übersetzungen/RTL und reduzierte Bewegung |

Statische Prüfungen können weder die Wiederherstellung des Fokus noch die gewinnende Kaskade noch eine erhaltene
Leseposition belegen.
Mitwirkende an der Bibliothek nutzen [die Checkliste in CODING](https://github.com/chaxus/ran/blob/main/packages/ranui/docs/CODING.md#checklist-before-opening-a-pull-request);
nutzende Anwendungen verwenden die passenden Befehle des Hosts, nicht die Befehle aus einem ranui-Quellcode-Checkout.
