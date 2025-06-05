<script lang="ts">
  import { goto } from '$app/navigation';
  import { chatStore } from '../../store';
  
  // This is a stub component for the join page
  // It will list available channels and allow users to join them
  
  // Get channels from store
  $: channels = Object.values($chatStore.channels || {});
</script>

<div class="flex h-full w-full">
  <!-- Simple layout for join page -->
  <div class="w-full max-w-4xl mx-auto p-8">
    <h1 class="text-2xl font-bold mb-6">Join a Channel</h1>
    
    {#if channels.length === 0}
      <div class="bg-gray-50 dark:bg-dark-200 rounded-lg p-8 text-center">
        <h2 class="text-xl font-medium mb-2">No Channels Available</h2>
        <p class="text-gray-600 dark:text-gray-400 mb-6">
          There are no channels available to join. Create a new channel to get started.
        </p>
        <button 
          class="rounded-md bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:bg-primary-500 dark:hover:bg-primary-600 dark:focus:ring-offset-dark-100"
          on:click={() => {
            // This would open the create channel dialog
            // For now, just a placeholder
          }}>
          Create Channel
        </button>
      </div>
    {:else}
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        {#each channels as channel}
          <button 
            class="bg-white dark:bg-dark-100 border border-gray-200 dark:border-dark-400 rounded-lg p-4 text-left hover:bg-gray-50 dark:hover:bg-dark-200 transition-colors"
            on:click={() => goto(`/c/${channel.meta.value.id}`)}
          >
            <div class="flex items-center">
              <div class="w-10 h-10 bg-primary-100 dark:bg-primary-900 rounded-md flex items-center justify-center text-primary-600 dark:text-primary-400 mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14"/>
                </svg>
              </div>
              <div>
                <h3 class="font-medium">{channel.meta.value.name}</h3>
                <p class="text-sm text-gray-600 dark:text-gray-400">
                  {#if channel.messages}
                    {Object.keys(channel.messages).length} messages
                  {:else}
                    No messages
                  {/if}
                </p>
              </div>
            </div>
          </button>
        {/each}
      </div>
    {/if}
  </div>
</div>
