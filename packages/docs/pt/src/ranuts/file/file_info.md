# QueryFileInfo

Consulta informações detalhadas de um arquivo. É muito usada para distinguir um arquivo de um diretório, o que se descobre pelos dados devolvidos (`data.isDirectory()`).

## API

### Retorna

- Promise

| Parâmetro | Descrição                                   | Tipo      | Descrição                          |
| --------- | ------------------------------------------- | --------- | ---------------------------------- |
| success   | Se a verificação deu certo                  | `boolean` | true se deu certo, false se falhou |
| data      | Informações do arquivo, ou o motivo do erro | `Stats`   |                                    |

### Opções

| Parâmetro | Descrição                      | Tipo     | Padrão    |
| --------- | ------------------------------ | -------- | --------- |
| path      | Caminho do arquivo a verificar | `string` | undefined |

## Exemplo
