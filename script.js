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
    var comment_contents = this.parentElement.parentElement.parentElement.parentElement.parentElement.querySelectorAll(".ak-renderer-wrapper");
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
var comment_time_links = document.querySelectorAll('[href*="comment"]');

// Inject script to list click event when user clicks on timestamp of comment
for (var i = 0; i < comment_time_links.length; i++) {
    comment_time_links[i].addEventListener(
        "click",
        commentDisplayToggle,
        false);
}

// Auto hide comments 
chrome.storage.sync.get(
    { num_comments: 1 },
    (items) => {
        const keep_num_comments = items.num_comments;
        console.log("number comment to keep: ", keep_num_comments);
        for (var i = 0; i < comment_time_links.length - keep_num_comments; i++) {
            var item = comment_time_links[i];
            var comment_contents = item.parentElement.parentElement.parentElement.parentElement.parentElement.querySelectorAll(".ak-renderer-wrapper");
            for (var j = 0; j < comment_contents.length; j++) {
                comment_contents[j].style.display = 'none';
            }
        }
    }
);
