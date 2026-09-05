---
description: 'ranui Player(<r-player>)는 네이티브 <video>를 하나의 컨트롤 바로 감쌉니다. 재생, 진행 바 드래그, 음량, 속도, 전체 화면과 HLS/DASH/FLV/WebRTC 스트리밍을 갖췄습니다.'
---

# Player

`<video>`를 하나의 컨트롤 바로 감싸는 네이티브 `<r-player>` 미디어 요소입니다. 진행 바 드래그, 음량 조절, 재생 속도, 전체 화면, 그리고 HLS/DASH/FLV/WebRTC 스트리밍을 갖췄습니다.

> **이럴 때 씁니다.** 컨트롤 바가 붙어 있고 진행 바를 끌 수 있으며 재생 속도, 전체 화면, HLS/DASH/FLV/WebRTC 스트리밍이 되는 비디오 플레이어가 필요할 때. `<r-player>`는 `<video>`를 감싸고 어떤 프레임워크에서도 그대로 돕니다.

웹 컴포넌트 위에 지어졌고, `hls.js`/`dashjs`/`mpegts.js`는 각 형식이 필요할 때만 지연 로드됩니다. 그래서 같은 플레이어가 어떤 프레임워크에서도 그대로 돕니다. 소스에서 뽑은 기능은 이렇습니다.

- 끌 수 있는 진행 바. 버퍼 표시와, 커서를 올렸을 때의 시간 툴팁이 붙습니다
- 음량 조절과 음소거 전환
- 재생 속도 선택
- 전체 화면 전환(`Esc`로 빠져나옴)
- PIP 전환: 버튼은 브라우저가 실제로 지원할 때만 그려집니다
- AirPlay·원격 재생 버튼: 브라우저 자체의 기기 선택기이며, PIP와 같은 방식으로 기능을 감지합니다
- 모바일 제스처: 왼쪽·오른쪽 절반을 두 번 두드리면 ∓10초 이동, 오른쪽 절반을 세로로 쓸면 음량 조절(터치 전용. 마우스·펜 조작은 그대로입니다)
- 터치·펜·마우스로 하는 스크러빙: 진행 바의 점은 셋 모두에 대해 하나의 Pointer Events 구현을 씁니다. 드래그 도중 브라우저가 포인터를 거둬 가면, 이동 없이 드래그가 끝납니다. 시청자가 고른 위치에서 포인터를 놓은 것이 아니기 때문입니다
- 썸네일 스크러빙 미리보기: `thumbnails`에 WebVTT 스프라이트 시트 매니페스트 URL을 주면, 진행 바 툴팁 위에 잘라 낸 미리보기가 나타납니다
- `poster` / `autoplay` / `loop` / `muted`: 표준 `<video>` 어트리뷰트를 그대로 넘깁니다
- 자막·CC: `tracks` 프로퍼티를 지정하면, 큐 렌더링은 브라우저 기본 기능이 맡고, 시청자의 선택을 기억하는 언어 선택기가 붙습니다
- 오류와 다시 시도: 치명적인 재생 실패 때 `Modal.error()` 대화 상자를 띄웁니다. 기본으로 켜져 있고 `disable-error-modal`로 끕니다
- 이어 보기: `remember-position`으로 켜면 `localStorage`에 `src`별 키로 저장됩니다
- QoE 지표: `getMetrics()`가 이미 있는 이벤트 흐름에서 재버퍼 횟수와 시간, 첫 프레임까지의 시간, 화질 전환 횟수, 오류 횟수를 뽑아냅니다
- HLS(`.m3u8`)와 DASH(`.mpd`) 재생. 자동 비트레이트 전환과 수동 화질 선택기가 있습니다. FLV / 날 MPEG-TS(`.flv`/`.ts`)는 `mpegts.js`로 재생합니다. 모든 엔진이 필요할 때 지연 로드되며 설정은 필요 없습니다. URL의 확장자를 짚어 낼 수 없을 때는 `format` 어트리뷰트로 특정 엔진을 강제할 수 있습니다(평범한 `<video src>`로 되돌릴 수도 있습니다).
- WHEP를 통한 WebRTC 저지연 라이브 재생(`format="webrtc"`, `src`는 WHEP 엔드포인트 URL). 라이브러리 의존이 없습니다. `RTCPeerConnection`은 브라우저의 네이티브 API입니다.
- 키보드 단축키: `Space` 재생·일시정지, `ArrowLeft` / `ArrowRight` 5초 이동, `Escape` 전체 화면 해제, 포커스된 진행 바에서는 `Home`/`End`와 화살표

