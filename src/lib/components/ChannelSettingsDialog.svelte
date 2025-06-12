<script lang="ts">
  import * as Dialog from '$lib/components/ui/dialog/index.js';
  import { channelSettingsDialog } from '$lib/stores/dialogs';
  import ChannelSettingsContent from '$lib/components/ChannelSettings/ChannelSettingsContent.svelte';
  
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
    {#if channel}
      <ChannelSettingsContent {channel} onClose={() => channelSettingsDialog.close()}  />
    {/if}
  </Dialog.Portal>
</Dialog.Root>
