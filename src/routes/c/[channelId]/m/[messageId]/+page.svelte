<script lang="ts">
  import { page } from '$app/stores';
  import { onMount, onDestroy } from 'svelte';
  import { currentChannelIdStore, currentThreadIdStore, isThreadPanelOpen } from '$lib/store';
  import Sidebar from '$lib/components/Sidebar.svelte';
  import MainView from '$lib/components/MainView.svelte';
  import ThreadView from '$lib/components/ThreadView.svelte';
  
  // Get the channel ID and message ID from the route params
  const channelId = $page.params.channelId;
  const messageId = $page.params.messageId;
  
  // Flag to indicate we're in thread view
  const isThreadView = true;
  
  // Set the current channel ID and thread ID from route parameters
  $: {
    if ($page.params.channelId && $page.params.messageId) {
      currentChannelIdStore.set($page.params.channelId);
      currentThreadIdStore.set($page.params.messageId);
      isThreadPanelOpen.set(true);
    }
  }
  
  // Handle back button navigation
  function handlePopState() {
    const pathParts = window.location.pathname.split('/');
    if (pathParts.length >= 5 && pathParts[1] === 'c' && pathParts[3] === 'm') {
      const channelId = pathParts[2];
      const messageId = pathParts[4];
      
      currentChannelIdStore.set(channelId);
      currentThreadIdStore.set(messageId);
      isThreadPanelOpen.set(true);
    } else if (pathParts.length >= 3 && pathParts[1] === 'c') {
      // Back to regular channel view
      const channelId = pathParts[2];
      currentChannelIdStore.set(channelId);
      isThreadPanelOpen.set(false);
      currentThreadIdStore.set(null);
    }
  }
  
  onMount(() => {
    window.addEventListener('popstate', handlePopState);
  });
  
  onDestroy(() => {
    window.removeEventListener('popstate', handlePopState);
  });
</script>

<!-- Main app layout with thread view -->
<div class="w-64 shrink-0 overflow-hidden border-r border-gray-200 dark:border-dark-400">
  <Sidebar />
</div>

<MainView {isThreadView} {messageId} />
