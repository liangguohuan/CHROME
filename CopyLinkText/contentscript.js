
var clickedElement = null;

document.addEventListener('mousedown', function (e) {
    var rightMouseButton = 2;
    if (e.button == rightMouseButton) {
        clickedElement = e.target;
    }
});

chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        if (request.message == "CopyLinkText")
            sendResponse(clickedElement.outerHTML);
    });