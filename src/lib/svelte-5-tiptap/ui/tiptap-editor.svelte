<script lang="ts">
	import '../core/editor.css';

	import { onMount, onDestroy, type Snippet } from 'svelte';
	import { newEditor } from '../core/editor.js';
	import { cn } from '../core/utils.js';

	import type { EditorType, ContentType, ExtensionsType } from '../type.js';
	import Toolbar from './toolbar.svelte';

	type Props = {
		editor: EditorType;
		content?: ContentType;
		extensions?: ExtensionsType | undefined;
		class?: string;
		editorClass?: string;
		defaultToolbar?: boolean;
		header?: Snippet;
		children?: Snippet;
		readOnly?: boolean;
		autoFocus?: boolean;
		placeholder?: string;
	};

	let {
		editor = $bindable(),
		content,
		extensions,
		class: className,
		editorClass,
		defaultToolbar: defaultToolbar,
		header,
		children,
		readOnly,
		autoFocus,
		placeholder
	}: Props = $props();

	const editorBaseClass = 'flex-1 prose prose-sm dark:prose-invert max-w-none focus:outline-none';

	let element: HTMLElement;

	onMount(() => {
		const editorInstance = newEditor({
			element,
			content,
			extensions: extensions ? [...extensions] : undefined,
			editorClass: cn(editorBaseClass, editorClass),
			onTransaction: () => {
				editor = undefined; // ! force toolbar update
				editor = editorInstance;
			}
		});
		if (readOnly) {
			editorInstance.setEditable(false);
		}
		if (autoFocus) {
			editorInstance.commands.focus();
		}
		editor = editorInstance;
	});

	onDestroy(() => {
		editor?.destroy();
	});
</script>

<div bind:this={element} class={cn('flex', className)}>
	{@render header?.()}

	{#if defaultToolbar}
		<Toolbar {editor} class="border-b" />
	{/if}

	{@render children?.()}
</div>
