---
description: 'نمای کلی توابع کمکی ranuts: یاری‌رسان‌های تابعی (debounce، throttle، memoize، compose) به‌همراه ابزارهای رشته، شیء، عدد و رنگ.'
---

# توابع کمکی

## برنامه‌نویسی تابعی

| متد      | توضیح                     | جزئیات                    |
| -------- | ------------------------- | ------------------------- |
| debounce | تابع کاهش پرش (debounce)  | [debounce](./debounce.md) |
| throttle | تابع مهار نرخ (throttle)  | [throttle](./throttle.md) |
| memoize  | تابع به‌خاطرسپاری نتیجه   | [memoize](./memoize.md)   |
| noop     | تابعی که هیچ کاری نمی‌کند | [noop](./noop.md)         |
| compose  | ترکیب توابع میان‌افزار    | [compose](./compose.md)   |

## کار با رشته

| متد                            | توضیح                                                   | جزئیات                                              |
| ------------------------------ | ------------------------------------------------------- | --------------------------------------------------- |
| md5                            | تابع درهم‌ساز MD5                                       | [md5](./md5.md)                                     |
| randomString / getRandomString | ساختن رشتهٔ تصادفی                                      | [randomString](./random_string.md)                  |
| clearBr                        | برداشتن فاصله‌ها، برچسب‌های HTML و شکست خط از رشته      | [clearBr](./clear_br.md)                            |
| clearStr                       | برداشتن فاصله‌های دو سر، رمزگذاری نشانی و گیومه از رشته | [clearStr](./clear_str.md)                          |
| truncate                       | کوتاه کردن رشته با سه‌نقطه، بی‌آنکه یونیکد بشکند        | [truncate](./truncate.md)                           |
| strParse                       | خواندن رشته و تبدیل آن به شیء                           | [strParse](./str_parse.md)                          |
| toString                       | تبدیل یک مقدار به نوع رشته                              | [toString](./to_string.md)                          |
| transformText                  | تبدیل ArrayBuffer به متن                                | [transformText](./transform_text.md)                |
| checkEncoding                  | تشخیص رمزگذاری نویسه‌های دادهٔ Uint8Array               | [checkEncoding](./check_encoding.md)                |
| getMatchingSentences           | بیرون کشیدن جمله‌های کاملی که کلیدواژه دارند            | [getMatchingSentences](./get_matching_sentences.md) |
| isString                       | تشخیص اینکه یک مقدار از نوع رشته است یا نه              | [isString](./is_string.md)                          |

## کار با شیء

| متد                  | توضیح                                        | جزئیات                          |
| -------------------- | -------------------------------------------- | ------------------------------- |
| merge / mergeExports | ادغام شیءها؛ و شیء صادرات با گیرنده‌های تنبل | [merge](./merge.md)             |
| isEqual              | مقایسهٔ ژرف دو مقدار برای برابری             | [isEqual](./is_equal.md)        |
| cloneDeep            | رونوشت ژرف از شیء یا آرایه                   | [cloneDeep](./clone_deep.md)    |
| querystring          | تبدیل شیء به رشتهٔ پرس‌وجوی نشانی            | [querystring](./querystring.md) |
| filterObj            | پالودن شیء                                   | [filterObj](./filter_obj.md)    |
| formatJson           | JSON آراسته                                  | [formatJson](./format_json.md)  |

## کار با عدد

| متد                                                                | توضیح                                        | جزئیات                                   |
| ------------------------------------------------------------------ | -------------------------------------------- | ---------------------------------------- |
| range                                                              | نگه داشتن عدد در بازهٔ تعیین‌شده             | [range](./range.md)                      |
| clamp / lerp / inverseLerp / remap / fit / linearstep / smoothstep | درون‌یابی و جابه‌جایی بازه به سبک سایه‌زن‌ها | [range](./range.md)                      |
| mathjs                                                             | تابع محاسبهٔ عددی بی‌خطا                     | [mathjs](./mathjs.md)                    |
| perToNum                                                           | تبدیل رشتهٔ درصد به عدد                      | [perToNum](./per_to_num.md)              |
| transformNumber                                                    | تبدیل عدد به رشته‌ای آراسته همراه با یکا     | [transformNumber](./transform_number.md) |
| addNumSym                                                          | گذاشتن علامت مثبت یا منفی روی عدد            | [addNumSym](./add_num_sym.md)            |

## کار با رنگ

