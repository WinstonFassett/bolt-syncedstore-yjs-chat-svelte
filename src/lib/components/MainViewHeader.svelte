<script lang="ts">
  import { currentChannel, isThreadPanelOpen, currentThreadIdStore } from '$lib/store'
  import ChannelHeader from './ChannelHeader.svelte'
  import ChannelSettings from './ChannelSettings'
  
  // Local state
  let showSettings = false
  
  function openChannelSettings() {
    showSettings = true
  }
  
  function closeChannelSettings() {
    showSettings = false
  }
  
  // Run after every Svelte update
  afterUpdate(() => {
    const currentChannelId = $currentChannel?.meta.value.id || null
    const currentThreadId = $currentThreadIdStore
    
    // Channel changed
    if (currentChannelId && currentChannelId !== previousChannelId) {
      if (!$isThreadPanelOpen) {
        focusChannelInputIfNeeded()
      }
    }
    
    // Thread changed
    if (currentThreadId && currentThreadId !== previousThreadId) {
      focusThreadInputIfNeeded()
    }
    
    // Thread panel closed
    if (previousThreadPanelState && !$isThreadPanelOpen) {
      focusChannelInputIfNeeded()
    }
    
    // Update previous state
    previousChannelId = currentChannelId
    previousThreadId = currentThreadId
    previousThreadPanelState = $isThreadPanelOpen
  })
  
  // We don't need this reactive statement anymore as it's handled by the route change detection
  
  // Handle thread panel closed event
  function handleThreadClosed() {
    // Focus the channel input when thread panel is closed
    tick().then(() => {
      if (messageInputComponent) {
        messageInputComponent.focusInput();
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

<ChannelHeader channel={$currentChannel} on:openSettings={openChannelSettings} />
