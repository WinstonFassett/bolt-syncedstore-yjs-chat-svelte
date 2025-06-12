import { writable, derived } from 'svelte/store';
import { page } from '$app/stores';

// Track which input should have focus and if we should auto-focus
type FocusState = {
  target: 'channel' | 'thread' | null;
  shouldAutoFocus: boolean;
};

export const focusState = writable<FocusState>({ target: null, shouldAutoFocus: false });

// Derive focus state from the current route
export const shouldFocusChannelInput = derived(
  [page, focusState],
  ([$page, $focusState]) => {
    // Only auto-focus if explicitly requested and we're on the right route
    if ($page.url.pathname.startsWith('/c/') && !$page.url.pathname.includes('/m/')) {
      return $focusState.target === 'channel' && $focusState.shouldAutoFocus;
    }
    return false;
  }
);

export const shouldFocusThreadInput = derived(
  [page, focusState],
  ([$page, $focusState]) => {
    // Only auto-focus if explicitly requested and we're on the right route
    if ($page.url.pathname.includes('/m/')) {
      return $focusState.target === 'thread' && $focusState.shouldAutoFocus;
    }
    return false;
  }
);

// Request focus for a specific input
export function requestFocus(target: 'channel' | 'thread') {
  focusState.set({ target, shouldAutoFocus: true });
  
  // Reset after a short delay to allow for focus to be handled
  setTimeout(() => {
    focusState.update(state => ({
      ...state,
      shouldAutoFocus: false
    }));
  }, 100);
}

// Reset focus state when navigating
export function resetFocusState() {
  focusState.set({ target: null, shouldAutoFocus: false });
}
