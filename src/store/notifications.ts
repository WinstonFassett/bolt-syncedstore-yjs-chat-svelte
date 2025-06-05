import { writable, get } from 'svelte/store';
import { 
  store, 
  currentUserIdStore,
  currentChannelIdStore,
  currentThreadIdStore,
  doc, 
  awareness 
} from './index';
import { addToast } from './toasts';
import { syncedStore, getYjsValue, observeDeep } from '@syncedstore/core'
import type { Box } from '@syncedstore/core';

// Define store types
type User = {
  meta: Box<{
    id: string
    createdAt: number
  }>
  username: string
  fullName?: string
  avatar?: string
}

type Channel = {
  meta: Box<{
    id: string
    createdAt: number
  }>
  name: string
  description: string
  locked?: boolean
  messages: { [key: string]: any }
  members: string[]
}

type Store = {
  users: { [key: string]: User }
  channels: { [key: string]: Channel }
}

// Type for the SyncedStore wrapper
type SyncedStore = ReturnType<typeof syncedStore<Store>>;

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
  console.log('Initializing channel memberships...')
  
  // Get all channels
  const storeData = get(store) as any
  const channels = storeData.channels || {}
  
  // Initialize members for each channel if not exists
  Object.keys(channels).forEach(channelId => {
    if (!channels[channelId].members) {
      channels[channelId].members = []
    }
  })
  
  console.log('Channel memberships initialized')
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
import type { Transaction } from 'yjs';

// Simplified type for Yjs map changes
interface YMapChange<T = unknown> {
  action: 'add' | 'update' | 'delete';
  oldValue?: T;
  newValue?: T;
}

export function setupMessageNotifications(initOnly: boolean = false) {
  console.log('📣 Setting up message notifications')
  
  // Get the channels map directly from Yjs
  const yChannelsMap = doc.getMap('channels')
  console.log('🗺️ Got channels map from Yjs doc')
  
  // Handle channel changes
  const handleChannelChanges = (events: any[], transaction: Transaction) => {
    for (const event of events) {
      // Only process map events with changes
      if (!event.target || !event.changes?.keys) continue
      
      // Process each changed key
      event.changes.keys.forEach((change: YMapChange, key: string) => {
        if (change.action === 'add') {
          const messageData = event.target.get(key)
          if (!messageData) return
          
          // Convert Y.Map to plain object if needed
          const message = typeof messageData.toJSON === 'function' 
            ? messageData.toJSON() 
            : messageData
          
          console.log('📨 New message detected:', { key, messageData })
          
          // Skip if it's from the current user
          const currentUserId = get(currentUserIdStore)
          const messageMeta = message.meta || {}
          const messageUserId = typeof messageMeta === 'object' && 'userId' in messageMeta 
            ? messageMeta.userId 
            : undefined
            
          if (messageUserId === currentUserId) {
            console.log('⏭️ Skipping own message')
            return
          }
          
          // Get channel ID from parent structure first
          let channelId: string | undefined;
          try {
            // Navigate up: message -> channel -> meta -> id
            const channelMap = event.target.parent;
            if (channelMap) {
              const channelMeta = channelMap.get?.('meta');
              channelId = typeof channelMeta?.toJSON === 'function' 
                ? channelMeta.toJSON()?.id 
                : channelMeta?.id;
            }
          } catch (e) {
            console.error('Error getting channel ID:', e);
          }
          
          if (!channelId || !messageUserId) {
            console.log('⚠️ Missing channel or user ID in message', { channelId, userId: messageUserId })
            return
          }
          
          // Get current channel and thread from store
          const currentChannelId = get(currentChannelIdStore)
          const currentThreadId = get(currentThreadIdStore)
          
          // Only show notification for current channel/thread
          // In future will do an includes check for channels user has joined.
          if (
            channelId !== currentChannelId 
            //  BAD LOGIC: && channelId !== currentThreadId
          ) {
            console.log(`⏭️ Skipping message not in current view (channel/thread: ${channelId}`)
            return
          }
          
          if (!channelId || !messageUserId) {
            console.log('⚠️ Missing channel or user ID in message', { channelId, userId: messageUserId })
            return
          }
          
                  // Get store data with proper typing
          const storeData = get(store) as any;
          const userId = messageUserId;
          
          // Get channel and user info with null checks
          const channel = storeData?.channels?.[channelId];
          const user = storeData?.users?.[userId];
          
          if (!channel || !user) {
            console.log('⚠️ Channel or user not found', { channelId, userId })
            return
          }
          
          // Format the notification
          const displayName = (user.fullName || user.username || 'Someone') as string
          const channelName = (channel.name || 'a channel') as string
          const messageText = (message.text || '') as string
          const messagePreview = messageText.length > 30 
            ? messageText.substring(0, 30) + '...' 
            : messageText
          
          console.log(`🔔 Showing toast: ${displayName} in #${channelName}: ${messagePreview}`)
          addToast(
            `${displayName} in #${channelName}: ${messagePreview}`,
            'info',
            8000
          )
        }
      })
    }
  }
  
  // Set up the observer
  console.log('👀 Setting up Yjs observer for channels map')
  // @ts-ignore - Yjs types are a bit wonky with observeDeep
  yChannelsMap.observeDeep(handleChannelChanges)
  
  // Return cleanup function
  return () => {
    console.log('🧹 Cleaning up Yjs observer')
    if (yChannelsMap) {
      yChannelsMap.unobserveDeep(handleChannelChanges)
    }
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
  // Get channel members with proper store access
  const storeData = get(store) as any;
  const channels = storeData?.channels as { [key: string]: any } | undefined;
  const channel = channels?.[channelId];
  if (!channel) return [];
  return channel.members || [];
}
