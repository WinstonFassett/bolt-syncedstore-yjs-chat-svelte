<script lang="ts">
  import { store, currentChannelIdStore, currentThreadIdStore, isThreadPanelOpen } from '../store'
  import { tick } from 'svelte'
  import MessageItem from './MessageItem.svelte'
  import MessageList from './MessageList.svelte'
  import MessageInput from './MessageInput.svelte'
  import { X } from 'lucide-svelte'
  
  let threadMessageInput: MessageInput // Reference to the MessageInput component for thread replies

  // Get the parent message
  $: parentMessage = $currentChannelIdStore && $currentThreadIdStore 
    ? $store.channels[$currentChannelIdStore]?.messages[$currentThreadIdStore]
    : null
    
  // Watch for thread ID changes to focus input
  $: if ($currentThreadIdStore && $isThreadPanelOpen && threadMessageInput) {
    focusReplyInput();
  }
  
  // Function to focus the reply input, callable from parent
  export async function focusReplyInput() {
    await tick(); // Ensure MessageInput is rendered
    if (threadMessageInput) {
      threadMessageInput.focusInput();
    }
  }

  // Create a dispatch function for events
  import { createEventDispatcher } from 'svelte'
  const dispatch = createEventDispatcher()

  // Close the thread panel
  function closeThread() {
    isThreadPanelOpen.set(false)
    
    // Dispatch an event to focus the channel input
    dispatch('threadClosed')
    currentThreadIdStore.set(null)
  }
</script>

{#if $isThreadPanelOpen && parentMessage}
  <div class="flex h-full flex-col border-l border-gray-200 bg-white dark:border-dark-400 dark:bg-dark-100">
    <!-- Thread header -->
    <div class="flex h-14 items-center justify-between border-b border-gray-200 px-4 dark:border-dark-400">
      <h2 class="font-medium">Thread</h2>
      <button
        class="rounded p-1.5 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-dark-300 dark:hover:text-gray-200"
        on:click={closeThread}
        aria-label="Close thread"
      >
        <X size={20} />
      </button>
    </div>
    
    <div class="flex-1 overflow-y-auto">
      <!-- Original message -->
      <div class="border-b border-gray-200 dark:border-dark-400">
        <MessageItem message={parentMessage} showThreadButton={false} />
      </div>
      
      <!-- Thread replies -->
      <MessageList 
        channelId={$currentChannelIdStore} 
        parentId={$currentThreadIdStore} 
        isThreadView={true} 
      />
    </div>
    
    <!-- Thread input -->
    <div class="border-t border-gray-200 dark:border-dark-400">
      <MessageInput 
        bind:this={threadMessageInput}
        channelId={$currentChannelIdStore} 
        parentId={$currentThreadIdStore}
        isThreadReply={true}
        disabled={$store.channels[$currentChannelIdStore]?.locked}
      />
    </div>
  </div>
{:else}
  <div class="hidden"></div>
{/if}