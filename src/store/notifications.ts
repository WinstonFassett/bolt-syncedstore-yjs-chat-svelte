import { writable, derived, get } from 'svelte/store'
import { onlineUsers, store, currentUserIdStore, currentChannelIdStore } from './index'
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
  CHANNEL_LEFT = 'CHANNEL_LEFT',
  NEW_MESSAGE = 'NEW_MESSAGE'
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

// Track previous users to detect new users added to the system
let previousUserIds = new Set<string>()

// Subscribe to online users changes to create toast notifications
export function setupUserPresenceNotifications(initOnly: boolean = false) {
  console.log('Setting up user presence notifications')
  
  // Initialize previous online users with current state
  const currentOnlineUsers = get(onlineUsers)
  previousOnlineUsers = new Set(currentOnlineUsers)
  
  // If this is just initialization, don't set up the subscription
  if (initOnly) return;
  
  return onlineUsers.subscribe($onlineUsers => {
    const currentUserId = get(currentUserIdStore)
    if (!currentUserId) return
    
    // Get new users who just came online
    const newUsers = [...$onlineUsers].filter(id => !previousOnlineUsers.has(id))
    
    // Get users who just went offline
    const leftUsers = [...previousOnlineUsers].filter(id => !$onlineUsers.has(id))
    
    // Create toast notifications for users who entered (excluding current user)
    newUsers.forEach(userId => {
      if (userId !== currentUserId) {
        const storeData = get(store) as Store
        const user = storeData.users[userId]
        if (user) {
          const displayName = user.fullName || user.username || 'Someone'
          addToast(`${displayName} entered the chat`, 'info', 5000)
        }
      }
    })
    
    // Create toast notifications for users who exited (excluding current user)
    leftUsers.forEach(userId => {
      if (userId !== currentUserId) {
        const storeData = get(store) as Store
        const user = storeData.users[userId]
        if (user) {
          const displayName = user.fullName || user.username || 'Someone'
          addToast(`${displayName} exited the chat`, 'info', 5000)
        }
      }
    })
    
    // Update previous online users for next comparison
    previousOnlineUsers = new Set($onlineUsers)
  })
}



// Setup message notifications
export function setupMessageNotifications(initOnly: boolean = false) {
  console.log('Setting up message notifications')
  
  // Track last seen message IDs per channel
  const lastSeenMessageIds = new Map<string, Set<string>>()
  
  // Initialize with current messages
  const storeData = get(store) as Store
  if (storeData && storeData.channels) {
    Object.keys(storeData.channels).forEach(channelId => {
      const messages = storeData.channels[channelId].messages || {}
      lastSeenMessageIds.set(channelId, new Set(Object.keys(messages)))
    })
  }
  
  // Initialize previous user IDs with current state
  previousUserIds = new Set(Object.keys(storeData.users || {}))
  
  // If this is just initialization, don't set up the subscription
  if (initOnly) return;
  
  // Subscribe to store changes to detect new messages
  return store.subscribe(($store: Store) => {
    const currentUserId = get(currentUserIdStore)
    const currentChannelId = get(currentChannelIdStore)
    if (!currentUserId) return
    
    // Check each channel for new messages
    Object.keys($store.channels).forEach(channelId => {
      const channel = $store.channels[channelId]
      const messages = channel.messages || {}
      const currentMessageIds = new Set(Object.keys(messages))
      const previousMessageIds = lastSeenMessageIds.get(channelId) || new Set()
      
      // Find new message IDs (in current but not in previous)
      const newMessageIds = [...currentMessageIds].filter(id => !previousMessageIds.has(id))
      
      // If there are new messages and we're not in this channel
      if (newMessageIds.length > 0 && channelId !== currentChannelId) {
        // Create notifications for each new message (excluding current user's messages)
        newMessageIds.forEach(messageId => {
          const message = messages[messageId]
          if (message && message.meta && message.meta.userId !== currentUserId) {
            const sender = $store.users[message.meta.userId]
            if (sender) {
              // Use fullName if available, otherwise username
              const displayName = sender.fullName || sender.username || 'Someone'
              const channelName = channel.name || 'a channel'
              const messagePreview = message.text.length > 30 
                ? message.text.substring(0, 30) + '...' 
                : message.text
              
              addToast(`${displayName} in #${channelName}: ${messagePreview}`, 'info', 8000)
            }
          }
        })
      }
      
      // Update the seen message IDs for this channel
      lastSeenMessageIds.set(channelId, currentMessageIds)
    })
    
    // Check for new users added to the system
    const currentUserIds = new Set(Object.keys($store.users))
    const newUserIds = [...currentUserIds].filter(id => !previousUserIds.has(id))
    
    // Create notifications for new users added to the system
    newUserIds.forEach(userId => {
      if (userId !== currentUserId) {
        const user = $store.users[userId]
        if (user) {
          const displayName = user.fullName || user.username || 'Someone'
          addToast(`${displayName} joined the chat`, 'info', 5000)
        }
      }
    })
    
    // Update previous user IDs
    previousUserIds = currentUserIds
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
      const displayName = user.fullName || user.username || 'Someone'
      const channelName = channel.name || 'a channel'
      addToast(`${displayName} joined #${channelName}`, 'info', 5000)
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
      const displayName = user.fullName || user.username || 'Someone'
      const channelName = channel.name || 'a channel'
      addToast(`${displayName} left #${channelName}`, 'info', 5000)
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


