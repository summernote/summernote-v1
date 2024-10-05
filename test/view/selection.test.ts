import { describe, expect, it } from 'vitest';
import { offsetOf } from '../../src/view/selection';

describe('offsetOf', () => {
  it('should convert to the given position', () => {
    const d = document.createElement('div');
    d.innerHTML = 'Hello World!';
    expect(offsetOf([d.firstChild!, 1], d)).toEqual(1);
  });

  it('should convert to the given position in element', () => {
    const d = document.createElement('div');
    d.innerHTML = '<b>Hello</b> <i>World</i>!';
    expect(offsetOf([d.querySelector('b')!.firstChild!, 0], d)).toEqual(1);
    expect(offsetOf([d.querySelector('i')!.firstChild!, 0], d)).toEqual(9);
    expect(offsetOf([d.querySelector('i')!.firstChild!, 1], d)).toEqual(10);
    expect(offsetOf([d.querySelector('i')!.nextSibling!, 0], d)).toEqual(15);
  });

  it('should return error if the range is not in the container', () => {
    const d = document.createElement('div');
    d.innerHTML = 'Hello World!';
    expect(() =>
      offsetOf([d.firstChild!, 4], document.createElement('div')),
    ).toThrowError('node is not in the container');
  });
});
