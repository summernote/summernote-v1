import { Node, Text, Element, NodePos, Path } from './types';

/**
 * `TagType` represents the type of the tag. It can be 'open', 'close', or
 * 'text'.
 */
export type TagType = 'open' | 'close' | 'text';

/**
 * `toXML` converts the node to the XML string.
 */
export function toXML(node: Node): string {
  if (node.type === 'text') {
    const n = node as Text;
    return n.text;
  }

  const elem = node as Element;

  const children = elem.children?.map(toXML).join('');
  return `<${elem.type}>${children}</${elem.type}>`;
}

/**
 * `pathOf` returns the path of the node from the container.
 */
export function pathOf(node: Node, container: Element): Path {
  const path: Path = [];
  let current = node;

  while (current !== container) {
    if (!current.parent || !current.parent.children) {
      throw new Error('node is not in the container');
    }

    path.unshift(current.parent.children.indexOf(current));
    current = current.parent;
  }

  return path;
}

export function lengthOf(node: Node): number {
  if (node.type === 'text') {
    return (node as Text).text.length;
  }

  const elem = node as Element;
  return elem.children ? elem.children.length : 0;
}

/**
 * `splitText` splits the text node at the given position.
 */
export function splitText(pos: NodePos): Text | undefined {
  if (pos.node.type !== 'text') {
    return;
  }

  const text = pos.node as Text;

  if (pos.offset === 0 || pos.offset === text.text.length) {
    return;
  }

  const prev = text.text.slice(0, pos.offset);
  const next = text.text.slice(pos.offset);

  text.text = prev;
  const newNode = { type: 'text', text: next };
  return insertAfter(text, newNode)[0] as Text;
}

/**
 * `insertBefore` inserts the new nodes before the next node.
 */
export function insertBefore(
  next: Node,
  ...newNodes: Array<Node>
): Array<Node> {
  const parent = next.parent;
  if (!parent) {
    throw new Error('node does not have a parent');
  }

  const index = parent.children!.indexOf(next);
  parent.children!.splice(index, 0, ...newNodes);
  for (const node of newNodes) {
    node.parent = parent;
  }

  return newNodes;
}

/**
 * `insertAfter` inserts the new nodes after the previous node.
 */
export function insertAfter(prev: Node, ...newNodes: Array<Node>): Array<Node> {
  const parent = prev.parent;
  if (!parent) {
    throw new Error('node does not have a parent');
  }

  const index = parent.children!.indexOf(prev);
  parent.children!.splice(index + 1, 0, ...newNodes);
  for (const node of newNodes) {
    node.parent = parent;
  }

  return newNodes;
}

/**
 * `removeNode` removes the node from the parent.
 */
export function removeNode(node: Node) {
  const parent = node.parent;
  if (!parent) {
    throw new Error('node does not have a parent');
  }

  const children = parent.children!;
  const index = children.indexOf(node);
  if (index === -1) {
    throw new Error('node is not in the parent');
  }

  children.splice(index, 1);
}
