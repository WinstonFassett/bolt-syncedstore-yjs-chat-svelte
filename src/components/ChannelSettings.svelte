<script lang="ts">
  import { createEventDispatcher } from 'svelte'
  import { store, updateChannel, clearChannelMessages, toggleChannelLock, deleteChannel } from '../store'
  
  export let channel: any | null = null
  
  const dispatch = createEventDispatcher<{
    close: void
  }>()
  
  // Local state for editing
  let editingName = ''
  let editingDescription = ''
  let confirmDelete = false
  let confirmClear = false
  
  // Update from channel when it changes
  $: if (channel) {
    editingName = channel.name
    editingDescription = channel.description
  }
  
  // Update the channel
  function saveChanges() {
    if (!channel || !editingName.trim()) return
    
    updateChannel(
      channel.meta.value.id,
      editingName.trim(),
      editingDescription.trim()
    )
    
    dispatch('close')
  }
  
  // Toggle channel lock
  function handleToggleLock() {
    if (!channel) return
    
    toggleChannelLock(channel.meta.value.id)
  }
  
  // Clear all messages in the channel
  function handleClearMessages() {
    if (!channel) return
    
    clearChannelMessages(channel.meta.value.id)
    confirmClear = false
  }
  
  // Delete the channel
  function handleDeleteChannel() {
    if (!channel) return
    
    const success = deleteChannel(channel.meta.value.id)
    if (success) {
      dispatch('close')
    }
  }
  
  // Close the settings
  function close() {
    dispatch('close')
  }
</script>

<div class="fixed inset-0 z-10 flex items-center justify-center bg-black bg-opacity-50 p-4">
  <div class="w-full max-w-md rounded-lg bg-white dark:bg-dark-200">
    <div class="flex items-center justify-between border-b border-gray-200 p-4 dark:border-dark-400">
      <h3 class="text-lg font-medium">Channel Settings</h3>
      <button
        class="rounded p-1 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-dark-300 dark:hover:text-gray-200"
        on:click={close}
        aria-label="Close"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
    </div>
    
    <div class="p-4">
      <div class="mb-4">
        <label class="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
          Channel Name
        </label>
        <div class="flex items-center">
          <span class="mr-1 text-gray-500 dark:text-gray-400">#</span>
          <input
            type="text"
            class="input w-full"
            bind:value={editingName}
          />
        </div>
      </div>
      
      <div class="mb-6">
        <label class="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
          Description
        </label>
        <textarea
          class="input w-full"
          rows="3"
          bind:value={editingDescription}
        ></textarea>
      </div>
      
      <div class="space-y-4">
        <!-- Lock/Unlock Channel -->
        <div>
          <button 
            class="btn w-full {channel?.locked ? 'btn-primary' : 'btn-ghost border border-gray-300 dark:border-dark-400'}"
            on:click={handleToggleLock}
          >
            {channel?.locked ? 'Unlock Channel' : 'Lock Channel'}
          </button>
          <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
            {channel?.locked 
              ? 'Locked channels cannot receive new messages.' 
              : 'Locking will prevent new messages from being sent.'}
          </p>
        </div>
        
        <!-- Clear Messages -->
        <div>
          {#if confirmClear}
            <div class="rounded-md border border-yellow-300 bg-yellow-50 p-3 dark:border-yellow-800 dark:bg-yellow-900/30">
              <p class="text-sm text-yellow-800 dark:text-yellow-200">Are you sure? This cannot be undone.</p>
              <div class="mt-2 flex justify-end gap-2">
                <button class="btn btn-ghost text-xs" on:click={() => confirmClear = false}>
                  Cancel
                </button>
                <button class="btn btn-danger text-xs" on:click={handleClearMessages}>
                  Yes, Clear All
                </button>
              </div>
            </div>
          {:else}
            <button class="btn btn-ghost w-full border border-gray-300 text-gray-700 dark:border-dark-400 dark:text-gray-300" on:click={() => confirmClear = true}>
              Clear All Messages
            </button>
          {/if}
        </div>
        
        <!-- Delete Channel -->
        <div>
          {#if confirmDelete}
            <div class="rounded-md border border-red-300 bg-red-50 p-3 dark:border-red-800 dark:bg-red-900/30">
              <p class="text-sm text-red-800 dark:text-red-200">Are you sure? This will delete the channel and all its messages.</p>
              <div class="mt-2 flex justify-end gap-2">
                <button class="btn btn-ghost text-xs" on:click={() => confirmDelete = false}>
                  Cancel
                </button>
                <button class="btn btn-danger text-xs" on:click={handleDeleteChannel}>
                  Yes, Delete
                </button>
              </div>
            </div>
          {:else}
            <button class="btn btn-danger w-full" on:click={() => confirmDelete = true}>
              Delete Channel
            </button>
          {/if}
        </div>
      </div>
    </div>
    
    <div class="flex justify-end border-t border-gray-200 p-4 dark:border-dark-400">
      <button class="btn btn-ghost mr-2" on:click={close}>
        Cancel
      </button>
      <button 
        class="btn btn-primary"
        on:click={saveChanges}
        disabled={!editingName.trim()}
      >
        Save Changes
      </button>
    </div>
  </div>
</div>