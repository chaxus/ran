---
description: 'Ein dreistufiges Segment-Steuerelement (System/Hell/Dunkel), das an die Theme-API von ranui angebunden ist und sich über Tabs hinweg abgleicht.'
---

# ThemeSwitch

Ein dreistufiges Segment-Steuerelement (**System / Hell / Dunkel**), angebunden an die
[Theme-API](/de/src/ranui/theme/) von ranui. Ein Klick auf ein Segment ruft `setTheme()` auf,
speichert die Wahl unter dem localStorage-Schlüssel `ran-theme` und hält jede Instanz auf der
Seite (und in anderen Tabs) im Gleichklang.

> **Nimm es, wenn** du ein fertiges Segment-Steuerelement für System/Hell/Dunkel brauchst, das an die Theme-API von ranui angebunden ist. `<r-theme-switch>` erledigt Persistenz, Systemabgleich und Tab-Synchronisation, du musst also keinen eigenen Umschalter bauen.

## Schnellstart

### Grundlegende Verwendung

<Demo>
  <r-theme-switch></r-theme-switch>
</Demo>

```html
<r-theme-switch></r-theme-switch>
```

```js
import 'ranui'; // oder der eigenständige Einstiegspunkt:
import 'ranui/theme-switch';
```

> 💡 **Auf dieser Dokumentationsseite** steuert der seitenweite Umschalter in der Kopfzeile das
> Theme und überschreibt `data-ran-theme` selbst — die Demo oben kann von der Seite also
> zurückgesetzt werden. In deiner Anwendung ist `<r-theme-switch>` die Quelle der Wahrheit.

Rufe `initTheme()` einmal beim Laden der Seite auf, damit die gespeicherte Wahl wiederhergestellt
ist, bevor der Umschalter gerendert wird:

```js
import { initTheme } from 'ranui';
initTheme();
```

## API-Referenz

### Eigenschaften

| Eigenschaft | Typ                             | Standard   | Beschreibung                                                                                               |
| ----------- | ------------------------------- | ---------- | ---------------------------------------------------------------------------------------------------------- |
| `value`     | `'system' \| 'light' \| 'dark'` | `'system'` | Aktuelle Auswahl, aus der Theme-API (`getTheme()`) gelesen. Zuweisen wendet das Theme an und speichert es. |
| `sheet`     | `string`                        | `''`       | CSS, das in das Shadow DOM der Komponente injiziert wird.                                                  |

### Attribute für die Lokalisierung

Die drei Schaltflächen zeigen nur Icons, deshalb trägt jede ein `aria-label`. Überschreibe sie zum Lokalisieren:

| Attribut       | Standard         | Beschreibung                          |
| -------------- | ---------------- | ------------------------------------- |
| `label`        | `'Theme'`        | `aria-label` der Steuergruppe.        |
| `label-system` | `'System theme'` | `aria-label` der System-Schaltfläche. |
| `label-light`  | `'Light theme'`  | `aria-label` der Hell-Schaltfläche.   |
| `label-dark`   | `'Dark theme'`   | `aria-label` der Dunkel-Schaltfläche. |

```html
<r-theme-switch
  label="Theme"
  label-system="Systemdesign"
  label-light="Helles Design"
  label-dark="Dunkles Design"
></r-theme-switch>
```

## Events

| Event    | Detail                                     | Beschreibung                                                                               |
| -------- | ------------------------------------------ | ------------------------------------------------------------------------------------------ |
| `change` | `{ theme: 'system' \| 'light' \| 'dark' }` | Wird ausgelöst, wenn der Nutzer ein Theme wählt. Bubbelt und überschreitet das Shadow DOM. |

```js
const themeSwitch = document.createElement('r-theme-switch');
themeSwitch.addEventListener('change', (e) => {
  console.log('theme is now', e.detail.theme);
});
toolbar.append(themeSwitch);
```

## Verhalten

- **Persistenz**: Auswahlen laufen über `setTheme()`, werden also im localStorage (`ran-theme`)
  gespeichert und beim nächsten Besuch von `initTheme()` wiederhergestellt.
- **Abgleich mehrerer Instanzen**: Setze einen Umschalter in die Kopfzeile und einen in die Fußzeile
  — eine Wahl an einer Stelle aktualisiert beide.
- **Abgleich über Tabs**: Ein in einem anderen Tab umgestelltes Theme aktualisiert dieses
  Steuerelement über das `storage`-Event.
- **Browser-Chrome**: Erzwungenes Hell oder Dunkel aktualisiert `<meta name="theme-color">` auf den
  aufgelösten Seitenhintergrund, damit Browser- bzw. PWA-Chrome dazu passt; die Wahl `system`
  stellt den ursprünglichen (womöglich medienabhängigen) Inhalt jedes Meta-Tags wieder her.

## CSS-Parts

| Part                        | Beschreibung                                                                        |
| --------------------------- | ----------------------------------------------------------------------------------- |
| `switch`                    | Die äußere segmentierte Pille.                                                      |
| `button`                    | Jede Auswahlschaltfläche (jede stellt ihren Auswahlnamen als weiteren Part bereit). |
| `system` / `light` / `dark` | Die einzelnen Auswahlschaltflächen.                                                 |

```css
r-theme-switch::part(switch) {
  border-color: var(--line);
}
r-theme-switch::part(dark) {
  color: rebeccapurple;
}
```

Folgende CSS-Variablen lassen sich überschreiben: `--ran-theme-switch-display`,
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

## Bewährte Praxis

- **Eine Quelle der Wahrheit**: Nimm `<r-theme-switch>`, statt einen Umschalter selbst zu bauen — er
  erledigt Persistenz, Systemabgleich, Instanzsynchronisation und die `theme-color`-Metas bereits.
- **Früh wiederherstellen**: Rufe `initTheme()` so früh wie möglich auf (idealerweise inline vor dem
  ersten Rendern), um ein Aufblitzen von Hell nach Dunkel zu vermeiden.
- **Lokalisieren**: Die Schaltflächen zeigen nur Icons; setze `label` und `label-*` für
  nicht-englische Oberflächen.
