# createHandoff

在同源的两个页面之间交接一个值 —— `File`、`Blob`，以及任何可结构化克隆的数据。

用户在 A 页面选中的 `File` 没法直接带到 B 页面：它塞不进 URL，也不可序列化，而
`sessionStorage` 只能存字符串。IndexedDB 能原样存放可结构化克隆的值，于是 A 页面把值放进去
再跳转，B 页面取出来。

## API

### createHandoff(options)

| 参数        | 说明                       | 类型     | 默认值      |
| ----------- | -------------------------- | -------- | ----------- |
| `dbName`    | 数据库名，交接双方必须一致 | `string` | 必填        |
| `storeName` | 对象仓库名，首次打开时创建 | `string` | `'files'`   |
| `key`       | 待取值使用的键             | `string` | `'pending'` |

#### 返回值

| 方法         | 说明                                             |
| ------------ | ------------------------------------------------ |
| `put(value)` | 存入一个值供下个页面取用；存不进去时返回 `false` |
| `take()`     | 取出待取值并删除；没有待取值时返回 `null`        |

## 示例

### 落地页把文件交给应用

```js
import { createHandoff } from 'ranuts';

const handoff = createHandoff({ dbName: 'document-handoff' });

input.addEventListener('change', async () => {
  await handoff.put(input.files[0]);
  location.href = '/app?open=local';
});
```

### 应用取出文件

```js
import { createHandoff, queryFlag } from 'ranuts';

const handoff = createHandoff({ dbName: 'document-handoff' });

if (queryFlag('open')) {
  const file = await handoff.take();
  if (file) openDocument(file); // 刷新后为 null —— 值已被消费
}
```

## 注意事项

1. **取出即销毁**。`take()` 在读取的同一个事务里删除该值。这正是刷新页面不会重复打开同一个
   文件、过期的 `?open=local` 链接什么也取不到的原因。

2. **两个标签页不会同时取到**。读和删共用一个事务，标签页之间的竞争最终只有一方拿到值。

3. **`put` 在事务提交时才 resolve**，而不是在写请求成功时 —— 只有事务提交后数据才落盘，而
   页面通常紧接着就跳走了。

4. **失败是静默的**。IndexedDB 不可用或被禁（SSR、隐私模式、三方 iframe）时，`put` 返回
   `false`，`take` 返回 `null`。仅仅是「尝试」交接一个值，不应该因为存储不可用而让页面崩掉。

5. **仓库在版本 1 由先打开数据库的一方创建**，另一方打开时会发现它已经存在。

6. **一次只放一个值**。这是交接而非队列 —— 第二次 `put` 会覆盖上一个待取值。需要真正的存储请用
   [`WebDB`](/cn/src/ranuts/utils/web_db)。
