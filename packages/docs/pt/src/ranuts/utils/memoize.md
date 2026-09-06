# once / singleFlight

Executa algo **exatamente uma vez** e reaproveita o resultado: inicialização preguiçosa para analisar a configuração, um cálculo caro feito uma só vez, getters preguiçosos. `once` é síncrona; `singleFlight` é a contraparte assíncrona.

## API

### once(fn)

| Parâmetro | Descrição                                                     | Tipo              | Padrão      |
| --------- | ------------------------------------------------------------- | ----------------- | ----------- |
| `fn`      | Função que roda uma vez; o que não for função volta como está | `Function \| any` | Obrigatório |

Devolve uma função embrulhada. A primeira chamada avalia e guarda; todas as seguintes devolvem aquele primeiro resultado, **sejam quais forem os argumentos**.

### singleFlight(fn)

| Parâmetro | Descrição                          | Tipo               | Padrão      |
| --------- | ---------------------------------- | ------------------ | ----------- |
| `fn`      | Função assíncrona que roda uma vez | `() => Promise<T>` | Obrigatório |

Devolve uma função embrulhada, mais:

| Membro    | Descrição                                                                  | Tipo         |
| --------- | -------------------------------------------------------------------------- | ------------ |
| `reset()` | Descarta o resultado guardado para que a próxima chamada rode `fn` de novo | `() => void` |
| `started` | Se já tem um resultado ou está rodando agora                               | `boolean`    |

### memoize(fn)

Apelido obsoleto de `once`. Veja o aviso abaixo.

## Exemplo

```js
import { once, singleFlight } from 'ranuts';

// Síncrono: a configuração é analisada só no primeiro acesso
const config = once(() => JSON.parse(rawConfig));
config(); // analisa
config(); // devolve o guardado

// Assíncrono: o banco é aberto uma vez, disputem quantos disputarem
const ready = singleFlight(() => db.openDataBase());
await Promise.all([ready(), ready(), ready()]); // abre uma só vez
```

## Notas

1. **`once` não guarda por argumento.** Só valem os da primeira chamada. Se precisar de cache por argumento, monte um `Map` você mesmo.
2. **`once` solta `fn` depois de avaliar**, então o que aquela função segurava pode ser coletado.
3. **`singleFlight` não guarda rejeições.** Uma tentativa que falha limpa o cache, de modo que uma oscilação passageira da rede continua repetível. Guardar uma promessa rejeitada tornaria permanente um tropeço momentâneo.
4. **Chamadas concorrentes a `singleFlight` compartilham a promessa em andamento**, então `fn` roda uma vez mesmo com N chamadas disputando. Esta é a correção do clássico «init() devolve void, então quem chama não consegue esperar e as escritas antecipadas falham».

::: warning Renomeado na 0.3
`memoize` era um nome enganoso: ele nunca guardou nada por argumento, apenas rodava uma vez. Agora é apelido de `once` e está obsoleto. A assinatura de tipos também estava errada antes (declarada sem argumentos embora os repassasse); agora é inferida de `fn`.
:::
