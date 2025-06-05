<script lang="ts">
  import { createEventDispatcher } from 'svelte'
  import { getUserByUsername, currentUserIdStore, setAwarenessUser, chatStore } from '../store'
  import { getGravatarUrl } from '../utils/avatar'
  
  const dispatch = createEventDispatcher<{
    complete: void
  }>()
  
  // Form state
  let username = ''
  let fullName = ''
  let isSubmitting = false
  let errorMessage = ''
  
  // Validate input
  $: isValid = username.trim().length >= 3
  $: gravatarUrl = isValid ? getGravatarUrl(username, 80) : ''
  
  // Submit the form
  async function handleSubmit() {
    if (!isValid) return
    
    isSubmitting = true
    errorMessage = ''
    
    try {
      // Get or create user
      const { id } = getUserByUsername(username.trim())
      
      // Set current user
      currentUserIdStore.set(id)
      
      // If fullName is provided, update it
      if (fullName.trim()) {
        const user = $chatStore.users[id]
        if (user) {
          user.fullName = fullName.trim()
        }
      }
      
      // Set awareness
      setAwarenessUser(id)
      
      // Complete setup
      dispatch('complete')
    } catch (error) {
      errorMessage = 'An error occurred. Please try again.'
      console.error(error)
    } finally {
      isSubmitting = false
    }
  }
</script>

<div class="fixed inset-0 z-10 flex items-center justify-center bg-black bg-opacity-50 p-4">
  <div class="w-full max-w-md rounded-lg bg-white p-6 dark:bg-dark-200">
    <div class="text-center">
      <h2 class="mb-2 text-2xl font-bold">Welcome to YJS Chat</h2>
      <p class="mb-6 text-gray-600 dark:text-gray-400">
        Set up your profile to get started
      </p>
    </div>
    
    <form on:submit|preventDefault={handleSubmit}>
      <div class="mb-6 flex flex-col items-center">
        {#if gravatarUrl}
          <div class="mb-2 h-20 w-20 overflow-hidden rounded-full">
            <img src={gravatarUrl} alt="Avatar preview" class="h-full w-full object-cover" />
          </div>
          <p class="text-xs text-gray-500 dark:text-gray-400">
            Avatar from Gravatar
          </p>
        {/if}
      </div>
      
      <div class="mb-4">
        <label class="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
          Username <span class="text-red-500">*</span>
        </label>
        <input
          type="text"
          class="input w-full"
          bind:value={username}
          placeholder="Choose a username"
          required
          minlength="3"
        />
        <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
          This will be your display name (minimum 3 characters)
        </p>
      </div>
      
      <div class="mb-6">
        <label class="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
          Full Name (optional)
        </label>
        <input
          type="text"
          class="input w-full"
          bind:value={fullName}
          placeholder="Your full name"
        />
      </div>
      
      {#if errorMessage}
        <div class="mb-4 rounded-md bg-red-50 p-3 dark:bg-red-900/20">
          <p class="text-sm text-red-700 dark:text-red-400">{errorMessage}</p>
        </div>
      {/if}
      
      <button
        type="submit"
        class="btn btn-primary w-full"
        disabled={!isValid || isSubmitting}
      >
        {isSubmitting ? 'Setting up...' : 'Get Started'}
      </button>
    </form>
  </div>
</div>