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

<div style="width: 100px; margin-top:10px">
    <r-preview id="preview-demo"></r-preview>
    <r-button type="primary" onclick="uploadFile('preview-demo')">미리 볼 파일 선택</r-button>
</div>

```html
<r-preview id="preview-demo"></r-preview>
<r-button type="primary" onclick="uploadFile()">미리 볼 파일 선택</r-button>

<script>
  const uploadFile = () => {
    const preview = document.getElementById('preview-demo');
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', '.docx,.pptx,.pdf,.xlsx');
    input.click();

    input.onchange = (e) => {
      const { files = [] } = input;
      if (files.length > 0) {
        const file = files[0];
        const url = URL.createObjectURL(file);
        preview.setAttribute('src', url);
      }
    };
  };
</script>
```

## API 레퍼런스

### 프로퍼티

| 프로퍼티    | 타입      | 기본값                      | 설명                                                    |
| ----------- | --------- | --------------------------- | ------------------------------------------------------- |
| `src`       | `string`  | `''`                        | 파일 URL. 값을 넣으면 미리보기 모달이 자동으로 열립니다 |
| `closeable` | `boolean` | `true`                      | 닫기 버튼을 보일지 여부                                 |
| `baseUrl`   | `string`  | `'https://edit.chaxus.com'` | 문서 미리보기 서비스 URL                                |

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
