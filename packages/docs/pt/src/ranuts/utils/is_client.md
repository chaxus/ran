# isClient

Verifica se o ambiente atual é de cliente (navegador).

## API

### isClient

#### Retorna

| Argumento | Descrição                   | Tipo      |
| --------- | --------------------------- | --------- |
| `boolean` | Se é um ambiente de cliente | `boolean` |

#### Parâmetros

Sem parâmetros

## Exemplo

### Uso básico

```js
import { isClient } from 'ranuts';

if (isClient) {
  console.log('Agora num ambiente de navegador');
  // Dá para usar APIs do navegador como window e document
  window.localStorage.setItem('key', 'value');
} else {
  console.log('Agora num ambiente de servidor');
}
```

### Execução condicional

```js
import { isClient } from 'ranuts';

// Executar só no cliente
if (isClient) {
  document.addEventListener('click', handleClick);
}
```

### Segurança com renderização no servidor

```js
import { isClient } from 'ranuts';

function getWindowSize() {
  if (isClient) {
    return {
      width: window.innerWidth,
      height: window.innerHeight,
    };
  }
  return { width: 0, height: 0 };
}
```

## Notas

1. **Como detecta**: confere `typeof window !== 'undefined'`.
2. **É uma constante**: `isClient` é uma constante, não uma função; ao usar não precisa de parênteses.
3. **Quando usar**: comum para separar cliente de servidor e evitar erros ao tocar em APIs do navegador no servidor.
