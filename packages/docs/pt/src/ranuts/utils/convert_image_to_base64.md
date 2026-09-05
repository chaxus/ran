# convertImageToBase64

Converte um arquivo de imagem em uma string codificada em Base64.

## API

### convertImageToBase64

#### Retorna

| Argumento | Descrição | Tipo |
| ------------------------------------- | -------------------------------------- | --------- |
| `Promise<convertImageToBase64Return>` | Promessa resolvida com o objeto de resultado | `Promise` |

#### convertImageToBase64Return

| Propriedade | Descrição | Tipo |
| --------- | ------------------ | ------------------------------- |
| `success` | Se deu certo | `boolean` |
| `data` | Os dados em Base64 | `string \| ArrayBuffer \| null` |
| `message` | Mensagem de erro | `string` |

#### Parâmetros

| Parâmetro | Descrição | Tipo | Padrão |
| --------- | ----------------- | ------ | -------- |
| `file` | O objeto de arquivo de imagem | `File` | Obrigatório |

## Exemplo

### Uso básico

```js
import { convertImageToBase64 } from 'ranuts';

const fileInput = document.getElementById('fileInput');
fileInput.addEventListener('change', async (e) => {
  const file = e.target.files[0];
  if (file) {
    try {
      const result = await convertImageToBase64(file);
      if (result.success) {
        console.log('Base64:', result.data);
        // Serve direto para o src de uma img
        document.getElementById('preview').src = result.data;
      }
    } catch (error) {
      console.error('A conversão falhou:', error);
    }
  }
});
```

### Pré-visualizar antes de enviar

```js
import { convertImageToBase64 } from 'ranuts';

async function previewImage(file) {
  const result = await convertImageToBase64(file);
  if (result.success) {
    return result.data; // data:image/jpeg;base64,...
  }
  throw new Error('A conversão da imagem falhou');
}
```

### Tratamento de erros

```js
import { convertImageToBase64 } from 'ranuts';

try {
  const result = await convertImageToBase64(file);
  if (!result.success) {
    console.error('Erro:', result.message);
  }
} catch (error) {
  console.error('Exceção:', error);
}
```

## Notas

1. **É assíncrono**: devolve uma promessa, então use `await` ou `.then()`.

2. **Tipos de arquivo**: aceita todos os formatos de imagem que o navegador aceitar (JPEG, PNG, GIF, WebP e afins).

3. **Formato dos dados**: o `data` devolvido é uma Data URL completa (`data:image/jpeg;base64,...`), pronta para o atributo `src` de uma tag `img`.

4. **Erros**: se a conversão falhar, a promessa é rejeitada; é preciso capturar.

5. **Quando usar**: é comum para pré-visualizar imagens, tratá-las antes do envio e guardá-las localmente.
