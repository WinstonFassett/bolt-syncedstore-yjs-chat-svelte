<script lang="ts">
  import { toasts, addToast } from '$lib/store/toasts';
  import { fade, fly } from 'svelte/transition';
  import { flip } from 'svelte/animate';
  import { CheckCircle, Info, AlertTriangle, AlertCircle, X } from 'lucide-svelte';
  import { onMount } from 'svelte';

  // Position of toast container
  export let position = 'bottom-right';
  
  // Log when component is mounted
  onMount(() => {
    console.log('ToastContainer mounted');
  });
</script>

<!-- Fixed container for toasts -->
<div class="fixed-container {position}" id="toast-container" style="flex-direction: column-reverse;">
  
  <!-- Toast list -->
  {#each $toasts as toast (toast.id)}
    <div 
      class="toast toast-{toast.type}"
      transition:fly={{ y: position.includes('top') ? -20 : 20, duration: 300 }}
      animate:flip={{ duration: 300 }}
    >
      <div class="toast-icon">
        {#if toast.type === 'info'}
          <Info size={20} />
        {:else if toast.type === 'success'}
          <CheckCircle size={20} />
        {:else if toast.type === 'warning'}
          <AlertTriangle size={20} />
        {:else if toast.type === 'error'}
          <AlertCircle size={20} />
        {/if}
      </div>
      
      <div class="toast-content prose prose-sm dark:prose-invert max-w-none">
        {@html toast.message}
      </div>
      
      <button 
        class="toast-close"
        on:click={() => toasts.update(all => all.filter(t => t.id !== toast.id))}
      >
        <X size={16} />
      </button>
    </div>
  {/each}
</div>

<style>
  /* Container positioning */
  .fixed-container {
    position: fixed;
    z-index: 9999;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    padding: 1rem;
    width: 100%;
    max-width: 24rem;
    pointer-events: none; /* Allow clicks to pass through container but not children */
  }
  
  /* Make sure all children can receive pointer events */
  .fixed-container > * {
    pointer-events: auto;
  }
  
  .top-right { top: 0; right: 0; }
  .top-left { top: 0; left: 0; }
  .bottom-right { bottom: 0; right: 0; }
  .bottom-left { bottom: 0; left: 0; }
  
  /* Test button */
  .test-button {
    background-color: #3B82F6;
    color: white;
    padding: 0.5rem 1rem;
    border-radius: 0.25rem;
    font-weight: 500;
    margin-bottom: 0.5rem;
    align-self: flex-end;
    cursor: pointer;
    border: none;
  }
  
  /* Toast styling */
  .toast {
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 0.75rem 1rem;
    border-radius: 0.5rem;
    background-color: white;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    width: 100%;
  }
  
  .toast-info {
    border-left: 4px solid #3B82F6;
  }
  
  .toast-success {
    border-left: 4px solid #10B981;
  }
  
  .toast-warning {
    border-left: 4px solid #F59E0B;
  }
  
  .toast-error {
    border-left: 4px solid #EF4444;
  }
  
  .toast-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 0.75rem;
    color: #6B7280;
  }
  
  .toast-info .toast-icon { color: #3B82F6; }
  .toast-success .toast-icon { color: #10B981; }
  .toast-warning .toast-icon { color: #F59E0B; }
  .toast-error .toast-icon { color: #EF4444; }
  
  .toast-content {
    flex: 1;
    font-size: 0.875rem;
  }
  
  .toast-close {
    display: flex;
    align-items: center;
    justify-content: center;
    color: #9CA3AF;
    background: transparent;
    border: none;
    cursor: pointer;
    padding: 0.25rem;
    border-radius: 9999px;
  }
  
  .toast-close:hover {
    background-color: #F3F4F6;
    color: #6B7280;
  }
  
  /* Dark mode */
  :global(.dark) .toast {
    background-color: #1F2937;
    color: #F9FAFB;
  }
  
  :global(.dark) .toast-info {
    border-left-color: #3B82F6;
  }
  
  :global(.dark) .toast-success {
    background-color: #064E3B;
    border-left-color: #10B981;
    color: #D1FAE5;
  }
  
  :global(.dark) .toast-warning {
    background-color: #78350F;
    border-left-color: #F59E0B;
    color: #FEF3C7;
  }
  
  :global(.dark) .toast-error {
    background-color: #7F1D1D;
    border-left-color: #EF4444;
    color: #FEE2E2;
  }
  
  :global(.dark) .toast-close:hover {
    background-color: #374151;
  }
</style>
