import { describe, expect, it } from 'vitest';
import { TOOLS, parseToolArgs, runTool, toolsForRequest } from '@/client/tools/index';

describe('the tool registry', () => {
  it('describes every tool in the envelope a provider expects', () => {
    const wire = toolsForRequest() as { type: string; function: { name: string; parameters: unknown } }[];
    expect(wire).toHaveLength(TOOLS.size);
    for (const entry of wire) {
      expect(entry.type).toBe('function');
      expect(TOOLS.has(entry.function.name)).toBe(true);
      expect(entry.function.parameters).toMatchObject({ type: 'object' });
    }
  });

  it('builds a call view from arguments alone, so a replay renders what the user saw', () => {
    // The rule the view contract rests on: no clock, no filesystem, no session state. A view
    // that read any of them would draw a different card the second time.
    const time = TOOLS.get('get_current_time');
    expect(time?.call({ timezone: 'Asia/Shanghai' })).toEqual(time?.call({ timezone: 'Asia/Shanghai' }));
  });

  it('renders a call the model wrote badly rather than throwing', () => {
    // The model writes these. A number where a string was declared is an ordinary event.
    for (const tool of TOOLS.values()) {
      expect(() => tool.call({})).not.toThrow();
      expect(() => tool.call({ url: 42, name: null, timezone: [] })).not.toThrow();
    }
  });

  it('reads arguments the model may not have finished writing', () => {
    expect(parseToolArgs('{"a":1}')).toEqual({ a: 1 });
    expect(parseToolArgs('')).toEqual({});
    // A truncated response leaves half a JSON document, which is not a value.
    expect(parseToolArgs('{"a":')).toEqual({});
    // An array is valid JSON and not an argument object.
    expect(parseToolArgs('[1,2]')).toEqual({});
  });

  it('reports an unknown tool back to the model instead of failing the turn', () => {
    // The model is mid-turn; its next move depends on reading what went wrong.
    return runTool('no_such_tool', {}).then((outcome) => {
      expect(outcome.failed).toBe(true);
      expect(outcome.output).toContain('no_such_tool');
    });
  });

  it('names an invalid timezone back rather than reporting the tool broken', async () => {
    const outcome = await runTool('get_current_time', { timezone: 'Middle/Earth' });
    expect(outcome.failed).toBe(false);
    expect(outcome.output).toContain('Middle/Earth');
  });

  it('answers with a formatted time when the timezone is real', async () => {
    const outcome = await runTool('get_current_time', { timezone: 'Asia/Shanghai' });
    expect(outcome.output).toMatch(/\d{4}/);
  });

  it('diffs a rewritten note against what it replaced', async () => {
    const write = TOOLS.get('write_note');
    expect(write).toBeDefined();
    if (write === undefined) return;

    const first = await runTool('write_note', { name: 'plan.md', content: 'one' });
    // A create has nothing to diff against, and the card says so with a null old side.
    expect(write.result({ name: 'plan.md', content: 'one' }, first.output)).toEqual({
      card: 'diff',
      diffs: [{ path: 'plan.md', oldText: null, newText: 'one' }],
    });

    const second = await runTool('write_note', { name: 'plan.md', content: 'two' });
    expect(write.result({ name: 'plan.md', content: 'two' }, second.output)).toEqual({
      card: 'diff',
      diffs: [{ path: 'plan.md', oldText: 'one', newText: 'two' }],
    });
  });

  it('shows a pending write with no old side even when it is a rewrite', async () => {
    // The call view may not read the note map: a replayed conversation has an empty one and
    // would draw a diff the user never saw.
    const write = TOOLS.get('write_note');
    await runTool('write_note', { name: 'notes.md', content: 'before' });
    expect(write?.call({ name: 'notes.md', content: 'after' })).toEqual({
      card: 'diff',
      title: '写入 notes.md',
      summary: 'after',
      diffs: [{ path: 'notes.md', oldText: null, newText: 'after' }],
    });
  });

  it('names a summary that says something the title does not', () => {
    // The element derives one when a tool does not name it, but only the tool knows which
    // argument matters: derived, `write_note` would read `写入 notes.md · notes.md` — the
    // path twice and the content not at all.
    const write = TOOLS.get('write_note');
    expect(write?.call({ name: 'notes.md', content: '第一行\n第二行' })).toMatchObject({ summary: '第一行' });

    const fetch = TOOLS.get('fetch_url');
    expect(fetch?.call({ url: 'https://a.test' })).toMatchObject({ summary: 'https://a.test' });
  });
});
