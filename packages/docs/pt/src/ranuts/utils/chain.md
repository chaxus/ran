# Chain

Classe para mexer no DOM encadeando chamadas: criar elementos, pôr atributos, escutar eventos e afins.

## API

### Chain

#### Construtor

```typescript
new Chain(tagName: string, options?: ElementCreationOptions)
```

#### Métodos principais

| Método             | Descrição                                 | Valor devolvido |
| ------------------ | ----------------------------------------- | --------------- |
| `setAttribute`     | Põe um atributo no elemento               | `Chain`         |
| `removeAttribute`  | Tira um atributo do elemento              | `Chain`         |
| `append`           | Acrescenta um elemento filho              | `Chain`         |
| `remove`           | Tira um elemento filho                    | `Chain`         |
| `setTextContent`   | Define o conteúdo de texto                | `Chain`         |
| `setStyle`         | Define um estilo                          | `Chain`         |
| `addChild`         | Acrescenta um filho (também aceita array) | `Chain`         |
| `listen`           | Registra um ouvinte de eventos            | `Chain`         |
| `clearListener`    | Tira um ouvinte de eventos                | `Chain`         |
| `clearAllListener` | Tira todos os ouvintes                    | `Chain`         |

#### Propriedades

| Propriedade | Descrição         | Tipo          |
| ----------- | ----------------- | ------------- |
| `element`   | O elemento do DOM | `HTMLElement` |

## Exemplo

### Uso básico

```js
import { Chain } from 'ranuts';

const div = new Chain('div')
  .setAttribute('id', 'myDiv')
  .setAttribute('class', 'container')
  .setTextContent('Hello World')
  .setStyle('color', 'red');

document.body.appendChild(div.element);
```

### Encadeamento

```js
import { Chain } from 'ranuts';

const button = new Chain('button')
  .setAttribute('type', 'button')
  .setTextContent('Clique aqui')
  .setStyle('padding', '10px')
  .setStyle('background', 'blue')
  .listen('click', () => {
    console.log('Botão clicado');
  });

document.body.appendChild(button.element);
```

### Acrescentar elementos filhos

```js
import { Chain } from 'ranuts';

const container = new Chain('div')
  .addChild(new Chain('h1').setTextContent('Título'))
  .addChild(new Chain('p').setTextContent('Conteúdo'));

document.body.appendChild(container.element);
```

### Acrescentar vários filhos de uma vez

```js
import { Chain } from 'ranuts';

const list = new Chain('ul').addChild([
  new Chain('li').setTextContent('Item 1'),
  new Chain('li').setTextContent('Item 2'),
  new Chain('li').setTextContent('Item 3'),
]);

document.body.appendChild(list.element);
```

### Elementos SVG

```js
import { Chain } from 'ranuts';

const svg = new Chain('svg').setAttribute('width', '100').setAttribute('height', '100');

const circle = new Chain('circle').setAttribute('cx', '50').setAttribute('cy', '50').setAttribute('r', '40');

svg.addChild(circle);
```

## Notas

1. **Encadeamento**: todos os métodos devolvem a instância de `Chain`, então dá para encadear.
2. **Com SVG**: reconhece sozinho as tags SVG e as cria com o namespace correto.
3. **Gestão de eventos**: por dentro guarda o mapeamento dos ouvintes, o que facilita controlá-los e removê-los.
4. **Quando usar**: é comum para montar estruturas do DOM em tempo de execução e construir componentes de interface.
