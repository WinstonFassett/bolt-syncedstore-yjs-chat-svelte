import { writable, get } from 'svelte/store'
import { store, _store, currentUserIdStore, currentChannelIdStore, doc, awareness } from './index'
import { addToast } from './toasts'
import { syncedStore, getYjsValue, observeDeep } from '@syncedstore/core'

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

// Create a presence store to track online users
export const onlineUsers = writable<Set<string>>(new Set<string>())

// Track previously seen user IDs
let previousUserIds = new Set<string>()

// Track previous online users to detect changes
let previousOnlineUsers = new Set<string>()

// Subscribe to online users changes to create toast notifications
export function setupUserPresenceNotifications(initOnly: boolean = false) {
  console.log('Setting up user presence notifications')
  
  // If this is just initialization, don't set up the subscription
  if (initOnly) return;
  
  // Initial state
  const currentAwarenessUsers = new Set<string>()
  awareness.getStates().forEach((state: any) => {
    if (state.user && state.user.id) {
      currentAwarenessUsers.add(state.user.id)
    }
  })
  
  // Set initial online users
  previousOnlineUsers = new Set<string>(currentAwarenessUsers)
  onlineUsers.set(currentAwarenessUsers)
  
  // Handle awareness changes
  const handleAwarenessChange = () => {
    const currentUserId = get(currentUserIdStore)
    if (!currentUserId) return
    
    // Get current online users from awareness
    const newOnlineSet = new Set<string>()
    awareness.getStates().forEach((state: any) => {
      if (state.user && state.user.id) {
        newOnlineSet.add(state.user.id)
      }
    })
    
    // Update the store
    onlineUsers.set(newOnlineSet)
    
    // Get new users who just came online
    const newUsers = [...newOnlineSet].filter(id => !previousOnlineUsers.has(id))
    
    // Get users who just went offline
    const leftUsers = [...previousOnlineUsers].filter(id => !newOnlineSet.has(id))
    
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
    previousOnlineUsers = new Set(newOnlineSet)
  }
  
  // Set up awareness change handler
  awareness.on('change', handleAwarenessChange)
  
  // Return cleanup function
  return () => {
    if (awareness) {
      awareness.off('change', handleAwarenessChange)
    }
  }
}



// Setup message notifications
export function setupMessageNotifications(initOnly: boolean = false) {
  console.log('Setting up message notifications')
  
  // Get current state for initialization
  const storeData = get(store) as Store
  
  // Initialize previous user IDs with current state
  previousUserIds = new Set(Object.keys(storeData.users || {}))
  
  // If this is just initialization, don't set up the subscription
  if (initOnly) {
    console.log('Message notifications initialized with current state')
    return;
  }
  
  console.log('Setting up message notification subscription')
  
  // Function to handle message changes
  const handleMessageChanges = (events: any[], transaction: any): void => {
    const currentUserId = get(currentUserIdStore)
    const currentChannelId = get(currentChannelIdStore)
    
    if (!currentUserId) return
    
    // Get the current state to access user data
    const storeData = get(store) as Store
    
    // Process each event
    events.forEach(event => {
      // Check if this is a message being added to a channel
      if (event.path && 
          event.path.length >= 3 && 
          event.path[0] === 'channels' && 
          event.path[2] === 'messages') {
        
        // Get the channel ID from the path
        const channelId = event.path[1]
        
        // Skip notifications for the current channel
        if (channelId === currentChannelId) return
        
        const channel = storeData.channels[channelId]
        if (!channel) return
        
        // Process added messages
        if (event.changes && event.changes.added) {
          // For each added message
          event.changes.added.forEach((value: any, messageId: string) => {
            // Get the message
            const message = channel.messages[messageId]
            
            // Skip if not a valid message or it's from the current user
            if (!message || !message.meta || message.meta.userId === currentUserId) return
            
            // Check if the message is recent (within last 10 seconds)
            const now = Date.now()
            const messageTime = message.meta.createdAt
            const isRecent = now - messageTime < 10000 // 10 seconds threshold
            
            if (isRecent) {
              const sender = storeData.users[message.meta.userId]
              
              if (sender) {
                // Use fullName if available, otherwise username
                const displayName = sender.fullName || sender.username || 'Someone'
                const channelName = channel.name || 'a channel'
                const messagePreview = message.text.length > 30 
                  ? message.text.substring(0, 30) + '...' 
                  : message.text
                
                console.log(`New message from ${displayName} in ${channelName}: ${messagePreview}`)
                addToast(`${displayName} in #${channelName}: ${messagePreview}`, 'info', 8000)
              }
            }
          })
        }
      }
    })
  }
  
  // Function to handle user changes
  const handleUserChanges = (events: any[], transaction: any): void => {
    const currentUserId = get(currentUserIdStore)
    if (!currentUserId) return
    
    // Get the current state
    const storeData = get(store) as Store
    
    // Process each event
    events.forEach(event => {
      // Check for new users
      if (event.path && event.path.length === 1 && event.path[0] === 'users') {
        if (event.changes && event.changes.added) {
          // For each added user
          event.changes.added.forEach((value: any, userId: string) => {
            // Skip if we've already seen this user or it's the current user
            if (previousUserIds.has(userId) || userId === currentUserId) return
            
            const user = storeData.users[userId]
            if (user) {
              const displayName = user.fullName || user.username || 'Someone'
              addToast(`${displayName} joined the chat`, 'info', 5000)
              
              // Add to previous users
              previousUserIds.add(userId)
            }
          })
        }
      }
    })
  }
  
  // Set up observers
  const unobserveMessages = observeDeep(_store, handleMessageChanges)
  const unobserveUsers = observeDeep(_store, handleUserChanges)
  
  // Return cleanup function
  return () => {
    unobserveMessages()
    unobserveUsers()
  }
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


