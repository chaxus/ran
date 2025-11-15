# Utility Functions

## Functional Programming

| Method   | Description                  | Detail                    |
| -------- | ---------------------------- | ------------------------- |
| debounce | Debounce function            | [debounce](./debounce.md) |
| throttle | Throttle function            | [throttle](./throttle.md) |
| memoize  | Memoization function         | [memoize](./memoize.md)   |
| noop     | No-op function               | [noop](./noop.md)         |
| compose  | Compose middleware functions | [compose](./compose.md)   |

## String Processing

| Method                | Description                                                          | Detail                                                  |
| --------------------- | -------------------------------------------------------------------- | ------------------------------------------------------- |
| md5                   | MD5 hash function                                                    | [md5](./md5.md)                                         |
| randomString          | Generate random string                                               | [randomString](./random_string.md)                      |
| clearBr               | Remove spaces, HTML tags, and line breaks from string                | [clearBr](./clear_br.md)                                |
| clearStr              | Remove leading/trailing spaces, URL encoding, and quotes from string | [clearStr](./clear_str.md)                              |
| strParse              | Parse string into object                                             | [strParse](./str_parse.md)                              |
| toString              | Convert value to string type                                         | [toString](./to_string.md)                              |
| transformText         | Convert ArrayBuffer to text                                          | [transformText](./transform_text.md)                    |
| checkEncoding         | Detect character encoding of Uint8Array data                         | [checkEncoding](./check_encoding.md)                    |
| changeHumpToLowerCase | Convert camelCase to snake_case naming                               | [changeHumpToLowerCase](./change_hump_to_lower_case.md) |
| getMatchingSentences  | Extract complete sentences containing keywords                       | [getMatchingSentences](./get_matching_sentences.md)     |
| isString              | Determine if value is string type                                    | [isString](./is_string.md)                              |
| str2Xml               | String is converted to `xml`                                         | [str2Xml](./str2xml.md)                                 |

## Object Processing

| Method      | Description                                | Detail                          |
| ----------- | ------------------------------------------ | ------------------------------- |
| merge       | Merge objects                              | [merge](./merge.md)             |
| isEqual     | Deep comparison of two values for equality | [isEqual](./is_equal.md)        |
| cloneDeep   | Deep clone objects or arrays               | [cloneDeep](./clone_deep.md)    |
| querystring | Convert object to URL query string         | [querystring](./querystring.md) |
| filterObj   | Filter object                              | [filterObj](./filter_obj.md)    |
| formatJson  | Formatted JSON                             | [formatJson](./format_json.md)  |

## Number Processing

| Method          | Description                                   | Detail                                   |
| --------------- | --------------------------------------------- | ---------------------------------------- |
| range           | Clamp number within specified range           | [range](./range.md)                      |
| mathjs          | Precise number calculation function           | [mathjs](./mathjs.md)                    |
| perToNum        | Convert percentage string to number           | [perToNum](./per_to_num.md)              |
| transformNumber | Convert number to formatted string with units | [transformNumber](./transform_number.md) |
| addNumSym       | Add positive/negative sign to number          | [addNumSym](./add_num_sym.md)            |

## Color Processing

| Method      | Description                                   | Detail                           |
| ----------- | --------------------------------------------- | -------------------------------- |
| hexToRgb    | Convert hexadecimal color value to RGB        | [hexToRgb](./hex_to_rgb.md)      |
| rgbToHex    | Convert RGB values to hexadecimal color value | [rgbToHex](./rgb_to_hex.md)      |
| randomColor | Generate random color object                  | [randomColor](./random_color.md) |

## Time Processing

| Method          | Description                                 | Detail                                    |
| --------------- | ------------------------------------------- | ----------------------------------------- |
| timeFormat      | Convert time in seconds to formatted string | [timeFormat](./time_format.md)            |
| timestampToTime | Convert timestamp to Date object            | [timestampToTime](./timestamp_to_time.md) |
| performanceTime | Get high-precision timestamp                | [performanceTime](./performance_time.md)  |

## Device Detection

| Method        | Description                              | Detail                               |
| ------------- | ---------------------------------------- | ------------------------------------ |
| isMobile      | Determine if device is mobile            | [isMobile](./is_mobile.md)           |
| isWeiXin      | Determine if browser is WeChat           | [isWeiXin](./is_weixin.md)           |
| isClient      | Determine if environment is client       | [isClient](./is_client.md)           |
| isSafari      | Determine if browser is Safari           | [isSafari](./is_safari.md)           |
| isBangDevice  | Determine if device is iPhone with notch | [isBangDevice](./is_bang_device.md)  |
| currentDevice | Get current device type                  | [currentDevice](./current_device.md) |

## DOM Manipulation

