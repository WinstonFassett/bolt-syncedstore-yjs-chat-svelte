import type { Content, Extensions, JSONContent } from '@tiptap/core';
import { Editor, generateHTML } from '@tiptap/core';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Subscript from '@tiptap/extension-subscript';
import Superscript from '@tiptap/extension-superscript';
import Highlight from '@tiptap/extension-highlight';
import Table from '@tiptap/extension-table';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import TableRow from '@tiptap/extension-table-row';
import Typography from '@tiptap/extension-typography';
import TextAlign from '@tiptap/extension-text-align';
import ListKeymap from '@tiptap/extension-list-keymap';
import TextStyle from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';
import Link from '@tiptap/extension-link';
import ImageResize from 'tiptap-extension-resize-image';
import { FontSize } from './custom-extension/font-size.js';

import { jsonContent } from './content-demo.js';

export const defaultExtensions: Extensions = [
	StarterKit.configure({
		heading: { levels: [1, 2, 3, 4, 5] },
		dropcursor: { width: 8, class: 'text-accent rounded-full' }
	}),
	Underline,
	Subscript,
	Superscript,
	ListKeymap,
	Highlight.configure({ multicolor: true }),
	Typography,
	TextAlign.configure({ types: ['heading', 'paragraph'] }),
	Table.configure({ resizable: true }),
	TableRow,
	TableHeader,
	TableCell,
	TextStyle.configure({ mergeNestedSpanStyles: true }),
	Color,
	Link.configure({
		openOnClick: false,
		autolink: false,
		defaultProtocol: 'https',
		protocols: ['http', 'https']
	}),
	FontSize,
	ImageResize.configure({ allowBase64: true })
];

export function newEditor(params: {
	element?: HTMLElement;
	content?: Content;
	extensions?: Extensions;
	editorClass?: string;
	onTransaction?: () => void;
	onUpdate?: () => void;
}): Editor {
	const { element, content, extensions, editorClass, onTransaction, onUpdate } = params;

	return new Editor({
		element,
		content: content ?? jsonContent,
		extensions: extensions ?? defaultExtensions,
		editorProps: {
			attributes: {
				class: editorClass ?? ''
			}
		},
		onTransaction
		// onUpdate
	});
}

export function jsonToHtml(
	json: JSONContent | undefined,
	extensions?: Extensions
): string | undefined {
	if (json) return generateHTML(json, extensions ?? defaultExtensions);
}
