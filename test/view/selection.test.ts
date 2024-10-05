import { describe, expect, it } from 'vitest';
import { toRange } from '../../src/view/selection';

describe('toRange', () => {
  it('should convert to the range', () => {
    const container = document.createElement('div');
    container.innerHTML = 'Hello, World!';

    const range = document.createRange();
    range.setStart(container.firstChild!, 1);
    range.setEnd(container.firstChild!, 4);

    const result = toRange(range, container);
    expect(result).toEqual({ s: 1, e: 4 });
  });

  it('should convert to the range in the nested element', () => {
    const container = document.createElement('div');
    container.innerHTML = 'Hello, <b>World</b>!';

    const range = document.createRange();
    range.setStart(container.firstChild!, 1);
    range.setEnd(container.querySelector('b')!.firstChild!, 2);

    const result = toRange(range, container);
    expect(result).toEqual({ s: 1, e: 9 });
  });
});
