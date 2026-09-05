# WriteFile

Schreibt Inhalt in eine Datei.

## API

### Rückgabe

- Promise

| Parameter | Beschreibung                                                                      | Typ       | Beschreibung                          |
| --------- | --------------------------------------------------------------------------------- | --------- | ------------------------------------- |
| success   | Ob das Schreiben geklappt hat                                                     | `boolean` | true bei Erfolg, false bei Fehlschlag |
| data      | Der Grund für das fehlgeschlagene Schreiben, oder bei Erfolg Dateiinhalt und Pfad | `any`     |                                       |

### Optionen

| Parameter | Beschreibung                            | Typ      | Standard     |
| --------- | --------------------------------------- | -------- | ------------ |
| path      | Pfad der Datei, in die geschrieben wird | `string` | undefined    |
| content   | Der zu schreibende Inhalt               | `string` | Erforderlich |
