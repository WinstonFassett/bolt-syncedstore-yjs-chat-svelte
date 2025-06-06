import type { Icon } from '@lucide/svelte';
import type { Content, Editor, Extensions } from '@tiptap/core';

export type EditorType = Editor | undefined;
export type ContentType = Content | undefined;
export type ExtensionsType = Extensions | undefined;

export type MenuItem = {
	text?: string;
	icon?: typeof Icon;
	command: (editor: EditorType) => void;
	disabled: (editor: EditorType) => boolean;
	active?: (editor: EditorType) => boolean;
};
