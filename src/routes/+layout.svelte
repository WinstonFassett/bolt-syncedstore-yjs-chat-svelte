<script lang="ts">
  import '../app.css';

  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import {
    doc, 
    store,
    currentUserIdStore, 
    isStoreInitialized, 
    initializeStore, 
    persistenceProvider
  } from '../store';
  
  import ProfileSetup from '../components/ProfileSetup.svelte';
  import CommandMenu from '../components/CommandMenu.svelte';
  import ToastContainer from '../components/ToastContainer.svelte';
	import { setupMessageNotifications, setupUserPresenceNotifications } from '../store/notifications';
  
  // Loading state
  let isLoading = false;
  let showCommandMenu = false;
  
  onMount(() => {
    let unsubscribePresence: (() => void) | undefined;
    let unsubscribeMessages: (() => void) | undefined;
    // Wait for IndexedDB to load
    persistenceProvider.whenSynced.then(() => {
      // Setup user presence notifications
      unsubscribePresence = setupUserPresenceNotifications()
      
      // Setup message notifications
      unsubscribeMessages = setupMessageNotifications()
      // Done loading
      isLoading = false;
    });
    
    // Set up keyboard shortcut for command menu
    window.addEventListener('keydown', (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        showCommandMenu = !showCommandMenu;
      }
      
      // Escape key to close command menu
      if (e.key === 'Escape' && showCommandMenu) {
        showCommandMenu = false;
      }
    });

    return () => {
      if (unsubscribePresence) unsubscribePresence()
      if (unsubscribeMessages) unsubscribeMessages()
    }
  });
</script>

<ToastContainer position="bottom-right" />

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
{:else if !$isStoreInitialized}
  <!-- Bootstrap store prompt -->
  <div class="flex h-full w-full flex-col items-center justify-center">
    <div class="flex flex-col items-center">
      <!-- Using a generic 'cloud' or 'database' icon for bootstrap -->
      <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-primary-600 dark:text-primary-500">
        <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"/>
        <path d="M12 12v9"/>
        <path d="m16 21-4-4-4 4"/>
      </svg>
      <h1 class="mt-4 text-xl font-medium">Initialize Chat Store</h1>
      <p class="mt-2 text-gray-600 dark:text-gray-400 mb-4">
        The chat application needs to set up its initial data store.
      </p>
      <button 
        class="rounded-md bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700 focus:outline-hidden focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:bg-primary-500 dark:hover:bg-primary-600 dark:focus:ring-offset-dark-100"
        on:click={() => initializeStore()}>
        Bootstrap Store
      </button>
    </div>
  </div>
{:else}
  <!-- Command Menu (hidden by default) -->
  {#if showCommandMenu}
    <CommandMenu on:close={() => showCommandMenu = false} />
  {/if}
  
  <!-- Main app layout with slot for page content -->
  <div class="flex h-full overflow-hidden">
    <slot />
  </div>
{/if}
