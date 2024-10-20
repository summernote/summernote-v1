import './style.css';
import { Editor } from './editor';
import { Toolbar } from './plugins/toolbar';
import { Devtools } from './plugins/devtools';

const editor = Editor.create(
  document.querySelector<HTMLDivElement>('#editor')!,
  {
    initialValue: '<p>Hello,</p>',
    schema: {
      root: { children: 'p*' },
      p: { children: 'text*' },
      text: {},
    },
    plugins: [
      Toolbar.create(document.querySelector<HTMLDivElement>('#toolbar')!, {
        buttons: ['destroy', 'undo', 'redo'],
      }),
      Devtools.create(document.querySelector<HTMLDivElement>('#devtools')!),
    ],
  },
);

editor.insertText(' World!');
