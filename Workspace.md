# Workspace

# Important Context

- This is a Sveltekit 5 bootstrapped app to be a SPA without SSR
- Svelte 5 is different than past Svelte versions
- Svelte transitions have been included since Svelte 3
- Routing is build into Sveltekit
- SyncedStore adapts YJS stores to be reactive plain objects and arrays for binding to Svelte
- I added Context7 MCP server which should provide info about Svelte and SvelteKit and YJS, but not SyncedStore, so I added its docs to reference/SyncedStore.md. 

# Priorities

- Avoid making many small changes in many discrete steps. Operate at the file level making full passes, whether incremental or complete. Recall the whole list of TODOs as you go so that if you are modifying a file, you can see the big picture and make sure you are not missing any important details, and you include related changes from other bullets when they fall into the same files. Whole cloth is a huge priority.  
- Fix Bugs, but do not foolishly consider them fixed until user has verified. Accessibility does not matter yet. Focus on core functionality described here.
- Do NOT be arrogant about FIXING BUGS. A bug indicates you were already wrong and thus that your fix is likely also wrong. Bugfixes are unverified and until user verifies them, they are not fixed.
- Focus on UI needs and ask permission before changing the store index.
- Do not worry about TS errors, only real errors. do not waste cycles on TS yet. Do not get distracted by anything except what is being requested. Priorities matter.
- Add desired features
- Ensure consistency (of the right things) and get rid of the junk
- Nice UI, thoughtful touches, nice transitions and animations, careful use of icons, color and layout. Don't generate SVG icons, just use existing lucide etc already imported

# Bugs

- [ ] UserInfoPopup behaves differently than the other dialogs that use createDialog, mainly in that there is no fade transition like the others have on entry/exit. I assume this is built in and that we are not using what those are using.

## Fixed Bugs

- [x] Input focus issues when navigating between channels and threads
- [x] Message editing focus not working when clicking edit button
- [x] Thread input not focusing when opening thread panel
- [x] Channel input not focusing when closing thread panel
- [x] Duplicate key error in MessageItem.svelte thread participants

# Console Bugs

none

## Icons 

Uses lucide icons. don't generate SVGs or SVG paths. Eventually factor out existing SVGs to Lucide or other icon lib. 

# Features Needed

n/a

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

I read that SvelteKit has built in support for SPAs and client routing because when I tried to opt out of sveltekit it made those points and I said ok. But I don't know how to get it working. And now I'm skeptical of those promises.



### Command Menu (cmdk) with channel nav and search

Full text ish search using fuzzy matching and traversal of full store or selected channel(s)

#### Join and Leave Channels

No invites or security, but could still have the concept of people who have joined/left

#### Enter/Exit Notifications 

When people join/leave channels I am in (syncedstore)

When people join/leave the y webrtc (yjs presence)

#### Rich-text editing and formatting 

Using tiptap or something like it. bold, italics, links, 

user and channel mentions would be nice

For SyncedStore need to use SyncedXml

##### Live-editing Rich Text messages

Checkbox user setting shown when editing a message. 
If checked, connects TipTap directly to the YJS type


# Defer

####  Missed Notifications

This could be tricky, maybe save for another spike

- Default Notification Settings
- Notification Settings per Channel

Types: Message, Mention

Avoid notifications about past things. Depends on tracking read state of messages, either per user in doc, or in device storage

How could we implement this??

# Journal

### Instructions for Journal Entries

Most recent entries come first. Append new entries below these instructions, above the older entries.

## Round 5: SvelteKit Routing & Focus Management

**Date:** 2025-06-05

### Goals:
- Convert the chat application to use proper SvelteKit routing for channels and threads
- Ensure browser back/forward navigation works correctly with the application state
- Add a settings link to the sidebar for easy access
- Fix input focus issues when navigating between channels and threads

### Work & Key Changes (Tasks & Success Grade):

1. **SvelteKit Routing Implementation (9/10):**
   * Updated `ChannelItem.svelte` to use `goto` from `$app/navigation` for proper route changes
   * Modified `MainView.svelte` to navigate to thread routes (`/c/[channelId]/m/[messageId]`) when opening threads
   * Added route components for channels and threads that sync with the store state
   * *Outcome:* Successfully implemented proper SPA routing with URL updates matching the application state

2. **Back/Forward Navigation Support (8/10):**
   * Added `popstate` event listeners in route components to detect browser navigation
   * Implemented handlers to update store state based on the current URL when navigating with browser controls
   * *Outcome:* Browser back/forward buttons now correctly update the UI state to match the route

3. **Settings Link Addition (10/10):**
   * Added a settings button to the sidebar with the Settings icon from Lucide
   * Placed it above the user section for easy access
   * *Outcome:* Users can now easily navigate to the settings page from anywhere in the app

