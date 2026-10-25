//----------------------------
// Helper Functions
//----------------------------

function commentDisplayToggle(event) {
    if (!(event.target instanceof Element)) return;

    const link = event.target.closest('a[href*="comment"]');
    if (!link) return;

    // Only timestamps inside the PR activity list were wired up originally.
    if (!link.closest('div[data-qa="pull-request-overview-activity-content"]')) return;

    // Walk 4 levels up from the timestamp to the comment card.
    let card = link;
    for (let depth = 0; depth < 4 && card; depth++) {
        card = card.parentElement;
    }
    if (!card) return;

    const commentContents = card.querySelectorAll('.is-comment');
    if (commentContents.length === 0) return;

    const hide = commentContents[0].style.display === 'block';
    for (const element of commentContents) {
        element.style.display = hide ? 'none' : 'block';
    }
}

function insertCopyButtons(conversationBlocks) {
    for (const block of conversationBlocks) {
        const commentButtons = block.querySelectorAll('button');
        for (const button of commentButtons) {
            if (button.textContent !== 'Like') continue;

            const container = button.parentElement.parentElement.parentElement;
            if (!container) continue;

            // Skip when a copy button is already there. Re-check the live DOM on
            // repeat runs in case Bitbucket re-rendered the container's children.
            if (container.dataset.copyButtonAdded &&
                container.querySelector('button[extension-custom-created="true"]')) {
                continue;
            }

            const template = button.parentElement.parentElement.querySelector('span');
            const templateButton = template?.querySelector('button');
            if (!templateButton) continue;

            const copyButtonDiv = template.cloneNode(true);
            const copyButton = copyButtonDiv.querySelector('button');
            copyButton.textContent = '! Copy to clipboard';
            copyButton.setAttribute('extension-custom-created', 'true');

            copyButton.onclick = function () {
                const commentContainer = this.parentElement?.parentElement?.parentElement?.parentElement;
                const textElement = commentContainer?.querySelector('div[class*="is-comment"]');
                if (!textElement) return;

                navigator.clipboard.writeText(textElement.textContent)
                    .then(() => console.log('Comment copied to clipboard: ' + textElement.textContent))
                    .catch((error) => console.error('Failed to copy comment: ', error));
            };

            button.insertAdjacentElement('afterEnd', copyButtonDiv);
            container.dataset.copyButtonAdded = 'true';
        }
    }
}

function collectConversationBlocks() {
    return Array.from(
        document.querySelectorAll('div[data-qa="pull-request-overview-activity-content"]')
    );
}

function collectCommentWrappers(conversationBlocks) {
    const wrappers = [];
    for (const block of conversationBlocks) {
        wrappers.push(...block.querySelectorAll('.ak-renderer-wrapper'));
    }
    return wrappers;
}

function applyCommentVisibility(conversationBlocks) {
    chrome.storage.sync.get(
        { num_comments: 1 },
        (items) => {
            const parsedKeep = parseInt(items.num_comments, 10);
            const keep = Number.isNaN(parsedKeep) || parsedKeep < 0 ? 1 : parsedKeep;
            const cutoff = conversationBlocks.length - keep;

            // Set the final state in a single pass instead of showing everything
            // first and hiding most of it afterwards.
            conversationBlocks.forEach((block, index) => {
                const display = index < cutoff ? 'none' : 'block';
                block.querySelectorAll('.ak-renderer-wrapper').forEach((element) => {
                    element.style.display = display;
                });
            });
        }
    );
}

function watchForNewComments(initialBlocks) {
    const existingState = window.__prCommentWatchState;

    // A manual re-injection refreshes the baselines but keeps the single observer.
    if (existingState) {
        existingState.lastBlocks = initialBlocks;
        existingState.lastWrappers = collectCommentWrappers(initialBlocks);
        return;
    }

    const state = {
        lastBlocks: initialBlocks,
        lastWrappers: collectCommentWrappers(initialBlocks),
        scheduled: false
    };
    window.__prCommentWatchState = state;

    function sync() {
        state.scheduled = false;

        const currentBlocks = collectConversationBlocks();
        const currentWrappers = collectCommentWrappers(currentBlocks);
        const unchanged =
            currentBlocks.length === state.lastBlocks.length &&
            currentWrappers.length === state.lastWrappers.length &&
            currentBlocks.every((block, index) => block === state.lastBlocks[index]) &&
            currentWrappers.every((wrapper, index) => wrapper === state.lastWrappers[index]);

        // Ignore unrelated churn (tooltips, re-rendered timestamps, our own
        // copy-button insertions) so manual show/hide choices are preserved.
        if (unchanged) return;

        state.lastBlocks = currentBlocks;
        state.lastWrappers = currentWrappers;
        insertCopyButtons(currentBlocks);
        applyCommentVisibility(currentBlocks);
    }

    // Observe childList only: our inline style writes are attribute mutations
    // and therefore cannot retrigger the observer.
    new MutationObserver(() => {
        if (state.scheduled) return;
        state.scheduled = true;
        setTimeout(sync, 250);
    }).observe(document.documentElement, { childList: true, subtree: true });
}

//----------------------------
// Main program
//----------------------------

// IIFE: executeScript re-runs this file on every toolbar click, and top-level
// const/let declarations would throw "already declared" on the second run.
(() => {
    const conversationBlocks = collectConversationBlocks();

    insertCopyButtons(conversationBlocks);

    // Delegated listener: bound once per page no matter how often this file is
    // re-injected, and it also covers timestamps rendered after injection.
    if (!window.__prCommentToggleBound) {
        window.__prCommentToggleBound = true;
        document.addEventListener('click', commentDisplayToggle, false);
    }

    applyCommentVisibility(conversationBlocks);
    watchForNewComments(conversationBlocks);
})();
