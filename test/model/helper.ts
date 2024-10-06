import { TagType } from '../../src/model/nodes';
import { Node, Text } from '../../src/model/types';
import { Schema } from '../../src/model/schema';

/**
 * `PlainTextSpec` is a schema for a plain text document.
 */
export const PlainTextSpec = {
  root: { children: 'p*' },
  p: { children: 'text*' },
  text: {},
};

/**
 * `tokenToXML` converts a node and tag type to an XML string.
 */
export function tokenToXML(node: Node, type: TagType): string {
  switch (type) {
    case 'open':
      return `<${node.type}>`;
    case 'close':
      return `</${node.type}>`;
    case 'text':
      return (node as Text).text;
  }
}

export const plainTextSchema = new Schema(PlainTextSpec);
