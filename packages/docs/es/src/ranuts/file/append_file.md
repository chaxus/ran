# AppendFile

Añade datos al final de un archivo.

## API

### Devuelve

- Promise

| Parámetro | Descripción                                                             | Tipo      | Descripción                        |
| --------- | ----------------------------------------------------------------------- | --------- | ---------------------------------- |
| success   | Si el añadido tuvo éxito                                                | `boolean` | true si tuvo éxito, false si falló |
| data      | El motivo del fallo al añadir, o el contenido del archivo si tuvo éxito | `any`     |                                    |

### Opciones

| Parámetro | Descripción                    | Tipo     | Por defecto |
| --------- | ------------------------------ | -------- | ----------- |
| path      | Ruta del archivo al que añadir | `string` | undefined   |
| content   | Contenido a añadir             | `string` | Obligatorio |

## Ejemplo
