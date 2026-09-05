# checkEncoding

Detecta a codificação de caracteres de dados em `Uint8Array`.

## API

### checkEncoding

#### Retorna

| Argumento | Descrição | Tipo |
| -------- | ---------------------- | -------- |
| `string` | A codificação detectada | `string` |

#### Parâmetros

| Parâmetro | Descrição | Tipo | Padrão |
| ------------ | -------------- | ------------ | -------- |
| `uint8Array` | Dados a analisar | `Uint8Array` | Obrigatório |

## Exemplo

### Uso básico

```js
import { checkEncoding } from 'ranuts';

const data = new Uint8Array([0x48, 0x65, 0x6c, 0x6c, 0x6f]); // "Hello"
const encoding = checkEncoding(data);
console.log(encoding); // 'UTF-8' ou outra codificação detectada
```

### Detectar a codificação de um arquivo

```js
import { checkEncoding } from 'ranuts';

async function detectFileEncoding(file) {
  const arrayBuffer = await file.arrayBuffer();
  const uint8Array = new Uint8Array(arrayBuffer);
  const encoding = checkEncoding(uint8Array);
  return encoding;
}
```

### Decodificar texto

```js
import { checkEncoding } from 'ranuts';

function decodeText(uint8Array) {
  const encoding = checkEncoding(uint8Array);
  const decoder = new TextDecoder(encoding);
  return decoder.decode(uint8Array);
}
```

## Notas

1. **Dependência**: usa a biblioteca `jschardet` para detectar a codificação.
2. **Codificação padrão**: se a detecção falhar, recorre a `'utf-8'`.
3. **Precisão**: detectar codificação não acerta 100% das vezes, sobretudo em textos curtos.
4. **Quando usar**: é comum ao tratar arquivos, decodificar texto ou converter entre codificações.
