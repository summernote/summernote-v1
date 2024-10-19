import { describe, it, expect } from 'vitest';
import { groupBy, takeWhile } from '../../src/utils/array';

describe('groupBy', () => {
  it('should group the array by the given function', () => {
    expect(
      groupBy([1, 2, 2, 3, 3, 3, 2, 2], (prev, curr) => prev === curr),
    ).toEqual([[1], [2, 2], [3, 3, 3], [2, 2]]);

    expect(
      groupBy(
        [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
        (prev, curr) => prev + 1 === curr,
      ),
    ).toEqual([[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]]);
  });

  it('should return empty array if the input is empty', () => {
    const array = [];
    const result = groupBy(array, (prev, curr) => prev + 1 === curr);
    expect(result).toEqual([]);
  });

  it('should return single group if the input is not grouped', () => {
    const array = [1, 2, 3, 5, 6, 7];
    const result = groupBy(array, (prev, curr) => prev + 1 === curr);
    expect(result).toEqual([
      [1, 2, 3],
      [5, 6, 7],
    ]);
  });
});

describe('takeWhile', () => {
  it('should take elements while the predicate is true', () => {
    expect(takeWhile([1, 2, 3, 4, 5], (v) => v < 4)).toEqual([1, 2, 3]);
    expect(takeWhile([1, 2, 3, 4, 5], (v) => v < 1)).toEqual([]);
    expect(takeWhile([1, 2, 3, 4, 5], (v) => v < 5)).toEqual([1, 2, 3, 4]);
  });

  it('should return empty array if the input is empty', () => {
    const array = [];
    const result = takeWhile(array, () => true);
    expect(result).toEqual([]);
  });

  it('should return all elements if the predicate is always true', () => {
    const array = [1, 2, 3, 4, 5];
    const result = takeWhile(array, () => true);
    expect(result).toEqual([1, 2, 3, 4, 5]);
  });
});
