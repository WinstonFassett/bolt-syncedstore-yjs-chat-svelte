<script lang="ts">
  import { onMount, afterUpdate, createEventDispatcher } from 'svelte'
  import { store, currentChannelIdStore, currentChannel } from '$lib/store'
  import { isSameDay, formatDateDivider } from '../utils/date'
  import MessageItem from './MessageItem.svelte'
  
  export let channelId: string | null = null
  export let parentId: string | null = null
  export let isThreadView = false
  
  const dispatch = createEventDispatcher<{
    replyInThread: { messageId: string }
  }>()
  
  // Get messages for the current channel/thread
  $: messages = channelId ? Object.values($store.channels[channelId]?.messages ?? {})
    .filter(message => message.meta?.value && (parentId ? message.meta.value.parentId === parentId : !message.meta.value.parentId))
    .sort((a, b) => a.meta.value.createdAt - b.meta.value.createdAt) : []
  
  // Reference to the messages container for scrolling
  let messagesContainer: HTMLElement
  
  // Handle scrolling after DOM updates
  afterUpdate(() => {
    if (messagesContainer) {
      const isAtBottom = messagesContainer.scrollHeight - messagesContainer.scrollTop <= messagesContainer.clientHeight + 100
      
      if (isAtBottom) {
        messagesContainer.scrollTop = messagesContainer.scrollHeight
      }
    }
  })
  
  onMount(() => {
    // Initial scroll to bottom
    if (messagesContainer) {
      messagesContainer.scrollTop = messagesContainer.scrollHeight
    }
  })
  
  // Handle message events
  function handleReply(event: CustomEvent<{ messageId: string }>) {
    dispatch('replyInThread', event.detail)
  }
  
  function handleEdit(event: CustomEvent<{ messageId: string }>) {
    // Forward to message input component
    const messageInput = document.getElementById('message-input') as any
    if (messageInput?.startEditing) {
      messageInput.startEditing(event.detail.messageId)
    }
  }
  
  function handleDelete(event: CustomEvent<{ messageId: string }>) {
    // Forward to message input component
    const messageInput = document.getElementById('message-input') as any
    if (messageInput?.deleteMessage) {
      messageInput.deleteMessage(event.detail.messageId)
    }
  }
</script>

<div 
  class="h-full overflow-y-auto overflow-x-hidden scrollbar-thin"
  bind:this={messagesContainer}
>
  {#if messages.length === 0}
    <div class="flex h-full flex-col items-center justify-center p-4 text-center">
      <svg xmlns="http://www.w3.org/2000/svg" class="mb-4 h-12 w-12 text-gray-400 dark:text-gray-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
      </svg>
      <h3 class="mb-1 text-lg font-medium">No messages yet</h3>
      <p class="text-gray-500 dark:text-gray-400">
        {#if isThreadView}
          No replies yet
        {:else if $store.channels[channelId]?.locked}
          This channel is locked and cannot receive new messages
        {:else}
          Be the first to send a message!
        {/if}
      </p>
    </div>
  {:else}
    {#each messages as message, i}
      {#if i === 0 || !isSameDay(message.meta.value.createdAt, messages[i-1].meta.value.createdAt)}
        <div class="relative my-3 text-center">
          <span class="relative inline-block rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-800 dark:bg-dark-300 dark:text-gray-300">
            {formatDateDivider(message.meta.value.createdAt)}
          </span>
        </div>
      {/if}
      
      <MessageItem 
        {message} 
        showThreadButton={!isThreadView} 
        isInThread={isThreadView} 
        on:reply={handleReply}
        on:edit={handleEdit}
        on:delete={handleDelete}
      />
    {/each}
  {/if}
</div>