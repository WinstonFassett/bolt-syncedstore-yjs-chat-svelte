import type { MenuItem } from '../../../type.js';

import Grid_2x2Plus from '@lucide/svelte/icons/grid-2x2-plus';
import Hammer from '@lucide/svelte/icons/hammer';
import Grid_2x2X from '@lucide/svelte/icons/grid-2x2-x';
import ArrowLeftFromLine from '@lucide/svelte/icons/arrow-left-from-line';
import ArrowRightFromLine from '@lucide/svelte/icons/arrow-right-from-line';
import BetweenVerticalStart from '@lucide/svelte/icons/between-vertical-start';
import ArrowUpFromLine from '@lucide/svelte/icons/arrow-up-from-line';
import ArrowDownFromLine from '@lucide/svelte/icons/arrow-down-from-line';
import BetweenHorizontalStart from '@lucide/svelte/icons/between-horizontal-start';
import PanelLeft from '@lucide/svelte/icons/panel-left';
import PanelTop from '@lucide/svelte/icons/panel-top';
import RectangleHorizontal from '@lucide/svelte/icons/rectangle-horizontal';
import TableCellsMerge from '@lucide/svelte/icons/table-cells-merge';
import TableCellsSplit from '@lucide/svelte/icons/table-cells-split';
import LayoutPanelTop from '@lucide/svelte/icons/layout-panel-top';
import Columns_2 from '@lucide/svelte/icons/columns-2';

export const tableItems: MenuItem[] = [
	{
		// - insertTable
		icon: Grid_2x2Plus,
		command: (editor) => editor?.chain().focus().insertTable().run(),
		disabled: (editor) => !editor?.can().insertTable()
	},
	{
		// - fixTables
		icon: Hammer,
		command: (editor) => editor?.chain().focus().fixTables().run(),
		disabled: (editor) => !editor?.can().fixTables()
	},
	{
		// - deleteTable
		icon: Grid_2x2X,
		command: (editor) => editor?.chain().focus().deleteTable().run(),
		disabled: (editor) => !editor?.can().deleteTable()
	},

	//

	{
		// - addColumnBefore
		icon: ArrowLeftFromLine,
		command: (editor) => editor?.chain().focus().addColumnBefore().run(),
		disabled: (editor) => !editor?.can().addColumnBefore()
	},
	{
		// - addColumnAfter
		icon: ArrowRightFromLine,
		command: (editor) => editor?.chain().focus().addColumnAfter().run(),
		disabled: (editor) => !editor?.can().addColumnAfter()
	},
	{
		// - deleteColumn
		icon: BetweenVerticalStart,
		command: (editor) => editor?.chain().focus().deleteColumn().run(),
		disabled: (editor) => !editor?.can().deleteColumn()
	},

	//

	{
		// - addRowBefore
		icon: ArrowUpFromLine,
		command: (editor) => editor?.chain().focus().addRowBefore().run(),
		disabled: (editor) => !editor?.can().addRowBefore()
	},
	{
		// - addRowAfter
		icon: ArrowDownFromLine,
		command: (editor) => editor?.chain().focus().addRowAfter().run(),
		disabled: (editor) => !editor?.can().addRowAfter()
	},
	{
		// - deleteRow
		icon: BetweenHorizontalStart,
		command: (editor) => editor?.chain().focus().deleteRow().run(),
		disabled: (editor) => !editor?.can().deleteRow()
	},

	//

	{
		// - toggleHeaderColumn
		icon: PanelLeft,
		command: (editor) => editor?.chain().focus().toggleHeaderColumn().run(),
		disabled: (editor) => !editor?.can().toggleHeaderColumn()
	},
	{
		// - toggleHeaderRow
		icon: PanelTop,
		command: (editor) => editor?.chain().focus().toggleHeaderRow().run(),
		disabled: (editor) => !editor?.can().toggleHeaderRow()
	},
	{
		// - toggleHeaderCell
		icon: RectangleHorizontal,
		command: (editor) => editor?.chain().focus().toggleHeaderCell().run(),
		disabled: (editor) => !editor?.can().toggleHeaderCell()
	},

	//

	{
		// - mergeCells
		icon: TableCellsMerge,
		command: (editor) => editor?.chain().focus().mergeCells().run(),
		disabled: (editor) => !editor?.can().mergeCells()
	},
	{
		// - splitCell
		icon: TableCellsSplit,
		command: (editor) => editor?.chain().focus().splitCell().run(),
		disabled: (editor) => !editor?.can().splitCell()
	},
	{
		// - mergeOrSplit
		icon: LayoutPanelTop,
		command: (editor) => editor?.chain().focus().mergeOrSplit().run(),
		disabled: (editor) => !editor?.can().mergeOrSplit()
	},

	//

	{
		// - setCellAttribute
		icon: Columns_2,
		command: (editor) => editor?.chain().focus().setCellAttribute('colspan', 2).run(),
		disabled: (editor) => !editor?.can().setCellAttribute('colspan', 2)
	}
];
