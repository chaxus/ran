# getPerformance

Recolhe as métricas de desempenho da página: resolução de DNS, conexão TCP, carregamento de recursos e demais indicadores.

## API

### getPerformance

#### Retorna

| Argumento | Descrição | Tipo |
| ------------------------ | -------------------------- | ------------------------ |
| `BasicType \| undefined` | O objeto com as métricas de desempenho | `BasicType \| undefined` |

#### BasicType

| Propriedade | Descrição | Tipo |
| -------------- | ------------------------------------------------------- | --------------------- |
| `dnsSearch` | Tempo de resolução de DNS (ms) | `number` |
| `tcpConnect` | Tempo de conexão TCP (ms) | `number` |
| `sslConnect` | Tempo da conexão segura SSL (ms) | `number` |
| `request` | TTFB: tempo da requisição de rede (ms) | `number` |
| `response` | Tempo de transferência dos dados (ms) | `number` |
| `parseDomTree` | Tempo de análise do DOM (ms) | `number` |
| `resource` | Tempo de carregamento dos recursos (ms) | `number` |
| `domReady` | Tempo até o DOM Ready (ms) | `number` |
| `httpHead` | Tamanho dos cabeçalhos HTTP (bytes) | `number` |
| `interactive` | Tempo até dar para interagir (ms) | `number` |
| `complete` | Tempo até a página carregar por inteiro (ms) | `number` |
| `redirect` | Número de redirecionamentos | `number` |
| `redirectTime` | Tempo dos redirecionamentos (ms) | `number` |
| `duration` | Tempo total das requisições de recursos (ms) | `number` |
| `fp` | Tempo até a primeira pintura (tela branca, ms) | `number \| undefined` |
| `fcp` | Tempo até a primeira pintura com conteúdo (fim da primeira tela, ms) | `number \| undefined` |

#### Parâmetros

Sem parâmetros

## Exemplo

### Uso básico

```js
import { getPerformance } from 'ranuts';

const perf = getPerformance();
if (perf) {
  console.log('Resolução de DNS:', perf.dnsSearch, 'ms');
  console.log('Conexão TCP:', perf.tcpConnect, 'ms');
  console.log('Primeira tela:', perf.fcp, 'ms');
}
```

### Medição de desempenho

```js
import { getPerformance } from 'ranuts';

window.addEventListener('load', () => {
  const perf = getPerformance();
  if (perf) {
    // Enviar os dados de desempenho ao servidor
    sendToServer({
      dns: perf.dnsSearch,
      tcp: perf.tcpConnect,
      request: perf.request,
      fcp: perf.fcp,
    });
  }
});
```

### Análise do desempenho

```js
import { getPerformance } from 'ranuts';

function analyzePerformance() {
  const perf = getPerformance();
  if (!perf) return;

  console.log('=== Análise do desempenho ===');
  console.log('Resolução de DNS:', perf.dnsSearch, 'ms');
  console.log('Conexão TCP:', perf.tcpConnect, 'ms');
  console.log('Aperto de mão SSL:', perf.sslConnect, 'ms');
  console.log('Resposta à requisição:', perf.request, 'ms');
  console.log('Transferência de dados:', perf.response, 'ms');
  console.log('Análise do DOM:', perf.parseDomTree, 'ms');
  console.log('Carregamento de recursos:', perf.resource, 'ms');
  console.log('Primeira pintura:', perf.fp, 'ms');
  console.log('Primeira pintura com conteúdo:', perf.fcp, 'ms');
}
```

## Notas

1. **Suporte dos navegadores**: é preciso que o navegador tenha a Performance API, o que todos os modernos têm.

2. **No servidor**: devolve `undefined` em ambientes de servidor (sem objeto `window`).

3. **Quando chamar**: convém fazê-lo depois que a página terminar de carregar (evento `load`), para ter os dados completos.

4. **Unidades**: todos os tempos vão em milissegundos e os tamanhos em bytes.

5. **Quando usar**: é comum para acompanhar, analisar e afinar o desempenho.
