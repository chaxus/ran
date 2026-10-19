---
description: 'ranui 의 Preview(<r-preview>) 는 docx, pptx, pdf, xlsx 파일을 브라우저 안에서 온라인으로 미리 봅니다.'
---

# Preview

`docx`, `pptx`, `pdf`, `xlsx` 파일을 위한 온라인 미리보기 컴포넌트입니다.

> **이럴 때 쓰세요.** `docx`, `pptx`, `pdf`, `xlsx` 파일을 브라우저에서 미리 봐야 할 때. `<r-preview>`는 파일 URL 로 문서 미리보기 모달을 엽니다 (지금은 독립 패키지 `@ranui/preview`로 배포됩니다).

> ⚠️ **중요 공지**: 0.1.10-alpha-27 버전 이후로 ranui 패키지는 이 컴포넌트를 제공하지 않습니다. 독립 패키지 [@ranui/preview](https://www.npmjs.com/package/@ranui/preview)로 옮겨 주세요.

## 빠른 시작

### 설치

```bash
# 독립 미리보기 패키지 사용(권장)
npm install @ranui/preview

# 또는 ranui 전체 패키지(0.1.10-alpha-27 이전)
npm install ranui
```

### 기본 사용법

<div>
    <r-preview id="preview-demo"></r-preview>
    <r-button type="primary" data-preview-upload="preview-demo">미리 볼 파일 선택</r-button>
</div>

```html
<r-preview id="preview-demo"></r-preview>
<r-button type="primary" onclick="uploadFile()">미리 볼 파일 선택</r-button>

<script>
  let selectedUrl;
  const uploadFile = () => {
    const preview = document.getElementById('preview-demo');
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', '.docx,.pptx,.pdf,.xlsx,.xls');
    input.click();

    input.onchange = (e) => {
      const { files = [] } = input;
      if (files.length > 0) {
        const file = files[0];
        if (selectedUrl) URL.revokeObjectURL(selectedUrl);
        selectedUrl = URL.createObjectURL(file);
        preview.setAttribute('src', selectedUrl);
      }
    };
  };
  window.addEventListener('pagehide', (event) => {
    if (!event.persisted && selectedUrl) URL.revokeObjectURL(selectedUrl);
  });
</script>
```

## API 레퍼런스

### 프로퍼티

| 속성 / 프로퍼티        | 타입      | 기본값                    | 설명                                         |
| ---------------------- | --------- | ------------------------- | -------------------------------------------- |
| `src`                  | `string`  | —                         | 파일 URL을 설정하면 대화 상자가 열림         |
| `closeable`            | `string`  | —                         | 문자열 false로 닫기 버튼과 Escape를 비활성화 |
| `baseUrl` / `baseurl`  | `string`  | `https://edit.chaxus.com` | Office 편집기 페이지 URL                     |
| `readonly`             | `boolean` | `false`                   | Office 읽기 전용 모드 활성화                 |
| `pdf-mode` / `pdfMode` | `string`  | `eager`                   | PDF 모드: eager 또는 virtual                 |
| `label`                | `string`  | `Preview file`            | 트리거의 접근성 이름                         |

### 파일 위치 `src`

파일 URL 을 지정하면 미리보기 모달이 열립니다. 값이 비어 있으면 열리지 않습니다.

```html
<r-preview src="https://example.com/document.docx"></r-preview>
```

### 닫기 가능 여부 `closeable`

미리보기 모달을 닫을 수 있는지 제어합니다.

```html
<!-- 기본값: 닫을 수 있음 -->
<r-preview closeable="true"></r-preview>

<!-- 닫을 수 없음 -->
<r-preview closeable="false"></r-preview>
```

### 서비스 지정 `baseUrl`

문서 미리보기 서비스를 직접 준비했다면 `baseUrl` 프로퍼티로 그 주소를 지정할 수 있습니다.

```html
<r-preview baseUrl="https://edit.chaxus.com"></r-preview>
```

> 💡 **팁**: 기본값은 호스팅된 미리보기 서비스 `https://edit.chaxus.com` 입니다. 직접 호스팅하려면 [OnlyOffice Web Local](https://github.com/ranuts/document)을 참고하세요.

## 0.3.0 호환성

0.3.0은 자동 등록과 기본 편집 가능한 Office 동작을 유지합니다. PDF의 기본 `eager` 모드는 모든 페이지를 그린 뒤 `load`를 발생시킵니다. `pdf-mode="virtual"`(JavaScript: `pdfMode = 'virtual'`)은 보이는 영역을 렌더링하며, 첫 화면과 버퍼가 준비되면 `load`를 발생시킵니다. worker는 닫기, 소스 교체 또는 요소 제거까지 유지됩니다. `readonly`나 `closeable` 변경은 현재 Office 편집기와 저장하지 않은 편집을 보존합니다.

```html
<r-preview pdf-mode="virtual" src="/reports/long.pdf"></r-preview>
<r-preview readonly src="/reports/annual.docx"></r-preview>
```

PDF는 로컬에서 렌더링됩니다. Office 파일은 설정된 편집기 iframe으로 전달되어 해당 페이지가 내용에 접근할 수 있습니다. 비공개 또는 내부망 문서에는 자체 `baseUrl` 배포를 사용하세요.

## 마이그레이션 안내

지금 ranui 패키지의 `r-preview` 컴포넌트를 쓰고 있다면 다음 순서로 옮기기를 권합니다.

1. **새 패키지 설치**:

   ```bash
   npm install @ranui/preview
   ```

2. **import 수정**:

   ```javascript
   // 이전
   import 'ranui';

   // 이후
   import '@ranui/preview';
   ```

3. **HTML 사용법은 그대로입니다**:
   ```html
   <r-preview src="your-file-url"></r-preview>
   ```
