# getFrame

Calcula a taxa de quadros por milissegundo; para tê-la por segundo, multiplique por 1000.

## API

### getFrame

#### Retorna

| Argumento         | Descrição                                                   | Tipo      |
| ----------------- | ----------------------------------------------------------- | --------- |
| `Promise<number>` | Promessa resolvida com a taxa de quadros (por milissegundo) | `Promise` |

#### Parâmetros

| Parâmetro | Descrição                    | Tipo     | Padrão |
| --------- | ---------------------------- | -------- | ------ |
| `n`       | Número de quadros amostrados | `number` | `10`   |

## Exemplo

### Uso básico

```js
import { getFrame } from 'ranuts';

const fps = await getFrame();
console.log('Quadros por ms:', fps);
console.log('Quadros por segundo:', fps * 1000);
```

### Mudar o número de amostras

```js
import { getFrame } from 'ranuts';

// Amostrar 20 quadros para tirar a média
const fps = await getFrame(20);
console.log('FPS:', fps * 1000);
```

### Medição de desempenho

```js
import { getFrame } from 'ranuts';

async function monitorPerformance() {
  const fps = await getFrame(30);
  const fpsPerSecond = fps * 1000;

  if (fpsPerSecond < 30) {
    console.warn('Taxa de quadros baixa:', fpsPerSecond);
  } else {
    console.log('Taxa de quadros normal:', fpsPerSecond);
  }
}
```

### Conferir o desempenho de uma animação

```js
import { getFrame } from 'ranuts';

async function checkAnimationPerformance() {
  const fps = await getFrame(60);
  const fpsPerSecond = fps * 1000;
  console.log(`Quadros da animação: ${fpsPerSecond.toFixed(2)} FPS`);
}
```

## Notas

1. **Unidade**: devolve quadros por milissegundo; multiplique por 1000 para tê-los por segundo (FPS).
2. **Como amostra**: usa `requestAnimationFrame` e tira a média do intervalo de vários quadros.
3. **É assíncrono**: devolve uma promessa, então use `await` ou `.then()`.
4. **Quando usar**: é comum para acompanhar o desempenho, conferir animações e medir os quadros de um jogo.
