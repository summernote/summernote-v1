import { Model } from '../model/model';
import { Range } from '../model/types';
import { Operation } from '../model/operations';

export type Command = {
  ops: Array<Operation>;
};

export function insertText(range: Range, text: string): Command {
  return {
    ops: [
      {
        type: 'edit',
        range,
        value: [{ type: 'text', text }],
      },
    ],
  };
}

export function splitBlock(range: Range): Command {
  // TODO(hackerwins): Implement this according to the schema.
  return {
    ops: [
      {
        type: 'edit',
        range,
        value: [{ type: 'p' }],
      },
    ],
  };
}

/**
 * `execute` executes the command on the model and returns inverse command.
 */
export function execute(model: Model, command: Command): Command {
  const ops = [];

  for (const op of command.ops) {
    const inverse = model.apply(op);
    ops.push(inverse);
  }

  return {
    ops: ops,
  };
}
