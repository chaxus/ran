---
description: 'ranuts 유틸리티 함수 한눈에 보기. 함수형 도우미(debounce, throttle, memoize, compose)와 문자열·객체·숫자·색 유틸리티.'
---

# 유틸리티 함수

## 함수형 프로그래밍

| 메서드   | 설명                     | 자세히                    |
| -------- | ------------------------ | ------------------------- |
| debounce | 디바운스 함수            | [debounce](./debounce.md) |
| throttle | 스로틀 함수              | [throttle](./throttle.md) |
| memoize  | 메모이제이션 함수        | [memoize](./memoize.md)   |
| noop     | 아무 일도 하지 않는 함수 | [noop](./noop.md)         |
| compose  | 미들웨어 함수를 합성     | [compose](./compose.md)   |

## 문자열 다루기

| 메서드                         | 설명                                              | 자세히                                              |
| ------------------------------ | ------------------------------------------------- | --------------------------------------------------- |
| md5                            | MD5 해시 함수                                     | [md5](./md5.md)                                     |
| randomString / getRandomString | 무작위 문자열 만들기                              | [randomString](./random_string.md)                  |
| clearBr                        | 문자열에서 공백·HTML 태그·줄바꿈 없애기           | [clearBr](./clear_br.md)                            |
| clearStr                       | 문자열에서 앞뒤 공백·URL 인코딩·따옴표 없애기     | [clearStr](./clear_str.md)                          |
| truncate                       | 유니코드를 깨뜨리지 않고 말줄임표로 문자열 줄이기 | [truncate](./truncate.md)                           |
| strParse                       | 문자열을 해석해 객체로                            | [strParse](./str_parse.md)                          |
| toString                       | 값을 문자열 타입으로 바꾸기                       | [toString](./to_string.md)                          |
| transformText                  | ArrayBuffer를 텍스트로 바꾸기                     | [transformText](./transform_text.md)                |
| checkEncoding                  | Uint8Array 데이터의 문자 인코딩 알아내기          | [checkEncoding](./check_encoding.md)                |
| getMatchingSentences           | 키워드가 든 문장을 통째로 뽑아내기                | [getMatchingSentences](./get_matching_sentences.md) |
| isString                       | 값이 문자열 타입인지 판별                         | [isString](./is_string.md)                          |

## 객체 다루기

| 메서드               | 설명                                          | 자세히                          |
| -------------------- | --------------------------------------------- | ------------------------------- |
| merge / mergeExports | 객체 합치기. 게으른 게터로 된 내보내기 객체도 | [merge](./merge.md)             |
| isEqual              | 두 값이 같은지 깊이 비교                      | [isEqual](./is_equal.md)        |
| cloneDeep            | 객체나 배열을 깊이 복제                       | [cloneDeep](./clone_deep.md)    |
| querystring          | 객체를 URL 질의 문자열로 바꾸기               | [querystring](./querystring.md) |
| filterObj            | 객체 걸러내기                                 | [filterObj](./filter_obj.md)    |
| formatJson           | 보기 좋게 다듬은 JSON                         | [formatJson](./format_json.md)  |

## 숫자 다루기

| 메서드                                                             | 설명                               | 자세히                                   |
| ------------------------------------------------------------------ | ---------------------------------- | ---------------------------------------- |
| range                                                              | 숫자를 지정한 범위 안에 가두기     | [range](./range.md)                      |
| clamp / lerp / inverseLerp / remap / fit / linearstep / smoothstep | 셰이더식 보간과 값 범위 옮기기     | [range](./range.md)                      |
| mathjs                                                             | 오차 없는 수 계산 함수             | [mathjs](./mathjs.md)                    |
| perToNum                                                           | 백분율 문자열을 숫자로 바꾸기      | [perToNum](./per_to_num.md)              |
| transformNumber                                                    | 숫자를 단위가 붙은 문자열로 다듬기 | [transformNumber](./transform_number.md) |
| addNumSym                                                          | 숫자에 양수·음수 부호 붙이기       | [addNumSym](./add_num_sym.md)            |

## 색 다루기

