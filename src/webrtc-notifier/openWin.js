
function openWin(data) {
    // console.log("data:", data);
    var screenAvailWidth = window.screen.availWidth;
    var screenAvailHeight = window.screen.availHeight;
    var iHeight = 400;
    var iWidth = 500;
    var iTop = (screenAvailHeight-iHeight) / 2;
    var iLeft = (screenAvailWidth-iWidth) / 2;
    
    var dialog = window.open ('dialog.html', 'newwindow', 'height='+iHeight+', width='+iWidth+', top='+iTop+',\
     left='+iLeft+', toolbar=no, menubar=no, scrollbars=no, resizable=no, location=no, status=no');
    if (data != "GetUserMedia Requests" && data != "[GetUserMedia Requests]") {
        fetched_url = data.split(' ')[0]
        if (!fetched_url.startsWith('http')) {
            fetched_url = 'https://'+fetched_url;
        }
        dialog.url_to_block = new URL(fetched_url).hostname;
    }
    // chrome.tabs.create({
    //     url: chrome.extension.getURL('dialog.html'),
    //     // url: 'chrome://webrtc-internals/',
    //     active: false
    // }, function(tab) {
    //     // After the tab has been created, open a window to inject the tab
    //     chrome.windows.create({
    //         tabId: tab.id,
    //         type: 'popup',
    //         focused: true
    //         // incognito, top, left, ...
    //     });
    // });
}