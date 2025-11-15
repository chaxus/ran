# ranuts overview

## Method list

| Method                 | description                                                            | detail                                                        |
| ---------------------- | ---------------------------------------------------------------------- | ------------------------------------------------------------- |
| writeFile              | Write to file                                                          | [writeFile](./file/write_file.md)                             |
| readFile               | Read file                                                              | [readFile](./file/read_file.md)                               |
| readDir                | Read the directory and get the names of all the files in the directory | [readDir](./file/read_dir.md)                                 |
| watchFile              | Check whether the contents of the file have changed                    | [watchFile](./file/watch_file.md)                             |
| queryFileInfo          | Query file information                                                 | [queryFileInfo](./file/file_info.md)                          |
| filterObj              | Filter object                                                          | [filterObj](./utils/filter_obj.md)                            |
| EventEmitter           | Publish-subscribe class                                                | [EventEmitter](./mode/subscribe.md)                           |
| str2Xml                | String is converted to `xml`                                           | [str2Xml](./utils/str2xml.md)                                 |
| getMime                | Gets the `mime type` based on the file format suffix                   | [getMime](./mime_type/mime_type.md)                           |
| getCookie              | Gets the value of the specified cookie                                 | [writeFile](./utils/get_cookie.md)                            |
| formatJson             | Formatted JSON                                                         | [formatJson](./utils/format_json.md)                          |
| TOTP                   | Time-based One-Time Password generator                                 | [TOTP](./utils/totp.md)                                       |
| debounce               | Debounce function                                                      | [debounce](./utils/debounce.md)                               |
| throttle               | Throttle function                                                      | [throttle](./utils/throttle.md)                               |
| memoize                | Memoization function                                                   | [memoize](./utils/memoize.md)                                 |
| noop                   | No-op function                                                         | [noop](./utils/noop.md)                                       |
| compose                | Compose middleware functions                                           | [compose](./utils/compose.md)                                 |
| md5                    | MD5 hash function                                                      | [md5](./utils/md5.md)                                         |
| randomString           | Generate random string                                                 | [randomString](./utils/random_string.md)                      |
| merge                  | Merge objects                                                          | [merge](./utils/merge.md)                                     |
| isEqual                | Deep comparison of two values for equality                             | [isEqual](./utils/is_equal.md)                                |
| cloneDeep              | Deep clone objects or arrays                                           | [cloneDeep](./utils/clone_deep.md)                            |
| querystring            | Convert object to URL query string                                     | [querystring](./utils/querystring.md)                         |
| timeFormat             | Convert time in seconds to formatted string                            | [timeFormat](./utils/time_format.md)                          |
| timestampToTime        | Convert timestamp to Date object                                       | [timestampToTime](./utils/timestamp_to_time.md)               |
| performanceTime        | Get high-precision timestamp                                           | [performanceTime](./utils/performance_time.md)                |
| isMobile               | Determine if device is mobile                                          | [isMobile](./utils/is_mobile.md)                              |
| isWeiXin               | Determine if browser is WeChat                                         | [isWeiXin](./utils/is_weixin.md)                              |
| currentDevice          | Get current device type                                                | [currentDevice](./utils/current_device.md)                    |
| localStorageGetItem    | Get value from localStorage                                            | [localStorageGetItem](./utils/local_storage.md)               |
| localStorageSetItem    | Set value in localStorage                                              | [localStorageSetItem](./utils/local_storage.md)               |
| getAllQueryString      | Extract query parameters from URL                                      | [getAllQueryString](./utils/get_all_query_string.md)          |
| appendUrl              | Append query parameters to URL                                         | [appendUrl](./utils/append_url.md)                            |
| clearBr                | Remove spaces, HTML tags, and line breaks from string                  | [clearBr](./utils/clear_br.md)                                |
| clearStr               | Remove leading/trailing spaces, URL encoding, and quotes from string   | [clearStr](./utils/clear_str.md)                              |
| strParse               | Parse string into object                                               | [strParse](./utils/str_parse.md)                              |
| range                  | Clamp number within specified range                                    | [range](./utils/range.md)                                     |
| mathjs                 | Precise number calculation function                                    | [mathjs](./utils/mathjs.md)                                   |
| perToNum               | Convert percentage string to number                                    | [perToNum](./utils/per_to_num.md)                             |
| escapeHtml             | Escape HTML special characters                                         | [escapeHtml](./utils/escape_html.md)                          |
| addClassToElement      | Add CSS class name to DOM element                                      | [addClassToElement](./utils/add_class_to_element.md)          |
| removeClassToElement   | Remove CSS class name from DOM element                                 | [removeClassToElement](./utils/remove_class_to_element.md)    |
| isString               | Determine if value is string type                                      | [isString](./utils/is_string.md)                              |
| changeHumpToLowerCase  | Convert camelCase to snake_case naming                                 | [changeHumpToLowerCase](./utils/change_hump_to_lower_case.md) |
| getMatchingSentences   | Extract complete sentences containing keywords                         | [getMatchingSentences](./utils/get_matching_sentences.md)     |
| transformNumber        | Convert number to formatted string with units                          | [transformNumber](./utils/transform_number.md)                |
| addNumSym              | Add positive/negative sign to number                                   | [addNumSym](./utils/add_num_sym.md)                           |
| convertImageToBase64   | Convert image file to Base64                                           | [convertImageToBase64](./utils/convert_image_to_base64.md)    |
| isImageSize            | Validate image file dimensions                                         | [isImageSize](./utils/is_image_size.md)                       |
| getPerformance         | Get page performance metrics data                                      | [getPerformance](./utils/get_performance.md)                  |
| getWindow              | Get viewport window size                                               | [getWindow](./utils/get_window.md)                            |
| getQuery               | Extract query parameters from URL                                      | [getQuery](./utils/get_query.md)                              |
| getCookieByName        | Get Cookie value by regex                                              | [getCookieByName](./utils/get_cookie_by_name.md)              |
| encodeUrl              | Safely encode URL                                                      | [encodeUrl](./utils/encode_url.md)                            |
| getPixelRatio          | Get Canvas resolution ratio                                            | [getPixelRatio](./utils/get_pixel_ratio.md)                   |
| createObjectURL        | Create object URL                                                      | [createObjectURL](./utils/create_object_url.md)               |
| getFrame               | Calculate frame rate                                                   | [getFrame](./utils/get_frame.md)                              |
| getHost                | Get host address based on environment                                  | [getHost](./utils/get_host.md)                                |
| isSafari               | Determine if browser is Safari                                         | [isSafari](./utils/is_safari.md)                              |
| isBangDevice           | Determine if device is iPhone with notch                               | [isBangDevice](./utils/is_bang_device.md)                     |
| isClient               | Determine if environment is client                                     | [isClient](./utils/is_client.md)                              |
| removeGhosting         | Remove drag event shadow                                               | [removeGhosting](./utils/remove_ghosting.md)                  |
| retain                 | Override browser back event                                            | [retain](./utils/retain.md)                                   |
| imageRequest           | Test network latency via image request                                 | [imageRequest](./utils/image_request.md)                      |
| networkSpeed           | Test network ping value and jitter                                     | [networkSpeed](./utils/network_speed.md)                      |
| durationHandler        | Create delayed execution function                                      | [durationHandler](./utils/duration_handler.md)                |
| connection             | Get current network connection information                             | [connection](./utils/connection.md)                           |
| scriptOnLoad           | Dynamically insert script or link tags                                 | [scriptOnLoad](./utils/script_on_load.md)                     |
| handleConsole          | Intercept and handle console method calls                              | [handleConsole](./utils/handle_console.md)                    |
| handleError            | Global error handling                                                  | [handleError](./utils/handle_error.md)                        |
| createDocumentFragment | Create DocumentFragment                                                | [createDocumentFragment](./utils/create_document_fragment.md) |
| Chain                  | Chainable DOM manipulation class                                       | [Chain](./utils/chain.md)                                     |
| create                 | Helper function to create DOM elements                                 | [create](./utils/create.md)                                   |
| createSignal           | Create reactive signal                                                 | [createSignal](./utils/create_signal.md)                      |
| setMime                | Set or update MIME type mapping                                        | [setMime](./utils/set_mime.md)                                |
| getExtensions          | Get extensions from MIME type                                          | [getExtensions](./utils/get_extensions.md)                    |
| handleFetchHook        | Intercept and handle fetch requests                                    | [handleFetchHook](./utils/handle_fetch_hook.md)               |
| setAttributeByGlobal   | Add property to global object                                          | [setAttributeByGlobal](./utils/set_attribute_by_global.md)    |
| toString               | Convert value to string type                                           | [toString](./utils/to_string.md)                              |
| checkEncoding          | Detect character encoding of Uint8Array data                           | [checkEncoding](./utils/check_encoding.md)                    |
| transformText          | Convert ArrayBuffer to text                                            | [transformText](./utils/transform_text.md)                    |
| hexToRgb               | Convert hexadecimal color value to RGB                                 | [hexToRgb](./utils/hex_to_rgb.md)                             |
| rgbToHex               | Convert RGB values to hexadecimal color value                          | [rgbToHex](./utils/rgb_to_hex.md)                             |
| randomColor            | Generate random color object                                           | [randomColor](./utils/random_color.md)                        |
| SyncHook               | Synchronous event hook class                                           | [SyncHook](./utils/sync_hook.md)                              |
