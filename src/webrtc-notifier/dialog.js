
var continueButton = window.document.getElementById("continue-button");

continueButton.addEventListener("click", closeWin);
function closeWin() {
    window.close();
}

// function changePosition() {
//     var screenAvailWidth = window.screen.availWidth;
//     var screenAvailHeight = window.screen.availHeight;
//     var iHeight = 400;
//     var iWidth = 400;
//     var iTop = (screenAvailHeight - iHeight) / 2;
//     var iLeft = (screenAvailWidth - iWidth) / 2;

//     window.resizeTo(iHeight,iWidth);
//     window.moveTo(iLeft,iTop);
// }
// changePosition();

document.querySelector('#block-button').addEventListener('click',()=>{
    var urls = []
    if (window.url_to_block === undefined) return;
    chrome.storage.local.get(['webrtcblocklist'], data => {
        console.log("fetched data from storage: ",data);
        if (data['webrtcblocklist'] === undefined) {
            chrome.storage.local.set({webrtcblocklist:[]});
        } else {
            urls = data['webrtcblocklist'];
        }
        console.log("url to block",window.url_to_block);
        if (urls.every(ele=>ele !== window.url_to_block))
            urls.push(window.url_to_block);
        console.log("urls:", urls)
        chrome.storage.local.set({webrtcblocklist:urls});
    })
})