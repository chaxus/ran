# QueryFileInfo

Query detailed information about a file. Commonly used to distinguish a file from a directory, which can be determined from the returned data (`data.isDirectory()`).

## API

### Return

- Promise

| Parameter | Description                           | Type      | Description                         |
| --------- | ------------------------------------- | --------- | ----------------------------------- |
| success   | Whether check was successful          | `boolean` | true for success, false for failure |
| data      | File information, or reason for error | `Stats`   |                                     |

### Options

| Parameter | Description        | Type     | Default   |
| --------- | ------------------ | -------- | --------- |
| path      | File path to check | `string` | undefined |

## Example
