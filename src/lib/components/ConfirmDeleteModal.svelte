<script lang="ts">
  import { createEventDispatcher, onMount, onDestroy } from 'svelte';
  import { createDialog, type DialogConfig } from 'svelte-headlessui';
  import { X } from 'lucide-svelte';
  import { fade, scale } from 'svelte/transition';

  export let isOpen = false;

  const dispatch = createEventDispatcher<{
    confirm: void;
    cancel: void;
  }>();

  const dialog = createDialog({
    role: 'alertdialog',
    expanded: isOpen,
    onClose: () => {
      // Prevent closing on backdrop click by default, handle via buttons
      // If you want backdrop click to cancel, dispatch('cancel') here
      // For now, we require explicit button press.
      return false; 
    }
  });

  // Handle Escape key to cancel
  function handleKeyDown(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      dispatch('cancel');
    }
  }

  onMount(() => {
    document.addEventListener('keydown', handleKeyDown);
  });

  onDestroy(() => {
    document.removeEventListener('keydown', handleKeyDown);
  });

  function handleConfirm() {
    dispatch('confirm');
  }

  function handleCancel() {
    dispatch('cancel');
  }

  // Update internal dialog state when isOpen prop changes
  // $: dialog.setOpen(isOpen);
  $: dialog.expanded = isOpen;

</script>

{#if $dialog.expanded}
  <div class="fixed inset-0 z-50 flex items-center justify-center p-4" use:dialog.modal>
    <div 
      class="fixed inset-0 bg-black/30 dark:bg-black/50 backdrop-blur-xs"
      in:fade={{ duration: 150 }}
      out:fade={{ duration: 150 }}
      on:click={handleCancel}
    ></div>
    <!-- Allow backdrop click to cancel -->
    
    <div 
      class="relative z-10 w-full max-w-md rounded-lg bg-white p-6 shadow-xl dark:bg-dark-200"
      role="document"
      in:scale={{ duration: 150, start: 0.95, opacity: 0 }}
      out:scale={{ duration: 150, start: 0.95, opacity: 0 }}
    >
      <div class="flex items-start justify-between">
        <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100">
          Delete Message
        </h3>
        <button 
          class="-m-1.5 rounded-sm p-1.5 text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400"
          on:click={handleCancel}
          aria-label="Close"
        >
          <X size={20} />
        </button>
      </div>

      <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">
        Are you sure you want to delete this message? This action cannot be undone immediately through the UI, but the message will be marked as deleted.
      </p>

      <div class="mt-6 flex justify-end space-x-3">
        <button 
          type="button"
          class="btn btn-ghost"
          on:click={handleCancel}
        >
          Cancel
        </button>
        <button 
          type="button"
          class="btn btn-danger"
          on:click={handleConfirm}
        >
          Delete
        </button>
      </div>
    </div>
  </div>
{/if}
