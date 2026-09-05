# AppendFile

Hängt Daten an eine Datei an.

## API

### Rückgabe

- Promise

| Parameter | Beschreibung                                                                | Typ       | Beschreibung                          |
| --------- | --------------------------------------------------------------------------- | --------- | ------------------------------------- |
| success   | Ob das Anhängen geklappt hat                                                | `boolean` | true bei Erfolg, false bei Fehlschlag |
| data      | Der Grund für das fehlgeschlagene Anhängen, oder bei Erfolg der Dateiinhalt | `any`     |                                       |

### Optionen

| Parameter | Beschreibung                          | Typ      | Standard     |
| --------- | ------------------------------------- | -------- | ------------ |
| path      | Pfad der Datei, an die angehängt wird | `string` | undefined    |
| content   | Der anzuhängende Inhalt               | `string` | Erforderlich |

## Beispiel
