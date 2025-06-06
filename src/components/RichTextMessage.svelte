<script lang="ts">
  import { onMount } from 'svelte';
  import { Editor } from '@tiptap/core';
  // import StarterKit from '@tiptap/starter-kit'; // We'll list extensions explicitly
  import Document from '@tiptap/extension-document';
  import Paragraph from '@tiptap/extension-paragraph';
  import Text from '@tiptap/extension-text';
  import Link from '@tiptap/extension-link';
  import Bold from '@tiptap/extension-bold';
  import Italic from '@tiptap/extension-italic';
  import Strike from '@tiptap/extension-strike';
  import Code from '@tiptap/extension-code';
  import Heading from '@tiptap/extension-heading';
  import BulletList from '@tiptap/extension-bullet-list';
  import OrderedList from '@tiptap/extension-ordered-list';
  import ListItem from '@tiptap/extension-list-item';
  import Blockquote from '@tiptap/extension-blockquote';
  import CodeBlock from '@tiptap/extension-code-block';
  import HorizontalRule from '@tiptap/extension-horizontal-rule';
  import Image from '@tiptap/extension-image';

  export let content: string | Record<string, any> = '';
  export const readOnly = true; // Always read-only for this component
  export let className = '';

  let editor: Editor | null = null;
  let editorElement: HTMLDivElement;

  onMount(() => {
    if (!content) return;

    try {
      // Parse content if it's a JSON string
      const parsedContent = typeof content === 'string' ? 
        (content.trim().startsWith('{') ? JSON.parse(content) : content) : 
        content;

      editor = new Editor({
        element: editorElement,
        extensions: [
          Document,
          Paragraph,
          Text,
          Bold,
          Italic,
          Strike,
          Code,
          Heading.configure({ levels: [1, 2, 3] }),
          BulletList,
          OrderedList,
          ListItem,
          Blockquote,
          CodeBlock,
          HorizontalRule,
          Link.configure({
            openOnClick: true,
            autolink: true,
            HTMLAttributes: {
              class: 'text-primary-600 dark:text-primary-400 hover:underline',
              rel: 'noopener noreferrer nofollow',
              target: '_blank',
            },
          }),
          Image.configure({
            inline: false,
            allowBase64: true,
            HTMLAttributes: {
              class: 'max-w-full h-auto rounded-md border border-gray-200 dark:border-gray-700 my-2',
            },
          }),
        ],
        content: parsedContent,
        editable: false, // Always read-only for display
        editorProps: {
          attributes: {
            class: 'prose prose-sm dark:prose-invert max-w-none focus:outline-none',
          },
        },
      });
    } catch (e) {
      console.error('Error initializing editor:', e);
    }

    return () => {
      if (editor) {
        editor.destroy();
      }
    };
  });

  // Update content when the prop changes
  $: if (editor && content) {
    try {
      const currentContent = JSON.stringify(editor.getJSON());
      const newContent = typeof content === 'string' ? 
        (content.trim().startsWith('{') ? content : JSON.stringify(content)) : 
        JSON.stringify(content);
      
      if (currentContent !== newContent) {
        const parsedContent = typeof content === 'string' && content.trim().startsWith('{') ? 
          JSON.parse(content) : content;
        editor.commands.setContent(parsedContent);
      }
    } catch (e) {
      console.error('Error updating content:', e);
      editor.commands.setContent(content);
    }
  }
</script>

<div bind:this={editorElement} class={className}>
  <!-- Editor content will be rendered here -->
</div>

<style>
  /* Let Tailwind's @tailwindcss/typography handle all the styling */
  .ProseMirror {
    padding: 0;
  }
</style>
