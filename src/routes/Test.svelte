<script lang="ts">
  import { store, addUser, addMessage } from '$lib/store/test'
  
  let newUserName = $state('')
  let newUserAge = $state(0)
  let newMessage = $state('')
  
  function handleAddUser() {
    if (!newUserName.trim()) return
    const id = crypto.randomUUID()
    addUser(id, newUserName, newUserAge)
    newUserName = ''
    newUserAge = 0
  }
  
  function handleAddMessage() {
    if (!newMessage.trim()) return
    addMessage(newMessage)
    newMessage = ''
  }
</script>

<div class="p-4">
  <h1 class="text-2xl font-bold mb-4">SyncedStore Test</h1>
  
  <div class="mb-8">
    <h2 class="text-xl font-semibold mb-2">Add User</h2>
    <div class="flex gap-2 mb-4">
      <input
        type="text"
        class="input"
        placeholder="Name"
        bind:value={newUserName}
      />
      <input
        type="number"
        class="input"
        placeholder="Age"
        bind:value={newUserAge}
      />
      <button class="btn btn-primary" on:click={handleAddUser}>
        Add User
      </button>
    </div>
    
    <h3 class="font-medium mb-2">Users:</h3>
    <ul class="list-disc pl-5">
      {#each  Object.entries($store.users) as [userId, user]}
        <li>{user.name} ({user.age} years old)</li>
      {/each}
    </ul>
  </div>
  
  <div>
    <h2 class="text-xl font-semibold mb-2">Add Message</h2>
    <div class="flex gap-2 mb-4">
      <input
        type="text"
        class="input flex-1"
        placeholder="Message"
        bind:value={newMessage}
      />
      <button class="btn btn-primary" on:click={handleAddMessage}>
        Send
      </button>
    </div>
    
    <h3 class="font-medium mb-2">Messages:</h3>
    <ul class="list-disc pl-5">
      {#each $store.messages as message}
        <li>{message}</li>
      {/each}
    </ul>
  </div>
</div>