<script lang="ts">
  import { createEventDispatcher, onMount, onDestroy } from 'svelte'
  import { createDialog } from 'svelte-headlessui'
  import { X } from 'lucide-svelte'
  import { fade, scale } from 'svelte/transition'
  import { store, updateChannel, clearChannelMessages, toggleChannelLock, deleteChannel } from '$lib/store'
  
  export let channel: any | null = null
  export let openModal = false // Controlled by parent
  
  const dispatch = createEventDispatcher<{ close: void }>()
  const dialog = createDialog({ label: 'Channel Settings' })
  
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
    
    internalCloseTrigger()
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
      internalCloseTrigger()
    }
  }
  
  // Close the settings
  // Synchronize dialog state with openModal prop
  $: if (openModal && !$dialog.expanded) {
    dialog.open()
  } else if (!openModal && $dialog.expanded) {
    dialog.close() // This might be redundant if parent always sets openModal=false on 'close' event
  }

  // Inform parent when dialog is closed internally
  let unsubscribeExpanded: (() => void) | undefined;
  onMount(() => {
    unsubscribeExpanded = dialog.subscribe(dialogState => {
      if (!dialogState.expanded && openModal) {
        dispatch('close')
      }
    });
  });

  onDestroy(() => {
    if (unsubscribeExpanded) {
      unsubscribeExpanded();
    }
  });

  function internalCloseTrigger() {
    // Called by X button, backdrop, Save, Cancel etc.
    // svelte-headlessui will set $dialog.expanded to false
    // The subscription above will then dispatch 'close' to parent if needed.
    dialog.close();
  }
</script>

{#if $dialog.expanded}
<div class="relative z-50" transition:fade={{ duration: 150 }}>
  <div 
    class="fixed inset-0 bg-black/30 dark:bg-black/50"
    aria-hidden="true"
    on:click={internalCloseTrigger}
    transition:fade={{ duration: 150 }}
  ></div>

  <div class="fixed inset-0 overflow-y-auto">
    <div class="flex min-h-full items-center justify-center p-4 text-center">
      <div
        class="w-full max-w-md transform overflow-hidden rounded-lg bg-white p-0 text-left align-middle shadow-xl transition-all dark:bg-dark-200"
        use:dialog.modal
        transition:scale={{ duration: 150, start: 0.95, opacity:0 }}
      >
    <div class="flex items-center justify-between border-b border-gray-200 p-4 dark:border-dark-400">
      <h3 class="text-lg font-medium leading-6 text-gray-900 dark:text-gray-100" id="modal-title">Channel Settings</h3>
      <button
        type="button"
        class="rounded-md p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-hidden focus:ring-2 focus:ring-primary-500 dark:text-gray-500 dark:hover:bg-dark-300 dark:hover:text-gray-400"
        on:click={internalCloseTrigger}
      >
        <X size={20} aria-hidden="true" />
        <span class="sr-only">Close</span>
      </button>
    </div>
    
    <div class="p-4">
      <div class="mb-4">
        <label for="channel-name-input" class="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
          Channel Name
        </label>
        <div class="flex items-center">
          <span class="mr-1 text-gray-500 dark:text-gray-400">#</span>
          <input
            id="channel-name-input"
            type="text"
            class="input w-full"
            bind:value={editingName}
          />
        </div>
      </div>
      
      <div class="mb-6">
        <label for="channel-description-input" class="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
          Description
        </label>
        <textarea
          id="channel-description-input"
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
      <button class="btn btn-ghost mr-2" on:click={internalCloseTrigger}>
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
  </div>
</div>
{/if}