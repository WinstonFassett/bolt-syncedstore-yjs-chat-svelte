<script lang="ts">
  import { store } from '$lib/store'
  import ChannelItem from './ChannelItem.svelte'
  import { createDialog } from 'svelte-headlessui'
  import { Plus, X } from 'lucide-svelte'
  import { boxed } from '@syncedstore/core'
  import { fade, scale } from 'svelte/transition'
  
  const dialog = createDialog({ label: 'Create Channel' })
  
  let newChannelName = ''
  let newChannelDescription = ''
  
  function handleCreateChannel() {
    if (!newChannelName.trim()) return
    
    const channelId = crypto.randomUUID()
    const now = Date.now()

    $store.channels[channelId] = {
      meta: boxed({
        id: channelId,
        createdAt: now
      }),
      name: newChannelName.trim(),
      description: newChannelDescription.trim(),
      messages: {}
    }

    dialog.close()
    newChannelName = ''
    newChannelDescription = ''
  }

  // Get sorted channels
  $: channels = Object.values($store.channels).sort((a, b) => 
    a.name.localeCompare(b.name)
  )
</script>

<div class="flex h-full flex-col">
  <div class="mb-2 flex items-center justify-between px-3 py-2">
    <h2 class="text-sm font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
      Channels
    </h2>
    <button 
      class="rounded-sm p-1 text-gray-500 transition-colors hover:bg-gray-200 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-dark-300 dark:hover:text-gray-200"
      on:click={dialog.open}
      aria-label="Add channel"
    >
      <Plus size={16} />
    </button>
  </div>
  
  <div class="overflow-y-auto overflow-x-hidden">
    {#if channels.length === 0}
      <div class="px-3 py-2 text-sm text-gray-500 dark:text-gray-400">
        No channels yet
      </div>
    {:else}
      {#each channels as channel (channel.meta.value.id)}
        <ChannelItem {channel} />
      {/each}
    {/if}
  </div>
</div>

{#if $dialog.expanded}
<div class="relative z-10" transition:fade={{ duration: 200 }}>
  <div 
    class="fixed inset-0 bg-black/25" 
    aria-label="close" 
    on:click={dialog.close}
    transition:fade={{ duration: 200 }}
  ></div>

  <div class="fixed inset-0 overflow-y-auto">
    <div class="flex min-h-full items-center justify-center p-4 text-center">
      <div
        class="w-full max-w-md transform overflow-hidden rounded-lg bg-white p-6 text-left align-middle shadow-xl transition-all dark:bg-dark-200"
        use:dialog.modal
        transition:scale={{ duration: 200, start: 0.95 }}
      >
        <form on:submit|preventDefault={handleCreateChannel}>
        <div class="mb-4 flex items-center justify-between">
          <h3 class="text-lg font-medium">Create Channel</h3>
          <button
            class="rounded-sm p-1 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-dark-300 dark:hover:text-gray-200"
            on:click={dialog.close}
          >
            <X size={20} />
          </button>
        </div>

        <div class="mb-4">
          <label for="new-channel-name" class="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Channel Name <span class="text-red-500">*</span>
          </label>
          <div class="flex items-center">
            <span class="mr-1 text-gray-500 dark:text-gray-400">#</span>
            <input
              id="new-channel-name"
              type="text"
              class="input w-full"
              placeholder="e.g. general"
              bind:value={newChannelName}
            />
          </div>
        </div>

        <div class="mb-6">
          <label for="new-channel-description" class="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Description (optional)
          </label>
          <input
            id="new-channel-description"
            type="text"
            class="input w-full"
            placeholder="What's this channel about?"
            bind:value={newChannelDescription}
          />
        </div>

        <div class="flex justify-end gap-2">
          <button class="btn btn-ghost" on:click={dialog.close}>
            Cancel
          </button>
          <button 
            class="btn btn-primary"
            on:click={handleCreateChannel}
            disabled={!newChannelName.trim()}
          >
            Create Channel
          </button>
        </div>
        </form>
      </div>
    </div>
  </div>
</div>
{/if}