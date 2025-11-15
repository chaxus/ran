# WatchFile

Watch if a file has changed.

## API

### Return

- Promise

| Parameter | Description              | Type      | Description                           |
| --------- | ------------------------ | --------- | ------------------------------------- |
| status    | Whether file has changed | `boolean` | true if changed, false if not changed |

### Options

| Parameter | Description                                         | Type     | Default   |
| --------- | --------------------------------------------------- | -------- | --------- |
| path      | File path to watch                                  | `string` | undefined |
| interval  | Interval for watching file changes, in milliseconds | `number` | `20`      |
