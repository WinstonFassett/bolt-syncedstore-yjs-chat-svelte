import type { MenuItem } from '../../../type.js';

import AlignLeft from '@lucide/svelte/icons/align-left';
import AlignCenter from '@lucide/svelte/icons/align-center';
import AlignRight from '@lucide/svelte/icons/align-right';
import AlignJustify from '@lucide/svelte/icons/align-justify';
import ListX from '@lucide/svelte/icons/list-x';

export const alignItems: MenuItem[] = [
	{
		// - setTextAlign left
		icon: AlignLeft,
		command: (editor) => editor?.chain().focus().setTextAlign('left').run(),
		disabled: (editor) => !editor?.can().setTextAlign('left'),
		active: (editor) => editor?.isActive({ textAlign: 'left' }) ?? false
	},
	{
		// - setTextAlign center
		icon: AlignCenter,
		command: (editor) => editor?.chain().focus().setTextAlign('center').run(),
		disabled: (editor) => !editor?.can().setTextAlign('center'),
		active: (editor) => editor?.isActive({ textAlign: 'center' }) ?? false
	},
	{
		// - setTextAlign right
		icon: AlignRight,
		command: (editor) => editor?.chain().focus().setTextAlign('right').run(),
		disabled: (editor) => !editor?.can().setTextAlign('right'),
		active: (editor) => editor?.isActive({ textAlign: 'right' }) ?? false
	},

	//

	{
		// - setTextAlign justify
		icon: AlignJustify,
		command: (editor) => editor?.chain().focus().setTextAlign('justify').run(),
		disabled: (editor) => !editor?.can().setTextAlign('justify'),
		active: (editor) => editor?.isActive({ textAlign: 'justify' }) ?? false
	},
	{
		// - unsetTextAlign
		icon: ListX,
		command: (editor) => editor?.chain().focus().unsetTextAlign().run(),
		disabled: (editor) => !editor?.can().unsetTextAlign()
	}
];
