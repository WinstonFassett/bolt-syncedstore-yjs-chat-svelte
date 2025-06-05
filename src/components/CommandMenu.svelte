<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { goto } from '$app/navigation';
  import { chatStore } from '../store';
  import { Search, Hash, Plus, User, Settings, Shield } from 'lucide-svelte';
  
  const dispatch = createEventDispatcher();
  
  // Get channels from store
  $: channels = Object.values($chatStore.channels || {});
  
  let searchQuery = '';
  let selectedIndex = 0;
  
  // Filter items based on search query
  $: filteredItems = [
    // Channels for navigation
    ...channels
      .filter(channel => !searchQuery || channel.meta.value.name.toLowerCase().includes(searchQuery.toLowerCase()))
      .map(channel => ({
        type: 'channel',
        id: channel.meta.value.id,
        name: channel.meta.value.name,
        icon: Hash,
        action: () => {
          goto(`/c/${channel.meta.value.id}`);
          dispatch('close');
        }
      })),
    
    // Commands
    {
      type: 'command',
      id: 'create-channel',
      name: 'Create Channel',
      icon: Plus,
      action: () => {
        // This would open the create channel dialog
        // For now, just close the command menu
        dispatch('close');
      }
    },
    {
      type: 'command',
      id: 'edit-profile',
      name: 'Edit User Profile',
      icon: User,
      action: () => {
        // This would open the user profile dialog
        // For now, navigate to settings
        goto('/settings');
        dispatch('close');
      }
    },
    {
      type: 'command',
      id: 'settings',
      name: 'Settings',
      icon: Settings,
      action: () => {
        goto('/settings');
        dispatch('close');
      }
    },
    {
      type: 'command',
      id: 'admin',
      name: 'Admin Panel',
      icon: Shield,
      action: () => {
        goto('/admin');
        dispatch('close');
      }
    }
  ].filter(item => 
    !searchQuery || 
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  function handleKeydown(event) {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      selectedIndex = (selectedIndex + 1) % filteredItems.length;
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      selectedIndex = (selectedIndex - 1 + filteredItems.length) % filteredItems.length;
    } else if (event.key === 'Enter') {
      event.preventDefault();
      if (filteredItems[selectedIndex]) {
        filteredItems[selectedIndex].action();
      }
    } else if (event.key === 'Escape') {
      event.preventDefault();
      dispatch('close');
    }
  }
</script>

<div 
  class="fixed inset-0 z-50 flex items-start justify-center pt-16 bg-black bg-opacity-50"
  on:click={() => dispatch('close')}
>
  <div 
    class="w-full max-w-md bg-white dark:bg-dark-100 rounded-lg shadow-xl overflow-hidden"
    on:click|stopPropagation
  >
    <!-- Search input -->
    <div class="flex items-center px-4 py-3 border-b border-gray-200 dark:border-dark-400">
      <Search class="w-5 h-5 text-gray-500 dark:text-gray-400 mr-3" />
      <input
        type="text"
        placeholder="Search channels and commands..."
        class="w-full bg-transparent border-none focus:ring-0 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
        bind:value={searchQuery}
        on:keydown={handleKeydown}
        autofocus
      />
    </div>
    
    <!-- Results list -->
    <div class="max-h-80 overflow-y-auto">
      {#if filteredItems.length === 0}
        <div class="px-4 py-3 text-gray-500 dark:text-gray-400 text-center">
          No results found
        </div>
      {:else}
        <div class="py-2">
          {#each filteredItems as item, index}
            <button
              class="w-full px-4 py-2 flex items-center text-left {selectedIndex === index ? 'bg-gray-100 dark:bg-dark-200' : ''}"
              on:click={item.action}
              on:mouseover={() => selectedIndex = index}
            >
              <svelte:component this={item.icon} class="w-5 h-5 mr-3 {item.type === 'channel' ? 'text-blue-500' : 'text-gray-500 dark:text-gray-400'}" />
              <span>{item.name}</span>
            </button>
          {/each}
        </div>
      {/if}
    </div>
    
    <!-- Footer with keyboard shortcuts -->
    <div class="px-4 py-2 border-t border-gray-200 dark:border-dark-400 text-xs text-gray-500 dark:text-gray-400 flex justify-between">
      <div>
        <span class="mr-2">↑↓</span> to navigate
      </div>
      <div>
        <span class="mr-2">↵</span> to select
      </div>
      <div>
        <span>esc</span> to close
      </div>
    </div>
  </div>
</div>
