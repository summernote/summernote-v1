import { describe, it, expect } from 'vitest';
import { Model } from '../../src/model/model';
import { PlainTextSpec as PTSpec } from './helper';

describe('model', () => {
  it('should be created with schema and value', () => {
    const initialValue = /*html*/ `<root><p>Hello, world!</p></root>`;
    const m = Model.create(PTSpec, initialValue);
    expect(m.toXML()).toEqual(initialValue);
  });

  it('should be able to edit text', () => {
    const m = Model.create(PTSpec, /*html*/ `<root><p>Hell!</p></root>`);

    let inverse = m.edit({ s: [0, 0, 4], e: [0, 0, 4] }, [
      { type: 'text', text: 'o' },
    ]);
    expect(m.toXML()).toEqual(/*html*/ `<root><p>Hello!</p></root>`);

    inverse = m.apply(inverse);
    expect(m.toXML()).toEqual(/*html*/ `<root><p>Hell!</p></root>`);

    m.apply(inverse);
    expect(m.toXML()).toEqual(/*html*/ `<root><p>Hello!</p></root>`);
  });

  it.skip('should be able to edit text with multiple elements', () => {
    const m = Model.create(PTSpec, /*html*/ `<root><p>1p</p><p>2p</p></root>`);

    let inverse = m.edit({ s: [0, 0, 1], e: [1, 0, 1] }, []);
    expect(m.toXML()).toEqual(/*html*/ `<root><p>1p</p></root>`);

    inverse = m.apply(inverse);
    expect(m.toXML()).toEqual(/*html*/ `<root><p>1p</p><p>2p</p></root>`);

    m.apply(inverse);
    expect(m.toXML()).toEqual(/*html*/ `<root><p>1p</p></root>`);
  });
});
