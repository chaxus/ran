---
description: 'A tira Attachments do ranui (<r-attachments>) guarda, pré-visualiza e valida os arquivos preparados junto a uma mensagem, e cuida das object URLs que cria.'
---

# Attachments

Os arquivos preparados junto a uma mensagem: o `<r-attachments>` guarda a lista, pré-visualiza,
valida o que chega e cuida das object URLs que cria.

> **Use quando** um compositor precisar mostrar o que está prestes a ser enviado. Ele **não**
> coleta arquivos: colar, arrastar e soltar e um seletor de arquivos são três gestos distintos,
> cada um pertencendo a um elemento diferente do compositor, e quais deles o seu aplicativo
> oferece é decisão sua. Chame `add()` a partir daquele que você ligar.

## Início rápido

### Uso básico

```html
<r-attachments accept="image/*,.pdf" max-size="5242880" max-count="4"></r-attachments>
```

```js
const strip = document.createElement('r-attachments');

// Um seletor de arquivos
picker.addEventListener('change', () => strip.add(picker.files));

// Colar — só quando a área de transferência realmente carrega arquivos. Interceptar todo
// colar quebra colar texto, que é para o que a caixa serve na maior parte do tempo.
input.addEventListener('paste', (event) => {
  if (event.clipboardData?.files.length) {
    event.preventDefault();
    strip.add(event.clipboardData.files);
  }
});

// Arrastar e soltar
dropZone.addEventListener('drop', (event) => {
  event.preventDefault();
  strip.add(event.dataTransfer.files);
});

composer.append(strip);
```

A tira desenha uma linha por arquivo com uma miniatura (imagens), o nome, o tamanho e um botão de
remover. `count` é refletido no host e **removido** quando a tira está vazia, em vez de virar `0`,
para que uma tira vazia não ocupe espaço:

```css
r-attachments:not([count]) {
  display: none;
}
```

### Enviando

```js
const body = new FormData();
for (const file of strip.files) body.append('files', file);
await fetch('/api/messages', { method: 'POST', body });
strip.clear();
```

`files` são só os objetos `File`, em ordem: o formato que o corpo de uma requisição quer.
`attachments` é a lista mais rica (`id`, `name`, `size`, `type`, `previewUrl`) para quando você
precisar desenhar a sua própria visão do mesmo estado.

### A recusa é comunicada, nunca silenciosa

Um arquivo que some porque passava 3 MB de um limite que ninguém mencionou é lido como um defeito da
página. Toda recusa dispara um evento com o arquivo e a regra que ele quebrou:

```js
const explain = {
  'too-large': 'Esse arquivo é maior que 5 MB.',
  'type-not-accepted': 'Esse tipo de arquivo não é aceito aqui.',
  'too-many': 'Você pode anexar no máximo 4 arquivos.',
  duplicate: 'Esse arquivo já está anexado.',
};

strip.addEventListener('attachmentrejected', (event) => {
  toast(explain[event.detail.reason]);
});
```

`duplicate` compara nome, tamanho e data de modificação juntos, do mesmo jeito que um gerenciador de
arquivos considera dois arquivos como o mesmo. Anexar o mesmo arquivo duas vezes é um deslize, não
uma instrução.

## Referência da API

### Propriedades

| Propriedade   | Atributo    | Tipo                    | Padrão  | Descrição                                                                         |
| ------------- | ----------- | ----------------------- | ------- | --------------------------------------------------------------------------------- |
| `accept`      | `accept`    | `string`                | `''`    | Tipos ou extensões separados por vírgula, no formato que `<input accept>` aceita. |
| `maxSize`     | `max-size`  | `number`                | `10 MB` | Maior arquivo aceito, em bytes.                                                   |
| `maxCount`    | `max-count` | `number`                | —       | Quantidade máxima de arquivos preparados de uma vez; ilimitado se não definido.   |
| `attachments` | —           | `readonly Attachment[]` | `[]`    | Os arquivos preparados, na ordem em que chegaram.                                 |
| `files`       | —           | `File[]`                | `[]`    | Só os arquivos, para montar o corpo de uma requisição.                            |
| `sheet`       | `sheet`     | `string`                | `''`    | CSS injetado no shadow root.                                                      |

`attachments` e `files` são visões somente leitura. Prepare arquivos por `add()`.

### Métodos

| Método       | Retorna        | Descrição                                                    |
| ------------ | -------------- | ------------------------------------------------------------ |
| `add(files)` | `Attachment[]` | Prepara um iterável de `File`; devolve os que foram aceitos. |
| `detach(id)` | `boolean`      | Remove um anexo pelo id; `false` se não havia esse id.       |
| `clear()`    | `void`         | Remove tudo e revoga as object URLs.                         |

::: tip É `detach(id)`, não `remove(id)`
Todo elemento já tem um `remove()` que não recebe argumentos e se tira do documento. Sombreá-lo com
outra semântica é uma armadilha para quem procurar o método padrão.
:::

### Eventos

| Evento               | Detail             | Despacho           | Descrição                                                                                            |
| -------------------- | ------------------ | ------------------ | ---------------------------------------------------------------------------------------------------- |
| `attachmentschange`  | `{ attachments }`  | borbulha, composed | A lista de preparados mudou.                                                                         |
| `attachmentrejected` | `{ file, reason }` | borbulha, composed | Um arquivo foi recusado. `reason` é um de `too-large`, `type-not-accepted`, `too-many`, `duplicate`. |

### Tipos

```ts
interface Attachment {
  id: string; // estável enquanto este anexo existir
  file: File;
  name: string;
  size: number;
  type: string;
  previewUrl: string | null; // object URL para imagens, null nos demais casos
}

type AttachmentRejection = 'too-large' | 'type-not-accepted' | 'too-many' | 'duplicate';
```

### Partes

`list` · `attachment` · `thumb` · `icon` · `name` · `size` · `remove`

## Como funcionam as pré-visualizações

As pré-visualizações são **object URLs, não data URLs**. Pré-visualizar custa uma referência a bytes
que o navegador já tem; ler uma foto de 10 MB para uma string base64 só para mostrar uma miniatura de
40px custa a string. Monte a data URL depois, uma única vez, em quem for enviar.

Toda URL que o elemento cria ele também revoga: ao desanexar, ao limpar e ao desconectar. Não segure
o `previewUrl` além da vida do anexo.

## Acessibilidade

O texto alternativo de uma miniatura é **o nome do arquivo**, não "imagem": quatro anexos anunciados
todos como "imagem" não disseram ao leitor nada sobre qual é qual. Cada botão de remover leva o nome
do seu arquivo pelo mesmo motivo.

## Estilos

O `<r-attachments>` expõe **17 propriedades personalizadas de CSS** próprias, além dos tokens
semânticos que lê do tema. Defina uma em qualquer lugar de onde ela seja herdada: `:root`, um
contêiner ou o próprio elemento:

```css
r-attachments {
  --ran-attachment-background: var(--ran-color-bg-subtle);
}
```

Partes: `attachment` · `icon` · `list` · `name` · `remove` · `size` · `thumb`

A lista completa está em [tokens de estilo](/pt/src/ranui/style-tokens#attachments); qual token escolher é assunto do [design system](/pt/src/ranui/design-system/).

## Boas práticas

- **Valide no servidor também.** `accept` e `max-size` são uma cortesia com quem anexa, não uma
  fronteira de segurança.
- **Limpe depois de um envio bem-sucedido**, não antes. Uma requisição que falha deve deixar os
  arquivos preparados para que se possa tentar de novo.
- **Explique toda recusa.** O evento existe para que a tira nunca descarte um arquivo em silêncio.
