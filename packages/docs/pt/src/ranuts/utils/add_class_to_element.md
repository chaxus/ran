# addClassToElement

Acrescenta um nome de classe CSS a um elemento do DOM.

## API

### addClassToElement

#### Retorna

Sem valor de retorno (`void`)

#### Parâmetros

| Parâmetro  | Descrição                    | Tipo      | Padrão      |
| ---------- | ---------------------------- | --------- | ----------- |
| `element`  | Elemento do DOM              | `Element` | Obrigatório |
| `addClass` | Nome da classe a acrescentar | `string`  | Obrigatório |

## Exemplo

### Uso básico

```js
import { addClassToElement } from 'ranuts';

const element = document.getElementById('myElement');
addClassToElement(element, 'active');
// agora element tem a classe 'active'
```

### Evitar acrescentar duas vezes

```js
import { addClassToElement } from 'ranuts';

const element = document.querySelector('.button');
addClassToElement(element, 'highlighted');
addClassToElement(element, 'highlighted'); // Não acrescenta em duplicidade
```

### Segurança no servidor

```js
import { addClassToElement } from 'ranuts';

// Num ambiente de servidor não lança erro: falha em silêncio
addClassToElement(element, 'class-name'); // No servidor: não faz nada
```

## Notas

1. **Checagem de duplicidade**: se o elemento já tem a classe, ela não é acrescentada de novo.
2. **Segurança no servidor**: em ambientes de servidor (não há objeto `document`) age em silêncio, sem lançar erros.
3. **Usa classList**: emprega a API moderna `classList.add()`, mais segura do que mexer no `className` direto.
