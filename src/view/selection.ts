import { IndexRange, Range, Path } from '../model/types';
import { groupBy, takeWhile } from '../utils/array';

/**
 * `Position` represents the position in the given container in the DOM. For
 * passing the position to the model, we need to convert `Position` to the
 * `Path`.
 */
export type Position = [Node, number];

export function getSelection(container: Node): Range | undefined {
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0) {
    return;
  }

  const range = selection.getRangeAt(0);
  return toRange(range, container);
}

/**
 * `toRange` converts the abstract range to the path range.
 */
export function toRange(range: AbstractRange, container: Node): Range {
  const start = pathOf([range.startContainer, range.startOffset], container);
  if (range.collapsed) {
    return { s: start, e: start };
  }

  const end = pathOf([range.endContainer, range.endOffset], container);
  return { s: start, e: end };
}

/**
 * `pathOf` returns the path of the node in the container.
 */
export function pathOf(pos: Position, container: Node): Path {
  let [node, offset] = pos;
  const path = [];

  while (node !== container) {
    const parent = node.parentNode;
    if (!parent) {
      throw new Error('node is not in the container');
    }

    // NOTE(hackerwins): In the path, adjacent text nodes are treated as one
    // node, so we need to group them and calculate the offset in the group.
    const children = Array.from(parent.childNodes);
    const groups = groupBy(
      children,
      (p, c) => p.nodeType === Node.TEXT_NODE && c.nodeType === Node.TEXT_NODE,
    );

    const i = groups.findIndex((g) => g.includes(node as ChildNode));

    // NOTE(hackerwins): If the node is a text, we need to append the index in
    // the concatenated text content.
    if (node.nodeType === Node.TEXT_NODE) {
      const index =
        takeWhile(groups[i], (c) => c !== node).reduce(
          (acc, c) => acc + (c.textContent || '').length,
          0,
        ) + offset;
      path.unshift(index);
    }

    path.unshift(i);
    node = parent;
  }

  return path;
}

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
export function toIndexRange(
  range: AbstractRange,
  container: Node,
): IndexRange {
  const start = offsetOf([range.startContainer, range.startOffset], container);
  if (range.collapsed) {
    return { s: start, e: start };
  }

  const end = offsetOf([range.endContainer, range.endOffset], container);
  return { s: start, e: end };
}
