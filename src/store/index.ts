import { syncedStore, getYjsValue, type Box, boxed } from '@syncedstore/core'
import { WebrtcProvider } from 'y-webrtc'
import { IndexeddbPersistence } from 'y-indexeddb'
import { Doc } from 'yjs'
import { readable, writable, derived, get } from 'svelte/store'
import { svelteSyncedStore } from "@syncedstore/svelte"
import * as awarenessProtocol from 'y-protocols/awareness.js'


// Define the store types
type Message = {
  meta: Box<{
    id: string
    userId: string
    createdAt: number
    parentId?: string
  }>
  text: string
  updatedAt?: number
  deleted?: boolean
  reactions?: { [emoji: string]: string[] }
}

type Channel = {
  meta: Box<{
    id: string
    createdAt: number
  }>
  name: string
  description: string
  locked?: boolean
  messages: { [key: string]: Message }
}

type User = {
  meta: Box<{
    id: string
    createdAt: number
  }>
  username: string
  fullName?: string
  avatar?: string
}

type Store = {
  users: { [key: string]: User }
  channels: { [key: string]: Channel }
}

// Create store with empty collections
export const _store = syncedStore<Store>({
  users: {},
  channels: {}
})

// Export the Svelte-wrapped store
export const store = svelteSyncedStore(_store)

// Get YJS doc
export const doc = getYjsValue(_store) as Doc

export const awareness = new awarenessProtocol.Awareness(doc)

// Set up persistence with IndexedDB
export const persistenceProvider = new IndexeddbPersistence('yjs-chat-app', doc)

// Get signaling server URL from environment variable with fallback to localhost
const signalingServers = import.meta.env.VITE_SIGNALING_SERVERS 
  ? import.meta.env.VITE_SIGNALING_SERVERS.split(',').map((s: string) => s.trim())
  : ['ws://localhost:4444']

console.log('Using signaling servers:', signalingServers)

// Set up WebRTC provider
export const rtcProvider = new WebrtcProvider('yjs-chat-app', doc, {
  signaling: signalingServers,
  awareness
})

// User state
export const currentUserIdStore = writable<string | null>(
  localStorage.getItem('currentUserId')
)

currentUserIdStore.subscribe(id => {
  if (id) {
    localStorage.setItem('currentUserId', id)
  } else {
    localStorage.removeItem('currentUserId')
  }
})

// Channel state
export const currentChannelIdStore = writable<string | null>(
  localStorage.getItem('currentChannelId')
)

currentChannelIdStore.subscribe(id => {
  if (id) {
    localStorage.setItem('currentChannelId', id)
  } else {
    localStorage.removeItem('currentChannelId')
  }
})

// Thread state
export const currentThreadIdStore = writable<string | null>(null)
export const isThreadPanelOpen = writable<boolean>(false)

// Theme state
export const isDarkMode = writable<boolean>(true)

isDarkMode.subscribe(value => {
  if (typeof document !== 'undefined') {
    const html = document.documentElement
    if (value) {
      html.classList.add('dark')
    } else {
      html.classList.remove('dark')
    }
    localStorage.setItem('darkMode', value.toString())
  }
})

// Initialize theme from localStorage
if (typeof localStorage !== 'undefined') {
  const savedTheme = localStorage.getItem('darkMode')
  if (savedTheme !== null) {
    isDarkMode.set(savedTheme === 'true')
  }
}

// Store initialization check
export const isStoreInitialized = derived(store, $store => 
  Object.keys($store.channels).length > 0
)

// Current channel computed value
export const currentChannel = derived(
  [currentChannelIdStore, store],
  ([$currentChannelId, $store]) => {
    if (!$currentChannelId) return null
    return $store.channels[$currentChannelId] || null
  }
)

// Current user computed value
export const currentUser = derived(
  [currentUserIdStore, store],
  ([$currentUserId, $store]) => {
    if (!$currentUserId) return null
    return $store.users[$currentUserId] || null
  }
)

// Store operations
export function initializeStore() {
  if (Object.keys(_store.channels).length > 0) return

  const generalId = crypto.randomUUID()
  const randomId = crypto.randomUUID()
  const helpId = crypto.randomUUID()
  const now = Date.now()

  // Create default channels
  _store.channels[generalId] = {
    meta: boxed({
      id: generalId,
      createdAt: now
    }),
    name: 'general',
    description: 'General discussions',
    messages: {}
  }

  _store.channels[randomId] = {
    meta: boxed({
      id: randomId,
      createdAt: now
    }),
    name: 'random',
    description: 'Random stuff',
    messages: {}
  }

  _store.channels[helpId] = {
    meta: boxed({
      id: helpId,
      createdAt: now
    }),
    name: 'help',
    description: 'Get help with YJS Chat',
    messages: {}
  }

  currentChannelIdStore.set(generalId)
}

export function findUserByUsername(username: string): string | null {
  const userEntry = Object.entries(_store.users).find(([, user]) => user?.username === username);
  return userEntry ? userEntry[0] : null;
}

export function createUser(data: { username: string; fullName?: string; avatar?: string }): string {
  const id = crypto.randomUUID();
  const now = Date.now();

  _store.users[id] = {
    meta: boxed({
      id,
      createdAt: now
    }),
    username: data.username,
    fullName: data.fullName,
    avatar: data.avatar
  };
  return id;
}

