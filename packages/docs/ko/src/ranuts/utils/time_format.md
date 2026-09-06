# 시간 표기

화면에 나오는 시간은 세 가지 모습을 띠는데, 이것들을 뒤섞는 것이 흔한 혼란의 원인입니다. `ranuts`는 각각에 전용 함수를 둡니다.

| 읽는 사람이 궁금해하는 것    | 함수                                   | 출력 예               |
| ---------------------------- | -------------------------------------- | --------------------- |
| 이 일이 정확히 _언제_ 있었나 | [`formatDate`](./timestamp_to_time.md) | `2026-07-25 14:05:09` |
| 이것은 _얼마나 긴가_         | `formatDuration`                       | `01:01:01`            |
| 얼마나 _전_ 일인가           | `formatRelative`                       | `3 days ago`, `5m`    |

## formatDuration

흘러간 **초** 수를 콜론으로 나눈 시계 모양으로 바꿉니다. 미디어 플레이어가 재생 위치에 쓰는 그 모양입니다. `mm:ss`로 쓰다가 한 시간을 넘기면 `hh:mm:ss`로 늘어납니다.

#### 매개변수

| 매개변수  | 설명                             | 타입     | 기본값 |
| --------- | -------------------------------- | -------- | ------ |
| `seconds` | 흘러간 초. 음수는 0으로 맞춥니다 | `number` | 필수   |

#### Returns

`string`: 길이 문자열. 입력이 유한한 수가 아니면 `''`.

```js
import { formatDuration } from 'ranuts/utils';

formatDuration(0); // '00:00'
formatDuration(65); // '01:05'
formatDuration(3661); // '01:01:01'
formatDuration(NaN); // ''
```

`NaN`에 빈 문자열을 돌려주는 것은 일부러 그런 것입니다. 플레이어는 메타데이터가 오기 전에 `video.duration`을 묻고 `NaN`을 받는데, 그 자리에는 `NaN:NaN`보다 빈칸이 훨씬 낫기 때문입니다.

::: tip 이름이 바뀌었습니다
이 함수는 예전에 `timeFormat`이었습니다. 그 이름은 더 이상 권장하지 않는 별칭으로 남아 있고 동작도 똑같지만, 세 가지 시간 표기 중 _어느 것_ 을 만드는지 이름만으로는 알 수 없었습니다.
:::

## formatRelative

어떤 시점을 다른 시점에 견주어 풀어 말합니다. 「3일 전」, 「2시간 뒤」 같은 식입니다.

각 언어에 맞추는 일은 플랫폼의 [`Intl.RelativeTimeFormat`](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Intl/RelativeTimeFormat)에 맡깁니다. 2020년부터 주요 브라우저에 모두 들어 있고, 언어마다의 복수형과 어형 변화 규칙을 이미 알고 있기 때문입니다. `formatRelative`가 맡는 것은 `Intl`이 일부러 남겨 둔 부분, 곧 그 차이를 _어느 단위_ 로 말할지 고르는 일뿐입니다.

`Intl`이 그렇듯 단위는 **하나만** 알려 줍니다. 3일 6시간의 차이는 「3일 전」이지, 「3일 6시간 전」이 되지 않습니다.

#### 매개변수

| 매개변수  | 설명           | 타입                       | 기본값 |
| --------- | -------------- | -------------------------- | ------ |
| `value`   | 풀어 말할 시점 | `number \| string \| Date` | 필수   |
| `options` | 아래 참고      | `FormatRelativeOptions`    | `{}`   |

| 옵션      | 설명                                                                           | 타입                       | 기본값           |
| --------- | ------------------------------------------------------------------------------ | -------------------------- | ---------------- |
| `now`     | 무엇을 기준으로 잴지                                                           | `number \| string \| Date` | 현재 시각        |
| `locale`  | BCP 47 태그(여럿 가능). `compact` 스타일에서는 무시됩니다                      | `string \| string[]`       | 실행 환경의 로캘 |
| `style`   | `'long' \| 'short' \| 'narrow' \| 'compact'`                                   | `RelativeStyle`            | `'long'`         |
| `numeric` | `'auto'`는 `yesterday` 같은 표현으로 바꾸고, `'always'`는 숫자를 그대로 둡니다 | `'always' \| 'auto'`       | `'auto'`         |

