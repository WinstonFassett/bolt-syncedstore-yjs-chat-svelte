import type { MenuItem } from '../../../type.js';

// import Quote from '@lucide/svelte/icons/quote';
import List from '@lucide/svelte/icons/list';
import ListOrdered from '@lucide/svelte/icons/list-ordered';
import ListPlus from '@lucide/svelte/icons/list-plus';
import ListTree from '@lucide/svelte/icons/list-tree';
import ListRestart from '@lucide/svelte/icons/list-restart';
import type { Editor } from '@tiptap/core';

export const listItems: MenuItem[] = [
	// {
	// 	// - toggleBlockquote
	// 	icon: Quote,
	// 	command: (editor) => editor?.chain().focus().toggleBlockquote().run(),
	// 	disabled: (editor) => !editor?.can().setBlockquote(),
	// 	active: (editor) => editor?.isActive('blockquote') ?? false
	// },
	{
		// - toggleBulletList
		icon: List,
		command: (editor) => editor?.chain().focus().toggleBulletList().run(),
		disabled: (editor) => !editor?.can().toggleBulletList(),
		active: (editor) => editor?.isActive('bulletList') ?? false
	},
	{
		// - toggleOrderedList
		icon: ListOrdered,
		command: (editor) => editor?.chain().focus().toggleOrderedList().run(),
		disabled: (editor) => !editor?.can().toggleOrderedList(),
		active: (editor) => editor?.isActive('orderedList') ?? false
	},

	//

	{
		// - splitListItem
		icon: ListPlus,
		command: (editor) => editor?.chain().focus().splitListItem('listItem').run(),
		disabled: (editor) => !editor?.can().splitListItem('listItem')
	},
	{
		// - sinkListItem
		icon: ListTree,
		command: (editor) => editor?.chain().focus().sinkListItem('listItem').run(),
		disabled: (editor) => !editor?.can().sinkListItem('listItem')
	},
	{
		// - liftListItem
		icon: ListRestart,
		command: (editor) => editor?.chain().focus().liftListItem('listItem').run(),
		disabled: (editor) => !editor?.can().liftListItem('listItem')
	}
];
