# matchMediaQuery / watchMediaQuery

Lê uma media query de CSS pelo JavaScript e assina as mudanças dela.

Para decidir o layout, prefira isto ao `isMobile()`: farejar o UA identifica o **dispositivo**, uma media query identifica a **janela**, e só a segunda acerta quando um navegador de mesa é estreitado ou um tablet é girado.

## API

| Função                             | Descrição                                                     |
| ---------------------------------- | ------------------------------------------------------------- |
| `matchMediaQuery(query)`           | A consulta casa agora? `false` em SSR                         |
| `watchMediaQuery(query, callback)` | Assina as mudanças; devolve uma função para cancelar          |
| `MOBILE_MEDIA_QUERY`               | `'(max-width: 768px)'`, o ponto de quebra móvel compartilhado |

## Exemplo

```js
import { MOBILE_MEDIA_QUERY, watchMediaQuery } from 'ranuts';

const off = watchMediaQuery(MOBILE_MEDIA_QUERY, (isMobile) => render(isMobile));
onCleanup(off);
```

## Notas

1. **A função é chamada uma vez, de forma síncrona**, com o valor atual, então nunca é preciso ler o estado inicial à parte.
2. **Sempre cancele a assinatura.** Um ouvinte de `MediaQueryList` que não é liberado mantém viva a clausura (e todo o DOM que ela capturou).
3. **O Safari antigo está contemplado.** O `addEventListener` no `MediaQueryList` só chegou no Safari 14; como reserva usam-se `addListener`/`removeListener`.
