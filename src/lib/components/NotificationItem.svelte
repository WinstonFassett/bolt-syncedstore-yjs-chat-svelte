<script lang="ts">
  import { store } from '$lib/store';
  import { NotificationType, markNotificationAsRead } from '$lib/store/notifications';
  import { UserPlus, UserMinus, LogIn, LogOut } from 'lucide-svelte';
  import { fade } from 'svelte/transition';
  
  export let notification: {
    id: string;
    type: NotificationType;
    userId: string;
    channelId?: string;
    timestamp: number;
    read: boolean;
  };
  
  // Get user data
  $: user = $store.users[notification.userId];
  
  // Get channel data if applicable
  $: channel = notification.channelId ? $store.channels[notification.channelId] : null;
  
  // Format timestamp as relative time
  $: timeAgo = formatTimeAgo(notification.timestamp);
  
  function formatTimeAgo(timestamp: number): string {
    const now = Date.now();
    const seconds = Math.floor((now - timestamp) / 1000);
    
    if (seconds < 60) return 'just now';
    
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  }
  
  // Mark as read when component is mounted
  function handleRead() {
    if (!notification.read) {
      markNotificationAsRead(notification.id);
    }
  }
</script>

<div 
  class="notification-item {notification.read ? 'read' : 'unread'}"
  transition:fade={{ duration: 200 }}
  on:mouseenter={handleRead}
>
  <div class="icon">
    {#if notification.type === NotificationType.USER_JOINED}
      <UserPlus size={16} class="text-green-500" />
    {:else if notification.type === NotificationType.USER_LEFT}
      <UserMinus size={16} class="text-red-500" />
    {:else if notification.type === NotificationType.CHANNEL_JOINED}
      <LogIn size={16} class="text-blue-500" />
    {:else if notification.type === NotificationType.CHANNEL_LEFT}
      <LogOut size={16} class="text-orange-500" />
    {/if}
  </div>
  
  <div class="content">
    {#if user}
      <span class="username">{user.username}</span>
      
      {#if notification.type === NotificationType.USER_JOINED}
        <span>joined the chat</span>
      {:else if notification.type === NotificationType.USER_LEFT}
        <span>left the chat</span>
      {:else if notification.type === NotificationType.CHANNEL_JOINED && channel}
        <span>joined #{channel.name}</span>
      {:else if notification.type === NotificationType.CHANNEL_LEFT && channel}
        <span>left #{channel.name}</span>
      {/if}
      
      <span class="time">{timeAgo}</span>
    {/if}
  </div>
</div>

<style>
  .notification-item {
    display: flex;
    align-items: center;
    padding: 0.5rem 1rem;
    border-bottom: 1px solid rgba(0, 0, 0, 0.05);
    transition: background-color 0.2s;
  }
  
  .notification-item:hover {
    background-color: rgba(0, 0, 0, 0.02);
  }
  
  .notification-item.unread {
    background-color: rgba(59, 130, 246, 0.05);
  }
  
  .icon {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 0.75rem;
    width: 24px;
    height: 24px;
  }
  
  .content {
    flex: 1;
    font-size: 0.875rem;
  }
  
  .username {
    font-weight: 600;
    margin-right: 0.25rem;
  }
  
  .time {
    margin-left: 0.5rem;
    color: #6b7280;
    font-size: 0.75rem;
  }
  
  :global(.dark) .notification-item {
    border-bottom-color: rgba(255, 255, 255, 0.05);
  }
  
  :global(.dark) .notification-item:hover {
    background-color: rgba(255, 255, 255, 0.02);
  }
  
  :global(.dark) .notification-item.unread {
    background-color: rgba(59, 130, 246, 0.1);
  }
  
  :global(.dark) .time {
    color: #9ca3af;
  }
</style>
