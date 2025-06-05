<script lang="ts">
  import Avatar from './Avatar.svelte'
  import { onlineUsers } from '../store'
  
  export let user: any
  
  $: isOnline = $onlineUsers.has(user.meta.value.id)
</script>

<div class="flex cursor-pointer items-center gap-2 rounded-md px-3 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-dark-300">
  <div class="relative">
    <Avatar username={user.username} customImage={user.avatar} size="sm" />
    {#if isOnline}
      <div class="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-green-500 ring-1 ring-white dark:ring-dark-200"></div>
    {/if}
  </div>
  <div class="truncate">
    {user.username}
  </div>
</div>