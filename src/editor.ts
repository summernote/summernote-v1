import { History } from './history';
import { Module } from './utils/module';
import { Observable, Unsubscribe } from './utils/observable';

import { TextView } from './text/view';
import { Model } from './text/model';
import { Command, execute } from './text/commands';

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
export class Editor extends Observable<Command> implements Module {
  private view: TextView;
  private model: Model;
  private history: History<Command>;
  private unsubscribes: Array<Unsubscribe>;
  private isUpstream: boolean;

  private plugins: Array<Module>;

  static create(container: HTMLDivElement, options: EditorOptions = {}) {
    const editor = new Editor(container, options);
    editor.initialize();
    return editor;
  }

  constructor(container: HTMLDivElement, options: EditorOptions) {
    super();

    this.view = TextView.create(container);
    this.model = new Model(options.initialValue || '');
    this.history = new History<Command>((command) =>
      execute(this.model, command),
    );
    this.unsubscribes = [];
    this.isUpstream = false;

    this.plugins = options.plugins || [];
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

  execute(command: Command) {
    const inverse = execute(this.model, command);
    this.history.push(inverse);
    this.notify(command);
  }

  undo() {
    const command = this.history.undo();
    if (command) {
      this.notify(command);
    }
  }

  redo() {
    const command = this.history.redo();
    if (command) {
      this.notify(command);
    }
  }

  getHistory(): History<Command> {
    return this.history;
  }

  getModel(): Model {
    return this.model;
  }

  /**
   * TODO(hackerwins): Find a better way to provide APIs.
   */
  insertText(text: string) {
    this.execute({
      t: 'edit',
      p: {
        f: this.model.getValue().length,
        t: this.model.getValue().length,
        v: text,
      },
    });
  }
}
