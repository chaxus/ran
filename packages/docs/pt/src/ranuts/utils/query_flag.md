# queryFlag / isInIframe

Lê uma flag booleana da URL e diz se a página está embutida: as duas verificações por trás de `?embed`, `?readonly` e `?debug`.

## API

| Função                 | Descrição                                                    |
| ---------------------- | ------------------------------------------------------------ |
| `queryFlag(key, url?)` | Se um parâmetro de consulta se lê como verdadeiro            |
| `isInIframe()`         | Se esta página roda dentro de um iframe; `false` no servidor |

### `queryFlag`

| Parâmetro | Descrição                          | Tipo     | Padrão              |
| --------- | ---------------------------------- | -------- | ------------------- |
| `key`     | Nome do parâmetro                  | `string` | Obrigatório         |
| `url`     | URL completa ou string de consulta | `string` | A localização atual |

Verdadeiro para `?k`, `?k=`, `?k=1` e `?k=true` (sem diferenciar maiúsculas). Falso para todo o resto, inclusive o parâmetro ausente e um `?k=false` explícito.

## Exemplo

### Ler uma flag

```js
import { queryFlag } from 'ranuts';

queryFlag('embed', '?embed'); // true  ← a forma mais comum
queryFlag('embed', '?embed=1'); // true
queryFlag('embed', '?embed=true'); // true
queryFlag('embed', '?embed=false'); // false
queryFlag('embed', '?lang=en'); // false
```

### Detectar o modo embutido

```js
import { queryFlag, isInIframe } from 'ranuts';

// Está embutida se vier num quadro, ou se o anfitrião pediu isso expressamente.
const embedded = isInIframe() || queryFlag('embed') || queryFlag('embedded');

if (embedded) {
  document.body.classList.add('embed-mode');
}
```

### Não medir dentro da página de outra pessoa

```js
import { isInIframe } from 'ranuts';

// Medir aqui atribuiria a nós os visitantes do site anfitrião.
if (!isInIframe()) initAnalytics();
```

### Pré-visualização somente leitura

```js
import { queryFlag } from 'ranuts';

openDocument(file, { readonly: queryFlag('readonly') });
```

## Notas

1. **O comum é escrever a flag sozinha.** `?embed` não traz valor, então `getQuery(url).embed` é `''` (falso), e uma checagem de veracidade sem mais perde em silêncio justamente a forma mais comum. É para isso que `queryFlag` existe.

2. **`?k=false` é falso.** A negação explícita é respeitada, em vez de ser lida como «está presente, logo está ligado».

3. **`isInIframe` é protegida.** Ler `window.parent` pode lançar exceção entre origens distintas em alguns motores; um pai ilegível é tomado como embutido, porque é exatamente isso que ele significa.

4. **As duas são seguras no servidor.** Sem `window`, `isInIframe` é `false` e `queryFlag` é `false` a menos que uma `url` seja passada, então basta dar a URL para usá-las num script de build.
