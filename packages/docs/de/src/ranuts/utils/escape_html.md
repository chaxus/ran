# escapeHtml

Maskiert HTML-Sonderzeichen, um XSS-Angriffe zu verhindern.

## API

### escapeHtml

#### Rückgabe

| Argument | Beschreibung               | Typ      |
| -------- | -------------------------- | -------- |
| `string` | Die maskierte Zeichenkette | `string` |

#### Parameter

| Parameter | Beschreibung                | Typ                        | Standard     |
| --------- | --------------------------- | -------------------------- | ------------ |
| `string`  | Zu maskierende Zeichenkette | `string \| number \| null` | Erforderlich |

## Beispiel

### Grundlegende Verwendung

```js
import { escapeHtml } from 'ranuts';

const html = '<script>alert("XSS")</script>';
const escaped = escapeHtml(html);
console.log(escaped); // '&lt;script&gt;alert(&quot;XSS&quot;)&lt;/script&gt;'
```

### Sonderzeichen maskieren

```js
import { escapeHtml } from 'ranuts';

console.log(escapeHtml('"hello"')); // '&quot;hello&quot;'
console.log(escapeHtml("'world'")); // '&#39;world&#39;'
console.log(escapeHtml('a & b')); // 'a &amp; b'
console.log(escapeHtml('<div>')); // '&lt;div&gt;'
```

### Zahlen und null

```js
import { escapeHtml } from 'ranuts';

console.log(escapeHtml(123)); // '123'
console.log(escapeHtml(null)); // 'null'
```

### XSS-Angriffe verhindern

```js
import { escapeHtml } from 'ranuts';

const userInput = '<img src=x onerror=alert(1)>';
const safe = escapeHtml(userInput);
document.getElementById('content').textContent = safe;
// Wird gefahrlos angezeigt, das Skript läuft nicht
```

## Hinweise

1. **Maskierte Zeichen**: Folgende Zeichen werden ersetzt:
   - `"` → `&quot;`
   - `'` → `&#39;`
   - `&` → `&amp;`
   - `<` → `&lt;`
   - `>` → `&gt;`

2. **Typumwandlung**: Was keine Zeichenkette ist, wird erst umgewandelt und dann maskiert.

3. **Sicherheit**: dient dem Schutz vor XSS; nutze es, sobald du Inhalte aus Benutzereingaben anzeigst.

4. **Geschwindigkeit**: Enthält eine Zeichenkette keine Sonderzeichen, kommt sie unverändert zurück.
