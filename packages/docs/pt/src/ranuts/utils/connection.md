# connection

Obtém informações sobre a conexão de rede atual (Network Information API).

## API

### connection

#### Retorna

| Argumento                         | Descrição                                 | Tipo                              |
| --------------------------------- | ----------------------------------------- | --------------------------------- |
| `NetworkInformation \| undefined` | O objeto da conexão de rede, ou undefined | `NetworkInformation \| undefined` |

#### Parâmetros

Sem parâmetros

## Exemplo

### Uso básico

```js
import { connection } from 'ranuts';

const conn = connection();
if (conn) {
  console.log('Tipo de rede:', conn.effectiveType);
  console.log('Velocidade de descida:', conn.downlink, 'Mbps');
  console.log('RTT:', conn.rtt, 'ms');
}
```

### Escutar as mudanças de rede

```js
import { connection } from 'ranuts';

const conn = connection();
if (conn) {
  conn.addEventListener('change', () => {
    console.log('O estado da rede mudou');
    console.log('Novo tipo de rede:', conn.effectiveType);
  });
}
```

### Adaptar a estratégia à rede

```js
import { connection } from 'ranuts';

const conn = connection();
if (conn) {
  if (conn.effectiveType === 'slow-2g' || conn.effectiveType === '2g') {
    // Rede lenta: carregar imagens de baixa qualidade
    loadLowQualityImages();
  } else {
    // Rede rápida: carregar imagens de alta qualidade
    loadHighQualityImages();
  }
}
```

## Notas

1. **Suporte dos navegadores**: é preciso que o navegador tenha a Network Information API; alguns não têm.
2. **Ambiente de servidor**: em ambientes de servidor (sem objeto `window`) devolve `undefined`.
3. **Propriedades do objeto de conexão**:
   - `effectiveType`: tipo de rede ('slow-2g', '2g', '3g', '4g')
   - `downlink`: velocidade de descida (Mbps)
   - `rtt`: tempo de ida e volta (milissegundos)
   - `saveData`: se o modo de economia de dados está ligado
4. **Quando usar**: é comum para adaptar o carregamento de conteúdo ao estado da rede e para otimizar o desempenho.