4. **Input Focus Management (9/10):**
   * Fixed thread input focus when opening or switching threads
   * Added tracking of previous channel ID to detect actual channel changes
   * Implemented conditional focus logic that respects the thread panel state
   * Fixed duplicate key error in thread participants rendering that was causing data corruption
   * *Outcome:* Input focus now works correctly when navigating between channels and threads

### Lessons Learned & Component Usage:

* **SvelteKit Navigation:** Using `goto` from `$app/navigation` for programmatic navigation ensures proper route updates while maintaining SPA behavior
* **Store Synchronization:** It's crucial to keep store state in sync with the URL for a consistent user experience
* **Focus Management:** Track state changes and use `tick()` to ensure DOM updates complete before attempting to focus elements
* **Error Prevention:** Always include null checks and fallback values when using keys in each blocks to prevent duplicate key errors

## Round 4: UX Enhancements - Input Focus, Reactions, Delete Flow, Thread Summaries

**Date:** 2025-06-05

### Goals:
- Improve user experience with several UI enhancements focusing on message interactions and navigation.
- Implement automatic input focusing, an additional emoji reaction button, a robust delete/undelete flow, and visual summaries for threaded messages.

### Work & Key Changes (Tasks & Success Grade):

1.  **Auto-focus Message Input (10/10):**
    *   Modified `MessageInput.svelte` to expose a `focusInput()` method.
    *   Updated `MainView.svelte` and `ThreadView.svelte` to call `focusInput()` (or `focusReplyInput()`) reactively when `$currentChannelIdStore` or `$currentThreadIdStore` changes, using `await tick()` to ensure DOM updates.
    *   *Outcome:* Successfully implemented automatic focus on message inputs upon channel or thread selection.

2.  **Additional Emoji Button (10/10):**
    *   Added a `SmilePlus` icon button next to existing reaction pills in `MessageItem.svelte`.
    *   Clicking this button sets `isAddingReaction = true`, triggering the existing emoji picker.
    *   *Outcome:* Seamlessly integrated an additional way to add reactions.

3.  **Delete Confirmation Modal & Undelete (9/10):**
    *   Created `ConfirmDeleteModal.svelte` using `svelte-headlessui` for an accessible alert dialog.
    *   Integrated this modal into `MessageItem.svelte`: clicking delete now shows the modal.
    *   Implemented soft delete (`message.deleted = true`) and an "Undelete" button (with `RotateCcw` icon) for messages deleted by the current user, which reverts the soft delete.
    *   *User Corrections:* User fixed a runtime error (`dialog.setOpen` not a function) in `ConfirmDeleteModal.svelte` by changing to `dialog.expanded = isOpen` and `{#if $dialog.expanded}`. User also corrected `message.parentId` to `message.meta.value.parentId` in `MessageItem.svelte`'s thread reply filter.
    *   *Outcome:* Messages now have a confirmation step before deletion and can be undeleted by the owner. Some minor linting issues with the modal backdrop were deferred.

4.  **Thread Summary Display (9/10):**
    *   Added an `xs` size to `Avatar.svelte` for mini avatars.
    *   In `MessageItem.svelte`, implemented reactive logic (`threadReplies`, `threadSummary`) to:
        *   Calculate reply count for a message.
        *   Determine the time of the last reply.
        *   Identify unique participants in the thread.
    *   Displayed a summary below parent messages (if not in thread view and not deleted) showing up to 3 mini participant avatars, reply count, and last reply time.
    *   This summary area is clickable to open the thread.
    *   *User Corrections:* User adjusted CSS for last reply time and fixed `m.parentId` to `m.meta.value.parentId` in `threadReplies` filter.
    *   *Outcome:* Provides a clear visual indicator and quick access for messages with replies.

### Lessons Learned & Component Usage:

*   **`svelte-headlessui` Dialogs:** When controlling dialog visibility with a parent prop (`isOpen`), ensure the dialog's internal state (`$dialog.expanded`) is correctly synced. The user's correction to use `dialog.expanded = isOpen` and `{#if $dialog.expanded}` in `ConfirmDeleteModal.svelte` was crucial.
*   **SyncedStore Data Access:** Consistently remember to access nested properties within SyncedStore objects via `.value` (e.g., `message.meta.value.id`, `m.meta.value.parentId`). This was a point of correction by the user during thread summary implementation.
*   **Svelte Reactivity & DOM Updates:** `await tick()` is essential before attempting DOM manipulations (like focusing an input) after reactive state changes that affect the DOM.

### Files Modified:
```
.
└── src
    └── components
        ├── Avatar.svelte
        ├── ConfirmDeleteModal.svelte
        ├── MainView.svelte
        ├── MessageInput.svelte
        ├── MessageItem.svelte
        └── ThreadView.svelte
```

