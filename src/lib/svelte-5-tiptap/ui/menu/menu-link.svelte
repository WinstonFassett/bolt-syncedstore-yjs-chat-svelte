<script lang="ts">
	import type { EditorType } from '../../type.js';
	import { cn } from '../../core/utils.js';

	import Plus from '@lucide/svelte/icons/plus';
	import Link from '@lucide/svelte/icons/link';
	import Unlink from '@lucide/svelte/icons/unlink';

	type Props = {
		editor: EditorType;
		class?: string;
		btnClass?: string;
		menuClass?: string;
	};
	let { editor, class: className, btnClass, menuClass }: Props = $props();

	const btnBaseClass: string = 'btn btn-square btn-ghost btn-sm';

	let open = $state(false);
	let url = $state<string>();
	let inpElement = $state<HTMLInputElement>();

	function setLink() {
		if (url) {
			editor?.commands.setLink({ href: url ?? '', target: '_blank' });
			url = '';
		}
	}

	function unLink() {
		editor?.commands.unsetLink();
		url = undefined;
		inpElement?.focus();
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
		class={cn(btnBaseClass, btnClass, open && 'btn-active')}><Link /></summary
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
					<span>Link url</span>
					<input
						bind:value={url}
						bind:this={inpElement}
						type="text"
						placeholder="Please input link url"
						class="join-item input input-sm w-full focus:outline-0"
						onkeydown={(e) => e.key === 'Enter' && setLink()}
					/>
				</label>

				<button class="btn join-item btn-square btn-sm p-1.5" onclick={setLink} disabled={!url}>
					<Plus />
				</button>
			</div>

			<button
				class="btn btn-square btn-sm p-1.5"
				onclick={unLink}
				disabled={editor?.getAttributes('link').href === undefined}
			>
				<Unlink />
			</button>
		</div>
	{/if}
</details>
