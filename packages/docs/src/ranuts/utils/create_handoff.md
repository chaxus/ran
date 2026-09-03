# createHandoff

Hand a value (a `File`, a `Blob`, anything structured-cloneable) from one page to the next
on the same origin.

A `File` the user picked on page A cannot travel to page B. It will not fit in a URL and is
not serialisable; `sessionStorage` only takes strings. IndexedDB stores structured-cloneable
values as they are, so page A stashes the value and navigates, and page B takes it out.

## API

### createHandoff(options)

| Parameter   | Description                                  | Type     | Default     |
| ----------- | -------------------------------------------- | -------- | ----------- |
| `dbName`    | Database name; both sides must agree on it   | `string` | Required    |
| `storeName` | Object store name, created on first open     | `string` | `'files'`   |
| `key`       | Key the single pending value is stored under | `string` | `'pending'` |

#### Return

| Method       | Description                                                          |
| ------------ | -------------------------------------------------------------------- |
| `put(value)` | Store a value for the next page. `false` when it could not store     |
| `take()`     | Take the pending value and delete it. `null` when nothing is pending |

## Example

### Landing page hands a file to the app

```js
import { createHandoff } from 'ranuts';

const handoff = createHandoff({ dbName: 'document-handoff' });

input.addEventListener('change', async () => {
  await handoff.put(input.files[0]);
  location.href = '/app?open=local';
});
```

### The app takes it

```js
import { createHandoff, queryFlag } from 'ranuts';

const handoff = createHandoff({ dbName: 'document-handoff' });

if (queryFlag('open')) {
  const file = await handoff.take();
  if (file) openDocument(file); // null on a reload — the value is consumed
}
```

## Notes

1. **Reading is destructive.** `take()` deletes the value in the same transaction that reads
   it. That is what stops a page reload from re-opening the same file, and what makes a stale
   `?open=local` URL find nothing.

2. **Two tabs cannot both win.** Because the read and the delete share one transaction, a
   race between tabs hands the value to exactly one of them.

3. **`put` resolves on commit, not on the write request.** The value is only durable once the
   transaction commits, and the page usually navigates away immediately after.

4. **Failures are quiet.** A missing or blocked IndexedDB (SSR, private mode, a third-party
   frame) makes `put` resolve `false` and `take` resolve `null`. A page that merely _tried_ to
   hand something over must not break because storage was unavailable.

5. **The store is created at version 1** by whichever side opens the database first; the
   other finds it already there.

6. **One value at a time.** This is a handoff, not a queue: a second `put` overwrites the
   pending value. Use [`WebDB`](/src/ranuts/utils/web_db) when you need real storage.
