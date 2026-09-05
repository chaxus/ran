# getMime

Você passa a extensão de um arquivo e recebe de volta o `mime type` dele.

## API

### Retorna

| Argumento | Descrição             | Tipo     |
| --------- | --------------------- | -------- |
| `string`  | Devolve o `mime type` | `string` |

### Opções

| Parâmetro | Descrição                      | Tipo     | Padrão      |
| --------- | ------------------------------ | -------- | ----------- |
| ext       | Formato da extensão do arquivo | `string` | Obrigatório |

## Exemplo

```js
import { getMime } from 'ranuts';

const result = getMime('.pptx');
console.log(result);
// 'application/vnd.openxmlformats-officedocument.presentationml.presentation'

const res = getMime('.txt');
console.log(res);
// 'text/plain'
```
