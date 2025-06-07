<script lang="ts">
  // --- Multiline mode state ---
  let multilineMode = false;

  import { createEventDispatcher } from 'svelte';
  import { store, currentUserIdStore, addMessage, updateMessage } from '../store';
  import { get } from 'svelte/store';
  import { Send } from 'lucide-svelte';
	import { TiptapEditor as Tiptap, type EditorType } from '../lib/svelte-5-tiptap';
  
  export let channelId: string | null = null;
  export let parentId: string | null = null;
  export let isThreadReply = false;
  export let disabled = false;

  let editor: EditorType | null = null;
  let editingMessageId: string | null = null;
  let messageContentJSON: any = null;

  function isEditorEmpty(json: any): boolean {
    // Tiptap empty doc: { type: 'doc', content: [{ type: 'paragraph', content: [] }] }
    if (!json || !json.content || json.content.length === 0) return true;
    if (json.content.length === 1 && json.content[0].type === 'paragraph') {
      const para = json.content[0];
      return !para.content || para.content.length === 0 || (para.content.length === 1 && para.content[0].type === 'text' && !para.content[0].text.trim());
    }
    return false;
  }

  const dispatch = createEventDispatcher<{
    sent: { channelId: string; parentId: string | null };
  }>();

  function sendMessage() {
    const currentUserId = get(currentUserIdStore);
    if (!channelId || !currentUserId || !editor) return;
    const json = editor.getJSON();
    const text = editor.getText();
    if (!text.trim()) return;
    if (editingMessageId) {
      // Update existing message
      updateMessage(channelId, editingMessageId, json);
      editingMessageId = null;
    } else {
      // Add new message
      addMessage(channelId, currentUserId, json, parentId || undefined);
      // Clear the editor after sending
      editor.commands.clearContent();
      // Dispatch sent event
      dispatch('sent', { channelId, parentId });
    }
    // Always return to single-line mode after sending
    multilineMode = false;
  }

  import { Extension } from '@tiptap/core';
import { keymap } from '@tiptap/pm/keymap';

// Custom Tiptap keymap extension for send/cancel
const customKeymapExtension = Extension.create({
  name: 'customKeymap',
  addProseMirrorPlugins() {
    return [
      keymap({
        'Enter': () => {
          if (!multilineMode) {
            sendMessage();
            return true;
          }
          // In multiline mode, allow Enter for newline
          return false;
        },
        'Mod-Enter': () => {
          if (multilineMode) {
            sendMessage();
            return true;
          }
          return false;
        },
        'Shift-Enter': () => {
          if (!multilineMode) {
            multilineMode = true;
            if (editor) editor.commands.enter(); // Insert newline at cursor
            return true;
          }
          // In multiline, allow Shift+Enter for newline
          return false;
        },
        'Mod-m': () => {
          multilineMode = !multilineMode;
          return true;
        },
        'Escape': () => {
          if (editingMessageId) cancelEditing();
          else if (!isEditorEmpty(messageContentJSON) && editor) editor.commands.clearContent();
          return true;
        }
      })
    ];
  }
});


  // Attach update listener to editor
  $: if (editor) {
    editor.on('update', () => {
      messageContentJSON = editor.getJSON();
    });
  }

  // Focus the editor
  export function focusInput() {
    if (editor) {
      editor.commands.focus();
    }
  }

  // Initialize with message content if editing
  $: if (editingMessageId && channelId && editor) {
    const currentStore = get(store);
    const channel = currentStore.channels[channelId];
    if (channel) {
      const message = channel.messages[editingMessageId];
      if (message) {
        editor.commands.setContent(message.text);
        messageContentJSON = message.text;
      }
    }
  }

  // Start editing a message
  export function startEditing(messageId: string) {
    if (!channelId) return;

    const currentStore = get(store);
    const channel = currentStore.channels[channelId];
    if (!channel) return;

    const message = channel.messages[messageId];
    if (!message || message.deleted) return;

    editingMessageId = messageId;

    // Focus the editor and set content
    setTimeout(() => {
      if (editor) {
        editor.commands.setContent(message.text);
        editor.commands.focus();
      }
    });
  }

  // Delete a message
  export function deleteMessage(messageId: string) {
    if (!channelId) return;

    const currentStore = get(store);
    const channel = currentStore.channels[channelId];
    if (!channel) return;

    const message = channel.messages[messageId];
    if (message) {
      message.deleted = true;
      message.updatedAt = Date.now();
    }
  }

  // Cancel editing
  function cancelEditing() {
    editingMessageId = null;
    messageContentJSON = null;
    if (editor) {
      editor.commands.clearContent();
    }
  }

  // Get placeholder text based on current state
  $: placeholderText = (() => {
    if (disabled) return "This channel is locked";
    const currentUserId = get(currentUserIdStore);
    if (!currentUserId) return "Set up your profile to send messages";
    return isThreadReply ? "Reply in thread..." : "Type a message...";
  })();

  // Contextual hint
  $: inputHint = (() => {
    if (multilineMode) {
      return 'Press Cmd+Enter to send. Escape to cancel. Cmd+M for single-line.';
    } else {
      return 'Press Enter to send. Shift+Enter or Cmd+M for multiline.';
    }
  })();
  
  // Check if send button should be disabled
  $: isSendDisabled = disabled || !get(currentUserIdStore) || isEditorEmpty(messageContentJSON);
</script>

<div class="p-4 border-t border-gray-200 dark:border-dark-400">
  {#if editingMessageId}
    <div class="mb-2 flex items-center text-sm">
      <span class="text-gray-600 dark:text-gray-400">
        Editing message
      </span>
      <button
        class="ml-2 text-primary-600 hover:underline dark:text-primary-400"
        on:click={cancelEditing}
        type="button"
      >
        Cancel
      </button>
    </div>
  {/if}
  <form class="flex flex-col gap-1" on:submit|preventDefault={sendMessage} autocomplete="off">
    <div class="flex items-end gap-2">
      <Tiptap
        bind:editor={editor!}
        content={messageContentJSON}
        placeholder={placeholderText}
        readOnly={disabled || !get(currentUserIdStore)}
        autoFocus={!disabled && !!get(currentUserIdStore)}
        extensions={[customKeymapExtension]}
        class={`flex-1  {
  overflow-y: unset;
}${multilineMode ? 'min-h-20 max-h-32 overflow-y-auto' : 'min-h-10 max-h-20'} resize-none`}
      />
      <button
        type="submit"
        disabled={isSendDisabled}
        aria-label={editingMessageId ? 'Save edit' : 'Send message'}
        class="mb-1 ml-2 p-2 rounded-full bg-gray-200 text-gray-500 hover:bg-primary-600 hover:text-white dark:bg-dark-400 dark:text-gray-400 dark:hover:bg-primary-600 dark:hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-hidden focus:ring-2 focus:ring-primary-400"
        tabindex="0"
      >
        <Send size={18} />
      </button>
    </div>
    <div class="mt-1 text-xs text-gray-500 dark:text-gray-400">{inputHint}</div>
  </form>
</div>