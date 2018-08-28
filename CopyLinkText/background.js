
function genericOnClick(info, tab) {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, {message: "CopyLinkText"}, function(response) {
      // console.log(response);
      var container = document.getElementById('container')
      container.innerHTML = response;
      copyElementToClipboard(container.childNodes[0]);
    });
  });  
}

function copyElementToClipboard(element) {
  var textRange = document.createRange();
  textRange.setStart(element, 0);
  textRange.setEndAfter(element, -1);
  
  var selection = window.getSelection();
  selection.removeAllRanges();
  selection.addRange(textRange);
  
  document.execCommand('Copy');
}

chrome.contextMenus.create({
	"title" : "A Copy Link Text",
	"contexts" : [ "link" ],
	"onclick" : genericOnClick
});
