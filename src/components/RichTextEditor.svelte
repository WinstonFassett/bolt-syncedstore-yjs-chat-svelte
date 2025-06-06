<script context="module" lang="ts">
  export interface EditorInstance {
    clear: () => void;
    focus: () => void;
    getHTML: () => string;
    getText: () => string;
    $set: (props: { content?: string }) => void;
  }
</script>

<script lang="ts">
  import { onMount } from 'svelte';
  import { Editor } from '@tiptap/core';
  import StarterKit from '@tiptap/starter-kit';
  import { get, writable } from 'svelte/store';
  
  // Re-export the interface for convenience
  export type { EditorInstance };

  export let content = '';
  export let placeholder = 'Write something...';
  export let onUpdate: (html: string, text: string) => void = () => {};
  export let readOnly = false;
  export let autoFocus = false;

  let editor: Editor | null = null;
  let editorElement: HTMLDivElement;

  // Create a store for the editor instance
  const editorStore = writable<Editor | null>(null);

  // Initialize the editor
  onMount(() => {
    editor = new Editor({
      element: editorElement,
      extensions: [
        StarterKit,
      ],
      content,
      editable: !readOnly,
      autofocus: autoFocus ? 'end' : false,
      onUpdate: ({ editor }) => {
        const html = editor.getHTML();
        const text = editor.getText();
        onUpdate(html, text);
      },
      editorProps: {
        attributes: {
          class: 'prose prose-sm dark:prose-invert max-w-none focus:outline-none p-2 min-h-[100px]',
        },
      },
    });

    editorStore.set(editor);

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

  // Toggle read-only mode
  $: if (editor) {
    editor.setEditable(!readOnly);
  }

  // Expose editor methods
  function clear() {
    if (editor) {
      editor.commands.clearContent();
    }
  }

  function focus() {
    if (editor) {
      editor.commands.focus();
    }
  }

  function getHTML() {
    return editor ? editor.getHTML() : '';
  }

  function getText() {
    return editor ? editor.getText() : '';
  }

  // Expose methods
  export { clear, focus, getHTML, getText };
</script>

<div class="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
  <div bind:this={editorElement} class="min-h-[100px] overflow-y-auto">
    <!-- Editor content will be rendered here -->
  </div>
</div>

<style>
  /* Basic editor styles */
  .ProseMirror {
    min-height: 100px;
    padding: 0.5rem;
  }

  .ProseMirror:focus {
    outline: none;
  }

  .ProseMirror p.is-editor-empty:first-child::before {
    color: #9ca3af;
    content: attr(data-placeholder);
    float: left;
    height: 0;
    pointer-events: none;
  }

  /* Basic typography */
  .ProseMirror h1 {
    font-size: 1.5rem;
    font-weight: 600;
    margin: 1rem 0;
  }

  .ProseMirror h2 {
    font-size: 1.25rem;
    font-weight: 600;
    margin: 0.75rem 0;
  }

  .ProseMirror h3 {
    font-size: 1.125rem;
    font-weight: 600;
    margin: 0.5rem 0;
  }

  .ProseMirror p {
    margin: 0.5rem 0;
  }

  .ProseMirror ul, .ProseMirror ol {
    padding: 0 1rem;
    margin: 0.5rem 0;
  }

  .ProseMirror code {
    background-color: rgba(97, 97, 97, 0.1);
    border-radius: 0.25rem;
    font-size: 0.9em;
    padding: 0.2em 0.4em;
  }

  .ProseMirror pre {
    background: #0d0d0d;
    border-radius: 0.5rem;
    color: #fff;
    font-family: 'JetBrainsMono', monospace;
    padding: 0.75rem 1rem;
  }

  .ProseMirror pre code {
    background: none;
    color: inherit;
    font-size: 0.8rem;
    padding: 0;
  }

  .ProseMirror img {
    height: auto;
    max-width: 100%;
  }

  .ProseMirror blockquote {
    border-left: 3px solid #999999;
    padding-left: 1rem;
    margin: 0.5rem 0;
  }

  .ProseMirror hr {
    border: none;
    border-top: 2px solid #e5e7eb;
    margin: 1rem 0;
  }

  /* Dark mode styles */
  .dark .ProseMirror {
    color: #e5e7eb;
  }

  .dark .ProseMirror pre {
    background: #1e1e1e;
  }

  .dark .ProseMirror blockquote {
    border-left-color: #4b5563;
  }

  .dark .ProseMirror hr {
    border-top-color: #4b5563;
  }
</style>
