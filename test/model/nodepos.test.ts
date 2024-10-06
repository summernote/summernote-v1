import { describe, it, expect } from 'vitest';
import { plainTextSchema, tokenToXML } from './helper';
import { Element } from '../../src/model/types';
import { pathOf } from '../../src/model/nodes';
import { nodesBetween, toNodePos } from '../../src/model/nodepos';

describe('NodePos', () => {
  it('should convert a Path to a Pos', () => {
    const val = /*html*/ `<root><p>Hello</p><p>World!</p></root>`;
    const container = plainTextSchema.fromXML(val) as Element;

    expect(toNodePos([0, 0, 0], container)).toEqual({
      node: (container.children![0] as Element).children![0],
      offset: 0,
    });
  });

  it('should convert a node to a path', () => {
    const val = /*html*/ `<root><p>Hello</p></root>`;
    const container = plainTextSchema.fromXML(val) as Element;
    const text = (container.children![0] as Element).children![0];
    expect(pathOf(text, container)).toEqual([0, 0]);
  });
});

describe('Nodes.Between', () => {
  it('should iterate over nodes between two positions', () => {
    const val = /*html*/ `<root><p>ab</p><p>cd</p><p>ef</p></root>`;
    const container = plainTextSchema.fromXML(val) as Element;

    const start = toNodePos([0, 0, 1], container);
    const end = toNodePos([2, 0, 1], container);
    const xml = Array.from(nodesBetween(container, start, end)).map(([node, type]) =>
      tokenToXML(node, type)
    ).join('');
    expect(xml).toEqual('ab</p><p>cd</p><p>ef');
  });

  it('should iterate over a text node', () => {
    const val = /*html*/ `<root><p>Hello</p></root>`;
    const container = plainTextSchema.fromXML(val) as Element;
    const text = (container.children![0] as Element).children![0];

    const start = { node: text, offset: 1 };
    const end = { node: text, offset: 4 };
    const xml = Array.from(nodesBetween(container, start, end)).map(([node, type]) =>
      tokenToXML(node, type)
    ).join('');

    expect(xml).toEqual('Hello');
  });

  it('should return empty if start and end are the same', () => {
    const val = /*html*/ `<root><p>Hello</p></root>`;
    const container = plainTextSchema.fromXML(val) as Element;
    const start = toNodePos([0, 0, 1], container);
    const end = toNodePos([0, 0, 1], container);
    const xml = Array.from(nodesBetween(container, start, end)).map(([node, type]) =>
      tokenToXML(node, type)
    ).join('');
    expect(xml).toEqual('');
  });
});
