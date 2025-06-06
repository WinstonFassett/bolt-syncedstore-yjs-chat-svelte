import type { MenuItem } from '../../../type.js';

import Quote from '@lucide/svelte/icons/quote';
import Code from '@lucide/svelte/icons/code';

export const miscItems: MenuItem[] = [
	{
		// - toggleBlockquote
		icon: Quote,
		command: (editor) => editor?.chain().focus().toggleBlockquote().run(),
		disabled: (editor) => !editor?.can().toggleBlockquote(),
		active: (editor) => editor?.isActive('blockquote') ?? false
	},
	{
		// - toggleCodeBlock
		icon: Code,
		command: (editor) => editor?.chain().focus().toggleCodeBlock().run(),
		disabled: (editor) => !editor?.can().toggleCodeBlock(),
		active: (editor) => editor?.isActive('codeBlock') ?? false
	}
];
