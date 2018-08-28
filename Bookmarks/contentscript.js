var linkTitle = "";

document.addEventListener('mousedown', function (e) {
    var rightMouseButton = 2;
    if (e.button == rightMouseButton) {
		var alt = e.target.getAttribute("alt");
		var title = e.target.getAttribute("title");
		if (title !== null) {
			linkTitle = title
		} else if (alt !== null) {
			linkTitle = alt
		}
    }
});

chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        if (request.message == "GetTitle")
            sendResponse(linkTitle);
    });