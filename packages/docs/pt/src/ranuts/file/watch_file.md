# WatchFile

Observa se um arquivo mudou.

## API

### Retorna

- Promise

| Parâmetro | Descrição          | Tipo      | Descrição                         |
| --------- | ------------------ | --------- | --------------------------------- |
| status    | Se o arquivo mudou | `boolean` | true se mudou, false se não mudou |

### Opções

| Parâmetro | Descrição                                                      | Tipo     | Padrão    |
| --------- | -------------------------------------------------------------- | -------- | --------- |
| path      | Caminho do arquivo a observar                                  | `string` | undefined |
| interval  | Intervalo com que as mudanças são observadas, em milissegundos | `number` | `20`      |
