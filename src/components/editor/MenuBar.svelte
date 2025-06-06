<script lang="ts">
    import type { Editor } from '@tiptap/core';
  import { 
    Bold, Italic, Strikethrough, Code,
    Heading1, Heading2, Heading3,
    List, ListOrdered, Quote, Code2, Minus,
    Link2, Image as ImageIcon, AtSign, SmilePlus
  } from 'lucide-svelte';

  export let editor: Editor;

  // Check if the current node is a code block
  $: isCodeBlock = editor?.isActive('codeBlock');

  // Add link
  function setLink() {
    const previousUrl = editor?.getAttributes('link').href;
    const url = window.prompt('URL', previousUrl || 'https://');
    
    if (url === null) return;
    if (url === '') {
      editor?.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }
    
    editor?.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  }

  // Add image
  function addImage() {
    const url = window.prompt('Enter the URL of the image:');
    if (url) {
      editor?.chain().focus().setImage({ src: url }).run();
    }
  }

  interface MenuItem {
    type: 'button' | 'divider';
    icon?: any; // Lucide component
    title?: string;
    action?: () => void;
    isActive?: () => boolean;
  }

  const menuItems: MenuItem[] = [
    {
      type: 'button',
      icon: Bold,
      title: 'Bold (Ctrl+B)',
      action: () => editor.chain().focus().toggleBold().run(),
      isActive: () => editor.isActive('bold')
    },
    {
      type: 'button',
      icon: Italic,
      title: 'Italic (Ctrl+I)',
      action: () => editor.chain().focus().toggleItalic().run(),
      isActive: () => editor.isActive('italic')
    },
    {
      type: 'button',
      icon: Strikethrough,
      title: 'Strikethrough',
      action: () => editor.chain().focus().toggleStrike().run(),
      isActive: () => editor.isActive('strike')
    },
    {
      type: 'button',
      icon: Code,
      title: 'Code (Ctrl+E)',
      action: () => editor.chain().focus().toggleCode().run(),
      isActive: () => editor.isActive('code')
    },
    { type: 'divider' },
    {
      type: 'button',
      icon: Heading1,
      title: 'Heading 1',
      action: () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
      isActive: () => editor.isActive('heading', { level: 1 })
    },
    {
      type: 'button',
      icon: Heading2,
      title: 'Heading 2',
      action: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
      isActive: () => editor.isActive('heading', { level: 2 })
    },
    {
      type: 'button',
      icon: Heading3,
      title: 'Heading 3',
      action: () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
      isActive: () => editor.isActive('heading', { level: 3 })
    },
    { type: 'divider' },
    {
      type: 'button',
      icon: List,
      title: 'Bullet List',
      action: () => editor.chain().focus().toggleBulletList().run(),
      isActive: () => editor.isActive('bulletList')
    },
    {
      type: 'button',
      icon: ListOrdered,
      title: 'Ordered List',
      action: () => editor.chain().focus().toggleOrderedList().run(),
      isActive: () => editor.isActive('orderedList')
    },
    { type: 'divider' },
    {
      type: 'button',
      icon: Quote,
      title: 'Blockquote',
      action: () => editor.chain().focus().toggleBlockquote().run(),
      isActive: () => editor.isActive('blockquote')
    },
    {
      type: 'button',
      icon: Code2,
      title: 'Code Block',
      action: () => editor.chain().focus().toggleCodeBlock().run(),
      isActive: () => editor.isActive('codeBlock')
    },
    {
      type: 'button',
      icon: Minus,
      title: 'Horizontal Rule',
      action: () => editor.chain().focus().setHorizontalRule().run()
    },
    { type: 'divider' },
    {
      type: 'button',
      icon: Link2,
      title: 'Add Link (Ctrl+K)',
      action: setLink,
      isActive: () => editor.isActive('link')
    },
    {
      type: 'button',
      icon: ImageIcon,
      title: 'Add Image',
      action: addImage
    },
    {
      type: 'button',
      icon: AtSign,
      title: 'Mention',
      action: () => editor.chain().focus().insertContent('@').run() // Simple mention trigger
    },
    {
      type: 'button',
      icon: SmilePlus,
      title: 'Insert Emoji',
      action: () => editor.chain().focus().insertContent(':smile:').run() // Placeholder for emoji
    }
  ];

  const bubbleMenuItems: MenuItem[] = [
    {
      type: 'button',
      icon: Bold,
      title: 'Bold',
      action: () => editor.chain().focus().toggleBold().run(),
      isActive: () => editor.isActive('bold')
    },
    {
      type: 'button',
      icon: Italic,
      title: 'Italic',
      action: () => editor.chain().focus().toggleItalic().run(),
      isActive: () => editor.isActive('italic')
    },
    {
      type: 'button',
      icon: Link2,
      title: 'Link',
      action: setLink,
      isActive: () => editor.isActive('link')
    }
  ];
</script>

{#if editor}
  <div class="flex flex-wrap gap-1 p-1 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 rounded-t-lg">
    {#each menuItems as item}
      {#if item.type === 'button'}
        <button
          class="p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700 {item.isActive && item.isActive() ? 'text-primary-600 dark:text-primary-400' : 'text-gray-700 dark:text-gray-300'}"
          on:click={item.action}
          title={item.title}
          disabled={isCodeBlock && item.title !== 'Code Block'} 
        >
          <svelte:component this={item.icon} size={18} />
        </button>
      {:else if item.type === 'divider'}
        <div class="h-6 w-px bg-gray-300 dark:bg-gray-600 mx-1 self-center"></div>
      {/if}
    {/each}
  </div>

  <!-- Bubble Menu Structure (initially hidden, controlled by TipTap BubbleMenu extension) -->
  {#if !isCodeBlock}
    <div 
      id="tiptap-bubble-menu-content"
      class="flex gap-1 p-1 bg-white dark:bg-gray-800 rounded shadow-lg border border-gray-200 dark:border-gray-700"
      style="display: none;" 
    >
      {#each bubbleMenuItems as item}
        <button
          class="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-700 {item.isActive && item.isActive() ? 'text-primary-600 dark:text-primary-400' : 'text-gray-700 dark:text-gray-300'}"
          on:click={item.action}
          title={item.title}
        >
          <svelte:component this={item.icon} size={18} />
        </button>
      {/each}
    </div>
  {/if}
{/if}
