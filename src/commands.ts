import { Model } from './model/model';

export type Command = SetValue | Edit;

/**
 * `SetValue` is a command that sets the value of the model.
 */
export type SetValue = {
  t: 'v';
  v: string;
};

/**
 * `Edit` is a command that edits the value of the model.
 */
export type Edit = {
  t: 'e';
  s: number;
  e: number;
  v: string;
};

/**
 * `execute` executes the command on the model and returns inverse command.
 */
export function execute(model: Model, command: Command): Command {
  switch (command.t) {
    case 'v':
      let prevValue = model.getValue();
      model.setValue(command.v);
      return {
        t: 'v',
        v: prevValue,
      };
    case 'e':
      let value = model.getValue(command.s, command.e);
      model.edit(command.s, command.e, command.v);
      return {
        t: 'e',
        s: command.s,
        e: command.s + command.v.length,
        v: value,
      };
      break;
    default:
      throw new Error(`Unknown command type: ${JSON.stringify(command)}`);
  }
}
