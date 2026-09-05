# durationHandler

Cria uma função de execução adiada que chama a função indicada depois de certo tempo.

## API

### durationHandler

#### Retorna

| Argumento | Descrição | Tipo |
| ---------- | ---------------------------------------------------- | ---------------------------------- |
| `Function` | Devolve uma função que recebe o tempo de espera | `(duration: number) => Promise<U>` |

#### Parâmetros

| Parâmetro | Descrição | Tipo | Padrão |
| ----------- | ------------------------------ | ---------- | -------- |
| `handler` | Função que será executada | `Function` | Obrigatório |
| `...params` | Argumentos passados a ela | `T[]` | Obrigatório |

## Exemplo

### Uso básico

```js
import { durationHandler } from 'ranuts';

const delayedFn = durationHandler((name) => {
  console.log('Olá', name);
  return 'done';
}, 'World');

// Executa depois de um segundo
const result = await delayedFn(1000);
console.log(result); // 'done'
```

### Adiar uma requisição à API

```js
import { durationHandler } from 'ranuts';

const delayedRequest = durationHandler(async (url) => {
  const response = await fetch(url);
  return response.json();
}, 'https://api.example.com/data');

// A requisição sai depois de dois segundos
const data = await delayedRequest(2000);
console.log(data);
```

### Combinado com networkSpeed

```js
import { durationHandler, imageRequest } from 'ranuts';

// Criar uma requisição de imagem adiada
const delayedImageRequest = durationHandler(imageRequest, 'https://example.com/test.jpg');

// Executa depois de três segundos
const latency = await delayedImageRequest(3000);
console.log('Latência:', latency, 'ms');
```

## Notas

1. **Função currificada**: devolve uma função que recebe o tempo de espera, o que combina com um estilo funcional.
2. **Funciona com async**: aceita funções assíncronas e espera elas terminarem.
3. **Erros**: se a função falhar, a promessa é rejeitada.
4. **Quando usar**: é comum para execução adiada, tarefas agendadas e testes de rede.
