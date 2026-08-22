import { describe, expect, it } from 'vitest';
import { titleFrom } from '@/client/sessions';

describe('titleFrom', () => {
  it('names a conversation after the first thing said in it', () => {
    // A list of timestamps is a list nobody can search.
    expect(titleFrom('帮我把这段代码改成 TypeScript')).toBe('帮我把这段代码改成 TypeScript');
  });

  it('takes the first line, not the whole message', () => {
    expect(titleFrom('总结这份文档\n\n第一点……\n第二点……')).toBe('总结这份文档');
  });

  it('truncates rather than letting one entry own the sidebar', () => {
    const title = titleFrom('这是一个非常非常长的问题'.repeat(5));
    expect(title).toHaveLength(25);
    expect(title.endsWith('…')).toBe(true);
  });

  it('reads the text out of a message that also carries images', () => {
    expect(
      titleFrom([
        { type: 'image_url', image_url: { url: 'data:,' } },
        { type: 'text', text: '这张图是什么颜色？' },
      ]),
    ).toBe('这张图是什么颜色？');
  });

  it('falls back when there is no text to take a name from', () => {
    // An image with no question still needs a row in the list.
    expect(titleFrom([{ type: 'image_url', image_url: { url: 'data:,' } }])).toBe('未命名对话');
    expect(titleFrom('   ')).toBe('未命名对话');
    expect(titleFrom('')).toBe('未命名对话');
  });
});
