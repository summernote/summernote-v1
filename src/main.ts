import './style.css';
import { Editor } from './editor';
import { Devtools } from './plugins/devtools';

const editor = Editor.create(
  document.querySelector<HTMLDivElement>('#editor')!,
  {
    initialValue: 'Hello,',
    plugins: [
      Devtools.create(document.querySelector<HTMLDivElement>('#devtools')!),
    ],
  },
);

editor.insertText(' World!');
