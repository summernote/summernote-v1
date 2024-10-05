import { Editor } from '../editor';
import { Module } from '../utils/module';

export class Toolbar implements Module {
  private container: HTMLDivElement;
  private options: { buttons: Array<string> };
  private editor?: Editor;

  static create(
    container: HTMLDivElement,
    options: { buttons: Array<string> },
  ) {
    return new Toolbar(container, options || { buttons: [] });
  }

  constructor(container: HTMLDivElement, options: { buttons: Array<string> }) {
    this.container = container;
    this.options = options;
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
    for (const button of this.options.buttons) {
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
