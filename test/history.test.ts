import { describe, it, expect } from 'vitest';
import { History } from '../src/history';

type CounterCommand =
  | { type: 'inc'; payload: { value: number } }
  | { type: 'dec'; payload: { value: number } };

function execute(command: CounterCommand): CounterCommand {
  if (command.type === 'inc') {
    return { type: 'dec', payload: { value: command.payload.value } };
  }

  return { type: 'inc', payload: { value: command.payload.value } };
}

describe('history', () => {
  it('should undo and redo commands', () => {
    const history = new History<CounterCommand>(execute);

    history.push({ type: 'inc', payload: { value: 1 } });
    history.push({ type: 'inc', payload: { value: 2 } });

    expect(history.undo()).toEqual({ type: 'dec', payload: { value: 2 } });
    expect(history.undo()).toEqual({ type: 'dec', payload: { value: 1 } });
    expect(history.undo()).toBeUndefined();

    expect(history.redo()).toEqual({ type: 'inc', payload: { value: 1 } });
    expect(history.redo()).toEqual({ type: 'inc', payload: { value: 2 } });
    expect(history.redo()).toBeUndefined();
  });

  it('should serialize and deserialize history', () => {
    const history = new History<CounterCommand>(execute);

    history.push({ type: 'inc', payload: { value: 1 } });
    history.push({ type: 'inc', payload: { value: 2 } });
    expect(history.toJSON()).toEqual(
      JSON.stringify({
        undos: [
          { type: 'inc', payload: { value: 1 } },
          { type: 'inc', payload: { value: 2 } },
        ],
        redos: [],
      }),
    );

    history.undo();
    expect(history.toJSON()).toEqual(
      JSON.stringify({
        undos: [{ type: 'inc', payload: { value: 1 } }],
        redos: [{ type: 'dec', payload: { value: 2 } }],
      }),
    );

    history.undo();
    expect(history.toJSON()).toEqual(
      JSON.stringify({
        undos: [],
        redos: [
          { type: 'dec', payload: { value: 2 } },
          { type: 'dec', payload: { value: 1 } },
        ],
      }),
    );

    history.redo();
    expect(history.toJSON()).toEqual(
      JSON.stringify({
        undos: [{ type: 'inc', payload: { value: 1 } }],
        redos: [{ type: 'dec', payload: { value: 2 } }],
      }),
    );
  });
});
