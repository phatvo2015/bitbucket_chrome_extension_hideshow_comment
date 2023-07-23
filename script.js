//----------------------------
// Helper Functions
//---------------------------- 

function showElement(element) {
    element.style.display = 'block';
}
function hideElement(element) {
    element.style.display = 'none';
}

function commentDisplayToggle() {
    var comment_card = this.parentElement.parentElement.parentElement;
    var comment_contents = comment_card.querySelectorAll(".ak-renderer-wrapper");
    var first_content_display_status = comment_contents[0].style.display;
    for (var j = 0; j < comment_contents.length; j++) {
        if (first_content_display_status == "block") {
            hideElement(comment_contents[j]);
        } else {
            showElement(comment_contents[j]);
        }
    }
}


// Main program
var conversation_blocks = document.querySelectorAll('section[data-qa="conversations-global-style"] div[style*="header"]');

// Inject script to list click event when user clicks on timestamp of comment
for (var i = 0; i < conversation_blocks.length; i++) {

    var timestamps = conversation_blocks[i].querySelectorAll('a[href*="comment"]');
    for (var j = 0; j < timestamps.length; j++) {
        timestamps[j].addEventListener(
            "click",
            commentDisplayToggle,
            false);
    }

}

///////////////////////
// Auto hide comments 
//////////////////////

// Unhide all comments
for (var i = 0; i < conversation_blocks.length; i++) {
    var item = conversation_blocks[i];
    var comment_contents = item.querySelectorAll(".ak-renderer-wrapper");
    for (var j = 0; j < comment_contents.length; j++) {
        comment_contents[j].style.display = 'block';
    }
}

// Start hiding
chrome.storage.sync.get(
    { num_comments: 1 },
    (items) => {
        const keep_num_comments = items.num_comments;
        console.log("number comment to keep: ", keep_num_comments);
        console.log('number of conversation: ', conversation_blocks.length);
        for (var i = 0; i < conversation_blocks.length - keep_num_comments; i++) {
            var item = conversation_blocks[i];
            var comment_contents = item.querySelectorAll(".ak-renderer-wrapper");
            for (var j = 0; j < comment_contents.length; j++) {
                comment_contents[j].style.display = 'none';
            }
        }
    }
);
