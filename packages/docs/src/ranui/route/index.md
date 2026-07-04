# Route

A routing outlet element. Placed inside an [`r-router`](../router/), it shows its slotted
content when the current path matches its `path` pattern and hides it otherwise. The router
syncs every `r-route` child on navigation.

## Code demo

<r-route path="/">
  <p>This content is shown when the current path matches.</p>
</r-route>

```xml
<r-route path="/">
  <p>This content is shown when the current path matches.</p>
</r-route>
```

Used inside a router, several routes act as a switch:

```xml
<r-router>
  <r-route path="/" exact><h2>Home</h2></r-route>
  <r-route path="/about"><h2>About</h2></r-route>
  <r-route path="/users/:id"><h2>User profile</h2></r-route>
</r-router>
```

The `r-router` container and the `createRouter` / `RouterCore` JavaScript API (navigation,
guards, view transitions) are documented on the [Router page](../router/).

## Attributes

### `path`

The pattern this outlet matches against the current path. Defaults to `/`. Segments
starting with `:` capture a named parameter, and `*` matches any remaining segments:

```
/users            matches /users, /users/42, /users/42/profile
/users/:id        captures :id → params.id
/*                matches everything
```

Read the captured parameters from the `params` property (a read-only `Record<string, string>`).

### `exact`

Boolean attribute. When present, the outlet matches only an exact path (no prefix
matching) — `path="/users" exact` matches `/users` but not `/users/42`.

### `sheet`

CSS injected into the component's shadow DOM — the same `sheet` convention used by every
other ranui component.

## Events

### `routematch`

Fires when this outlet becomes active (its `path` matches the current path). It **bubbles**.
`event.detail` is `{ path, params }`:

```js
document.querySelector('r-route').addEventListener('routematch', (e) => {
  console.log(e.detail.path, e.detail.params); // '/users/42', { id: '42' }
});
```

## Slots

### (default)

The default unnamed slot holds the content shown while the route is active. When the path
does not match, the host is set to `hidden` and the content is not displayed.

## Styling

`r-route` exposes no `::part()` handles and no dedicated `--ran-route-*` CSS variables. The
host is a plain `display: block` element that collapses to `display: none` while hidden. Use
the `sheet` attribute or style the host directly if you need to customize it.

Import it via `import 'ranui'` (registers every component) or the standalone
`import 'ranui/route'`.
