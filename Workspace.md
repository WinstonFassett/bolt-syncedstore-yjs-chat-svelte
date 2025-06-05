# Workspace


# Priorities

- Fix Bugs
- Do not worry about TS errors, only real errors. do not waste cycles on TS yet.
- Add desired features
- Ensure consistency (of the right things) and get rid of the junk
- Nice UI, thoughtful touches, nice transitions and animations, careful use of icons, color and layout. Don't generate SVG icons, just use existing lucide etc already imported

# Bugs


initializeStore() should not be called automatically. 
until initialized, all users should see option to bootstrap the store by creating the initial channel(s). when user clicks to bootstrap, then initializeStore() 


`<div>` with a mouseenter or mouseleave handler must have an ARIA role
https://svelte.dev/e/a11y_no_static_element_interactionssvelte(a11y_no_static_element_interactions)



# Console Bugs

```
hook.js:608 property not found on root doc subscribe
overrideMethod @ hook.js:608
getYjsByTypeDescription @ doc.ts:48
get @ doc.ts:101
validate_store @ validate.js:34
$chatStore @ ProfileSetup.svelte:4
handleSubmit @ ProfileSetup.svelte:36
(anonymous) @ event-modifiers.js:97
(anonymous) @ events.js:61
without_reactive_context @ shared.js:44
target_handler @ events.js:60Understand this warning
hook.js:608 Svelte error: store_invalid_shape
`chatStore` is not a store with a `subscribe` method
```


# Features Needed

- Use first-class dialogs everywhere - replace inline popups
- when message has comments have line below with mini avatars of participants and count of replies and time of last reply
- UI should feature Full Name instead of username, unless unavailable. and if showing both and they are the same, only show once
- Use nicer form style from Join screen in Profile dialog 
- improve usability of forms

# Features Wanted

#### Routes

```
/ -> redirects to either join or selected/most recent/default channel
/join
c/[channelId]
c/[channelId]/m/[messageId] activates thread view
/settings for user and client and device settings
/admin  maybe. for advanced dangerous things like admin'ing user info and channels, clearing all channels, "everything". 
```

#### Join and Leave Channels

No invites or security, but could still have the concept of people who have joined

#### Additional Emoji Button

when message has emoji, include with them an emoji-sized button to add more emoji.

### Delete confirmation on Messages

Always confirm message Delete

Track deleted messages in memory and allow undelete for those 

#### Rich-text editing and formatting 

Using tiptap or something like it. bold, italics, links, 

user and channel mentions would be nice

### Command Menu (cmdk) with channel nav and search

Full text ish search using fuzzy matching and traversal of full store or selected channel(s)

### Click User name/avatar to View Info Popup

hover user display name to see username

## Icons 

Uses lucide icons. don't generate SVGs or SVG paths.




#### Enter/Exit Notifications 

When people join/leave channels I am in (syncedstore)

When people join/leave the y webrtc (yjs presence)


# Defer

####  Missed Notifications

This could be tricky, maybe save for another spike

- Default Notification Settings
- Notification Settings per Channel

Types: Message, Mention

Avoid notifications about past things. Depends on tracking read state of messages, either per user in doc, or in device storage

How could we implement this??

