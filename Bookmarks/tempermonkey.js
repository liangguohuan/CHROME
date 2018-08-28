// ==UserScript==
// @name         Add Fav To Localhost
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        *://*/*
// @grant        GM_xmlhttpRequest
// ==/UserScript==

function addToFav(ele) {
    var src = $(ele).parent().find('img').prop('src');
    var title = $(ele).parent().find('img').prop('alt');
    var href = $(ele).parent().prop('href');
    var datastr = "act=new&title=" + encodeURIComponent(title) + "&href= " + href + "&src=" + src;
    console.log(datastr);
    GM_xmlhttpRequest({
        headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
        method: 'POST',
        data: datastr,
        url: 'http://bookmarks.web/act.php',
        onload: function (res) {
            if (res.status == 200) {
                $(ele).unbind("click");
            }
        },
        onerror: function (err) {
            console.log(err);
        }
    });
}

function replaceFavBtnClick() {
    $('div[class$="-item"]').each(function (i, item) {
        $(item).find('div[class$="-fav"]').on('click', function (e) { addToFav(this) });
    });
}

function moreListener() {
    $(document).ajaxSuccess(function() {
        replaceFavBtnClick();
    });
}

function successedMsg() {
    var title = $('title').text();
    title += " — Successed"
    $('title').text(title);
}

(function () {
    'use strict';
    replaceFavBtnClick();
    moreListener();
    successedMsg();
    // Your code here...
})();