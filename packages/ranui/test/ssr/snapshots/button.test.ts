import { describe, it, expect } from 'vitest';
import { Button } from '@/components/button/index';

describe('r-button DSD snapshot', () => {
  it('matches snapshot', () => {
    const el = new Button();
    expect((el as any).serialize('r-button')).toMatchSnapshot();
  });
});