export function updateUserProfile(userId: string, data: { username?: string; fullName?: string; avatar?: string }) {
  const existingUser = _store.users[userId];
  if (!existingUser) {
    console.error(`User with ID ${userId} not found for update.`);
    return;
  }

  // To update non-boxed top-level properties, we replace the object.
  _store.users[userId] = {
    ...existingUser, // Spread existing properties first
    meta: existingUser.meta, // Keep the original boxed meta object reference
    username: data.username !== undefined ? data.username : existingUser.username,
    fullName: data.fullName !== undefined ? data.fullName : existingUser.fullName,
    avatar: data.avatar !== undefined ? data.avatar : existingUser.avatar,
  };
  // Ensure awareness is updated after profile change
  setAwarenessUser(userId);
}

export function addMessage(channelId: string, userId: string, text: string, parentId?: string) {
  const channel = _store.channels[channelId]
  if (!channel) return null

  const messageId = crypto.randomUUID()
  const now = Date.now()

  channel.messages[messageId] = {
    meta: boxed({
      id: messageId,
      userId,
      createdAt: now,
      parentId
    }),
    text,
    reactions: {}
  }

  return messageId
}

export function updateMessage(channelId: string, messageId: string, text: string) {
  const channel = _store.channels[channelId]
  if (!channel) return false

  const message = channel.messages[messageId]
  if (!message) return false

  message.text = text
  message.updatedAt = Date.now()

  return true
}

export function deleteMessage(channelId: string, messageId: string) {
  const channel = _store.channels[channelId]
  if (!channel) return false

  const message = channel.messages[messageId]
  if (!message) return false

  message.deleted = true
  message.updatedAt = Date.now()

  return true
}

export function addReaction(channelId: string, messageId: string, userId: string, emoji: string) {
  const channel = _store.channels[channelId]
  if (!channel) return false

  const message = channel.messages[messageId]
  if (!message) return false

  if (!message.reactions) {
    message.reactions = {}
  }

  if (!message.reactions[emoji]) {
    message.reactions[emoji] = []
  }

  if (!message.reactions[emoji].includes(userId)) {
    message.reactions[emoji].push(userId)
  }

  return true
}

export function removeReaction(channelId: string, messageId: string, userId: string, emoji: string) {
  const channel = _store.channels[channelId]
  if (!channel) return false

  const message = channel.messages[messageId]
  if (!message || !message.reactions || !message.reactions[emoji]) return false

  message.reactions[emoji] = message.reactions[emoji].filter(id => id !== userId)

  if (message.reactions[emoji].length === 0) {
    delete message.reactions[emoji]
  }

  return true
}

export function updateChannel(channelId: string, name: string, description: string) {
  const channel = _store.channels[channelId]
  if (!channel) return false

  channel.name = name
  channel.description = description

  return true
}

export function clearChannelMessages(channelId: string) {
  const channel = _store.channels[channelId]
  if (!channel) return false

  channel.messages = {}
  return true
}

export function deleteChannel(channelId: string) {
  delete _store.channels[channelId]
  
  const currentId = get(currentChannelIdStore)
  if (currentId === channelId) {
    currentChannelIdStore.set(null)
  }
  
  return true
}

export function toggleChannelLock(channelId: string) {
  const channel = _store.channels[channelId]
  if (!channel) return false

  channel.locked = !channel.locked
  return true
}

export function getThreadReplies(channelId: string, messageId: string): Message[] {
  const channel = _store.channels[channelId]
  if (!channel) return []

  return Object.values(channel.messages)
    .filter(message => message.meta.value.parentId === messageId)
    .sort((a, b) => a.meta.value.createdAt - b.meta.value.createdAt)
}

// Connection status
export const connectionStatus = readable('connected', (set) => {
  const onStatusChange = (event: any) => {
    if (event.status === 'connected') {
      set('connected')
    } else {
      set('disconnected')
    }
  }
  
  set(rtcProvider.connected ? 'connected' : 'disconnected')
  rtcProvider.on('status', onStatusChange)
  
  return () => {
    rtcProvider.off('status', onStatusChange)
  }
})

// Online users tracking
export const onlineUsers = readable<Set<string>>(new Set(), (set) => {
  const checkOnlineUsers = () => {
    const online = new Set<string>()
    const states = rtcProvider.awareness.getStates()
    
    states.forEach((state) => {
      if (state.user?.id) {
        online.add(state.user.id)
      }
    })
    
    set(online)
  }
  
  checkOnlineUsers()
  rtcProvider.awareness.on('change', checkOnlineUsers)
  
  return () => {
    rtcProvider.awareness.off('change', checkOnlineUsers)
  }
})

// Awareness functions
export function setAwarenessUser(userId: string) {
  if (!userId) return
  
  const user = _store.users[userId]
  if (!user) return
  
  rtcProvider.awareness.setLocalState({
    user: {
      id: userId,
      username: user.username,
      fullName: user.fullName,
      avatar: user.avatar
    }
  })
}

export function clearAwarenessUser() {
  rtcProvider.awareness.setLocalState(null)
}
