/**
 * `History` is a class that manages a history of commands that can be undone
 * and redone. It is used to implement undo and redo functionality in the editor.
 */
export class History<T> {
  private execute: (command: T) => T;
  private undos: Array<T>;
  private redos: Array<T>;

  constructor(execute: (command: T) => T) {
    this.execute = execute;
    this.undos = [];
    this.redos = [];
  }

  push(command: T): void {
    this.undos.push(command);
    this.redos = [];
  }

  undo(): T | undefined {
    const command = this.undos.pop();
    if (!command) {
      return;
    }

    const inverse = this.execute(command);
    this.redos.push(inverse);
    return inverse;
  }

  redo(): T | undefined {
    const command = this.redos.pop();
    if (!command) {
      return;
    }

    const inverse = this.execute(command);
    this.undos.push(inverse);
    return inverse;
  }

  toJSON(): string {
    return JSON.stringify({
      undos: this.undos,
      redos: this.redos,
    });
  }
}
