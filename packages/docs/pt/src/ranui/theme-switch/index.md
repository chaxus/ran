---
description: 'Um select de temas de cor (system / light / dark) ligado à API de tema do ranui.'
---

# ThemeSwitch

Um **select** compacto de temas de cor (**system / light / dark**) ligado à
[API de tema](/pt/ranui/theme/) do ranui. Escolher uma opção chama `setTheme()`, persiste em
`ran-theme` e mantém as instâncias sincronizadas. Estilo / vidro líquido é outro eixo: use
`<r-surface-switch>`.

> **Usar quando** precisar de um controlo pronto de tema de cor.

## Início rápido

### Uso básico

<ran-demo>
  <r-theme-switch></r-theme-switch>
</ran-demo>

```html
<r-theme-switch></r-theme-switch>
```

```js
import 'ranui';
import 'ranui/theme-switch';
```

Chame `initTheme()` uma vez no carregamento da página.

```js
import { initTheme } from 'ranui';
initTheme();
```

## Referência da API

### Propriedades

| Propriedade | Tipo                            | Predefinição | Descrição                                               |
| ----------- | ------------------------------- | ------------ | ------------------------------------------------------- |
| `value`     | `'system' \| 'light' \| 'dark'` | `'system'`   | Tema atual de `getTheme()`. Atribuir aplica e persiste. |
| `sheet`     | `string`                        | `''`         | CSS injetado no Shadow DOM.                             |

### Atributos de localização

| Atributo       | Predefinição | Descrição               |
| -------------- | ------------ | ----------------------- |
| `label`        | `'Theme'`    | `aria-label` do select. |
| `label-system` | `'System'`   | Texto da opção system.  |
| `label-light`  | `'Light'`    | Texto da opção light.   |
| `label-dark`   | `'Dark'`     | Texto da opção dark.    |

## Eventos

| Evento   | Detail                                     | Descrição                                         |
| -------- | ------------------------------------------ | ------------------------------------------------- |
| `change` | `{ theme: 'system' \| 'light' \| 'dark' }` | Ao escolher um tema. Borbulha e cruza Shadow DOM. |

## Partes CSS

| Parte                       | Descrição             |
| --------------------------- | --------------------- |
| `select`                    | O `r-select` interno. |
| `option`                    | Cada `r-option`.      |
| `system` / `light` / `dark` | As opções.            |

```css
r-theme-switch {
  --ran-theme-switch-width: 9rem;
}
```
