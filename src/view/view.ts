import { Command } from '../commands';
import { Module } from '../utils/module';
import { Observable } from '../utils/observable';
import { toRange } from './selection';

/**
 * `CommonInputEventTypes` is a list of common input event types that are
 * directly converted to edit commands.
 */
const CommonInputEventTypes = [
  'insertText',
  'insertCompositionText',
  'deleteContentBackward',
  'deleteContentForward',
];

export class View extends Observable<Command> implements Module {
  private container: HTMLDivElement;

  static create(container: HTMLDivElement) {
    const view = new View(container);
    view.initialize();
    return view;
  }

  constructor(container: HTMLDivElement) {
    super();

    this.container = container;
    this.container.setAttribute('contenteditable', 'true');
    this.handleBeforeInput = this.handleBeforeInput.bind(this);
  }

  getTextFromEvent(event: InputEvent): string {
    if (typeof event.data === 'string') {
      return event.data;
    }

    if (event.dataTransfer?.types.includes('text/plain')) {
      return event.dataTransfer.getData('text/plain');
    }

    return '';
  }

  handleBeforeInput(event: InputEvent) {
    if (CommonInputEventTypes.includes(event.inputType)) {
      // TODO(hackerwins): We need to aggregate consecutive input events created
      // by composition text into one command.
      const text = this.getTextFromEvent(event);
      const range = toRange(event.getTargetRanges()[0], this.container);
      this.notify({
        t: 'e',
        s: range.s,
        e: range.e,
        v: text,
      });
    } else if (event.inputType === 'insertParagraph') {
      // TODO(hackerwins): We figure out more input types created by enter key.
      // TODO(hackerwins): We need to handle dummy br element created by enter key.
      const text = '\n';
      const range = toRange(event.getTargetRanges()[0], this.container);
      this.notify({
        t: 'e',
        s: range.s,
        e: range.e,
        v: text,
      });
    }
  }

  initialize() {
    this.container.addEventListener('beforeinput', this.handleBeforeInput);
  }

  destroy() {
    this.container.setAttribute('contenteditable', 'false');
    this.container.removeEventListener('beforeinput', this.handleBeforeInput);
  }

  getValue(): string {
    return this.container.innerHTML;
  }

  setValue(value: string) {
    this.container.innerHTML = value;
  }
}
