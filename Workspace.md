# Workspace


# Priorities

- Avoid making many small changes in many discrete steps. Operate at the file level making full passes, whether incremental or complete. Recall the whole list of TODOs as you go so that if you are modifying a file, you can see the big picture and make sure you are not missing any important details, and you include related changes from other bullets when they fall into the same files. Whole cloth is a huge priority.  
- Fix Bugs, but do not foolishly consider them fixed until user has verified. Accessibility does not matter yet. Focus on core functionality described here.
- Focus on UI needs and ask permission before changing the store index.
- Do not worry about TS errors, only real errors. do not waste cycles on TS yet. Do not get distracted by anything except what is being requested. Priorities matter.
- Add desired features
- Ensure consistency (of the right things) and get rid of the junk
- Nice UI, thoughtful touches, nice transitions and animations, careful use of icons, color and layout. Don't generate SVG icons, just use existing lucide etc already imported

# Bugs

- [ ] Errors on first user first load because findUserByUsername returns undefined but code does not expect it. NOT fixed in R2.
- [] Update profile does not seem to work. See also form features / consistency needed below. *(LLM Assumed this was fixed with r2 and current logic, pending test confirmation)*
- [ ] Channel settings will not close. may be related to console error below *(NOT Fixed in r2)*


# Console Bugs

```
hook.js:608 TypeError: Cannot destructure property 'id' of 'findUserByUsername(...)' as it is null.
    at HTMLFormElement.handleSubmit (ProfileSetup.svelte:29:15)
    at HTMLFormElement.<anonymous> (event-modifiers.js:97:14)
    at events.js:61:21
    at without_reactive_context (shared.js:44:10)
    at HTMLFormElement.target_handler (events.js:60:11)
```

# Features Needed


- when message has comments have line below with mini avatars of participants and count of replies and time of last reply
- [x] UI should feature Full Name instead of username, unless unavailable. and if showing both and they are the same, only show once
- improve usability of forms
- When opening/clicking a channel or thread link, focus the appropriate message input. 
- Also, enter key should submit forms including profile edit, channel create.
- [ ] Use nicer form style from Join screen in Profile dialog *(In progress: Modal width, avatar preview, helper text added. Button styling and further alignment pending)* 

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
click username or avatar to view info popup. 

## Icons 

Uses lucide icons. don't generate SVGs or SVG paths.


# Profile edit should be as usable as / similar to the join form

i.e. with gravatar preview, etc. be consistent.  

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

# Journal

## Round 2: Gravatar Preview, Profile Form Styling, and r2 Fixes

**Date:** 2025-06-05

### Goals:
- Implement Gravatar preview in the User Settings modal (`CurrentUser.svelte`).
- Begin aligning the User Settings modal style with `ProfileSetup.svelte` for consistency.
- Document USER's "r2" fixes which resolved several bugs and inconsistencies.

### Work Summary & Key Changes:

**Cascade - Gravatar Preview & Profile Form Styling (`CurrentUser.svelte`):**
*   Added an input field for `editingAvatar` URL in the User Settings modal.
*   Implemented a live avatar preview *above* the username field. The preview updates as the URL is typed.
*   Added an `on:error` handler (using a Svelte function `handleImageError`) to the preview `<img>` tag to hide the broken image and display a text error message if the URL is invalid or the image fails to load.
*   Adjusted the User Settings modal width from `max-w-sm` to `max-w-md`.
*   Relocated the avatar preview to be above the username input and centered it.
*   Added helper text below the username input: "Your unique username (minimum 3 characters).".

**USER Fixes ("r2") - Summary:**
*   **Store Usage:** Updated `ProfileSetup.svelte` and `ChatTest.svelte` to correctly use `findUserByUsername` (the refactored read-only function) instead of the old `getUserByUsername`.
*   **HTML Semantics:** Fixed `id` attributes for labels in `ProfileSetup.svelte` for proper accessibility and form control linkage.
*   **Data Access:** Corrected `ChatTest.svelte` to access `user.username` directly, as user properties are no longer nested under `meta.value` in the store after recent refactoring.
*   FAILED: ~~**Dialog Closing Bug:** Fixed the `ChannelSettings.svelte` dialog not closing and a related console error by changing `dialog.expanded.subscribe` to the correct `dialog.subscribe` (subscribing to the whole store of the dialog, not just its `expanded` state).~~

### Next Steps & Testing Points:
*   USER to test the User Settings modal: avatar preview functionality (valid/invalid URLs), persistence of changes, helper text visibility, and overall modal appearance.
*   Continue styling `CurrentUser.svelte` modal: button styles (Save, Cancel, Sign Out), and any other remaining inconsistencies with `ProfileSetup.svelte`.
*   Implement the actual User Info Popup/Dialog (currently placeholder `console.log`s).

