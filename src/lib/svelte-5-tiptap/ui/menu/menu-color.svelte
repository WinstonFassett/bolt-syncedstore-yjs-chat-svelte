<script lang="ts">
	import { type Snippet } from 'svelte';

	import type { EditorType } from '../../type.js';
	import { cn } from '../../core/utils.js';

	type Props = {
		editor: EditorType;
		colors: string[];
		menuIsActive?: boolean;
		class?: string;
		btnClass?: string;
		activeClass?: string;
		menuClass?: string;
		isHighlight?: boolean;
		children?: Snippet;
	};
	let {
		editor,
		colors,
		menuIsActive,
		class: className,
		btnClass,
		activeClass = 'btn-outline border-gray-300',
		menuClass,
		isHighlight,
		children
	}: Props = $props();

	const unsetColor = isHighlight
		? () => editor?.chain().focus().unsetHighlight().run() ?? false
		: () => editor?.chain().focus().unsetColor().run() ?? false;

	const cannotUnsetColor = isHighlight
		? () => !editor?.can().toggleHighlight()
		: () => !editor?.can().unsetColor();

	//
	const markName = isHighlight ? 'highlight' : 'textStyle';
	const setColor = isHighlight
		? (color: string) => editor?.chain().focus().toggleHighlight({ color }).run() ?? false
		: (color: string) => editor?.chain().focus().setColor(color).run() ?? false;

	const cannotSetColor = isHighlight
		? () => !editor?.can().toggleHighlight()
		: (color: string) => !editor?.can().setColor(color);

	//
	const btnBaseClass: string = 'btn btn-square btn-ghost btn-sm';

	let open = $state(false);

	const onmouseenter = () => (open = true);
	const onmouseleave = () => (open = false);
</script>

<details class={cn('dropdown', className)} bind:open {onmouseenter} {onmouseleave}>
	<summary
		onclick={(e) => e.preventDefault()}
		class={cn(btnBaseClass, btnClass, open && 'btn-active', menuIsActive && activeClass)}
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
			<button
				class={cn(btnBaseClass, btnClass)}
				onclick={() => unsetColor()}
				disabled={cannotUnsetColor()}
			>
				<div class="border-base-content size-4 border-2 text-current/0">.</div>
			</button>

			{#each colors as color}
				<button
					class={cn(btnBaseClass, btnClass, editor?.isActive(markName, { color }) && activeClass)}
					onclick={() => setColor(color)}
					disabled={cannotSetColor(color)}
				>
					<div class="size-4 text-current/0" style:background={color}>.</div>
				</button>
			{/each}
		</div>
	{/if}
</details>
