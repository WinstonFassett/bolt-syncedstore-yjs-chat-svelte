import { writable, derived, get } from 'svelte/store'
import { onlineUsers, store, currentUserIdStore } from './index'
import { addToast } from './toasts'

// Define store types
type User = {
  meta: {
    id: string
    createdAt: number
  }
  username: string
  fullName?: string
  avatar?: string
}

type Channel = {
  meta: {
    id: string
    createdAt: number
  }
  name: string
  description: string
  locked?: boolean
  messages: Record<string, any>
}

type Store = {
  users: { [key: string]: User }
  channels: { [key: string]: Channel }
}

// Types of notifications
export enum NotificationType {
  USER_JOINED = 'USER_JOINED',
  USER_LEFT = 'USER_LEFT',
  CHANNEL_JOINED = 'CHANNEL_JOINED',
  CHANNEL_LEFT = 'CHANNEL_LEFT'
}

// Store for channel memberships
export const channelMemberships = writable<Record<string, Record<string, boolean>>>({})

// Initialize channel memberships
export function initializeChannelMemberships() {
  const currentMemberships: Record<string, Record<string, boolean>> = {}
  
  // Initialize with empty membership objects for all channels
  if (store && store.channels) {
    Object.keys(store.channels).forEach(channelId => {
      currentMemberships[channelId] = {}
    })
  }
  
  channelMemberships.set(currentMemberships)
}

// Track previous online users to detect changes
let previousOnlineUsers = new Set<string>()

// Subscribe to online users changes to create toast notifications
export function setupUserPresenceNotifications() {
  console.log('Setting up user presence notifications')
  
  return onlineUsers.subscribe($onlineUsers => {
    const currentUserId = get(currentUserIdStore)
    if (!currentUserId) return
    
    console.log('Online users changed:', { 
      currentUsers: [...$onlineUsers], 
      previousUsers: [...previousOnlineUsers],
      currentUserId
    })
    
    // Get new users who just came online
    const newUsers = [...$onlineUsers].filter(id => !previousOnlineUsers.has(id))
    
    // Get users who just went offline
    const leftUsers = [...previousOnlineUsers].filter(id => !$onlineUsers.has(id))
    
    console.log('User changes detected:', { newUsers, leftUsers })
    
    // Create toast notifications for users who joined (excluding current user)
    newUsers.forEach(userId => {
      if (userId !== currentUserId) {
        const storeData = get(store) as Store
        const user = storeData.users[userId]
        if (user) {
          const username = user.username || 'Someone'
          addToast(`${username} joined the chat`, 'info', 5000)
        }
      }
    })
    
    // Create toast notifications for users who left (excluding current user)
    leftUsers.forEach(userId => {
      if (userId !== currentUserId) {
        const storeData = get(store) as Store
        const user = storeData.users[userId]
        if (user) {
          const username = user.username || 'Someone'
          addToast(`${username} left the chat`, 'info', 5000)
        }
      }
    })
    
    // Update previous online users for next comparison
    previousOnlineUsers = new Set($onlineUsers)
  })
}



// Function to join a channel
export function joinChannel(channelId: string, userId: string) {
  const currentUserId = get(currentUserIdStore)
  
  channelMemberships.update(memberships => {
    // Initialize channel memberships if not exists
    if (!memberships[channelId]) {
      memberships[channelId] = {}
    }
    
    // Add user to channel members
    memberships[channelId][userId] = true
    
    return memberships
  })
  
  // Create toast notification for other users (not the one joining)
  if (userId !== currentUserId) {
    const storeData = get(store) as Store
    const user = storeData.users[userId]
    const channel = storeData.channels[channelId]
    
    if (user && channel) {
      const username = user.username || 'Someone'
      const channelName = channel.name || 'a channel'
      addToast(`${username} joined #${channelName}`, 'info', 5000)
    }
  }
}

// Function to leave a channel
export function leaveChannel(channelId: string, userId: string) {
  const currentUserId = get(currentUserIdStore)
  
  channelMemberships.update(memberships => {
    // Remove user from channel members if exists
    if (memberships[channelId] && memberships[channelId][userId]) {
      delete memberships[channelId][userId]
    }
    
    return memberships
  })
  
  // Create toast notification for other users (not the one leaving)
  if (userId !== currentUserId) {
    const storeData = get(store) as Store
    const user = storeData.users[userId]
    const channel = storeData.channels[channelId]
    
    if (user && channel) {
      const username = user.username || 'Someone'
      const channelName = channel.name || 'a channel'
      addToast(`${username} left #${channelName}`, 'info', 5000)
    }
  }
}

// Check if a user is a member of a channel
export function isChannelMember(channelId: string, userId: string): boolean {
  const memberships = get(channelMemberships)
  return !!(memberships[channelId] && memberships[channelId][userId])
}

// Get all members of a channel
export function getChannelMembers(channelId: string): string[] {
  const memberships = get(channelMemberships)
  if (!memberships[channelId]) return []
  return Object.keys(memberships[channelId])
}


