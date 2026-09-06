---
description: 'ranuts のユーティリティ関数の一覧。関数型のヘルパー（debounce、throttle、memoize、compose）に加え、文字列・オブジェクト・数値・色のユーティリティ。'
---

# ユーティリティ関数

## 関数型プログラミング

| メソッド | 説明                   | 詳細                      |
| -------- | ---------------------- | ------------------------- |
| debounce | デバウンス関数         | [debounce](./debounce.md) |
| throttle | スロットル関数         | [throttle](./throttle.md) |
| memoize  | メモ化関数             | [memoize](./memoize.md)   |
| noop     | 何もしない関数         | [noop](./noop.md)         |
| compose  | ミドルウェア関数の合成 | [compose](./compose.md)   |

## 文字列の処理

| メソッド                       | 説明                                                   | 詳細                                                |
| ------------------------------ | ------------------------------------------------------ | --------------------------------------------------- |
| md5                            | MD5 ハッシュ関数                                       | [md5](./md5.md)                                     |
| randomString / getRandomString | ランダムな文字列を生成                                 | [randomString](./random_string.md)                  |
| clearBr                        | 文字列から空白・HTML タグ・改行を取り除く              | [clearBr](./clear_br.md)                            |
| clearStr                       | 文字列から前後の空白・URL エンコード・引用符を取り除く | [clearStr](./clear_str.md)                          |
| truncate                       | 文字列を省略記号で短くする（Unicode に安全）           | [truncate](./truncate.md)                           |
| strParse                       | 文字列を解釈してオブジェクトにする                     | [strParse](./str_parse.md)                          |
| toString                       | 値を文字列型に変換                                     | [toString](./to_string.md)                          |
| transformText                  | ArrayBuffer をテキストに変換                           | [transformText](./transform_text.md)                |
| checkEncoding                  | Uint8Array データの文字エンコーディングを判定          | [checkEncoding](./check_encoding.md)                |
| getMatchingSentences           | キーワードを含む文をまるごと抜き出す                   | [getMatchingSentences](./get_matching_sentences.md) |
| isString                       | 値が文字列型かどうかを判定                             | [isString](./is_string.md)                          |

## オブジェクトの処理

| メソッド             | 説明                                                     | 詳細                            |
| -------------------- | -------------------------------------------------------- | ------------------------------- |
| merge / mergeExports | オブジェクトの統合。遅延ゲッターの export オブジェクトも | [merge](./merge.md)             |
| isEqual              | 二つの値が等しいかを深く比較                             | [isEqual](./is_equal.md)        |
| cloneDeep            | オブジェクトや配列をディープコピー                       | [cloneDeep](./clone_deep.md)    |
| querystring          | オブジェクトを URL のクエリ文字列に変換                  | [querystring](./querystring.md) |
| filterObj            | オブジェクトを絞り込む                                   | [filterObj](./filter_obj.md)    |
| formatJson           | 整形した JSON                                            | [formatJson](./format_json.md)  |

## 数値の処理

| メソッド                                                           | 説明                               | 詳細                                     |
| ------------------------------------------------------------------ | ---------------------------------- | ---------------------------------------- |
| range                                                              | 数値を指定した範囲に収める         | [range](./range.md)                      |
| clamp / lerp / inverseLerp / remap / fit / linearstep / smoothstep | シェーダー流の補間と値域の付け替え | [range](./range.md)                      |
| mathjs                                                             | 誤差のない数値計算関数             | [mathjs](./mathjs.md)                    |
| perToNum                                                           | パーセント文字列を数値に変換       | [perToNum](./per_to_num.md)              |
| transformNumber                                                    | 数値を単位付きの文字列に整形       | [transformNumber](./transform_number.md) |
| addNumSym                                                          | 数値に正負の符号を付ける           | [addNumSym](./add_num_sym.md)            |

## 色の処理

