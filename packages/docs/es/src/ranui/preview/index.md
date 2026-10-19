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
    <r-button type="primary" data-preview-upload="preview-demo">Elegir archivo para previsualizar</r-button>
</div>

```html
<r-preview id="preview-demo"></r-preview>
<r-button type="primary" onclick="uploadFile()">Elegir archivo para previsualizar</r-button>

<script>
  let selectedUrl;
  const uploadFile = () => {
    const preview = document.getElementById('preview-demo');
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', '.docx,.pptx,.pdf,.xlsx,.xls');
    input.click();

    input.onchange = (e) => {
      const { files = [] } = input;
      if (files.length > 0) {
        const file = files[0];
        if (selectedUrl) URL.revokeObjectURL(selectedUrl);
        selectedUrl = URL.createObjectURL(file);
        preview.setAttribute('src', selectedUrl);
      }
    };
  };
  window.addEventListener('pagehide', (event) => {
    if (!event.persisted && selectedUrl) URL.revokeObjectURL(selectedUrl);
  });
</script>
```

## Referencia de la API

### Propiedades

| Atributo / propiedad   | Tipo      | Predeterminado            | Descripción                                           |
| ---------------------- | --------- | ------------------------- | ----------------------------------------------------- |
| `src`                  | `string`  | —                         | URL del archivo; al establecerla se abre el diálogo   |
| `closeable`            | `string`  | —                         | La cadena false desactiva el botón de cierre y Escape |
| `baseUrl` / `baseurl`  | `string`  | `https://edit.chaxus.com` | URL de la página del editor de Office                 |
| `readonly`             | `boolean` | `false`                   | Modo de solo lectura opcional para Office             |
| `pdf-mode` / `pdfMode` | `string`  | `eager`                   | Modo PDF: eager o virtual                             |
| `label`                | `string`  | `Preview file`            | Nombre accesible del activador                        |

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

## Compatibilidad con 0.3.0

0.3.0 mantiene el registro automático y la edición de Office por defecto. En el modo PDF predeterminado `eager`, `load` se emite cuando se han dibujado todas las páginas. Con `pdf-mode="virtual"` (JavaScript: `pdfMode = 'virtual'`) se renderiza el área visible; `load` indica que la primera vista y su búfer están listos. El worker permanece activo hasta cerrar, cambiar el origen o eliminar el elemento. Cambiar `readonly` o `closeable` conserva el editor de Office y los cambios sin guardar.

```html
<r-preview pdf-mode="virtual" src="/reports/long.pdf"></r-preview>
<r-preview readonly src="/reports/annual.docx"></r-preview>
```

Los PDF se renderizan localmente. Los archivos de Office se entregan al iframe del editor configurado, cuya página puede acceder al contenido. Usa tu propio despliegue `baseUrl` para documentos privados o de intranet.

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
