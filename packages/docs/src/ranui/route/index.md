# Route

A routing outlet element. Placed inside an [`r-router`](../router/), it shows its slotted content when the current path matches its `path` pattern and hides it otherwise.

## Quick Start

### Basic Usage

An `r-route` whose `path` is `/` matches the default path, so its content renders on its own:

<Demo>
  <r-route path="/">
    <p>This content is shown when the current path matches.</p>
  </r-route>
</Demo>

```html
<r-route path="/">
  <p>This content is shown when the current path matches.</p>
</r-route>
```

### Inside a Router

Used inside an [`r-router`](../router/), several routes act as a switch — the router syncs every `r-route` child on navigation, showing the ones whose `path` matches and hiding the rest:

```html
<r-router>
  <r-route path="/" exact><h2>Home</h2></r-route>
  <r-route path="/about"><h2>About</h2></r-route>
  <r-route path="/users/:id"><h2>User profile</h2></r-route>
</r-router>
```

The `r-router` container and the `createRouter` / `RouterCore` JavaScript API (navigation, guards, view transitions) are documented on the [Router page](../router/).

## API Reference

### Properties

| Property | Type                     | Default | Description                                                                  |
| -------- | ------------------------ | ------- | ---------------------------------------------------------------------------- |
| `path`   | `string`                 | `'/'`   | Pattern matched against the current path. Supports `:param` segments and `*` |
| `exact`  | `boolean`                | `false` | Read-only. When the `exact` attribute is present, require an exact match     |
| `params` | `Record<string, string>` | `{}`    | Read-only. The parameters captured from the current match                    |
| `sheet`  | `string`                 | `''`    | CSS injected into the component's shadow DOM                                 |

### Path Matching `path`

The `path` is split on `/` and compiled into a regular expression segment by segment:

- a segment starting with `:` captures a named parameter (matches one path segment)
- a `*` segment matches any remaining path
- any other segment matches literally

Without `exact`, the pattern matches the path as a **prefix** (trailing segments are allowed). With `exact`, only a full match is accepted.

```
/users            matches /users, /users/42, /users/42/profile
/users (exact)    matches only /users
/users/:id        captures :id → params.id
/*                matches everything
```

Read the captured parameters from the read-only `params` property (each value is `decodeURIComponent`-decoded):

```js
const route = document.querySelector('r-route');
route.params; // e.g. { id: '42' }
```

### Exact Match `exact`

Boolean attribute. When present, the outlet matches only an exact path (no prefix matching) — `path="/users" exact` matches `/users` but not `/users/42`.

```html
<r-route path="/" exact><h2>Home</h2></r-route>
```

### External CSS `sheet`

CSS injected into the component's shadow DOM — the same `sheet` convention used by every other ranui component.

### Slots

The default (unnamed) slot holds the content shown while the route is active. When the path does not match, the host is set to `hidden` and the content is not displayed.

```html
<r-route path="/about">
  <!-- default slot: shown only while /about is active -->
  <h2>About</h2>
</r-route>
```

## Events

### `routematch`

Fires when this outlet becomes active (its `path` matches the current path). It **bubbles**. `event.detail` is `{ path, params }`:

```html
<r-route path="/users/:id"><h2>User profile</h2></r-route>

<script>
  document.querySelector('r-route').addEventListener('routematch', (e) => {
    console.log(e.detail.path, e.detail.params); // '/users/42', { id: '42' }
  });
</script>
```

## Styling

`r-route` exposes no `::part()` handles and no dedicated `--ran-route-*` CSS variables. The host is a plain `display: block` element that collapses to `display: none` while hidden. Use the `sheet` attribute or style the host directly to customize it.

Import it via `import 'ranui'` (registers every component) or the standalone `import 'ranui/route'`.

## Best Practices

- **Mount inside `r-router`**: `r-route` only switches on navigation when it has an [`r-router`](../router/) ancestor to sync it.
- **Use `exact` for the root**: give `path="/"` the `exact` attribute so it doesn't prefix-match every other route.
- **Order from specific to general**: place a catch-all `path="/*"` route last, since a non-exact route matches its prefix.
- **Read `params`, don't parse the URL**: capture dynamic segments with `:param` and read them from the `params` property.
- **React to activation with `routematch`**: use the bubbling `routematch` event to trigger data loading when a route becomes active.
