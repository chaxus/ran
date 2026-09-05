# noop

Função vazia que não faz nada. Serve como callback padrão ou como marcador de lugar.

## API

### noop

#### Retorna

| Argumento | Descrição            | Tipo   |
| --------- | -------------------- | ------ |
| `void`    | Sem valor de retorno | `void` |

#### Parâmetros

Sem parâmetros

## Exemplo

### Uso básico

```js
import { noop } from 'ranuts';

// Como callback padrão
const callback = noop;
callback(); // Não faz nada
```

### Como valor padrão de um argumento

```js
import { noop } from 'ranuts';

function processData(data, onSuccess = noop, onError = noop) {
  try {
    // Processar os dados
    onSuccess(data);
  } catch (error) {
    onError(error);
  }
}

// Só o callback de sucesso é passado
processData({ id: 1 }, (data) => {
  console.log('Sucesso:', data);
});

// Nenhum callback é passado
processData({ id: 2 }); // Não lança erro
```

### Callback condicional

```js
import { noop } from 'ranuts';

const handleClick = isEnabled
  ? () => {
      console.log('Executar a ação');
    }
  : noop;

button.addEventListener('click', handleClick);
```

### Lugar reservado para um ouvinte de eventos

```js
import { noop } from 'ranuts';

const unsubscribe = someService.subscribe(noop); // Por ora os eventos não são tratados
```

## Notas

1. **Custo**: chamar uma função vazia custa quase nada, o que a torna boa como valor padrão.
2. **Tipagem**: em TypeScript `noop` tem o tipo `() => void` e encaixa sem risco onde se espera uma função.
3. **Legibilidade**: `noop` diz «não faz nada» com mais clareza do que `() => {}`.
