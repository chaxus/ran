# currentDevice

Obtém o tipo do dispositivo atual.

## API

### currentDevice

#### Retorna

| Argumento | Descrição | Tipo |
| --------------- | ------------------ | ----------------------------------------- |
| `CurrentDevice` | String com o tipo de dispositivo | `'ipad' \| 'android' \| 'iphone' \| 'pc'` |

#### Parâmetros

Sem parâmetros

## Exemplo

### Uso básico

```js
import { currentDevice } from 'ranuts';

const device = currentDevice();
console.log(`Dispositivo atual: ${device}`);
// Pode imprimir: 'ipad', 'android', 'iphone' ou 'pc'
```

### Executar lógicas diferentes conforme o dispositivo

```js
import { currentDevice } from 'ranuts';

const device = currentDevice();
switch (device) {
  case 'iphone':
    // Lógica própria do iPhone
    break;
  case 'android':
    // Lógica própria do Android
    break;
  case 'ipad':
    // Lógica própria do iPad
    break;
  case 'pc':
    // Lógica própria do PC
    break;
}
```

### Estilos próprios de cada dispositivo

```js
import { currentDevice } from 'ranuts';

const device = currentDevice();
document.body.classList.add(`device-${device}`);
```

## Notas

1. **Ordem da detecção**: verifica nesta ordem:
   - iPad/iPod
   - Android
   - iPhone
   - Os demais (por padrão devolve 'pc')

2. **Renderização no servidor**: devolve `'pc'` em ambientes de servidor (sem objeto `window`).

3. **Como detecta**: pela string do User Agent.

4. **Valor devolvido**: é um tipo enumerado; só pode ser `'ipad'`, `'android'`, `'iphone'` ou `'pc'`.
