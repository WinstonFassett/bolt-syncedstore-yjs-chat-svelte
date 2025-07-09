<script lang="ts">
  import { setWorkspaceId } from '$lib/store';
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';

  export let params: { workspaceId?: string };

  onMount(() => {
    const id = params?.workspaceId;
    if (!id) {
      // If no workspaceId, generate one and redirect
      const newId = crypto.randomUUID();
      goto(`/workspace/${newId}`);
      return;
    }
    setWorkspaceId(id);
  });
</script>

<slot />
