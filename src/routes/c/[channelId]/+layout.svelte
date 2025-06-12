<script lang="ts">
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import { afterNavigate } from '$app/navigation';
  import ExampleAppSidebar from "$lib/components/example-app-sidebar.svelte";
  import { Separator } from "$lib/components/ui/separator/index.js";
  import * as Sidebar from "$lib/components/ui/sidebar/index.js";
  import { currentChannel } from '$lib/store';
  import ChannelHeader from '$lib/components/ChannelHeader.svelte';
  import ChannelSettings from '$lib/components/ChannelSettings';
  import { resetFocusState } from '$lib/stores/routeFocus';
  
  // Local state for channel settings dialog
  let showSettings = false;
  
  function openChannelSettings() {
    showSettings = true;
  }
  
  function closeChannelSettings() {
    showSettings = false;
  }
  
  // Reset focus state when route changes
  afterNavigate(() => {
    resetFocusState();
  });
</script>

<Sidebar.Provider>
  <ExampleAppSidebar />
  <Sidebar.Inset class="flex flex-col h-screen">
    <!-- Header with channel info -->
    <header class="flex h-16 shrink-0 items-center gap-2 border-b px-4 bg-background">
      <Sidebar.Trigger class="-ml-1" />
      <Separator orientation="vertical" class="mr-2 h-4" />
      {#if $currentChannel}
        <ChannelHeader 
          channel={$currentChannel} 
          onSettingsClick={openChannelSettings} 
          showBackButton={false}
        />
      {/if}
    </header>
    
    <!-- Main content area -->
    <div class="flex-1 flex flex-col overflow-hidden">
      <slot />
    </div>
    
    <!-- Channel Settings Dialog -->
    {#if showSettings && $currentChannel}
      <ChannelSettings 
        channel={$currentChannel} 
        onClose={closeChannelSettings} 
      />
    {/if}
  </Sidebar.Inset>
</Sidebar.Provider>
