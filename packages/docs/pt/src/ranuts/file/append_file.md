# AppendFile

Acrescenta dados ao fim de um arquivo.

## API

### Retorna

- Promise

| Parâmetro | Descrição                                                                     | Tipo      | Descrição                          |
| --------- | ----------------------------------------------------------------------------- | --------- | ---------------------------------- |
| success   | Se o acréscimo deu certo                                                      | `boolean` | true se deu certo, false se falhou |
| data      | O motivo da falha ao acrescentar, ou o conteúdo do arquivo em caso de sucesso | `any`     |                                    |

### Opções

| Parâmetro | Descrição                              | Tipo     | Padrão      |
| --------- | -------------------------------------- | -------- | ----------- |
| path      | Caminho do arquivo ao qual acrescentar | `string` | undefined   |
| content   | Conteúdo a acrescentar                 | `string` | Obrigatório |

## Exemplo
