<script lang="ts">
  import ChannelList from './ChannelList.svelte'
  import UserList from './UserList.svelte'
  import CurrentUser from './CurrentUser.svelte'
  import ThemeToggle from './ThemeToggle.svelte'
  import { Settings } from 'lucide-svelte'
  import { connectionStatus } from '../store'
  import { onMount } from 'svelte'
  import { setupUserPresenceNotifications, initializeChannelMemberships } from '../store/notifications'
  
  function goToSettings() {
    window.location.href = '/settings'
  }
  
  // Initialize notifications system when component mounts
  onMount(() => {
    // Initialize channel memberships
    initializeChannelMemberships()
    
    // Setup user presence notifications
    const unsubscribe = setupUserPresenceNotifications()
    
    return () => {
      // Clean up subscriptions when component unmounts
      if (unsubscribe) unsubscribe()
    }
  })
</script>

<aside class="flex h-full flex-col bg-gray-50 dark:bg-dark-200">
  <div class="flex items-center justify-between border-b border-gray-200 px-4 py-3 dark:border-dark-300">
    <div class="flex items-center gap-2">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-primary-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
      </svg>
      <h1 class="text-lg font-bold">YJS Chat</h1>
    </div>
    <div class="flex items-center gap-2">
      <div class="flex items-center text-xs">
        <span
          class={`mr-1 inline-block h-2 w-2 rounded-full ${
            $connectionStatus === 'connected' ? 'bg-green-500' : 'bg-red-500'
          }`}
        ></span>
        <span class="text-gray-500 dark:text-gray-400">
          {$connectionStatus === 'connected' ? 'Online' : 'Offline'}
        </span>
      </div>
      <ThemeToggle />
    </div>
  </div>
  
  <div class="flex flex-1 flex-col overflow-hidden">
    <div class="h-1/2 overflow-hidden">
      <ChannelList />
    </div>
    <div class="h-1/2 overflow-hidden border-t border-gray-200 dark:border-dark-300">
      <UserList />
    </div>
  </div>
  
  <!-- Settings button -->
  <div class="border-t border-gray-200 dark:border-dark-300 p-2">
    <button 
      class="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-dark-300"
      on:click={goToSettings}
    >
      <Settings class="h-4 w-4 text-gray-500 dark:text-gray-400" />
      <span>Settings</span>
    </button>
  </div>
  
  <CurrentUser />
</aside>