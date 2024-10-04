import { Editor } from '../editor';

/**
 * `Module` is an interface that has some lifecycle methods. It contains
 * resources that should be cleaned up when the module is destroyed.
 */
export interface Module {
  initialize(editor: Editor): void;
  destroy(): unknown;
}
