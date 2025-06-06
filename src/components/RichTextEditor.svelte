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
  import { onMount, onDestroy, tick } from 'svelte';
  import { Editor } from '@tiptap/core';
  import StarterKit from '@tiptap/starter-kit';
  import { writable } from 'svelte/store';

  // Core Extensions (many are part of StarterKit but can be configured individually)
  import Document from '@tiptap/extension-document';
  import Paragraph from '@tiptap/extension-paragraph';
  import Text from '@tiptap/extension-text';
  import Heading from '@tiptap/extension-heading';
  import Bold from '@tiptap/extension-bold';
  import Italic from '@tiptap/extension-italic';
  import Strike from '@tiptap/extension-strike';
  import Code from '@tiptap/extension-code';
  import CodeBlock from '@tiptap/extension-code-block';
  import BulletList from '@tiptap/extension-bullet-list';
  import OrderedList from '@tiptap/extension-ordered-list';
  import ListItem from '@tiptap/extension-list-item';
  import Blockquote from '@tiptap/extension-blockquote';
  import HorizontalRule from '@tiptap/extension-horizontal-rule';
  
  // Utility & UX Extensions
  import Dropcursor from '@tiptap/extension-dropcursor';
  import Gapcursor from '@tiptap/extension-gapcursor';
  import PlaceholderExtension from '@tiptap/extension-placeholder'; // Renamed to avoid conflict
  
  // Feature Extensions
  import Link from '@tiptap/extension-link';
  import Image from '@tiptap/extension-image';
  import BubbleMenu from '@tiptap/extension-bubble-menu';
  // import Mention from '@tiptap/extension-mention'; // We'll add this later if needed with proper suggestion setup
  // import Emoji from '@tiptap/extension-emoji'; // Requires @tiptap-pro/extension-emoji or custom setup

  import MenuBar from './editor/MenuBar.svelte';
  
  // Re-export the interface for convenience
  export type { EditorInstance };

  export let content: Record<string, any> | string = '';
  export let onUpdate: (json: Record<string, any>, text: string) => void = () => {};
  export let onKeyDown: (event: KeyboardEvent) => void = () => {};
  export let autoFocus = false;
  export let readOnly = false;
  export let className = '';
  export let placeholder: string = 'Type something...'; // Explicitly type placeholder
  export let showToolbar = true;

  let editor: Editor | null = null;
  let editorElement: HTMLDivElement;
  let editorInstance: EditorInstance | null = null;

  // Formatting commands
  function toggleBold() {
    editor?.chain().focus().toggleBold().run();
  }
  
  function toggleItalic() {
    editor?.chain().focus().toggleItalic().run();
  }
  
  function toggleStrike() {
    editor?.chain().focus().toggleStrike().run();
  }
  
  function toggleCode() {
    editor?.chain().focus().toggleCode().run();
  }
  
  function toggleBulletList() {
    editor?.chain().focus().toggleBulletList().run();
  }
  
  function toggleOrderedList() {
    editor?.chain().focus().toggleOrderedList().run();
  }
  
  function toggleBlockquote() {
    editor?.chain().focus().toggleBlockquote().run();
  }
  
  function toggleCodeBlock() {
    editor?.chain().focus().toggleCodeBlock().run();
  }
  
  function setHeading(level: number) {
    editor?.chain().focus().toggleHeading({ level }).run();
  }
  
  function insertHorizontalRule() {
    editor?.chain().focus().setHorizontalRule().run();
  }
  
  function setLink() {
    const previousUrl = editor?.getAttributes('link').href;
    const url = window.prompt('Enter URL', previousUrl || 'https://');
    
    if (url === null) return;
    if (url === '') {
      editor?.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }
    
    editor?.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  }
  
  function insertImage() {
    const url = window.prompt('Enter image URL');
    if (url) {
      editor?.chain().focus().setImage({ src: url }).run();
    }
  }

  // Create a store for the editor instance
  const editorStore = writable<Editor | null>(null);

  // Initialize the editor
  onMount(async () => {
    await tick(); // Wait for MenuBar to render its DOM elements

    const bubbleMenuDomElement = document.querySelector('#tiptap-bubble-menu-content') as HTMLElement;

    if (!bubbleMenuDomElement && showToolbar) {
      console.error('RichTextEditor: Bubble menu DOM element (#tiptap-bubble-menu-content) not found. Bubble menu will not work.');
      // Editor will be initialized without bubble menu if element is not found
    }

    editor = new Editor({
      element: editorElement,
      extensions: [
        StarterKit.configure({
          // Disable individual StarterKit extensions if we want to configure them separately
          // or if they conflict. For now, let's assume default StarterKit is fine.
          // Example: heading: false, // if we want to use our own Heading.configure
        }),
        // Document, // Part of StarterKit
        // Paragraph, // Part of StarterKit
        // Text, // Part of StarterKit
        // Bold, // Part of StarterKit
        // Italic, // Part of StarterKit
        // Strike, // Part of StarterKit
        // Code, // Part of StarterKit
        // Heading, // Part of StarterKit, but can be configured: e.g. Heading.configure({ levels: [1, 2, 3] })
        // BulletList, // Part of StarterKit
        // OrderedList, // Part of StarterKit
        // ListItem, // Part of StarterKit
        // Blockquote, // Part of StarterKit
        // CodeBlock, // Part of StarterKit
        // HorizontalRule, // Part of StarterKit
        // Dropcursor, // Part of StarterKit
        // Gapcursor, // Part of StarterKit

        // Extensions not in StarterKit or needing specific configuration:
        PlaceholderExtension.configure({
          placeholder: placeholder,
        }),
        Link.configure({
          openOnClick: true, // Changed to true for better UX, can be configured via prop later
          autolink: true,
          HTMLAttributes: {
            class: 'text-primary-600 dark:text-primary-400 hover:underline',
            rel: 'noopener noreferrer nofollow',
            target: '_blank',
          },
        }),
        Image.configure({
          inline: false, // Allow images to be block elements
          allowBase64: true, // For pasting images, though server-side upload is better
          HTMLAttributes: {
            class: 'max-w-full h-auto rounded-md border border-gray-200 dark:border-gray-700 my-2',
          },
        }),
        ...(bubbleMenuDomElement && showToolbar ? [ // Conditionally add BubbleMenu if element exists and toolbar is shown
          BubbleMenu.configure({
            element: bubbleMenuDomElement,
            tippyOptions: { 
              duration: 100,
              placement: 'top-start',
              hideOnClick: false, // Prevent hiding when clicking menu items
              appendTo: () => document.body, // Ensures visibility
            },
            // pluginKey: 'bubbleMenuKey', // Unique key if multiple bubble menus
            shouldShow: ({ editor: currentEditor, view, state, oldState, from, to }) => {
              // Only show the bubble menu if text is selected and not in a code block.
              const { selection } = state;
              const { empty } = selection;
              const isActiveCodeBlock = currentEditor.isActive('codeBlock');
              return !empty && !isActiveCodeBlock;
            }
          })
        ] : []),
        // Mention.configure({ ... }) // Add later with suggestion UI
        // Emoji.configure({ ... }) // Add later
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

<div class="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 transition-colors w-full flex flex-col">
  {#if editor && showToolbar}
    <MenuBar {editor} />
  {/if}
  <div 
    bind:this={editorElement} 
    class="w-full focus:outline-none flex-grow p-3 min-h-[100px] prose dark:prose-invert max-w-none"
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
