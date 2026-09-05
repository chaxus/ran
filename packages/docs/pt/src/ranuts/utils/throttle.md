# throttle

Throttle: quando uma função é disparada muitas vezes seguidas, ela roda no máximo uma vez por intervalo. A primeira chamada roda na hora (borda inicial) e a última da janela é repetida quando a janela fecha (borda final), de modo que o estado final nunca se perde.

Use para rolagem, movimento do ponteiro e arrasto: tudo que precisa de **resposta contínua**. Se só o valor final importa (busca enquanto se digita, salvamento automático), use [debounce](./debounce).

## API

### throttle(fn, delay?)

#### Parâmetros

| Parâmetro | Descrição                    | Tipo       | Padrão      |
| --------- | ---------------------------- | ---------- | ----------- |
| `fn`      | Função que recebe o throttle | `Function` | Obrigatório |
| `delay`   | Intervalo mínimo (ms)        | `number`   | `300`       |

#### Retorna

Uma função com throttle que preserva o `this` e os argumentos do ponto de chamada, além de:

| Membro      | Descrição                         | Tipo            |
| ----------- | --------------------------------- | --------------- |
| `cancel()`  | Descarta a chamada final pendente | `() => void`    |
| `pending()` | Se há uma chamada final esperando | `() => boolean` |

## Exemplo

```js
import { throttle } from 'ranuts';

const onScroll = throttle(() => update(window.scrollY), 100);
window.addEventListener('scroll', onScroll);

// Ao desmontar: tire o ouvinte *e* descarte a chamada final pendente
window.removeEventListener('scroll', onScroll);
onScroll.cancel();
```

## Notas

1. **Borda inicial e final**: roda na hora e mais uma vez no fim da janela, com os argumentos mais recentes.
2. **O `this` e os argumentos** vêm intactos do ponto de chamada.
3. **Roda em qualquer lugar**: usa o `setTimeout` puro, então funciona no Node, em Web Workers e no servidor.
4. **Cada chamada a `throttle()` tem a própria janela**; duas funções com throttle nunca atrapalham uma à outra.
5. **Chame sempre `cancel()` ao desmontar**; senão a chamada final dispara sobre um contexto já destruído.

::: warning Removido na 0.3
`generateThrottle()` não existe mais. Ele devolvia uma fábrica cujas funções **compartilhavam um único temporizador e um único carimbo de tempo**, então duas funções com throttle sem relação entre si anulavam uma à outra. Troque `const g = generateThrottle(); const f = g(fn, delay)` por `throttle(fn, delay)`.
:::
