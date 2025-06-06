<script lang="ts">
	import type { Snippet } from 'svelte';

	import type { EditorType, MenuItem } from '../../type.js';
	import { cn } from '../../core/utils.js';

	const btnBaseClass: string = 'btn btn-ghost btn-sm';
	const activeDefaultClass: string = 'btn-outline border-gray-300';

	type Props = {
		editor: EditorType;
		menuItems: MenuItem[];
		menuIsActive?: boolean;
		class?: string;
		btnClass?: string;
		activeClass?: string;
		menuClass?: string;
		children?: Snippet;
	};
	let {
		editor,
		menuItems,
		menuIsActive,
		class: className,
		btnClass,
		activeClass = activeDefaultClass,
		menuClass,
		children
	}: Props = $props();

	let open = $state(false);

	const onmouseenter = () => (open = true);
	const onmouseleave = () => (open = false);
</script>

<details class={cn('dropdown', className)} bind:open {onmouseenter} {onmouseleave}>
	<summary
		onclick={(e) => e.preventDefault()}
		class={cn(
			btnBaseClass,
			btnClass,
			'btn-square',
			open && 'btn-active',
			menuIsActive && activeClass
		)}
	>
		{@render children?.()}
	</summary>

	{#if open}
		<div
			class={cn(
				'menu menu-horizontal dropdown-content bg-base-100 rounded-box z-1 -mx-2 w-30 gap-1 p-2 shadow-sm',
				menuClass
			)}
		>
			{#each menuItems as item}
				<button
					onclick={() => item.command(editor)}
					disabled={item.disabled(editor)}
					class={cn(
						btnBaseClass,
						btnClass,
						item.icon !== undefined && 'btn-square',
						item.active?.(editor) && activeClass
					)}
				>
					{#if item.icon}<item.icon />{:else}{item.text}{/if}
				</button>
			{/each}
		</div>
	{/if}
</details>
