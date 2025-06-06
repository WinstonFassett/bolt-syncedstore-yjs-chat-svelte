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
		extensions?: ExtensionsType;
		class?: string;
		editorClass?: string;
		defaultToolbar?: boolean;
		header?: Snippet;
		children?: Snippet;
	};

	let {
		editor = $bindable(),
		content,
		extensions,
		class: className,
		editorClass,
		defaultToolbar: defaultToolbar,
		header,
		children
	}: Props = $props();

	const editorBaseClass =
		'flex-1 prose max-w-full h-full p-2 overflow-auto m-2 outline-base-300 focus:outline-4 outline-offset-4';

	let element: HTMLElement;

	onMount(() => {
		const editorInstance = newEditor({
			element,
			content,
			extensions,
			editorClass: cn(editorBaseClass, editorClass),
			onTransaction: () => {
				editor = undefined; // ! force toolbar update
				editor = editorInstance;
			}
		});
		editor = editorInstance;
	});

	onDestroy(() => {
		editor?.destroy();
	});
</script>

<div bind:this={element} class={cn('flex h-full w-full flex-col border', className)}>
	{@render header?.()}

	{#if defaultToolbar}
		<Toolbar {editor} class="border-b" />
	{/if}

	{@render children?.()}
</div>
