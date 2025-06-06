export const htmlContent = `
<table>
  <tbody>
    <tr>
      <th>Name</th>
      <th colspan="3">Description</th>
    </tr>
    <tr>
      <td>Cyndi Lauper</td>
      <td>Singer</td>
      <td>Songwriter</td>
      <td>Actress</td>
    </tr>
  </tbody>
</table>
`;

export const jsonContent = {
	type: 'doc',
	content: [
		{
			type: 'paragraph',
			attrs: { textAlign: null },
			content: [{ type: 'text', text: 'Hello World! 🌍️' }]
		},
		{
			type: 'heading',
			attrs: { textAlign: null, level: 2 },
			content: [{ type: 'text', text: 'Hi there,' }]
		},
		{
			type: 'paragraph',
			attrs: { textAlign: null },
			content: [
				{ type: 'text', text: 'this is a ' },
				{ type: 'text', marks: [{ type: 'italic' }], text: 'basic' },
				{ type: 'text', text: ' example of ' },
				{ type: 'text', marks: [{ type: 'bold' }], text: 'Tiptap' },
				{
					type: 'text',
					text: '. Sure, there are all kind of basic text styles you’d probably expect from a text editor. But wait until you see the lists:'
				}
			]
		},
		{
			type: 'bulletList',
			content: [
				{
					type: 'listItem',
					content: [
						{
							type: 'paragraph',
							attrs: { textAlign: null },
							content: [{ type: 'text', text: 'That’s a bullet list with one …' }]
						}
					]
				},
				{
					type: 'listItem',
					content: [
						{
							type: 'paragraph',
							attrs: { textAlign: null },
							content: [{ type: 'text', text: '… or two list items.' }]
						}
					]
				}
			]
		},
		{
			type: 'paragraph',
			attrs: { textAlign: null },
			content: [
				{
					type: 'text',
					text: 'Isn’t that great? And all of that is editable. But wait, there’s more. Let’s try a code block:'
				}
			]
		},
		{
			type: 'paragraph',
			attrs: { textAlign: null },
			content: [
				{
					type: 'text',
					text: 'I know, I know, this is impressive. It’s only the tip of the iceberg though. Give it a try and click a little bit around. Don’t forget to check the other examples too.'
				}
			]
		},
		{
			type: 'blockquote',
			content: [
				{
					type: 'paragraph',
					attrs: { textAlign: null },
					content: [
						{ type: 'text', text: 'Wow, that’s amazing. Good work, boy! 👏 ' },
						{ type: 'hardBreak' },
						{ type: 'text', text: '— Mom' }
					]
				}
			]
		},
		{
			type: 'paragraph',
			attrs: { textAlign: null },
			content: [{ type: 'text', marks: [{ type: 'code' }], text: 'test code' }]
		},
		{
			type: 'table',
			content: [
				{
					type: 'tableRow',
					content: [
						{
							type: 'tableHeader',
							attrs: { colspan: 1, rowspan: 1, colwidth: null },
							content: [
								{
									type: 'paragraph',
									attrs: { textAlign: null },
									content: [{ type: 'text', text: 'Name' }]
								}
							]
						},
						{
							type: 'tableHeader',
							attrs: { colspan: 3, rowspan: 1, colwidth: null },
							content: [
								{
									type: 'paragraph',
									attrs: { textAlign: null },
									content: [{ type: 'text', text: 'Description' }]
								}
							]
						}
					]
				},
				{
					type: 'tableRow',
					content: [
						{
							type: 'tableCell',
							attrs: { colspan: 1, rowspan: 1, colwidth: null },
							content: [
								{
									type: 'paragraph',
									attrs: { textAlign: null },
									content: [{ type: 'text', text: 'Cyndi Lauper' }]
								}
							]
						},
						{
							type: 'tableCell',
							attrs: { colspan: 1, rowspan: 1, colwidth: null },
							content: [
								{
									type: 'paragraph',
									attrs: { textAlign: null },
									content: [{ type: 'text', text: 'Singer' }]
								}
							]
						},
						{
							type: 'tableCell',
							attrs: { colspan: 1, rowspan: 1, colwidth: null },
							content: [
								{
									type: 'paragraph',
									attrs: { textAlign: null },
									content: [{ type: 'text', text: 'Songwriter' }]
								}
							]
						},
						{
							type: 'tableCell',
							attrs: { colspan: 1, rowspan: 1, colwidth: null },
							content: [
								{
									type: 'paragraph',
									attrs: { textAlign: null },
									content: [{ type: 'text', text: 'Actress' }]
								}
							]
						}
					]
				}
			]
		},
		{ type: 'image', attrs: { src: 'https://placehold.co/800x400', alt: null, title: null } },
		{
			type: 'image',
			attrs: { src: 'https://placehold.co/800x400/6A00F5/white', alt: null, title: null }
		}
	]
};
