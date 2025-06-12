<script lang="ts">
  import * as Dialog from '$lib/components/ui/dialog/index.js'
  import { channelSettingsDialog } from '$lib/stores/dialogs'
  import type { Channel } from '$lib/store'
  
  export let channel: Channel | null = null
  
  function openSettings() {
    if (channel) {
      channelSettingsDialog.open(channel)
    }
  }
</script>

<div class="flex-1 flex h-14 items-center justify-between px-4">
  {#if channel}
    <div>
      <div class="flex items-center">
        <span class="mr-1 text-xl font-medium">#{channel.name}</span>
        {#if channel.locked}
          <span class="text-xs text-gray-500 dark:text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
            </svg>
          </span>
        {/if}
      </div>
      {#if channel.description}
        <div class="hidden text-sm text-gray-600 dark:text-gray-400 sm:block">
          {channel.description}
        </div>
      {/if}
    </div>
    
    <Dialog.Root>
      <Dialog.Trigger
        class="rounded-sm p-1 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-dark-300 dark:hover:text-gray-200"
        on:click={openSettings}
        aria-label="Channel settings"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="3"></circle>
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
        </svg>
      </Dialog.Trigger>
      <Dialog.Content>
        <!-- ChannelSettings component will be rendered here via the dialog store -->
      </Dialog.Content>
    </Dialog.Root>
  {:else}
    <div>
      <div class="h-6 w-32 animate-pulse rounded-sm bg-gray-200 dark:bg-dark-300"></div>
      <div class="mt-1 h-4 w-48 animate-pulse rounded-sm bg-gray-200 dark:bg-dark-300"></div>
    </div>
  {/if}
</div>