| 메서드                                                                                      | 설명                                         | 자세히                           |
| ------------------------------------------------------------------------------------------- | -------------------------------------------- | -------------------------------- |
| hexToRgb                                                                                    | 16진수 색값을 RGB로 바꾸기                   | [hexToRgb](./hex_to_rgb.md)      |
| rgbToHex                                                                                    | RGB 값을 16진수 색값으로 바꾸기              | [rgbToHex](./rgb_to_hex.md)      |
| randomColor                                                                                 | 무작위 색 객체 만들기                        | [randomColor](./random_color.md) |
| Color / ColorScheme                                                                         | Color 클래스, 값 클래스, 변환, 팔레트 생성기 | [Color](./color.md)              |
| blendScreen / blendMultiply / blendOverlay / luma / vibrance / cosinePalette / srgbToLinear | 셰이더식 색 혼합과 보정 계산(0~1 채널)       | [Color](./color.md)              |

## 시간 다루기

| 메서드                                | 설명                                         | 자세히                                    |
| ------------------------------------- | -------------------------------------------- | ----------------------------------------- |
| formatDuration                        | 초 단위 시간을 다듬은 문자열로 바꾸기        | [formatDuration](./time_format.md)        |
| formatRelative                        | 어떤 시각을 지금에 견주어 말하기(「3일 전」) | [formatRelative](./time_format.md)        |
| parseVttTimestamp / parseVttCueTiming | WebVTT 자막의 시각 줄 해석                   | [parseVttTimestamp](./time_format.md)     |
| timestampToTime                       | 타임스탬프를 Date 객체로 바꾸기              | [timestampToTime](./timestamp_to_time.md) |
| performanceTime                       | 정밀한 타임스탬프 얻기                       | [performanceTime](./performance_time.md)  |

## 기기 판별

| 메서드        | 설명                            | 자세히                               |
| ------------- | ------------------------------- | ------------------------------------ |
| isMobile      | 기기가 모바일인지 판별          | [isMobile](./is_mobile.md)           |
| isWeiXin      | 브라우저가 위챗인지 판별        | [isWeiXin](./is_weixin.md)           |
| isClient      | 실행 환경이 클라이언트인지 판별 | [isClient](./is_client.md)           |
| isSafari      | 브라우저가 사파리인지 판별      | [isSafari](./is_safari.md)           |
| currentDevice | 지금 기기의 종류 얻기           | [currentDevice](./current_device.md) |

## DOM 다루기

| 메서드                                 | 설명                                          | 자세히                                                  |
| -------------------------------------- | --------------------------------------------- | ------------------------------------------------------- |
| addClassToElement                      | DOM 요소에 CSS 클래스 이름 더하기             | [addClassToElement](./add_class_to_element.md)          |
| removeClassToElement                   | DOM 요소에서 CSS 클래스 이름 빼기             | [removeClassToElement](./remove_class_to_element.md)    |
| createDocumentFragment                 | DocumentFragment 만들기                       | [createDocumentFragment](./create_document_fragment.md) |
| escapeHtml                             | HTML 특수 문자 이스케이프                     | [escapeHtml](./escape_html.md)                          |
| Chain                                  | 체이닝되는 DOM 조작 클래스                    | [Chain](./chain.md)                                     |
| create                                 | DOM 요소를 만드는 도우미 함수                 | [create](./create.md)                                   |
| EventManager / createDoubleTapDetector | 범위를 가진 리스너 등록기와 더블 탭 감지      | [EventManager](./event_manager.md)                      |
| adoptStyles                            | 스타일시트 텍스트를 섀도 루트에 넣기          | [adoptStyles](./adopt_styles.md)                        |
| computePlacement                       | 기준 요소에 맞춰 떠 있는 패널을 뒤집거나 밀기 | [computePlacement](./placement.md)                      |
| setFontSize2html                       | 모바일 레이아웃을 위한 가변 rem 뷰포트 조정   | [setFontSize2html](./set_font_size.md)                  |

## 미디어

| 메서드                 | 설명                          | 자세히                                |
| ---------------------- | ----------------------------- | ------------------------------------- |
| AudioRecorder          | 마이크 소리를 `Blob`으로 녹음 | [AudioRecorder](./audio_recorder.md)  |
| createSpeechRecognizer | Web Speech API로 말을 글로    | [createSpeechRecognizer](./speech.md) |

## 저장소

| 메서드              | 설명                     | 자세히                                    |
| ------------------- | ------------------------ | ----------------------------------------- |
| localStorageGetItem | localStorage에서 값 읽기 | [localStorageGetItem](./local_storage.md) |
| localStorageSetItem | localStorage에 값 넣기   | [localStorageSetItem](./local_storage.md) |

