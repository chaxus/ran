# QueryFileInfo

Query detailed information of a file, commonly used to distinguish between file and directory, can be determined through returned data (data.isDirectory()).

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
