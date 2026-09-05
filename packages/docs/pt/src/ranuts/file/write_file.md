# WriteFile

Escreve conteúdo num arquivo.

## API

### Retorna

- Promise

| Parâmetro | Descrição                                                                              | Tipo      | Descrição                          |
| --------- | -------------------------------------------------------------------------------------- | --------- | ---------------------------------- |
| success   | Se a escrita deu certo                                                                 | `boolean` | true se deu certo, false se falhou |
| data      | O motivo da falha ao escrever, ou o conteúdo e o caminho do arquivo em caso de sucesso | `any`     |                                    |

### Opções

| Parâmetro | Descrição                        | Tipo     | Padrão      |
| --------- | -------------------------------- | -------- | ----------- |
| path      | Caminho do arquivo onde escrever | `string` | undefined   |
| content   | Conteúdo a escrever              | `string` | Obrigatório |
