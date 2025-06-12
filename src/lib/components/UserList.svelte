<script lang="ts">
  import { store, onlineUsers } from '$lib/store'
  import UserItem from './UserItem.svelte'
  
  // User filter state
  let showOnlineOnly = true
  
  // Get sorted users
  $: users = Object.values($store.users)
    .sort((a, b) => a.username.localeCompare(b.username))
  
  // Filter users based on online status
  $: filteredUsers = showOnlineOnly
    ? users.filter(user => $onlineUsers.has(user.meta.value.id))
    : users
</script>

<div class="flex h-full flex-col">
  <div class="mb-2 flex items-center justify-between px-3 py-2">
    <h2 class="text-sm font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
      Users
    </h2>
    <div class="flex items-center gap-1 rounded-sm bg-gray-100 text-xs dark:bg-dark-300">
      <button 
        class="px-2 py-1 rounded-l {showOnlineOnly ? 'bg-primary-600 text-white' : 'text-gray-600 dark:text-gray-300'}"
        on:click={() => showOnlineOnly = true}
      >
        Online
      </button>
      <button 
        class="px-2 py-1 rounded-r {!showOnlineOnly ? 'bg-primary-600 text-white' : 'text-gray-600 dark:text-gray-300'}"
        on:click={() => showOnlineOnly = false}
      >
        All
      </button>
    </div>
  </div>
  
  <div class="overflow-y-auto overflow-x-hidden">
    {#if filteredUsers.length === 0}
      <div class="px-3 py-2 text-sm text-gray-500 dark:text-gray-400">
        {showOnlineOnly ? 'No users online' : 'No users yet'}
      </div>
    {:else}
      {#each filteredUsers as user (user.meta.value.id)}
        <UserItem {user} />
      {/each}
    {/if}
  </div>
</div>