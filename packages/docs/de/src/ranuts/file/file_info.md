# QueryFileInfo

Fragt ausführliche Informationen zu einer Datei ab. Wird häufig genutzt, um eine Datei von einem Verzeichnis zu unterscheiden — das lässt sich an den zurückgegebenen Daten ablesen (`data.isDirectory()`).

## API

### Rückgabe

- Promise

| Parameter | Beschreibung                                       | Typ       | Beschreibung                          |
| --------- | -------------------------------------------------- | --------- | ------------------------------------- |
| success   | Ob die Prüfung geklappt hat                        | `boolean` | true bei Erfolg, false bei Fehlschlag |
| data      | Die Dateiinformationen, oder der Grund des Fehlers | `Stats`   |                                       |

### Optionen

| Parameter | Beschreibung                | Typ      | Standard  |
| --------- | --------------------------- | -------- | --------- |
| path      | Pfad der zu prüfenden Datei | `string` | undefined |

## Beispiel
