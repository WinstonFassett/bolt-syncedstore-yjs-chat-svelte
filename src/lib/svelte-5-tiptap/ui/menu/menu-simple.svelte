<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { MenuItem, EditorType } from '../../type.js';
	import { cn } from '../../core/utils.js';

	type Props = {
		editor: EditorType;
		menuItems: MenuItem[];
		class?: string;
		btnClass?: string;
		activeClass?: string;
		children?: Snippet;
	};
	let {
		menuItems,
		class: className,
		btnClass,
		activeClass = 'btn-outline border-gray-300',
		editor,
		children
	}: Props = $props();

	const btnBaseClass: string = 'btn btn-square btn-ghost btn-sm';
</script>

<div class={cn('flex gap-1', className)}>
	<!-- - item buttons - -->

	{#each menuItems as o}
		<button
			class={cn(btnBaseClass, btnClass, o.active?.(editor) && activeClass)}
			onclick={() => o.command(editor)}
			disabled={o.disabled(editor)}
		>
			<o.icon />
		</button>
	{/each}

	{@render children?.()}
</div>
