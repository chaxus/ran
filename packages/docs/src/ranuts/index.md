# ranuts overview

## Category Navigation

- [Utility Functions](./utils/index.md) - Functional programming, string processing, object processing, number processing, etc.
- [File Operations](./file/write_file.md) - File read/write, watch operations
- [Event System](./mode/subscribe.md) - Publish-subscribe pattern
- [MIME Type](./mime_type/mime_type.md) - MIME type processing
- [Others](./binary_tree/index.md) - Binary tree, bundler, etc.

## Method list

| Method        | description                                                            | detail                               |
| ------------- | ---------------------------------------------------------------------- | ------------------------------------ |
| writeFile     | Write to file                                                          | [writeFile](./file/write_file.md)    |
| readFile      | Read file                                                              | [readFile](./file/read_file.md)      |
| readDir       | Read the directory and get the names of all the files in the directory | [readDir](./file/read_dir.md)        |
| watchFile     | Check whether the contents of the file have changed                    | [watchFile](./file/watch_file.md)    |
| queryFileInfo | Query file information                                                 | [queryFileInfo](./file/file_info.md) |
| filterObj     | Filter object                                                          | [filterObj](./utils/filter_obj.md)   |
| EventEmitter  | Publish-subscribe class                                                | [EventEmitter](./mode/subscribe.md)  |
| getMime       | Gets the `mime type` based on the file format suffix                   | [getMime](./mime_type/mime_type.md)  |
| getCookie     | Gets the value of the specified cookie                                 | [getCookie](./utils/get_cookie.md)   |

> 💡 **Tip**: For more utility functions, see [Utility Functions Category Index](./utils/index.md)