#### Returns

`string`: 풀어 말한 문자열. 양쪽 중 하나라도 해석할 수 없으면 `''`.

```js
import { formatRelative } from 'ranuts/utils';

const twoHoursAgo = Date.now() - 2 * 3600_000;

formatRelative(twoHoursAgo); // '2 hours ago'
formatRelative(twoHoursAgo, { style: 'short' }); // '2 hr. ago'
formatRelative(twoHoursAgo, { locale: 'zh-CN' }); // '2 小时前'
formatRelative(Date.now() + 60_000); // 'in 1 minute'
formatRelative(Date.now() - 86_400_000); // 'yesterday'
formatRelative(Date.now() - 86_400_000, { numeric: 'always' }); // '1 day ago'
```

### compact 스타일

`compact`는 피드나 목록의 항목 옆에 붙는, 그 빽빽한 배지 표기입니다.

```js
formatRelative(Date.now() - 30_000, { style: 'compact' }); // '30s'
formatRelative(Date.now() - 5 * 60_000, { style: 'compact' }); // '5m'
formatRelative(Date.now() - 3 * 3600_000, { style: 'compact' }); // '3h'
formatRelative(Date.now() - 2 * 86_400_000, { style: 'compact' }); // '2d'
```

::: warning 앞뒤 방향은 담기지 않습니다
`compact`는 크기만 나타내므로, 앞으로의 시각도 지난 시각과 똑같이 보입니다(양쪽 다 `5m`). 이미 일어난 일이 늘어선 피드를 겨냥한 표기입니다. 읽는 사람이 과거와 미래를 가려야 하는 곳에서는 다른 스타일을 쓰세요.
:::

## parseVttTimestamp / parseVttCueTiming

WebVTT 자막의 시각, 곧 `.vtt` 파일에 들어 있는 `hh:mm:ss.mmm --> hh:mm:ss.mmm` 줄을 해석합니다.

`parseVttTimestamp`는 시각 하나(`hh:`는 있어도 없어도 됩니다)를 초로 바꿉니다. `parseVttCueTiming`은 큐의 시각 줄 전체, 곧 `-->`로 갈린 양쪽을 `{ start, end }`로 바꾸며, 뒤에 붙는 큐 설정(`align:start line:0` 등)은 흘려보냅니다.

```js
import { parseVttTimestamp, parseVttCueTiming } from 'ranuts/utils';

parseVttTimestamp('00:00:05.000'); // 5
parseVttTimestamp('01:05.250'); // 65.25
parseVttTimestamp('not a timestamp'); // undefined

parseVttCueTiming('00:00:00.000 --> 00:00:05.000'); // { start: 0, end: 5 }
parseVttCueTiming('00:00:05.000 --> 00:00:10.000 align:start line:0'); // { start: 5, end: 10 }
```

둘 다 입력이 형식에 맞지 않으면 예외를 던지지 않고 `undefined`를 돌려줍니다. 그래서 자막 파일에 망가진 줄이 하나 있어도 전체 해석을 멈추는 대신 그 줄만 건너뛸 수 있습니다.

## 참고

1. **단위 고르기**: `formatRelative`는 그 차이가 실제로 채우는 가장 굵은 단위를 골라, 그 안에서 반올림합니다. 반올림한 값이 다음 단위의 문턱에 닿으면(59.6분이 「60분」이 되는 식) 단위를 올려서 「1시간 전」으로 읽히게 합니다.
2. **부호를 떼고 반올림**: 크기를 먼저 반올림한 다음 부호를 되붙입니다. 자바스크립트에서 `Math.round(-1.5)`가 `-1`이라, 그렇게 하지 않으면 90분 전은 「1시간 전」인데 90분 뒤는 「2시간 뒤」가 되어 버리기 때문입니다.
3. **포매터 돌려쓰기**: `Intl.RelativeTimeFormat` 인스턴스는 로캘·스타일·numeric 조합마다 캐시됩니다. 그래서 시각 백 개를 그리는 목록도 포매터를 백 개가 아니라 하나만 만듭니다.
4. **대비책**: `Intl.RelativeTimeFormat`이 없는 실행 환경에서는 예외를 던지지 않고 간략 표기로 물러납니다.
