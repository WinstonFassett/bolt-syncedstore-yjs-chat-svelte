<script lang="ts">
  import { goto } from '$app/navigation';
  import { currentChannelIdStore } from '../store'
  
  export let channel: any
  
  $: isActive = $currentChannelIdStore === channel.meta.value.id

  function selectChannel() {
    // Update the current channel ID in the store
    currentChannelIdStore.set(channel.meta.value.id)
    
    // Navigate to the channel route
    // Note: We don't close thread panel here to maintain thread view when switching channels
    goto(`/c/${channel.meta.value.id}`)
  }
</script>

<div 
  class="channel-item {isActive ? 'active' : ''}"
  on:click={selectChannel}
  role="button"
  tabindex="0"
>
  <span class="mr-2 text-gray-400">#</span>
  <span class="truncate">{channel.name}</span>
  {#if channel.locked}
    <span class="ml-auto text-xs text-gray-500 dark:text-gray-400">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
        <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
      </svg>
    </span>
  {/if}
</div>