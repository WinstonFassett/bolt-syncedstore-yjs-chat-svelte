<script lang="ts">

import { preventDefault } from "../../utils/preventDefault";  import { onMount } from 'svelte';
  import { Button } from '$lib/components/ui/button';
  import { Input } from '$lib/components/ui/input';
  import { Textarea } from '$lib/components/ui/textarea';
  import { Label } from '$lib/components/ui/label';
  import { Separator } from '$lib/components/ui/separator';
  import { Lock, Trash2, MessageSquare, X, AlertTriangle } from 'lucide-svelte';
  import * as Dialog from '$lib/components/ui/dialog';
  // Import store functions and types from the correct location
  import { store } from '$lib/store';
  import type { Channel } from '$lib/store/index';
  
  // Import store methods directly
  import { 
    updateChannel, 
    toggleChannelLock, 
    clearChannelMessages, 
    deleteChannel 
  } from '$lib/store';
  
  export let channel: Channel | null = null;
  export let onClose: () => void = () => {};
  
  // Local state for editing
  let editingName = '';
  let editingDescription = '';
  let confirmDelete = false;
  let confirmClear = false;
  
  // Update from channel when it changes
  $: if (channel) {
    editingName = channel.name;
    editingDescription = channel.description || '';
  }
  
  // Safely access the locked property with a default value of false
  $: isLocked = channel ? Boolean(channel.locked) : false;
  
  // Update the channel
  function saveChanges(event: Event): void {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    
    if (!channel || !editingName.trim()) return;
    
    updateChannel(
      channel.meta.value.id,
      editingName.trim(),
      editingDescription.trim()
    );
    
    onClose();
  }
  
  // Toggle channel lock
  function toggleLock(event: Event): void {
    event.preventDefault();
    if (!channel) return;
    
    // Call the store function to update the locked state
    const success = toggleChannelLock(channel.meta.value.id);
    
    // Only update local state if the store update was successful
    if (success) {
      isLocked = !isLocked;
    }
  }
  
  // Clear all messages in the channel
  function handleClearMessages(event: Event): void {
    event.preventDefault();
    if (!channel) return;
    clearChannelMessages(channel.meta.value.id);
    confirmClear = false;
  }
  
  // Delete the channel
  function handleDeleteChannel(event: Event): void {
    event.preventDefault();
    if (!channel) return;
    const success = deleteChannel(channel.meta.value.id);
    if (success) {
      onClose();
    }
  }
  
  function cancelDelete(event: Event): void {
    event.preventDefault();
    confirmDelete = false;
  }
  
  function cancelClear(event: Event): void {
    event.preventDefault();
    confirmClear = false;
  }
  
  function handleSubmit(event: Event): void {
    event.preventDefault();
    saveChanges(event);
  }
</script>

