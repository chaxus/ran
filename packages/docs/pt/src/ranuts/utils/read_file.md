# readFileAs*

Invólucros com promessas em volta do `FileReader`.

| Função                            | Resolve com   | Serve para                                                            |
| --------------------------------- | ------------- | --------------------------------------------------------------------- |
| `readFileAsArrayBuffer(blob)`     | `ArrayBuffer` | Processar binário                                                     |
| `readFileAsUint8Array(blob)`      | `Uint8Array`  | Alimentar `checkEncoding` / `arrayBufferToString`                     |
| `readFileAsText(blob, encoding?)` | `string`      | Arquivos de texto; se a codificação for desconhecida, farejo primeiro |
| `readFileAsDataURL(blob)`         | `string`      | Pré-visualização de imagens                                           |

## Exemplo

```js
import { readFileAsUint8Array, arrayBufferToString } from 'ranuts';

input.addEventListener('change', async (e) => {
  const bytes = await readFileAsUint8Array(e.target.files[0]);
  const text = arrayBufferToString(bytes); // a codificação é farejada, GBK/Big5 inclusive
});
```

## Notas

1. **As três saídas estão ligadas**: `onload`, `onerror` e `onabort`. Esquecer o `onabort` é o jeito clássico de deixar uma promessa pendente para sempre quando alguém cancela o seletor de arquivos.
2. **Rejeita com um erro claro** onde o `FileReader` não existe (Node, alguns contextos de worker).
3. **Nunca faça `new TextDecoder().decode()` num arquivo de origem desconhecida**: isso presume UTF-8 e transforma GBK/Big5 em rabisco. Use `arrayBufferToString`, que fareja antes.
