import { describe, it, expect } from 'vitest';
import { History } from '../src/history';

type CounterCommand =
  | { type: 'inc'; value: number }
  | { type: 'dec'; value: number };

function execute(command: CounterCommand): CounterCommand {
  if (command.type === 'inc') {
    return { type: 'dec', value: command.value };
  }

  return { type: 'inc', value: command.value };
}

describe('history', () => {
  it('should undo and redo commands', () => {
    const history = new History<CounterCommand>(execute);

    history.push({ type: 'inc', value: 1 });
    history.push({ type: 'inc', value: 2 });

    expect(history.undo()).toEqual({ type: 'dec', value: 2 });
    expect(history.undo()).toEqual({ type: 'dec', value: 1 });
    expect(history.undo()).toBeUndefined();

    expect(history.redo()).toEqual({ type: 'inc', value: 1 });
    expect(history.redo()).toEqual({ type: 'inc', value: 2 });
    expect(history.redo()).toBeUndefined();
  });

  it('should serialize and deserialize history', () => {
    const history = new History<CounterCommand>(execute);

    history.push({ type: 'inc', value: 1 });
    history.push({ type: 'inc', value: 2 });
    expect(history.toJSON()).toEqual(
      JSON.stringify({
        undos: [
          { type: 'inc', value: 1 },
          { type: 'inc', value: 2 },
        ],
        redos: [],
      }),
    );

    history.undo();
    expect(history.toJSON()).toEqual(
      JSON.stringify({
        undos: [{ type: 'inc', value: 1 }],
        redos: [{ type: 'dec', value: 2 }],
      }),
    );

    history.undo();
    expect(history.toJSON()).toEqual(
      JSON.stringify({
        undos: [],
        redos: [
          { type: 'dec', value: 2 },
          { type: 'dec', value: 1 },
        ],
      }),
    );

    history.redo();
    expect(history.toJSON()).toEqual(
      JSON.stringify({
        undos: [{ type: 'inc', value: 1 }],
        redos: [{ type: 'dec', value: 2 }],
      }),
    );
  });
});
