# loadScript

Injeta um único `<script>` em tempo de execução, sem repetir o mesmo conteúdo.

No que difere de [`scriptOnLoad`](/pt/src/ranuts/utils/script_on_load): aquela carrega **um lote** de URLs de uma vez (mandando os `.css` por uma tag `<link>`), enquanto esta cuida de **um único** script, aceita um corpo em linha e garante que o mesmo script seja avaliado uma só vez — injetar duas vezes o SDK de um terceiro costuma significar que os efeitos da inicialização rodaram duas vezes.

A chave para não repetir é o md5 de `type + content`, então uma URL e um script em linha de mesmo nome não podem ser confundidos.

## Uso

```ts
import { loadScript } from 'ranuts/utils';

// Script externo
await loadScript({ type: 'url', content: 'https://cdn.example.com/sdk.js' });

// Script em linha
await loadScript({ type: 'content', content: 'window.__ready = true;' });

// A segunda chamada não faz nada: já foi avaliado
await loadScript({ type: 'url', content: 'https://cdn.example.com/sdk.js' });
```

## API

### loadScript

#### Parâmetros

| Parâmetro | Descrição                                                             | Tipo                 | Padrão      |
| --------- | --------------------------------------------------------------------- | -------------------- | ----------- |
| `type`    | `'url'` carrega via `src`; `'content'` embute o texto do script       | `'url' \| 'content'` | Obrigatório |
| `content` | A URL quando `type` é `'url'`; o corpo do script quando é `'content'` | `string`             | Obrigatório |

#### Retorna

| Argumento | Descrição                                              | Tipo                            |
| --------- | ------------------------------------------------------ | ------------------------------- |
| `promise` | Resolve com `{ success: true }` assim que for avaliado | `Promise<{ success: boolean }>` |

É rejeitada com `{ success: false, error }` quando um script externo não consegue carregar.

## Notas

Um script **em linha** é avaliado de forma síncrona no instante em que é acrescentado e depois nunca dispara um evento `load`. Esperar só pelo `onload` deixaria a promessa pendente para sempre num navegador de verdade, então com `type: 'content'` esta função resolve assim que `append` retorna. (O jsdom _dispara_ um evento load para scripts em linha, e por isso um teste unitário não pegaria a diferença.)
