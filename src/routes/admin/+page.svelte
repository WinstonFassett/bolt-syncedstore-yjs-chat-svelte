<script lang="ts">
  import { goto } from '$app/navigation';
  import { ArrowLeft, Users, MessageSquare, Trash2, AlertTriangle } from 'lucide-svelte';
  import { store } from '$lib/store';
  
  // Tabs for different admin sections
  const tabs = [
    { id: 'users', label: 'Users', icon: Users },
    { id: 'channels', label: 'Channels', icon: MessageSquare },
    { id: 'danger', label: 'Danger Zone', icon: AlertTriangle }
  ];
  
  // Active tab
  let activeTab = 'users';
  
  // Get users and channels from store
  $: users = Object.values($store.users || {});
  $: channels = Object.values($store.channels || {});
</script>

<div class="flex h-full w-full">
  <!-- Admin layout -->
  <div class="w-full max-w-6xl mx-auto p-4 md:p-8">
    <!-- Header with back button -->
    <div class="flex items-center mb-8">
      <button 
        class="mr-4 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-dark-200"
        on:click={() => goto('/')}
      >
        <ArrowLeft class="w-5 h-5" />
      </button>
      <h1 class="text-2xl font-bold">Admin Panel</h1>
    </div>
    
    <!-- Warning banner -->
    <div class="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-8">
      <div class="flex">
        <div class="shrink-0">
          <AlertTriangle class="h-5 w-5 text-yellow-400" />
        </div>
        <div class="ml-3">
          <p class="text-sm text-yellow-700">
            This is the admin panel. Be careful with these settings as they can affect all users and data.
          </p>
        </div>
      </div>
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
      {#if activeTab === 'users'}
        <div>
          <h2 class="text-lg font-medium mb-6">User Management</h2>
          
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200 dark:divide-dark-400">
              <thead class="bg-gray-50 dark:bg-dark-200">
                <tr>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    User
                  </th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Username
                  </th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    ID
                  </th>
                  <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white dark:bg-dark-100 divide-y divide-gray-200 dark:divide-dark-400">
                {#each users as user}
                  <tr>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="flex items-center">
                        <div class="h-10 w-10 rounded-full bg-gray-200 dark:bg-dark-300 overflow-hidden">
                          {#if user.meta.value.avatarUrl}
                            <img src={user.meta.value.avatarUrl} alt={user.username} class="h-full w-full object-cover" />
                          {:else}
                            <div class="h-full w-full flex items-center justify-center text-gray-500 dark:text-gray-400">
                              {user.username.charAt(0).toUpperCase()}
                            </div>
                          {/if}
                        </div>
                        <div class="ml-4">
                          <div class="text-sm font-medium text-gray-900 dark:text-gray-100">
                            {user.meta.value.fullName || 'No name'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="text-sm text-gray-900 dark:text-gray-100">{user.username}</div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="text-sm text-gray-500 dark:text-gray-400">{user.meta.value.id}</div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button class="text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300 mr-4">
                        Edit
                      </button>
                      <button class="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300">
                        Delete
                      </button>
                    </td>
                  </tr>
                {/each}
              </tbody>
            </table>
          </div>
        </div>
      {:else if activeTab === 'channels'}
        <div>
          <h2 class="text-lg font-medium mb-6">Channel Management</h2>
          
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200 dark:divide-dark-400">
              <thead class="bg-gray-50 dark:bg-dark-200">
                <tr>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Channel
                  </th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    ID
                  </th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Messages
                  </th>
                  <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white dark:bg-dark-100 divide-y divide-gray-200 dark:divide-dark-400">
                {#each channels as channel}
                  <tr>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="flex items-center">
                        <div class="h-10 w-10 rounded-md bg-primary-100 dark:bg-primary-900 flex items-center justify-center text-primary-600 dark:text-primary-400">
                          <Hash class="h-5 w-5" />
                        </div>
                        <div class="ml-4">
                          <div class="text-sm font-medium text-gray-900 dark:text-gray-100">
                            {channel.meta.value.name}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="text-sm text-gray-500 dark:text-gray-400">{channel.meta.value.id}</div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="text-sm text-gray-900 dark:text-gray-100">
                        {#if channel.messages}
                          {Object.keys(channel.messages).length}
                        {:else}
                          0
                        {/if}
                      </div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button class="text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300 mr-4">
                        Edit
                      </button>
                      <button class="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300">
                        Delete
                      </button>
                    </td>
                  </tr>
                {/each}
              </tbody>
            </table>
          </div>
        </div>
      {:else if activeTab === 'danger'}
        <div>
          <h2 class="text-lg font-medium mb-6">Danger Zone</h2>
          
          <div class="space-y-6">
            <div class="border border-red-300 rounded-md p-4">
              <div class="flex justify-between items-center">
                <div>
                  <h3 class="text-md font-medium text-red-800 dark:text-red-400">Clear All Messages</h3>
                  <p class="text-sm text-red-700 dark:text-red-300 mt-1">
                    This will delete all messages in all channels. This action cannot be undone.
                  </p>
                </div>
                <button class="rounded-md bg-red-100 px-4 py-2 text-sm font-medium text-red-800 hover:bg-red-200 focus:outline-hidden focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:bg-red-900 dark:text-red-200 dark:hover:bg-red-800">
                  Clear All Messages
                </button>
              </div>
            </div>
            
            <div class="border border-red-300 rounded-md p-4">
              <div class="flex justify-between items-center">
                <div>
                  <h3 class="text-md font-medium text-red-800 dark:text-red-400">Reset All Data</h3>
                  <p class="text-sm text-red-700 dark:text-red-300 mt-1">
                    This will delete all users, channels, and messages. This action cannot be undone.
                  </p>
                </div>
                <button class="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 focus:outline-hidden focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:bg-red-700 dark:hover:bg-red-600">
                  Reset All Data
                </button>
              </div>
            </div>
          </div>
        </div>
      {/if}
    </div>
  </div>
</div>
