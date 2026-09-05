# create

Função auxiliar para criar elementos do DOM, tanto HTML quanto SVG.

## API

### create

#### Retorna

| Argumento | Descrição | Tipo |
| ------------- | ------------------- | ------------- |
| `HTMLElement` | O elemento do DOM criado | `HTMLElement` |

#### Parâmetros

| Parâmetro | Descrição | Tipo | Padrão |
| --------- | --------------------------- | ------------------------ | -------- |
| `tagName` | Nome da tag | `string` | Obrigatório |
| `options` | Opções de criação (opcional) | `ElementCreationOptions` | Opcional |

## Exemplo

### Uso básico

```js
import { create } from 'ranuts';

const div = create('div');
div.textContent = 'Hello World';
document.body.appendChild(div);
```

### Criar um elemento SVG

```js
import { create } from 'ranuts';

const svg = create('svg');
svg.setAttribute('width', '100');
svg.setAttribute('height', '100');

const circle = create('circle');
circle.setAttribute('cx', '50');
circle.setAttribute('cy', '50');
circle.setAttribute('r', '40');
svg.appendChild(circle);
```

### Usar as opções de criação

```js
import { create } from 'ranuts';

// Criar um elemento personalizado
const customElement = create('my-custom-element', { is: 'my-element' });
```

## Notas

1. **Reconhecimento automático**: reconhece sozinho as tags SVG e as cria com o namespace correto.
2. **Elementos HTML**: elementos HTML comuns são criados com `document.createElement`.
3. **Elementos SVG**: elementos SVG são criados com `document.createElementNS`.
4. **Quando usar**: é comum quando é preciso criar elementos SVG, porque encurta o processo.
