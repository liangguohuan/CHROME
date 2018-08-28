var xmlhttp; // global
var surl = 'http://bookmarks.web/act.php';

function sendRequest(method, url, isAsyns, params, action) {
	if (window.XMLHttpRequest) {// code for IE7+, Firefox, Chrome, Opera, Safari
		xmlhttp = new XMLHttpRequest();
	} else {// code for IE6, IE5
		xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
	}
	xmlhttp.open(method, url, isAsyns);
	xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
	xmlhttp.send(params);
	xmlhttp.onreadystatechange = action;
}

function getTitle(content) {
	var re_title = new RegExp("<title>[\n\r\s]*(.*)[\n\r\s]*</title>", "gmi");
	var title = re_title.exec(content);
	if (title == null) return '';
	return title[1];
}

function doPost(info) {
	var data = 'act=new&href=' + info.linkUrl + '&src=' + info.srcUrl + '&title=' + encodeURIComponent(info.title);
	sendRequest('POST', surl, true, data, null);
}

function genericOnClick(info, tab) {
	info.title = "";

	// get title via message
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
		chrome.tabs.sendMessage(tabs[0].id, {message: "GetTitle"}, function(response) {
			if (response !== "") {
				// console.log("do post via message");
				info.title = response;
				doPost(info);
			} else {
				// console.log("do post via xhr");
				sendRequest('GET', info.linkUrl, true, null, function() {
					if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
						info.title = getTitle(xmlhttp.responseText);
						doPost(info);
					}
				});
			}
		});
	  });
}

chrome.contextMenus.create({
	"title" : "A Bookmarks For Image Link",
	"contexts" : [ "link" ],
	"onclick" : genericOnClick
});
