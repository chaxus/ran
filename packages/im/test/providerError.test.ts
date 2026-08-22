import { describe, expect, it } from 'vitest';
import { extractMessage } from '@/app/controllers/im';

describe('extractMessage', () => {
  it('pulls the sentence out of an OpenAI-compatible rejection', () => {
    // What DeepSeek answered when a text-only model was handed an image. Showing the
    // envelope asks the reader to parse JSON to find the one line that tells them what to do.
    const body = '{"error":{"message":"This model does not support image","type":"invalid_request_error"}}';
    expect(extractMessage(body)).toBe('This model does not support image');
  });

  it('passes a body it does not recognise through rather than dropping it', () => {
    // An unrecognised error is still better than none.
    expect(extractMessage('502 Bad Gateway')).toBe('502 Bad Gateway');
    expect(extractMessage('{"detail":"nope"}')).toBe('{"detail":"nope"}');
  });

  it('falls through when the message is empty or the wrong type', () => {
    expect(extractMessage('{"error":{"message":""}}')).toBe('{"error":{"message":""}}');
    expect(extractMessage('{"error":{"message":42}}')).toBe('{"error":{"message":42}}');
  });

  it('bounds an unbounded body', () => {
    // A provider that answers with an HTML error page should not become the whole message.
    expect(extractMessage('x'.repeat(2000))).toHaveLength(500);
  });

  it('reports nothing for an empty body, so the caller can fall back to the status text', () => {
    expect(extractMessage('')).toBe('');
  });
});
