import type { MenuItem } from '../../../type.js';

import WrapText from '@lucide/svelte/icons/wrap-text';
import ChevronsLeftRightEllipsis from '@lucide/svelte/icons/chevrons-left-right-ellipsis';

export const breakItems: MenuItem[] = [
	{
		// - setHardBreak
		icon: WrapText,
		command: (editor) => editor?.chain().focus().setHardBreak().run() ?? false,
		disabled: (editor) => !editor?.can().setHardBreak()
	},
	{
		// - setHorizontalRule
		icon: ChevronsLeftRightEllipsis,
		command: (editor) => editor?.chain().focus().setHorizontalRule().run() ?? false,
		disabled: (editor) => !editor?.can().setHorizontalRule()
	}
];
