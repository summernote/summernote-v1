import { History } from './history';
import { Module } from './utils/module';
import { Observable, Unsubscribe } from './utils/observable';

import { View as View } from './view/view';
import { Model } from './model';
import { Command, execute } from './commands';

/**
 * `EditorOptions` is an object that contains the initial value of the editor
 *  and the plugins that should be initialized.
 */
type EditorOptions = {
  initialValue?: string;
  plugins?: Array<Module>;
};

/**
 * `Editor` is the main class that connects the view and the model. It also
 * initializes the plugins and handles the commands.
 */
export class Editor extends Observable<Array<Command>> implements Module {
  private view: View;
  private model: Model;
  private history: History<Command>;
  private unsubscribes: Array<Unsubscribe>;
  private isUpstream: boolean;

  private plugins: Array<Module>;

  static create(container: HTMLDivElement, opts: EditorOptions = {}) {
    const editor = new Editor(container, opts);
    editor.initialize();
    return editor;
  }

  constructor(container: HTMLDivElement, opts: EditorOptions) {
    super();

    this.view = View.create(container);
    this.model = new Model(opts.initialValue || '');
    this.history = new History<Command>((command) =>
      execute(this.model, command),
    );
    this.unsubscribes = [];
    this.isUpstream = false;

    this.plugins = opts.plugins || [];
  }

  initialize() {
    // 01. Initialize the view with the model's content.
    this.view.setValue(this.model.getValue());

    // 02. Upstream: view creates commands and then the editor executes them.
    this.unsubscribes.push(
      this.view.subscribe((command) => {
        this.isUpstream = true;
        this.execute(command);
        this.isUpstream = false;
      }),
    );

    // 03. Downstream: If the model changes, the view should be updated.
    this.unsubscribes.push(
      this.model.subscribe((value) => {
        // Prevent downstream updates if the view is the source of change.
        if (this.isUpstream) {
          return;
        }

        this.view.setValue(value);
      }),
    );

    // 04. Initialize plugins.
    for (const plugin of this.plugins) {
      plugin.initialize(this);
    }
  }

  destroy() {
    this.view.destroy();

    for (const unsub of this.unsubscribes) {
      unsub();
    }

    for (const plugin of this.plugins) {
      plugin.destroy();
    }
  }

  execute(...commands: Array<Command>) {
    for (const c of commands) {
      const inverse = execute(this.model, c);
      this.history.push(inverse);
    }

    this.notify(commands);
  }

  undo() {
    const command = this.history.undo();
    if (command) {
      this.notify([command]);
    }
  }

  redo() {
    const command = this.history.redo();
    if (command) {
      this.notify([command]);
    }
  }

  getHistory(): History<Command> {
    return this.history;
  }

  /**
   * TODO(hackerwins): Find a better way to provide APIs.
   */
  insertText(text: string) {
    this.execute({
      t: 'e',
      s: this.model.getValue().length,
      e: this.model.getValue().length,
      v: text,
    });
  }
}
