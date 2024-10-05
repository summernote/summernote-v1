/**
 * `Range` represents the range of the content in the editor. It contains the
 * start and end offsets of the content. The offset indicates the position of
 * the xml-like content in the editor.
 *
 * e.g.) For `<div><b>Hello</b><s>World!</s></div>`, positions are as follows:
 *            0   1     6    7   8      14    15
 *       <div> <b> Hello </b> <s> World!  </s>  </div>
 */
export type Range = {
  s: number;
  e: number;
};
