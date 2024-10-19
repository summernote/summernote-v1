import { Node as NoteNode, Element as NoteElement } from './types';

/**
 * `SchemaSpec` is a type that defines the structure of the schema.
 */
export type SchemaSpec = Record<string, NodeSpec>;
type NodeSpec = ElementSpec | TextNodeSpec;
type ElementSpec = { children: string };
type TextNodeSpec = Record<string, never>;

/**
 * `BasicSchema` represents basic schema that represents a simple text editor.
 */
export const BasicSchema: SchemaSpec = {
  root: { children: 'p+' },
  p: { children: 'text*' },
  text: {},
};

/**
 * `Schema` is a class that defines the structure of the model. It is used to
 * validate the model and to build the model from DOM or JSON or XML.
 */
export class Schema {
  private spec: SchemaSpec;

  constructor(spec: SchemaSpec) {
    this.validate(spec);
    this.spec = spec;
  }

  create(type: string, value: string): NoteNode {
    if (!this.spec[type]) {
      throw new Error(`invalid node type: ${type}`);
    }

    if (type === 'text') {
      return { type: 'text', text: value };
    }

    throw new Error('not implemented');
  }

  validate(schemaSpec: SchemaSpec): void {
    if (!schemaSpec.root) {
      throw new Error('root node not defined');
    }

    for (const [t, spec] of Object.entries(schemaSpec)) {
      if (t === 'text') {
        continue;
      }
      const elemSpec = spec as ElementSpec;
      const types = this.parseChildren(elemSpec.children);
      for (const t of types) {
        if (!schemaSpec[t]) {
          throw new Error(`invalid node type: ${t}`);
        }
      }
    }
  }

  parseChildren(children: string): Array<string> {
    // TODO(hackerwins): We need to support more complex children definition.
    children = children.replace(/\*|\+/g, '');
    return [children];
  }

  fromJSON(json: any): NoteNode {
    if (json.type === 'text') {
      return {
        type: 'text',
        text: json.text,
      };
    }

    if (!this.spec[json.type]) {
      throw new Error(`invalid node type: ${json.type}`);
    }

    return {
      type: json.type,
      attrs: json.attributes,
      children: json.children.map((child: any) => this.fromJSON(child)),
    };
  }

  fromDOM(domNode: Node): NoteNode {
    const spec = this.spec;

    function fromDOM(domNode: Node): NoteNode {
      if (domNode.nodeType === Node.TEXT_NODE) {
        return {
          type: 'text',
          text: domNode.textContent || '',
        };
      }

      if (domNode.nodeType !== Node.ELEMENT_NODE) {
        throw new Error(`invalid node type: ${domNode.nodeType}`);
      }
      if (!spec[domNode.nodeName.toLowerCase()]) {
        throw new Error(`invalid node type: ${domNode.nodeName}`);
      }

      const children = Array.from(domNode.childNodes).map(fromDOM);
      const node = {
        type: domNode.nodeName.toLowerCase(),
        children,
      } as NoteElement;
      for (const child of children) {
        child.parent = node;
      }

      const domElem = domNode as Element;
      if (domElem.attributes.length) {
        node.attrs = Array.from(domElem.attributes).reduce(
          (attrs, attr) => {
            attrs[attr.name] = attr.value;
            return attrs;
          },
          {} as Record<string, string>,
        );
      }

      return node;
    }

    return fromDOM(domNode);
  }

  fromXML(xml: string): NoteNode {
    const parser = new DOMParser();
    const doc = parser.parseFromString(xml, 'application/xml');
    return this.fromDOM(doc.documentElement);
  }
}
