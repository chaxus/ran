# isWeiXin

Stellt fest, ob die aktuelle Umgebung der WeChat-Browser ist.

## API

### isWeiXin

#### Rückgabe

| Argument  | Beschreibung                 | Typ       |
| --------- | ---------------------------- | --------- |
| `boolean` | Ob es der WeChat-Browser ist | `boolean` |

#### Parameter

Keine Parameter

## Beispiel

### Grundlegende Verwendung

```js
import { isWeiXin } from 'ranuts';

if (isWeiXin()) {
  console.log('Gerade im WeChat-Browser');
} else {
  console.log('Nicht im WeChat-Browser');
}
```

### WeChat-eigene Funktionen

```js
import { isWeiXin } from 'ranuts';

if (isWeiXin()) {
  // Das JS-SDK von WeChat nutzen
  wx.config({
    // Konfiguration
  });
} else {
  // Das übliche Teilen nutzen
  shareToSocial();
}
```

### Bedingte Anzeige

```js
import { isWeiXin } from 'ranuts';

if (isWeiXin()) {
  // WeChat-eigene Hinweise zeigen
  showWeChatTip();
}
```

## Hinweise

1. **Erkennungsweg**: Prüft, ob der User Agent die Zeichenkette `micromessenger` enthält.

2. **Serverseitiges Rendern**: Gibt in Server-Umgebungen (kein `window`-Objekt) `false` zurück.

3. **Genauigkeit**: Stützt sich auf den User Agent und kann daneben liegen, wenn der UA verändert wurde.

4. **WeChat-Versionen**: Funktioniert mit allen Versionen des WeChat-Browsers (auch dem eingebauten Browser und dem WebView der Mini-Programme).
