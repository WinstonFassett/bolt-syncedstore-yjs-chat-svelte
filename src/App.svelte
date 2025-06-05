<script lang="ts">
  import { onMount } from 'svelte'
  import { 
    store,
    currentUserIdStore, 
    isStoreInitialized, 
    initializeStore, 
    persistenceProvider
  } from './store'
  
  import Sidebar from './components/Sidebar.svelte'
  import MainView from './components/MainView.svelte'
  import ProfileSetup from './components/ProfileSetup.svelte'
  
  // Loading state
  let isLoading = true
  
  onMount(async () => {
    // Wait for IndexedDB to load
    persistenceProvider.whenSynced.then(() => {
      // Initialize store if needed
      if (!$isStoreInitialized) {
        initializeStore()
      }
      
      // Done loading
      isLoading = false
    })
  })
</script>

<div class="flex h-full overflow-hidden">
  {#if isLoading}
    <!-- Loading state -->
    <div class="flex h-full w-full flex-col items-center justify-center">
      <div class="flex flex-col items-center">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 animate-pulse-slow text-primary-600 dark:text-primary-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
        </svg>
        <h1 class="mt-4 text-xl font-medium">Loading YJS Chat</h1>
        <p class="mt-2 text-gray-600 dark:text-gray-400">
          Connecting to the network...
        </p>
      </div>
    </div>
  {:else if !$currentUserIdStore}
    <!-- Profile setup screen -->
    <ProfileSetup />
    
    <!-- Background layout -->
    <div class="flex h-full w-full overflow-hidden">
      <div class="w-64 shrink-0 bg-gray-50 dark:bg-dark-200"></div>
      <div class="flex-1 bg-white dark:bg-dark-100"></div>
    </div>
  {:else}
    <!-- Main app layout -->
    <div class="w-64 shrink-0 overflow-hidden border-r border-gray-200 dark:border-dark-400">
      <Sidebar />
    </div>
    
    <MainView />
  {/if}
</div>