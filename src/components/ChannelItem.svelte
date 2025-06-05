<script lang="ts">
  import { goto } from '$app/navigation';
  import { currentChannelIdStore, currentUserIdStore } from '../store';
  import { channelMemberships, joinChannel, leaveChannel, isChannelMember } from '../store/notifications';
  import { LogIn, LogOut } from 'lucide-svelte';
  
  export let channel: any;
  
  $: isActive = $currentChannelIdStore === channel.meta.value.id;
  $: channelId = channel.meta.value.id;
  $: userId = $currentUserIdStore;
  $: isMember = userId ? isChannelMember(channelId, userId) : false;

  function selectChannel() {
    // Update the current channel ID in the store
    currentChannelIdStore.set(channelId);
    
    // If not already a member, join the channel
    if (userId && !isMember) {
      joinChannel(channelId, userId);
    }
    
    // Navigate to the channel route
    // Note: We don't close thread panel here to maintain thread view when switching channels
    goto(`/c/${channelId}`);
  }
  
  function toggleMembership(event: MouseEvent) {
    event.stopPropagation(); // Prevent channel selection
    
    if (!userId) return;
    
    if (isMember) {
      leaveChannel(channelId, userId);
    } else {
      joinChannel(channelId, userId);
    }
  }
</script>

<div 
  class="channel-item {isActive ? 'active' : ''} {isMember ? 'member' : ''}"
  on:click={selectChannel}
  role="button"
  tabindex="0"
>
  <span class="mr-2 text-gray-400">#</span>
  <span class="truncate">{channel.name}</span>
  
  <div class="ml-auto flex items-center">
    {#if channel.locked}
      <span class="text-xs text-gray-500 dark:text-gray-400 mr-1">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
          <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
        </svg>
      </span>
    {/if}
    
    <!-- Join/Leave button -->
    <button 
      class="membership-toggle"
      on:click={toggleMembership}
      title={isMember ? "Leave channel" : "Join channel"}
    >
      {#if isMember}
        <LogOut size={14} />
      {:else}
        <LogIn size={14} />
      {/if}
    </button>
  </div>
</div>

<style>
  .channel-item {
    display: flex;
    align-items: center;
    padding: 0.5rem 1rem;
    cursor: pointer;
    color: #374151;
    font-size: 0.875rem;
    transition: background-color 0.2s;
    border-radius: 0.25rem;
    margin: 0 0.5rem 0.125rem 0.5rem;
  }
  
  .channel-item:hover {
    background-color: rgba(0, 0, 0, 0.05);
  }
  
  .channel-item.active {
    background-color: rgba(59, 130, 246, 0.1);
    color: #3b82f6;
  }
  
  .channel-item.member {
    font-weight: 500;
  }
  
  .membership-toggle {
    opacity: 0;
    padding: 0.25rem;
    border-radius: 0.25rem;
    color: #6b7280;
    transition: all 0.2s;
  }
  
  .channel-item:hover .membership-toggle {
    opacity: 0.7;
  }
  
  .membership-toggle:hover {
    opacity: 1 !important;
    background-color: rgba(0, 0, 0, 0.05);
  }
  
  :global(.dark) .channel-item {
    color: #e5e7eb;
  }
  
  :global(.dark) .channel-item:hover {
    background-color: rgba(255, 255, 255, 0.05);
  }
  
  :global(.dark) .channel-item.active {
    background-color: rgba(59, 130, 246, 0.2);
    color: #60a5fa;
  }
  
  :global(.dark) .membership-toggle:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }
</style>