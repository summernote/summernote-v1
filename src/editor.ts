import { TextView } from './text/view';
import { TextModel } from './text/model';
import { Command, execute } from './text/commands';
import { Module } from './utils/module';
import { Unsubscribe } from './utils/observable';

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
export class Editor implements Module {
  private view: TextView;
  private model: TextModel;
  private history: Array<Command>;
  private unsubscribes: Array<Unsubscribe>;
  private isUpstream: boolean;

  private plugins: Array<Module>;

  static create(container: HTMLDivElement, options: EditorOptions = {}) {
    const editor = new Editor(container, options);
    editor.initialize();
    return editor;
  }

  constructor(container: HTMLDivElement, options: EditorOptions) {
    this.view = TextView.create(container);
    this.model = new TextModel(options.initialValue || '');
    this.history = [];
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
    execute(this.model, command);
    this.history.push(command);
  }

  /**
   * TODO(hackerwins): Find a better way to provide APIs.
   */
  insertText(text: string) {
    this.execute({
      type: 'edit',
      payload: {
        from: this.model.getValue().length,
        to: this.model.getValue().length,
        value: text,
      },
    });
  }

  getModel(): TextModel {
    return this.model;
  }
}
