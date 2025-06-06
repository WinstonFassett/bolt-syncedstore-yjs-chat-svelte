import type { MenuItem } from '../../../type.js';

export const FontSizeItems: MenuItem[] = [
	{
		text: '2.5',
		command: (editor) => editor?.chain().focus().setFontSize('2.5rem').run(),
		disabled: (editor) => !editor?.can().setFontSize('2.5rem'),
		active: (editor) => editor?.isActive('textStyle', { fontSize: '2.5rem' }) ?? false
	},
	{
		text: '2.0',
		command: (editor) => editor?.chain().focus().setFontSize('2.0rem').run(),
		disabled: (editor) => !editor?.can().setFontSize('2rem'),
		active: (editor) => editor?.isActive('textStyle', { fontSize: '2.0rem' }) ?? false
	},
	{
		text: '1.5',
		command: (editor) => editor?.chain().focus().setFontSize('1.5rem').run(),
		disabled: (editor) => !editor?.can().setFontSize('1.5rem'),
		active: (editor) => editor?.isActive('textStyle', { fontSize: '1.5rem' }) ?? false
	},
	{
		text: '1.0',
		command: (editor) => editor?.chain().focus().unsetFontSize().run(),
		disabled: (editor) => !editor?.can().unsetFontSize(),
		active: (editor) => editor?.isActive('textStyle', { fontSize: undefined }) ?? false
	},
	{
		text: '0.7',
		command: (editor) => editor?.chain().focus().setFontSize('0.75rem').run(),
		disabled: (editor) => !editor?.can().setFontSize('0.75rem'),
		active: (editor) => editor?.isActive('textStyle', { fontSize: '0.75rem' }) ?? false
	},
	{
		text: '0.5',
		command: (editor) => editor?.chain().focus().setFontSize('0.5rem').run(),
		disabled: (editor) => !editor?.can().setFontSize('0.5rem'),
		active: (editor) => editor?.isActive('textStyle', { fontSize: '0.5rem' }) ?? false
	}
];
