import md5 from 'md5'

/**
 * Generate a Gravatar URL from a username
 * @param username The username to generate a Gravatar for
 * @param size The size of the Gravatar image
 * @returns A URL to the Gravatar image
 */
export function getGravatarUrl(username: string, size: number = 80): string {
  // Use MD5 hash of the username for Gravatar
  const hash = md5(username.trim().toLowerCase())
  
  // Return Gravatar URL with specified size and default image
  return `https://www.gravatar.com/avatar/${hash}?s=${size}&d=identicon`
}

/**
 * Generate initials from a name
 * @param name The name to generate initials from
 * @returns Initials (maximum 2 characters)
 */
export function getInitials(name: string): string {
  if (!name) return '?'
  
  const parts = name.trim().split(/\s+/)
  
  if (parts.length === 1) {
    return parts[0].charAt(0).toUpperCase()
  }
  
  return (
    parts[0].charAt(0).toUpperCase() + 
    parts[parts.length - 1].charAt(0).toUpperCase()
  )
}

/**
 * Generate a color from a string
 * @param str The string to generate a color from
 * @returns A hex color string
 */
export function stringToColor(str: string): string {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash)
  }
  
  let color = '#'
  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xFF
    color += ('00' + value.toString(16)).substr(-2)
  }
  
  return color
}