<div class="w-full max-w-2xl flex flex-col max-h-[calc(100vh-4rem)] md:max-h-[80vh]">
  <div class="border-b border-border px-6 py-4 flex-shrink-0">
    <Dialog.Title class="text-lg font-semibold">
      {isLocked ? 'Channel Locked' : 'Lock Channel'}
    </Dialog.Title>
  </div>
  
  <div class="space-y-6 p-6 overflow-y-auto flex-1">
    <div class="space-y-2">
      <Label for="channel-name">Channel Name</Label>
      <div class="flex items-center">
        <span class="mr-2 text-muted-foreground">#</span>
        <Input
          id="channel-name"
          bind:value={editingName}
          placeholder="channel-name"
          class="flex-1"
        />
      </div>
    </div>
    
    <div class="space-y-2">
      <Label for="channel-description">
        Description <span class="text-muted-foreground text-xs">(optional)</span>
      </Label>
      <Textarea
        id="channel-description"
        bind:value={editingDescription}
        placeholder="What's this channel about?"
        rows={3}
      />
    </div>
    
    <Separator class="my-4" />
    
    <!-- Channel Settings -->
    <div class="space-y-6">
      <div class="space-y-2">
        <h3 class="text-lg font-medium">General</h3>
        <p class="text-sm text-muted-foreground">
          Basic channel settings and information
        </p>
      </div>
      
      <Separator />
      
      <!-- Danger Zone -->
      <div class="rounded-lg border border-destructive/30 bg-destructive/5 p-4 space-y-4">
        <div class="space-y-2">
          <h3 class="text-lg font-medium text-destructive">Danger Zone</h3>
          <p class="text-sm text-muted-foreground">
            These actions are irreversible. Please be certain.
          </p>
        </div>
        <!-- Lock Channel (no border, just button) -->
        <div class="flex items-center justify-between">
          <div>
            <h4 class="font-medium">
              {isLocked ? 'Channel is locked' : 'Lock Channel'}
            </h4>
            <p class="text-sm text-muted-foreground pr-2">
              {isLocked 
                ? 'Only admins can send messages in this channel.'
                : 'All members can send messages in this channel.'}
            </p>
          </div>
          {#if isLocked}
            <button 
              type="button"
              onclick={preventDefault(toggleLock)}
              class="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground shadow-sm hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            >
              <Lock class="mr-2 h-4 w-4" />
              Unlock Channel
            </button>
          {:else}
            <button 
              type="button"
              onclick={preventDefault(toggleLock)}
              class="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground shadow-sm hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            >
              <Lock class="mr-2 h-4 w-4" />
              Lock Channel
            </button>
          {/if}
        </div>
        <!-- Clear Messages (destructive) -->
        <div class="space-y-2">
          {#if confirmClear}
            <div class="rounded-lg border border-destructive/50 bg-destructive/10 p-4">
              <div class="flex items-start gap-2">
                <AlertTriangle class="mt-0.5 h-4 w-4 text-destructive" />
                <div class="flex-1 space-y-2">
                  <p class="text-sm font-medium text-destructive">
                    Clear all messages?
                  </p>
                  <p class="text-sm text-destructive/80">
                    This will permanently delete all messages in this channel. This action cannot be undone.
                  </p>
                  <div class="flex justify-end gap-2 pt-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onclick={() => confirmClear = false}
                      type="button"
                    >
                      Cancel
                    </Button>
                    <Button 
                      variant="destructive"
                      size="sm"
                      onclick={handleClearMessages}
                      type="button"
                    >
                      <Trash2 class="mr-2 h-4 w-4" />
                      Clear All
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          {:else}
            <Button 
              variant="outline" 
              class="w-full justify-start gap-2 text-destructive hover:bg-destructive/10 hover:text-destructive"
              onclick={() => {
                confirmClear = true
              }}
              type="button"
            >
              <MessageSquare class="h-4 w-4" />
              Clear All Messages
            </Button>
          {/if}
        </div>
        <!-- Delete Channel (destructive) -->
        <div class="space-y-2 pt-2">
          {#if confirmDelete}
            <div class="rounded-lg border border-destructive/50 bg-destructive/10 p-4">
              <div class="flex items-start gap-2">
                <AlertTriangle class="mt-0.5 h-4 w-4 text-destructive" />
                <div class="flex-1 space-y-2">
                  <p class="text-sm font-medium text-destructive">
                    Delete this channel?
                  </p>
                  <p class="text-sm text-destructive/80">
                    This will permanently delete the channel and all its messages. This action cannot be undone.
                  </p>
                  <div class="flex justify-end gap-2 pt-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onclick={() => confirmDelete = false}
                      type="button"
                    >
                      Cancel
                    </Button>
                    <Button 
                      variant="destructive"
                      size="sm"
                      onclick={handleDeleteChannel}
                      type="button"
                    >
                      <Trash2 class="mr-2 h-4 w-4" />
                      Delete Channel
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          {:else}
            <Button 
              variant="outline" 
              class="w-full justify-start gap-2 text-destructive hover:bg-destructive/10 hover:text-destructive"
              onclick={() => confirmDelete = true}
              type="button"
            >
              <Trash2 class="h-4 w-4" />
              Delete Channel
            </Button>
          {/if}
        </div>
      </div>
    </div>
  </div>
  
  <div class="flex justify-end gap-2 border-t bg-background px-6 py-4">
    <Dialog.Close>
      <button 
        type="button"
        class="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium shadow-sm hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
      >
        Cancel
      </button>
    </Dialog.Close>
    <button 
      type="button"
      onclick={preventDefault(handleSubmit)}
      disabled={!editingName.trim()}
      class="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
    >
      Save Changes
    </button>
  </div>
</div>
