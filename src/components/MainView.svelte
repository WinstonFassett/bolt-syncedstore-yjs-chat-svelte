<script lang="ts">
  import { goto } from '$app/navigation'
  import { currentChannel, currentUserIdStore, isThreadPanelOpen, currentThreadIdStore } from '../store'
  import { tick } from 'svelte'
  import ChannelHeader from './ChannelHeader.svelte'
  import MessageList from './MessageList.svelte'
  import MessageInput from './MessageInput.svelte'
  import ChannelSettings from './ChannelSettings.svelte'
  import ThreadView from './ThreadView.svelte'
  
  // Local state
  let showSettings = false
  let messageInputComponent: MessageInput // Reference to the MessageInput component
  let threadViewInstance: ThreadView // Reference to the ThreadView component
  
  function openChannelSettings() {
    showSettings = true
  }
  
  function closeChannelSettings() {
    showSettings = false
  }
  
  // Focus message input when channel changes
  $: if ($currentChannel && messageInputComponent) {
    // Only focus if thread panel is not open
    if (!$isThreadPanelOpen) {
      // Wait for the DOM to update after channel switch, then focus
      tick().then(() => {
        if (messageInputComponent) { // Double check in case component became null
          messageInputComponent.focusInput();
        }
      });
    }
  }
  
  // Focus thread input when thread ID changes
  $: if ($currentThreadIdStore && threadViewInstance && $isThreadPanelOpen) {
    tick().then(() => {
      if (threadViewInstance) {
        threadViewInstance.focusReplyInput();
      }
    });
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
</script>

<main class="flex h-full flex-1 overflow-hidden">
  <!-- Main chat column -->
  <div class="flex flex-1 flex-col bg-white dark:bg-dark-100">
    <ChannelHeader channel={$currentChannel} on:openSettings={openChannelSettings} />
    
    <div class="flex flex-1 flex-col overflow-hidden">
      {#if $currentChannel}
        <div class="flex-1 overflow-hidden">
          <MessageList 
            channelId={$currentChannel.meta.value.id} 
            on:replyInThread={handleReplyInThread} 
          />
        </div>
        <div class="border-t border-gray-200 dark:border-dark-400">
          <MessageInput 
            bind:this={messageInputComponent}
            channelId={$currentChannel.meta.value.id} 
            disabled={$currentChannel.locked} 
          />
        </div>
      {:else}
        <div class="flex h-full flex-col items-center justify-center p-4 text-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="mb-4 h-16 w-16 text-gray-300 dark:text-gray-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
          </svg>
          <h2 class="mb-2 text-xl font-medium">Welcome to YJS Chat</h2>
          {#if !$currentUserIdStore}
            <p class="mb-4 text-gray-600 dark:text-gray-400">
              Set up your profile to get started
            </p>
          {:else}
            <p class="mb-4 text-gray-600 dark:text-gray-400">
              Select a channel from the sidebar to start chatting
            </p>
          {/if}
        </div>
      {/if}
    </div>
  </div>
  
  <!-- Thread panel (conditionally rendered) -->
  <div class="w-0 md:w-2/5 xl:w-1/3 {$isThreadPanelOpen ? 'block' : 'hidden'}">
    <ThreadView bind:this={threadViewInstance} />
  </div>

  <!-- Channel Settings Modal -->
  <ChannelSettings channel={$currentChannel} openModal={showSettings} on:close={closeChannelSettings} />
</main>