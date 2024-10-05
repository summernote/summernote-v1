import { Editor } from '../editor';
import { Module } from '../utils/module';

type ToolbarOptions = {
  buttons: Array<string>;
};

export class Toolbar implements Module {
  private container: HTMLDivElement;
  private opts: ToolbarOptions;
  private editor?: Editor;

  static create(
    container: HTMLDivElement,
    options: { buttons: Array<string> },
  ) {
    return new Toolbar(container, options || { buttons: [] });
  }

  constructor(container: HTMLDivElement, opts: ToolbarOptions) {
    this.container = container;
    this.opts = opts;
    this.handleButtonClick = this.handleButtonClick.bind(this);
  }

  initialize(editor: Editor) {
    this.editor = editor;
    this.render();
    this.container.addEventListener('click', this.handleButtonClick);
  }

  destroy() {
    this.container.removeEventListener('click', this.handleButtonClick);
    this.container.innerHTML = '';
  }

  render() {
    for (const button of this.opts.buttons) {
      const element = document.createElement('button');
      element.setAttribute('data-type', button);
      element.innerText = button;
      this.container.appendChild(element);
    }
  }

  handleButtonClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (target.tagName !== 'BUTTON' || !this.editor) {
      return;
    }

    const method = target.getAttribute('data-type') || '';
    (this.editor as any)[method]();
  }
}
