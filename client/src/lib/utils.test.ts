import { cn } from './utils';

describe('cn', () => {
  it('merges class names', () => {
    expect(cn('foo', 'bar')).toBe('foo bar');
  });

  it('handles falsy values', () => {
    expect(cn('foo', false && 'bar', undefined, 'baz')).toBe('foo baz');
  });

  it('merges duplicate classes', () => {
    expect(cn('foo', 'foo', 'bar')).toBe('foo bar');
  });
}); 