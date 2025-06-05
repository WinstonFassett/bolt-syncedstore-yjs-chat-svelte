<script lang="ts">
  import Avatar from './Avatar.svelte';
  import UserInfoPopup from './UserInfoPopup.svelte';
  import { onlineUsers } from '../store';

  export let user: any;

  $: isOnline = $onlineUsers.has(user.meta.value.id);

  // State for UserInfoPopup
  let showUserInfoPopup = false;
  let selectedUserIdForPopup: string | null = null;

  function openUserInfoPopup(userIdToOpen: string) {
    selectedUserIdForPopup = userIdToOpen;
    showUserInfoPopup = true;
  }

  function closeUserInfoPopup() {
    showUserInfoPopup = false;
    selectedUserIdForPopup = null;
  }
</script>

<div
  class="flex cursor-pointer items-center gap-2 rounded-md px-3 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-dark-300"
  on:click={() => openUserInfoPopup(user.meta.value.id)}
  on:keydown={(e) => { if (e.key === 'Enter' || e.key === ' ') openUserInfoPopup(user.meta.value.id); }}
  role="button"
  tabindex="0"
>
  <div class="relative">
    <Avatar username={user.username} customImage={user.avatar} size="sm" />
    {#if isOnline}
      <div class="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-green-500 ring-1 ring-white dark:ring-dark-200"></div>
    {/if}
  </div>
  <div class="truncate">
    <!-- This will be updated later to show full name / username as per requirements -->
    {user.fullName || user.username}
  </div>
</div>

{#if showUserInfoPopup && selectedUserIdForPopup}
  <UserInfoPopup userId={selectedUserIdForPopup} closePopup={closeUserInfoPopup} />
{/if}