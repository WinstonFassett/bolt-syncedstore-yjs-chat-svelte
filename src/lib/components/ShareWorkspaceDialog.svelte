<script lang="ts">
import { Dialog, Content, Title, Description, Trigger, Overlay, Footer, Header } from '$lib/components/ui/dialog';
import { onMount } from 'svelte';
let shareUrl = '';
let workspaceId = '';
let showCopied = false;
let qrCodeDataUrl = '';
let isOpen = false;

onMount(async () => {
  workspaceId = localStorage.getItem('workspaceId') || '';
  shareUrl = `${window.location.origin}/workspace/${workspaceId}`;
  // Dynamically import qrcode library for QR code generation
  const QRCode = (await import('qrcode')).default;
  qrCodeDataUrl = await QRCode.toDataURL(shareUrl, { width: 180 });
});

function copyLink() {
  navigator.clipboard.writeText(shareUrl);
  showCopied = true;
  setTimeout(() => showCopied = false, 1200);
}
</script>

<Dialog bind:open={isOpen}>
  <Trigger asChild>
    <button class="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-dark-300">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-gray-500 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 8a3 3 0 11-6 0 3 3 0 016 0zm6 8a6 6 0 00-12 0v1a2 2 0 002 2h8a2 2 0 002-2v-1z" /></svg>
      <span>Share Workspace</span>
    </button>
  </Trigger>
  <Overlay />
  <Content class="max-w-xs w-full">
    <Header>
      <Title>Share this workspace</Title>
      <Description>Invite others to join your workspace by sharing this link or QR code.</Description>
    </Header>
    <div class="flex flex-col items-center gap-4 p-4">
      <input class="w-full rounded border px-2 py-1 text-xs" readonly bind:value={shareUrl} />
      <button class="rounded bg-primary-600 px-3 py-1 text-xs text-white hover:bg-primary-700" on:click={copyLink}>
        {showCopied ? 'Copied!' : 'Copy Link'}
      </button>
      {#if qrCodeDataUrl}
        <img src={qrCodeDataUrl} alt="QR code for workspace link" class="mt-2 border rounded bg-white" />
      {/if}
    </div>
    <Footer>
      <button class="mt-2 w-full rounded bg-gray-200 dark:bg-dark-300 px-3 py-1 text-xs" on:click={() => isOpen = false}>Close</button>
    </Footer>
  </Content>
</Dialog>
