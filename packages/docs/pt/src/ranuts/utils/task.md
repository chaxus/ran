# Medir o tempo de execução

Às vezes é preciso medir quanto uma função demora para analisar o desempenho, e é para isso que existem `startTask` e `taskEnd`. Três outras formas de medir o tempo também são apresentadas:

1. `new Date().getTime()`,
2. `console.time()` , `console.timeEnd()`,
3. `performance.now()`

## I. `startTask` e `taskEnd`

### 1. startTask

Chame antes de a tarefa começar.

#### Retorna

| Parâmetro | Descrição               | Tipo            |
| --------- | ----------------------- | --------------- |
| taskId    | Identificador da tarefa | `unique symbol` |

### 2. taskEnd

Chame quando a tarefa terminar; precisa do identificador que o `startTask` devolveu.

#### Opções

| Parâmetro | Descrição               | Tipo            | Padrão      |
| --------- | ----------------------- | --------------- | ----------- |
| taskId    | Identificador da tarefa | `unique symbol` | Obrigatório |

#### Retorna

| Parâmetro | Descrição               | Tipo     |
| --------- | ----------------------- | -------- |
| `time`    | Quanto a tarefa demorou | `number` |

### 3. Exemplo de uso

```js
const taskId = startTask();

// fazer alguma coisa

const time = taskEnd(taskId);

console.log('A tarefa demorou:', time);
```

## II. new Date().getTime()

`new Date().getTime()` devolve um número: os milissegundos decorridos desde 1º de janeiro de 1970, 00:00:00 UTC (tempo universal coordenado), até o instante que o objeto de data representa. Usá-lo para medir quanto o JS demora tem dois problemas:

1. Em alguns casos, a precisão de milissegundo não basta.
2. O instante que o `new Date()` interpreta pode não ser o mesmo em navegadores ou dispositivos diferentes. [Documentação da MDN](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Global_Objects/Date)
   > Por causa das diferenças e incoerências entre navegadores, recomenda-se fortemente não usar o construtor Date para interpretar strings de data (nem Date.parse, que é equivalente). Só há suporte convencional para datas no formato RFC 2822. Quanto ao ISO 8601, as strings que trazem apenas a data (por exemplo, «1970-01-01») são tratadas como UTC e não como hora local, ao contrário do que acontece com as demais.

## III. `console.time()`, `console.timeEnd()`

Dispara um cronômetro para acompanhar quanto dura uma operação. Cada cronômetro precisa de um nome único, e uma página pode ter até 10.000 rodando ao mesmo tempo. Quando se chama `console.timeEnd()` com o nome do cronômetro, o navegador escreve em milissegundos o tempo decorrido. Comparado ao `new Date().getTime()`, este jeito é mais fino: chega a 0,001 milissegundo (por exemplo, 0.134ms).

## IV. `performance.now()`

`performance.now()` devolve o tempo com precisão de microssegundos e não depende do relógio do sistema (que pode ser ajustado à mão ou mexido pelo NTP e por outros programas). Além disso, `performance.timing.navigationStart + performance.now()` equivale mais ou menos a `Date.now()`. Por isso, para medir quanto o JS demora, `performance.now()` é a escolha mais recomendada.

> Nota: para proteger contra ataques por medição de tempo e contra a criação de impressões digitais, a precisão do `performance.now()` pode ser reduzida conforme as configurações do navegador. No `Firefox`, a preferência `privacy.reduceTimerPrecision` vem ligada, com valor padrão de `1ms`. Ligar `privacy.resistFingerprinting` muda a precisão para 100 ms ou para o valor de `privacy.resistFingerprinting.reduceTimerPrecision.microseconds`, o que for maior.
