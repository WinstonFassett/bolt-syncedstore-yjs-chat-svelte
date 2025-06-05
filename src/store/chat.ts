import { syncedStore, getYjsValue, type Box, boxed } from '@syncedstore/core'
import { WebrtcProvider } from 'y-webrtc'
import { Doc } from 'yjs'
import { readable, writable } from 'svelte/store'
import { svelteSyncedStore } from "@syncedstore/svelte"

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
    username: string
    createdAt: number
  }>
  fullName?: string
  avatar?: string
}

type ChatStore = {
  users: { [key: string]: User }
  channels: { [key: string]: Channel }
}

// Create store with empty collections
const chatStore = syncedStore<ChatStore>({
  users: {},
  channels: {}
})

// Export the Svelte-wrapped store
export const store = svelteSyncedStore(chatStore)

// Get YJS doc
const doc = getYjsValue(chatStore) as Doc

// Set up WebRTC provider
const provider = new WebrtcProvider('yjs-chat', doc, {
  signaling: ['ws://localhost:4444']
})

// User state
export const currentUserId = writable<string | null>(
  // localStorage.getItem('currentUserId')
)

currentUserId.subscribe(id => { 
  if (id) {
    localStorage.setItem('currentUserId', id)
  } else {
    localStorage.removeItem('currentUserId')
  }
})

// Channel state
export const currentChannelId = writable<string | null>(
  localStorage.getItem('currentChannelId')
)

currentChannelId.subscribe(id => {
  if (id) {
    localStorage.setItem('currentChannelId', id)
  } else {
    localStorage.removeItem('currentChannelId')
  }
})

// Thread state
export const currentThreadId = writable<string | null>(null)
export const isThreadPanelOpen = writable<boolean>(false)

// Store operations

export function initializeStore() {
  if (Object.keys(chatStore.channels).length > 0) return

  const generalId = crypto.randomUUID()
  const randomId = crypto.randomUUID()
  const helpId = crypto.randomUUID()
  const now = Date.now()

  // Create default channels
  chatStore.channels[generalId] = {
    meta: boxed({
      id: generalId,
      createdAt: now
    }),
    name: 'general',
    description: 'General discussions',
    messages: {}
  }

  chatStore.channels[randomId] = {
    meta: boxed({
      id: randomId,
      createdAt: now
    }),
    name: 'random',
    description: 'Random stuff',
    messages: {}
  }

  chatStore.channels[helpId] = {
    meta: boxed({
      id: helpId,
      createdAt: now
    }),
    name: 'help',
    description: 'Get help with YJS Chat',
    messages: {}
  }

  currentChannelId.set(generalId)
}

export function getUserByUsername(username: string): { id: string; isNew: boolean } {
  // Check if username exists
  const existingUser = Object.values(chatStore.users).find(
    user => user.meta.username === username
  )
  
  if (existingUser) {
    return { id: existingUser.meta.id, isNew: false }
  }

  // Create new user
  const id = crypto.randomUUID()
  const now = Date.now()

  chatStore.users[id] = {
    meta: boxed({
      id,
      username,
      createdAt: now
    })
  }

  return { id, isNew: true }
}

export function addMessage(channelId: string, userId: string, text: string, parentId?: string) {
  const channel = chatStore.channels[channelId]
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
  const channel = chatStore.channels[channelId]
  if (!channel) return false

  const message = channel.messages[messageId]
  if (!message) return false

  message.text = text
  message.updatedAt = Date.now()

  return true
}

export function deleteMessage(channelId: string, messageId: string) {
  const channel = chatStore.channels[channelId]
  if (!channel) return false

  const message = channel.messages[messageId]
  if (!message) return false

  message.deleted = true
  message.updatedAt = Date.now()

  return true
}