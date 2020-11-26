if (typeof browser === 'undefined') {
    browser = chrome;
}
openBackgroundPageWithCheck = function() {
    browser.tabs.query(
        {},  // 空匹配规则. Use empty matching rule to "select" all the tabs
        tabs=>{
            // 如果每个tab的URL都不是Externals的URL 打开Externals
            // check if some page's URL matches Externals' URL, if not, open Externals
            if (tabs.every(tab => tab.url != browser.extension.getURL('background.html'))) {
                browser.tabs.create({
                    'url': browser.extension.getURL('background.html'),
                    pinned: true,
                    active: false
                });
            }
        }
    )
}
browser.browserAction.onClicked.addListener(function() {  // onClicked
    openBackgroundPageWithCheck();
});

browser.runtime.onConnect.addListener(function () {  // trigger onConnect(= one page is opened) 页面打开时触发
    openBackgroundPageWithCheck();
});

browser.tabs.onRemoved.addListener(()=>{  // trigger when a page is removed
    browser.tabs.query(
        {},  
        tabs => {
            // check if there is only one page and it is background page, if so, close it.
            if (tabs.length == 1 &&
                tabs[0].url == browser.extension.getURL('background.html')) {
                browser.tabs.remove(tabs[0].id);
            }
        }
    )
})