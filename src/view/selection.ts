import { Range } from '../range.ts';

export type Position = [Node, number];

/**
 * `offsetOf` returns the offset of the node in the container.
 */
export function offsetOf(pos: Position, container: Node): number {
  const [node, offset] = pos;

  let found = false;
  function visit(n: Node): number {
    if (n === node) {
      found = true;
      return offset;
    }

    if (n.nodeType === Node.TEXT_NODE) {
      return n.textContent!.length;
    }

    // Add 1 for the open tag.
    let sum = 1;
    for (const child of n.childNodes) {
      sum += visit(child);
      if (found) {
        return sum;
      }
    }

    // Add 1 for the close tag.
    return sum + 1;
  }

  // NOTE(hackerwins): Subtract 1 because the open tag of the container is not
  // included in the offset.
  const result = visit(container) - 1;
  if (!found) {
    throw new Error('node is not in the container');
  }

  return result;
}

/**
 * `toRange` converts the abstract range to the range.
 */
export function toRange(range: AbstractRange, container: Node): Range {
  const start = offsetOf([range.startContainer, range.startOffset], container);
  if (range.collapsed) {
    return { s: start, e: start };
  }

  const end = offsetOf([range.endContainer, range.endOffset], container);
  return { s: start, e: end };
}
