import { TextModel } from './model';

export type Command = SetValue | Edit;

export type SetValue = {
  type: 'setValue';
  payload: {
    value: string;
    oldValue?: string;
  };
};

export type Edit = {
  type: 'edit';
  payload: {
    from: number;
    to: number;
    value: string;
  };
};

/**
 * `execute` executes the command on the model.
 */
export function execute(model: TextModel, command: Command): void {
  switch (command.type) {
    case 'setValue':
      command.payload.oldValue = model.getValue();
      model.setValue(command.payload.value);
      break;
    case 'edit':
      model.edit(
        command.payload.from,
        command.payload.to,
        command.payload.value,
      );
      break;
    default:
      throw new Error(`Unknown command type: ${JSON.stringify(command)}`);
  }
}

/**
 * `undo` undoes the command on the model. It is the inverse of `execute`.
 */
export function undo(model: TextModel, command: Command): void {
  switch (command.type) {
    case 'setValue':
      model.setValue(command.payload.oldValue || '');
      break;
    case 'edit':
      throw new Error('Unimplemented');
      break;
    default:
      throw new Error(`Unknown command type: ${JSON.stringify(command)}`);
  }
}
