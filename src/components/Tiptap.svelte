<script lang="ts">
  import { onMount } from 'svelte';
  import type { Readable } from 'svelte/store';
  import { createEditor, Editor, EditorContent } from 'svelte-tiptap';
  import StarterKit from '@tiptap/starter-kit';

  const { content = '', readOnly = false } = $props<{ content?: string; readOnly?: boolean }>();

  let editor = $state() as Readable<Editor>;

  onMount(() => {
    editor = createEditor({
      extensions: [
        StarterKit,
      ],
      content,
      editable: !readOnly,
      editorProps: {
        attributes: {
          class: 'prose prose-sm dark:prose-invert max-w-none focus:outline-none',
        },
      },
    });
  });
</script>

<EditorContent editor={$editor} />


<style>
  .ProseMirror {
    padding: 0;
  }
</style>
