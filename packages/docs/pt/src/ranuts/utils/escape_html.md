# escapeHtml

Escapa os caracteres especiais de HTML para prevenir ataques XSS.

## API

### escapeHtml

#### Retorna

| Argumento | Descrição         | Tipo     |
| --------- | ----------------- | -------- |
| `string`  | A string escapada | `string` |

#### Parâmetros

| Parâmetro | Descrição        | Tipo                       | Padrão      |
| --------- | ---------------- | -------------------------- | ----------- |
| `string`  | String a escapar | `string \| number \| null` | Obrigatório |

## Exemplo

### Uso básico

```js
import { escapeHtml } from 'ranuts';

const html = '<script>alert("XSS")</script>';
const escaped = escapeHtml(html);
console.log(escaped); // '&lt;script&gt;alert(&quot;XSS&quot;)&lt;/script&gt;'
```

### Escapar caracteres especiais

```js
import { escapeHtml } from 'ranuts';

console.log(escapeHtml('"hello"')); // '&quot;hello&quot;'
console.log(escapeHtml("'world'")); // '&#39;world&#39;'
console.log(escapeHtml('a & b')); // 'a &amp; b'
console.log(escapeHtml('<div>')); // '&lt;div&gt;'
```

### Números e null

```js
import { escapeHtml } from 'ranuts';

console.log(escapeHtml(123)); // '123'
console.log(escapeHtml(null)); // 'null'
```

### Prevenir ataques XSS

```js
import { escapeHtml } from 'ranuts';

const userInput = '<img src=x onerror=alert(1)>';
const safe = escapeHtml(userInput);
document.getElementById('content').textContent = safe;
// Exibição segura; o script não é executado
```

## Notas

1. **Caracteres escapados**: os seguintes são escapados:
   - `"` → `&quot;`
   - `'` → `&#39;`
   - `&` → `&amp;`
   - `<` → `&lt;`
   - `>` → `&gt;`

2. **Conversão de tipo**: o que não é string é convertido para string antes de ser escapado.

3. **Segurança**: serve para prevenir ataques XSS; use sempre que exibir conteúdo vindo do usuário.

4. **Desempenho**: se a string não tem caracteres especiais, ela volta como está.
