# isSafari

Verifica se o navegador atual é o Safari.

## API

### isSafari

#### Retorna

| Argumento                        | Descrição                 | Tipo                             |
| -------------------------------- | ------------------------- | -------------------------------- |
| `boolean \| undefined \| string` | Se o navegador é o Safari | `boolean \| undefined \| string` |

#### Parâmetros

Sem parâmetros

## Exemplo

### Uso básico

```js
import { isSafari } from 'ranuts';

const isSafariBrowser = isSafari();
if (isSafariBrowser) {
  console.log('O navegador atual é o Safari');
} else {
  console.log('Não é o Safari');
}
```

### Recursos próprios do Safari

```js
import { isSafari } from 'ranuts';

if (isSafari()) {
  // Tratamento próprio do Safari
  // por exemplo, contornar certos problemas de compatibilidade
  applySafariFix();
}
```

### Ambiente de servidor

```js
import { isSafari } from 'ranuts';

// Devolve undefined num ambiente de servidor
const result = isSafari();
console.log(result); // undefined (ambiente de servidor)
```

## Notas

1. **Como detecta**: olha se `navigator.vendor` contém 'Apple'.
2. **Exclui outros navegadores**: deixa de fora o Chrome iOS (CriOS) e o Firefox iOS (FxiOS).
3. **Ambiente de servidor**: devolve `undefined` em ambientes de servidor (não há objeto `navigator`).
4. **Valor devolvido**: `boolean` no navegador, `undefined` no servidor; em alguns casos pode devolver uma string.
