---
description: 'O Preview do ranui (<r-preview>) exibe pré-visualizações on-line de arquivos docx, pptx, pdf e xlsx dentro do navegador.'
---

# Preview

Componente de pré-visualização on-line para arquivos `docx`, `pptx`, `pdf` e `xlsx`.

> **Use quando** precisar pré-visualizar arquivos `docx`, `pptx`, `pdf` ou `xlsx` no navegador. O `<r-preview>` abre um diálogo de pré-visualização a partir da URL de um arquivo (agora publicado como o pacote independente `@ranui/preview`).

> ⚠️ **Aviso importante**: o pacote ranui deixará de fornecer este componente a partir da versão 0.1.10-alpha-27. Migre para o pacote independente [@ranui/preview](https://www.npmjs.com/package/@ranui/preview).

## Início rápido

### Instalação

```bash
# Use o pacote de pré-visualização independente (recomendado)
npm install @ranui/preview

# Ou o pacote ranui completo (antes da versão 0.1.10-alpha-27)
npm install ranui
```

### Uso básico

<div style="width: 100px; margin-top:10px">
    <r-preview id="preview-demo"></r-preview>
    <r-button type="primary" onclick="uploadFile('preview-demo')">Escolher arquivo para pré-visualizar</r-button>
</div>

```html
<r-preview id="preview-demo"></r-preview>
<r-button type="primary" onclick="uploadFile()">Escolher arquivo para pré-visualizar</r-button>

<script>
  const uploadFile = () => {
    const preview = document.getElementById('preview-demo');
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', '.docx,.pptx,.pdf,.xlsx');
    input.click();

    input.onchange = (e) => {
      const { files = [] } = input;
      if (files.length > 0) {
        const file = files[0];
        const url = URL.createObjectURL(file);
        preview.setAttribute('src', url);
      }
    };
  };
</script>
```

## Referência da API

### Propriedades

| Propriedade | Tipo      | Padrão                      | Descrição                                                       |
| ----------- | --------- | --------------------------- | --------------------------------------------------------------- |
| `src`       | `string`  | `''`                        | URL do arquivo; ao defini-la o diálogo de pré-visualização abre |
| `closeable` | `boolean` | `true`                      | Se o botão de fechar é exibido                                  |
| `baseUrl`   | `string`  | `'https://edit.chaxus.com'` | URL do serviço de pré-visualização de documentos                |

### Origem do arquivo `src`

Defina a URL do arquivo para abrir o diálogo de pré-visualização; um valor vazio não o exibe.

```html
<r-preview src="https://example.com/document.docx"></r-preview>
```

### Fechamento `closeable`

Controla se o diálogo de pré-visualização pode ser fechado.

```html
<!-- Pode ser fechado (padrão) -->
<r-preview closeable="true"></r-preview>

<!-- Não pode ser fechado -->
<r-preview closeable="false"></r-preview>
```

### Serviço próprio `baseUrl`

Quando quiser usar o seu próprio serviço de pré-visualização de documentos, informe o endereço dele pela propriedade `baseUrl`.

```html
<r-preview baseUrl="https://edit.chaxus.com"></r-preview>
```

> 💡 **Dica**: por padrão usa-se o serviço hospedado em `https://edit.chaxus.com`. Para hospedá-lo você mesmo, veja [OnlyOffice Web Local](https://github.com/ranuts/document).

## Guia de migração

Se você usa hoje o componente `r-preview` do pacote ranui, recomendamos migrar assim:

1. **Instale o pacote novo**:

   ```bash
   npm install @ranui/preview
   ```

2. **Atualize os imports**:

   ```javascript
   // Antes
   import 'ranui';

   // Agora
   import '@ranui/preview';
   ```

3. **O uso em HTML continua o mesmo**:
   ```html
   <r-preview src="your-file-url"></r-preview>
   ```
