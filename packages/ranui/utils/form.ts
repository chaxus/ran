/**
 * Collects a native `<form>`'s named fields into a plain object via
 * `FormData` — the boilerplate every consumer otherwise hand-rolls to turn a
 * submit into something they can `JSON.stringify` or send as a fetch body.
 *
 * Works with any real `<form>`, including one containing ranui's
 * form-associated fields (`r-input`, `r-checkbox`, `r-select`): once they're
 * real descendants of a `<form>`, they already participate in `FormData` on
 * their own (via `ElementInternals.setFormValue`) — this needs no ranui-
 * specific knowledge, it's just `FormData` reduced to an object.
 */
export function serializeForm(form: HTMLFormElement): Record<string, unknown> {
  const data = new FormData(form);
  const result: Record<string, unknown> = {};
  data.forEach((_, key) => {
    if (!(key in result)) {
      result[key] = data.getAll(key).length > 1 ? data.getAll(key) : data.get(key);
    }
  });
  return result;
}
