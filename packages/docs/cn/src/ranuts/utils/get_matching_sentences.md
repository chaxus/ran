# getMatchingSentences

从文本中提取包含搜索关键词的完整句子，对于重复的句子只保留最长的一个。

## API

### getMatchingSentences

#### Return

| 参数    | 说明                           | 类型       |
| ------- | ------------------------------ | ---------- |
| `Array` | 包含关键词的句子数组（已去重） | `string[]` |

#### Parameters

| 参数          | 说明       | 类型     | 默认值 |
| ------------- | ---------- | -------- | ------ |
| `text`        | 原文本     | `string` | 无     |
| `searchValue` | 搜索关键词 | `string` | 无     |

## Example

### 基础用法

```js
import { getMatchingSentences } from 'ranuts';

const text = '这是第一句话。这是包含关键词的第二句话。这是第三句话。';
const sentences = getMatchingSentences(text, '关键词');
console.log(sentences); // ['这是包含关键词的第二句话。']
```

### 多句匹配

```js
import { getMatchingSentences } from 'ranuts';

const text = '第一句包含关键词。第二句也包含关键词。第三句没有。';
const sentences = getMatchingSentences(text, '关键词');
console.log(sentences); // ['第一句包含关键词。', '第二句也包含关键词。']
```

### 处理重叠句子

```js
import { getMatchingSentences } from 'ranuts';

const text = '短句关键词。这是一个包含关键词的长句子。';
const sentences = getMatchingSentences(text, '关键词');
// 只保留最长的句子
console.log(sentences); // ['这是一个包含关键词的长句子。']
```

### 空值处理

```js
import { getMatchingSentences } from 'ranuts';

console.log(getMatchingSentences('', '关键词')); // []
console.log(getMatchingSentences('文本', '')); // []
```

## 注意事项

1. **句子识别**：通过句号（。）、点号（.）、换行符（\n）、感叹号（！）、问号（?、？）识别句子边界。
2. **去重处理**：对于重叠的句子，只保留最长的一个。
3. **大小写不敏感**：搜索时忽略大小写。
4. **用途**：常用于搜索高亮、文本摘要、搜索结果展示等场景。
