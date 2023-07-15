//----------------------------
// Helper Functions
//---------------------------- 

function toggleDisplayElement(element) {
    if (element.style.display == 'block') {
        element.style.display = 'none';
    } else {
        element.style.display = 'block';
    }
}

function hide() {
    var comment_contents = this.parentElement.parentElement.parentElement.parentElement.parentElement.querySelectorAll(".ak-renderer-wrapper");
    for (var j = 0; j < comment_contents.length; j++) {
        toggleDisplayElement(comment_contents[j]);
    }
}


// Main program
var comment_time_links = document.querySelectorAll('[href*="comment"]');

for (var i = 0; i < comment_time_links.length; i++) {
    comment_time_links[i].addEventListener(
        "click",
        hide,
        false);
}
