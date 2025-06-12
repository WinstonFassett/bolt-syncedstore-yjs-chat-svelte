import { writable } from 'svelte/store';
import type { Channel } from '../types/store';

interface DialogState {
  isOpen: boolean;
  channel: Channel | null;
}

function createDialogStore() {
  const { subscribe, set, update } = writable<DialogState>({
    isOpen: false,
    channel: null,
  });

  return {
    subscribe,
    open: (channel: Channel) => set({ isOpen: true, channel }),
    close: () => update(state => ({ ...state, isOpen: false })),
  };
}

export const channelSettingsDialog = createDialogStore();
