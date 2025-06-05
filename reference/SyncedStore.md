# Getting Started

# Installation

Install `SyncedStore` and required dependencies:

```
npm install --save @syncedstore/core

# SyncedStore builds on top of yjs, install that too:
npm install --save yjs

```



## Optional dependencies[​](https://syncedstore.org/docs/basics/installation/#optional-dependencies)

Also install the following helper libraries to get started:

```
# For syncing over webrtc:
npm install --save y-webrtc

# If you use React, install the helper library:
npm install --save @syncedstore/react

```



`y-webrtc` is optional, but great during development. Later, you might want to use a different [sync provider](https://syncedstore.org/docs/sync-providers) instead of `y-webrtc`.

## Creating a store[​](https://syncedstore.org/docs/basics/installation/#creating-a-store)

Now, let's set up a `store` which contains and describes the data that should be synced across users and devices.

```
import { syncedStore, getYjsDoc } from "@syncedstore/core";
import { WebrtcProvider } from "y-webrtc";

// (optional, define types for TypeScript)
type Vehicle = { color: string; brand: string };

// Create your SyncedStore store
export const store = syncedStore({ vehicles: [] as Vehicle[] });

// Get the Yjs document and sync automatically using y-webrtc
const doc = getYjsDoc(store);
const webrtcProvider = new WebrtcProvider("my-document-id", doc);

```



You can now add objects to the `store.vehicles` array, and they will be synced automatically with other users. Even if you change properties (e.g.: `store.vehicles[0].color = "red";`), this will be synced with other users.

More about the main `syncedStore` method below, or [continue to the interactive example](https://syncedstore.org/docs/basics/example).

## `syncedStore` method[​](https://syncedstore.org/docs/basics/installation/#syncedstore-method)

The function `syncedStore` creates a store and takes two parameters:

* `shape`: an object that describes the data you want to keep in the store. Use the `shape` to define the names of objects, arrays, etc. you want to make collaborative and share across users.
* `doc` (optional): a Y.Doc instance. This will be the backing yjs document that contains the data in the store. Defaults to creating a new Y.Doc.

### Shape[​](https://syncedstore.org/docs/basics/installation/#shape)

Use the shape object to define the types ("shape") of the data you want to keep in the store. You can define as many properties as you like, and there are four different data types you can use; these are explained below.

```
const shape = {
 exampleArrayData: [],
 exampleObjectData: {},
 exampleXMLData: "xml",
 exampleTextData: "text",
};
const store = syncedStore(shape);

```



#### Arrays[​](https://syncedstore.org/docs/basics/installation/#arrays)

`exampleArrayData` in the code snippet above. Arrays must always be initialized as an empty array `[]`. You'll now be able to operate on the array `store.exampleArrayData` like you're used to (e.g.: *push*, *filter*, etc), and changes will be synced across the users of your app.

#### Objects[​](https://syncedstore.org/docs/basics/installation/#objects)

`exampleObjectData` in the code snippet above. Objects must always be initialized as an empty object `{}`. Objects in SyncedStore resemble Maps or plain javascript objects. You'll be able to set and get properties like you're used to with regular Javascript plain objects (e.g. `store.exampleObjectData.day = "Monday";`).

#### XML (advanced)[​](https://syncedstore.org/docs/basics/installation/#xml-advanced)

`exampleXMLData` in the code snippet above. `store.exampleXMLData` will now return a `SyncedXml` instance.

#### Text (advanced)[​](https://syncedstore.org/docs/basics/installation/#text-advanced)

`exampleTextData` in the code snippet above. `store.exampleTextData` will now return a `SyncedText` instance, see [Working with text](https://syncedstore.org/docs/advanced/text).



# Svelte

# Svelte integration

*SyncedStore* works seamlessly together with [Svelte Stores](https://svelte.dev/docs#run-time-svelte-store). Create a Svelte Store from your *SyncedStore* using `svelteSyncedStore` from the `@syncedstore/svelte` package.

```
import { syncedStore, getYjsValue } from "@syncedstore/core";
import { svelteSyncedStore } from "@syncedstore/svelte";

// Create your SyncedStore store
const todoStore = syncedStore({ todos: [] });

// Create Svelte Store for use in your components.
// You can treat this like any other store, including `bind`.
export const store = svelteSyncedStore(todoStore);

```



See this example of creating a collaborative Todo application with Svelte and SyncedStore:

App.sveltestore.js

App.svelte:

```
<script>
    import { svelteStore } from "./store.js";

    let newTodo = "";

    const addTodo = () => {
      const value = newTodo && newTodo.trim();

      if (!value) {
        return;
      }
      $svelteStore.todos.push({
        title: value,
        completed: false
      });
      newTodo = "";
    };

    const removeTodo = todo => {
      $svelteStore.todos.splice($svelteStore.todos.indexOf(todo), 1);
    };
</script>

<main id="app">
    <h1>Todo Svelte</h1>
    <form on:submit|preventDefault={addTodo}>
        <input
                class="new-todo"
                autocomplete="off"
                placeholder="What needs to be done?"
                bind:value={newTodo}
            />
        </form>
    <ul class="todo-list">
        {#each $svelteStore.todos as todo}
                <li class="todo">
                    <div>
                        <label>
                            <input class="toggle" type="checkbox" bind:checked={todo.completed} />
                            { todo.title }
                        </label>
                        <button class="destroy" on:click={() => removeTodo(todo)}>Delete</button>
                    </div>
                </li>
            {/each}
        </ul>
</main>

```



store.js

```
import { syncedStore, getYjsDoc } from "@syncedstore/core";
import { WebrtcProvider } from "y-webrtc";
import { svelteSyncedStore } from "@syncedstore/svelte";

// Create your SyncedStore store
export const store = syncedStore({ todos: [] });
export const svelteStore = svelteSyncedStore(store);

// Create a document that syncs automatically using Y-WebRTC
const doc = getYjsDoc(store);
export const webrtcProvider = new WebrtcProvider("syncedstore-todos", doc);

export const disconnect = () => webrtcProvider.disconnect();
export const connect = () => webrtcProvider.connect();

```



# Boxed Javascript values (advanced)

By default, all properties in the Synced store are made collaborative, *independently*.

This means that when you add an object to the store (e.g. `store.todos.push({ title: "groceries", completed: false}))`, both the `title` and `completed` property are seen as collaborative, and are synced independently.

This might not always be desirable, for two reasons:

1. Every collaborative object has some bookkeeping performance overhead.
2. Depending on your data model, it might not make sense. To determine this, ask yourself whether different properties should be allowed to be updated *independently*. In the "todo" example, is it ok for your app if user A sets a todo-item to completed, and user B changes the text at the same time?

## Boxed values[​](https://syncedstore.org/docs/advanced/boxed#boxed-values)

If you want to prevent subproperties from being made collaborative, you can use *boxed values*.

```
import { syncedStore, Box, boxed } from "@syncedstore/core";

export const store = syncedStore(doc, { todos: [] as Box<Todo>[] });

// ...

store.todos.push(boxed({ title: "groceries", completed: false }));

// Use `value` to get the contents of the box
const completed = store.todos[0].value.completed;

```



Now, the array will contain a single todo item that should be considered "frozen". Properties can be retrieved using `.value`. To update it, you now need to replace the entire item:

```
// GOOD:
store.todos.splice(0, 1, boxed({ title: "groceries", completed: true }));

// BAD, this won't sync as individual properties of a boxed item are not collaborative
store.todos[0].completed = true;



```



# Yjs integration (advanced)

SyncedStore uses [Yjs](https://github.com/yjs/yjs) as underlying CRDT. Yjs is a CRDT implementation with a focus on performance and collaborative text editing. It does have a fairly steep learning curve, which is why SyncedStore hides as many of the Yjs internals as possible.

However, should you want to access the underlying Yjs objects of your store, that's definitely possible.

## Accessing Yjs objects[​](https://syncedstore.org/docs/advanced/yjs#accessing-yjs-objects)

#### `getYjsValue(object: any)`[​](https://syncedstore.org/docs/advanced/yjs#getyjsvalueobject-any)

`object` is a value from the SyncedStore store. The return type of `getYjsValue` depends on the type passed in:

* If `object` is the store itself, the return value is a `Y.Doc`
* If `object` is an array, the return value is a `Y.Array`
* If `object` is an object, the return value is a `Y.Map`

Check out the demo of `getYjsValue` below:



App.tsx

```
import React from "react";
import { useSyncedStore } from "@syncedstore/react";
import { boxed, getYjsValue } from "@syncedstore/core";
import { store } from "./store"; // the store we defined above
import { ObjectInspector } from "react-inspector";

export default function App() {
  const state = useSyncedStore(store);

  const doc = getYjsValue(state);
  const array = getYjsValue(state.todos);
  const map = state.todos.length ? getYjsValue(state.todos[0]) : undefined;

  return (
    <div>
      <p>Todo items:</p>
      <p>{JSON.stringify(state)}</p>

      <ObjectInspector data={{ doc, array, map }} />
      <br />
      <div>
        <button
          onClick={() => {
            state.todos.push({ title: "This is a todo", completed: false });
          }}
        >
          Add a todo
        </button>
      </div>
    </div>
  );
}

```

store.ts

```
```



## Understanding the SyncedStore internals[​](https://syncedstore.org/docs/advanced/yjs#understanding-the-syncedstore-internals)

If you're familiar with Yjs, you might be interested in how SyncedStore works. There are two important abstractions SyncedStore introduces on top of Yjs:

* Instead of data types like Y.Map, and Y.Array, use plain Javascript objects and array

  * e.g.: `store.outer.inner.property = value` instead of `doc.getMap("outer").get("inner").set("property", "value")`
* Instead of having to call `.observe` manually, we integrate with a Reactive Functional Programming library to react to changes automatically

  * e.g.: wrap your code in `autorun` or use `useSyncedStore` (React), Mobx, or Vue's reactive model and automatically observe all used values from the store.

