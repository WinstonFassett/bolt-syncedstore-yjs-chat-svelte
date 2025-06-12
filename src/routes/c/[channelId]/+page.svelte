<script lang="ts">
  import { page } from '$app/stores';
  import { onMount, onDestroy } from 'svelte';
  import { currentChannelIdStore, isThreadPanelOpen, currentThreadIdStore } from '$lib/store';
  import Sidebar from '$lib/components/Sidebar.svelte';
  import MainView from '$lib/components/MainView.svelte';

  // Set current channel ID from route parameter
  $: {
    if ($page.params.channelId) {
      currentChannelIdStore.set($page.params.channelId);
      
      // Only close thread panel if we're not in a thread route
      // This preserves thread view when navigating directly to channel
      if (!window.location.pathname.includes('/m/')) {
        isThreadPanelOpen.set(false);
        currentThreadIdStore.set(null);
      }
    }
  }
  
  // Handle back button navigation
  function handlePopState() {
    const pathParts = window.location.pathname.split('/');
    if (pathParts.length >= 3 && pathParts[1] === 'c') {
      const channelId = pathParts[2];
      currentChannelIdStore.set(channelId);
      
      // Check if we're in a thread view
      if (pathParts.length >= 5 && pathParts[3] === 'm') {
        const messageId = pathParts[4];
        currentThreadIdStore.set(messageId);
        isThreadPanelOpen.set(true);
      } else {
        // Regular channel view
        isThreadPanelOpen.set(false);
        currentThreadIdStore.set(null);
      }
    }
  }
  
  onMount(() => {
    window.addEventListener('popstate', handlePopState);
  });
  
  onDestroy(() => {
    window.removeEventListener('popstate', handlePopState);
  });
</script>

<MainView />
