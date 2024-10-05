import { Model } from './model';

export type Command = SetValue | Edit;

/**
 * `SetValue` is a command that sets the value of the model.
 */
export type SetValue = {
  t: 'setValue';
  p: {
    v: string;
  };
};

/**
 * `Edit` is a command that edits the value of the model.
 */
export type Edit = {
  t: 'edit';
  p: {
    f: number;
    t: number;
    v: string;
  };
};

/**
 * `execute` executes the command on the model and returns inverse command.
 */
export function execute(model: Model, command: Command): Command {
  switch (command.t) {
    case 'setValue':
      let prevValue = model.getValue();
      model.setValue(command.p.v);
      return {
        t: 'setValue',
        p: { v: prevValue },
      };
    case 'edit':
      let value = model.getValue(command.p.f, command.p.t);
      model.edit(command.p.f, command.p.t, command.p.v);
      return {
        t: 'edit',
        p: {
          f: command.p.f,
          t: command.p.f + command.p.v.length,
          v: value,
        },
      };
      break;
    default:
      throw new Error(`Unknown command type: ${JSON.stringify(command)}`);
  }
}
