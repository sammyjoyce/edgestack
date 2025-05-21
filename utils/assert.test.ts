import { assert } from './assert';
import { describe, test, expect } from 'bun:test';

describe('assert utility', () => {
  test('does not throw when condition is true', () => {
    expect(() => assert(true)).not.toThrow();
  });

  test('throws with provided message when condition is false', () => {
    expect(() => assert(false, 'fail')).toThrow('fail');
  });
});
