import { Node } from './node';

type SchemaSpec = Record<string, NodeSpec>;
type NodeSpec = ElementSpec | TextNodeSpec;
type ElementSpec = { children: string };
type TextNodeSpec = {};

/**
 * `Schema` is a class that defines the structure of the model. It is used to
 * validate the model and to build the model from JSON.
 */
export class Schema {
  private spec: SchemaSpec;

  constructor(spec: SchemaSpec) {
    this.validate(spec);
    this.spec = spec;
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

  fromJSON(json: any): Node {
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
}
