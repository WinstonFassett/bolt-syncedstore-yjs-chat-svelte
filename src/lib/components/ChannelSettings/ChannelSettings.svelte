<script lang="ts">
  import { X, Lock, Trash2, MessageSquare, AlertTriangle } from 'lucide-svelte';
  import * as Dialog from '$lib/components/ui/dialog/index.js';
  import { Button } from '$lib/components/ui/button';
  import { Input } from '$lib/components/ui/input';
  import { Textarea } from '$lib/components/ui/textarea';
  import { Switch } from '$lib/components/ui/switch';
  import { Label } from '$lib/components/ui/label';
  import { Separator } from '$lib/components/ui/separator';
  import { store, updateChannel, clearChannelMessages, toggleChannelLock, deleteChannel } from '$lib/store';
  
  export let channel: any | null = null;
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
  
  // Update the channel
  function saveChanges() {
    if (!channel || !editingName.trim()) return;
    
    updateChannel(
      channel.meta.value.id,
      editingName.trim(),
      editingDescription.trim()
    );
    
    onClose();
  }
  
  // Toggle channel lock
  function handleToggleLock() {
    if (!channel) return;
    toggleChannelLock(channel.meta.value.id);
  }
  
  // Clear all messages in the channel
  function handleClearMessages() {
    if (!channel) return;
    clearChannelMessages(channel.meta.value.id);
    confirmClear = false;
  }
  
  // Delete the channel
  function handleDeleteChannel() {
    if (!channel) return;
    
    const success = deleteChannel(channel.meta.value.id);
    if (success) {
      onClose();
    }
  }
</script>

<div class="w-full max-w-md">
  <div class="flex items-center justify-between border-b border-border px-6 py-4">
    <Dialog.Title class="text-lg font-semibold">
      Channel Settings
    </Dialog.Title>
    <Dialog.Close asChild>
      <Button variant="ghost" size="icon" class="h-8 w-8">
        <X class="h-4 w-4" />
        <span class="sr-only">Close</span>
      </Button>
    </Dialog.Close>
  </div>
  
  <div class="space-y-6 p-6">
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
    
    <div class="space-y-4">
      <!-- Lock/Unlock Channel -->
      <div class="flex items-center justify-between rounded-lg border p-4">
        <div class="space-y-0.5">
          <div class="flex items-center gap-2">
            <Lock class="h-4 w-4 text-muted-foreground" />
            <Label for="channel-lock" class="font-medium">
              {channel?.meta?.value?.locked ? 'Channel Locked' : 'Channel Unlocked'}
            </Label>
          </div>
          <p class="text-sm text-muted-foreground">
            {channel?.meta?.value?.locked 
              ? 'No new messages can be sent in this channel.' 
              : 'Anyone can send messages in this channel.'}
          </p>
        </div>
        <Switch 
          id="channel-lock"
          checked={channel?.meta?.value?.locked}
          on:change={handleToggleLock}
        />
      </div>
      
      <!-- Clear Messages -->
      <div class="space-y-2">
        {#if confirmClear}
          <div class="rounded-lg border border-warning/50 bg-warning/10 p-4">
            <div class="flex items-start gap-2">
              <AlertTriangle class="mt-0.5 h-4 w-4 text-warning-foreground" />
              <div class="flex-1 space-y-2">
                <p class="text-sm font-medium text-warning-foreground">
                  Clear all messages?
                </p>
                <p class="text-sm text-warning-foreground/80">
                  This will permanently delete all messages in this channel. This action cannot be undone.
                </p>
                <div class="flex justify-end gap-2 pt-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    on:click={() => confirmClear = false}
                  >
                    Cancel
                  </Button>
                  <Button 
                    variant="destructive"
                    size="sm"
                    on:click={handleClearMessages}
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
            class="w-full justify-start gap-2"
            on:click={() => confirmClear = true}
          >
            <MessageSquare class="h-4 w-4" />
            Clear All Messages
          </Button>
        {/if}
      </div>
      
      <!-- Delete Channel -->
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
                    on:click={() => confirmDelete = false}
                  >
                    Cancel
                  </Button>
                  <Button 
                    variant="destructive"
                    size="sm"
                    on:click={handleDeleteChannel}
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
            on:click={() => confirmDelete = true}
          >
            <Trash2 class="h-4 w-4" />
            Delete Channel
          </Button>
        {/if}
      </div>
    </div>
  </div>
  
  <div class="flex justify-end gap-2 border-t bg-background px-6 py-4">
    <Dialog.Close asChild>
      <Button variant="outline">
        Cancel
      </Button>
    </Dialog.Close>
    <Button 
      on:click={saveChanges}
      disabled={!editingName.trim()}
    >
      Save Changes
    </Button>
  </div>
</div>
