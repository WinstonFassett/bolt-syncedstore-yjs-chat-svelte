<script lang="ts">
  import { onMount } from 'svelte'
  import { page } from '$app/stores'
  import { goto } from '$app/navigation'
  import ChannelSettings from '$lib/components/ChannelSettings.svelte';
  import { currentChannel, currentUserIdStore, isThreadPanelOpen, currentThreadIdStore } from '$lib/store'
  import MessageList from './MessageList.svelte'
  import MessageInput from './MessageInput.svelte'
  import ThreadView from './ThreadView.svelte'
  import type { MessageInput as MessageInputType } from './MessageInput.svelte'
  import type { ThreadView as ThreadViewType } from './ThreadView.svelte'
  
  // References to child components
  let messageInputComponent: MessageInputType
  let threadViewInstance: ThreadViewType
  let messageList: any // Type this properly based on your MessageList component
  
  // Handle thread panel closed event
  function handleThreadClosed() {
    // No-op: Focus is now handled by route-based focus management
  }

  async function handleReplyInThread(event: CustomEvent<{ messageId: string }>) {
    const messageId = event.detail.messageId
    
    // Check if we're already viewing this thread
    const alreadyViewingThisThread = $currentThreadIdStore === messageId && $isThreadPanelOpen
    
    // Set thread ID in store
    currentThreadIdStore.set(messageId)
    isThreadPanelOpen.set(true)

    // Navigate to thread route if not already there
    if ($currentChannel) {
      const channelId = $currentChannel.meta.value.id
      
      // Only navigate if we're not already on this thread route
      if (!alreadyViewingThisThread) {
        goto(`/c/${channelId}/m/${messageId}`)
      }

      // Ensure ThreadView is rendered and then focus its input
      // We do this regardless of navigation to ensure focus works when switching threads
      await tick();
      if (threadViewInstance) {
        threadViewInstance.focusReplyInput();
      }
    }
  }
  
  function handleThreadOpen(event: CustomEvent<{ messageId: string }>) {
    // Handle thread open event
    const { messageId } = event.detail
    if (messageId) {
      currentThreadIdStore.set(messageId)
      isThreadPanelOpen.set(true)
    }
  }
  
  function handleMessageSubmit(message: string) {
    // Implement message submission logic
    console.log('Message submitted:', message)
    // Add your message submission logic here
  }
  
  function closeThreadPanel() {
    isThreadPanelOpen.set(false)
    currentThreadIdStore.set(null)
  }
  
  // No need for default export in Svelte components
  // The component is automatically exported as default
</script>

<!-- Header is now handled in the layout component -->

<div class="flex flex-1 overflow-hidden">
  <!-- Main Chat Area -->
  <div class="flex-1 flex flex-col overflow-hidden">
    {#if $currentChannel}
      <div class="flex-1 overflow-y-auto">
        <MessageList 
          channelId={$currentChannel.meta.value.id}
          bind:this={messageList}
          on:threadOpen={handleThreadOpen}
        />
      </div>
      
      <div class="p-4 border-t bg-background">
        <MessageInput 
          bind:this={messageInputComponent}
          channelId={$currentChannel.meta.value.id}
          on:submit={handleMessageSubmit}
        />
      </div>
    {:else}
      <div class="flex-1 flex items-center justify-center text-gray-500">
        <div class="text-center p-8">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto mb-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
          <h3 class="text-lg font-medium">No channel selected</h3>
          <p class="mt-1">Select a channel from the sidebar to start chatting</p>
        </div>
      </div>
    {/if}
  </div>
  
  <!-- Thread View Panel -->
  {#if $isThreadPanelOpen && $currentThreadIdStore}
    <div class="w-full md:w-1/2 lg:w-2/5 xl:w-1/3 border-l h-full overflow-hidden flex flex-col bg-background">
      <ThreadView 
        bind:this={threadViewInstance}
        channelId={$currentChannel?.meta.value.id}
        threadId={$currentThreadIdStore}
        on:close={closeThreadPanel}
      />
    </div>
  {/if}
</div>

<!-- Removed duplicate thread view -->

<!-- Channel Settings Modal -->