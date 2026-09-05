---
description: 'Ein routerbewusster Anker, der die Navigation innerhalb der App abfängt und externe Links an den Browser durchreicht.'
---

# Link

Routerbewusster Anker, der ein `<a>` um seinen Slot-Inhalt legt und die Navigation innerhalb der App abfängt.

> **Nimm ihn, wenn** du einen Anker brauchst, der interne Pfade über den ranui-Router leitet und externe Links an den Browser durchreicht: `<r-link>` fängt die App-interne Navigation ab und erledigt `push` bzw. `replace` für dich.

## Schnellstart

### Grundlegende Verwendung

<Demo>
  <r-link href="/getting-started">Erste Schritte</r-link>
</Demo>

```html
<r-link href="/getting-started">Erste Schritte</r-link>
```

Wird ein interner `href` geklickt, übergibt der Link den Pfad an den aktiven ranui-Router (`push`, oder `replace`, wenn das Attribut `replace` gesetzt ist). Externe Links (`https://`, `//`, `mailto:`, `tel:`) und Klicks mit Modifikator (mittlere Taste, Strg/Cmd/Umschalt/Alt) gehen wie gewohnt an den Browser. Ist kein Router registriert, löst er stattdessen ein bubbelndes, `composed`-Event `ran-navigate` aus.

## API-Referenz

### Eigenschaften

| Eigenschaft | Typ       | Standard | Beschreibung                                                                                |
| ----------- | --------- | -------- | ------------------------------------------------------------------------------------------- |
| `href`      | `string`  | `''`     | Navigationsziel. Interne Pfade werden in der App geroutet, externe URLs navigieren normal   |
| `replace`   | `boolean` | `false`  | Wenn gesetzt, ersetzt die App-interne Navigation den aktuellen Verlaufseintrag (nur lesbar) |
| `sheet`     | `string`  | `''`     | CSS, das in das Shadow DOM des Links injiziert wird                                         |

### Navigationsziel `href`

Interne Pfade werden in der App geroutet; absolute URLs sowie `mailto:`- und `tel:`-Links navigieren normal.

<Demo>
  <r-link href="/docs">Interner Link</r-link>
  <r-link href="https://example.com">Externer Link</r-link>
</Demo>

```html
<r-link href="/docs">Interner Link</r-link> <r-link href="https://example.com">Externer Link</r-link>
```

### Verlauf ersetzen `replace`

Boolesches Attribut. Wenn gesetzt, ersetzt die App-interne Navigation den aktuellen Verlaufseintrag (`router.replace`), statt einen neuen anzulegen.

<Demo>
  <r-link href="/settings" replace>Eintrag ersetzen</r-link>
</Demo>

```html
<r-link href="/settings" replace>Eintrag ersetzen</r-link>
```

### Externe Styles `sheet`

CSS, das in das Shadow DOM des Links injiziert wird — dieselbe `sheet`-Konvention wie bei jeder anderen ranui-Komponente. Da das klickbare `<a>` im Shadow Root liegt, gib ihm über `sheet` ein Boxmodell (`display`, `padding`, `width`), wenn der Host wie ein Button oder eine Karte wirken soll.

<Demo>
  <r-link href="/docs" sheet="a { display: inline-block; padding: 8px 16px; background: var(--ran-color-bg-muted); }">Link mit Innenabstand</r-link>
</Demo>

```html
<r-link href="/docs" sheet="a { display: inline-block; padding: 8px 16px; }">Link mit Innenabstand</r-link>
```

## Slots

| Slot       | Beschreibung                                                     |
| ---------- | ---------------------------------------------------------------- |
| (Standard) | Linkinhalt, projiziert in das `<a>` im Shadow (Text oder Knoten) |

## Events

| Event          | Detail                               | Wann                                                                                  |
| -------------- | ------------------------------------ | ------------------------------------------------------------------------------------- |
| `ran-navigate` | `{ path: string, replace: boolean }` | Ein interner Link wird geklickt und kein ranui-Router ist aktiv. Bubbelt, `composed`. |

```html
<r-link href="/docs">Docs</r-link>

<script>
  const link = document.createElement('r-link');
  link.href = '/docs';
  link.textContent = 'Docs';
  link.addEventListener('ran-navigate', (e) => {
    console.log(e.detail.path, e.detail.replace);
  });
  nav.append(link);
</script>
```

## Bewährte Praxis

- **App-interne Navigation**: Nimm einen wurzelrelativen `href` (z. B. `/docs`), damit der Router ihn in der App abarbeitet.
- **Externe Links**: Absolute URLs sowie `mailto:` und `tel:` gehen an den Browser; zusätzliche Konfiguration ist nicht nötig.
- **Verlauf ersetzen**: Setze `replace` bei Links, die keinen Zurück-Eintrag erzeugen sollen (Weiterleitungen, Tabwechsel).
- **Aktiver Zustand**: Der Host gestaltet `:host([active]) a` (fett + unterstrichen) — setze also das Attribut `active`, um den aktuellen Link zu markieren.
- **Als Button oder Karte**: Lege die Fläche (Hintergrund, Rahmen, Radius) auf den Host und injiziere das Boxmodell des `<a>` (`display`, `padding`, `width`) über `sheet`, damit die ganze Fläche klickbar ist.
- **Theming**: Das `<a>` liest die globalen Tokens `--ran-color-link`, `--ran-color-primary` (Fokusring) und `--ran-radius-sm`; überschreibe diese Tokens, statt komponenteneigene `--ran-link-*`-Variablen zu erwarten (die gibt es nicht).
