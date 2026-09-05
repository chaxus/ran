# filterObj

Filtra as propriedades de um objeto, tirando aquelas cuja chave apareça no array `list`, e devolve um objeto novo. Muito usada para remover strings vazias e valores nulos.

## API

### Retorna

| Argumento | Descrição            | Tipo     |
| --------- | -------------------- | -------- |
| `Object`  | O objeto já filtrado | `Object` |

### Opções

| Argumento | Descrição                 | Tipo     | Padrão      |
| --------- | ------------------------- | -------- | ----------- |
| `obj`     | Objeto a filtrar          | `object` | Obrigatório |
| `list`    | Chaves a remover de `obj` | `array`  | Obrigatório |

## Exemplo

```js
import { filterObj } from 'ranuts';

const obj = {
  name: 'chaxus',
  age: 10,
  address: 'spark',
};

const result = filterObj(obj, ['name', 'address']);

console.log(result);

// { age:10 }
```
