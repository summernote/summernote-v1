import { Observable } from '../utils/observable';
import { Node, Text, Element, Range, NodePos } from './types';
import { Schema, SchemaSpec } from './schema';
import { Operation } from './operations';
import {
  insertAfter,
  insertBefore,
  lengthOf,
  pathOf,
  removeNode,
  splitText,
  toXML,
} from './nodes';
import { firstOf, lastOf } from '../utils/array';
import { isLeftMost, toNodePos, nodesBetween } from './nodepos';
import { isCollapsed } from './range';

export class Model extends Observable<Array<Operation>> {
  private schema: Schema;
  private root: Element;

  static create(spec: SchemaSpec, initialValue: string): Model {
    const schema = new Schema(spec);
    const value = schema.fromXML(initialValue);
    return new Model(schema, value);
  }

  constructor(schema: Schema, value: Node) {
    super();
    this.schema = schema;
    this.root = value;
  }

  createText(value: string): Text {
    return this.schema.create('text', value) as Text;
  }

  toXML(): string {
    return toXML(this.root);
  }

  apply(op: Operation): Operation {
    let inverse: Operation;
    switch (op.type) {
      case 'edit':
        inverse = this.edit(op.range, op.value);
        this.notify([op]);
        return inverse;
      case 'move':
        inverse = this.move(/*op.source, op.target*/);
        this.notify([op]);
        return inverse;
      default:
        throw new Error(`invalid operation type: ${op}`);
    }
  }

  edit(range: Range, values: Array<Node>): Operation {
    // NOTE(hackerwins): To keep the node of the position, we need to split the
    // text node at the end of the range.
    const end = this.nodePosOf(range.e);
    const start = isCollapsed(range) ? end : this.nodePosOf(range.s);

    const nodesToRemove: Array<Node> = [];
    for (const [node, type] of nodesBetween(this.root, start, end)) {
      if (type === 'open') {
        continue;
      }

      nodesToRemove.push(node);
    }

    for (const node of nodesToRemove) {
      removeNode(node);
    }

    const hasValues = values.length > 0;
    if (hasValues) {
      if (isLeftMost(start)) {
        insertBefore(start.node, ...values);
      } else {
        insertAfter(start.node, ...values);
      }
    }

    return {
      type: 'edit',
      range: hasValues ? this.rangeOf(values) : { s: range.s, e: range.s },
      value: nodesToRemove,
    };
  }

  /**
   * `rangeOf` returns the range of the given nodes in the model.
   */
  rangeOf(values: Array<Node>): Range {
    // TODO(hackerwins): This is a naive implementation that assumes the first
    // and last nodes are always text nodes. We need to handle the case where
    // the first and last nodes are elements.
    const start = pathOf(firstOf(values)!, this.root);
    start.push(0);

    const end = pathOf(lastOf(values)!, this.root);
    end.push(lengthOf(lastOf(values)!));

    return { s: start, e: end };
  }

  /**
   * `nodePosOf` returns the node position of the given path.
   */
  nodePosOf(path: Array<number>, withSplitText: boolean = true): NodePos {
    const pos = toNodePos(path, this.root);
    if (!withSplitText) {
      return pos;
    }

    const newNode = splitText(pos);
    if (!newNode) {
      return pos;
    }

    return {
      node: newNode,
      offset: 0,
    };
  }

  /**
   * `getContentEndRange` returns the range of the end of the content in the
   *  model.
   */
  getContentEndRange(): Range {
    const path = [];

    let node = this.root;
    while (node) {
      if (node.type === 'text') {
        const text = node as Text;
        path.push(text.text.length);
        break;
      }

      const elem = node as Element;
      const children = elem.children || [];
      if (children.length === 0) {
        break;
      }

      path.push(children.length - 1);
      node = lastOf(children)!;
    }

    return { s: path, e: path };
  }

  move(/*source: Range, target: Range*/): Operation {
    throw new Error('Method not implemented.');
  }
}
