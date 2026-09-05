---
description: 'Ein Routing-Outlet, das seinen Slot-Inhalt nur zeigt, solange der aktuelle Pfad auf ein Muster passt — zur Verwendung in r-router.'
---

# Route

Ein Routing-Outlet-Element. In einem [`r-router`](../router/) platziert, zeigt es seinen Slot-Inhalt, wenn der aktuelle Pfad auf sein `path`-Muster passt, und blendet ihn sonst aus.

> **Nimm es, wenn** du ein Routing-Outlet brauchst, das seinen Inhalt nur zeigt, solange der aktuelle Pfad auf ein Muster passt (mit `:param` und `*`). Setze `<r-route>` in ein `<r-router>`, um eine clientseitige Ansichtsumschaltung zu bauen.

## Schnellstart

### Grundlegende Verwendung

Ein `r-route`, dessen `path` `/` ist, passt auf den Standardpfad — sein Inhalt rendert also auch allein:

<Demo>
  <r-route path="/">
    <p>Dieser Inhalt erscheint, wenn der aktuelle Pfad passt.</p>
  </r-route>
</Demo>

```html
<r-route path="/">
  <p>Dieser Inhalt erscheint, wenn der aktuelle Pfad passt.</p>
</r-route>
```

### In einem Router

In einem [`r-router`](../router/) verwendet, wirken mehrere Routen wie ein Schalter: Der Router gleicht bei jeder Navigation alle `r-route`-Kinder ab, zeigt jene, deren `path` passt, und blendet den Rest aus:

```html
<r-router>
  <r-route path="/" exact><h2>Home</h2></r-route>
  <r-route path="/about"><h2>About</h2></r-route>
  <r-route path="/users/:id"><h2>User profile</h2></r-route>
</r-router>
```

Der Container `r-router` und die JavaScript-API `createRouter` / `RouterCore` (Navigation, Guards, View Transitions) sind auf der [Router-Seite](../router/) dokumentiert.

## API-Referenz

### Eigenschaften

| Eigenschaft | Typ                      | Standard | Beschreibung                                                                        |
| ----------- | ------------------------ | -------- | ----------------------------------------------------------------------------------- |
| `path`      | `string`                 | `'/'`    | Muster, das gegen den aktuellen Pfad geprüft wird. Unterstützt `:param` und `*`     |
| `exact`     | `boolean`                | `false`  | Nur lesbar. Ist das Attribut `exact` gesetzt, ist eine exakte Übereinstimmung nötig |
| `params`    | `Record<string, string>` | `{}`     | Nur lesbar. Die aus der aktuellen Übereinstimmung gewonnenen Parameter              |
| `sheet`     | `string`                 | `''`     | CSS, das in das Shadow DOM der Komponente injiziert wird                            |

### Pfadabgleich `path`

Der `path` wird an `/` geteilt und Segment für Segment zu einem regulären Ausdruck kompiliert:

- ein Segment, das mit `:` beginnt, fängt einen benannten Parameter ein (passt auf ein Pfadsegment)
- ein Segment `*` passt auf den gesamten restlichen Pfad
- jedes andere Segment passt wörtlich

Ohne `exact` passt das Muster als **Präfix** auf den Pfad (nachfolgende Segmente sind erlaubt). Mit `exact` wird nur eine vollständige Übereinstimmung akzeptiert.

```
/users            passt auf /users, /users/42, /users/42/profile
/users (exact)    passt nur auf /users
/users/:id        fängt :id ein → params.id
/*                passt auf alles
```

Lies die eingefangenen Parameter aus der nur lesbaren Eigenschaft `params` (jeder Wert ist mit `decodeURIComponent` dekodiert):

```js
const route = document.createElement('r-route');
route.path = '/users/:id';
router.append(route);
route.params; // z. B. { id: '42' }, sobald der Router auf diese Route passt
```

### Exakte Übereinstimmung `exact`

Boolesches Attribut. Ist es gesetzt, passt das Outlet nur auf einen exakten Pfad (kein Präfixabgleich): `path="/users" exact` passt auf `/users`, aber nicht auf `/users/42`.

```html
<r-route path="/" exact><h2>Home</h2></r-route>
```

### Externes CSS `sheet`

CSS, das in das Shadow DOM der Komponente injiziert wird — dieselbe `sheet`-Konvention wie bei jeder anderen ranui-Komponente.

### Slots

Der Standard-Slot (ohne Namen) enthält den Inhalt, der gezeigt wird, solange die Route aktiv ist. Passt der Pfad nicht, wird der Host auf `hidden` gesetzt und der Inhalt erscheint nicht.

```html
<r-route path="/about">
  <!-- Standard-Slot: nur sichtbar, solange /about aktiv ist -->
  <h2>About</h2>
</r-route>
```

## Events

### `routematch`

Wird ausgelöst, wenn dieses Outlet aktiv wird (sein `path` passt auf den aktuellen Pfad). Es **bubbelt**. `event.detail` ist `{ path, params }`:

```html
<r-route path="/users/:id"><h2>User profile</h2></r-route>

<script>
  // Zuhören, bevor eine ebenso gebaute Route eingehängt wird
  const route = document.createElement('r-route');
  route.path = '/users/:id';
  route.addEventListener('routematch', (e) => {
    console.log(e.detail.path, e.detail.params); // '/users/42', { id: '42' }
  });
  router.append(route);
</script>
```

## Styling

`r-route` stellt weder `::part()`-Handles noch eigene `--ran-route-*`-CSS-Variablen bereit. Der Host ist ein gewöhnliches `display: block`-Element, das im ausgeblendeten Zustand zu `display: none` zusammenfällt. Zum Anpassen nimm das Attribut `sheet` oder gestalte den Host direkt.

Importiere es über `import 'ranui'` (registriert jede Komponente) oder eigenständig über `import 'ranui/route'`.

## Bewährte Praxis

- **In `r-router` einhängen**: `r-route` schaltet bei Navigation nur um, wenn es einen [`r-router`](../router/) als Vorfahren hat, der es abgleicht.
- **`exact` für die Wurzel**: Gib `path="/"` das Attribut `exact`, damit es nicht als Präfix auf jede andere Route passt.
- **Vom Speziellen zum Allgemeinen ordnen**: Setze eine Auffangroute `path="/*"` ans Ende, da eine Route ohne `exact` schon auf ihr Präfix passt.
- **`params` lesen statt die URL zu parsen**: Fange dynamische Segmente mit `:param` ein und lies sie aus der Eigenschaft `params`.
- **Mit `routematch` auf die Aktivierung reagieren**: Nutze das bubbelnde `routematch`-Event, um das Laden von Daten anzustoßen, sobald eine Route aktiv wird.
