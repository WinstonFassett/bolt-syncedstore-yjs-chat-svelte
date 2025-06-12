<script lang="ts">
  import * as Dialog from '$lib/components/ui/dialog/index.js';
  import { channelSettingsDialog } from '$lib/stores/dialogs';
  import ChannelSettings from './ChannelSettings';
  
  // Subscribe to the dialog store
  $: ({ isOpen, channel } = $channelSettingsDialog);
  
  function handleOpenChange(open: boolean) {
    if (!open) {
      channelSettingsDialog.close();
    }
  }
</script>

<Dialog.Root open={isOpen} onOpenChange={handleOpenChange}>
  <Dialog.Portal>
    <Dialog.Overlay />
    <Dialog.Content>
      {#if channel}
        <ChannelSettings {channel} onClose={() => channelSettingsDialog.close()} />
      {/if}
    </Dialog.Content>
  </Dialog.Portal>
</Dialog.Root>