---

## Round 1: Dialog Refactoring (User Profile & Channel Settings)

**Date:** 2025-06-05

### Goals:
- Refactor inline popups for User Profile and Channel Settings into first-class native HTML dialogs.
- Maintain UI consistency and improve accessibility.
- Clarify the scope of "first-class dialogs" as per user feedback.

### Step Outline & Success Grade (0-10):

1.  **Initial Misunderstanding (MessageItem Actions):** Attempted to refactor message actions toolbar into a dialog.
    *   **Grade: 2/10** - Misinterpreted the requirement, but correctly reverted upon user clarification.
2.  **Clarification of Scope:** User specified that "first-class dialogs" are for User Profile and Channel Settings *only*, not message actions.
    *   **Grade: 10/10** - Clear guidance received.
3.  **Refactor `CurrentUser.svelte` (User Profile Dialog):**
    *   Initial plan (native `<dialog>` element): Proposed, but not aligned with existing project patterns.
        *   **Grade: 5/10** - Technically feasible but not ideal for consistency.
    *   User Correction: Pointed to `ChannelList.svelte` which uses `svelte-headlessui`.
    *   Revised plan & implementation (using `svelte-headlessui`):
        *   **Grade: 9/10** - Successfully refactored. A minor lint error (extra `{/if}`) was introduced.
    *   Fix lint error in `CurrentUser.svelte`: Removed extraneous closing tag.
        *   **Grade: 10/10** - Quickly resolved.
4.  **Refactor `ChannelSettings.svelte` (Channel Settings Dialog):**
    *   Plan (using `svelte-headlessui`, handling `openModal` prop for parent control):
        *   **Grade: 9/10** - Good plan, incorporating lessons from `CurrentUser.svelte`.
    *   Implementation:
        *   **Grade: 9/10** - Successful refactor. Introduced new accessibility lint warnings for labels.
    *   Fix accessibility lint errors: Added `for`/`id` attributes to labels and inputs.
        *   **Grade: 10/10** - Resolved.
5.  **Update `MainView.svelte`:** Modified to pass `openModal` prop to `ChannelSettings.svelte`.
    *   **Grade: 10/10** - Correctly integrated the refactored child component.
6.  **Update `MessageItem.svelte`:** Added `role="group"` to message container for accessibility, based on earlier lint warning.
    *   **Grade: 9/10** - Addressed a separate accessibility concern.

### Lessons Learned & User Corrections:

-   **Scope Clarity is Key:** The initial interpretation of "first-class dialogs everywhere" was too broad. User correction to limit this to "user profile dialog" and "channel settings dialog" was crucial.
-   **Leverage Existing Patterns:** The user's guidance to use the `svelte-headlessui` pattern from `ChannelList.svelte` was invaluable. This ensures consistency and leverages an established accessibility-focused library. I should proactively look for such patterns.
-   **`svelte-headlessui` for Dialogs:** This library provides a robust way to create accessible dialogs.
-   **Parent-Child Dialog Control:** When a dialog component is controlled by a parent (e.g., `ChannelSettings.svelte` by `MainView.svelte`):
    *   The child dialog component (`ChannelSettings.svelte`) should accept a prop like `openModal`.
    *   Internally, it uses `svelte-headlessui`'s `createDialog`.
    *   It should reactively open/close its `headlessui` dialog based on the `openModal` prop.
    *   It needs to `dispatch('close')` event if the dialog is closed by an internal action (e.g., 'X' button, backdrop click, save action) so the parent can update its state (e.g., `showSettings = false`). This is managed by subscribing to `$dialog.expanded` and dispatching if `!isExpanded && openModal`.
-   **Accessibility Attributes:** Ensure labels are correctly associated with form controls using `for` and `id` attributes.

### Correct Usage of `svelte-headlessui` Dialog:

Based on `ChannelList.svelte`, `CurrentUser.svelte`, and `ChannelSettings.svelte`:

1.  **Import:**
    ```javascript
    import { createDialog } from 'svelte-headlessui';
    import { X } from 'lucide-svelte'; // For close button
    import { fade, scale } from 'svelte/transition'; // For animations
    ```
2.  **Instantiate:**
    ```javascript
    const dialog = createDialog({ label: 'Descriptive Modal Title' });
    ```
