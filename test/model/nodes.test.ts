import { describe, it, expect } from 'vitest';
import { plainTextSchema } from './helper';
import { Element } from '../../src/model/types';
import { insertAfter, removeNode, splitText, toXML } from '../../src/model/nodes';
import { toNodePos } from '../../src/model/nodepos';


describe('Nodes', () => {
  const val = /*html*/ `<p>Hello, world!</p>`;
  const container = plainTextSchema.fromXML(val) as Element;

  it('should serialize to XML', () => {
    expect(toXML(container)).toEqual(val);
  });

  it('should split a text node', () => {
    const val = /*html*/ `<p>Hello, world!</p>`;
    const container = plainTextSchema.fromXML(val) as Element;
    const node = splitText(toNodePos([0, 5], container));
    expect(toXML(node!)).toEqual(', world!');
  });

  it('should insert a node after another', () => {
    const val = /*html*/ `<p>Hello</p>`;
    const container = plainTextSchema.fromXML(val) as Element;
    const node = insertAfter(container.children![0], {
      type: 'text',
      text: ', world!',
    })[0];
    expect(toXML(node!)).toEqual(', world!');
    expect(toXML(container)).toEqual(/*html*/ `<p>Hello, world!</p>`);

    removeNode(container.children![0]);
    expect(toXML(container)).toEqual(/*html*/ `<p>, world!</p>`);
  });
});
