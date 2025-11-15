# AppendFile

Append data to file.

## API

### Return

- Promise

| Parameter | Description                                           | Type      | Description                         |
| --------- | ----------------------------------------------------- | --------- | ----------------------------------- |
| success   | Whether append was successful                         | `boolean` | true for success, false for failure |
| data      | Reason for append failure, or file content on success | `any`     |                                     |

### Options

| Parameter | Description            | Type     | Default   |
| --------- | ---------------------- | -------- | --------- |
| path      | File path to append to | `string` | undefined |
| content   | Content to append      | `string` | Required  |

## Example
