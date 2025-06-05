<script lang="ts">
  import { store, currentUserIdStore, setAwarenessUser, clearAwarenessUser } from '../store'
  import Avatar from './Avatar.svelte'
  import { onMount } from 'svelte'
  
  let isSettingsOpen = false
  let editingUsername = ''
  let editingFullName = ''
  
  onMount(() => {
    // Set awareness when component is mounted
    if ($currentUserIdStore) {
      setAwarenessUser($currentUserIdStore)
    }
  })
  
  // Get current user from store
  $: currentUser = $currentUserIdStore ? $store.users[$currentUserIdStore] : null
  
  // Update local editing state when currentUser changes
  $: if (currentUser) {
    editingUsername = currentUser.meta.value.username
    editingFullName = currentUser.fullName || ''
  }
  
  function toggleSettings() {
    isSettingsOpen = !isSettingsOpen
  }
  
  function updateProfile() {
    if (!currentUser || !editingUsername.trim()) return
    
    // Create a new object for meta.value instead of modifying properties directly
    currentUser.meta.value = { 
      ...currentUser.meta.value,
      username: editingUsername.trim()
    }
    currentUser.fullName = editingFullName.trim() || undefined
    
    // Update awareness
    setAwarenessUser($currentUserIdStore)
    
    isSettingsOpen = false
  }
  
  function disclaim() {
    // Clear current user
    clearAwarenessUser()
    currentUserIdStore.set(null)
    isSettingsOpen = false
  }
</script>

{#if currentUser}
  <div class="relative mt-auto px-3 py-4">
    <div 
      class="flex cursor-pointer items-center justify-between rounded-md bg-gray-100 p-2 dark:bg-dark-300"
      on:click={toggleSettings}
    >
      <div class="flex items-center gap-2">
        <Avatar username={currentUser.meta.value.username} customImage={currentUser.avatar} size="sm" />
        <div class="truncate">
          <div class="truncate font-medium">
            {currentUser.meta.value.username}
          </div>
          {#if currentUser.fullName}
            <div class="truncate text-xs text-gray-500 dark:text-gray-400">
              {currentUser.fullName}
            </div>
          {/if}
        </div>
      </div>
      <div class="text-gray-500 dark:text-gray-400">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="1"></circle>
          <circle cx="12" cy="5" r="1"></circle>
          <circle cx="12" cy="19" r="1"></circle>
        </svg>
      </div>
    </div>
    
    {#if isSettingsOpen}
      <div class="absolute bottom-full left-3 right-3 mb-1 rounded-md border border-gray-200 bg-white p-3 shadow-lg dark:border-dark-400 dark:bg-dark-200">
        <h3 class="mb-3 font-semibold">User Settings</h3>
        
        <div class="mb-3">
          <label class="mb-1 block text-sm text-gray-700 dark:text-gray-300">
            Username
          </label>
          <input 
            type="text" 
            class="input w-full"
            bind:value={editingUsername} 
          />
        </div>
        
        <div class="mb-4">
          <label class="mb-1 block text-sm text-gray-700 dark:text-gray-300">
            Full Name (optional)
          </label>
          <input 
            type="text" 
            class="input w-full"
            bind:value={editingFullName} 
          />
        </div>
        
        <div class="flex flex-col gap-2">
          <button 
            class="btn btn-primary w-full"
            on:click={updateProfile}
            disabled={!editingUsername.trim()}
          >
            Update Profile
          </button>
          <button class="btn btn-ghost w-full text-red-500 hover:text-red-700" on:click={disclaim}>
            Sign Out
          </button>
        </div>
      </div>
    {/if}
  </div>
{/if}