<script lang="ts">
  import { writable } from 'svelte/store';
  import { BellOff, X } from 'lucide-svelte';
  import { fade } from 'svelte/transition';
  
  // We're now using toast notifications instead of a notification panel
  // This component is kept for backwards compatibility but with minimal functionality
  
  // Simple dialog state for Svelte 5
  let isOpen = false;
  
  function openDialog() {
    isOpen = true;
  }
  
  function closeDialog() {
    isOpen = false;
  }
</script>

<!-- Notification Bell Button -->
<button 
  class="relative rounded-sm p-1.5 text-gray-600 transition-colors hover:bg-gray-200 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-dark-300 dark:hover:text-gray-200"
  on:click={openDialog}
  aria-label="Notifications"
>
  <BellOff size={20} />
</button>

<!-- Notification Panel -->
{#if isOpen}
  <!-- Backdrop -->
  <div 
    class="fixed inset-0 z-40 bg-black/30 backdrop-blur-xs" 
    on:click={closeDialog}
    on:keydown={(e) => e.key === 'Escape' && closeDialog()}
    role="button"
    tabindex="0"
    transition:fade={{ duration: 200 }}
  ></div>
  
  <!-- Panel -->
  <div 
    class="fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col bg-white shadow-xl dark:bg-dark-200 sm:h-full"
    transition:fade={{ duration: 200 }}
  >
    <!-- Header -->
    <div class="flex items-center justify-between border-b border-gray-200 p-4 dark:border-dark-400">
      <h2 class="text-lg font-medium">Notifications</h2>
      
      <div class="flex items-center gap-2">
        <button
          class="rounded-sm p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-dark-300 dark:hover:text-gray-200"
          on:click={closeDialog}
          title="Close notifications"
        >
          <X size={18} />
        </button>
      </div>
    </div>
    
    <!-- Notification List -->
    <div class="flex-1 overflow-y-auto p-4">
      <div class="flex h-full flex-col items-center justify-center text-center text-gray-500 dark:text-gray-400">
        <BellOff size={32} class="mb-2 opacity-50" />
        <p>Using toast notifications instead</p>
        <p class="mt-2 text-sm">Notifications now appear as toasts at the bottom of the screen</p>
      </div>
    </div>
  </div>
{/if}