| متد                                                                                         | توضیح                                                   | جزئیات                           |
| ------------------------------------------------------------------------------------------- | ------------------------------------------------------- | -------------------------------- |
| hexToRgb                                                                                    | تبدیل رنگ شانزده‌شانزدهی به RGB                         | [hexToRgb](./hex_to_rgb.md)      |
| rgbToHex                                                                                    | تبدیل مقدارهای RGB به رنگ شانزده‌شانزدهی                | [rgbToHex](./rgb_to_hex.md)      |
| randomColor                                                                                 | ساختن شیء رنگ تصادفی                                    | [randomColor](./random_color.md) |
| Color / ColorScheme                                                                         | کلاس Color، کلاس‌های مقدار، تبدیل‌ها و سازندهٔ پالت     | [Color](./color.md)              |
| blendScreen / blendMultiply / blendOverlay / luma / vibrance / cosinePalette / srgbToLinear | آمیختن و تنظیم رنگ به سبک سایه‌زن‌ها (کانال‌های ۰ تا ۱) | [Color](./color.md)              |

## کار با زمان

| متد                                   | توضیح                                     | جزئیات                                    |
| ------------------------------------- | ----------------------------------------- | ----------------------------------------- |
| formatDuration                        | تبدیل زمانِ برحسب ثانیه به رشته‌ای آراسته | [formatDuration](./time_format.md)        |
| formatRelative                        | توصیف یک زمان نسبت به اکنون («۳ روز پیش») | [formatRelative](./time_format.md)        |
| parseVttTimestamp / parseVttCueTiming | خواندن خط‌های زمان‌بندی زیرنویس WebVTT    | [parseVttTimestamp](./time_format.md)     |
| timestampToTime                       | تبدیل مهر زمانی به شیء Date               | [timestampToTime](./timestamp_to_time.md) |
| performanceTime                       | گرفتن مهر زمانی با دقت بالا               | [performanceTime](./performance_time.md)  |

## تشخیص دستگاه

| متد           | توضیح                                     | جزئیات                               |
| ------------- | ----------------------------------------- | ------------------------------------ |
| isMobile      | تشخیص اینکه دستگاه همراه است یا نه        | [isMobile](./is_mobile.md)           |
| isWeiXin      | تشخیص اینکه مرورگر وی‌چت است یا نه        | [isWeiXin](./is_weixin.md)           |
| isClient      | تشخیص اینکه محیط اجرا سمت کاربر است یا نه | [isClient](./is_client.md)           |
| isSafari      | تشخیص اینکه مرورگر سافاری است یا نه       | [isSafari](./is_safari.md)           |
| currentDevice | گرفتن نوع دستگاه کنونی                    | [currentDevice](./current_device.md) |

## کار با DOM

| متد                                    | توضیح                                                      | جزئیات                                                  |
| -------------------------------------- | ---------------------------------------------------------- | ------------------------------------------------------- |
| addClassToElement                      | افزودن نام کلاس CSS به عنصر DOM                            | [addClassToElement](./add_class_to_element.md)          |
| removeClassToElement                   | برداشتن نام کلاس CSS از عنصر DOM                           | [removeClassToElement](./remove_class_to_element.md)    |
| createDocumentFragment                 | ساختن DocumentFragment                                     | [createDocumentFragment](./create_document_fragment.md) |
| escapeHtml                             | گریز دادن نویسه‌های ویژهٔ HTML                             | [escapeHtml](./escape_html.md)                          |
| Chain                                  | کلاس زنجیره‌پذیر برای کار با DOM                           | [Chain](./chain.md)                                     |
| create                                 | تابع کمکی برای ساختن عنصرهای DOM                           | [create](./create.md)                                   |
| EventManager / createDoubleTapDetector | دفتر شنونده‌های دامنه‌دار و تشخیص دو-ضربه                  | [EventManager](./event_manager.md)                      |
| adoptStyles                            | ریختن متن شیوه‌نامه درون یک shadow root                    | [adoptStyles](./adopt_styles.md)                        |
| computePlacement                       | برگرداندن یا جابه‌جا کردن یک پنل شناور نسبت به لنگرش       | [computePlacement](./placement.md)                      |
| setFontSize2html                       | مقیاس‌بندی دیدگاه با rem انعطاف‌پذیر برای چیدمان‌های همراه | [setFontSize2html](./set_font_size.md)                  |

## رسانه

| متد                    | توضیح                                   | جزئیات                                |
| ---------------------- | --------------------------------------- | ------------------------------------- |
| AudioRecorder          | ضبط صدای میکروفون در یک `Blob`          | [AudioRecorder](./audio_recorder.md)  |
| createSpeechRecognizer | تبدیل گفتار به نوشتار با Web Speech API | [createSpeechRecognizer](./speech.md) |

## ذخیره‌سازی

| متد                 | توضیح                        | جزئیات                                    |
| ------------------- | ---------------------------- | ----------------------------------------- |
| localStorageGetItem | خواندن مقدار از localStorage | [localStorageGetItem](./local_storage.md) |
| localStorageSetItem | گذاشتن مقدار در localStorage | [localStorageSetItem](./local_storage.md) |

