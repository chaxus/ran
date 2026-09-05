# WatchFile

Beobachtet, ob sich eine Datei geändert hat.

## API

### Rückgabe

- Promise

| Parameter | Beschreibung                   | Typ       | Beschreibung                   |
| --------- | ------------------------------ | --------- | ------------------------------ |
| status    | Ob sich die Datei geändert hat | `boolean` | true bei Änderung, sonst false |

### Optionen

| Parameter | Beschreibung                                                  | Typ      | Standard  |
| --------- | ------------------------------------------------------------- | -------- | --------- |
| path      | Pfad der zu beobachtenden Datei                               | `string` | undefined |
| interval  | Abstand, in dem auf Änderungen geprüft wird, in Millisekunden | `number` | `20`      |