## URL과 질의 문자열

| 메서드            | 설명                           | 자세히                                         |
| ----------------- | ------------------------------ | ---------------------------------------------- |
| getAllQueryString | URL에서 질의 매개변수 뽑아내기 | [getAllQueryString](./get_all_query_string.md) |
| encodeUrl         | URL을 안전하게 인코딩          | [encodeUrl](./encode_url.md)                   |
| appendUrl         | URL에 질의 매개변수 덧붙이기   | [appendUrl](./append_url.md)                   |

## 쿠키

| 메서드          | 설명                    | 자세히                                     |
| --------------- | ----------------------- | ------------------------------------------ |
| getCookie       | 지정한 쿠키의 값 얻기   | [getCookie](./get_cookie.md)               |
| getCookieByName | 정규식으로 쿠키 값 얻기 | [getCookieByName](./get_cookie_by_name.md) |

## 이미지 다루기

| 메서드               | 설명                          | 자세히                                               |
| -------------------- | ----------------------------- | ---------------------------------------------------- |
| convertImageToBase64 | 이미지 파일을 Base64로 바꾸기 | [convertImageToBase64](./convert_image_to_base64.md) |
| isImageSize          | 이미지 파일의 크기 검사       | [isImageSize](./is_image_size.md)                    |

## 성능

| 메서드         | 설명                    | 자세히                                 |
| -------------- | ----------------------- | -------------------------------------- |
| getPerformance | 페이지 성능 지표 얻기   | [getPerformance](./get_performance.md) |
| getFrame       | 초당 프레임 수 계산     | [getFrame](./get_frame.md)             |
| getPixelRatio  | Canvas 해상도 비율 얻기 | [getPixelRatio](./get_pixel_ratio.md)  |

## 네트워크

| 메서드             | 설명                                | 자세히                             |
| ------------------ | ----------------------------------- | ---------------------------------- |
| imageRequest       | 이미지 요청으로 네트워크 지연 재기  | [imageRequest](./image_request.md) |
| networkSpeed       | 네트워크 핑과 흔들림 재기           | [networkSpeed](./network_speed.md) |
| connection         | 지금 네트워크 연결 정보 얻기        | [connection](./connection.md)      |
| getStatus / status | HTTP 상태 코드와 메시지를 서로 찾기 | [getStatus](./status.md)           |

## 브라우저

| 메서드                               | 설명                                          | 자세히                                    |
| ------------------------------------ | --------------------------------------------- | ----------------------------------------- |
| getWindow                            | 보이는 창의 크기 얻기                         | [getWindow](./get_window.md)              |
| createObjectURL / requestUrlToBuffer | 객체 URL 만들기. URL을 바이트 그대로 받아오기 | [createObjectURL](./create_object_url.md) |

## 스크립트 불러오기

| 메서드       | 설명                                    | 자세히                              |
| ------------ | --------------------------------------- | ----------------------------------- |
| scriptOnLoad | script나 link 태그를 그때그때 끼워 넣기 | [scriptOnLoad](./script_on_load.md) |

## 오류 처리

| 메서드          | 설명                              | 자세히                                    |
| --------------- | --------------------------------- | ----------------------------------------- |
| handleConsole   | console 메서드 호출을 가로채 처리 | [handleConsole](./handle_console.md)      |
| handleError     | 전역 오류 처리                    | [handleError](./handle_error.md)          |
| handleFetchHook | fetch 요청을 가로채 처리          | [handleFetchHook](./handle_fetch_hook.md) |

## 그 밖에

| 메서드             | 설명                             | 자세히                                   |
| ------------------ | -------------------------------- | ---------------------------------------- |
| TOTP               | 시간 기반 일회용 비밀번호 생성기 | [TOTP](./totp.md)                        |
| createSignal       | 반응형 시그널 만들기             | [createSignal](./create_signal.md)       |
| setMime / MimeType | MIME 타입 대응표를 넣거나 고치기 | [setMime](./set_mime.md)                 |
| getExtensions      | MIME 타입에서 확장자 얻기        | [getExtensions](./get_extensions.md)     |
| SyncHook           | 동기 이벤트 훅 클래스            | [SyncHook](./sync_hook.md)               |
| durationHandler    | 나중에 실행되는 함수 만들기      | [durationHandler](./duration_handler.md) |
