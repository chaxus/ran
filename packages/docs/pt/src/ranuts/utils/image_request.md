# imageRequest

Mede a latência da rede (ping) com uma requisição de imagem.

## API

### imageRequest

#### Retorna

| Argumento         | Descrição                                                      | Tipo      |
| ----------------- | -------------------------------------------------------------- | --------- |
| `Promise<number>` | Promessa resolvida com a duração da requisição (milissegundos) | `Promise` |

#### Parâmetros

| Parâmetro | Descrição                                                | Tipo     | Padrão   |
| --------- | -------------------------------------------------------- | -------- | -------- |
| `url`     | URL da imagem (opcional; por padrão o favicon do GitHub) | `string` | Opcional |

## Exemplo

### Uso básico

```js
import { imageRequest } from 'ranuts';

const latency = await imageRequest();
console.log('Latência da rede:', latency, 'ms');
```

### Indicar a URL de teste

```js
import { imageRequest } from 'ranuts';

const latency = await imageRequest('https://example.com/test-image.jpg');
console.log('Latência:', latency, 'ms');
```

### Teste de rede

```js
import { imageRequest } from 'ranuts';

async function testNetwork() {
  try {
    const latency = await imageRequest();
    if (latency < 100) {
      console.log('Rede boa');
    } else if (latency < 300) {
      console.log('Rede mediana');
    } else {
      console.log('Rede lenta');
    }
  } catch (error) {
    console.error('O teste falhou:', error);
  }
}
```

## Notas

1. **URL padrão**: se nenhuma URL for passada, usa o favicon do GitHub (cerca de 2,2 KB).
2. **Como mede**: cronometra o carregamento da imagem, do início da requisição até a imagem terminar de carregar.
3. **Erros**: se a imagem não carregar, a promessa é rejeitada.
4. **Quando usar**: é comum para estimar a qualidade da rede, em monitoramento de desempenho e afins.
