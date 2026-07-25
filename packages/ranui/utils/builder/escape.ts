// HTML 转义。实现住在 ranuts —— 它先用一个正则探测有没有特殊字符，没有就原样返回，
// 省掉了「无论如何都跑五次 replace」的分配开销；ranui 这边只保留导出名。
//
// 一处可见差异：单引号现在转义成 `&#39;` 而不是 `&#039;`。两者是同一个字符的
// 等价实体，渲染结果相同，但 SSR 序列化出来的 HTML 字节会变，比对快照时会看到。
import { escapeHtml } from 'ranuts/utils';

export { escapeHtml };

/**
 * 属性值转义。当前与 `escapeHtml` 完全一致：单双引号都会被转义，所以带引号、
 * 不带引号的属性值都安全。保留独立的名字是为了在调用点标出意图。
 */
export function escapeHtmlAttribute(unsafe: string): string {
  return escapeHtml(unsafe);
}
