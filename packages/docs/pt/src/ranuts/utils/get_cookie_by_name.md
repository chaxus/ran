# getCookieByName

Obtém o valor de um cookie pelo nome usando uma expressão regular.

## API

### getCookieByName

#### Retorna

| Argumento | Descrição                                      | Tipo     |
| --------- | ---------------------------------------------- | -------- |
| `string`  | O valor do cookie; string vazia se não existir | `string` |

#### Parâmetros

| Parâmetro | Descrição      | Tipo     | Padrão      |
| --------- | -------------- | -------- | ----------- |
| `name`    | Nome do cookie | `string` | Obrigatório |

## Exemplo

### Uso básico

```js
import { getCookieByName } from 'ranuts';

const token = getCookieByName('token');
console.log(token); // O valor do cookie, ou uma string vazia
```

### No que difere de getCookie

```js
import { getCookie, getCookieByName } from 'ranuts';

// getCookie divide a string
const value1 = getCookie('token');

// getCookieByName usa uma expressão regular
const value2 = getCookieByName('token');

// Fazem o mesmo; muda só a implementação
```

### Verificar se o cookie existe

```js
import { getCookieByName } from 'ranuts';

const sessionId = getCookieByName('sessionId');
if (sessionId) {
  console.log('ID da sessão:', sessionId);
} else {
  console.log('O ID da sessão não existe');
}
```

## Notas

1. **Casamento por expressão regular**: procura o cookie com uma expressão regular, então tolera espaços antes ou depois do nome.
2. **Seguro no servidor**: em ambientes de servidor (sem objeto `window`) devolve string vazia e não lança erros.
3. **Diferença para getCookie**: fazem o mesmo, mas `getCookieByName` usa expressão regular e `getCookie` divide a string.
4. **Valor devolvido**: quando o cookie não existe, devolve string vazia, não `null` nem `undefined`.
