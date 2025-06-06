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
  import { onMount, onDestroy } from 'svelte';
  import { Editor } from '@tiptap/core';
  import StarterKit from '@tiptap/starter-kit';
  import { writable } from 'svelte/store';
  
  // Re-export the interface for convenience
  export type { EditorInstance };

  export let content: Record<string, any> | string = '';
  export let onUpdate: (json: Record<string, any>, text: string) => void = () => {};
  export let onKeyDown: (event: KeyboardEvent) => void = () => {};
  export let autoFocus = false;
  export let readOnly = false;
  export let className = '';
  export let placeholder = '';

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
      content: typeof content === 'string' ? content : content,
      editable: !readOnly,
      autofocus: autoFocus ? 'end' : false,
      editorProps: {
        attributes: {
          class: `prose dark:prose-invert max-w-none p-2 min-h-[100px] ${className}`,
          'data-placeholder': placeholder || 'Type something...',
        },
        handleKeyDown: (view, event) => {
          onKeyDown(event);
          return false; // Let the default behavior happen
        },
        handlePaste: (view, event) => {
          // Handle paste events to clean up content if needed
          const text = event.clipboardData?.getData('text/plain');
          if (text) {
            event.preventDefault();
            const tr = view.state.tr.insertText(text);
            view.dispatch(tr);
            return true;
          }
          return false;
        },
      },
      onUpdate: ({ editor: editorInstance }) => {
        const json = editorInstance.getJSON();
        const text = editorInstance.getText();
        onUpdate(json, text);
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
  $: if (editor && content && document.activeElement !== editor.view.dom) {
    const currentContent = JSON.stringify(editor.getJSON());
    const newContent = typeof content === 'string' ? content : JSON.stringify(content);
    
    if (currentContent !== newContent) {
      const { from, to } = editor.state.selection;
      editor.commands.setContent(content);
      // Restore cursor position if possible
      if (from <= editor.state.doc.content.size) {
        setTimeout(() => {
          editor?.commands.setTextSelection({ from, to });
        });
      }
    }
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

<div class="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 transition-colors w-full">
  <div 
    bind:this={editorElement} 
    class="w-full focus:outline-none"
  >
    <!-- Editor content will be rendered here -->
  </div>
</div>

<style>
  /* Style the placeholder */
  [data-placeholder]::before {
    content: attr(data-placeholder);
    color: #9CA3AF;
    position: absolute;
    pointer-events: none;
    height: 0;
  }
  
  .dark [data-placeholder]::before {
    color: #6B7280;
  }
  
  /* Show placeholder when editor is empty */
  .ProseMirror:not(.ProseMirror-focused)[contenteditable=true][data-placeholder]:empty::before {
    content: attr(data-placeholder);
  }
</style>
