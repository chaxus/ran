# scriptOnLoad

Fügt `script`- oder `link`-Tags zur Laufzeit ein und wartet, bis alle Ressourcen geladen sind.

## API

### scriptOnLoad

#### Rückgabe

| Argument        | Beschreibung                                                   | Typ       |
| --------------- | -------------------------------------------------------------- | --------- |
| `Promise<void>` | Promise, das erfüllt wird, sobald alle Ressourcen geladen sind | `Promise` |

#### Parameter

| Parameter  | Beschreibung                                    | Typ           | Standard     |
| ---------- | ----------------------------------------------- | ------------- | ------------ |
| `urls`     | Array mit den URLs der Ressourcen               | `string[]`    | Erforderlich |
| `append`   | Elternelement, in das eingefügt wird (optional) | `HTMLElement` | `body`       |
| `callback` | Callback, wenn alles geladen ist (optional)     | `Function`    | Optional     |

## Beispiel

### Grundlegende Verwendung

```js
import { scriptOnLoad } from 'ranuts';

// Ein einzelnes Skript laden
await scriptOnLoad(['https://example.com/script.js']);
console.log('Skript geladen');
```

### Mehrere Ressourcen laden

```js
import { scriptOnLoad } from 'ranuts';

// Mehrere Skripte und Stylesheets gleichzeitig laden
await scriptOnLoad([
  'https://example.com/script1.js',
  'https://example.com/script2.js',
  'https://example.com/style.css',
]);
console.log('Alle Ressourcen geladen');
```

### Einen Callback verwenden

```js
import { scriptOnLoad } from 'ranuts';

scriptOnLoad(['https://example.com/library.js'], document.body, () => {
  console.log('Ressourcen geladen, es kann losgehen');
});
```

### Eine fremde Bibliothek zur Laufzeit laden

```js
import { scriptOnLoad } from 'ranuts';

async function loadLibrary() {
  await scriptOnLoad(['https://cdn.example.com/library.js']);
  // Die Bibliothek ist geladen und einsatzbereit
  window.Library.init();
}
```

## Hinweise

1. **Erkennt den Typ selbst**: An der Endung der URL (`.css`) unterscheidet es Stylesheet und Skript.
2. **Lädt parallel**: Alle Ressourcen laden gleichzeitig; erfüllt wird erst, wenn alle fertig sind.
3. **Einfügeort**: standardmäßig das `body`-Element, ein anderes Elternelement ist möglich.
4. **Promise und Callback**: beides wird unterstützt und lässt sich kombinieren.
