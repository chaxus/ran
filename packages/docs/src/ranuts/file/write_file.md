# WriteFile

Write content to file.

## API

### Return

- Promise

| Parameter | Description                                                   | Type      | Description                         |
| --------- | ------------------------------------------------------------- | --------- | ----------------------------------- |
| success   | Whether write was successful                                  | `boolean` | true for success, false for failure |
| data      | Reason for write failure, or file content and path on success | `any`     |                                     |

### Options

| Parameter | Description           | Type     | Default   |
| --------- | --------------------- | -------- | --------- |
| path      | File path to write to | `string` | undefined |
| content   | Content to write      | `string` | Required  |
