# getPixelRatio

Obtém a razão de resolução do contexto de um canvas, para lidar com telas de alta densidade.

## API

### getPixelRatio

#### Retorna

| Argumento | Descrição         | Tipo     |
| --------- | ----------------- | -------- |
| `number`  | A razão de pixels | `number` |

#### Parâmetros

| Parâmetro | Descrição                        | Tipo                       | Padrão      |
| --------- | -------------------------------- | -------------------------- | ----------- |
| `context` | Contexto de desenho 2D do canvas | `CanvasRenderingContext2D` | Obrigatório |

## Exemplo

### Uso básico

```js
import { getPixelRatio } from 'ranuts';

const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');
const ratio = getPixelRatio(ctx);
console.log('Razão de pixels:', ratio);
```

### Adaptar-se a telas de alta densidade

```js
import { getPixelRatio } from 'ranuts';

const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');
const ratio = getPixelRatio(ctx);

// Ajustar o tamanho do canvas conforme a razão
canvas.width = canvas.clientWidth * ratio;
canvas.height = canvas.clientHeight * ratio;

// Escalar o contexto para preservar o tamanho do desenho
ctx.scale(ratio, ratio);
```

### Desenhar com nitidez

```js
import { getPixelRatio } from 'ranuts';

function drawHighDPI(canvas) {
  const ctx = canvas.getContext('2d');
  const ratio = getPixelRatio(ctx);

  // Definir o tamanho real
  canvas.width = canvas.clientWidth * ratio;
  canvas.height = canvas.clientHeight * ratio;

  // Escalar o contexto
  ctx.scale(ratio, ratio);

  // Desenhar o conteúdo (em pixels lógicos)
  ctx.fillRect(10, 10, 100, 100);
}
```

## Notas

1. **Compatibilidade**: contempla a propriedade `backingStorePixelRatio` dos diferentes navegadores.
2. **Alta densidade**: cuida sozinho das telas de alta densidade (Retina), para o desenho sair nítido.
3. **Como calcula**: devolve `devicePixelRatio / backingStorePixelRatio`.
4. **Quando usar**: é comum ao desenhar em canvas, em bibliotecas de gráficos e no desenvolvimento de jogos, onde a nitidez conta.
