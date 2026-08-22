import { describe, expect, it } from 'vitest';
import { replyStart, survivingBranches } from '@/client/history';
import type { Branch, StoredMessage } from '@/client/chat-types';

/** A conversation where the model answered one question by calling a tool. */
const withTools: StoredMessage[] = [
  { role: 'user', content: 'q1' },
  { role: 'assistant', content: 'a1' },
  { role: 'user', content: 'q2' },
  {
    role: 'assistant',
    content: '',
    tool_calls: [{ id: 'c', type: 'function', function: { name: 'f', arguments: '{}' } }],
  },
  { role: 'tool', content: 'r', tool_call_id: 'c', name: 'f' },
  { role: 'assistant', content: 'a2' },
];

describe('replyStart', () => {
  it('starts a reply just after the question it answers', () => {
    expect(replyStart(withTools, 1)).toBe(1);
  });

  it('reaches back past the tool calls the reply was made of', () => {
    // Cutting at the answer alone leaves a history ending in tool results with nothing left
    // to answer, which no provider accepts.
    expect(replyStart(withTools, 5)).toBe(3);
    expect(replyStart(withTools, 4)).toBe(3);
    expect(replyStart(withTools, 3)).toBe(3);
  });

  it('returns 0 when nothing above the reply was asked by a user', () => {
    // A conversation that opens with a compaction summary has exactly this shape.
    const compacted: StoredMessage[] = [
      { role: 'system', content: 'summary' },
      { role: 'assistant', content: 'a' },
    ];
    expect(replyStart(compacted, 1)).toBe(0);
  });

  it('does not run off the end of a history shorter than the index', () => {
    expect(replyStart(withTools, 99)).toBe(3);
    expect(replyStart([], 3)).toBe(0);
  });

  it('treats a user message as the start of its own reply', () => {
    // Regenerating from a user row means "answer this again", so the cut falls after it.
    expect(replyStart(withTools, 2)).toBe(3);
  });
});

describe('survivingBranches', () => {
  const branches: Branch[] = [
    { at: 1, tails: [[], []], active: 0 },
    { at: 4, tails: [[], []], active: 1 },
  ];

  it('keeps alternatives recorded above the cut', () => {
    expect(survivingBranches(branches, 4).map((branch) => branch.at)).toEqual([1]);
  });

  it('drops an alternative recorded exactly at the cut', () => {
    // Its tails describe a conversation being replaced right now; offering them would be
    // offering a choice between two dead tails.
    expect(survivingBranches(branches, 1)).toEqual([]);
  });

  it('keeps everything when the cut is past them all', () => {
    expect(survivingBranches(branches, 99)).toHaveLength(2);
  });
});
