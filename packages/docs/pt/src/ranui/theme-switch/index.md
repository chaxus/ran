---
description: 'Um controle segmentado de três estados (sistema/claro/escuro) ligado à API de temas do ranui e sincronizado entre abas.'
---

# ThemeSwitch

Um controle segmentado de três estados (**sistema / claro / escuro**) ligado à
[API de temas](/pt/src/ranui/theme/) do ranui. Clicar num segmento chama `setTheme()`, guarda a
escolha na chave de localStorage `ran-theme` e mantém sincronizadas todas as instâncias da página
(e de outras abas).

> **Use quando** precisar de um controle segmentado sistema/claro/escuro já ligado à API de temas do ranui. O `<r-theme-switch>` cuida da persistência, do acompanhamento do sistema e da sincronização entre abas, então você não precisa montar um alternador na mão.

## Início rápido

### Uso básico

<Demo>
  <r-theme-switch></r-theme-switch>
</Demo>

```html
<r-theme-switch></r-theme-switch>
```

```js
import 'ranui'; // ou a entrada independente:
import 'ranui/theme-switch';
```

> 💡 **Neste site de documentação** o tema é comandado pelo alternador global do cabeçalho, que
> reescreve `data-ran-theme` por conta própria, então o site pode reiniciar a demonstração acima.
> No seu aplicativo, o `<r-theme-switch>` é a fonte da verdade.

Chame `initTheme()` uma vez no carregamento da página para que a escolha salva seja restaurada
antes de o controle ser desenhado:

```js
import { initTheme } from 'ranui';
initTheme();
```

## Referência da API

### Propriedades

| Propriedade | Tipo                            | Padrão     | Descrição                                                                                |
| ----------- | ------------------------------- | ---------- | ---------------------------------------------------------------------------------------- |
| `value`     | `'system' \| 'light' \| 'dark'` | `'system'` | Seleção atual, lida da API de temas (`getTheme()`). Atribuí-la aplica e persiste o tema. |
| `sheet`     | `string`                        | `''`       | CSS injetado no shadow DOM do componente.                                                |

### Atributos de localização

Os três botões são só ícone, então cada um carrega um `aria-label`. Sobrescreva-os para traduzir:

| Atributo       | Padrão           | Descrição                          |
| -------------- | ---------------- | ---------------------------------- |
| `label`        | `'Theme'`        | `aria-label` do grupo de controle. |
| `label-system` | `'System theme'` | `aria-label` do botão de sistema.  |
| `label-light`  | `'Light theme'`  | `aria-label` do botão claro.       |
| `label-dark`   | `'Dark theme'`   | `aria-label` do botão escuro.      |

```html
<r-theme-switch
  label="Tema"
  label-system="Tema do sistema"
  label-light="Tema claro"
  label-dark="Tema escuro"
></r-theme-switch>
```

## Eventos

| Evento   | Detail                                     | Descrição                                                                  |
| -------- | ------------------------------------------ | -------------------------------------------------------------------------- |
| `change` | `{ theme: 'system' \| 'light' \| 'dark' }` | Disparado quando o usuário escolhe um tema. Borbulha e cruza o shadow DOM. |

```js
const themeSwitch = document.createElement('r-theme-switch');
themeSwitch.addEventListener('change', (e) => {
  console.log('theme is now', e.detail.theme);
});
toolbar.append(themeSwitch);
```

## Comportamento

- **Persistência**: as seleções passam por `setTheme()`, então são salvas no localStorage
  (`ran-theme`) e restauradas por `initTheme()` na próxima visita.
- **Sincronização entre instâncias**: coloque um controle no cabeçalho e outro no rodapé; escolher
  um tema em qualquer um atualiza os dois.
- **Sincronização entre abas**: um tema trocado em outra aba atualiza este controle pelo evento
  `storage`.
- **Cromo do navegador**: forçar claro ou escuro atualiza `<meta name="theme-color">` para o fundo
  de página resolvido, de modo que o cromo do navegador ou do PWA combine; escolher `system`
  restaura o conteúdo original de cada meta (que pode ter condição de mídia).

## Partes CSS

| Parte                       | Descrição                                                                    |
| --------------------------- | ---------------------------------------------------------------------------- |
| `switch`                    | A pílula segmentada externa.                                                 |
| `button`                    | Cada botão de escolha (cada um expõe também seu nome de escolha como parte). |
| `system` / `light` / `dark` | Os botões de escolha individuais.                                            |

```css
r-theme-switch::part(switch) {
  border-color: var(--line);
}
r-theme-switch::part(dark) {
  color: rebeccapurple;
}
```

Estas variáveis CSS podem ser sobrescritas: `--ran-theme-switch-display`,
`--ran-theme-switch-gap`, `--ran-theme-switch-padding`, `--ran-theme-switch-border-color`,
`--ran-theme-switch-radius`, `--ran-theme-switch-background`, `--ran-theme-switch-button-size`,
`--ran-theme-switch-icon-size`, `--ran-theme-switch-button-color`, `--ran-theme-switch-button-hover-color`,
`--ran-theme-switch-button-active-background`, `--ran-theme-switch-button-active-color`,
`--ran-theme-switch-button-focus-outline`.

```css
r-theme-switch {
  --ran-theme-switch-button-size: 32px;
  --ran-theme-switch-icon-size: 18px;
}
```

## Boas práticas

- **Uma única fonte da verdade**: use o `<r-theme-switch>` em vez de montar um alternador na mão;
  ele já cuida da persistência, do acompanhamento do sistema, da sincronização entre instâncias e
  das metas `theme-color`.
- **Restaure cedo**: chame `initTheme()` o mais cedo possível (idealmente inline, antes da primeira
  pintura) para evitar um lampejo de claro para escuro.
- **Traduza**: os botões são só ícone; defina `label` e `label-*` para interfaces que não estejam
  em inglês.