| メソッド                                                                                    | 説明                                              | 詳細                             |
| ------------------------------------------------------------------------------------------- | ------------------------------------------------- | -------------------------------- |
| hexToRgb                                                                                    | 16 進数の色を RGB に変換                          | [hexToRgb](./hex_to_rgb.md)      |
| rgbToHex                                                                                    | RGB の値を 16 進数の色に変換                      | [rgbToHex](./rgb_to_hex.md)      |
| randomColor                                                                                 | ランダムな色オブジェクトを生成                    | [randomColor](./random_color.md) |
| Color / ColorScheme                                                                         | Color クラス、値クラス、変換、パレット生成        | [Color](./color.md)              |
| blendScreen / blendMultiply / blendOverlay / luma / vibrance / cosinePalette / srgbToLinear | シェーダー流の色の合成と調整（0〜1 のチャンネル） | [Color](./color.md)              |

## 時間の処理

| メソッド                              | 説明                                           | 詳細                                      |
| ------------------------------------- | ---------------------------------------------- | ----------------------------------------- |
| formatDuration                        | 秒数を整形した文字列に変換                     | [formatDuration](./time_format.md)        |
| formatRelative                        | ある時点を今から見て言い表す（「3 日前」など） | [formatRelative](./time_format.md)        |
| parseVttTimestamp / parseVttCueTiming | WebVTT 字幕のタイミング行を解釈                | [parseVttTimestamp](./time_format.md)     |
| timestampToTime                       | タイムスタンプを Date オブジェクトに変換       | [timestampToTime](./timestamp_to_time.md) |
| performanceTime                       | 高精度のタイムスタンプを取得                   | [performanceTime](./performance_time.md)  |

## 端末の判定

| メソッド      | 説明                                 | 詳細                                 |
| ------------- | ------------------------------------ | ------------------------------------ |
| isMobile      | 端末がモバイルかどうかを判定         | [isMobile](./is_mobile.md)           |
| isWeiXin      | ブラウザーが WeChat かどうかを判定   | [isWeiXin](./is_weixin.md)           |
| isClient      | 実行環境がクライアントかどうかを判定 | [isClient](./is_client.md)           |
| isSafari      | ブラウザーが Safari かどうかを判定   | [isSafari](./is_safari.md)           |
| currentDevice | 現在の端末の種類を取得               | [currentDevice](./current_device.md) |

## DOM の操作

| メソッド                               | 説明                                              | 詳細                                                    |
| -------------------------------------- | ------------------------------------------------- | ------------------------------------------------------- |
| addClassToElement                      | DOM 要素に CSS クラス名を追加                     | [addClassToElement](./add_class_to_element.md)          |
| removeClassToElement                   | DOM 要素から CSS クラス名を削除                   | [removeClassToElement](./remove_class_to_element.md)    |
| createDocumentFragment                 | DocumentFragment を作る                           | [createDocumentFragment](./create_document_fragment.md) |
| escapeHtml                             | HTML の特殊文字をエスケープ                       | [escapeHtml](./escape_html.md)                          |
| Chain                                  | メソッドチェーンできる DOM 操作クラス             | [Chain](./chain.md)                                     |
| create                                 | DOM 要素を作るヘルパー関数                        | [create](./create.md)                                   |
| EventManager / createDoubleTapDetector | 範囲を区切ったリスナー登録とダブルタップ検出      | [EventManager](./event_manager.md)                      |
| adoptStyles                            | スタイルシートのテキストを shadow root に流し込む | [adoptStyles](./adopt_styles.md)                        |
| computePlacement                       | 浮かぶパネルを基準要素に対して反転・ずらし配置    | [computePlacement](./placement.md)                      |
| setFontSize2html                       | モバイル向けの rem 可変によるビューポート調整     | [setFontSize2html](./set_font_size.md)                  |

## メディア

| メソッド               | 説明                                  | 詳細                                  |
| ---------------------- | ------------------------------------- | ------------------------------------- |
| AudioRecorder          | マイクの音声を `Blob` に録音          | [AudioRecorder](./audio_recorder.md)  |
| createSpeechRecognizer | Web Speech API による音声のテキスト化 | [createSpeechRecognizer](./speech.md) |

## ストレージ

| メソッド            | 説明                      | 詳細                                      |
| ------------------- | ------------------------- | ----------------------------------------- |
| localStorageGetItem | localStorage から値を取得 | [localStorageGetItem](./local_storage.md) |
| localStorageSetItem | localStorage に値を保存   | [localStorageSetItem](./local_storage.md) |