## 빠른 시작

<Demo>
  <r-player style="display:block;width:100%;max-width:600px;height:300px;" src="https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8"></r-player>
</Demo>

```html
<r-player src="https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8"></r-player>
```

> 이 요소는 `display: block`으로 그려집니다. 영상이 채울 상자가 있도록 너비와 높이를 명시적으로(인라인 스타일이나 CSS로) 주세요.

## API 레퍼런스

### 속성

| 속성                  | 타입                  | 기본값  | 설명                                                                                                                                                                                                                                                                  |
| --------------------- | --------------------- | ------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `src`                 | `string`              | `''`    | 영상 리소스의 URL. 바꾸면 플레이어를 다시 불러옵니다. 엔진(HLS·네이티브)은 확장자에서 자동으로 판별됩니다.                                                                                                                                                            |
| `format`              | `string`              | `''`    | `src`의 확장자로 판별하는 대신 특정 엔진(`hls` / `dash` / `flv` / `webrtc` / `native`)을 강제합니다. 확장자가 없거나 서명된 스트리밍 URL에 쓸모 있고, `webrtc`에서는 **필수**입니다(WHEP 엔드포인트에는 판별할 확장자가 없습니다). 바꾸면 플레이어를 다시 불러옵니다. |
| `volume`              | `string`              | `''`    | 초기 음량. `0`–`100` 눈금이며 `setVolume()`/`getVolume()`과 같은 척도입니다.                                                                                                                                                                                          |
| `currentTime`         | `string`              | `''`    | 초기 재생 위치(초). 소문자 `currenttime`으로도 받습니다.                                                                                                                                                                                                              |
| `playbackRate`        | `string`              | `''`    | 재생 속도 배수(`1`, `1.5`, `2` 등). 소문자 `playbackrate`로도 받습니다.                                                                                                                                                                                               |
| `debug`               | `string`              | `''`    | 참 값이면 내부의 모든 `change` 이벤트와 경고를 콘솔에 찍습니다.                                                                                                                                                                                                       |
| `sheet`               | `string`              | `''`    | 모습을 바꾸려고 컴포넌트의 섀도 DOM에 주입하는 CSS 텍스트.                                                                                                                                                                                                            |
| `poster`              | `string`              | `''`    | 재생 전에 보여 줄 이미지 URL. `<video poster>`로 그대로 넘어갑니다.                                                                                                                                                                                                   |
| `autoplay`            | `boolean`             | `false` | 불리언 어트리뷰트. 있으면 `true`이며 네이티브 `<video autoplay>`와 같습니다. 사용자의 조작 없이 자동 재생이 실제로 시작되려면 브라우저는 대개 `muted`를 요구합니다.                                                                                                   |
| `loop`                | `boolean`             | `false` | 불리언 어트리뷰트. 끝나면 다시 재생합니다. 네이티브 `<video loop>`와 같습니다.                                                                                                                                                                                        |
| `muted`               | `boolean`             | `false` | 불리언 어트리뷰트. 소리 없이 시작합니다. 내부적으로 음량을 `0`으로 두고(음소거 아이콘과 슬라이더가 맞도록) **동시에** 네이티브 `<video>.muted` 플래그도 세웁니다(브라우저의 음소거 자동재생 정책을 만족시키려고). 어트리뷰트를 없애면 이전 음량으로 돌아갑니다.       |
| `thumbnails`          | `string`              | `''`    | WebVTT 스프라이트 시트 매니페스트의 URL. 진행 바 툴팁 위에 잘라 낸 썸네일을 보여 줍니다. 아래 [썸네일 스크러빙 미리보기](#thumbnail-scrubbing-preview-thumbnails)를 보세요. `src`와 무관하며, 이 어트리뷰트 자체가 바뀔 때만 다시 가져옵니다.                         |
| `disable-error-modal` | `boolean`             | `false` | 내장된 오류·다시 시도 대화 상자를 끕니다. 오류는 `error`/`sourceerror` `change` 이벤트로 계속 전해지므로, 그 위에 직접 UI를 만들 수 있습니다.                                                                                                                         |
| `remember-position`   | `boolean`             | `false` | 이어 보기를 켭니다. 일시정지할 때와 탭이 가려질 때 현재 위치를 `localStorage`(`src`별 키)에 저장하고, 같은 `src`를 다음에 불러올 때 되살리며, 재생이 끝나면 지웁니다.                                                                                                 |
| `tracks`              | `PlayerTrackConfig[]` | `[]`    | 자막·CC 트랙. **JS 프로퍼티만 있고 짝이 되는 어트리뷰트는 없습니다**(플레이어가 불러올 때마다 자기 라이트 DOM을 비우므로, 선언적으로 쓴 `<track>` 자식은 효력을 내기 전에 사라집니다). 아래 [자막·CC](#subtitles-cc-tracks)를 보세요.                                 |

> 관찰하는 어트리뷰트(`observedAttributes` 기준): `src`, `format`, `volume`, `currentTime` / `currenttime`, `playbackRate` / `playbackrate`, `debug`, `sheet`, `poster`, `thumbnails`, `autoplay`, `loop`, `muted`, `disable-error-modal`, `remember-position`.

### 영상 소스 `src`

<Demo>
  <r-player style="display:block;width:100%;max-width:600px;height:300px;" src="https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8"></r-player>
</Demo>

```html
<r-player src="https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8"></r-player>
```

### WebRTC 라이브 재생 `format="webrtc"`

```html
<r-player format="webrtc" src="https://stream.example.com/whep/room123"></r-player>
```

저지연 라이브 스트림이라면 `format="webrtc"`를 지정하고 `src`를 **WHEP**(WebRTC-HTTP Egress Protocol) 엔드포인트로 향하게 하세요. Cloudflare Stream, LiveKit egress, Millicast 같은 플랫폼이 내주는 그것입니다. 라이브러리 의존은 없습니다. `RTCPeerConnection`과 `fetch`는 브라우저의 네이티브 API라, HLS/DASH/FLV와 달리 이 엔진에는 내려받을 지연 청크가 없습니다. WHEP 엔드포인트에는 자동으로 판별할 파일 확장자가 없으므로 `format="webrtc"`는 **필수**이며, `src`에서 추론되는 일은 없습니다.

속을 들여다보면: `recvonly` 오디오·비디오 트랜시버를 가진 `RTCPeerConnection`을 만들고, ICE 수집을 기다린 뒤, SDP 오퍼를 `src`로 `POST`하고(`Content-Type: application/sdp`), 응답 본문의 SDP 앤서를 적용하고, 들어온 스트림을 `video.srcObject`에 붙입니다. 재생을 끝낼 때는 서버가 응답의 `Location` 헤더로 돌려준 세션 리소스를 `DELETE`합니다. 범위는 일부러 소박합니다. WHEP의 PATCH 기반 트리클 방식 대신 논트리클 ICE를 쓰고(몇 초에서 끊고 그때까지 모은 후보로 진행합니다), 서버가 알려 주는 STUN/TURN 힌트를 위한 `Link: rel="ice-server"` 헤더 해석도 하지 않습니다. 직접 닿을 수 있는 대부분의 WHEP 구성은 둘 다 없이도 동작합니다. FLV처럼 화질 선택기도 없습니다. WHEP에는 클라이언트 쪽 멀티 비트레이트 선택의 표준이 없어서, 이 엔진에서는 `getMetrics()`의 `qualitySwitchCount`가 `0`에 머뭅니다.

### 초기 음량 `volume`

값은 `0`–`100` 눈금입니다.

```html
<r-player src="https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8" volume="30"></r-player>
```

### 초기 재생 위치 `currentTime`

미디어 시작으로부터의 초입니다.

```html
<r-player src="https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8" currentTime="15"></r-player>
```

### 재생 속도 `playbackRate`

```html
<r-player src="https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8" playbackRate="1.5"></r-player>
```

### 디버그 로그 `debug`

```html
<r-player src="https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8" debug="true"></r-player>
```

### 포스터, 자동 재생, 반복, 음소거

```html
<r-player
  src="https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8"
  poster="/ran/hls/poster.jpg"
  autoplay
  muted
  loop
></r-player>
```

### PIP

컨트롤 바의 PIP 버튼은 `document.pictureInPictureEnabled`가 참일 때만 나타납니다. 지원하지 않는 브라우저에 눌러도 아무 일 없는 버튼이 남지 않습니다. 코드에서는 `togglePip()`으로 전환합니다.

### AirPlay / 원격 재생

캐스트 버튼은 브라우저가 표준화 진행 중인 Remote Playback API(`videoElement.remote.prompt()`, Chrome/Edge)나 Safari의 `webkitShowPlaybackTargetPicker()`(AirPlay) 중 하나를 노출할 때 나타납니다. 그 밖에서는 비활성이 아니라 숨겨집니다. PIP와 같은 점진적 향상 원칙입니다. 기기 선택기는 코드에서 `showRemotePlaybackPicker()`로 엽니다.

### 모바일 제스처

터치 전용이고 기본으로 켜져 있으며, 켜기 위한 어트리뷰트는 없습니다. 영상의 왼쪽 절반을 두 번 두드리면 10초 뒤로, 오른쪽 절반을 두 번 두드리면 10초 앞으로 갑니다(짧은 `-10s`/`+10s` 표시가 확인해 줍니다). 오른쪽 절반을 세로로 끌면 음량이 조절됩니다. 마우스와 펜 조작은 전혀 건드리지 않습니다. 한 번 두드리는 것은 여전히 재생·일시정지를 전환하되, 두 번 두드림을 판별하는 것과 같은 시간창으로 지연되므로, 이동을 위한 두 번 두드림 도중에 사이 터치가 재생을 깜박이게 하는 일이 없습니다. 스와이프에서는 기존 `volume` 이벤트와 함께 `gestureseek` `change` 이벤트(`{ direction, seconds }`)를 냅니다.

### 썸네일 스크러빙 미리보기 `thumbnails` {#thumbnail-scrubbing-preview-thumbnails}

```html
<r-player src="https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8" thumbnails="/ran/hls/thumbnails.vtt"></r-player>
```

`thumbnails`는 YouTube와 Video.js가 쓰는 스프라이트 시트 관례를 따르는 큐를 담은 WebVTT 매니페스트를 가리킵니다. 각 큐의 텍스트는 이미지 참조에, 공유 스프라이트 시트에서의 잘라 낼 자리를 알려 주는 `#xywh=x,y,w,h` 조각을 붙인 것입니다.

```text
WEBVTT

00:00:00.000 --> 00:00:05.000
sprites.jpg#xywh=0,0,160,90

00:00:05.000 --> 00:00:10.000
sprites.jpg#xywh=160,0,160,90
```

이미지 참조는 VTT 파일 자신의 URL을 기준으로 해석되므로, 매니페스트 옆에 둔 스프라이트 시트에는 절대 경로가 필요 없습니다. 진행 바에 커서를 올리거나 끌면, 그 시각을 덮는 큐가 기존 시간 툴팁 위에 잘린 썸네일로 나타납니다. `thumbnails`가 없거나 매니페스트가 아직 로드되지 않았다면 아무것도 그리지 않습니다. 매니페스트는 `thumbnails`가 바뀔 때마다 한 번씩 가져와 파싱하며, `src`와는 무관합니다. 화질이나 소스를 바꿔도 다시 가져오지 않습니다.

### 자막·CC `tracks` {#subtitles-cc-tracks}

```js
const player = document.createElement('r-player');
player.tracks = [
  { src: '/captions/en.vtt', srclang: 'en', label: 'English', default: true },
  { src: '/captions/fr.vtt', srclang: 'fr', label: 'Français' },
];
stage.append(player);
```

각 항목은 밑에 깔린 `<video>`의 네이티브 `<track>`이 됩니다. 큐 렌더링은 전적으로 브라우저의 몫이고, 플레이어가 따로 그리는 것은 없습니다. 컨트롤 바에는 언어 선택기(`<r-select>`. 화질 선택기와 같은 조작감)가 나타나 **Off**와 트랙마다 하나씩의 항목을 보여 줍니다. 고른 언어는 `localStorage`에 기억되고, 다음에 페이지의 어떤 `<r-player>`가 트랙을 받든 자동으로 적용됩니다(영상별이 아니라 전역 설정입니다). 아직 저장된 것이 없으면 `default: true`인 트랙으로 물러납니다. `tracks = []`로 두면 선택기와 모든 트랙이 사라집니다. `setSubtitleLanguage(lang)`으로 활성 언어를 코드에서 지정할 수 있습니다(`lang`은 `srclang` 또는 `'off'`).

### 오류와 다시 시도

기본으로 켜져 있습니다. 스트리밍 엔진의 치명적 오류나 네이티브 `<video>`의 `error` 이벤트가 나면 `Modal.error()` 대화 상자가 열립니다(지연 로드라, 실제로 무언가 실패하기 전까지 `r-modal`은 아예 내려받지 않습니다). 안에는 플레이어를 다시 불러오는 **다시 시도** 버튼이 있습니다. 이것을 끄고 오류를 직접 다루려면 `disable-error-modal`을 지정하고 대신 `error`/`sourceerror` `change` 이벤트를 쓰세요. 치명적이지 않은 엔진 오류(hls.js가 내부에서 회복하는 것)는 이 대화 상자를 띄우지 않습니다.

### 이어 보기 `remember-position`

```html
<r-player src="https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8" remember-position></r-player>
```

`pause` 때와 탭이 가려질 때마다(`visibilitychange`. `beforeunload`보다 믿을 만합니다) `getCurrentTime()`을 `localStorage`(`src`별 키)에 저장하고, 같은 `src`를 다음에 불러올 때 되살리며, 영상이 `ended`에 이르면 지웁니다. 저장된 위치가 전체 길이의 2초 안쪽이면 조용히 건너뜁니다. 다 본 영상은 자기 끝에서 "이어" 보는 대신 처음부터 시작하는 것이 맞기 때문입니다. 기억하는 것은 위치뿐이며, 음량·속도·자막 취향은 각각 별도의 선택입니다.

### QoE 지표 {#qoe-metrics}

```js
const player = document.createElement('r-player');
player.addEventListener('change', () => {
  console.log(player.getMetrics());
  // { rebufferCount, rebufferDuration, firstFrameMs, qualitySwitchCount, errorCount }
});
stage.append(player);
```

`getMetrics()`는 아래에 적힌 것과 같은 `change` 이벤트 흐름에서 뽑아낸 평범한 객체의 스냅숏을 돌려줍니다. 따로 켜야 할 추적은 없습니다.

| 필드                 | 타입             | 설명                                                                                 |
| -------------------- | ---------------- | ------------------------------------------------------------------------------------ |
| `rebufferCount`      | `number`         | `waiting`→`playing` 전이의 횟수(멈췄다가 회복한 횟수).                               |
| `rebufferDuration`   | `number`         | 모든 재버퍼에서 멈춰 있던 총 시간(밀리초).                                           |
| `firstFrameMs`       | `number \| null` | 현재 `src`가 로드를 시작한 뒤 첫 재생 가능한 프레임까지의 밀리초. 그전까지는 `null`. |
| `qualitySwitchCount` | `number`         | 사용자가 화질 선택기에서 고른 화질의 횟수.                                           |
| `errorCount`         | `number`         | `error`/`sourceerror` 이벤트의 수.                                                   |

새 `src`/`format`이 로드될 때마다 스냅숏은 초기화됩니다. 언제나 **현재** 소스를 설명하며, 소스를 가로지르는 누계가 아닙니다.

## 메서드

플레이어는 요소 인스턴스에 명령형 컨트롤을 노출합니다.

| 메서드                                     | 설명                                                                                                      |
| ------------------------------------------ | --------------------------------------------------------------------------------------------------------- |
| `play(time?)`                              | 재생을 시작합니다. 필요하면 `time`(초)으로 이동합니다.                                                    |
| `pause()`                                  | 재생을 멈춥니다.                                                                                          |
| `getCurrentTime()`                         | 현재 재생 위치(초).                                                                                       |
| `setCurrentTime(seconds)`                  | 지정한 위치로 이동합니다.                                                                                 |
| `getTotalTime()`                           | 미디어 전체 길이(초).                                                                                     |
| `getVolume()` / `setVolume(v)`             | 음량을 읽거나 지정합니다. `0`–`100` 눈금으로 `volume` 어트리뷰트와 같은 척도입니다.                       |
| `getPlaybackRate()` / `setPlaybackRate(n)` | 속도 배수를 읽거나 지정합니다.                                                                            |
| `customRequestFullscreen()`                | 전체 화면으로 들어갑니다. `Promise`를 반환합니다.                                                         |
| `customExitFullscreen()`                   | 전체 화면에서 나옵니다. `Promise`를 반환합니다.                                                           |
| `togglePip()`                              | PIP로 들어가거나 나옵니다. 지원하지 않거나 소스가 없으면 아무 일도 하지 않습니다.                         |
| `setSubtitleLanguage(lang)`                | `srclang`으로 활성 자막 트랙을 지정하거나, `'off'`로 끕니다.                                              |
| `getMetrics()`                             | 현재 [QoE 지표](#qoe-metrics) 스냅숏을 읽습니다.                                                          |
| `showRemotePlaybackPicker()`               | 브라우저의 AirPlay·원격 재생 기기 선택기를 엽니다. 지원하지 않거나 소스가 없으면 아무 일도 하지 않습니다. |

## 이벤트

플레이어가 내보내는 것은 `change` CustomEvent 하나뿐입니다. 내부의 모든 상태 전이(네이티브 미디어 이벤트와 플레이어 자신의 UI 동작)가 그리로 모이므로, 한 번만 구독하고 `detail.type`으로 갈래를 나눕니다.

```html
<r-player id="player" src="https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8"></r-player>

<script>
  const player = document.getElementById('player');
  player.addEventListener('change', (e) => {
    const { type, data, currentTime, duration, tag } = e.detail;
    console.log(type, currentTime, duration);
    // `tag`는 <r-player> 인스턴스 그 자체입니다
  });
</script>
```

### `detail`에 실리는 것

| 프로퍼티      | 타입      | 설명                          |
| ------------- | --------- | ----------------------------- |
| `type`        | `string`  | 일어난 변화의 이름.           |
| `data`        | `unknown` | 그 변화에 딸린 값이나 이벤트. |
| `currentTime` | `number`  | 현재 재생 시각(초).           |
| `duration`    | `number`  | 미디어 전체 길이(초).         |
| `tag`         | `Element` | `<r-player>` 인스턴스.        |

### `detail.type` 값

밑에 깔린 `<video>`에서 전달되는 네이티브 미디어 상태:

| 종류             | 설명                                                                                           |
| ---------------- | ---------------------------------------------------------------------------------------------- |
| `canplay`        | 재생을 시작할 만큼 데이터가 모였습니다.                                                        |
| `canplaythrough` | 버퍼링 없이 끝까지 재생할 수 있습니다.                                                         |
| `complete`       | 렌더링이 끝났습니다.                                                                           |
| `durationchange` | `duration` 값이 바뀌었습니다.                                                                  |
| `emptied`        | 미디어가 비워졌거나 다시 로드되었습니다.                                                       |
| `ended`          | 재생이 끝에 이르렀습니다.                                                                      |
| `error`          | 미디어 오류가 났습니다(`disable-error-modal`이 없으면 내장 오류·다시 시도 대화 상자도 엽니다). |
| `loadstart`      | 브라우저가 미디어를 불러오기 시작했습니다.                                                     |
| `loadedmetadata` | 메타데이터가 로드되었습니다.                                                                   |
| `loadeddata`     | 첫 프레임이 로드되었습니다.                                                                    |
| `progress`       | 리소스를 불러오는 동안 주기적으로 발생합니다.                                                  |
| `ratechange`     | 재생 속도가 바뀌었습니다.                                                                      |
| `seeking`        | 이동이 시작되었습니다.                                                                         |
| `seeked`         | 이동이 끝났습니다.                                                                             |
| `stalled`        | 브라우저가 데이터를 가져오려 하지만 아무것도 오지 않습니다.                                    |
| `suspend`        | 미디어 로딩이 중단되었습니다.                                                                  |
| `timeupdate`     | `currentTime`이 바뀌었습니다.                                                                  |
| `volumechange`   | video 요소의 음량이 바뀌었습니다.                                                              |
| `waiting`        | 데이터를 기다리느라 재생이 멈췄습니다.                                                         |
| `play`           | 재생이 시작되었습니다.                                                                         |
| `playing`        | 버퍼링이나 일시정지 뒤 재생이 다시 시작되었습니다.                                             |
| `pause`          | 재생이 멈췄습니다.                                                                             |

플레이어 고유의 동작:

| 종류               | `data`                   | 설명                                                                                                                                                                                                    |
| ------------------ | ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `volume`           | `number`(`0`–`100`)      | 컨트롤 바나 음소거 전환으로 음량이 바뀌었습니다.                                                                                                                                                        |
| `speed`            | `number`                 | 속도 선택기로 재생 속도가 바뀌었습니다.                                                                                                                                                                 |
| `fullscreen`       | `boolean`                | 전체 화면에 들어갔거나(`true`) 나왔습니다(`false`).                                                                                                                                                     |
| `pictureinpicture` | `boolean`                | PIP에 들어갔거나(`true`) 나왔습니다(`false`). `togglePip()`으로 일어났든 브라우저 자체의 PIP 창 컨트롤로 일어났든 발생합니다.                                                                           |
| `subtitlechange`   | `string`                 | CC 선택기나 `setSubtitleLanguage()`로 자막 언어가 바뀌었습니다. 값은 `srclang` 또는 `'off'`.                                                                                                            |
| `resume`           | `number`                 | 로드할 때 저장된 위치가 조용히 되살아났습니다(`remember-position`). `data`는 되살아난 시각(초)입니다.                                                                                                   |
| `levelsready`      | `{ levels }`             | 스트리밍 엔진의 매니페스트가 파싱되어 화질 단계를 쓸 수 있습니다.                                                                                                                                       |
| `sourceerror`      | `{ fatal, detail }`      | 스트리밍 엔진 오류가 났습니다(날 `src`로 물러납니다. **치명적** 오류는 `disable-error-modal`이 없으면 오류·다시 시도 대화 상자도 엽니다. 치명적이지 않은 것은 엔진 자체의 내부 회복이라 열지 않습니다). |
| `qualityswitch`    | `{ level }`              | 사용자가 화질 선택기에서 화질을 골랐습니다.                                                                                                                                                             |
| `gestureseek`      | `{ direction, seconds }` | 두 번 두드려 이동하는 제스처가 발생했습니다(`direction`은 `'forward'`/`'backward'`).                                                                                                                    |

## 슬롯

이 플레이어는 슬롯 내용을 받지 않습니다. 생성자에서, 그리고 소스를 불러올 때마다 자기 라이트 DOM의 자식을 비웁니다(`this.innerHTML = ''`). 직접 만든 오버레이를 얹으려면 대신 `sheet` 어트리뷰트로 플레이어에 스타일을 주세요.

## 스타일

`<r-player>`는 자체 **CSS 사용자 정의 속성 136개**와 테마에서 읽어오는 시맨틱 토큰을 노출합니다. 상속이 닿는 곳이라면 어디든 지정할 수 있습니다 — `:root`, 감싸는 요소, 또는 요소 자신.

```css
r-player {
  --ran-player-tip-background: var(--ran-color-bg-subtle);
}
```

전체 목록은 [스타일 토큰](/ko/src/ranui/style-tokens#player)에 있고, 어떤 토큰을 골라야 하는지는 [디자인 시스템](/ko/src/ranui/design-system/)이 다룹니다.

## 모범 사례

- **크기**: 호스트는 `display: block`이고 고유한 크기가 없습니다. 반드시 너비와 높이를 명시하세요. 그러지 않으면 영상이 납작해집니다.
- **스트리밍 엔진**: `.m3u8`(HLS), `.mpd`(DASH), `.flv`/`.ts`(`mpegts.js`를 통한 FLV/MPEG-TS) 소스는 각각의 엔진을 알아서 지연 로드합니다. 설정할 것은 없습니다. URL의 확장자를 짚어 낼 수 없다면(확장자가 없거나 서명된 CDN URL) 판별에 기대지 말고 `format` 어트리뷰트를 명시하세요(예: `format="dash"`). WebRTC(`format="webrtc"`)는 언제나 명시입니다. WHEP 엔드포인트에는 짚어 낼 것이 없습니다.
- **리스너는 하나**: 여러 이벤트 핸들러를 붙이려 하기보다 `change` 리스너 하나에 `switch (detail.type)`를 두는 편이 낫습니다. 모든 상태가 `change`를 지나갑니다.
- **음량의 단위**: `volume`(어트리뷰트), `setVolume()`/`getVolume()`, 그리고 `volume` 변화에 실리는 값 모두 `0`–`100`의 단일 눈금을 씁니다. `0`–`1`인 것은 밑에 깔린 네이티브 `<video>.volume`뿐이고, 플레이어가 그 한 지점에서 변환합니다.
- **PIP는 점진적 향상입니다**: 브라우저가 지원하지 않으면 버튼은 비활성이 아니라 숨겨집니다. DOM에 늘 있다고 가정하지 마세요.
- **스타일 조정**: 섀도 DOM에 CSS를 주입하려면 `sheet` 어트리뷰트를 쓰세요. 플레이어 자체에는 공개된 `::part()` 손잡이가 없습니다.

## 로드맵

`<r-player>`는 활발히 개발 중입니다. 다음에 무엇이 예정되어 있는지는 저장소의 [`PLAYER_ROADMAP.md`](https://github.com/chaxus/ran/blob/main/packages/ranui/docs/PLAYER_ROADMAP.md)를 보세요.
