# filterObj

Filtra las propiedades de un objeto, quitando aquellas cuya clave aparezca en el array `list`, y devuelve un objeto nuevo. Se usa mucho para eliminar cadenas vacías y valores nulos.

## API

### Devuelve

| Argumento | Descripción           | Tipo     |
| --------- | --------------------- | -------- |
| `Object`  | El objeto ya filtrado | `Object` |

### Opciones

| Argumento | Descripción                   | Tipo     | Por defecto |
| --------- | ----------------------------- | -------- | ----------- |
| `obj`     | Objeto que se va a filtrar    | `object` | Obligatorio |
| `list`    | Claves que se quitan de `obj` | `array`  | Obligatorio |

## Ejemplo

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
