import { describe, it, expect } from 'vitest';
import { Schema } from '../../src/model/schema';

describe('Schema', () => {
  it('should be created with a valid spec', () => {
    expect(
      new Schema({
        root: { children: 'para*' },
        para: { children: 'text*' },
        text: {},
      }),
    ).toBeDefined();

    expect(() => {
      new Schema({ para: { children: 'text*' } });
    }).toThrowError('root node not defined');

    expect(() => {
      new Schema({
        root: { children: 'paragraph*' },
        para: { children: 'text*' },
      });
    }).toThrowError('invalid node type: paragraph');
  });

  it('should build a node from JSON', () => {
    const schema = new Schema({
      root: { children: 'para*' },
      para: { children: 'text*' },
      text: {},
    });

    expect(
      schema.fromJSON({
        type: 'para',
        children: [{ type: 'text', text: 'Hello, world!' }],
      }),
    ).toEqual({
      type: 'para',
      children: [{ type: 'text', text: 'Hello, world!' }],
    });

    expect(() => {
      schema.fromJSON({
        type: 'paragraph',
        children: [{ type: 'invalid', text: 'Hello, world!' }],
      });
    }).toThrowError('invalid node type: paragraph');
  });
});
