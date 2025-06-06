<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { store, currentUserIdStore, addMessage, updateMessage } from '../store';
  import { get } from 'svelte/store';
  import { Send } from 'lucide-svelte';
  import RichTextEditor from './RichTextEditor.svelte';
  import type { EditorInstance } from './RichTextEditor.svelte';
	import Tiptap from './Tiptap.svelte';
  
  export let channelId: string | null = null;
  export let parentId: string | null = null;
  export let isThreadReply = false;
  export let disabled = false;
  
  let richTextEditor: EditorInstance | null = null;
  let editingMessageId: string | null = null;
  let messageContent = '';
  
  const dispatch = createEventDispatcher<{
    sent: { channelId: string; parentId: string | null };
  }>();

  function sendMessage() {
    const currentUserId = get(currentUserIdStore);
    if (!channelId || !currentUserId || !richTextEditor) return;
    
    const html = richTextEditor.getHTML();
    const text = richTextEditor.getText();
    
    if (!text.trim()) return;
    
    if (editingMessageId) {
      // Update existing message
      updateMessage(channelId, editingMessageId, html);
      editingMessageId = null;
    } else {
      // Add new message
      addMessage(channelId, currentUserId, html, parentId || undefined);
      
      // Clear the editor after sending
      richTextEditor.clear();
      
      // Dispatch sent event
      dispatch('sent', { channelId, parentId });
    }
  }
  
  // Handle editor updates
  function handleEditorUpdate(json: Record<string, any>, text: string) {
    // Store the plain text for the send button disabled state
    messageContent = text;
  }
  
  // Handle key events (e.g., Cmd+Enter or Ctrl+Enter to send)
  function handleKeyDown(event: KeyboardEvent) {
    // Check for Cmd+Enter (Mac) or Ctrl+Enter (Windows/Linux)
    if (event.key === 'Enter' && (event.metaKey || event.ctrlKey)) {
      event.preventDefault();
      sendMessage();
    }
    
    // Cancel editing with Escape
    if (event.key === 'Escape') {
      if (editingMessageId) {
        cancelEditing();
      } else if (messageContent.trim()) {
        // Clear the message if not empty
        messageContent = '';
        richTextEditor?.clear();
      }
    }
  }
  
  // Focus the editor
  export function focusInput() {
    richTextEditor?.focus();
  }
  
  // Initialize with message content if editing
  $: if (editingMessageId && channelId && richTextEditor) {
    const currentStore = get(store);
    const channel = currentStore.channels[channelId];
    if (channel) {
      const message = channel.messages[editingMessageId];
      if (message) {
        richTextEditor.$set({ content: message.text });
        messageContent = message.text;
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
    messageContent = message.text;
    
    // Focus the editor and set content
    setTimeout(() => {
      richTextEditor?.focus();
      if (richTextEditor) {
        richTextEditor.$set({ content: messageContent });
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
    messageContent = '';
    if (richTextEditor) {
      richTextEditor.clear();
    }
  }
  
  // Get placeholder text based on current state
  $: placeholderText = (() => {
    if (disabled) return "This channel is locked";
    
    const currentUserId = get(currentUserIdStore);
    if (!currentUserId) return "Set up your profile to send messages";
    
    return isThreadReply ? "Reply in thread..." : "Type a message...";
  })();
  
  // Check if send button should be disabled
  $: isSendDisabled = disabled || !get(currentUserIdStore) || !messageContent.trim();
</script>

<div class="px-4 py-3">
  {#if editingMessageId}
    <div class="mb-2 flex items-center text-sm">
      <span class="text-gray-600 dark:text-gray-400">
        Editing message
      </span>
      <button 
        class="ml-2 text-primary-600 hover:underline dark:text-primary-400"
        on:click={cancelEditing}
      >
        Cancel
      </button>
    </div>
  {/if}
  
  <div class="relative">
    <div class="rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800">
      <!-- <RichTextEditor
        bind:this={richTextEditor}
        onUpdate={handleEditorUpdate}
        onKeyDown={handleKeyDown}
        placeholder={placeholderText}
        readOnly={disabled || !get(currentUserIdStore)}
        autoFocus={!disabled && !!get(currentUserIdStore)}
      /> -->
      <Tiptap content={messageContent} />
      <div class="flex items-center justify-end border-t border-gray-200 dark:border-gray-700 p-2">
        <button
          class="inline-flex items-center justify-center rounded-md bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-500 dark:focus:ring-offset-gray-800"
          on:click={sendMessage}
          disabled={isSendDisabled}
          aria-label={editingMessageId ? "Save edit" : "Send message"}
        >
          <Send size={20} class="mr-1" />
          {editingMessageId ? 'Save' : 'Send'}
        </button>
      </div>
    </div>
  </div>
</div>