import { describe, expect, it } from 'vitest';
import { allowedUrl, readableText } from '@/app/controllers/im';

describe('the URL a model may ask the server to fetch', () => {
  it('accepts an ordinary public page', () => {
    expect(allowedUrl('https://example.com/a?b=1')).toEqual({ url: new URL('https://example.com/a?b=1') });
  });

  it('refuses a scheme that is not a web request', () => {
    // `file:` would read the server's disk; the model chooses this string.
    for (const raw of ['file:///etc/passwd', 'ftp://host/x', 'data:text/html,<b>']) {
      expect(allowedUrl(raw)).toMatchObject({ error: expect.any(String) });
    }
  });

  it('refuses an address inside the network the server sits in', () => {
    // The server reaches these with the server's own access; a fetch tool that could reach
    // them is a request forwarder pointed at the inside of the network.
    for (const host of [
      'http://localhost:8080/',
      'http://app.localhost/',
      'http://127.0.0.1/',
      'http://10.1.2.3/',
      'http://192.168.0.1/',
      'http://172.16.0.1/',
      'http://172.31.255.255/',
      // Cloud instance metadata, which is where credentials live.
      'http://169.254.169.254/latest/meta-data/',
      'http://[::1]/',
      'http://[fd00::1]/',
    ]) {
      expect(allowedUrl(host)).toMatchObject({ error: '不允许访问内网地址' });
    }
  });

  it('does not mistake a public address for a private one', () => {
    // `172.32.` is outside the private range that ends at `172.31.`, and a prefix test that
    // matched it would refuse real sites.
    for (const raw of ['http://172.32.0.1/', 'http://11.0.0.1/', 'http://193.168.0.1/']) {
      expect(allowedUrl(raw)).toHaveProperty('url');
    }
  });

  it('refuses something that is not an address at all', () => {
    expect(allowedUrl('')).toMatchObject({ error: '不是合法的地址' });
    expect(allowedUrl('example.com')).toMatchObject({ error: '不是合法的地址' });
  });
});

describe('turning a fetched document into something a model can read', () => {
  it('drops script and style content, which is most of the bytes and none of the meaning', () => {
    const html = '<html><head><style>b{color:red}</style><script>alert(1)</script></head><body><p>Hi</p></body></html>';
    expect(readableText(html)).toBe('Hi');
  });

  it('decodes the entities a document actually carries', () => {
    expect(readableText('<p>a&nbsp;b &lt;tag&gt; &quot;q&quot; &#39;s&#39;</p>')).toBe('a b <tag> "q" \'s\'');
  });

  it('decodes an escaped ampersand without letting it become a tag', () => {
    // `&amp;lt;` is the text `&lt;`. Decoding the ampersand first would produce `<`, and the
    // tag stripper has already run, so it would reach the model as markup.
    expect(readableText('<p>&amp;lt;script&amp;gt;</p>')).toBe('&lt;script&gt;');
  });

  it('collapses the whitespace that markup leaves behind', () => {
    expect(readableText('<div>  a  </div>\n\n\n\n<div>b</div>')).toBe('a \n\n b');
  });
});
