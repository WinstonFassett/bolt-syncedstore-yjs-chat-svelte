<script lang="ts">
  import ChannelList from './ChannelList.svelte'
  import UserList from './UserList.svelte'
  import CurrentUser from './CurrentUser.svelte'
  import ThemeToggle from './ThemeToggle.svelte'
  import { Settings } from 'lucide-svelte'
  import { connectionStatus, persistenceProvider } from '$lib/store'
  import { onMount } from 'svelte'
  import { setupUserPresenceNotifications, initializeChannelMemberships, setupMessageNotifications } from '$lib/store/notifications'
  
  function goToSettings() {
    window.location.href = '/settings'
  }
  
  let unsubscribePresence: (() => void) | undefined;
  let unsubscribeMessages: (() => void) | undefined;
  
  // Initialize notifications system when component mounts
  onMount(() => {
    // Initialize channel memberships
    initializeChannelMemberships()
    
    // Wait for persistence to be loaded before setting up notifications
    persistenceProvider.whenSynced.then(() => {
      console.log('Persistence loaded, initializing notifications')
      
      // NO!!! NONE OF THIS YOU ASSHOLE. NOT IN THE FUCKING SIDEBAR
      // Initialize tracking with current state
      // setupUserPresenceNotifications(true)
      // setupMessageNotifications(true)
      
      // // Setup user presence notifications
      // unsubscribePresence = setupUserPresenceNotifications()
      
      // Setup message notifications
      // unsubscribeMessages = setupMessageNotifications()
    })
    
    return () => {
      // Clean up subscriptions when component unmounts
      if (unsubscribePresence) unsubscribePresence()
      if (unsubscribeMessages) unsubscribeMessages()
    }
  })
</script>

<!-- <aside class="flex h-full flex-col bg-gray-50 dark:bg-dark-200"> -->
  
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
<!-- </aside> -->