<script lang="ts">
  import { createEventDispatcher } from 'svelte'
  import { store, currentUserIdStore, currentChannelIdStore } from '../store'
  import RichTextMessage from './RichTextMessage.svelte'
  import { formatChatDate } from '../utils/date'
  import Avatar from './Avatar.svelte';
  import UserInfoPopup from './UserInfoPopup.svelte';
  import ConfirmDeleteModal from './ConfirmDeleteModal.svelte';
  import { MessageSquare, Pencil, Trash2, Smile, Check, X, SmilePlus, RotateCcw } from 'lucide-svelte'
  import { fade, slide } from 'svelte/transition'
  
  export let message: any
  export let showThreadButton = true
  export let isInThread = false // True if this message is being rendered inside the ThreadView itself
  
  const dispatch = createEventDispatcher<{
    reply: { messageId: string }
  }>()
  
  // Reactive declarations
  $: user = $store.users[message.meta.value.userId]
  $: formattedTime = formatChatDate(message.meta.value.createdAt)
  $: isEdited = message.updatedAt && message.updatedAt > message.meta.value.createdAt
  $: isDeleted = message.deleted === true
  $: isCurrentUser = $currentUserIdStore === message.meta.value.userId
  
  // State for message actions
  let showActions = false;
  let isAddingReaction = false
  let emojiInput = ''
  let isEditing = false
  let editText = message.text;
  let showConfirmDeleteModal = false;

  // Thread summary
  $: threadReplies = Object.values($store.channels?.[$currentChannelIdStore]?.messages || {}).filter(
    (m: any) => m.meta.value.parentId === message.meta.value.id && !m.deleted
  );

  $: threadSummary = (() => {
    if (!threadReplies || threadReplies.length === 0) {
      return null;
    }

    const replyCount = threadReplies.length;
    
    const lastReply = threadReplies.reduce((latest, r) => 
      (r.meta.value.createdAt > latest.meta.value.createdAt ? r : latest), threadReplies[0]
    );
    const lastReplyAt = lastReply.updatedAt || lastReply.meta.value.createdAt;
    
    const participantUserIds = [
      ...new Set(threadReplies.map((r: any) => r.meta.value.userId))
    ].slice(0, 3); // Show max 3 avatars

    // Get user objects for avatars
    const participants = participantUserIds.map(id => $store.users[id]).filter(Boolean);
    return {
      replyCount,
      lastReplyAt,
      formattedLastReplyTime: formatChatDate(lastReplyAt, true), // true for compact format
      participants
    };
  })();

  // State for UserInfoPopup
  let showUserInfoPopup = false;
  let selectedUserIdForPopup: string | null = null;

  function openUserInfoPopup(userId: string) {
    selectedUserIdForPopup = userId;
    showUserInfoPopup = true;
  }

  function closeUserInfoPopup() {
    showUserInfoPopup = false;
    selectedUserIdForPopup = null;
  }
  
  // Common emojis for quick access
  const quickEmojis = ['👍', '👎', '❤️', '😂', '🎉', '🔥', '👀']
  
  // Get reactions as a derived value
  $: reactions = Object.entries(message.reactions || {}).map(([emoji, userIds]) => ({
    emoji,
    count: userIds.length,
    hasReacted: userIds.includes($currentUserIdStore || '')
  }))
  
  // Toggle a reaction
  function toggleReaction(emoji: string) {
    if (!$currentUserIdStore) return
    
    if (!message.reactions) {
      message.reactions = {}
    }
    
    if (!message.reactions[emoji]) {
      message.reactions[emoji] = []
    }
    
    const hasReacted = message.reactions[emoji].includes($currentUserIdStore)
    
    if (hasReacted) {
      message.reactions[emoji] = message.reactions[emoji].filter(id => id !== $currentUserIdStore)
      if (message.reactions[emoji].length === 0) {
        delete message.reactions[emoji]
      }
    } else {
      message.reactions[emoji].push($currentUserIdStore)
    }
    
    // Close emoji picker after adding reaction
    isAddingReaction = false
    emojiInput = ''
  }

  import { tick } from 'svelte'
  let editTextarea: HTMLTextAreaElement

  // Start editing
  async function startEditing() {
    editText = message.text
    isEditing = true
    showActions = false
    
    // Wait for the DOM to update, then focus the textarea
    await tick()
    if (editTextarea) {
      editTextarea.focus()
    }
  }

  // Save edit
  function saveEdit() {
    if (!editText.trim()) return
    message.text = editText.trim()
    message.updatedAt = Date.now()
    isEditing = false
  }

  // Cancel edit
  function cancelEdit() {
    editText = message.text
    isEditing = false
  }

  // Show delete confirmation modal
  function requestDeleteMessage() {
    showConfirmDeleteModal = true;
    showActions = false; // Hide actions menu when modal opens
  }

  // Actually delete message after confirmation
  function handleConfirmDelete() {
    message.deleted = true;
    message.updatedAt = Date.now();
    showConfirmDeleteModal = false;
  }

  // Cancel deletion from modal
  function handleCancelDelete() {
    showConfirmDeleteModal = false;
  }

  // Undelete message
  function undeleteMessage() {
    if (message.deleted) {
      delete message.deleted; // Or set to false, depending on desired YJS behavior for removal
    }
    message.updatedAt = Date.now();
  }

  // Handle keyboard events for editing
  function handleEditKeydown(event: KeyboardEvent) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      saveEdit()
    } else if (event.key === 'Escape') {
      cancelEdit()
    }
  }
