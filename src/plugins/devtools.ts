import { Editor } from '../editor';
import { Unsubscribe } from '../utils/observable';
import { Module } from '../utils/module';

/**
 * `Devtools` is a plugin that shows the content of the editor model.
 * It is useful for debugging and testing.
 */
export class Devtools implements Module {
  private container: HTMLDivElement;
  private unsubscribe?: Unsubscribe;

  static create(container: HTMLDivElement) {
    return new Devtools(container);
  }

  constructor(container: HTMLDivElement) {
    this.container = container;
  }

  initialize(editor: Editor) {
    this.unsubscribe = editor.subscribe(() => {
      this.render(
        `${editor.getModel().toXML()}\n${editor.getHistory().toJSON()}`,
      );
    });
  }

  destroy() {
    this.unsubscribe?.();
    this.container.innerHTML = '';
  }

  render(value: string): void {
    this.container.innerText = value;
  }
}
