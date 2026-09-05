# debounce

Debounce: quando uma função é disparada muitas vezes seguidas, ela roda **só depois que os disparos param** por `ms` milissegundos. Use quando só o estado final importa: busca enquanto se digita, redimensionamento da janela, salvamento automático.

Se você também precisa dos valores intermediários, use [throttle](./throttle).

## API

### debounce(fn, ms?)

#### Parâmetros

| Parâmetro | Descrição                    | Tipo       | Padrão      |
| --------- | ---------------------------- | ---------- | ----------- |
| `fn`      | Função que recebe o debounce | `Function` | Obrigatório |
| `ms`      | Tempo de silêncio (ms)       | `number`   | `500`       |

#### Retorna

Uma função com debounce que preserva o `this` do ponto de chamada e os **últimos** argumentos, além de:

| Membro      | Descrição                                                    | Tipo            |
| ----------- | ------------------------------------------------------------ | --------------- |
| `cancel()`  | Descarta a chamada pendente                                  | `() => void`    |
| `flush()`   | Executa já a chamada pendente (antes de enviar, por exemplo) | `() => void`    |
| `pending()` | Se há uma chamada esperando                                  | `() => boolean` |

## Exemplo

```js
import { debounce } from 'ranuts';

const save = debounce((draft) => api.save(draft), 800);
input.addEventListener('input', (e) => save(e.target.value));

form.addEventListener('submit', () => save.flush()); // para não perder a última tecla
onUnmount(() => save.cancel());
```

## Notas

1. **Só a última chamada roda**, com os argumentos dessa última chamada.
2. **O `this` vem do ponto de chamada**: `obj.handler()` enxerga `obj`.
3. **Chame sempre `cancel()` ao desmontar**; senão o temporizador pendente dispara sobre um contexto já destruído.
4. **Tipagem completa**: os tipos dos argumentos e do retorno são inferidos de `fn`.
