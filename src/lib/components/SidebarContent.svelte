<script lang="ts">
  import ChannelList from './ChannelList.svelte'
  import UserList from './UserList.svelte'
  import CurrentUser from './CurrentUser.svelte'
  import ThemeToggle from './ThemeToggle.svelte'
  import ShareWorkspaceDialog from './ShareWorkspaceDialog.svelte'
  import { connectionStatus, persistenceProvider } from '$lib/store'
  import { onMount } from 'svelte'
  import { setupUserPresenceNotifications, initializeChannelMemberships, setupMessageNotifications } from '$lib/store/notifications'
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
  
  <!-- Share Workspace Dialog button -->
  <div class="border-t border-gray-200 dark:border-dark-300 p-2">
    <ShareWorkspaceDialog />
  </div>
  
  <CurrentUser />
<!-- </aside> -->