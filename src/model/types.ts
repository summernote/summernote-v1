/**
 * `Node` represents the node in the model.
 */
export type Node = Text | Element;

/**
 * `Element` represents the element node in the model.
 */
export type Element = {
  type: string;
  parent?: Element;
  attrs?: Record<string, string>;
  children?: Array<Node>;
};

/**
 * `Text` represents the text node in the model.
 */
export type Text = {
  type: 'text';
  parent?: Element;
  text: string;
};

/**
 * Path represents the position of the content in the editor without direct
 * node reference.
 *
 * e.g.) For `<div><b>Hello</b><s>World!</s></div>`
 *       `[1]` of `<div>` means the position between `<b>` and `<s>`
 *       `[0, 0, 0]` of `<div>` means the leftmost position of "Hello"
 *       `[0, 0, 1]` of `<div>` means the position between "H" and "e"
 */
export type Path = Array<number>;

/**
 * `Range` represents the range of the content in the editor.
 */
export type Range = {
  s: Path;
  e: Path;
};

/**
 * `NodePos` represents the position of the node in the model. It can be converted
 * to `Path`.
 */
export type NodePos = {
  node: Node;
  offset: number;
};

/**
 * `IndexRange` represents the range of the content in the editor. It contains the
 * start and end indexes of the content. The index indicates the position of
 * the xml-like content in the editor.
 *
 * e.g.) For `<div><b>Hello</b><s>World!</s></div>`, positions are as follows:
 *            0   1     6    7   8      14    15
 *       <div> <b> Hello </b> <s> World!  </s>  </div>
 */
export type IndexRange = {
  s: number;
  e: number;
};
