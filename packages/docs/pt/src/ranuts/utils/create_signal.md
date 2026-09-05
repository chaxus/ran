# createSignal

Um sinal mínimo: `[ler, escrever]`, com difusão opcional pelo barramento compartilhado [`subscribers`](./sync_hook), para que módulos sem relação entre si possam reagir a uma mudança.

## API

### createSignal(value, options?)

#### Parâmetros

| Parâmetro | Descrição | Tipo | Padrão |
| -------------------- | ---------------------------------------------------- | -------------------------------------------- | ----------- |
| `value` | Valor inicial | `T` | Obrigatório |
| `options.subscriber` | Nome do evento; ao mudar, avisa pelo `subscribers` | `string` | `undefined` |
| `options.equals` | Como se decide se «mudou» | `boolean \| ((prev: T, next: T) => boolean)` | `true` |

O que `equals` significa:

| Valor | Comportamento |
| ---------------- | ----------------------------------------------------------------- |
| omitido ou `true` | `Object.is`: igualdade de referência ou de valor (o padrão dos sinais) |
| `false` | Cada escrita conta como mudança e avisa |
| uma função | Devolver `true` quer dizer «são iguais, não avise» |

#### Retorna

`[getter, setter]`.

## Exemplo

```js
import { createSignal, isEqual, subscribers } from 'ranuts';

const [count, setCount] = createSignal(0, { subscriber: 'count-changed' });
subscribers.tap('count-changed', () => render(count()));

setCount(1); // avisa
setCount(1); // mesmo valor: não avisa

// Peça a comparação profunda só quando ela realmente fizer falta
const [tree, setTree] = createSignal(initial, { equals: isEqual });
```

## Notas

1. **Por padrão, igualdade de referência.** Um objeto recém-construído, ainda que idêntico por dentro, _é_ uma mudança. É assim que os sinais se comportam, e é o que mantém a escrita em O(1).
2. **A comparação profunda precisa ser pedida** com `{ equals: isEqual }`, de modo que o custo fique visível no ponto de chamada.
3. **`subscriber` é opcional.** Sem ele, o sinal é puro estado local.

::: warning Mudou na 0.3
Duas correções que mudam o comportamento:

- `{ equals: true }` significava «sempre iguais», o que congelava o sinal e fazia com que ele **nunca se atualizasse**. Agora significa «use a comparação padrão», igual a `undefined`.
- Toda escrita rodava `cloneDeep` e `isEqual` por cima de `equals`. Isso punha uma cópia proporcional ao tamanho dos dados no caminho quente da escrita, e essa checagem profunda a mais atropelava o `equals`, de modo que `{ equals: false }` («avise sempre») não fazia nada com valores idênticos por dentro. As duas coisas se foram.
  :::
