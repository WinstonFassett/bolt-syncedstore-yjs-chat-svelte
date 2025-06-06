<script lang="ts">
	import { type Snippet } from 'svelte';
	import { cn } from '../core/utils.js';

	import type { EditorType } from '../type.js';

	import MenuSimple from './menu/menu-simple.svelte';
	import MenuDropDown from './menu/menu-dropdown.svelte';
	import MenuColor from './menu/menu-color.svelte';
	import MenuDivider from './menu/menu-divider.svelte';
	import MenuLink from './menu/menu-link.svelte';
	import MenuImage from './menu/menu-image.svelte';

	import { headingItems } from './menu/items/heading.js';
	import { listItems } from './menu/items/list.js';
	import { FontSizeItems } from './menu/items/size.js';
	import { alignItems } from './menu/items/align.js';
	import { markItems } from './menu/items/mark.js';
	import { colorItems } from './menu/items/color.js';
	import { highlightItems } from './menu/items/highlight.js';
	import { tableItems } from './menu/items/table.js';
	import { breakItems } from './menu/items/break.js';
	import { undoItems } from './menu/items/undo.js';
	import { miscItems } from './menu/items/misc.js';

	import Heading1 from '@lucide/svelte/icons/heading-1';
	import Heading2 from '@lucide/svelte/icons/heading-2';
	import Heading3 from '@lucide/svelte/icons/heading-3';
	import Heading4 from '@lucide/svelte/icons/heading-4';
	import Heading5 from '@lucide/svelte/icons/heading-5';
	import Pilcrow from '@lucide/svelte/icons/pilcrow';

	import AlignCenter from '@lucide/svelte/icons/align-center';
	import AlignRight from '@lucide/svelte/icons/align-right';
	import AlignJustify from '@lucide/svelte/icons/align-justify';
	import AlignLeft from '@lucide/svelte/icons/align-left';

	import List from '@lucide/svelte/icons/list';
	import ListOrdered from '@lucide/svelte/icons/list-ordered';
	import ListTree from '@lucide/svelte/icons/list-tree';

	import Type from '@lucide/svelte/icons/type';
	import Pen from '@lucide/svelte/icons/pen';
	import Highlighter from '@lucide/svelte/icons/highlighter';

	import Table2 from '@lucide/svelte/icons/table-2';

	import ALargeSmall from '@lucide/svelte/icons/a-large-small';

	type Props = {
		editor: EditorType;
		class?: string;
		btnClass?: string;
		activeClass?: string;
		children?: Snippet;
	};

	let { class: className, btnClass, activeClass, editor, children }: Props = $props();
</script>

<div
	id="toolbar"
	class={cn('flex w-full flex-wrap items-center gap-x-1 gap-y-2 px-4 py-1', className)}
>
	<MenuDropDown {editor} menuItems={headingItems} {btnClass} {activeClass}>
		{#if editor?.isActive('heading', { level: 1 })}
			<Heading1 />
		{:else if editor?.isActive('heading', { level: 2 })}
			<Heading2 />
		{:else if editor?.isActive('heading', { level: 3 })}
			<Heading3 />
		{:else if editor?.isActive('heading', { level: 4 })}
			<Heading4 />
		{:else if editor?.isActive('heading', { level: 5 })}
			<Heading5 />
		{:else}
			<Pilcrow />
		{/if}
	</MenuDropDown>

	<MenuDropDown {editor} menuItems={alignItems} {btnClass} {activeClass}>
		{#if editor?.isActive({ textAlign: 'center' })}
			<AlignCenter />
		{:else if editor?.isActive({ textAlign: 'right' })}
			<AlignRight />
		{:else if editor?.isActive({ textAlign: 'justify' })}
			<AlignJustify />
		{:else}
			<AlignLeft />
		{/if}
	</MenuDropDown>

	<MenuDropDown {editor} menuItems={FontSizeItems} {btnClass} {activeClass}>
		{#if editor?.isActive('textStyle', { fontSize: '2.5rem' })}
			2.5
		{:else if editor?.isActive('textStyle', { fontSize: '2.0rem' })}
			2.0
		{:else if editor?.isActive('textStyle', { fontSize: '1.5rem' })}
			1.5
		{:else if editor?.isActive('textStyle', { fontSize: '0.75rem' })}
			0.7
		{:else if editor?.isActive('textStyle', { fontSize: '0.5rem' })}
			0.5
		{:else}
			<ALargeSmall />
		{/if}
	</MenuDropDown>

	<MenuDivider />

	<MenuDropDown {editor} menuItems={markItems} {btnClass} {activeClass}>
		<Type />
	</MenuDropDown>

	<MenuColor {editor} colors={colorItems} {btnClass} {activeClass}>
		<Pen />
	</MenuColor>

	<MenuColor {editor} colors={highlightItems} {btnClass} {activeClass} isHighlight={true}>
		<Highlighter />
	</MenuColor>

	<MenuDivider />

	<MenuDropDown {editor} menuItems={listItems} {btnClass} {activeClass}>
		{#if editor?.isActive('bulletList')}
			<List />
		{:else if editor?.isActive('orderedList')}
			<ListOrdered />
		{:else}
			<ListTree />
		{/if}
	</MenuDropDown>

	<MenuDropDown {editor} menuItems={tableItems} {btnClass} {activeClass}>
		<Table2 />
	</MenuDropDown>

	<MenuDivider />

	<MenuSimple {editor} menuItems={breakItems} {btnClass} {activeClass} />

	<MenuSimple {editor} menuItems={miscItems} {btnClass} {activeClass} />

	<MenuDivider />

	<MenuLink {editor} {btnClass} />

	<MenuImage {editor} {btnClass} />

	<MenuDivider />

	<div class="flex-1">{@render children?.()}</div>

	<MenuSimple {editor} menuItems={undoItems} {btnClass} {activeClass} />
</div>
