# QueryFileInfo

Consulta información detallada de un archivo. Se usa a menudo para distinguir un archivo de un directorio, cosa que se deduce de los datos devueltos (`data.isDirectory()`).

## API

### Devuelve

- Promise

| Parámetro | Descripción                                    | Tipo      | Descripción                        |
| --------- | ---------------------------------------------- | --------- | ---------------------------------- |
| success   | Si la comprobación tuvo éxito                  | `boolean` | true si tuvo éxito, false si falló |
| data      | Información del archivo, o el motivo del error | `Stats`   |                                    |

### Opciones

| Parámetro | Descripción                  | Tipo     | Por defecto |
| --------- | ---------------------------- | -------- | ----------- |
| path      | Ruta del archivo a comprobar | `string` | undefined   |

## Ejemplo
