<script lang="ts">
	import type { EditorType } from '../../type.js';
	import { cn } from '../../core/utils.js';

	import Image from '@lucide/svelte/icons/image';
	import Plus from '@lucide/svelte/icons/plus';

	type Props = {
		editor: EditorType;
		class?: string;
		btnClass?: string;
		menuClass?: string;
	};
	let { editor, class: className, btnClass, menuClass }: Props = $props();

	let open = $state(false);
	let url = $state<string>();
	let inpElement = $state<HTMLInputElement>();

	const btnBaseClass: string = 'btn btn-square btn-ghost btn-sm';

	function setLink() {
		if (url) {
			editor?.chain().focus().setImage({ src: url }).run();
			url = '';
		}
	}
</script>

<details
	class={cn('dropdown', className)}
	bind:open
	onmouseenter={() => {
		open = true;
		url = editor?.getAttributes('link').href;
		setTimeout(() => {
			inpElement?.focus();
		}, 1500);
	}}
	onmouseleave={() => (open = false)}
>
	<summary
		onclick={(e) => {
			e.preventDefault();
		}}
		class={cn(btnBaseClass, btnClass, open && 'btn-active')}><Image /></summary
	>
	{#if open}
		<div
			class={cn(
				'menu menu-horizontal dropdown-content bg-base-100 rounded-box z-1 -mx-2 gap-1 px-2 py-4 shadow-sm',
				menuClass
			)}
		>
			<div class="join max-w-80 min-w-50 flex-1">
				<label class="label join-item floating-label w-full">
					<span>Image url</span>
					<input
						bind:value={url}
						bind:this={inpElement}
						type="text"
						placeholder="Please input image url"
						class="join-item input input-sm w-full focus:outline-0"
						onkeydown={(e) => e.key === 'Enter' && setLink()}
					/>
				</label>

				<button class="btn join-item btn-square btn-sm p-1.5" onclick={setLink} disabled={!url}>
					<Plus />
				</button>
			</div>
		</div>
	{/if}
</details>