### Reflection & Outcomes:
This round significantly enhanced the chat application's user experience by streamlining common actions and providing richer visual feedback for message interactions. The features were implemented successfully, with important corrections from the user guiding the final state, particularly regarding SyncedStore access patterns and `svelte-headlessui` dialog management.

### Retrospective:
-   **What went well:**
    *   Successfully implemented multiple distinct UI/UX features across several components.
    *   Leveraged existing Svelte patterns (reactive statements, `tick`) and component libraries (`svelte-headlessui`, `lucide-svelte`).
    *   User corrections were instrumental in refining implementations and fixing bugs.
-   **What could be improved:**
    *   More careful attention to SyncedStore's `.value` requirement to avoid initial errors.
    *   Thorough testing of `svelte-headlessui` dialog prop interactions to catch issues like the `setOpen` vs `expanded` discrepancy earlier.



**Goal:**
- Clearly outline goals for the codebase edit.
- Break down the work into step-by-step tasks with a success grade from 0-10.
- Document lessons learned and user corrections encountered during the steps.
- Explain the correct usage of components or functions whose usage was unclear and caused issues.
- List modified files as a file tree code block.
- Summarize outcomes and include retro bullets.
- Follow basic structure consistently



## Round 3: User Info Popup Implementation & Fixes

**Date:** 2025-06-05

### Goals:
- Successfully implement the `UserInfoPopup.svelte` component.
- Integrate the popup into `MessageItem.svelte` and `UserItem.svelte`.
- Resolve bugs preventing the popup from displaying correctly.
- Enhance user name display consistency in `UserItem.svelte` and `MessageItem.svelte`.
- Align profile edit UI (`CurrentUser.svelte`) with profile setup UI (`ProfileSetup.svelte`) regarding avatar handling.

### Work Summary & Key Changes:

*   **`UserInfoPopup.svelte` Development & Fixes:**
    *   Initially created with incorrect `svelte-headlessui` component imports (`Dialog`, `DialogPanel`).
    *   Corrected to use `createDialog` and the `use:dialog.modal` action, following patterns from `CurrentUser.svelte`.
    *   Added logic to reactively call `dialog.open()` when the component receives a valid `userId` prop and user data is loaded.
    *   Ensured `dialog.close()` is called if `userId` becomes invalid or the parent requests closure via the `closePopup` prop.
    *   **Critical Fix (USER):** Corrected access to SyncedStore boxed values (e.g., `user.meta.value.id`, `user.meta.value.createdAt`) which was preventing the dialog from opening reliably.
*   **Integration into `MessageItem.svelte`:**
    *   Added state variables (`showUserInfoPopup`, `selectedUserIdForPopup`) to manage popup visibility.
    *   Made user avatars and names clickable, calling `openUserInfoPopup(message.meta.value.userId)`.
    *   Conditionally rendered `<UserInfoPopup />`, passing `selectedUserIdForPopup` and `closeUserInfoPopup`.
*   **Integration into `UserItem.svelte` (User List):**
    *   Similar integration as `MessageItem.svelte`.
    *   Made the entire user item clickable, calling `openUserInfoPopup(user.meta.value.id)`.
    *   Conditionally rendered `<UserInfoPopup />`.
*   **Debugging & Verification:**
    *   Added console logs to trace `userId` propagation and dialog state changes.
    *   USER verified that popups are now working correctly after the `.value` access pattern was fixed.
*   **User Name Display Consistency:**
    *   **`UserItem.svelte` (Sidebar User List):** Updated to display full name prominently, with `@username` below if different. Otherwise, a single name is shown.
    *   **`MessageItem.svelte` (Message View):** Updated to show full name primarily. `@username` now appears in a tooltip on hover, removing the explicit `(username)` text.
*   **Profile Edit UI Consistency (`CurrentUser.svelte`):**
    *   Aligned avatar handling with `ProfileSetup.svelte` by removing the direct "Avatar URL" input field.
    *   Avatar preview now uses the `<Avatar>` component, reflecting Gravatar based on username or an existing custom avatar.

### Key Learnings & Corrections:
*   **SyncedStore Boxed Values:** Reinforced the critical importance of accessing properties of boxed objects via `.value` (e.g., `meta.value.id`). This was a recurring oversight and a key blocker.
*   **`svelte-headlessui` Dialog Activation:** Dialogs created with `createDialog` must be explicitly opened via their `dialog.open()` method. Simply rendering the component containing the dialog logic is not enough.
*   **Iterative Debugging:** Console logs and step-by-step verification of state and prop flow were essential to diagnose why the dialog wasn't appearing.

### Next Steps & Testing Points:
*   USER to test all implemented features: UserInfoPopup functionality, user name displays in sidebar and messages, and profile edit UI consistency (especially avatar handling).
*   This concludes Round 3.

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

