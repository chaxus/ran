# createObjectURL

Cria uma URL de objeto a partir de um Blob, um ArrayBuffer ou uma Response.

## API

### createObjectURL

#### Retorna

| Argumento         | Descrição                              | Tipo      |
| ----------------- | -------------------------------------- | --------- |
| `Promise<string>` | Promessa resolvida com a URL de objeto | `Promise` |

#### Parâmetros

| Parâmetro | Descrição          | Tipo                                        | Padrão      |
| --------- | ------------------ | ------------------------------------------- | ----------- |
| `src`     | A origem dos dados | `Blob \| ArrayBuffer \| Response \| string` | Obrigatório |

## Exemplo

### Uso básico (Blob)

```js
import { createObjectURL } from 'ranuts';

const blob = new Blob(['Hello World'], { type: 'text/plain' });
const url = await createObjectURL(blob);
console.log(url); // 'blob:http://example.com/...'
```

### Criar a partir de um ArrayBuffer

```js
import { createObjectURL } from 'ranuts';

const buffer = new ArrayBuffer(8);
const url = await createObjectURL(buffer);
console.log(url); // 'blob:http://example.com/...'
```

### Criar a partir de uma Response

```js
import { createObjectURL } from 'ranuts';

const response = await fetch('https://example.com/image.jpg');
const url = await createObjectURL(response);
console.log(url); // 'blob:http://example.com/...'
```

### Quando se passa uma string

```js
import { createObjectURL } from 'ranuts';

// Se receber uma string, devolve-a como está
const url = await createObjectURL('https://example.com/image.jpg');
console.log(url); // 'https://example.com/image.jpg'
```

### Pré-visualizar uma imagem

```js
import { createObjectURL } from 'ranuts';

async function previewImage(file) {
  const url = await createObjectURL(file);
  document.getElementById('preview').src = url;
}
```

## Notas

1. **É assíncrono**: devolve uma promessa, então use `await` ou `.then()`.
2. **Tipos aceitos**: Blob, ArrayBuffer, Response e string.
3. **Memória**: as URLs criadas precisam ser liberadas com `URL.revokeObjectURL()`, chamado por você.
4. **Quando usar**: é comum para pré-visualizar arquivos, gerar URLs temporárias e tratar imagens.

## requestUrlToBuffer

Traz o conteúdo de uma URL como bytes crus, via `XMLHttpRequest`. Esses bytes costumam ir para o `createObjectURL` acima, quando você precisa examiná-los ou transformá-los (conferir um número mágico, decodificar áudio) antes de virarem uma URL exibível.

```js
import { requestUrlToBuffer, createObjectURL } from 'ranuts/utils';

const result = await requestUrlToBuffer('/assets/clip.webm', {});
if (result.success) {
  const url = await createObjectURL(new Blob([result.data]));
  video.src = url;
}
```

#### Parâmetros

| Parâmetro | Descrição                                                           | Tipo                                     | Padrão      |
| --------- | ------------------------------------------------------------------- | ---------------------------------------- | ----------- |
| `src`     | A URL que será buscada                                              | `string`                                 | Obrigatório |
| `options` | `method` (padrão `'GET'`) e `responseType` (padrão `'arraybuffer'`) | `Partial<RequestUrlToArraybufferOption>` | Obrigatório |

#### Retorna

Uma `Promise` que resolve com `{ success: true, data, message: '' }` num HTTP 200 e que **rejeita** com `{ success: false, data: status, message }` nos demais casos. Uma requisição que falha é uma rejeição, não uma promessa resolvida com `success: false`, então um `.then()` sozinho, sem `.catch()`, vai fazer isso aparecer como rejeição não tratada.

::: tip Para código novo, prefira `fetch`
Isto é anterior à época em que `fetch` passou a existir em todo lugar e por dentro usa `XMLHttpRequest`. Se você não precisa de XHR especificamente (eventos de progresso de envio, `abort()`), `fetch(url).then(r =>
r.arrayBuffer())` faz o mesmo com a forma de rejeição nativa das promessas.
:::
