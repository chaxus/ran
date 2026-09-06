# zip

Lê e altera arquivos ZIP sem dependências, usando o próprio DEFLATE da plataforma.

O ZIP é o contêiner por trás do OOXML (`.docx`, `.xlsx`, `.pptx`), do EPUB, do ODF e das extensões de navegador. «Tire um arquivo daqui de dentro» e «reescreva um arquivo daqui de dentro» aparecem o tempo todo, e uma biblioteca ZIP inteira é uma dependência enorme para isso. Tudo de que essas duas tarefas precisam é o diretório central mais o DEFLATE, e o DEFLATE hoje vem em todos os navegadores como `DecompressionStream`.

## API

| Função                             | Descrição                                                                  |
| ---------------------------------- | -------------------------------------------------------------------------- |
| `readZipEntries(bytes)`            | Analisa o diretório central e devolve `ZipEntry[]`; `[]` se não for um ZIP |
| `readZipEntry(bytes, nameOrEntry)` | Descomprime uma entrada; `null` se faltar ou não houver suporte            |
| `zipHasEntry(bytes, name)`         | Se existe uma entrada com exatamente esse nome                             |
| `rewriteZip(bytes, options)`       | Remonta o arquivo com entradas substituídas ou novas acrescentadas         |
| `createZip(files)`                 | Monta um arquivo do zero, com todas as entradas STORED                     |
| `crc32(data)`                      | O CRC32 da IEEE, a soma de verificação que o ZIP guarda por entrada        |
| `inflateRaw(data)`                 | Descomprime bytes DEFLATE crus (sem invólucro zlib ou gzip)                |

### `rewriteZip` options

| Opção       | Descrição                                                                              | Padrão            |
| ----------- | -------------------------------------------------------------------------------------- | ----------------- |
| `filter`    | Quais entradas são descomprimidas e passadas ao `transform`                            | todos os arquivos |
| `transform` | `(data, entry) => Uint8Array \| string \| null`; com `null` a entrada fica como estava | —                 |
| `inject`    | Entradas totalmente novas a acrescentar: `{ name, data }[]`                            | —                 |

### `ZipEntry`

| Campo                                       | Descrição                                                             |
| ------------------------------------------- | --------------------------------------------------------------------- |
| `name`                                      | O caminho dentro do arquivo, por exemplo `word/document.xml`          |
| `compression`                               | `ZIP_STORED` (0) ou `ZIP_DEFLATE` (8)                                 |
| `crc`, `compressedSize`, `uncompressedSize` | Como constam no diretório central                                     |
| `modTime`, `modDate`                        | Carimbo de tempo empacotado ao estilo MS-DOS; preservado na reescrita |
| `directory`                                 | Se o nome termina em `/`                                              |
| `dataStart`                                 | Onde começam os bytes comprimidos dentro da origem                    |

## Exemplo

### Tirar um arquivo de um `.docx`

```js
import { readZipEntry } from 'ranuts';

const bytes = new Uint8Array(await file.arrayBuffer());
const xml = await readZipEntry(bytes, 'word/document.xml');
if (xml) {
  const doc = new DOMParser().parseFromString(new TextDecoder().decode(xml), 'text/xml');
}
```

### Listar o que há dentro

```js
import { readZipEntries } from 'ranuts';

for (const entry of readZipEntries(bytes)) {
  if (entry.directory) continue;
  console.log(entry.name, entry.uncompressedSize);
}
```

### Retocar todas as partes XML e acrescentar um arquivo

```js
import { rewriteZip } from 'ranuts';

const patched = await rewriteZip(bytes, {
  filter: (entry) => entry.name.endsWith('.xml'),
  transform: (data) => new TextDecoder().decode(data).replace(/&amp;#10;/g, '&#10;'),
  inject: [{ name: 'meta.json', data: JSON.stringify({ patched: true }) }],
});
```

### Extrair a mídia embutida como URLs de objeto

```js
import { readZipEntries, readZipEntry, getMime } from 'ranuts';

const media = {};
for (const entry of readZipEntries(bytes)) {
  if (!entry.name.startsWith('word/media/')) continue;
  const data = await readZipEntry(bytes, entry);
  if (!data) continue;
  const ext = entry.name.split('.').pop();
  media[entry.name] = URL.createObjectURL(new Blob([data], { type: getMime(`.${ext}`) }));
}
```

### Montar um contêiner

```js
import { createZip } from 'ranuts';

const zip = createZip([
  { name: 'mimetype', data: 'application/epub+zip' },
  { name: 'META-INF/container.xml', data: containerXml },
]);
```

## Notas

1. **Lê STORED e DEFLATE.** Os demais métodos de compressão aparecem em `readZipEntries`, mas o `readZipEntry` devolve `null` para eles em vez de chutar.

2. **O que é reescrito sai sem compressão.** As entradas substituídas e as acrescentadas são gravadas como STORED, então a saída fica maior que a entrada. As entradas intocadas mantêm os bytes comprimidos originais, copiados tal e qual. É a troca certa para retocar e entregar, e a errada para arquivar.

3. **`rewriteZip` devolve o array original quando nada mudou**, inclusive quando uma transformação devolve bytes idênticos. Esse caminho não custa nada e o resultado pode ser comparado com `===`.

4. **Os tamanhos vêm do diretório central, nunca dos cabeçalhos locais.** Arquivos gravados por um escritor em fluxo ligam o bit 3 de uso geral e deixam zeros no cabeçalho local, colocando os valores reais num descritor de dados _depois_ dos bytes comprimidos. Confiar nos cabeçalhos locais é o jeito mais comum de um leitor de ZIP feito à mão quebrar com arquivos reais; o `rewriteZip` também grava cabeçalhos locais novos e apaga esse bit, de modo que a saída dele é legível até por analisadores rigorosos.

5. **Se a transformação falha, a entrada é preservada.** Se o `transform` lançar, ou se a entrada usar um método sem suporte, o conteúdo original é copiado adiante: uma reescrita nunca deve perder dados que não conseguiu entender.

6. **Sem ZIP64, sem criptografia, sem múltiplos discos.** Arquivos acima de 4 GiB ou com mais de 65535 entradas ficam de fora. O `readZipEntries` devolve `[]` para qualquer coisa que não consiga analisar, em vez de lançar, porque quem chama costuma estar examinando um arquivo fornecido por outra pessoa.

7. **`inflateRaw` precisa de `DecompressionStream`**: existe em todos os navegadores atuais e no Node 18 ou mais novo. Onde a API faltar, ele lança.
