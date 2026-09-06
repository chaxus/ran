# prefetch

Deixa um recurso pesado já aquecido no cache do navegador antes que ele seja preciso, sem gastar os dados de quem navega pelas costas.

O dado central: se um Service Worker atende os GET da mesma origem dando prioridade ao cache, basta fazer `fetch` de uma URL uma vez para ela ficar no CacheStorage. Qualquer pedido posterior à mesma URL acerta o cache e funciona sem conexão. A pré-busca, portanto, não precisa de nenhum baixador especial: é só trazer os bytes.

## API

| Função                             | Descrição                                                                 |
| ---------------------------------- | ------------------------------------------------------------------------- |
| `whenIdle(callback, options?)`     | Roda quando o navegador está ocioso; devolve uma função para cancelar     |
| `networkAllowsDownload(options?)`  | Podemos gastar agora os dados de quem navega?                             |
| `isUrlCached(url)`                 | Esta URL já está no CacheStorage?                                         |
| `prefetchUrl(url)`                 | Traz uma URL para o cache; pula se já estiver lá e falha em silêncio      |
| `prefetchUrls(urls, options?)`     | O mesmo para uma lista, **uma depois da outra**                           |
| `prefetchWhenIdle(urls, options?)` | As três juntas: permissão → ociosidade → pré-busca em série. Não bloqueia |

### Opções

| Opção                  | Aplica-se a       | Descrição                                                                          | Padrão              |
| ---------------------- | ----------------- | ---------------------------------------------------------------------------------- | ------------------- |
| `timeout`              | `whenIdle`        | Espera máxima pelo `requestIdleCallback` (ms)                                      | `8000`              |
| `fallbackDelay`        | `whenIdle`        | Espera quando não existe `requestIdleCallback` (ms)                                | `2500`              |
| `optOutKey`            | permissão de rede | Chave do localStorage; qualquer valor quer dizer que a pessoa desligou a pré-busca | —                   |
| `slowTypes`            | permissão de rede | Valores de `effectiveType` tidos como lentos demais                                | `['slow-2g', '2g']` |
| `serviceWorkerMessage` | `prefetchUrls`    | O `type` da mensagem com que a lista é passada a um SW que controle a página       | —                   |

## Exemplo

```js
import { prefetchWhenIdle, isUrlCached } from 'ranuts';

prefetchWhenIdle(modelFiles, {
  optOutKey: 'disable_model_prefetch',
  serviceWorkerMessage: 'precache-models',
});

// Mais tarde: já está local? (verifique o arquivo que termina de baixar por último)
const ready = await isUrlCached(modelFiles.at(-1));
```

## Notas

1. **A pré-busca gasta dados alheios.** `networkAllowsDownload` recusa com a economia de dados ligada, numa conexão lenta ou quando a pessoa disse que não.
2. **O desconhecido conta como permitido.** A Network Information API não existe no Safari nem no Firefox; não conseguir ler a conexão não é motivo para nunca pré-buscar.
3. **As listas são buscadas em série**: saturar o cano deixaria mais lenta justamente a página que a pessoa está olhando.
4. **Prefira o caminho do Service Worker.** Um SW que use `event.waitUntil` continua baixando mesmo depois de trocar de página; um fetch da thread principal morre assim que a pessoa sai. Sem um SW controlando a página, o caminho alternativo é tomado sozinho.
5. **Verifique o maior arquivo** ao checar se um conjunto está em cache, ou uma baixa pela metade parecerá completa.
6. **As falhas serem silenciosas é de propósito**: uma pré-busca que falhou só significa que a carga de verdade vai baixar depois.
