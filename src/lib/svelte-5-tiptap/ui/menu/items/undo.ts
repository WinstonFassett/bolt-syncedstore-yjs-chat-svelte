import type { MenuItem } from '../../../type.js';
import Undo_2 from '@lucide/svelte/icons/undo-2';
import Redo_2 from '@lucide/svelte/icons/redo-2';

export const undoItems: MenuItem[] = [
	{
		// - undo
		icon: Undo_2,
		command: (editor) => editor?.chain().focus().undo().run() ?? false,
		disabled: (editor) => !editor?.can().undo()
	},
	{
		// - redo
		icon: Redo_2,
		command: (editor) => editor?.chain().focus().redo().run() ?? false,
		disabled: (editor) => !editor?.can().redo()
	}
];
