# Hooks de instrumentação

Enganche-se em `console`, `fetch`, `XMLHttpRequest`, cliques e erros não capturados, seja para um backend de monitoramento, uma camada de depuração ou testes.

**Todos devolvem uma função para desmontá-los. Guarde-a e chame-a.** Instrumentar um global sem como desfazer significa que os testes não conseguem limpar a própria sujeira, e que cada recarga a quente remenda um global já remendado até que cada chamada atravesse uma dúzia de invólucros e cada evento seja relatado N vezes.

## API

| Function | Instrumenta | Retorna |
| ---------------------------- | ------------------------------------ | ------------- |
| `handleConsole(hook)` | `console.log/info/warn/error/assert` | `restore` |
| `handleFetchHook(options)` | `window.fetch` | `restore` |
| `handleXhrHook(options)` | `XMLHttpRequest#open` / `#send` | `restore` |
| `handleError(hook)` | `error` e `unhandledrejection` | `unsubscribe` |
| `handleClick(hook)` | Cliques no documento (fase de captura) | `unsubscribe` |
| `replaceOld(obj, key, wrap)` | Qualquer propriedade de qualquer objeto | `restore` |

`handleFetchHook` e `handleXhrHook` recebem `{ requestHook, responseHook, errorHook }`.

## Exemplo

```js
import { handleConsole, handleError, handleFetchHook } from 'ranuts';

const teardown = [
  handleConsole((type, ...args) => send({ type, args })),
  handleError((error) => send({ type: 'error', error: String(error) })),
  handleFetchHook({ errorHook: (url, error) => send({ type: 'fetchError', url }) }),
];

// ao desmontar (recarga a quente, troca de rota, limpeza de testes)
teardown.forEach((off) => off());
```

## Notas

1. **O comportamento original é preservado.** As respostas passam adiante, os erros são relançados e o console continua imprimindo.
2. **O `restore` do `replaceOld` desfaz apenas o próprio remendo.** Se depois outra camada remendou por cima, restaurar às cegas a desinstalaria em silêncio, então nesse caso ele se recusa.
3. **`handleXhrHook` remenda o protótipo**, então vale para todas as instâncias; seus ouvintes são registrados com `{ once: true }` para que um objeto XHR reaproveitado não os acumule.
4. **Não relate a saída do console para um backend que escreve no console**: o hook dispara com a própria chamada que ele produz. (É por isso que o canal `console` do `Monitor` vem desligado.)

::: warning Mudou na 0.3
Antes todos devolviam `void`, sem meio de desinstalar. Agora devolvem uma função para desmontá-los; o código que já os usava continua funcionando e só precisa começar a aproveitá-la.
:::
