if (typeof browser === 'undefined') {
  browser = chrome;
}
// remember the current choice
window.addEventListener('DOMContentLoaded', () => {
  // get current choice in storage. if not setted, the default is 'onConnect'
  browser.storage.local.get(['activate'], function(result) {
    checkedbtn = document.getElementById(result.activate || 'onConnect');
    checkedbtn.checked = true;
  });
});