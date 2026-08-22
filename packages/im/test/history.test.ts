import { describe, expect, it } from 'vitest';
import {
  activeCompaction,
  replyStart,
  requestMessages,
  survivingBranches,
  survivingCompactions,
} from '@/client/history';
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
    // A conversation whose visible head is an answer — the first page after a fold — has
    // exactly this shape.
    const opening: StoredMessage[] = [{ role: 'assistant', content: 'a' }];
    expect(replyStart(opening, 0)).toBe(0);
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

describe('the log and the request are different things', () => {
  const log: StoredMessage[] = [
    { role: 'user', content: 'q1' },
    { role: 'assistant', content: 'a1' },
    { role: 'user', content: 'q2' },
    { role: 'assistant', content: 'a2' },
  ];

  it('sends the whole log when nothing has been folded', () => {
    expect(requestMessages(log, [])).toEqual(log);
  });

  it('replaces a folded prefix with a summary and leaves the log alone', () => {
    // The point of the whole design: compaction shortens the request, never the history.
    const sent = requestMessages(log, [{ at: 2, summary: 'they discussed q1' }]);
    expect(sent).toEqual([
      { role: 'system', content: 'they discussed q1' },
      { role: 'user', content: 'q2' },
      { role: 'assistant', content: 'a2' },
    ]);
    expect(log).toHaveLength(4);
  });

  it('is governed by the newest boundary, since a later fold subsumes an earlier one', () => {
    const sent = requestMessages(log, [
      { at: 1, summary: 'first fold' },
      { at: 3, summary: 'second fold' },
    ]);
    expect(sent).toEqual([
      { role: 'system', content: 'second fold' },
      { role: 'assistant', content: 'a2' },
    ]);
  });

  it('reports the boundary in force, and none when there is none', () => {
    expect(activeCompaction([])).toBeNull();
    expect(
      activeCompaction([
        { at: 1, summary: 'a' },
        { at: 3, summary: 'b' },
      ]),
    ).toEqual({ at: 3, summary: 'b' });
  });

  it('drops a boundary that a cut left pointing past the end of the log', () => {
    // A boundary at 3 in a log cut to 2 messages would fold the whole conversation away.
    const kept = survivingCompactions(
      [
        { at: 1, summary: 'a' },
        { at: 3, summary: 'b' },
      ],
      2,
    );
    expect(kept).toEqual([{ at: 1, summary: 'a' }]);
  });

  it('keeps a boundary exactly at the cut, which still points at a real message', () => {
    expect(survivingCompactions([{ at: 2, summary: 'a' }], 2)).toHaveLength(1);
  });
});
