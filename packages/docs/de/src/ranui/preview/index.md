---
description: 'Das Preview von ranui (<r-preview>) zeigt docx-, pptx-, pdf- und xlsx-Dateien als Online-Vorschau direkt im Browser.'
---

# Preview

Komponente für die Online-Vorschau von `docx`-, `pptx`-, `pdf`- und `xlsx`-Dateien.

> **Nimm sie, wenn** du `docx`-, `pptx`-, `pdf`- oder `xlsx`-Dateien im Browser vorschauen willst. `<r-preview>` öffnet aus einer Datei-URL einen Vorschaudialog (inzwischen als eigenständiges Paket `@ranui/preview` ausgeliefert).

> ⚠️ **Wichtiger Hinweis**: Ab Version 0.1.10-alpha-27 enthält das ranui-Paket diese Komponente nicht mehr. Wechsle zum eigenständigen Paket [@ranui/preview](https://www.npmjs.com/package/@ranui/preview).

## Schnellstart

### Installation

```bash
# Das eigenständige Vorschau-Paket verwenden (empfohlen)
npm install @ranui/preview

# Oder das komplette ranui-Paket (vor Version 0.1.10-alpha-27)
npm install ranui
```

### Grundlegende Verwendung

<div style="width: 100px; margin-top:10px">
    <r-preview id="preview-demo"></r-preview>
    <r-button type="primary" onclick="uploadFile('preview-demo')">Datei für die Vorschau wählen</r-button>
</div>

```html
<r-preview id="preview-demo"></r-preview>
<r-button type="primary" onclick="uploadFile()">Datei für die Vorschau wählen</r-button>

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

## API-Referenz

### Eigenschaften

| Eigenschaft | Typ       | Standard                    | Beschreibung                                                         |
| ----------- | --------- | --------------------------- | -------------------------------------------------------------------- |
| `src`       | `string`  | `''`                        | URL der Datei; beim Setzen öffnet sich der Vorschaudialog von selbst |
| `closeable` | `boolean` | `true`                      | Ob die Schließen-Schaltfläche gezeigt wird                           |
| `baseUrl`   | `string`  | `'https://edit.chaxus.com'` | URL des Dokument-Vorschaudienstes                                    |

### Dateiquelle `src`

Setze die URL der Datei, um den Vorschaudialog zu öffnen; ein leerer Wert zeigt ihn nicht.

```html
<r-preview src="https://example.com/document.docx"></r-preview>
```

### Schließbarkeit `closeable`

Steuert, ob sich der Vorschaudialog schließen lässt.

```html
<!-- Standardmäßig schließbar -->
<r-preview closeable="true"></r-preview>

<!-- Nicht schließbar -->
<r-preview closeable="false"></r-preview>
```

### Eigener Dienst `baseUrl`

Wenn du den Dokument-Vorschaudienst selbst betreiben willst, gib seine Adresse über die Eigenschaft `baseUrl` an.

```html
<r-preview baseUrl="https://edit.chaxus.com"></r-preview>
```

> 💡 **Tipp**: Standardmäßig wird der gehostete Vorschaudienst unter `https://edit.chaxus.com` verwendet. Zum Selbsthosten siehe [OnlyOffice Web Local](https://github.com/ranuts/document).

## Migrationsleitfaden

Wenn du derzeit die Komponente `r-preview` aus dem ranui-Paket verwendest, empfehlen wir diese Schritte:

1. **Neues Paket installieren**:

   ```bash
   npm install @ranui/preview
   ```

2. **Imports anpassen**:

   ```javascript
   // Vorher
   import 'ranui';

   // Jetzt
   import '@ranui/preview';
   ```

3. **Die Verwendung im HTML bleibt gleich**:
   ```html
   <r-preview src="your-file-url"></r-preview>
   ```
