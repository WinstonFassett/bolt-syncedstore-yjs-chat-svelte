import type { MenuItem } from '../../../type.js';

import Bold from '@lucide/svelte/icons/bold';
import Italic from '@lucide/svelte/icons/italic';
import Underline from '@lucide/svelte/icons/underline';
import Strikethrough from '@lucide/svelte/icons/strikethrough';
import Subscript from '@lucide/svelte/icons/subscript';
import Superscript from '@lucide/svelte/icons/superscript';
import SquareCode from '@lucide/svelte/icons/square-code';

export const markItems: MenuItem[] = [
	{
		// - toggleBold
		icon: Bold,
		command: (editor) => editor?.chain().focus().toggleBold().run(),
		disabled: (editor) => !editor?.can().toggleBold(),
		active: (editor) => editor?.isActive('bold') ?? false
	},
	{
		// - toggleItalic
		icon: Italic,
		command: (editor) => editor?.chain().focus().toggleItalic().run(),
		disabled: (editor) => !editor?.can().toggleItalic(),
		active: (editor) => editor?.isActive('italic') ?? false
	},
	{
		// - toggleUnderline
		icon: Underline,
		command: (editor) => editor?.chain().focus().toggleUnderline().run(),
		disabled: (editor) => !editor?.can().toggleUnderline(),
		active: (editor) => editor?.isActive('underline') ?? false
	},

	//

	{
		// - toggleStrike
		icon: Strikethrough,
		command: (editor) => editor?.chain().focus().toggleStrike().run(),
		disabled: (editor) => !editor?.can().toggleStrike(),
		active: (editor) => editor?.isActive('strike') ?? false
	},
	{
		// - toggleSubscript
		icon: Subscript,
		command: (editor) => editor?.chain().focus().toggleSubscript().run(),
		disabled: (editor) => !editor?.can().toggleSubscript(),
		active: (editor) => editor?.isActive('subscript') ?? false
	},
	{
		// - toggleSuperscript
		icon: Superscript,
		command: (editor) => editor?.chain().focus().toggleSuperscript().run(),
		disabled: (editor) => !editor?.can().toggleSuperscript(),
		active: (editor) => editor?.isActive('superscript') ?? false
	},

	//

	{
		// - toggleCode
		icon: SquareCode,
		command: (editor) => editor?.chain().focus().toggleCode().run(),
		disabled: (editor) => !editor?.can().toggleCode(),
		active: (editor) => editor?.isActive('code') ?? false
	}
];
