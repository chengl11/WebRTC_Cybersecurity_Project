if (typeof browser === 'undefined') {
    browser = chrome;
}

browser.runtime.onInstalled.addListener(() => {
    // when installed, open options
    browser.tabs.create({ url: "instructions.html" });
});

openBackgroundPageWithCheck = () => {
    browser.tabs.query(
        {currentWindow: true},  // 匹配规则当前window下所有标签. match all the tabs in the current window
        tabs => {
            // 如果每个tab的URL都不是Externals的URL 打开 Detail page
            // check if some page's URL matches Externals' URL, if not, open Detail page
            if (tabs.every(tab => tab.url != browser.extension.getURL('background.html'))) {
                browser.tabs.create({
                    'url': browser.extension.getURL('background.html'),
                    index: 0,
                    // pinned: true,
                    active: false
                });
            }
        }
    );
}
var FIELD = {'activate':'onConnect'};  // default settings
browser.storage.local.get(['activate'], function(result) {
    FIELD['activate'] = result.activate || 'onConnect';
});

browser.runtime.onMessage.addListener(data => {
    console.log('received message:',data);
    if (typeof data !== "undefined" && data['from'] === 'notifierOptions') {
        if (typeof data['option'] !== 'undefined') {
            FIELD[data['option']] = data['choice'];
        }
    }
});

browser.browserAction.onClicked.addListener(function() {  // onClicked
    if (FIELD['activate'] === 'onClick') {
        openBackgroundPageWithCheck();
    }
});

browser.runtime.onConnect.addListener(function () {  // trigger onConnect(= one page is opened) 页面打开时触发
    if (FIELD['activate'] === 'onConnect') {
        openBackgroundPageWithCheck();
    }
});

browser.tabs.onRemoved.addListener(()=>{  // trigger when a page is removed
    browser.tabs.query(
        {currentWindow: true},  // 匹配规则当前window下所有标签. match all the tabs in the current window
        tabs => {
            // check if there is only one page and it is background page, if so, close it.
            if (tabs.length == 1 &&
                tabs[0].url == browser.extension.getURL('background.html')) {
                browser.tabs.remove(tabs[0].id);
            }
        }
    )
})