## URL とクエリ

| メソッド          | 説明                                 | 詳細                                           |
| ----------------- | ------------------------------------ | ---------------------------------------------- |
| getAllQueryString | URL からクエリパラメーターを取り出す | [getAllQueryString](./get_all_query_string.md) |
| encodeUrl         | URL を安全にエンコード               | [encodeUrl](./encode_url.md)                   |
| appendUrl         | URL にクエリパラメーターを足す       | [appendUrl](./append_url.md)                   |

## Cookie

| メソッド        | 説明                         | 詳細                                       |
| --------------- | ---------------------------- | ------------------------------------------ |
| getCookie       | 指定した cookie の値を取得   | [getCookie](./get_cookie.md)               |
| getCookieByName | 正規表現で Cookie の値を取得 | [getCookieByName](./get_cookie_by_name.md) |

## 画像の処理

| メソッド             | 説明                         | 詳細                                                 |
| -------------------- | ---------------------------- | ---------------------------------------------------- |
| convertImageToBase64 | 画像ファイルを Base64 に変換 | [convertImageToBase64](./convert_image_to_base64.md) |
| isImageSize          | 画像ファイルの寸法を検証     | [isImageSize](./is_image_size.md)                    |

## パフォーマンス

| メソッド       | 説明                             | 詳細                                   |
| -------------- | -------------------------------- | -------------------------------------- |
| getPerformance | ページのパフォーマンス指標を取得 | [getPerformance](./get_performance.md) |
| getFrame       | フレームレートを算出             | [getFrame](./get_frame.md)             |
| getPixelRatio  | Canvas の解像度比を取得          | [getPixelRatio](./get_pixel_ratio.md)  |

## ネットワーク

| メソッド           | 説明                                        | 詳細                               |
| ------------------ | ------------------------------------------- | ---------------------------------- |
| imageRequest       | 画像リクエストで通信の遅延を測る            | [imageRequest](./image_request.md) |
| networkSpeed       | 通信の ping 値とゆらぎを測る                | [networkSpeed](./network_speed.md) |
| connection         | 現在のネットワーク接続の情報を取得          | [connection](./connection.md)      |
| getStatus / status | HTTP ステータスコードとメッセージの相互引き | [getStatus](./status.md)           |

## ブラウザー

| メソッド                             | 説明                                              | 詳細                                      |
| ------------------------------------ | ------------------------------------------------- | ----------------------------------------- |
| getWindow                            | ビューポートの大きさを取得                        | [getWindow](./get_window.md)              |
| createObjectURL / requestUrlToBuffer | オブジェクト URL の作成。URL をバイト列として取得 | [createObjectURL](./create_object_url.md) |

## スクリプトの読み込み

| メソッド     | 説明                                | 詳細                                |
| ------------ | ----------------------------------- | ----------------------------------- |
| scriptOnLoad | script や link タグを動的に差し込む | [scriptOnLoad](./script_on_load.md) |

## エラーの処理

| メソッド        | 説明                                       | 詳細                                      |
| --------------- | ------------------------------------------ | ----------------------------------------- |
| handleConsole   | console のメソッド呼び出しを横取りして処理 | [handleConsole](./handle_console.md)      |
| handleError     | グローバルなエラー処理                     | [handleError](./handle_error.md)          |
| handleFetchHook | fetch リクエストを横取りして処理           | [handleFetchHook](./handle_fetch_hook.md) |

## その他

| メソッド           | 説明                                 | 詳細                                     |
| ------------------ | ------------------------------------ | ---------------------------------------- |
| TOTP               | 時刻ベースのワンタイムパスワード生成 | [TOTP](./totp.md)                        |
| createSignal       | リアクティブなシグナルを作る         | [createSignal](./create_signal.md)       |
| setMime / MimeType | MIME タイプの対応表を設定・更新      | [setMime](./set_mime.md)                 |
| getExtensions      | MIME タイプから拡張子を取得          | [getExtensions](./get_extensions.md)     |
| SyncHook           | 同期的なイベントフッククラス         | [SyncHook](./sync_hook.md)               |
| durationHandler    | 遅らせて実行する関数を作る           | [durationHandler](./duration_handler.md) |
