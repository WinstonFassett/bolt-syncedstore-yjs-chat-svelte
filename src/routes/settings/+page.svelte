<script lang="ts">
  import { goto } from '$app/navigation';
  import { Cog, User, Monitor, ArrowLeft } from 'lucide-svelte';
  import { currentUserIdStore, store } from '../../store';
  
  // Tabs for different settings sections
  const tabs = [
    { id: 'user', label: 'User Settings', icon: User },
    { id: 'client', label: 'Client Settings', icon: Cog },
    { id: 'device', label: 'Device Settings', icon: Monitor }
  ];
  
  // Active tab
  let activeTab = 'user';
  
  // Get current user
  $: currentUser = $currentUserIdStore ? 
    Object.values($store.users || {}).find(user => user.meta.value.id === $currentUserIdStore) : 
    null;
</script>

<div class="flex h-full w-full">
  <!-- Settings layout -->
  <div class="w-full max-w-6xl mx-auto p-4 md:p-8">
    <!-- Header with back button -->
    <div class="flex items-center mb-8">
      <button 
        class="mr-4 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-dark-200"
        on:click={() => goto('/')}
      >
        <ArrowLeft class="w-5 h-5" />
      </button>
      <h1 class="text-2xl font-bold">Settings</h1>
    </div>
    
    <!-- Tabs -->
    <div class="border-b border-gray-200 dark:border-dark-400 mb-8">
      <div class="flex space-x-8">
        {#each tabs as tab}
          <button 
            class="py-4 px-1 border-b-2 font-medium text-sm flex items-center {activeTab === tab.id ? 'border-primary-500 text-primary-600 dark:text-primary-400' : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'}"
            on:click={() => activeTab = tab.id}
          >
            <svelte:component this={tab.icon} class="w-5 h-5 mr-2" />
            {tab.label}
          </button>
        {/each}
      </div>
    </div>
    
    <!-- Tab content -->
    <div class="bg-white dark:bg-dark-100 rounded-lg shadow-sm p-6">
      {#if activeTab === 'user'}
        <div>
          <h2 class="text-lg font-medium mb-6">User Settings</h2>
          
          {#if currentUser}
            <div class="space-y-6">
              <!-- User profile settings -->
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Username
                </label>
                <input 
                  type="text" 
                  value={currentUser.username}
                  class="w-full max-w-md rounded-md border-gray-300 shadow-xs focus:border-primary-500 focus:ring-primary-500 dark:bg-dark-200 dark:border-dark-400 dark:text-white"
                  disabled
                />
                <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Username cannot be changed
                </p>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Full Name
                </label>
                <input 
                  type="text" 
                  value={currentUser.meta.value.fullName}
                  class="w-full max-w-md rounded-md border-gray-300 shadow-xs focus:border-primary-500 focus:ring-primary-500 dark:bg-dark-200 dark:border-dark-400 dark:text-white"
                />
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Avatar URL
                </label>
                <input 
                  type="text" 
                  value={currentUser.meta.value.avatarUrl}
                  class="w-full max-w-md rounded-md border-gray-300 shadow-xs focus:border-primary-500 focus:ring-primary-500 dark:bg-dark-200 dark:border-dark-400 dark:text-white"
                />
                <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Enter a URL to an image for your avatar
                </p>
              </div>
              
              <div>
                <button class="rounded-md bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700 focus:outline-hidden focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:bg-primary-500 dark:hover:bg-primary-600 dark:focus:ring-offset-dark-100">
                  Save Changes
                </button>
              </div>
            </div>
          {:else}
            <p>User not found</p>
          {/if}
        </div>
      {:else if activeTab === 'client'}
        <div>
          <h2 class="text-lg font-medium mb-6">Client Settings</h2>
          
          <div class="space-y-6">
            <!-- Theme settings -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Theme
              </label>
              <select class="w-full max-w-md rounded-md border-gray-300 shadow-xs focus:border-primary-500 focus:ring-primary-500 dark:bg-dark-200 dark:border-dark-400 dark:text-white">
                <option value="system">System Default</option>
                <option value="light">Light</option>
                <option value="dark">Dark</option>
              </select>
            </div>
            
            <!-- Notification settings -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Notifications
              </label>
              <div class="space-y-2">
                <div class="flex items-center">
                  <input 
                    type="checkbox" 
                    id="notify-messages"
                    class="h-4 w-4 rounded-sm border-gray-300 text-primary-600 focus:ring-primary-500 dark:border-dark-400"
                  />
                  <label for="notify-messages" class="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                    New messages
                  </label>
                </div>
                <div class="flex items-center">
                  <input 
                    type="checkbox" 
                    id="notify-mentions"
                    class="h-4 w-4 rounded-sm border-gray-300 text-primary-600 focus:ring-primary-500 dark:border-dark-400"
                  />
                  <label for="notify-mentions" class="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                    Mentions only
                  </label>
                </div>
              </div>
            </div>
            
            <div>
              <button class="rounded-md bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700 focus:outline-hidden focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:bg-primary-500 dark:hover:bg-primary-600 dark:focus:ring-offset-dark-100">
                Save Changes
              </button>
            </div>
          </div>
        </div>
      {:else if activeTab === 'device'}
        <div>
          <h2 class="text-lg font-medium mb-6">Device Settings</h2>
          
          <div class="space-y-6">
            <!-- Storage settings -->
            <div>
              <h3 class="text-md font-medium mb-2">Local Storage</h3>
              <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Manage how much data is stored on your device
              </p>
              
              <div class="flex items-center justify-between max-w-md p-4 bg-gray-50 dark:bg-dark-200 rounded-lg">
                <div>
                  <p class="font-medium">Clear local data</p>
                  <p class="text-sm text-gray-600 dark:text-gray-400">
                    This will clear all locally stored data
                  </p>
                </div>
                <button class="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 focus:outline-hidden focus:ring-2 focus:ring-red-500 focus:ring-offset-2">
                  Clear Data
                </button>
              </div>
            </div>
            
            <!-- Connection settings -->
            <div>
              <h3 class="text-md font-medium mb-2">Connection</h3>
              <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Manage your connection settings
              </p>
              
              <div class="flex items-center">
                <input 
                  type="checkbox" 
                  id="offline-mode"
                  class="h-4 w-4 rounded-sm border-gray-300 text-primary-600 focus:ring-primary-500 dark:border-dark-400"
                />
                <label for="offline-mode" class="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                  Work offline (changes will sync when you reconnect)
                </label>
              </div>
            </div>
          </div>
        </div>
      {/if}
    </div>
  </div>
</div>
