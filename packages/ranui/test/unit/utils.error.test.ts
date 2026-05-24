import { describe, expect, it } from 'vitest';
import { createCustomError } from '@/utils/error';

describe('utils/error', () => {
  it('creates error classes with a default message', () => {
    const CustomError = createCustomError('default message');

    expect(new CustomError().message).toBe('default message');
    expect(new CustomError('override').message).toBe('override');
  });
});
