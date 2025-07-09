<script lang="ts">
  import { onMount } from 'svelte';
  let shareUrl = '';
  let workspaceId = '';
  let showCopied = false;
  let qrCodeDataUrl = '';

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

<div class="flex flex-col items-center gap-4 p-4">
  <div class="text-sm font-medium mb-2">Share this workspace</div>
  <input class="w-full rounded border px-2 py-1 text-xs" readonly bind:value={shareUrl} />
  <button class="rounded bg-primary-600 px-3 py-1 text-xs text-white hover:bg-primary-700" on:click={copyLink}>
    {showCopied ? 'Copied!' : 'Copy Link'}
  </button>
  {#if qrCodeDataUrl}
    <img src={qrCodeDataUrl} alt="QR code for workspace link" class="mt-2 border rounded bg-white" />
  {/if}
</div>
