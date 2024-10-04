import { Observable } from '../utils/observable';

export class TextModel extends Observable<string> {
  private value: string;

  constructor(value: string) {
    super();
    this.value = value;
  }

  setValue(value: string): void {
    this.value = value;
    this.notify(this.value);
  }

  getValue(): string {
    return this.value;
  }

  edit(start: number, end: number, text: string): void {
    this.value = this.value.slice(0, start) + text + this.value.slice(end);
    this.notify(this.value);
  }
}
