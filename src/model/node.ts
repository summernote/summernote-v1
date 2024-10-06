export type Node = Element | Text;

export type Element = {
  type: string;
  attrs: Record<string, string>;
  children: Array<Node>;
};

export type Text = {
  type: 'text';
  text: string;
};
