# transformText

Converte um `ArrayBuffer` em texto: detecta a codificação e decodifica.

## API

### transformText

#### Retorna

| Argumento                    | Descrição                              | Tipo                         |
| ---------------------------- | -------------------------------------- | ---------------------------- |
| `TransformText \| undefined` | O objeto com o resultado, ou undefined | `TransformText \| undefined` |

#### TransformText

| Propriedade | Descrição               | Tipo     |
| ----------- | ----------------------- | -------- |
| `encoding`  | A codificação detectada | `string` |
| `content`   | O texto decodificado    | `string` |

#### Parâmetros

| Parâmetro | Descrição                    | Tipo                    | Padrão      |
| --------- | ---------------------------- | ----------------------- | ----------- |
| `content` | Conteúdo que será convertido | `string \| ArrayBuffer` | Obrigatório |

## Exemplo

### Uso básico

```js
import { transformText } from 'ranuts';

const arrayBuffer = new TextEncoder().encode('Hello World').buffer;
const result = transformText(arrayBuffer);
if (result) {
  console.log('Codificação:', result.encoding);
  console.log('Conteúdo:', result.content); // 'Hello World'
}
```

### Processar um arquivo

```js
import { transformText } from 'ranuts';

async function readTextFile(file) {
  const arrayBuffer = await file.arrayBuffer();
  const result = transformText(arrayBuffer);
  if (result) {
    return result.content;
  }
  return null;
}
```

### Detecção automática da codificação

```js
import { transformText } from 'ranuts';

// Detecta a codificação e decodifica
const result = transformText(arrayBuffer);
if (result) {
  console.log(`Decodificado com a codificação ${result.encoding}`);
  console.log(result.content);
}
```

## Notas

1. **Detecção automática**: usa o `jschardet` para descobrir a codificação.
2. **Só `ArrayBuffer`**: por ora aceita apenas `ArrayBuffer`; com uma string emite um aviso.
3. **Quando devolve algo**: só quando detecta a codificação e a decodificação dá certo; fora isso devolve `undefined`.
4. **Quando usar**: é comum ao ler arquivos, decodificar texto e converter entre codificações.
