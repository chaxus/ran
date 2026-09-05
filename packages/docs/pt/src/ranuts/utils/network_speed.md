# networkSpeed

Mede o ping e a variação da rede atual com várias requisições.

## API

### networkSpeed

#### Retorna

| Argumento             | Descrição                                       | Tipo      |
| --------------------- | ----------------------------------------------- | --------- |
| `Promise<ReturnType>` | Promessa resolvida com os resultados da medição | `Promise` |

#### ReturnType

| Propriedade | Descrição                        | Tipo     |
| ----------- | -------------------------------- | -------- |
| `ping`      | Ping médio (milissegundos)       | `number` |
| `jitter`    | Variação da rede (milissegundos) | `number` |

#### Parâmetros

| Parâmetro | Descrição              | Tipo      | Padrão      |
| --------- | ---------------------- | --------- | ----------- |
| `options` | Opções de configuração | `Options` | Obrigatório |

#### Opções

| Parâmetro  | Descrição                           | Tipo     | Padrão      |
| ---------- | ----------------------------------- | -------- | ----------- |
| `url`      | URL da imagem usada na medição      | `string` | Obrigatório |
| `duration` | Intervalo entre as requisições (ms) | `number` | `3000`      |
| `count`    | Número de medições                  | `number` | `5`         |

## Exemplo

### Uso básico

```js
import { networkSpeed } from 'ranuts';

const result = await networkSpeed({
  url: 'https://example.com/test.jpg',
  count: 5,
  duration: 3000,
});

console.log('Latência média:', result.ping, 'ms');
console.log('Variação da rede:', result.jitter, 'ms');
```

### Avaliar a qualidade da rede

```js
import { networkSpeed } from 'ranuts';

async function assessNetwork() {
  const { ping, jitter } = await networkSpeed({ count: 10, url: 'https://example.com/test.jpg' });

  if (ping < 50 && jitter < 20) {
    console.log('Qualidade de rede excelente');
  } else if (ping < 100 && jitter < 50) {
    console.log('Qualidade de rede boa');
  } else {
    console.log('Qualidade de rede mediana');
  }
}
```

### Mudar os parâmetros da medição

```js
import { networkSpeed } from 'ranuts';

// Dez medições, com dois segundos entre cada uma
const result = await networkSpeed({
  url: 'https://example.com/ping.jpg',
  count: 10,
  duration: 2000,
});
```

## Notas

1. **Variação**: descreve o quanto a rede oscila; é a diferença entre o maior e o menor valor de várias medições, e quanto menor, mais estável a rede.
2. **Como mede**: dispara várias requisições de imagem e calcula a latência média e a variação.
3. **Valores padrão**: cinco medições, com três segundos entre cada uma.
4. **Quando usar**: é comum para estimar a qualidade da rede, no monitoramento de desempenho e para afinar a experiência de uso.
