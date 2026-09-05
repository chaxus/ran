# WatchFile

Vigila si un archivo ha cambiado.

## API

### Devuelve

- Promise

| Parámetro | Descripción               | Tipo      | Descripción                        |
| --------- | ------------------------- | --------- | ---------------------------------- |
| status    | Si el archivo ha cambiado | `boolean` | true si cambió, false si no cambió |

### Opciones

| Parámetro | Descripción                                                  | Tipo     | Por defecto |
| --------- | ------------------------------------------------------------ | -------- | ----------- |
| path      | Ruta del archivo a vigilar                                   | `string` | undefined   |
| interval  | Intervalo con el que se vigilan los cambios, en milisegundos | `number` | `20`        |
