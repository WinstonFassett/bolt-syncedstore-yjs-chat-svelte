<script lang="ts">
	import { cn } from '../../core/utils.js';

	type Props = {
		class?: string;
	};
	let { class: className }: Props = $props();
</script>

<div class={cn('divider divider-horizontal mx-0 my-1', className)}></div>
