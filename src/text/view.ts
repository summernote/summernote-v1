import { Command } from './commands';
import { Module } from '../utils/module';
import { Observable } from '../utils/observable';

export class TextView extends Observable<Command> implements Module {
  private container: HTMLDivElement;

  static create(container: HTMLDivElement) {
    const view = new TextView(container);
    view.initialize();
    return view;
  }

  constructor(container: HTMLDivElement) {
    super();

    this.container = container;
    this.container.setAttribute('contenteditable', 'true');
    this.handleInput = this.handleInput.bind(this);
  }

  handleInput() {
    this.notify({
      t: 'setValue',
      p: { v: this.getValue() },
    });
  }

  initialize() {
    this.container.addEventListener('input', this.handleInput);
  }

  destroy() {
    this.container.setAttribute('contenteditable', 'false');
    this.container.removeEventListener('input', this.handleInput);
  }

  getValue(): string {
    return this.container.innerHTML;
  }

  setValue(value: string) {
    this.container.innerHTML = value;
  }
}
