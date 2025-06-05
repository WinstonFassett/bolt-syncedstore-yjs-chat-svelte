import { syncedStore, getYjsValue } from '@syncedstore/core'
import { WebrtcProvider } from 'y-webrtc'
import { Doc } from 'yjs'
import { readable, writable } from 'svelte/store'
import { svelteSyncedStore } from "@syncedstore/svelte";

// Define simple types for our test
type TestUser = {
  name: string
  age: number
}

type TestStore = {
  users: { [key:string]: TestUser }
  messages: Array<string>
}

// Create store with empty collections
const testStore = syncedStore<TestStore>(
  {
    users: {},
    messages: []
  }
)
export const store = svelteSyncedStore(testStore);

// Get YJS doc
const doc = getYjsValue(testStore) as Doc

// Set up WebRTC provider
const provider = new WebrtcProvider('test-room', doc, {
  signaling: ['ws://localhost:4444']
})

// Test function to add a user
export function addUser(id: string, name: string, age: number) {
  // testStore.users.set(id, { name, age })
  testStore.users[id] = { name, age }
}

// Test function to add a message
export function addMessage(text: string) {
  testStore.messages.push(text)
}

// Create a readable store that updates when users change
// NO!!! This is what syncedStore DOES for us
// export const users = readable<TestUser[]>([], (set) => {
//   const interval = setInterval(() => {
//     const userArray = testStore.users
//     set(userArray)
//   }, 100)
  
//   return () => clearInterval(interval)
// })

// NO!!! This is what syncedStore DOES for us
// Create a readable store that updates when messages change
// export const messages = readable<string[]>([], (set) => {
//   const interval = setInterval(() => {
//     set([...testStore.messages])
//   }, 100)
  
//   return () => clearInterval(interval)
// })