# setMime

Define ou atualiza o mapeamento de tipos MIME.

## API

### setMime

#### Retorna

| Argumento             | Descrição                              | Tipo                  |
| --------------------- | -------------------------------------- | --------------------- |
| `Map<string, string>` | O `Map` com o mapeamento de tipos MIME | `Map<string, string>` |

#### Parâmetros

| Parâmetro  | Descrição           | Tipo     | Padrão      |
| ---------- | ------------------- | -------- | ----------- |
| `ext`      | Extensão do arquivo | `string` | Obrigatório |
| `mimeType` | Tipo MIME           | `string` | Obrigatório |

## Exemplo

### Uso básico

```js
import { setMime, getMime } from 'ranuts';

// Definir um tipo MIME próprio
setMime('.myext', 'application/x-my-custom-type');

// Ler o tipo MIME
const mime = getMime('.myext');
console.log(mime); // 'application/x-my-custom-type'
```

### Atualizar um tipo existente

```js
import { setMime, getMime } from 'ranuts';

// Mudar o tipo MIME de .js
setMime('.js', 'application/javascript-custom');

const mime = getMime('script.js');
console.log(mime); // 'application/javascript-custom'
```

### Acrescentar um tipo novo

```js
import { setMime } from 'ranuts';

// Acrescentar o mapeamento de um novo tipo de arquivo
setMime('.xyz', 'application/x-xyz-format');
```

## Notas

1. **Alcance global**: o que você define vale para todo o mapeamento de tipos MIME, e com ele para qualquer lugar que use `getMime`.
2. **Sobrescreve**: se a extensão já existia, o tipo MIME anterior se perde.
3. **Valor devolvido**: devolve o `Map` inteiro, então dá para continuar operando sobre ele.
4. **Quando usar**: é comum para registrar tipos MIME de formatos próprios.

## MimeType

O `Map<string, string>` de base que `getMime`, `setMime` e `getExtensions` leem e escrevem. Importe-o direto se quiser percorrer todos os pares extensão/tipo conhecidos em vez de consultar um.

```js
import { MimeType } from 'ranuts/utils';

MimeType.get('.pdf'); // 'application/pdf'
MimeType.size; // total de extensões conhecidas
[...MimeType.entries()].filter(([, type]) => type.startsWith('image/'));
```

É a mesma instância de `Map` que o `setMime` altera, então as mudanças feitas por ele aparecem aqui na hora, e vice-versa. Alterá-lo direto também funciona; `setMime` é só uma porta de entrada com nome para o caso mais comum.