| Method                 | Description                            | Detail                                                  |
| ---------------------- | -------------------------------------- | ------------------------------------------------------- |
| addClassToElement      | Add CSS class name to DOM element      | [addClassToElement](./add_class_to_element.md)          |
| removeClassToElement   | Remove CSS class name from DOM element | [removeClassToElement](./remove_class_to_element.md)    |
| createDocumentFragment | Create DocumentFragment                | [createDocumentFragment](./create_document_fragment.md) |
| escapeHtml             | Escape HTML special characters         | [escapeHtml](./escape_html.md)                          |
| Chain                  | Chainable DOM manipulation class       | [Chain](./chain.md)                                     |
| create                 | Helper function to create DOM elements | [create](./create.md)                                   |

## Storage

| Method              | Description                 | Detail                                    |
| ------------------- | --------------------------- | ----------------------------------------- |
| localStorageGetItem | Get value from localStorage | [localStorageGetItem](./local_storage.md) |
| localStorageSetItem | Set value in localStorage   | [localStorageSetItem](./local_storage.md) |

## URL/Query

| Method            | Description                       | Detail                                         |
| ----------------- | --------------------------------- | ---------------------------------------------- |
| getAllQueryString | Extract query parameters from URL | [getAllQueryString](./get_all_query_string.md) |
| getQuery          | Extract query parameters from URL | [getQuery](./get_query.md)                     |
| encodeUrl         | Safely encode URL                 | [encodeUrl](./encode_url.md)                   |
| appendUrl         | Append query parameters to URL    | [appendUrl](./append_url.md)                   |

## Cookie

| Method          | Description                            | Detail                                     |
| --------------- | -------------------------------------- | ------------------------------------------ |
| getCookie       | Gets the value of the specified cookie | [getCookie](./get_cookie.md)               |
| getCookieByName | Get Cookie value by regex              | [getCookieByName](./get_cookie_by_name.md) |

## Image Processing

| Method               | Description                    | Detail                                               |
| -------------------- | ------------------------------ | ---------------------------------------------------- |
| convertImageToBase64 | Convert image file to Base64   | [convertImageToBase64](./convert_image_to_base64.md) |
| isImageSize          | Validate image file dimensions | [isImageSize](./is_image_size.md)                    |

## Performance

| Method         | Description                       | Detail                                 |
| -------------- | --------------------------------- | -------------------------------------- |
| getPerformance | Get page performance metrics data | [getPerformance](./get_performance.md) |
| getFrame       | Calculate frame rate              | [getFrame](./get_frame.md)             |
| getPixelRatio  | Get Canvas resolution ratio       | [getPixelRatio](./get_pixel_ratio.md)  |

## Network

| Method       | Description                                | Detail                             |
| ------------ | ------------------------------------------ | ---------------------------------- |
| imageRequest | Test network latency via image request     | [imageRequest](./image_request.md) |
| networkSpeed | Test network ping value and jitter         | [networkSpeed](./network_speed.md) |
| connection   | Get current network connection information | [connection](./connection.md)      |

## Browser

| Method          | Description                           | Detail                                    |
| --------------- | ------------------------------------- | ----------------------------------------- |
| getWindow       | Get viewport window size              | [getWindow](./get_window.md)              |
| getHost         | Get host address based on environment | [getHost](./get_host.md)                  |
| createObjectURL | Create object URL                     | [createObjectURL](./create_object_url.md) |
| removeGhosting  | Remove drag event shadow              | [removeGhosting](./remove_ghosting.md)    |
| retain          | Override browser back event           | [retain](./retain.md)                     |

## Script Loading

| Method       | Description                            | Detail                              |
| ------------ | -------------------------------------- | ----------------------------------- |
| scriptOnLoad | Dynamically insert script or link tags | [scriptOnLoad](./script_on_load.md) |

## Error Handling

| Method          | Description                               | Detail                                    |
| --------------- | ----------------------------------------- | ----------------------------------------- |
| handleConsole   | Intercept and handle console method calls | [handleConsole](./handle_console.md)      |
| handleError     | Global error handling                     | [handleError](./handle_error.md)          |
| handleFetchHook | Intercept and handle fetch requests       | [handleFetchHook](./handle_fetch_hook.md) |

## Others

| Method               | Description                            | Detail                                               |
| -------------------- | -------------------------------------- | ---------------------------------------------------- |
| TOTP                 | Time-based One-Time Password generator | [TOTP](./totp.md)                                    |
| createSignal         | Create reactive signal                 | [createSignal](./create_signal.md)                   |
| setMime              | Set or update MIME type mapping        | [setMime](./set_mime.md)                             |
| getExtensions        | Get extensions from MIME type          | [getExtensions](./get_extensions.md)                 |
| setAttributeByGlobal | Add property to global object          | [setAttributeByGlobal](./set_attribute_by_global.md) |
| SyncHook             | Synchronous event hook class           | [SyncHook](./sync_hook.md)                           |
| durationHandler      | Create delayed execution function      | [durationHandler](./duration_handler.md)             |
