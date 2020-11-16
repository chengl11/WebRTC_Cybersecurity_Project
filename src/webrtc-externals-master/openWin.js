
function openWin(data) {
    // console.log("data:", data);
    // var screenAvailWidth = window.screen.availWidth;
    // var screenAvailHeight = window.screen.availHeight;
    // var iHeight = 10;
    // var iWidth = 40;
    // var iTop = (screenAvailHeight-iHeight) / 2;
    // var iLeft = (screenAvailWidth-iWidth) / 2;
    
    // // window.open ("dialog.html", "newwindow", "height=100, width=400, top=100,\
    // //  left=1300, toolbar=no, menubar=no, scrollbars=no, resizable=no, location=no, status=no");

    chrome.tabs.create({
        url: chrome.extension.getURL('dialog.html'),
        active: false
    }, function(tab) {
        // After the tab has been created, open a window to inject the tab
        chrome.windows.create({
            tabId: tab.id,
            type: 'popup',
            focused: true
            // incognito, top, left, ...
        });
    });
}