## نشانی و پرس‌وجو

| متد               | توضیح                                   | جزئیات                                         |
| ----------------- | --------------------------------------- | ---------------------------------------------- |
| getAllQueryString | بیرون کشیدن پارامترهای پرس‌وجو از نشانی | [getAllQueryString](./get_all_query_string.md) |
| encodeUrl         | رمزگذاری امن نشانی                      | [encodeUrl](./encode_url.md)                   |
| appendUrl         | افزودن پارامترهای پرس‌وجو به نشانی      | [appendUrl](./append_url.md)                   |

## کوکی

| متد             | توضیح                             | جزئیات                                     |
| --------------- | --------------------------------- | ------------------------------------------ |
| getCookie       | گرفتن مقدار کوکی مشخص‌شده         | [getCookie](./get_cookie.md)               |
| getCookieByName | گرفتن مقدار کوکی با عبارت باقاعده | [getCookieByName](./get_cookie_by_name.md) |

## کار با تصویر

| متد                  | توضیح                      | جزئیات                                               |
| -------------------- | -------------------------- | ---------------------------------------------------- |
| convertImageToBase64 | تبدیل فایل تصویر به Base64 | [convertImageToBase64](./convert_image_to_base64.md) |
| isImageSize          | وارسی ابعاد فایل تصویر     | [isImageSize](./is_image_size.md)                    |

## کارایی

| متد            | توضیح                         | جزئیات                                 |
| -------------- | ----------------------------- | -------------------------------------- |
| getPerformance | گرفتن سنجه‌های کارایی صفحه    | [getPerformance](./get_performance.md) |
| getFrame       | محاسبهٔ نرخ فریم              | [getFrame](./get_frame.md)             |
| getPixelRatio  | گرفتن نسبت تفکیک‌پذیری Canvas | [getPixelRatio](./get_pixel_ratio.md)  |

## شبکه

| متد                | توضیح                                     | جزئیات                             |
| ------------------ | ----------------------------------------- | ---------------------------------- |
| imageRequest       | سنجش تأخیر شبکه با یک درخواست تصویر       | [imageRequest](./image_request.md) |
| networkSpeed       | سنجش پینگ و لرزش شبکه                     | [networkSpeed](./network_speed.md) |
| connection         | گرفتن اطلاعات اتصال شبکهٔ کنونی           | [connection](./connection.md)      |
| getStatus / status | جست‌وجوی دوسویه میان کد وضعیت HTTP و پیام | [getStatus](./status.md)           |

## مرورگر

| متد                                  | توضیح                                            | جزئیات                                    |
| ------------------------------------ | ------------------------------------------------ | ----------------------------------------- |
| getWindow                            | گرفتن اندازهٔ پنجرهٔ دید                         | [getWindow](./get_window.md)              |
| createObjectURL / requestUrlToBuffer | ساختن object URL؛ گرفتن یک نشانی به شکل بایت خام | [createObjectURL](./create_object_url.md) |

## بارگذاری اسکریپت

| متد          | توضیح                              | جزئیات                              |
| ------------ | ---------------------------------- | ----------------------------------- |
| scriptOnLoad | درج پویای برچسب‌های script یا link | [scriptOnLoad](./script_on_load.md) |

## رسیدگی به خطا

| متد             | توضیح                                      | جزئیات                                    |
| --------------- | ------------------------------------------ | ----------------------------------------- |
| handleConsole   | رهگیری و رسیدگی به فراخوانی متدهای console | [handleConsole](./handle_console.md)      |
| handleError     | رسیدگی سراسری به خطا                       | [handleError](./handle_error.md)          |
| handleFetchHook | رهگیری و رسیدگی به درخواست‌های fetch       | [handleFetchHook](./handle_fetch_hook.md) |

## دیگر موارد

| متد                | توضیح                                     | جزئیات                                   |
| ------------------ | ----------------------------------------- | ---------------------------------------- |
| TOTP               | سازندهٔ گذرواژهٔ یک‌بارمصرف مبتنی بر زمان | [TOTP](./totp.md)                        |
| createSignal       | ساختن سیگنال واکنشی                       | [createSignal](./create_signal.md)       |
| setMime / MimeType | تنظیم یا به‌روزرسانی نگاشت نوع MIME       | [setMime](./set_mime.md)                 |
| getExtensions      | گرفتن پسوندها از روی نوع MIME             | [getExtensions](./get_extensions.md)     |
| SyncHook           | کلاس قلاب رویداد همگام                    | [SyncHook](./sync_hook.md)               |
| durationHandler    | ساختن تابعی که با تأخیر اجرا می‌شود       | [durationHandler](./duration_handler.md) |
