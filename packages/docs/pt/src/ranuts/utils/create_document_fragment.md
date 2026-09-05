# createDocumentFragment

Cria um `DocumentFragment` e acrescenta a ele vários elementos filhos.

## API

### createDocumentFragment

#### Retorna

| Argumento                       | Descrição                   | Tipo                            |
| ------------------------------- | --------------------------- | ------------------------------- |
| `DocumentFragment \| undefined` | O objeto `DocumentFragment` | `DocumentFragment \| undefined` |

#### Parâmetros

| Parâmetro | Descrição                         | Tipo        | Padrão      |
| --------- | --------------------------------- | ----------- | ----------- |
| `list`    | Array dos elementos a acrescentar | `Element[]` | Obrigatório |

## Exemplo

### Uso básico

```js
import { createDocumentFragment } from 'ranuts';

const div1 = document.createElement('div');
const div2 = document.createElement('div');
const fragment = createDocumentFragment([div1, div2]);

// Vai para o DOM de uma só vez
document.body.appendChild(fragment);
```

### Acrescentar elementos em lote

```js
import { createDocumentFragment } from 'ranuts';

const elements = Array.from({ length: 100 }, () => {
  const div = document.createElement('div');
  div.textContent = 'Item';
  return div;
});

const fragment = createDocumentFragment(elements);
document.getElementById('container').appendChild(fragment);
```

### Segurança no servidor

```js
import { createDocumentFragment } from 'ranuts';

// Em ambiente de servidor devolve undefined
const fragment = createDocumentFragment([element]);
console.log(fragment); // undefined (ambiente de servidor)
```

## Notas

1. **Melhor desempenho**: com um `DocumentFragment` evitam-se muitas operações no DOM, e tudo fica mais rápido.
2. **Seguro no servidor**: em ambientes de servidor (sem objeto `document`) devolve `undefined` e não lança erros.
3. **De uma só vez**: quando o fragmento vai para o DOM, seus filhos passam para o elemento de destino e o fragmento não é preservado.
4. **Quando usar**: é comum para acrescentar elementos em lote, reduzir refluxos e repinturas e ganhar velocidade.
