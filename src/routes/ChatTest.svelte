<script lang="ts">
  import { store, currentUserIdStore, currentChannelIdStore, getUserByUsername, addMessage, initializeStore } from '../store'
  
  let username = $state('')
  let messageText = $state('')
  
  function handleSetupUser() {
    if (!username.trim()) return
    const { id } = getUserByUsername(username)
    currentUserIdStore.set(id)
    initializeStore()
  }
  
  function handleSendMessage() {
    if (!messageText.trim() || !$currentUserIdStore || !$currentChannelIdStore) return
    addMessage($currentChannelIdStore, $currentUserIdStore, messageText)
    messageText = ''
  }
</script>

<div class="p-4">
  <h1 class="text-2xl font-bold mb-4">Chat Test</h1>
  
  {#if !$currentUserIdStore}
    <div class="mb-8">
      <h2 class="text-xl font-semibold mb-2">Set Up User</h2>
      <div class="flex gap-2">
        <input
          type="text"
          class="input"
          placeholder="Username"
          bind:value={username}
        />
        <button class="btn btn-primary" on:click={handleSetupUser}>
          Set User
        </button>
      </div>
    </div>
  {:else}
    <div class="mb-8">
      <h2 class="text-xl font-semibold mb-2">Current Channel: {$store.channels[$currentChannelIdStore]?.name}</h2>
      <div class="flex gap-2">
        <input
          type="text"
          class="input flex-1"
          placeholder="Message"
          bind:value={messageText}
        />
        <button class="btn btn-primary" on:click={handleSendMessage}>
          Send
        </button>
      </div>
      
      <div class="mt-4">
        <h3 class="font-medium mb-2">Messages:</h3>
        <div class="space-y-2">
          {#each Object.values($store.channels[$currentChannelIdStore]?.messages ?? {}) as message}
            <div class="p-2 bg-gray-100 rounded dark:bg-dark-200">
              <div class="text-sm text-gray-600 dark:text-gray-400">
                {$store.users[message.meta.value.userId]?.meta.value.username}:
              </div>
              <div>{message.text}</div>
            </div>
          {/each}
        </div>
      </div>
    </div>
  {/if}
  
  <div class="mb-8">
    <h2 class="text-xl font-semibold mb-2">Debug Info</h2>
    <div class="space-y-2 text-sm font-mono">
      <div>Current User: {$currentUserIdStore}</div>
      <div>Current Channel: {$currentChannelIdStore}</div>
      <div>Users: {Object.keys($store.users).length}</div>
      <div>Channels: {Object.keys($store.channels).length}</div>
    </div>
  </div>
</div>