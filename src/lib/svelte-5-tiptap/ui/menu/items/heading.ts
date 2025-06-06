import type { MenuItem } from '../../../type.js';

import Heading1 from '@lucide/svelte/icons/heading-1';
import Heading2 from '@lucide/svelte/icons/heading-2';
import Heading3 from '@lucide/svelte/icons/heading-3';
import Heading4 from '@lucide/svelte/icons/heading-4';
import Pilcrow from '@lucide/svelte/icons/pilcrow';

export const headingItems: MenuItem[] = [
	{
		// - toggleHeading 1
		icon: Heading1,
		command: (editor) => editor?.chain().focus().setHeading({ level: 1 }).run(),
		disabled: (editor) => !editor?.can().setHeading({ level: 1 }),
		active: (editor) => editor?.isActive('heading', { level: 1 }) ?? false
	},
	{
		// - toggleHeading 2
		icon: Heading2,
		command: (editor) => editor?.chain().focus().setHeading({ level: 2 }).run(),
		disabled: (editor) => !editor?.can().setHeading({ level: 2 }),
		active: (editor) => editor?.isActive('heading', { level: 2 }) ?? false
	},
	{
		// - toggleHeading 3
		icon: Heading3,
		command: (editor) => editor?.chain().focus().setHeading({ level: 3 }).run(),
		disabled: (editor) => !editor?.can().setHeading({ level: 3 }),
		active: (editor) => editor?.isActive('heading', { level: 3 }) ?? false
	},

	//

	{
		// - toggleHeading 4
		icon: Heading4,
		command: (editor) => editor?.chain().focus().setHeading({ level: 4 }).run(),
		disabled: (editor) => !editor?.can().setHeading({ level: 4 }),
		active: (editor) => editor?.isActive('heading', { level: 4 }) ?? false
	},
	{
		// - toggleHeading 5
		icon: Heading4,
		command: (editor) => editor?.chain().focus().setHeading({ level: 5 }).run(),
		disabled: (editor) => !editor?.can().setHeading({ level: 5 }),
		active: (editor) => editor?.isActive('heading', { level: 5 }) ?? false
	},
	{
		// - setParagraph
		icon: Pilcrow,
		command: (editor) => editor?.chain().focus().setParagraph().run(),
		disabled: (editor) => !editor?.can().setParagraph(),
		active: (editor) => editor?.isActive('paragraph') ?? false
	}
];
