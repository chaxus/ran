import { describe, it, expect } from 'vitest';
import { escapeHtml, escapeHtmlAttribute } from '@/utils/builder/escape';

describe('escapeHtml', () => {
  it('escapes ampersand', () => {
    expect(escapeHtml('a&b')).toBe('a&amp;b');
  });

  it('escapes less-than', () => {
    expect(escapeHtml('<tag>')).toBe('&lt;tag&gt;');
  });

  it('escapes greater-than', () => {
    expect(escapeHtml('a>b')).toBe('a&gt;b');
  });

  it('escapes double quote', () => {
    expect(escapeHtml('"hello"')).toBe('&quot;hello&quot;');
  });

  it("escapes single quote", () => {
    expect(escapeHtml("it's")).toBe('it&#039;s');
  });

  it('escapes all special characters together', () => {
    expect(escapeHtml('<a href="test\'s & others">')).toBe(
      '&lt;a href=&quot;test&#039;s &amp; others&quot;&gt;',
    );
  });

  it('escapes XSS-style payload', () => {
    expect(escapeHtml('<script>alert("xss&\'1\'");</script>')).toBe(
      '&lt;script&gt;alert(&quot;xss&amp;&#039;1&#039;&quot;);&lt;/script&gt;',
    );
  });

  it('returns empty string unchanged', () => {
    expect(escapeHtml('')).toBe('');
  });

  it('returns plain text unchanged', () => {
    expect(escapeHtml('hello world')).toBe('hello world');
  });

  it('does not double-escape already-escaped content', () => {
    expect(escapeHtml('&amp;')).toBe('&amp;amp;');
  });

  it('converts number to string', () => {
    expect(escapeHtml(42 as any)).toBe('42');
  });

  it('converts boolean to string', () => {
    expect(escapeHtml(true as any)).toBe('true');
  });

  it('converts null to string', () => {
    expect(escapeHtml(null as any)).toBe('null');
  });

  it('converts undefined to string', () => {
    expect(escapeHtml(undefined as any)).toBe('undefined');
  });

  it('handles string with only special chars', () => {
    expect(escapeHtml('<>&"\'')).toBe('&lt;&gt;&amp;&quot;&#039;');
  });
});

describe('escapeHtmlAttribute', () => {
  it('produces the same result as escapeHtml', () => {
    const inputs = ['<"test">', "it's fine", 'a&b', 'plain'];
    inputs.forEach((input) => {
      expect(escapeHtmlAttribute(input)).toBe(escapeHtml(input));
    });
  });

  it('handles empty string', () => {
    expect(escapeHtmlAttribute('')).toBe('');
  });
});
