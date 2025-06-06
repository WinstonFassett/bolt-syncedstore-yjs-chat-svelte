<script lang="ts">
  import { onMount } from 'svelte';
  import { Editor } from '@tiptap/core';
  import StarterKit from '@tiptap/starter-kit';

  export let content = '';
  export const readOnly = true; // Always read-only for this component
  export let className = '';

  let editor: Editor | null = null;
  let editorElement: HTMLDivElement;

  onMount(() => {
    if (!content) return;

    editor = new Editor({
      element: editorElement,
      extensions: [
        StarterKit,
      ],
      content,
      editable: false, // Always read-only for display
      editorProps: {
        attributes: {
          class: 'prose prose-sm dark:prose-invert max-w-none focus:outline-none',
        },
      },
    });

    return () => {
      if (editor) {
        editor.destroy();
      }
    };
  });

  // Update content when the prop changes
  $: if (editor && content !== editor.getHTML()) {
    editor.commands.setContent(content);
  }
</script>

<div bind:this={editorElement} class={className}>
  <!-- Editor content will be rendered here -->
</div>

<style>
  /* Reuse styles from RichTextEditor */
  .ProseMirror {
    padding: 0;
  }

  .ProseMirror p {
    margin: 0.25rem 0;
  }

  .ProseMirror ul, .ProseMirror ol {
    padding: 0 1rem;
    margin: 0.25rem 0;
  }

  .ProseMirror pre {
    margin: 0.5rem 0;
  }

  .ProseMirror img {
    max-width: 100%;
    height: auto;
    border-radius: 0.375rem;
  }

  .ProseMirror blockquote {
    margin: 0.5rem 0;
    padding-left: 1rem;
    border-left: 2px solid #e5e7eb;
  }

  .dark .ProseMirror blockquote {
    border-left-color: #4b5563;
  }

  /* Make sure links are visible */
  .ProseMirror a {
    color: #3b82f6;
    text-decoration: underline;
  }

  .dark .ProseMirror a {
    color: #60a5fa;
  }

  /* Ensure code blocks are properly styled */
  .ProseMirror pre {
    background: #f3f4f6;
    border-radius: 0.375rem;
    padding: 0.75rem;
    overflow-x: auto;
  }

  .dark .ProseMirror pre {
    background: #1f2937;
  }

  .ProseMirror code {
    background: #f3f4f6;
    border-radius: 0.25rem;
    padding: 0.2rem 0.4rem;
    font-size: 0.9em;
  }

  .dark .ProseMirror code {
    background: #1f2937;
  }

  /* Improve list styling */
  .ProseMirror ul > li {
    list-style-type: disc;
  }

  .ProseMirror ol > li {
    list-style-type: decimal;
  }

  /* Ensure proper spacing for nested lists */
  .ProseMirror ul ul,
  .ProseMirror ol ul {
    margin: 0;
  }

  .ProseMirror ol ol,
  .ProseMirror ul ol {
    margin: 0;
  }
</style>
