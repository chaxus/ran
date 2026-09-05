# isMobile

Verifica se o dispositivo atual é móvel.

## API

### isMobile

#### Retorna

| Argumento | Descrição                 | Tipo      |
| --------- | ------------------------- | --------- |
| `boolean` | Se é um dispositivo móvel | `boolean` |

#### Parâmetros

Sem parâmetros

## Exemplo

### Uso básico

```js
import { isMobile } from 'ranuts';

if (isMobile()) {
  console.log('O dispositivo atual é móvel');
} else {
  console.log('O dispositivo atual é de mesa');
}
```

### Layout responsivo

```js
import { isMobile } from 'ranuts';

const layout = isMobile() ? 'mobile' : 'desktop';
console.log(`Usando o layout ${layout}`);
```

### Carregamento condicional

```js
import { isMobile } from 'ranuts';

if (isMobile()) {
  // Carrega o código próprio de celular
  import('./mobile-module');
} else {
  // Carrega o código de mesa
  import('./desktop-module');
}
```

## Notas

1. **Regras de detecção**: reconhece estes dispositivos pelo User Agent:
   - Android
   - webOS
   - iPhone
   - iPod
   - iPad
   - BlackBerry

2. **Renderização no servidor**: devolve `false` em ambientes de servidor (não há objeto `window`).

3. **Precisão**: baseia-se no User Agent, então um UA alterado pode enganá-lo.

4. **O iPad**: conforme o User Agent, em alguns casos o iPad é identificado como dispositivo móvel.