</script>

{#if showUserInfoPopup && selectedUserIdForPopup}
  <UserInfoPopup userId={selectedUserIdForPopup} closePopup={closeUserInfoPopup} />
{/if}

{#if showConfirmDeleteModal}
  <ConfirmDeleteModal 
    isOpen={showConfirmDeleteModal} 
    on:confirm={handleConfirmDelete} 
    on:cancel={handleCancelDelete} 
  />
{/if}

<!-- Message container -->
<div 
  role="group"
  class="group relative px-4 py-2 hover:bg-gray-50 dark:hover:bg-dark-300"
  on:mouseenter={() => showActions = true}
  on:mouseleave={() => showActions = false}
>
  <div class="flex gap-3">
    <!-- Avatar and User Info Click Area -->
    <div class="flex-shrink-0 cursor-pointer" on:click={() => openUserInfoPopup(message.meta.value.userId)} role="button" tabindex="0" on:keydown={(e) => { if (e.key === 'Enter' || e.key === ' ') openUserInfoPopup(message.meta.value.userId); }}>
      <Avatar username={user?.username || 'Unknown'} customImage={user?.avatar} />
    </div>
    
    <!-- Message content -->
    <div class="min-w-0 flex-1">
      <!-- Username and time -->
      {#if user}
        {@const hasFullName = user.fullName && user.fullName.trim() !== ''}
        {@const currentUsername = user.username || 'Unknown'}
        {@const currentFullName = hasFullName ? user.fullName : ''}
        {@const showFullNameAsPrimary = hasFullName && currentFullName !== currentUsername}
        {@const showUsernameAsPrimary = !hasFullName || currentFullName === currentUsername}
        <div class="mb-1 flex items-baseline">
          <div class="cursor-pointer" on:click={() => openUserInfoPopup(message.meta.value.userId)} role="button" tabindex="0" on:keydown={(e) => { if (e.key === 'Enter' || e.key === ' ') openUserInfoPopup(message.meta.value.userId); }}>
            {#if showFullNameAsPrimary}
              <span class="mr-2 font-medium" title={`@${currentUsername}`}>{currentFullName}</span>
            {:else}
              <span class="mr-2 font-medium" title={hasFullName && currentFullName !== currentUsername ? `Full Name: ${currentFullName}` : ''}>{currentUsername}</span>
            {/if}
          </div>
          <span class="text-xs text-gray-500 dark:text-gray-400 ml-2">{formattedTime}</span> <!-- Added ml-2 for spacing -->
          {#if isEdited}
            <span class="ml-1 text-xs text-gray-500 dark:text-gray-400">(edited)</span>
          {/if}
        </div>
      {:else}
        <div class="mb-1 flex items-baseline">
          <span class="mr-2 font-medium">Unknown User</span>
          <span class="text-xs text-gray-500 dark:text-gray-400">{formattedTime}</span>
          {#if isEdited}
            <span class="ml-1 text-xs text-gray-500 dark:text-gray-400">(edited)</span>
          {/if}
        </div>
      {/if}
      
      <!-- Message text -->
      {#if isDeleted}
        <div class="flex items-center justify-between rounded border border-dashed border-gray-300 bg-gray-50 p-2 text-sm dark:border-dark-400 dark:bg-dark-300">
          <p class="italic text-gray-500 dark:text-gray-400">This message was deleted</p>
          {#if isCurrentUser}
            <button 
              class="ml-2 inline-flex items-center gap-1.5 rounded px-2 py-1 text-xs text-blue-600 hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 dark:text-blue-400 dark:hover:bg-blue-900/20 dark:focus:ring-offset-dark-300"
              on:click={undeleteMessage}
              aria-label="Undelete message"
              title="Undelete message"
            >
              <RotateCcw size={14} />
              Undelete
            </button>
          {/if}
        </div>
      {:else if isEditing}
        <div class="flex flex-col gap-2">
          <textarea
            class="input min-h-[60px] w-full resize-none"
            bind:this={editTextarea}
            bind:value={editText}
            on:keydown={handleEditKeydown}
            rows="3"
          ></textarea>
          <div class="flex items-center gap-2 text-sm">
            <button 
              class="inline-flex items-center gap-1 rounded px-2 py-1 text-primary-600 hover:bg-primary-50 dark:text-primary-400 dark:hover:bg-dark-300"
              on:click={saveEdit}
            >
              <Check size={16} />
              Save
            </button>
            <button 
              class="inline-flex items-center gap-1 rounded px-2 py-1 text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-dark-300"
              on:click={cancelEdit}
            >
              <X size={16} />
              Cancel
            </button>
            <span class="text-xs text-gray-500 dark:text-gray-400">
              Press Enter to save, Escape to cancel
            </span>
          </div>
        </div>
      {:else}
        <RichTextMessage content={message.text} />
      {/if}
      <!-- <code>{JSON.stringify({
        isDeleted, isInThread, threadSummary
      }, null, 2)}</code> -->
      <!-- Thread Summary -->
      {#if !isDeleted && !isInThread && threadSummary && threadSummary.replyCount > 0}
        <div 
          class="mt-2 flex cursor-pointer items-center gap-2 rounded-md p-1.5 hover:bg-gray-100 dark:hover:bg-dark-400/50"
          on:click={() => {
            // Navigate to thread view
            const channelId = $currentChannelIdStore;
            const messageId = message.meta.value.id;
            window.location.href = `/c/${channelId}/m/${messageId}`;
          }}
          role="button"
          tabindex="0"
          on:keydown={(e) => { 
            if (e.key === 'Enter' || e.key === ' ') {
              const channelId = $currentChannelIdStore;
              const messageId = message.meta.value.id;
              window.location.href = `/c/${channelId}/m/${messageId}`;
            } 
          }}
          aria-label={`View ${threadSummary.replyCount} ${threadSummary.replyCount === 1 ? 'reply' : 'replies'}`}
        >
          <div class="flex -space-x-2 overflow-hidden">
            {#each threadSummary.participants as participant, i (participant?.id || `participant-${i}`)}
              <Avatar 
                username={participant?.username || 'Unknown'} 
                customImage={participant?.avatar} 
                size="xs" 
              />
            {/each}
          </div>
          <span class="text-xs font-medium text-primary-600 dark:text-primary-400">
            {threadSummary.replyCount} {threadSummary.replyCount === 1 ? 'reply' : 'replies'}
          </span>
          <span class="text-xs text-gray-500 dark:text-gray-400">
            Last reply {threadSummary.formattedLastReplyTime}
          </span>
        </div>
      {/if}

      <!-- Reactions -->
      {#if reactions.length > 0}
        <div class="mt-2 flex flex-wrap gap-1" transition:slide|local>
          {#each reactions as reaction}
            <button
              class="inline-flex items-center rounded-full border px-2 py-0.5 text-xs transition-colors {reaction.hasReacted ? 'border-primary-500 bg-primary-50 text-primary-700 dark:border-primary-700 dark:bg-dark-300 dark:text-primary-400' : 'border-gray-300 bg-gray-50 text-gray-700 hover:bg-gray-100 dark:border-dark-400 dark:bg-dark-300 dark:text-gray-300 dark:hover:bg-dark-400'}"
              on:click={() => toggleReaction(reaction.emoji)}
            >
              <span>{reaction.emoji}</span>
              <span class="ml-1">{reaction.count}</span>
            </button>
          {/each}
          <!-- Button to add more reactions -->
          <button
            class="inline-flex items-center justify-center rounded-full border border-gray-300 bg-gray-50 p-1 text-xs text-gray-700 transition-colors hover:bg-gray-100 dark:border-dark-400 dark:bg-dark-300 dark:text-gray-300 dark:hover:bg-dark-400"
            on:click={() => isAddingReaction = true}
            aria-label="Add another reaction"
            title="Add another reaction"
          >
            <SmilePlus size={14} />
          </button>
        </div>
      {/if}
      
      <!-- Message actions -->
      {#if showActions && !isDeleted && !isAddingReaction && !isEditing}
        <div 
          class="absolute right-4 top-2 flex items-center gap-1 rounded-md border border-gray-200 bg-white shadow-sm dark:border-dark-400 dark:bg-dark-200"
          transition:fade|local={{ duration: 100 }}
        >
          <!-- Add reaction button -->
          <button
            class="rounded p-1.5 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-dark-300 dark:hover:text-gray-300"
            on:click={() => isAddingReaction = true}
            aria-label="Add reaction"
          >
            <Smile size={16} />
          </button>
          
          <!-- Reply/Thread button -->
          {#if showThreadButton && !isInThread}
            <button
              class="rounded p-1.5 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-dark-300 dark:hover:text-gray-300"
              on:click={() => {
                // Use the same direct navigation approach as thread summary
                const channelId = $currentChannelIdStore;
                const messageId = message.meta.value.id;
                window.location.href = `/c/${channelId}/m/${messageId}`;
              }}
              aria-label="Reply in thread"
            >
              <MessageSquare size={16} />
            </button>
          {/if}
          
          <!-- Edit/Delete buttons (only for user's own messages) -->
          {#if isCurrentUser}
            <button
              class="rounded p-1.5 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-dark-300 dark:hover:text-gray-300"
              on:click={startEditing}
              aria-label="Edit message"
            >
              <Pencil size={16} />
            </button>
            
            <button
              class="rounded p-1.5 text-red-500 transition-colors hover:bg-red-50 hover:text-red-700 dark:hover:bg-red-900/20"
              on:click={requestDeleteMessage}
              aria-label="Delete message"
            >
              <Trash2 size={16} />
            </button>
          {/if}
        </div>
      {/if}
      
      <!-- Reaction picker -->
      {#if isAddingReaction}
        <div 
          class="absolute right-4 top-2 rounded-md border border-gray-200 bg-white p-2 shadow-md dark:border-dark-400 dark:bg-dark-200"
          transition:fade|local
        >
          <div class="mb-2 flex gap-1">
            {#each quickEmojis as emoji}
              <button
                class="rounded p-1 hover:bg-gray-100 dark:hover:bg-dark-300"
                on:click={() => toggleReaction(emoji)}
              >
                {emoji}
              </button>
            {/each}
          </div>
          
          <div class="flex">
            <input
              type="text"
              class="input mr-1 w-full text-sm"
              placeholder="Custom emoji"
              bind:value={emojiInput}
            />
            <button
              class="btn btn-sm btn-primary text-xs"
              on:click={() => toggleReaction(emojiInput)}
              disabled={!emojiInput.trim()}
            >
              Add
            </button>
          </div>
          
          <button
            class="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-gray-500 text-xs text-white"
            on:click={() => isAddingReaction = false}
            aria-label="Close"
          >
            ×
          </button>
        </div>
      {/if}
    </div>
  </div>
</div>