3.  **Basic Markup Structure:**
    ```html
    {#if $dialog.expanded}
      <div class="relative z-50" transition:fade={{ duration: 150 }}>
        <!-- Backdrop -->
        <div
          class="fixed inset-0 bg-black/30"
          aria-hidden="true"
          on:click={dialog.close}
          transition:fade={{ duration: 150 }}
        ></div>
        <!-- Modal Panel Container -->
        <div class="fixed inset-0 overflow-y-auto">
          <div class="flex min-h-full items-center justify-center p-4">
            <!-- Modal Panel -->
            <div
              class="w-full max-w-md transform overflow-hidden rounded-lg bg-white p-6 text-left align-middle shadow-xl transition-all dark:bg-dark-200"
              use:dialog.modal
              transition:scale={{ duration: 150, start: 0.95 }}
            >
              <!-- Title (implicitly handled by `label` in createDialog, or explicitly with `use:dialog.title`) -->
              <div class="flex items-center justify-between">
                <h3 class="text-lg font-medium" use:dialog.title>Your Title Here</h3>
                <button on:click={dialog.close}><X size={20} /></button>
              </div>
              <!-- Content -->
              <div class="mt-4">
                <p use:dialog.description>Optional description.</p>
                <!-- Form elements, buttons, etc. -->
              </div>
              <!-- Action Buttons -->
              <div class="mt-6 flex justify-end">
                <button on:click={dialog.close}>Cancel</button>
                <button on:click={() => { /* action */ dialog.close(); }}>Confirm</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    {/if}
    ```
4.  **Triggering:**
    ```html
    <button on:click={dialog.open}>Open Dialog</button>
    ```
5.  **Parent-Controlled Dialog Component (`ChildDialog.svelte`):**
    ```javascript
    // ChildDialog.svelte script
    import { createEventDispatcher, onMount, onDestroy } from 'svelte';
    import { createDialog } from 'svelte-headlessui';

    export let openModal = false; // Controlled by parent
    const dispatch = createEventDispatcher<{ close: void }>();
    const dialog = createDialog({ label: 'Child Dialog' });

    // Sync with parent prop
    $: if (openModal && !$dialog.expanded) {
      dialog.open();
    } else if (!openModal && $dialog.expanded) {
      // This case might be handled if parent always sets openModal=false on 'close'
      dialog.close();
    }

    // Notify parent if dialog closes internally
    let unsubscribe;
    onMount(() => {
      unsubscribe = dialog.subscribe(isExpanded => {
        if (!isExpanded && openModal) { // Check openModal to ensure it was an internal close
          dispatch('close');
        }
      });
    });
    onDestroy(() => unsubscribe && unsubscribe());

    function internalCloseTrigger() {
        dialog.close(); // This will trigger the subscription above
    }
    ```
    Parent usage:
    ```html
    <script>
      let showChildDialog = false;
    </script>
    <button on:click={() => showChildDialog = true}>Show Child Dialog</button>
    <ChildDialog bind:openModal={showChildDialog} on:close={() => showChildDialog = false} />
    ```
    *Correction*: A simpler way for parent-controlled dialogs is to let the child dispatch 'close' and the parent updates `openModal`. The child can directly use `dialog.close()` for its internal close actions. The `dialog.expanded.subscribe` logic in the child is key for notifying the parent when `svelte-headlessui` closes the dialog (e.g., Escape key, backdrop click).

### Files Modified:
```
.
└── src
    └── components
        ├── ChannelSettings.svelte
        ├── CurrentUser.svelte
        ├── MainView.svelte
        └── MessageItem.svelte
```

### Reflection & Outcomes:
This round successfully refactored the User Profile and Channel Settings popups into first-class dialogs using `svelte-headlessui`, aligning with the project's goal for improved UI consistency and accessibility. The process involved clarifying requirements, correcting initial misunderstandings, and adopting existing codebase patterns. Key learning involved the detailed mechanics of controlling `svelte-headlessui` dialogs, especially when managed by a parent component.

### Retrospective:
-   **What went well:**
    *   Rapid adoption of the `svelte-headlessui` pattern once identified.
    *   Successful refactoring of two complex UI components.
    *   Effective resolution of subsequent lint and accessibility issues.
    *   Clear communication from the user helped steer corrections.
-   **What could be improved:**
    *   Initial requirement interpretation: A more cautious approach or seeking immediate clarification on terms like "first-class dialogs everywhere" could save time.
    *   Proactive codebase exploration: I should more actively look for existing UI patterns or component libraries within the project before proposing new solutions.
-   **Action Items:**
    *   For future UI tasks, explicitly ask if similar patterns exist elsewhere in the project.
    *   When encountering ambiguous terms, request specific examples or component names.
```

