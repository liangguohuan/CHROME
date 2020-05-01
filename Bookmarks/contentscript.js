var detail = {};

document.addEventListener('mousedown', function (e) {
    var rightMouseButton = 2;
    if (e.button == rightMouseButton) {
        if (e.target.tagName == 'VIDEO') {
            detail.title = e.target.parentElement.parentElement.querySelector('img').alt; 
            detail.srcUrl = e.target.parentElement.parentElement.querySelector('img').src; 
        } else {
            var alt = e.target.getAttribute("alt");
            var title = e.target.getAttribute("title");
            if (title !== null) {
                linkTitle = title
            } else if (alt !== null) {
                linkTitle = alt
            }
            detail.title = linkTitle
        }
    }
});

chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        if (request.message == "detail")
            sendResponse(detail);
    });
