/**
 * `headOf` returns the first element of an array, or `undefined` if the array is
 * empty.
 */
export function firstOf<T>(array: Array<T>): T | undefined {
  return array[0];
}

/**
 * `lastOf` returns the last element of an array, or `undefined` if the array is
 * empty.
 */
export function lastOf<T>(array: Array<T>): T | undefined {
  return array[array.length - 1];
}

/**
 * `initialOf` returns all elements of an array except the last one.
 */
export function initialOf<T>(array: Array<T>): Array<T> {
  return array.slice(0, array.length - 1);
}

/**
 * `tailOf` returns all elements of an array except the first one.
 */
export function tailOf<T>(array: Array<T>): Array<T> {
  return array.slice(1);
}

/**
 * `groupBy` groups adjacent elements of an array according to a given function.
 */
export function groupBy<T>(
  array: Array<T>,
  fn: (prev: T, curr: T) => boolean,
): Array<Array<T>> {
  if (!array.length) {
    return [];
  }

  const tail = array.slice(1);
  return tail.reduce(
    (memo: Array<Array<T>>, v: T): Array<Array<T>> => {
      const prevGroup = memo[memo.length - 1];
      if (fn(prevGroup[prevGroup.length - 1], v)) {
        prevGroup[prevGroup.length] = v;
      } else {
        memo[memo.length] = [v];
      }
      return memo;
    },
    [[array[0]]],
  );
}

/**
 * `takeWhile` takes elements from the beginning of an array while the given
 * predicate function.
 */
export function takeWhile<T>(
  array: Array<T>,
  fn: (value: T) => boolean,
): Array<T> {
  const result: Array<T> = [];
  for (const value of array) {
    if (!fn(value)) {
      break;
    }
    result.push(value);
  }
  return result;
}
