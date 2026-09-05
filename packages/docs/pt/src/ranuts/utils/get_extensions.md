# getExtensions

Devolve o array de extensões de arquivo correspondentes a um tipo MIME.

## API

### getExtensions

#### Retorna

| Argumento | Descrição | Tipo |
| -------- | ---------------------------------- | ---------- |
| `Array` | Array de extensões (sem o ponto) | `string[]` |

#### Parâmetros

| Parâmetro | Descrição | Tipo | Padrão |
| ---------- | ----------- | -------- | -------- |
| `mimeType` | Tipo MIME | `string` | Obrigatório |

## Exemplo

### Uso básico

```js
import { getExtensions } from 'ranuts';

const exts = getExtensions('image/jpeg');
console.log(exts); // ['jpeg', 'jpg', 'jpe']
```

### Obter todas as extensões

```js
import { getExtensions } from 'ranuts';

const jsExts = getExtensions('application/javascript');
console.log(jsExts); // ['js', 'jsx', 'ts', 'tsx']
```

### Validar o tipo de arquivo

```js
import { getExtensions } from 'ranuts';

function isValidImageFile(filename, mimeType) {
  const exts = getExtensions(mimeType);
  const fileExt = filename.split('.').pop();
  return exts.includes(fileExt);
}

console.log(isValidImageFile('photo.jpg', 'image/jpeg')); // true
```

## Notas

1. **Formato devolvido**: as extensões não trazem ponto (`.`); por exemplo `'jpg'`, e não `'.jpg'`.
2. **Várias extensões**: um mesmo tipo MIME pode corresponder a várias, e todas as coincidentes são devolvidas.
3. **Array vazio**: se o tipo MIME não existir, devolve um array vazio.
4. **Quando usar**: é comum para validar tipos de arquivo, conferir uploads e afins.
