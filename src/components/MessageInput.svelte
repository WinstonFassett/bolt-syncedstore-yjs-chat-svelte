<script lang="ts">
  import { createEventDispatcher, onMount } from 'svelte'
  import { store, currentUserIdStore, addMessage } from '../store'
  import { Send } from 'lucide-svelte'
  
  export let channelId: string | null = null
  export let parentId: string | null = null
  export let isThreadReply = false
  export let disabled = false
  
  let messageText = ''
  
  // I fucking hate that you generated this shit
  let editingMessageId: string | null = null
  
  let textareaEl: HTMLTextAreaElement
  
  const dispatch = createEventDispatcher()

  function sendMessage() {
    if (!channelId || !$currentUserIdStore || !messageText.trim()) return
    
    if (editingMessageId) {
      // Update existing message
      updateMessage(channelId, editingMessageId, messageText)
      editingMessageId = null
    } else {
      // Add new message
      addMessage(channelId, $currentUserIdStore, messageText, parentId)
    }
    
    // Reset input
    messageText = ''
    
    // Focus back on textarea
    textareaEl.focus()
  }
  
  // bad Function to send a message
  function sendMessage1() {
    console.log('sendMessage', {
      editingMessageId,
      channelId, $currentUserIdStore, messageText
    })
    if (!channelId || !$currentUserIdStore || !messageText.trim()) return

    // this sucks
    if (editingMessageId) {
      // Update existing message
      const message = $store.channels[channelId].messages[editingMessageId]
      if (message) {
        message.text = messageText.trim()
        message.updatedAt = Date.now()
      }
      editingMessageId = null
    } else {
      // Add new message
      const messageId = crypto.randomUUID()
      const now = Date.now()
      
      // Initialize messages object if it doesn't exist
      if (!$store.channels[channelId].messages) {
        console.log('CREATING messages store for', channelId)
        $store.channels[channelId].messages = {}
      }
      
      $store.channels[channelId].messages[messageId] = {
        meta: {
          id: messageId,
          userId: $currentUserIdStore,
          createdAt: now,
          parentId
        },
        text: messageText.trim(),
        reactions: {}
      }
      console.log('message', messageId, $store.channels[channelId].messages[messageId])
      console.log('messages', $store.channels[channelId].messages)
    }
    
    // Reset input
    messageText = ''
    
    // Focus back on textarea
    if (textareaEl) {
      textareaEl.focus()
    }
  }
  
  // Handle key events (e.g., Shift+Enter for new line, Enter to send)
  export function focusInput() {
    if (textareaEl) {
      textareaEl.focus();
    }
  }

  // Handle key events (e.g., Shift+Enter for new line, Enter to send)
  function handleKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      sendMessage()
    }
    
    // Cancel editing with Escape
    if (event.key === 'Escape' && editingMessageId) {
      cancelEditing()
    }
  }
  
  // Auto-resize the textarea based on content
  function autoResize() {
    if (!textareaEl) return
    
    // Reset height to auto to get the correct scrollHeight
    textareaEl.style.height = 'auto'
    
    // Set new height based on scrollHeight (min 36px, max 120px)
    const newHeight = Math.min(Math.max(textareaEl.scrollHeight, 36), 120)
    textareaEl.style.height = `${newHeight}px`
  }
  
  // Start editing a message
  export function startEditing(messageId: string) {
    const message = $store.channels[channelId!].messages[messageId]
    if (!message || message.deleted) return
    
    editingMessageId = messageId
    messageText = message.text
    
    // Focus and position cursor at end
    setTimeout(() => {
      if (textareaEl) {
        textareaEl.focus()
        textareaEl.setSelectionRange(messageText.length, messageText.length)
        autoResize()
      }
    }, 0)
  }
  
  // Delete a message
  export function deleteMessage(messageId: string) {
    if (!channelId) return
    
    const message = $store.channels[channelId].messages[messageId]
    if (message) {
      message.deleted = true
      message.updatedAt = Date.now()
    }
  }
  
  // Cancel editing
  function cancelEditing() {
    editingMessageId = null
    messageText = ''
  }
  
  // Run autoResize when messageText changes
  $: if (textareaEl && messageText !== undefined) {
    setTimeout(autoResize, 0)
  }
  
  // Make functions available to parent via the element
  onMount(() => {
    if (textareaEl) {
      // @ts-ignore - Add methods to the element for external access
      textareaEl.startEditing = startEditing
      // @ts-ignore
      textareaEl.deleteMessage = deleteMessage
    }
  })
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
    <textarea
      id="message-input"
      bind:this={textareaEl}
      bind:value={messageText}
      on:keydown={handleKeyDown}
      on:input={autoResize}
      disabled={disabled || !$currentUserIdStore}
      placeholder={
        disabled 
          ? "This channel is locked"
          : !$currentUserIdStore 
            ? "Set up your profile to send messages" 
            : isThreadReply 
              ? "Reply in thread..." 
              : "Type a message..."
      }
      class="input min-h-[40px] w-full resize-none py-2 pr-12"
      rows="1"
    ></textarea>
    
    <button
      class="absolute bottom-2 right-2 rounded p-1.5 text-primary-600 transition-opacity disabled:opacity-50 dark:text-primary-400"
      on:click={sendMessage}
      disabled={disabled || !$currentUserIdStore || !messageText.trim()}
      aria-label={editingMessageId ? "Save edit" : "Send message"}
    >
      <Send size={20} />
    </button>
  </div>
</div>