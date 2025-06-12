import { writable, derived } from 'svelte/store';
import { page } from '$app/stores';

// Track which input should have focus
export const focusedInput = writable<'channel' | 'thread' | null>(null);

// Derive focus state from the current route
export const shouldFocusChannelInput = derived(
  [page, focusedInput],
  ([$page, $focusedInput]) => {
    // If we're on a channel route and no specific focus is requested
    if ($page.url.pathname.startsWith('/c/') && !$page.url.pathname.includes('/m/')) {
      return $focusedInput !== 'thread';
    }
    return false;
  }
);

export const shouldFocusThreadInput = derived(
  [page, focusedInput],
  ([$page, $focusedInput]) => {
    // If we're on a thread route and no specific focus is requested
    if ($page.url.pathname.includes('/m/')) {
      return $focusedInput !== 'channel';
    }
    return false;
  }
);

// Reset focus state when navigating
export function resetFocusState() {
  focusedInput.set(null);
}
