import { writable } from 'svelte/store';

interface FocusState {
  shouldFocusChannelInput: boolean;
  shouldFocusThreadInput: boolean;
  targetThreadId: string | null;
}

function createFocusStore() {
  const { subscribe, update } = writable<FocusState>({
    shouldFocusChannelInput: false,
    shouldFocusThreadInput: false,
    targetThreadId: null
  });

  return {
    subscribe,
    requestChannelFocus: () => update(state => ({
      ...state,
      shouldFocusChannelInput: true,
      shouldFocusThreadInput: false
    })),
    requestThreadFocus: (threadId: string) => update(state => ({
      ...state,
      shouldFocusThreadInput: true,
      shouldFocusChannelInput: false,
      targetThreadId: threadId
    })),
    reset: () => update(state => ({
      shouldFocusChannelInput: false,
      shouldFocusThreadInput: false,
      targetThreadId: null
    }))
  };
}

export const focusStore = createFocusStore();

// Svelte action for handling focus
export function focusOnUpdate(node: HTMLElement, condition: boolean) {
  if (condition) {
    node.focus();
  }
}
