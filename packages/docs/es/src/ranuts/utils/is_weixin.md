# isWeiXin

Determina si el entorno actual es el navegador de WeChat.

## API

### isWeiXin

#### Devuelve

| Argumento | Descripción                  | Tipo      |
| --------- | ---------------------------- | --------- |
| `boolean` | Si es el navegador de WeChat | `boolean` |

#### Parámetros

Sin parámetros

## Ejemplo

### Uso básico

```js
import { isWeiXin } from 'ranuts';

if (isWeiXin()) {
  console.log('Ahora mismo en el navegador de WeChat');
} else {
  console.log('No es el navegador de WeChat');
}
```

### Funciones propias de WeChat

```js
import { isWeiXin } from 'ranuts';

if (isWeiXin()) {
  // Usa el JS-SDK de WeChat
  wx.config({
    // Configuración
  });
} else {
  // Usa el mecanismo de compartir normal
  shareToSocial();
}
```

### Mostrar de forma condicional

```js
import { isWeiXin } from 'ranuts';

if (isWeiXin()) {
  // Muestra los avisos propios de WeChat
  showWeChatTip();
}
```

## Notas

1. **Cómo lo detecta**: mira si el User Agent contiene la cadena `micromessenger`.

2. **Renderizado en el servidor**: devuelve `false` en entornos de servidor (no hay objeto `window`).

3. **Exactitud**: se basa en el User Agent, así que puede no acertar si el UA está modificado.

4. **Versiones de WeChat**: funciona con todas las versiones del navegador de WeChat (incluidos el navegador integrado y el WebView de los Mini Programas).
