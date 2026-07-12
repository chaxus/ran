import { describe, expect, it } from 'vitest';
import { RouterCore, matchPath } from '@/utils/router';

describe('matchPath', () => {
  it('matches exact paths and extracts :params', () => {
    expect(matchPath('/users/:id', true, '/users/42')).toEqual({ matched: true, params: { id: '42' } });
    expect(matchPath('/users/:id', true, '/users/42/x')).toEqual({ matched: false, params: {} });
  });

  it('non-exact matches a prefix', () => {
    expect(matchPath('/users/:id', false, '/users/42/posts')).toEqual({ matched: true, params: { id: '42' } });
  });

  it('supports wildcard segments and decodes param values', () => {
    expect(matchPath('/files/*', true, '/files/a/b').matched).toBe(true);
    expect(matchPath('/q/:term', true, '/q/hello%20world').params.term).toBe('hello world');
  });
});

describe('RouterCore — params + nested routes', () => {
  it('extracts params via matchParams (fixes empty currentRoute.params)', () => {
    const router = new RouterCore({ routes: [{ path: '/users/:id', exact: true }] });
    expect(router.matchParams('/users/42')).toEqual({ id: '42' });
    expect(router.matchParams('/nope')).toEqual({});
  });

  it('flattens nested children into absolute paths', () => {
    const router = new RouterCore({
      routes: [
        {
          path: '/settings',
          exact: true,
          children: [
            { path: 'profile', exact: true },
            { path: ':tab', exact: true },
          ],
        },
      ],
    });
    expect(router.getStaticPaths()).toEqual(['/settings', '/settings/profile', '/settings/:tab']);
    expect(router.matchRoute('/settings/profile')?.path).toBe('/settings/profile');
    expect(router.matchParams('/settings/security')).toEqual({ tab: 'security' });
  });
});
