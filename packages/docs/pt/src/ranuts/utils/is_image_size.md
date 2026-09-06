# isImageSize

Verifica se as dimensões de um arquivo de imagem atendem ao que se pede.

## API

### isImageSize

#### Retorna

| Argumento | Descrição | Tipo |
| ------------------ | ------------------------------------------------------------- | --------- |
| `Promise<boolean>` | Promessa resolvida indicando se as dimensões atendem | `Promise` |

#### Parâmetros

| Parâmetro | Descrição | Tipo | Padrão |
| --------- | -------------------------- | -------- | -------- |
| `file` | O objeto de arquivo de imagem | `File` | Obrigatório |
| `width` | Largura esperada (opcional) | `number` | Opcional |
| `height` | Altura esperada (opcional) | `number` | Opcional |

## Exemplo

### Uso básico

```js
import { isImageSize } from 'ranuts';

const fileInput = document.getElementById('fileInput');
fileInput.addEventListener('change', async (e) => {
  const file = e.target.files[0];
  if (file) {
    try {
      // Conferir se a largura é 800
      const isValid = await isImageSize(file, 800);
      if (isValid) {
        console.log('A largura da imagem atende');
      } else {
        console.log('A largura da imagem não atende');
      }
    } catch (error) {
      console.error('A conferência falhou:', error);
    }
  }
});
```

### Conferir largura e altura

```js
import { isImageSize } from 'ranuts';

async function validateImage(file) {
  // Conferir se é 800x600
  const isValid = await isImageSize(file, 800, 600);
  return isValid;
}
```

### Conferir só a altura

```js
import { isImageSize } from 'ranuts';

const isValid = await isImageSize(file, undefined, 600);
// Confere apenas se a altura é 600
```

### Validar antes de enviar

```js
import { isImageSize } from 'ranuts';

async function handleFileUpload(file) {
  const isValid = await isImageSize(file, 1920, 1080);
  if (!isValid) {
    alert('A imagem precisa medir 1920x1080');
    return;
  }
  // Seguir com o envio
}
```

## Comportamento

1. **Se você der `width` e `height`, as duas precisam bater.** Se não der nenhuma, confere apenas se o arquivo decodifica como imagem.
2. **Uma falha ao decodificar rejeita** (arquivo corrompido, algo que não é imagem) em vez de deixar a promessa pendente.
3. **A URL de objeto é sempre liberada**, tanto no sucesso quanto na falha, de modo que validar muitos arquivos não vai deixando URLs de blob penduradas até se sair da página.
4. **Só no navegador**: sob renderização no servidor, rejeita com um erro claro.

::: warning Corrigido na 0.3
Antes, a segunda condição atropelava a primeira, então passar `width` e `height` juntas ignorava `width` em silêncio; não havia `onerror`, de modo que um arquivo corrompido deixava a promessa pendente para sempre; e a proteção para o servidor chamava `reject` sem retornar, seguia adiante, tocava em `window` e lançava um `ReferenceError`.
:::

## Notas

1. **É assíncrono**: devolve uma promessa, então use `await` ou `.then()`.

2. **Sobre os argumentos**:
   - Se só der `width`, confere apenas a largura
   - Se só der `height`, confere apenas a altura
   - Se der os dois, ambos precisam bater

3. **No servidor**: rejeita em ambientes de servidor (sem objeto `window`).

4. **Limpeza de memória**: a função libera por dentro a URL de objeto que criou; não é preciso fazer nada à mão.

5. **Quando usar**: é comum para validar dimensões antes de enviar um arquivo, conferir o tamanho de um avatar e afins.
