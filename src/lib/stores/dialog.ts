import { writable } from 'svelte/store';

export type DialogType = 'channelSettings' | 'userSettings' | 'createChannel' | null;

export interface DialogState {
  type: DialogType;
  props?: Record<string, any>;
}

function createDialogStore() {
  const { subscribe, set } = writable<DialogState>({ type: null });

  return {
    subscribe,
    open: (type: DialogType, props?: Record<string, any>) => set({ type, props }),
    close: () => set({ type: null }),
  };
}

export const dialog = createDialogStore();
