---
description: 'El Preview de ranui (<r-preview>) muestra vistas previas en línea de archivos docx, pptx, pdf y xlsx dentro del navegador.'
---

# Preview

Componente de vista previa en línea para archivos `docx`, `pptx`, `pdf` y `xlsx`.

> **Úsalo cuando** necesites previsualizar archivos `docx`, `pptx`, `pdf` o `xlsx` en el navegador. `<r-preview>` abre un diálogo de vista previa a partir de la URL de un archivo (ahora se publica como el paquete independiente `@ranui/preview`).

> ⚠️ **Aviso importante**: el paquete ranui dejará de incluir este componente a partir de la versión 0.1.10-alpha-27. Migra al paquete independiente [@ranui/preview](https://www.npmjs.com/package/@ranui/preview).

## Inicio rápido

### Instalación

```bash
# Usa el paquete de vista previa independiente (recomendado)
npm install @ranui/preview

# O el paquete ranui completo (antes de la versión 0.1.10-alpha-27)
npm install ranui
```

### Uso básico

<div style="width: 100px; margin-top:10px">
    <r-preview id="preview-demo"></r-preview>
    <r-button type="primary" onclick="uploadFile('preview-demo')">Elegir archivo para previsualizar</r-button>
</div>

```html
<r-preview id="preview-demo"></r-preview>
<r-button type="primary" onclick="uploadFile()">Elegir archivo para previsualizar</r-button>

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

## Referencia de la API

### Propiedades

| Propiedad   | Tipo      | Por defecto                 | Descripción                                                      |
| ----------- | --------- | --------------------------- | ---------------------------------------------------------------- |
| `src`       | `string`  | `''`                        | URL del archivo; al asignarla se abre automáticamente el diálogo |
| `closeable` | `boolean` | `true`                      | Si se muestra el botón de cerrar                                 |
| `baseUrl`   | `string`  | `'https://edit.chaxus.com'` | URL del servicio de vista previa de documentos                   |

### Origen del archivo `src`

Asigna la URL del archivo para abrir el diálogo de vista previa; un valor vacío no lo muestra.

```html
<r-preview src="https://example.com/document.docx"></r-preview>
```

### Cierre `closeable`

Controla si el diálogo de vista previa se puede cerrar.

```html
<!-- Se puede cerrar (valor por defecto) -->
<r-preview closeable="true"></r-preview>

<!-- No se puede cerrar -->
<r-preview closeable="false"></r-preview>
```

### Servicio propio `baseUrl`

Cuando quieras usar tu propio servicio de vista previa de documentos, indica su dirección mediante la propiedad `baseUrl`.

```html
<r-preview baseUrl="https://edit.chaxus.com"></r-preview>
```

> 💡 **Consejo**: por defecto se usa el servicio alojado en `https://edit.chaxus.com`. Para alojarlo tú mismo, consulta [OnlyOffice Web Local](https://github.com/ranuts/document).

## Guía de migración

Si ahora usas el componente `r-preview` del paquete ranui, te recomendamos migrar así:

1. **Instala el paquete nuevo**:

   ```bash
   npm install @ranui/preview
   ```

2. **Actualiza los imports**:

   ```javascript
   // Antes
   import 'ranui';

   // Ahora
   import '@ranui/preview';
   ```

3. **El uso en HTML no cambia**:
   ```html
   <r-preview src="your-file-url"></r-preview>
   ```
