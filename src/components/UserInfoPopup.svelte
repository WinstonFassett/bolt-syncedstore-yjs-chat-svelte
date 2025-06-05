<script lang="ts">
  import { store } from '../store';
  import { getGravatarUrl } from '../utils/avatar';
  import { createDialog } from 'svelte-headlessui';
  import { X } from 'lucide-svelte';

  export let userId: string | null = null;
  export let closePopup: () => void;

  const dialog = createDialog({ label: 'User Information', onClose: () => {
    console.log('[UserInfoPopup] dialog.onClose triggered, calling parent closePopup.');
    closePopup();
  } });

  let user: any = null;
  let avatarUrl = '';

  $: {
    console.log('[UserInfoPopup] Reactive block triggered. Current userId:', userId, 'Dialog expanded:', $dialog.expanded);
    if (userId && $store.users && $store.users[userId]) {
      // Only update user and attempt to open if the user is different or not yet loaded for the current dialog instance
      if (!user || user.meta.value.id !== userId) {
        user = $store.users[userId];
        avatarUrl = getGravatarUrl(user.username, 128);
        console.log('[UserInfoPopup] User data loaded/changed for userId:', userId, user);
      }
      // Ensure user is loaded before trying to open
      if (user && user.meta.value.id === userId && !$dialog.expanded) {
        console.log('[UserInfoPopup] Valid userId and user loaded, dialog not expanded. Opening dialog.');
        dialog.open();
      }
    } else {
      if (user !== null) { // If there was a user, and now it's invalid
        console.log('[UserInfoPopup] userId became null or invalid. Clearing user data.');
        user = null;
        avatarUrl = '';
      }
      if ($dialog.expanded) {
        console.log('[UserInfoPopup] userId is null/invalid and dialog is expanded. Closing dialog.');
        dialog.close(); // This will trigger the onClose above, then parent's closePopup
      }
    }
  }

  function handleImageError() {
    avatarUrl = ''; // Clear or set to a default placeholder if avatar fails
  }
</script>

{#if $dialog.expanded && user}
  <div class="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-labelledby="user-info-popup-title">
    <div class="fixed inset-0 bg-black/30 dark:bg-black/50" aria-hidden="true" on:click={closePopup}></div>
    <div 
      class="relative w-full max-w-sm transform rounded-lg bg-white p-6 text-left align-middle shadow-xl transition-all dark:bg-dark-200"
      use:dialog.modal
    >
      <h3 class="text-xl font-semibold text-gray-900 dark:text-white" id="user-info-popup-title">
        User Profile
      </h3>
      <button on:click={closePopup} class="absolute top-3 right-3 p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-md hover:bg-gray-100 dark:hover:bg-dark-300">
        <X size={20} aria-hidden="true" />
        <span class="sr-only">Close</span>
      </button>

      <div class="mt-6 flex flex-col items-center">
        {#if avatarUrl}
          <img src={avatarUrl} alt="{user.username}'s avatar" class="h-24 w-24 rounded-full object-cover mb-4 border border-gray-300 dark:border-gray-600" on:error={handleImageError} />
        {:else}
          <div class="h-24 w-24 rounded-full bg-gray-200 dark:bg-dark-300 flex items-center justify-center mb-4 text-gray-500 dark:text-gray-400 text-3xl font-bold border border-gray-300 dark:border-gray-600">
            {user.username?.charAt(0).toUpperCase() || '?'}
          </div>
        {/if}
        <h4 class="text-lg font-medium text-gray-900 dark:text-white">{user.fullName || user.username}</h4>
        {#if user.fullName && user.fullName !== user.username}
          <p class="text-sm text-gray-500 dark:text-gray-400">@{user.username}</p>
        {/if}
        {#if user.meta.value.createdAt}
         <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">Joined: {new Date(user.meta.value.createdAt).toLocaleDateString()}</p>
        {/if}
      </div>

      <div class="mt-6 flex justify-end">
        <button type="button" class="btn btn-secondary" on:click={closePopup}>
          Close
        </button>
      </div>
    </div>
  </div>
{/if}
