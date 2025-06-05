/// <reference types="svelte" />
/// <reference types="vite/client" />

declare module 'y-webrtc' {
  import { Doc } from 'yjs'
  
  export class WebrtcProvider {
    constructor(
      roomName: string,
      doc: Doc,
      opts?: {
        signaling?: string[],
        password?: string,
        awareness?: any,
        maxConns?: number,
        filterBcConns?: boolean,
        peerOpts?: any
      }
    )
    
    on(event: string, callback: (event: any) => void): void
    off(event: string, callback: (event: any) => void): void
    
    connect(): void
    disconnect(): void
    destroy(): void
    
    awareness: {
      setLocalState(state: any): void
      getLocalState(): any
      getStates(): Map<number, any>
      on(event: string, callback: (event: any) => void): void
      off(event: string, callback: (event: any) => void): void
    }
    
    connected: boolean
  }
}

declare module 'y-indexeddb' {
  import { Doc } from 'yjs'
  
  export class IndexeddbPersistence {
    constructor(storeName: string, doc: Doc)
    
    whenSynced: Promise<void>
    
    destroy(): void
  }
}