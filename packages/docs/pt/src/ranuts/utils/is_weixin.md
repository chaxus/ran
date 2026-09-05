# isWeiXin

Verifica se o ambiente atual é o navegador do WeChat.

## API

### isWeiXin

#### Retorna

| Argumento | Descrição                  | Tipo      |
| --------- | -------------------------- | --------- |
| `boolean` | Se é o navegador do WeChat | `boolean` |

#### Parâmetros

Sem parâmetros

## Exemplo

### Uso básico

```js
import { isWeiXin } from 'ranuts';

if (isWeiXin()) {
  console.log('Agora no navegador do WeChat');
} else {
  console.log('Não é o navegador do WeChat');
}
```

### Recursos próprios do WeChat

```js
import { isWeiXin } from 'ranuts';

if (isWeiXin()) {
  // Usa o JS-SDK do WeChat
  wx.config({
    // Configuração
  });
} else {
  // Usa o compartilhamento comum
  shareToSocial();
}
```

### Exibição condicional

```js
import { isWeiXin } from 'ranuts';

if (isWeiXin()) {
  // Mostra os avisos próprios do WeChat
  showWeChatTip();
}
```

## Notas

1. **Como detecta**: olha se o User Agent contém a string `micromessenger`.

2. **Renderização no servidor**: devolve `false` em ambientes de servidor (não há objeto `window`).

3. **Precisão**: baseia-se no User Agent, então pode errar se o UA tiver sido alterado.

4. **Versões do WeChat**: funciona com todas as versões do navegador do WeChat (inclusive o navegador embutido e o WebView dos Mini Programas).
