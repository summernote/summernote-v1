import { Range } from '../range.ts';

/**
 * `offsetOf` returns the offset of the node in the container.
 */
function offsetOf(node: Node, container: Node): number {
  let offset = 0;
  let current = node.previousSibling;

  while (current) {
    offset += current.textContent?.length || 0;
    current = current.previousSibling;
  }

  if (node.parentNode !== container) {
    if (!node.parentNode) {
      throw new Error('node is not in the container');
    }

    return offset + offsetOf(node.parentNode, container);
  }

  return offset;
}

/**
 * `toRange` converts the abstract range to the range.
 */
export function toRange(range: AbstractRange, container: Node): Range {
  const start = offsetOf(range.startContainer, container) + range.startOffset;
  if (range.collapsed) {
    return { s: start, e: start };
  }

  const end = offsetOf(range.endContainer, container) + range.endOffset;
  return { s: start, e: end };
}
