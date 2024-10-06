import { NodePos, Path, Node, Element } from "./types";
import { lengthOf, TagType } from "./nodes";
import { initialOf, lastOf } from "../utils/array";

/**
 * `toNodePos` converts the path to the node position.
 */
export function toNodePos(path: Path, container: Element): NodePos {
  let node = container;

  for (const offset of initialOf(path)) {
    node = node.children![offset];
  }

  return { node, offset: lastOf(path)! };
}

/**
 * `nodesBetween` iterates over the nodes between the start and end positions.
 */
export function* nodesBetween(
  container: Element,
  start: NodePos,
  end: NodePos,
): Generator<[Node, TagType]> {
  let inRange = false;
  function* traverse(node: Node): Generator<[Node, TagType]> {
    if (node === start.node) {
      inRange = true;
    }

    if (node.type === 'text') {
      if (inRange) {
        yield [node, 'text'];
      }
    } else {
        const elem = node as Element;
        for (const child of elem.children || []) {
          if (child.type !== 'text' && inRange) {
            yield [child, 'open'];
          }
        
          yield* traverse(child);
        
          if (child.type !== 'text' && inRange) {
            yield [child, 'close'];
          }
        }
      }

    if (node === end.node) {
      inRange = false;
    }
  }

  if (equals(start, end)) {
    return;
  }

  yield* traverse(container);
}

/**
 * `isLeftMost` checks if the node position is the leftmost position of the node.
 */
export function isLeftMost(pos: NodePos): boolean {
  return pos.offset === 0;
}

/**
 * `isRightMost` checks if the node position is the rightmost position of the node.
 */
export function isRightMost(pos: NodePos): boolean {
  return pos.offset === lengthOf(pos.node);
}

/**
 * `equals` checks if two node positions are equal.
 */
export function equals(a: NodePos, b: NodePos): boolean {
  return a.node === b.node && a.offset === b.offset;
}
