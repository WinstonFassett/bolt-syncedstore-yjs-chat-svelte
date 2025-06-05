<script lang="ts">
  import { store, currentUserIdStore, setAwarenessUser, clearAwarenessUser } from '../store'
  import Avatar from './Avatar.svelte'
  import { onMount } from 'svelte'
  import { createDialog } from 'svelte-headlessui'
  import { X } from 'lucide-svelte'
  import { fade, scale } from 'svelte/transition'
  
  const dialog = createDialog({ label: 'User Settings' });
  let editingUsername = ''
  let editingFullName = ''
  // editingAvatar input removed for consistency with ProfileSetup
  
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
    editingUsername = currentUser.username
    editingFullName = currentUser.fullName || ''
    // editingAvatar is no longer directly edited here
  }
  
  
  
  function updateProfile() {
    if (!currentUser || !editingUsername.trim()) return
    
    currentUser.username = editingUsername.trim()
    currentUser.fullName = editingFullName.trim() || undefined
    // currentUser.avatar is no longer updated through this form
    
    // Update awareness
    setAwarenessUser($currentUserIdStore)
    
    dialog.close()
  }

  
  
  function disclaim() {
    // Clear current user
    clearAwarenessUser()
    currentUserIdStore.set(null)
    dialog.close()
  }
</script>

{#if currentUser}
  {@const hasFullName = currentUser.fullName && currentUser.fullName.trim() !== ''}
  {@const displayUsername = currentUser.username}
  {@const displayFullName = hasFullName ? currentUser.fullName : ''}
  {@const showFullNameAsPrimary = hasFullName && displayFullName !== displayUsername}
  {@const showUsernameAsPrimary = !hasFullName || displayFullName === displayUsername}

  <div class="relative mt-auto px-3 py-4">
    <div 
      class="flex cursor-pointer items-center justify-between rounded-md bg-gray-100 p-2 dark:bg-dark-300"
      on:click={dialog.open}
      role="button"
      tabindex="0"
      on:keydown={(e) => { if (e.key === 'Enter' || e.key === ' ') dialog.open() }}
    >
      <div class="flex items-center gap-2">
        <Avatar username={currentUser.username} customImage={currentUser.avatar} size="sm" />
        <div class="truncate">
          {#if showFullNameAsPrimary}
            <div class="truncate font-medium" title={`Username: ${displayUsername}`}>
              {displayFullName}
            </div>
            <div class="truncate text-xs text-gray-500 dark:text-gray-400">
              {displayUsername}
            </div>
          {:else if showUsernameAsPrimary}
            <div class="truncate font-medium" title={hasFullName && displayFullName !== displayUsername ? `Full Name: ${displayFullName}` : (hasFullName ? `Full Name: ${displayFullName}` : '')}>
              {displayUsername}
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
  </div>

  {#if $dialog.expanded}
    <div class="relative z-50" transition:fade={{ duration: 150 }}>
      <div 
        class="fixed inset-0 bg-black/30 dark:bg-black/50"
        aria-hidden="true"
        on:click={dialog.close}
        transition:fade={{ duration: 150 }}
      ></div>

      <div class="fixed inset-0 overflow-y-auto">
        <div class="flex min-h-full items-end justify-center p-4 sm:items-center">
          <div
            class="w-full max-w-md transform rounded-lg bg-white p-4 text-left align-middle shadow-xl transition-all dark:bg-dark-200 sm:p-6"
            use:dialog.modal
            transition:scale={{ duration: 150, start: 0.95, opacity:0 }}
          >
            <div class="mb-4 flex items-center justify-between">
              <h3 class="text-lg font-medium leading-6 text-gray-900 dark:text-gray-100" id="modal-title">
                User Settings
              </h3>
              <button
                type="button"
                class="rounded-md p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:text-gray-500 dark:hover:bg-dark-300 dark:hover:text-gray-400"
                on:click={dialog.close}
              >
                <X size={20} aria-hidden="true" />
                <span class="sr-only">Close</span>
              </button>
            </div>

            <!-- Avatar Preview - Moved and Centered -->
            <form on:submit|preventDefault={updateProfile}>
            <div class="mb-4 flex flex-col items-center">
              <span class="mb-1 block text-xs font-medium text-gray-700 dark:text-gray-300">Avatar Preview:</span>
              <Avatar username={editingUsername} customImage={currentUser?.avatar} size="xl" />
              <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Avatar is based on Gravatar (from username) or existing custom image.
              </p>
            </div>

            <div class="mb-3">
              <label for="username-input" class="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Username
              </label>
              <input 
                id="username-input"
                type="text" 
                class="input w-full"
                bind:value={editingUsername} 
              />
            </div>
            
            <div class="mb-4">
              <label for="fullname-input" class="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Full Name (optional)
              </label>
              <input 
                id="fullname-input"
                type="text" 
                class="input w-full"
                bind:value={editingFullName} 
              />
            </div>

            <!-- Avatar URL input removed for consistency with ProfileSetup -->
            
            <div class="mt-6 flex flex-col gap-3 sm:flex-row-reverse">
              <button 
                type="button"
                class="btn btn-primary w-full sm:w-auto"
                on:click={updateProfile}
                disabled={!editingUsername.trim()}
              >
                Update Profile
              </button>
              <button 
                type="button"
                class="btn btn-ghost w-full text-red-600 hover:bg-red-100 hover:text-red-700 dark:text-red-500 dark:hover:bg-red-900/20 dark:hover:text-red-400 sm:w-auto"
                on:click={disclaim}
              >
                Sign Out
              </button>
              <button 
                type="button"
                class="btn btn-ghost mt-2 w-full sm:mt-0 sm:w-auto"
                on:click={dialog.close}
              >
                Cancel
              </button>
            </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  {/if}
{/if}