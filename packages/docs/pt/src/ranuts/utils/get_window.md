# getWindow

Obtém o tamanho da janela visível, seja qual for o navegador.

## API

### getWindow

#### Retorna

| Argumento | Descrição | Tipo |
| ------------- | ------------------ | ------------- |
| `ClientRatio` | O objeto com o tamanho da janela | `ClientRatio` |

#### ClientRatio

| Propriedade | Descrição | Tipo |
| -------- | ---------------------- | -------- |
| `width` | Largura da janela (pixels) | `number` |
| `height` | Altura da janela (pixels) | `number` |

#### Parâmetros

Sem parâmetros

## Exemplo

### Uso básico

```js
import { getWindow } from 'ranuts';

const windowSize = getWindow();
console.log('Largura da janela:', windowSize.width);
console.log('Altura da janela:', windowSize.height);
```

### Layout responsivo

```js
import { getWindow } from 'ranuts';

function handleResize() {
  const { width, height } = getWindow();
  if (width < 768) {
    // Layout para celular
  } else {
    // Layout para desktop
  }
}

window.addEventListener('resize', handleResize);
```

### Segurança no servidor

```js
import { getWindow } from 'ranuts';

// Em ambiente de servidor não lança erro: devolve { width: 0, height: 0 }
const size = getWindow();
console.log(size); // { width: 0, height: 0 }
```

### Calcular a proporção

```js
import { getWindow } from 'ranuts';

const { width, height } = getWindow();
const aspectRatio = width / height;
console.log('Proporção:', aspectRatio);
```

## Notas

1. **Compatibilidade**: usa `window.innerWidth` e `window.innerHeight`, presentes em todos os navegadores modernos.

2. **Seguro no servidor**: em ambientes de servidor (sem objeto `window`) devolve `{ width: 0, height: 0 }` e não lança erros.

3. **Instantâneo**: devolve o tamanho no momento da chamada; se a janela mudar, é preciso chamar de novo.

4. **Quando usar**: é comum em layouts responsivos, em media queries e para acompanhar o tamanho da janela.
