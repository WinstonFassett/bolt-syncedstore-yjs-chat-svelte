<script lang="ts">
  import { onMount } from 'svelte';
  import { Editor } from '@tiptap/core';
  import StarterKit from '@tiptap/starter-kit';

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
          StarterKit,
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
