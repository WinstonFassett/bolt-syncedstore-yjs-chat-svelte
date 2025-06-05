<script lang="ts">
  import { getGravatarUrl, getInitials, stringToColor } from '../utils/avatar'
  
  export let username: string
  export let size: 'sm' | 'md' | 'lg' = 'md'
  export let customImage: string | undefined = undefined

  // Size mapping
  const sizeMap = {
    sm: {
      container: 'w-8 h-8',
      text: 'text-xs',
      imageSize: 32
    },
    md: {
      container: 'w-10 h-10',
      text: 'text-sm',
      imageSize: 40
    },
    lg: {
      container: 'w-14 h-14',
      text: 'text-lg',
      imageSize: 56
    },
    xl: {
      container: 'w-24 h-24', // Example size for extra large
      text: 'text-xl',
      imageSize: 96 // Gravatar size for xl
    }
  }

  // Get the avatar URL or fallback to initials
  $: gravatarUrl = customImage || getGravatarUrl(username, sizeMap[size].imageSize)
  $: initials = getInitials(username)
  $: bgColor = stringToColor(username)

  // Handle image load error
  let imgError = false
  function handleError() {
    imgError = true
  }
</script>

<div class="relative">
  <div class={`${sizeMap[size].container} overflow-hidden rounded-full flex items-center justify-center`}>
    {#if !imgError}
      <img 
        src={gravatarUrl} 
        alt={username} 
        class="w-full h-full object-cover"
        on:error={handleError} 
      />
    {:else}
      <div 
        class={`w-full h-full flex items-center justify-center ${sizeMap[size].text} text-white font-medium`}
        style={`background-color: ${bgColor}`}
      >
        {initials}
      </div>
    {/if}
  </div>
</div>