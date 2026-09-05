# removeClassToElement

Tira um nome de classe CSS de um elemento do DOM.

## API

### removeClassToElement

#### Retorna

Sem valor de retorno (`void`)

#### Parâmetros

| Parâmetro     | Descrição              | Tipo      | Padrão      |
| ------------- | ---------------------- | --------- | ----------- |
| `element`     | Elemento do DOM        | `Element` | Obrigatório |
| `removeClass` | Nome da classe a tirar | `string`  | Obrigatório |

## Exemplo

### Uso básico

```js
import { removeClassToElement } from 'ranuts';

const element = document.getElementById('myElement');
removeClassToElement(element, 'active');
// a classe 'active' já saiu de element
```

### Remoção condicional

```js
import { removeClassToElement } from 'ranuts';

const element = document.querySelector('.button');
if (shouldRemove) {
  removeClassToElement(element, 'highlighted');
}
```

### Segurança no servidor

```js
import { removeClassToElement } from 'ranuts';

// Num ambiente de servidor não lança erro: falha em silêncio
removeClassToElement(element, 'class-name'); // No servidor: não faz nada
```

## Notas

1. **Checagem de existência**: só tira a classe se o elemento a tiver.
2. **Segurança no servidor**: em ambientes de servidor (não há objeto `document`) age em silêncio, sem lançar erros.
3. **Usa classList**: emprega a API moderna `classList.remove()`, mais segura do que mexer no `className` direto.
