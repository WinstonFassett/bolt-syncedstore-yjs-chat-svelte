<script lang="ts">
  import { page } from '$app/stores';
  import Sidebar from '../../../../../components/Sidebar.svelte';
  import MainView from '../../../../../components/MainView.svelte';
  import ThreadView from '../../../../../components/ThreadView.svelte';
  import { currentChannelIdStore } from '../../../../../store';
  import { onMount } from 'svelte';
  
  // Get the channel ID and message ID from the route params
  const channelId = $page.params.channelId;
  const messageId = $page.params.messageId;
  
  // Flag to indicate we're in thread view
  const isThreadView = true;
  
  onMount(() => {
    // Set the current channel ID in the store
    $currentChannelIdStore = channelId;
  });
</script>

<!-- Main app layout with thread view -->
<div class="w-64 shrink-0 overflow-hidden border-r border-gray-200 dark:border-dark-400">
  <Sidebar />
</div>

<MainView {isThreadView} {messageId} />
