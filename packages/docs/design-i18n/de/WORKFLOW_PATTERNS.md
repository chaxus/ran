<!-- source: a963396e1b2e40d4006461f2894dc37ba86beeb5 -->

# Optionale Workflow-Muster

Diese Rezepte gelten **nur, wenn die Aufgabe davon profitiert**. Ein gewöhnliches Formular, eine Suchseite oder ein
Editor braucht standardmäßig keine Warteschlangen, Kontoverbindungen oder Versionsverläufe.
[DESIGN.md](./DESIGN.md) regelt das Erscheinungsbild; [INTERACTION.md](./INTERACTION.md) regelt allgemeines Verhalten.
Die Technik gehört dem Host; [ranui engineering](https://github.com/chaxus/ran/blob/main/packages/ranui/docs/CODING.md)
ist ein optionaler Bibliotheksadapter. Das sind Entscheidungen der Host-Anwendung,
keine zusätzlichen Komponenten-APIs, Speichergarantien oder mitgelieferten Dienste.

Jede Regel trägt eine ID und eine Stufe. **MUST** ist ein Defekt, wenn sie verletzt wird, und nennt ihren Nachweis;
**SHOULD** ist der Standard, und wer abweicht, begründet es für den konkreten Fall; **MAY** ist optional.
Der [Regelindex](./RULES.md) führt jede abgestufte Regel mit ihrem Nachweis auf.

- **W-RECIPE-1 · SHOULD** Für jedes gewählte Rezept klären, was die Anwendung unterstützt, bevor Steuerelemente
  gewählt werden.
- **W-RECIPE-2 · SHOULD** Den Zustand von Aufträgen, Konfiguration, gewählten Quellen und Revisionen bei ihren
  vorhandenen Eigentümern belassen. Ansichten lesen diesen Zustand und lösen Befehle aus, statt in jedem Panel
  Dienst-Clients und Anfrage-Flags zu duplizieren.

## 1. Stapelarbeit und Warteschlangen

**Einsetzen, wenn:** es hilft, einen weiteren Import, Upload oder Export vorzubereiten, während Arbeit läuft.
**Host-Vertrag:** Auslösen, Vorbereitung, Nebenläufigkeit/Vorrang, Bestätigung des Abbruchs, teilweise
Schreibvorgänge, Vermeidung von Duplikaten und Speicherung.

| Zustand                 | Hauptaktion                             | Zu klärender Vertrag                                                        |
| ----------------------- | --------------------------------------- | --------------------------------------------------------------------------- |
| Bereit                  | Dateien hochladen / Bericht exportieren | Umfang, Ziel und Schutz vor doppeltem Absenden                              |
| Läuft                   | Abbrechen, falls unterstützt            | Was stoppt, was bleibt und ob ein Schreibvorgang übernommen wurde           |
| Läuft, mit neuer Arbeit | In die Warteschlange, falls unterstützt | Der aktive Auftrag läuft weiter; neue Eingaben bleiben erhalten (W-QUEUE-2) |
| Warteschlange pausiert  | Warteschlange fortsetzen                | Bearbeiten eines wartenden Elements löst es weder aus noch setzt es fort    |
| Fehlgeschlagen          | Wiederholen / Eingaben wiederherstellen | Die getrennten Ergebnisse aus INTERACTION §5 verwenden                      |

- **W-QUEUE-1 · SHOULD** Den Vertrag für jeden Zustand in der Warteschlangentabelle oben klären.
- **W-QUEUE-2 · MUST** Neue Arbeit ersetzt oder bricht den aktiven Auftrag nie stillschweigend ab. Ohne
  Warteschlangenunterstützung die neue Eingabe behalten und die Einschränkung erklären. _Proof: unit_
- **W-QUEUE-3 · MUST** Das Bearbeiten eines wartenden Elements in einer pausierten Warteschlange löst es weder aus
  noch setzt es die Warteschlange fort. _Proof: unit_
- **W-QUEUE-4 · SHOULD** Wartende Arbeit in einer Zeile zusammenfassen, etwa „2 in Warteschlange“ oder
  „Pausiert · 2 in Warteschlange“.
- **W-QUEUE-5 · SHOULD** Details der Warteschlange einklappen, wenn sie nicht gebraucht werden; in Zeilen aufklappen
  statt in verschachtelte Karten.
- **W-QUEUE-6 · MUST** Jede Zeile hat ein erkennbares Element und bietet nur unterstützte Aktionen an: Bearbeiten,
  Entfernen oder Jetzt ausführen. _Proof: browser_
- **W-QUEUE-7 · SHOULD** Festlegen, ob Jetzt ausführen wartet, vorgezogen wird oder parallel läuft.
- **W-QUEUE-8 · SHOULD** Die Vorbereitung innerhalb der Zeile darstellen, statt ein großes Panel voller deaktivierter
  Befehle hinzuzufügen.
- **W-QUEUE-9 · MUST** Das Bearbeiten der Warteschlange erhält den aktuellen Entwurf, und ein Abbruch der Bearbeitung
  stellt ihn wieder her. _Proof: unit_
- **W-QUEUE-10 · MUST** Eine Wiederverbindung löst wartende Arbeit nicht automatisch aus, es sei denn, die Person hat
  diese Richtlinie gewählt. _Proof: unit_
- **W-QUEUE-11 · SHOULD** Beim Entfernen einer Zeile, beim Einklappen der Warteschlange oder beim Stoppen von Arbeit
  die [allgemeinen Regeln zu Fokus und Abbruch](./INTERACTION.md) anwenden.

## 2. Fähigkeitsbewusste Einstellungen und Offline-Arbeit

**Einsetzen, wenn:** eine Aufgabe verschiedene Anbieter, Modi, Geräte oder netzabhängige Fähigkeiten anbietet.
**Host-Vertrag:** Speicherung der Konfiguration, eine echte Prüfoperation, Erreichbarkeit und lokale
Laufzeitabhängigkeiten.

- **W-SETTINGS-1 · MUST** Konfiguration speichern und Verfügbarkeit prüfen sind getrennte Aktionen mit getrennten
  Ergebnissen, und jede zeigt, was sie erreicht hat. _Proof: unit, browser_
- **W-SETTINGS-2 · SHOULD** Steuerelemente aus Fähigkeit und Zustand ableiten, nicht aus einem einzigen
  `connected`-Boolean.

Ein entferntes Speicherkonto, ein Datenbankdienst oder ein lokaler Konverter kann konfiguriert sein, ohne gerade
nutzbar zu sein.

| Zustand                        | Was die Person versteht                                                          |
| ------------------------------ | -------------------------------------------------------------------------------- |
| Nicht konfiguriert             | Eine nötige Auswahl oder ein Zugangsdatum fehlt                                  |
| Konfiguriert, ungeprüft        | Die Einstellungen sind gespeichert; die Verfügbarkeit ist nicht belegt           |
| Geprüft                        | Eine echte Prüfung war für diese Konfiguration erfolgreich; Zeitpunkt festhalten |
| Autorisierung nötig/abgelaufen | Das Konto neu verbinden, ohne gespeicherte Arbeit zu verwerfen                   |
| Dienst nicht erreichbar        | Eine gespeicherte Konfiguration belegt keine aktuelle Erreichbarkeit             |
| Gerät offline                  | Netzwerkvorgänge sind nicht verfügbar; verfügbare lokale Arbeit kann weitergehen |

- **W-SETTINGS-3 · SHOULD** Jeden Zustand aus der Einstellungstabelle oben für die Person unterscheidbar machen.
- **W-SETTINGS-4 · MUST** Das Neuverbinden eines Kontos, dessen Autorisierung nötig oder abgelaufen ist, behält
  gespeicherte Arbeit. _Proof: unit_
- **W-SETTINGS-5 · MUST** Die Prüfung ungültig machen, wenn sich relevante Einstellungen zu Endpunkt, Konto oder
  Zugangsdaten ändern. _Proof: unit_
- **W-SETTINGS-6 · SHOULD** Online-/Offline-Events des Browsers als Hinweise behandeln, nicht als Beleg, dass ein
  bestimmter Endpunkt funktioniert.
- **W-SETTINGS-7 · SHOULD** Einstellungen für den gewählten Weg zeigen. Ein lokaler Konvertierungsweg braucht
  vielleicht Steuerelemente für Cache, Download oder Gerät; ein entfernter Weg vielleicht solche für Endpunkt oder
  Konto.
- **W-SETTINGS-8 · MUST** Irrelevante Felder **und ihre veralteten Statusmeldungen** ausblenden. _Proof: browser_
- **W-SETTINGS-9 · SHOULD** Kopfzeilen von Einstellungen, Feldgruppen, Kontozeilen sowie Nicht-verfügbar- und
  Leerzustände behalten die benannten Inhalts- und Navigationsachsen aus
  [DESIGNs Ausrichtungsvertrag](./DESIGN.md#alignment-is-structure-not-polish).
- **W-SETTINGS-10 · SHOULD** Einen Titel- oder Menübefehl eng um seinen Inhalt halten; eine eigene Spur nimmt den
  Füllraum der Kopfzeile auf.
- **W-SETTINGS-11 · SHOULD** Innenabstände verschachtelter Panels und Steuerelemente bis zu den sichtbaren Labels
  zusammenzählen, bevor Bereiche als ausgerichtet gelten.
- **W-SETTINGS-12 · MUST** Ein Moduswechsel erhält die Konfiguration der anderen Modi. _Proof: unit_
- **W-SETTINGS-13 · SHOULD** Den Weg zurück zu einem anderen Modus auffindbar halten.
- **W-SETTINGS-14 · SHOULD** Das Ziel der Daten erklären, bevor sie weitergegeben werden.
- **W-SETTINGS-15 · MUST** Ein konfigurierter API-Endpunkt wird nicht als autorisiertes Konto dargestellt.
  _Proof: review_
- **W-SETTINGS-16 · MUST** Offline gespeicherte Inhalte und Entwürfe behalten, wenn ihre Daten und ihre Umsetzung
  verfügbar sind. _Proof: unit, browser_
- **W-SETTINGS-17 · SHOULD** Offline Vorschauen, Bearbeitung und Exporte verfügbar halten, wenn ihre Daten und ihre
  Umsetzung verfügbar sind.
- **W-SETTINGS-18 · SHOULD** Offline netzabhängige Entdeckungs- oder Werbeelemente ausblenden, die keinen nützlichen
  Weg bieten; vorhandene verbundene Objekte mit einem verständlichen Nicht-verfügbar-Zustand behalten.
- **W-SETTINGS-19 · SHOULD** Eine Ressource im Cache nicht als Beleg dafür behandeln, dass alle
  Laufzeitabhängigkeiten vorhanden sind.
- **W-SETTINGS-20 · SHOULD** Nach der Wiederverbindung einen bewussten Punkt zum Weitermachen anbieten.

## 3. Kontoverbindungen und externe Quellen

**Einsetzen, wenn:** Arbeit Daten außerhalb ihres aktuellen Objekts liest oder schreibt, ob lokal oder entfernt.
**Host-Vertrag:** Autorisierungsumfänge, Identität, Zugriffsprüfungen, Widerruf, Zugangsdaten, Herkunft und
Aufbewahrung importierter Kopien. Eine Endpunktadresse belegt keinen Kontozugriff.

Darstellungs-Grundelemente liefern kein OAuth-Deployment, keinen Zugangsdaten-Tresor, kein Connector-Backend und
keine Speichergarantien. Ein polierter Verbindungsbildschirm kann den Autorisierungsvertrag des Hosts nicht ersetzen.

- **W-ACCOUNT-1 · SHOULD** Kontoautorisierung, Zugriff auf eine gewählte Quelle und die Nutzung durch einen
  bestimmten Vorgang unterscheiden.
- **W-ACCOUNT-2 · SHOULD** Nur nötige Berechtigungen anfordern.
- **W-ACCOUNT-3 · SHOULD** Lese- und Schreibzugriffe sowie das Ziel vor Autorisierung oder Weitergabe erklären.
- **W-ACCOUNT-4 · MUST** Kontoidentität, Neuverbinden und Widerrufen/Trennen sind über die Verbindungsoberfläche
  erreichbar. _Proof: browser_
- **W-ACCOUNT-5 · MUST** Trennen beendet künftigen Zugriff. _Proof: unit_
- **W-ACCOUNT-6 · SHOULD** Getrennt erklären, was beim Trennen mit importierten Kopien geschieht.
- **W-ACCOUNT-7 · MUST** Zugangsdaten aus URLs, Logs und Vorschauen heraushalten. _Proof: review_
- **W-ACCOUNT-8 · SHOULD** Für gewählte Quellen Herkunft und Aktualität zeigen, ob lokale Datei, Datenbankeintrag oder
  Cloud-Dokument.
- **W-ACCOUNT-9 · MUST** Das Entfernen einer Quelle wirkt sich auf spätere Arbeit aus, nicht auf historische Belege.
  _Proof: unit_
- **W-ACCOUNT-10 · MUST** Berechtigungsfehler, veraltete Daten und offline zwischengespeicherte Kopien haben
  verschiedene Zustände. _Proof: unit_
- **W-ACCOUNT-11 · MUST** Importierte Inhalte als nicht vertrauenswürdige Daten behandeln, nicht als Erlaubnis,
  Befehle auszuführen. _Proof: review_
- **W-ACCOUNT-12 · MUST** Schreibvorgänge und ihre Ziele ausdrücklich machen, bevor sie geschehen.
  _Proof: browser_
- **W-ACCOUNT-13 · SHOULD** Den Prüfschritt vor einem Schreibvorgang an dessen Auswirkung anpassen.

## 4. Ergebnisse, Vorschauen und Revisionen

**Einsetzen, wenn:** ein Export, ein umgewandeltes Dokument oder ein Entwurf eine Identität und ein Ziel hat, die über
eine flüchtige Statusmeldung hinausgehen.
**Host-Vertrag:** Identität von Ergebnis/Revision, Quellversion, Zielumfang, Bestätigung der Übernahme,
Konfliktbehandlung und gegebenenfalls umkehrbarer Verlauf.

- **W-REVISION-1 · SHOULD** Für substanzielle Inhalte eine passende Vorschau oder einen Editor bevorzugen.
- **W-REVISION-2 · MUST** Vergleichen, Anwenden oder Rückgängig nur anbieten, wenn der Host es unterstützt.
  _Proof: review_
- **W-REVISION-3 · SHOULD** Das Ergebnis zusammenfassen und, wo relevant, seine Revision, Quelle und sein Ziel
  kennzeichnen.
- **W-REVISION-4 · SHOULD** Unterstützte Aktionen zum Kopieren, Exportieren, Vergleichen oder Anwenden neben dem
  jeweiligen Ergebnis halten.
- **W-REVISION-5 · MUST** Vorschau und Anwenden trennen und vor der Änderung Ziel und Umfang benennen.
  _Proof: browser_
- **W-REVISION-6 · MUST** Haben sich die Quelldaten geändert, vor dem Anwenden vergleichen/rebasen oder neu erzeugen;
  neuere Änderungen werden nie stillschweigend überschrieben. _Proof: unit_
- **W-REVISION-7 · SHOULD** Gespeicherten bzw. angewendeten Zustand und wiederherstellbare Ergebnisse gemäß
  [dem Interaktionsstandard](./INTERACTION.md) bestätigen.

## Ein Rezept anwenden

- **W-APPLY-1 · MUST** Nur die Zustände und Aktionen behalten, die der Host einhalten kann. _Proof: review_
- **W-APPLY-2 · SHOULD** Ein polierter Bildschirm kann einen fehlenden Dienstvertrag nicht ersetzen; diese
  Voraussetzung klar benennen.

Die wichtigsten Übergänge tragen bereits MUST-Regeln mit Unit-Nachweis: Pausierte Arbeit bleibt pausiert (W-QUEUE-3),
eine geänderte Konfiguration macht die Prüfung ungültig (W-SETTINGS-5), das Entfernen einer Quelle betrifft nur
künftige Arbeit (W-ACCOUNT-9), und veraltete Revisionen können neue Änderungen nicht überschreiben (W-REVISION-6).
Ihre Tests decken, wo relevant, unterbrochene und Offline-Arbeit ab.
