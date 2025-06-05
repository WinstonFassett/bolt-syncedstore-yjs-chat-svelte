<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { chatStore, currentChannelIdStore } from '../store';
  
  onMount(() => {
    // Check if there's a current channel
    if ($currentChannelIdStore) {
      goto(`/c/${$currentChannelIdStore}`);
    } else {
      // Check if there are any channels
      const channels = Object.values($chatStore.channels || {});
      if (channels.length > 0) {
        // Redirect to the first channel
        goto(`/c/${channels[0].meta.value.id}`);
      } else {
        // No channels, go to join page
        goto('/join');
      }
    }
  });
</script>

<div class="flex h-full w-full items-center justify-center">
  <div class="flex flex-col items-center">
    <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 animate-spin-slow text-primary-600 dark:text-primary-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
    </svg>
    <h1 class="mt-4 text-xl font-medium">Loading YJS Chat</h1>
    <p class="mt-2 text-gray-600 dark:text-gray-400">
      Redirecting to your chat...
    </p>
  </div>
</div>
