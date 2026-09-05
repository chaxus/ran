# WriteFile

Escribe contenido en un archivo.

## API

### Devuelve

- Promise

| Parámetro | Descripción                                                                         | Tipo      | Descripción                        |
| --------- | ----------------------------------------------------------------------------------- | --------- | ---------------------------------- |
| success   | Si la escritura tuvo éxito                                                          | `boolean` | true si tuvo éxito, false si falló |
| data      | El motivo del fallo al escribir, o el contenido y la ruta del archivo si tuvo éxito | `any`     |                                    |

### Opciones

| Parámetro | Descripción                     | Tipo     | Por defecto |
| --------- | ------------------------------- | -------- | ----------- |
| path      | Ruta del archivo donde escribir | `string` | undefined   |
| content   | Contenido a escribir            | `string` | Obligatorio |
