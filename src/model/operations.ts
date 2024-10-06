import { Node, Range } from './types';

/**
 * `Operation` represents a operation that can be applied to the content in the
 * editor.
 */
export type Operation = EditOperation | MoveOperation;

/**
 * `ReplaceOperation` represents a operation that replaces a range of nodes with
 * another range of nodes.
 */
export type EditOperation = {
  type: 'edit';
  range: Range;
  value: Array<Node>;
};

/**
 * `MoveOperation` represents a operation that moves a range of nodes to another
 * position.
 */
export type MoveOperation = {
  type: 'move';
  source: Range;
  target: Range;
};
